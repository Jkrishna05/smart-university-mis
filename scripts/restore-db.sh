#!/bin/bash
# ============================================================
# OIT MIS — Database Restore from Backup
# ============================================================
# Usage:
#   ./scripts/restore-db.sh backups/oit_mis_backup_2025-09-01_02-00-00.sql.gz
# ============================================================

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: $0 <backup-file.sql.gz>"
  echo ""
  echo "Available backups:"
  ls -lh backups/oit_mis_backup_*.sql.gz 2>/dev/null || echo "  No backups found in ./backups/"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "❌ Error: File not found: ${BACKUP_FILE}"
  exit 1
fi

# Load env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

DB_USER="${DB_USER:-root}"
DB_PASSWORD="${MYSQL_ROOT_PASSWORD:-${DB_PASSWORD}}"
CONTAINER="${MYSQL_CONTAINER:-oit_mis_mysql}"

echo "============================================"
echo "  OIT MIS Database Restore"
echo "  File: ${BACKUP_FILE}"
echo "============================================"
echo ""
echo "⚠️  WARNING: This will OVERWRITE the current database!"
read -p "  Continue? (yes/no): " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
  echo "  Aborted."
  exit 0
fi

echo ""
echo "► Restoring database..."
gunzip -c "${BACKUP_FILE}" | docker exec -i "${CONTAINER}" mysql \
  -u "${DB_USER}" \
  -p"${DB_PASSWORD}"

echo ""
echo "  ✅ Database restored from: ${BACKUP_FILE}"
echo ""
echo "► Restarting backend to reconnect..."
docker restart oit_mis_backend

echo ""
echo "============================================"
echo "  ✅ Restore Complete!"
echo "============================================"
