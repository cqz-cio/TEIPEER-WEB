#!/usr/bin/env bash
set -Eeuo pipefail

SITE_ROOT="/var/www/tripeer"
SITE_PORT="8081"
RELEASES_DIR="$SITE_ROOT/releases"
CURRENT_LINK="$SITE_ROOT/current"
ARCHIVE="${1:-}"
RELEASE_ID="${2:-}"

if [[ "$EUID" -ne 0 ]]; then
  echo "This script must run as root" >&2
  exit 1
fi

if [[ ! "$ARCHIVE" =~ ^/tmp/tripeer-[0-9a-f]{40}-[0-9]+\.tar\.gz$ ]]; then
  echo "Invalid release archive path" >&2
  exit 1
fi

if [[ ! "$RELEASE_ID" =~ ^[0-9a-f]{40}-[0-9]+$ ]]; then
  echo "Invalid release id" >&2
  exit 1
fi

if [[ ! -f "$ARCHIVE" ]]; then
  echo "Release archive not found: $ARCHIVE" >&2
  exit 1
fi

if tar -tzf "$ARCHIVE" | awk '/(^\/|(^|\/)\.\.(\/|$))/ { unsafe=1 } END { exit !unsafe }'; then
  echo "Unsafe path found in release archive" >&2
  exit 1
fi

RELEASE_DIR="$RELEASES_DIR/$RELEASE_ID"
STAGING_DIR="$RELEASES_DIR/.staging-$RELEASE_ID"
PREVIOUS_RELEASE=""

cleanup() {
  rm -f -- "$ARCHIVE"
  if [[ -d "$STAGING_DIR" ]]; then
    rm -rf -- "$STAGING_DIR"
  fi
}
trap cleanup EXIT

install -d -m 0755 "$RELEASES_DIR"

if [[ -L "$CURRENT_LINK" ]]; then
  PREVIOUS_RELEASE="$(readlink -f "$CURRENT_LINK")"
fi

if [[ ! -d "$RELEASE_DIR" ]]; then
  install -d -m 0755 "$STAGING_DIR"
  tar -xzf "$ARCHIVE" --no-same-owner --no-same-permissions -C "$STAGING_DIR"

  if [[ ! -s "$STAGING_DIR/index.html" || ! -d "$STAGING_DIR/assets" ]]; then
    echo "Release is missing index.html or assets" >&2
    exit 1
  fi

  chown -R root:root "$STAGING_DIR"
  mv -- "$STAGING_DIR" "$RELEASE_DIR"
fi

TEMP_LINK="$SITE_ROOT/.current-$RELEASE_ID"
ln -s "$RELEASE_DIR" "$TEMP_LINK"
mv -Tf "$TEMP_LINK" "$CURRENT_LINK"

if ! nginx -t || ! systemctl reload nginx || ! curl --fail --silent --show-error --max-time 10 "http://127.0.0.1:$SITE_PORT/" >/dev/null; then
  if [[ -n "$PREVIOUS_RELEASE" && -d "$PREVIOUS_RELEASE" ]]; then
    ROLLBACK_LINK="$SITE_ROOT/.rollback-$RELEASE_ID"
    ln -s "$PREVIOUS_RELEASE" "$ROLLBACK_LINK"
    mv -Tf "$ROLLBACK_LINK" "$CURRENT_LINK"
    systemctl reload nginx || true
  fi
  rm -rf -- "$RELEASE_DIR"
  echo "Health check failed; previous release restored" >&2
  exit 1
fi

mapfile -t OLD_RELEASES < <(
  find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
    | sort -nr \
    | tail -n +4 \
    | cut -d' ' -f2-
)

for OLD_RELEASE in "${OLD_RELEASES[@]}"; do
  if [[ "$OLD_RELEASE" == "$PREVIOUS_RELEASE" || "$OLD_RELEASE" == "$RELEASE_DIR" ]]; then
    continue
  fi
  rm -rf -- "$OLD_RELEASE"
done

echo "Release activated: $RELEASE_ID"
