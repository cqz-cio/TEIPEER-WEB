#!/usr/bin/env bash
# Cloud runner -> incremental SSH/rsync -> existing server activation helper.
set -Eeuo pipefail

BUILD_DIR="${1:?Usage: deploy-cloud.sh BUILD_DIR}"
: "${RELEASE_ID:?RELEASE_ID is required}"
: "${SSH_KEY:?SSH_KEY is required}"
: "${SSH_KNOWN_HOSTS:?SSH_KNOWN_HOSTS is required}"
[[ "$RELEASE_ID" =~ ^[0-9a-f]{40}-[0-9]+$ ]] || { echo 'Invalid release ID' >&2; exit 1; }
[[ -s "$BUILD_DIR/index.html" && -d "$BUILD_DIR/assets" ]] || { echo 'Invalid build output' >&2; exit 1; }
[[ "$(cat "$BUILD_DIR/deploy-version.txt")" == "$RELEASE_ID" ]] || { echo 'Release identity mismatch' >&2; exit 1; }
# No symlinks, devices or sockets in a static release.
[[ -z "$(find "$BUILD_DIR" -mindepth 1 ! -type f ! -type d -print -quit)" ]] || {
  echo 'Only regular files and directories are allowed in a release' >&2; exit 1;
}
for command in ssh rsync timeout curl; do
  command -v "$command" >/dev/null || { echo "Missing runner command: $command" >&2; exit 1; }
done

TARGET='ubuntu@124.220.2.69'
SITE_URL='http://124.220.2.69:18081'
SSH_OPTIONS=(-p 22 -i "$SSH_KEY" -o "UserKnownHostsFile=$SSH_KNOWN_HOSTS"
  -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes
  -o ConnectTimeout=10 -o ServerAliveInterval=15 -o ServerAliveCountMax=3)
printf -v RSYNC_SSH '%q ' ssh "${SSH_OPTIONS[@]}"
REMOTE_STAGE=''
ARCHIVE="/tmp/tripeer-$RELEASE_ID.tar.gz"
STARTED=$SECONDS

cleanup() {
  local result=$?
  trap - EXIT
  if [[ -n "$REMOTE_STAGE" ]]; then
    # Only the exact mktemp directory validated below; never the live site.
    timeout --kill-after=5s 20s ssh "${SSH_OPTIONS[@]}" "$TARGET" \
      "rm -rf -- '$REMOTE_STAGE'; rm -f -- '$ARCHIVE'" || \
      echo "Warning: temporary server files need cleanup: $REMOTE_STAGE / $ARCHIVE" >&2
  fi
  echo "Cloud deployment elapsed: $((SECONDS - STARTED))s; exit status: $result"
  exit "$result"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

echo 'Checking SSH authentication and server prerequisites (30s maximum)...'
timeout --kill-after=5s 30s ssh "${SSH_OPTIONS[@]}" "$TARGET" 'bash -se' <<'REMOTE'
for command in rsync tar curl timeout; do
  command -v "$command" >/dev/null || {
    echo "Missing server command: $command. Ask the administrator to install it (rsync: sudo apt-get install -y rsync)." >&2
    exit 1
  }
done
test -x /usr/local/sbin/tripeer-deploy
sudo -n -l /usr/local/sbin/tripeer-deploy >/dev/null
echo 'SSH authentication and deployment prerequisites OK'
REMOTE
echo "SSH preflight completed in $((SECONDS - STARTED))s"

# Allocate separately so failure during seeding still leaves a known cleanup target.
REMOTE_STAGE=$(timeout --kill-after=5s 30s ssh "${SSH_OPTIONS[@]}" "$TARGET" \
  "mktemp -d /tmp/tripeer-upload-$RELEASE_ID.XXXXXXXX")
if [[ ! "$REMOTE_STAGE" =~ ^/tmp/tripeer-upload-$RELEASE_ID\.[a-zA-Z0-9]{8}$ ]]; then
  REMOTE_STAGE=''
  echo 'Invalid remote temporary directory response; refusing to upload' >&2
  exit 1
fi

echo 'Seeding temporary files from the current server release (no network upload)...'
timeout --kill-after=5s 90s ssh "${SSH_OPTIONS[@]}" "$TARGET" "bash -se -- '$REMOTE_STAGE'" <<'REMOTE'
stage=$1
if [[ -d /var/www/tripeer/current ]]; then
  # Independent copies: never hard-link or modify files served by Nginx.
  timeout --kill-after=5s 60s rsync -r --copy-links --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
    /var/www/tripeer/current/ "$stage/"
fi
REMOTE

echo 'Incremental upload: checksum comparison, 60s I/O idle timeout, 300s total maximum.'
UPLOAD_STARTED=$SECONDS
# --checksum ignores rebuilt mtimes; --delete affects ONLY the unique temporary tree.
# Never use --inplace or fall back to full SCP on failure.
timeout --kill-after=10s 300s rsync --recursive --times --checksum --compress \
  --delete-delay --delay-updates --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
  --timeout=60 --stats --human-readable --itemize-changes --info=progress2 \
  -e "$RSYNC_SSH" "$BUILD_DIR/" "$TARGET:$REMOTE_STAGE/"
echo "Incremental upload completed in $((SECONDS - UPLOAD_STARTED))s"

echo 'Creating archive on the server and activating with the existing deployment helper...'
ACTIVATE_STARTED=$SECONDS
timeout --kill-after=10s 120s ssh "${SSH_OPTIONS[@]}" "$TARGET" \
  "bash -se -- '$REMOTE_STAGE' '$ARCHIVE' '$RELEASE_ID'" <<'REMOTE'
stage=$1 archive=$2 release=$3
test -s "$stage/index.html"
test -d "$stage/assets"
test "$(cat "$stage/deploy-version.txt")" = "$release"
# mktemp keeps the staging root private (0700). Do NOT preserve that mode in
# the archive's ./ entry: extraction would turn the release root into 0700,
# denying Nginx access even though index.html itself is readable.
# Change archive metadata only; leave the temporary directory private.
timeout --kill-after=5s 30s tar --mode='u=rwX,go=rX' -czf "$archive" -C "$stage" .
timeout --kill-after=5s 60s sudo -n /usr/local/sbin/tripeer-deploy "$archive" "$release"
test "$(curl -fsS --connect-timeout 5 --max-time 10 \
  "http://127.0.0.1:18081/deploy-version.txt?release=$release")" = "$release"
REMOTE
echo "Server activation completed in $((SECONDS - ACTIVATE_STARTED))s"

echo 'Checking exact release identity over the public site...'
PUBLIC_VERSION=$(curl -fsS --connect-timeout 5 --max-time 15 --retry 2 --retry-max-time 45 \
  "$SITE_URL/deploy-version.txt?release=$RELEASE_ID")
[[ "$PUBLIC_VERSION" == "$RELEASE_ID" ]] || {
  echo 'Public release identity check failed. Server activation may have succeeded; inspect logs before retrying.' >&2
  exit 1
}
echo "Deployment verified: $SITE_URL/ (release $RELEASE_ID)"
if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  printf '\n### Deployment verified\n\n- Release: `%s`\n- Site: %s/\n- Upload: %ss\n- Transfer statistics: see rsync output above.\n' \
    "$RELEASE_ID" "$SITE_URL" "$((ACTIVATE_STARTED - UPLOAD_STARTED))" >> "$GITHUB_STEP_SUMMARY"
fi
