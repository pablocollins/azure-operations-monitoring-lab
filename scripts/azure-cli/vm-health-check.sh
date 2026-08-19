#!/usr/bin/env bash

# Azure Operations & Monitoring Lab
# VM health check
# Read-only Azure CLI workflow

set -e

RESOURCE_GROUP="$1"
VM_NAME="$2"

if [ -z "$RESOURCE_GROUP" ] || [ -z "$VM_NAME" ]; then
    echo "Usage:"
    echo "./vm-health-check.sh <resource-group> <vm-name>"
    exit 1
fi

echo ""
echo "========================================"
echo " Azure VM Health Check"
echo "========================================"
echo ""

echo "[1] Checking Azure CLI context..."

az account show --output table

echo ""
echo "[2] Retrieving VM information..."

az vm show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$VM_NAME" \
    --show-details \
    --query "{
        Name:name,
        Location:location,
        PowerState:powerState,
        PrivateIPs:privateIps,
        PublicIPs:publicIps
    }" \
    --output table

echo ""
echo "[3] Retrieving VM instance status..."

az vm get-instance-view \
    --resource-group "$RESOURCE_GROUP" \
    --name "$VM_NAME" \
    --query "instanceView.statuses[].{
        Code:code,
        DisplayStatus:displayStatus
    }" \
    --output table

echo ""
echo "[4] Reviewing attached network interfaces..."

az vm nic list \
    --resource-group "$RESOURCE_GROUP" \
    --vm-name "$VM_NAME" \
    --query "[].{
        Name:name,
        Primary:primary,
        Id:id
    }" \
    --output table

echo ""
echo "[5] Health check complete."
echo ""
echo "Review VM state together with:"
echo "- Guest OS health"
echo "- Disk usage"
echo "- Network connectivity"
echo "- Services and processes"
echo "- Monitoring data"
echo "- Application status"
echo ""
echo "This script does not modify the virtual machine."