#!/bin/bash
# ============================================================
# OIT MIS — Automated MySQL Database Backup
# ============================================================
# Usage:
#   chmod +x scripts/backup-db.sh
#   ./scripts/backup-db.sh
#
# Cron (nightly at 2 AM):
#   0 2 * * * cd /path/to/project && ./scripts/backup-db.sh >> /var/log/oit-backup.log 2>&1
#
# What this does:
#   1. Dumps the MySQL database inside the Docker container
#   2. Compresses it with gzip
#   3. Saves to ./backups/ with a timestamp
#   4. Deletes backups older than 30 days
#   5. (Optional) Uploads to S3/GCS if configured
# ============================================================

set -euo pipefail

# Load env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

DB_NAME="${DB_NAME:-university_mis}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${MYSQL_ROOT_PASSWORD:-${DB_PASSWORD}}"
CONTAINER="${MYSQL_CONTAINER:-oit_mis_mysql}"
BACKUP_DIR="./backups"
RETENTION_DAYS=30

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="oit_mis_backup_${TIMESTAMP}.sql.gz"

echo "============================================"
echo "  OIT MIS Database Backup"
echo "  Time:      ${TIMESTAMP}"
echo "  Database:  ${DB_NAME}"
echo "  Container: ${CONTAINER}"
echo "============================================"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Step 1: Dump and compress
echo ""
echo "► Dumping database..."
docker exec "${CONTAINER}" mysqldump \
  -u "${DB_USER}" \
  -p"${DB_PASSWORD}" \
  --single-transaction \
  --routines \
  --triggers \
  --databases "${DB_NAME}" \
  2>/dev/null | gzip > "${BACKUP_DIR}/${FILENAME}"

FILESIZE=$(du -sh "${BACKUP_DIR}/${FILENAME}" | cut -f1)
echo "  ✅ Backup created: ${FILENAME} (${FILESIZE})"

# Step 2: Remove old backups
echo ""
echo "► Cleaning backups older than ${RETENTION_DAYS} days..."
DELETED=$(find "${BACKUP_DIR}" -name "oit_mis_backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete -print | wc -l)
echo "  🗑️  Deleted ${DELETED} old backup(s)"

# Step 3: (Optional) Upload to cloud storage
# Uncomment the provider you use:

# ── AWS S3 ──
# aws s3 cp "${BACKUP_DIR}/${FILENAME}" "s3://oit-mis-backups/${FILENAME}"

# ── Google Cloud Storage ──
# gsutil cp "${BACKUP_DIR}/${FILENAME}" "gs://oit-mis-backups/${FILENAME}"

# ── Azure Blob Storage ──
# az storage blob upload --file "${BACKUP_DIR}/${FILENAME}" --container-name backups --name "${FILENAME}"

# Step 4: List current backups
echo ""
echo "► Current backups:"
ls -lh "${BACKUP_DIR}"/oit_mis_backup_*.sql.gz 2>/dev/null || echo "  No backups found"

echo ""
echo "============================================"
echo "  ✅ Backup Complete!"
echo "============================================"
