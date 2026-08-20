# Runbook — Azure VM Backup Failure

## Purpose

Use this runbook when an Azure VM backup job fails or when the expected recovery point is not available.

The objective is to identify the cause of the backup failure, restore protection, and verify that a valid recovery point is created.

## When to Use This Runbook

Use this runbook when:

- An Azure VM backup job reports `Failed`.
- The latest expected recovery point is missing.
- A protected VM has repeated backup failures.
- Backup monitoring reports an unhealthy protected item.
- A workload may not meet its expected RPO.

## Initial Information

Before troubleshooting, record:

- VM name
- Resource group
- Recovery Services Vault
- Backup policy
- Failed job timestamp
- Latest successful backup
- Error message or error code
- Recent changes

Example lab environment:

```text
VM:                       vm-win-ops-01
Resource Group:           rg-ops-lab
Recovery Services Vault:  rsv-ops-lab
Backup Policy:             Daily-VM-Backup