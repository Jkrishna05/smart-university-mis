#!/bin/bash
# ============================================================
# OIT MIS — Production Server Bootstrap
# ============================================================
# Run this ONCE on a fresh Ubuntu 22.04+ cloud VM to set up
# everything needed for the OIT MIS deployment.
#
# Usage:
#   curl -sSL https://raw.githubusercontent.com/Arab10-oss/orion-mis/main/scripts/setup-server.sh | bash
#
# Or download and run:
#   chmod +x scripts/setup-server.sh
#   sudo ./scripts/setup-server.sh
# ============================================================

set -euo pipefail

echo "============================================"
echo "  OIT MIS — Server Bootstrap"
echo "  $(date)"
echo "============================================"

# Must run as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root: sudo $0"
  exit 1
fi

# ── 1. System Updates ────────────────────────────────────────
echo ""
echo "► Step 1: Updating system packages..."
apt update && apt upgrade -y

# ── 2. Install Docker ────────────────────────────────────────
echo ""
echo "► Step 2: Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker $SUDO_USER 2>/dev/null || true
  systemctl enable docker
  systemctl start docker
  echo "  ✅ Docker installed"
else
  echo "  ✅ Docker already installed"
fi

# ── 3. Install Docker Compose Plugin ─────────────────────────
echo ""
echo "► Step 3: Verifying Docker Compose..."
if docker compose version &> /dev/null; then
  echo "  ✅ Docker Compose $(docker compose version --short) available"
else
  apt install -y docker-compose-plugin
  echo "  ✅ Docker Compose plugin installed"
fi

# ── 4. Install useful tools ──────────────────────────────────
echo ""
echo "► Step 4: Installing utilities..."
apt install -y git curl wget unzip htop fail2ban ufw

# ── 5. Firewall Setup ────────────────────────────────────────
echo ""
echo "► Step 5: Configuring firewall (UFW)..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable
echo "  ✅ Firewall: SSH(22), HTTP(80), HTTPS(443) allowed"

# ── 6. Fail2Ban (SSH brute-force protection) ─────────────────
echo ""
echo "► Step 6: Configuring Fail2Ban..."
systemctl enable fail2ban
systemctl start fail2ban
echo "  ✅ Fail2Ban active (SSH protection)"

# ── 7. Clone Repository ──────────────────────────────────────
DEPLOY_PATH="/opt/oit-mis"
echo ""
echo "► Step 7: Cloning OIT MIS repository..."
if [ -d "$DEPLOY_PATH" ]; then
  echo "  ⚠️  Directory exists, pulling latest..."
  cd "$DEPLOY_PATH" && git pull origin main
else
  git clone https://github.com/Arab10-oss/orion-mis.git "$DEPLOY_PATH"
  cd "$DEPLOY_PATH"
fi

# ── 8. Create .env ───────────────────────────────────────────
echo ""
echo "► Step 8: Setting up environment..."
if [ ! -f .env ]; then
  cp .env.example .env
  # Generate random secrets
  JWT_SECRET=$(openssl rand -hex 32)
  DB_PASS=$(openssl rand -base64 24 | tr -d '=/+' | head -c 32)
  sed -i "s|CHANGE_ME_64_char_random_hex_string|${JWT_SECRET}|g" .env
  sed -i "s|CHANGE_ME_strong_random_password|${DB_PASS}|g" .env
  echo "  ✅ .env created with auto-generated secrets"
  echo ""
  echo "  ⚠️  IMPORTANT: Edit .env to set your DOMAIN:"
  echo "     nano ${DEPLOY_PATH}/.env"
else
  echo "  ✅ .env already exists"
fi

# ── 9. Create required directories ───────────────────────────
echo ""
echo "► Step 9: Creating directories..."
mkdir -p backups certbot/conf certbot/www
chmod +x scripts/*.sh 2>/dev/null || true

# ── 10. Setup Cron for DB Backups ────────────────────────────
echo ""
echo "► Step 10: Setting up nightly database backups..."
CRON_LINE="0 2 * * * cd ${DEPLOY_PATH} && ./scripts/backup-db.sh >> /var/log/oit-backup.log 2>&1"
(crontab -l 2>/dev/null | grep -v "oit-backup" ; echo "$CRON_LINE") | crontab -
echo "  ✅ Nightly backup cron installed (2:00 AM)"

echo ""
echo "============================================"
echo "  ✅ Server Bootstrap Complete!"
echo ""
echo "  Next steps:"
echo "  1. Edit your domain:  nano ${DEPLOY_PATH}/.env"
echo "  2. Set DNS A record:  your-domain → $(curl -s ifconfig.me)"
echo "  3. Get SSL cert:      cd ${DEPLOY_PATH} && ./scripts/init-ssl.sh"
echo "  4. Deploy:            docker compose -f docker-compose.prod.yml up -d --build"
echo ""
echo "  Or wait for GitHub Actions to auto-deploy on next push!"
echo "============================================"
