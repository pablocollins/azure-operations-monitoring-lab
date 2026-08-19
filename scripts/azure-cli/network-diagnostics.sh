#!/usr/bin/env bash

# Azure Operations & Monitoring Lab
# Network diagnostics script
# Read-only diagnostic workflow

set -e

RESOURCE_GROUP="$1"
NIC_NAME="$2"

if [ -z "$RESOURCE_GROUP" ] || [ -z "$NIC_NAME" ]; then
    echo "Usage:"
    echo "./network-diagnostics.sh <resource-group> <nic-name>"
    exit 1
fi

echo ""
echo "========================================"
echo " Azure Network Diagnostics"
echo "========================================"
echo ""

echo "[1] Checking Azure CLI context..."

az account show --output table

echo ""
echo "[2] Retrieving NIC configuration..."

az network nic show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$NIC_NAME" \
    --query "{
        Name:name,
        Location:location,
        PrivateIP:ipConfigurations[0].privateIPAddress,
        Subnet:ipConfigurations[0].subnet.id,
        NetworkSecurityGroup:networkSecurityGroup.id
    }" \
    --output table

echo ""
echo "[3] Reviewing effective NSG configuration..."

az network nic list-effective-nsg \
    --resource-group "$RESOURCE_GROUP" \
    --name "$NIC_NAME" \
    --output table

echo ""
echo "[4] Diagnostic complete."
echo ""
echo "Review NIC configuration, subnet membership and effective NSGs."
echo "This script does not modify Azure networking."