# Alert Design — Missing VM Heartbeat

## Purpose

This document describes the conceptual design of an alert used to detect when a monitored virtual machine stops sending heartbeat telemetry.

The alert is documented for portfolio purposes and is not deployed in a live Azure environment.

## Alert Objective

Detect when a monitored virtual machine has not reported heartbeat data within an expected time window.

## Target Workloads

Conceptual targets:

* `vm-win-ops-01`
* `vm-linux-app-01`

## Signal Source

Log data:

`Heartbeat`

The alert evaluates the most recent heartbeat received from each monitored computer.

## Detection Logic

Conceptual condition:

```text
No heartbeat received for more than 10 minutes
```

The exact threshold should depend on operational requirements and expected telemetry frequency.

## Example KQL

```kusto
Heartbeat
| summarize LastHeartbeat = max(TimeGenerated) by Computer
| extend MinutesSinceLastHeartbeat = datetime_diff("minute", now(), LastHeartbeat)
| where MinutesSinceLastHeartbeat > 10
```

## Severity

Suggested severity:

```text
Sev 2
```

Reason:

Loss of heartbeat may indicate that a monitored workload is unavailable or that the monitoring path has failed.

## Possible Causes

A missing heartbeat does not automatically mean that the virtual machine is down.

Possible causes include:

* Virtual machine unavailable
* Monitoring agent stopped
* Monitoring agent misconfiguration
* Network connectivity failure
* Workspace connectivity problem
* Data collection configuration issue
* Monitoring service issue

## Expected Workflow

```text
Heartbeat missing
      ↓
Log Analytics query
      ↓
Alert condition met
      ↓
Alert triggered
      ↓
Cloud Operations
      ↓
Investigation
      ↓
Root cause
      ↓
Remediation
      ↓
Validation
```

## Investigation Steps

When the alert fires:

1. Identify the affected workload.
2. Check the last known heartbeat time.
3. Confirm Azure VM power state.
4. Confirm guest operating system availability.
5. Review monitoring agent status.
6. Review network connectivity.
7. Review recent configuration changes.
8. Confirm that other monitored systems are still reporting.
9. Determine whether the issue affects the VM or the monitoring pipeline.

## Validation

After remediation:

* Heartbeat telemetry should resume.
* The latest heartbeat timestamp should update.
* The alert condition should clear.
* No additional monitoring path failures should remain.

## Related KQL

Relevant query:

```text
monitoring/kql/vm-heartbeat.kql
```

## Cost Considerations

This alert design is documented only.

No Log Analytics workspace, data collection rule, or Azure Monitor log alert is deployed for this portfolio.

## Portfolio Note

This alert demonstrates missing-telemetry detection, KQL-based monitoring logic, operational investigation, and recovery validation without requiring paid Azure monitoring resources.
