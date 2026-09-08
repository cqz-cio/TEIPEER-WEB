#!/usr/bin/env bash
# Isolated Linux regression: archive the mktemp root and extract like the helper.
set -Eeuo pipefail
fixture=$(mktemp -d /tmp/tripeer-permission-test.XXXXXXXX)
[[ "$fixture" =~ ^/tmp/tripeer-permission-test\.[a-zA-Z0-9]{8}$ ]] || exit 1
trap 'rm -rf -- "$fixture"' EXIT
stage="$fixture/private-stage"
archive="$fixture/release.tar.gz"
mkdir -m 700 "$stage"
mkdir -m 700 "$stage/assets"
printf 'test site\n' > "$stage/index.html"
printf 'test asset\n' > "$stage/assets/main.js"
chmod 600 "$stage/index.html" "$stage/assets/main.js"
mkdir -m 755 "$fixture/extracted"
umask 022

# Extract the exact command from production, so removing --mode breaks this test.
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
archive_command=$(grep '^timeout .* tar .* -czf ' "$script_dir/deploy-cloud.sh")
[[ $(printf '%s\n' "$archive_command" | wc -l) -eq 1 ]]
eval "$archive_command"
tar -xzf "$archive" --no-same-owner --no-same-permissions -C "$fixture/extracted"
[[ $(stat -c %a "$stage") == 700 ]]
[[ $(stat -c %a "$stage/index.html") == 600 ]]
[[ $(stat -c %a "$fixture/extracted") == 755 ]]
[[ $(stat -c %a "$fixture/extracted/assets") == 755 ]]
[[ $(stat -c %a "$fixture/extracted/index.html") == 644 ]]
[[ $(stat -c %a "$fixture/extracted/assets/main.js") == 644 ]]
echo 'PASS archive permissions: staging stays 700; release directories 755, files 644'
