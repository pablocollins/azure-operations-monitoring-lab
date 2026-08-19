# Virtual Machine Operations

## Purpose

This document describes the operational procedures used to administer and troubleshoot Windows and Linux virtual machines in the Azure Operations & Monitoring Lab.

The focus is on day-to-day operational tasks, health checks, basic diagnostics, and safe administrative practices.

## Operational Responsibilities

The Cloud Operations team is responsible for:

* Reviewing VM power state
* Validating operating system availability
* Reviewing network configuration
* Checking disks and storage usage
* Reviewing services and processes
* Performing connectivity tests
* Collecting diagnostic information
* Restarting workloads when operationally justified
* Documenting incidents and changes

## VM Inventory

The lab uses the following conceptual workloads:

| VM                | Operating System | Purpose                            |
| ----------------- | ---------------- | ---------------------------------- |
| `vm-win-ops-01`   | Windows Server   | Operations and management workload |
| `vm-linux-app-01` | Linux            | Application workload               |

These workloads are documented for operational simulation and do not need to remain deployed.

## Standard Health Check

A VM health check should review:

1. Azure power state
2. Operating system availability
3. IP configuration
4. Disk usage
5. Memory usage
6. CPU utilization
7. Critical services
8. Network connectivity
9. Application availability
10. Recent operational errors

## Azure Power State

The Azure control plane can report whether a VM is:

* Running
* Stopped
* Deallocated
* Starting
* Stopping

Azure PowerShell example:

```powershell
Get-AzVM -ResourceGroupName rg-ops-lab -Name vm-win-ops-01 -Status
```

Azure CLI example:

```bash
az vm get-instance-view \
  --resource-group rg-ops-lab \
  --name vm-win-ops-01 \
  --query instanceView.statuses \
  --output table
```

The Azure power state does not automatically confirm that the guest operating system or application is healthy.

## Windows VM Checks

Useful Windows commands include:

```powershell
Get-ComputerInfo
Get-NetIPAddress
Get-Volume
Get-Service
Get-Process
Get-NetTCPConnection
Test-NetConnection
```

### Disk Usage

Example:

```powershell
Get-Volume |
    Select-Object DriveLetter, FileSystemLabel, Size, SizeRemaining
```

Low disk space can cause:

* Application failures
* Logging failures
* Update failures
* Performance degradation

### Services

Example:

```powershell
Get-Service |
    Where-Object Status -eq "Stopped"
```

Not every stopped service indicates a problem.

The operator should understand which services are expected to run before attempting remediation.

## Linux VM Checks

Useful Linux commands include:

```bash
hostname
uptime
ip addr
ip route
df -h
free -m
ps aux
systemctl --failed
ss -tulpn
```

### Disk Usage

```bash
df -h
```

### Memory

```bash
free -m
```

### Failed Services

```bash
systemctl --failed
```

### Listening Ports

```bash
ss -tulpn
```

## Safe Operational Practice

Operational actions should be evidence-based.

For example, a restart should not be the first response to every issue.

Before restarting a workload, consider:

* Business impact
* Current symptoms
* Application state
* Active users
* Recent changes
* Logs and monitoring data
* Whether restart may destroy useful diagnostic evidence

## Restart Operations

Where a restart is justified, the operator should:

1. Confirm the correct VM.
2. Confirm the environment.
3. Confirm business impact.
4. Capture relevant diagnostic information.
5. Perform the restart.
6. Validate VM recovery.
7. Validate application recovery.
8. Document the action.

Azure PowerShell example:

```powershell
Restart-AzVM \
    -ResourceGroupName rg-ops-lab \
    -Name vm-win-ops-01
```

Azure CLI example:

```bash
az vm restart \
  --resource-group rg-ops-lab \
  --name vm-win-ops-01
```

These commands are documented for operational reference and are not executed in the zero-cost portfolio environment.

## Troubleshooting Approach

VM incidents should be investigated systematically.

Recommended flow:

```text
Azure Power State
        ↓
Guest OS Availability
        ↓
CPU / Memory
        ↓
Disk
        ↓
Network
        ↓
Services
        ↓
Application
        ↓
Root Cause
        ↓
Remediation
        ↓
Validation
```

## Common VM Symptoms

Examples include:

* VM appears unavailable
* Application is slow
* Disk space is low
* Service is stopped
* VM cannot reach another resource
* Port is not listening
* VM is running in Azure but application is unavailable
* CPU utilization is unexpectedly high

## Evidence Collection

Useful evidence may include:

* VM instance state
* PowerShell output
* Azure CLI output
* Disk usage
* Service status
* Network configuration
* Process information
* Listening ports
* Application response
* Monitoring data

## Cost Considerations

The VM operational procedures are documented without requiring permanent virtual machines.

The project does not require Windows or Linux VMs to remain deployed.

Scripts and sample evidence will be used to demonstrate operational workflows while maintaining a zero-cost portfolio.
