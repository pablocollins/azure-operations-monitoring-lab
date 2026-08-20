# INC-004 — Azure VM Backup Failure

## Incident Summary

The scheduled Azure Backup operation for `vm-win-ops-01` failed, leaving the workload without the expected daily recovery point.

The incident is investigated by reviewing the backup job, protection state, latest successful recovery point, workload health, and recent changes.

This incident is simulated for portfolio and troubleshooting demonstration purposes.

## Incident Classification

| Field | Value |
|---|---|
| Incident ID | `INC-004` |
| Category | Backup & Recovery |
| Severity | SEV-2 |
| Status | Resolved |
| Environment | Azure Operations & Monitoring Lab |
| Affected Resource | `vm-win-ops-01` |
| Recovery Services Vault | `rsv-ops-lab` |
| Backup Policy | `Daily-VM-Backup` |
| Incident Type | Simulated |

## Business Impact

The expected daily recovery point was not created.

The workload remained operational, but its recovery posture was degraded.

If the failure remained unresolved, the available recovery point could eventually fall outside the required Recovery Point Objective (RPO).

## Backup Requirement

Conceptual protection requirement:

```text
Workload:       vm-win-ops-01
Policy:         Daily-VM-Backup
Frequency:      Daily
Retention:      7 days
Expected RPO:   24 hours