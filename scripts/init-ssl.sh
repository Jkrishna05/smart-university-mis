#!/bin/bash
# ============================================================
# OIT MIS — Let's Encrypt SSL Certificate Initialization
# ============================================================
# Usage:
#   chmod +x scripts/init-ssl.sh
#   ./scripts/init-ssl.sh
#
# Prerequisites:
#   - Domain DNS A record pointing to this server's public IP
#   - Port 80 open in firewall
#   - Docker and docker compose installed
# ============================================================

set -euo pipefail

# Load domain from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

DOMAIN="${DOMAIN:?Error: DOMAIN not set in .env}"
EMAIL="${SSL_EMAIL:-admin@${DOMAIN}}"

echo "============================================"
echo "  OIT MIS — SSL Certificate Setup"
echo "  Domain: ${DOMAIN}"
echo "  Email:  ${EMAIL}"
echo "============================================"

# Create required directories
mkdir -p certbot/conf certbot/www

# Step 1: Start nginx with a temporary self-signed cert so port 80 works
echo ""
echo "► Step 1: Creating temporary self-signed certificate..."
mkdir -p "certbot/conf/live/${DOMAIN}"

openssl req -x509 -nodes -newkey rsa:4096 \
  -days 1 \
  -keyout "certbot/conf/live/${DOMAIN}/privkey.pem" \
  -out "certbot/conf/live/${DOMAIN}/fullchain.pem" \
  -subj "/CN=${DOMAIN}" \
  2>/dev/null

echo "  ✅ Temporary cert created"

# Step 2: Start nginx so it can serve the ACME challenge
echo ""
echo "► Step 2: Starting Nginx for ACME challenge..."
docker compose -f docker-compose.prod.yml up -d nginx
sleep 3

# Step 3: Delete the temporary cert
echo ""
echo "► Step 3: Removing temporary certificate..."
rm -rf "certbot/conf/live/${DOMAIN}"

# Step 4: Request real certificate from Let's Encrypt
echo ""
echo "► Step 4: Requesting Let's Encrypt certificate..."
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "${EMAIL}" \
  --agree-tos \
  --no-eff-email \
  -d "${DOMAIN}"

# Step 5: Reload nginx with the real cert
echo ""
echo "► Step 5: Reloading Nginx with production certificate..."
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo ""
echo "============================================"
echo "  ✅ SSL Setup Complete!"
echo "  https://${DOMAIN} is now ready"
echo ""
echo "  Certbot auto-renewal runs every 12 hours"
echo "============================================"
