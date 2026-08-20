#!/usr/bin/env bash

# Azure Operations & Monitoring Lab
# Azure Backup status audit
# Read-only Azure CLI workflow

set -e

RESOURCE_GROUP="$1"
VAULT_NAME="$2"

if [ -z "$RESOURCE_GROUP" ] || [ -z "$VAULT_NAME" ]; then
    echo "Usage:"
    echo "./backup-status.sh <resource-group> <vault-name>"
    exit 1
fi

echo ""
echo "========================================"
echo " Azure Backup Status Audit"
echo "========================================"
echo ""

echo "[1] Checking Azure CLI context..."

az account show --output table

echo ""
echo "[2] Reviewing backup jobs..."

az backup job list \
  --resource-group "$RESOURCE_GROUP" \
  --vault-name "$VAULT_NAME" \
  --output table

echo ""
echo "[3] Reviewing failed backup jobs..."

az backup job list \
  --resource-group "$RESOURCE_GROUP" \
  --vault-name "$VAULT_NAME" \
  --query "[?properties.status=='Failed']" \
  --output table

echo ""
echo "[4] Backup audit complete."
echo ""
echo "Review:"
echo "- Failed jobs"
echo "- Latest successful backup"
echo "- Recovery point availability"
echo "- RPO impact"
echo ""
echo "This script does not modify Azure Backup configuration."