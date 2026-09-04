#!/usr/bin/env bash
set -Eeuo pipefail

SITE_ROOT="/var/www/tripeer"
SITE_PORT="${SITE_PORT:-18081}"
DEPLOY_USER="${DEPLOY_USER:-ubuntu}"
SERVER_NAME="${SERVER_NAME:-_}"
PUBLIC_HOST="${PUBLIC_HOST:-124.220.2.69}"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
NGINX_CONFIG="/etc/nginx/conf.d/tripeer.conf"

if [[ "$EUID" -ne 0 ]]; then
  echo "Please run with sudo: sudo -E bash deploy/bootstrap-server.sh" >&2
  exit 1
fi

if ! [[ "$SITE_PORT" =~ ^[0-9]+$ ]] || (( SITE_PORT < 1 || SITE_PORT > 65535 )); then
  echo "Invalid SITE_PORT: $SITE_PORT" >&2
  exit 1
fi

if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  echo "Deploy user does not exist: $DEPLOY_USER" >&2
  exit 1
fi

if [[ ! -f "$SCRIPT_DIR/remote-deploy.sh" ]]; then
  echo "Missing $SCRIPT_DIR/remote-deploy.sh" >&2
  exit 1
fi

if [[ ! -e "$NGINX_CONFIG" ]] && ss -H -ltn "sport = :$SITE_PORT" | grep -q .; then
  echo "Port $SITE_PORT is already in use; choose another SITE_PORT" >&2
  exit 1
fi

if ! command -v nginx >/dev/null 2>&1 || ! command -v curl >/dev/null 2>&1; then
  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y nginx curl
fi

install -d -m 0755 "$SITE_ROOT" "$SITE_ROOT/releases"
install -m 0755 "$SCRIPT_DIR/remote-deploy.sh" /usr/local/sbin/tripeer-deploy

if [[ -n "${DEPLOY_PUBLIC_KEY:-}" ]]; then
  if [[ ! "$DEPLOY_PUBLIC_KEY" =~ ^ssh-(ed25519|rsa)[[:space:]] ]]; then
    echo "DEPLOY_PUBLIC_KEY is not a supported OpenSSH public key" >&2
    exit 1
  fi

  DEPLOY_HOME="$(getent passwd "$DEPLOY_USER" | cut -d: -f6)"
  install -d -m 0700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$DEPLOY_HOME/.ssh"
  touch "$DEPLOY_HOME/.ssh/authorized_keys"
  chown "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_HOME/.ssh/authorized_keys"
  chmod 0600 "$DEPLOY_HOME/.ssh/authorized_keys"
  grep -Fqx "$DEPLOY_PUBLIC_KEY" "$DEPLOY_HOME/.ssh/authorized_keys" || printf '%s\n' "$DEPLOY_PUBLIC_KEY" >> "$DEPLOY_HOME/.ssh/authorized_keys"
fi

if [[ ! -e "$SITE_ROOT/current" ]]; then
  install -d -m 0755 "$SITE_ROOT/releases/bootstrap"
  printf '%s\n' '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>TRIPEER</title><body>Deployment is ready.</body></html>' > "$SITE_ROOT/releases/bootstrap/index.html"
  ln -s "$SITE_ROOT/releases/bootstrap" "$SITE_ROOT/current"
fi

cat > "$NGINX_CONFIG" <<EOF
server {
    listen ${SITE_PORT};
    listen [::]:${SITE_PORT};
    server_name ${SERVER_NAME};

    root ${SITE_ROOT}/current;
    index index.html;

    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        try_files \$uri =404;
    }

    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable" always;
        try_files \$uri =404;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml font/woff2;
}
EOF

cat > /etc/sudoers.d/tripeer-deploy <<EOF
${DEPLOY_USER} ALL=(root) NOPASSWD: /usr/local/sbin/tripeer-deploy
EOF
chmod 0440 /etc/sudoers.d/tripeer-deploy
visudo -cf /etc/sudoers.d/tripeer-deploy >/dev/null

nginx -t
systemctl enable --now nginx
systemctl reload nginx

echo
echo "Server bootstrap completed."
echo "Existing port 80 configuration was not changed."
echo "Website: http://${PUBLIC_HOST}:${SITE_PORT}/"
echo "Add this verified server host key to the deploying computer's SSH known_hosts file:"
if [[ -f /etc/ssh/ssh_host_ed25519_key.pub ]]; then
  awk -v host="$PUBLIC_HOST" '{ print host " " $1 " " $2 }' /etc/ssh/ssh_host_ed25519_key.pub
else
  echo "No Ed25519 host key was found; obtain known_hosts with ssh-keyscan and verify its fingerprint."
fi
