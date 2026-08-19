# Runbook — Virtual Machine Health Check

## Purpose

Use this runbook to perform a structured health assessment of a Windows or Linux virtual machine.

The objective is to collect evidence before applying remediation such as restarting the workload.

## When to Use This Runbook

Use this runbook when:

* A virtual machine appears slow or unresponsive.
* An application running on the VM is unavailable.
* Monitoring reports high CPU, memory, or disk usage.
* A service is suspected to have stopped.
* Network connectivity is failing.
* A restart is being considered.

## Health Check Flow

```text
Azure Power State
        ↓
Guest OS Availability
        ↓
CPU
        ↓
Memory
        ↓
Disk
        ↓
Network
        ↓
Services
        ↓
Application Listener
        ↓
Monitoring Data
        ↓
Root Cause
        ↓
Remediation
        ↓
Validation
```

## 1. Confirm the Correct Workload

Before troubleshooting, record:

* VM name
* Resource group
* Operating system
* Environment
* Business purpose
* Reported symptom

Example:

```text
VM:             vm-win-ops-01
Resource Group: rg-ops-lab
OS:             Windows Server
Environment:    Lab
```

## 2. Review Azure Power State

Confirm whether Azure reports the VM as running.

Azure PowerShell example:

```powershell
Get-AzVM `
    -ResourceGroupName rg-ops-lab `
    -Name vm-win-ops-01 `
    -Status
```

Azure CLI example:

```bash
az vm get-instance-view \
  --resource-group rg-ops-lab \
  --name vm-win-ops-01 \
  --query "instanceView.statuses" \
  --output table
```

Possible states include:

* Running
* Starting
* Stopped
* Deallocated

A `Running` state confirms that the Azure compute resource is active, but it does not confirm guest operating system or application health.

## 3. Confirm Guest OS Availability

If guest access is available, verify that the operating system responds.

Windows examples:

```powershell
hostname
Get-ComputerInfo
```

Linux examples:

```bash
hostname
uptime
```

Record the result before proceeding.

## 4. Review CPU

Check whether CPU utilization is unexpectedly high.

Windows example:

```powershell
Get-CimInstance Win32_Processor |
    Select-Object Name, LoadPercentage
```

Linux examples:

```bash
top
```

or:

```bash
uptime
```

High CPU should be correlated with:

* Processes
* Application activity
* Monitoring data
* Recent changes

## 5. Review Memory

Windows example:

```powershell
Get-CimInstance Win32_OperatingSystem |
    Select-Object TotalVisibleMemorySize, FreePhysicalMemory
```

Linux example:

```bash
free -m
```

Investigate sustained memory pressure before deciding whether a restart is appropriate.

## 6. Review Disk Usage

Windows:

```powershell
Get-Volume |
    Select-Object DriveLetter, Size, SizeRemaining
```

Linux:

```bash
df -h
```

Look for:

* Low free space
* Unexpected disk growth
* Log accumulation
* Application data growth

A full disk can cause application, logging, update, and operating system failures.

## 7. Review Network Configuration

Windows:

```powershell
Get-NetIPAddress -AddressFamily IPv4
Get-NetRoute
```

Linux:

```bash
ip addr
ip route
```

Confirm:

* Expected private IP
* Expected subnet
* Default route
* Connectivity requirements

For connectivity-specific incidents, use:

```text
runbooks/vm-unreachable.md
```

## 8. Review Services

### Windows

Review automatic services that are not currently running:

```powershell
Get-Service |
    Where-Object {
        $_.StartType -eq "Automatic" -and
        $_.Status -ne "Running"
    }
```

### Linux

Review failed systemd services:

```bash
systemctl --failed
```

Do not assume every stopped service represents an incident.

Compare service state with the workload's expected configuration.

## 9. Review Processes

Windows:

```powershell
Get-Process |
    Sort-Object CPU -Descending |
    Select-Object -First 10
```

Linux:

```bash
ps aux --sort=-%cpu | head
```

Look for:

* Unexpected CPU consumption
* Memory-intensive processes
* Missing expected application processes

## 10. Review Application Listener

Confirm that the expected application port is listening.

Windows example for TCP/443:

```powershell
Get-NetTCPConnection `
    -LocalPort 443 `
    -State Listen
```

Linux:

```bash
ss -tulpn
```

A running VM with no application listener may represent an application-layer failure rather than an Azure compute failure.

## 11. Review Monitoring Evidence

Where monitoring is available, correlate local findings with:

* CPU metrics
* Memory data
* Disk data
* Heartbeat information
* Application logs
* Alerts
* Recent changes

Monitoring data should support the troubleshooting hypothesis.

## 12. Decide Whether Remediation Is Required

Possible remediation may include:

* Restarting an application service
* Clearing unnecessary disk usage
* Correcting a network issue
* Restoring an application dependency
* Restarting the VM as a controlled operational action

A VM restart should not automatically be the first remediation.

## 13. Restart Decision

Before restarting a VM, confirm:

1. The correct workload has been identified.
2. Diagnostic evidence has been collected.
3. Business impact is understood.
4. Restart is appropriate for the identified issue.
5. Required approvals have been obtained where applicable.

Documented Azure PowerShell example:

```powershell
Restart-AzVM `
    -ResourceGroupName rg-ops-lab `
    -Name vm-win-ops-01
```

Documented Azure CLI example:

```bash
az vm restart \
  --resource-group rg-ops-lab \
  --name vm-win-ops-01
```

These commands are reference examples and are not executed in the zero-cost portfolio environment.

## 14. Validate Recovery

After remediation, verify:

* VM is available
* Guest operating system responds
* Required services are running
* Required application port is listening
* Network connectivity succeeds
* Application functionality is restored
* Monitoring returns to normal

## Evidence to Capture

Useful evidence includes:

* Azure VM power state
* CPU usage
* Memory usage
* Disk usage
* IP configuration
* Service status
* Process information
* Listening ports
* Monitoring results
* Remediation performed
* Post-remediation validation

## Escalation Criteria

Escalate when:

* The guest OS remains unavailable while Azure reports the VM as running.
* Storage or disk corruption is suspected.
* Repeated failures occur after remediation.
* Application troubleshooting requires another specialist team.
* The issue may involve platform-level Azure problems.
* Business-critical workloads require higher-level approval.

## Expected Outcome

At the end of the health check, the operator should be able to explain:

1. Whether Azure reports the VM as available.
2. Whether the guest operating system is healthy.
3. Which resource or service is affected.
4. What evidence supports the diagnosis.
5. Whether remediation is required.
6. How the workload will be validated after remediation.

## Portfolio Note

This runbook represents a production-style operational workflow while the portfolio remains zero-cost.

Azure-specific commands are documented as reference procedures and are not presented as live execution evidence.
