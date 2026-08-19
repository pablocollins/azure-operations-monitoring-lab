#!/usr/bin/env bash

# Azure Operations & Monitoring Lab
# RBAC audit script
# Read-only diagnostic script

set -e

USER_PRINCIPAL_NAME="$1"

if [ -z "$USER_PRINCIPAL_NAME" ]; then
    echo "Usage:"
    echo "./rbac-audit.sh user@contoso.com"
    exit 1
fi

echo ""
echo "========================================"
echo " Azure RBAC Audit"
echo "========================================"
echo ""

echo "[1] Checking Azure CLI context..."

az account show --output table

echo ""
echo "[2] Searching Microsoft Entra user..."

USER_OBJECT_ID=$(az ad user show \
    --id "$USER_PRINCIPAL_NAME" \
    --query id \
    --output tsv)

if [ -z "$USER_OBJECT_ID" ]; then
    echo "User not found: $USER_PRINCIPAL_NAME"
    exit 1
fi

echo "User found."
echo "UPN:       $USER_PRINCIPAL_NAME"
echo "Object ID: $USER_OBJECT_ID"

echo ""
echo "[3] Reviewing Azure RBAC assignments..."

az role assignment list \
    --assignee "$USER_OBJECT_ID" \
    --all \
    --output table

echo ""
echo "[4] Audit complete."
echo ""
echo "Review role definitions and scopes before applying permission changes."
echo "This script does not modify Azure RBAC assignments."