# Monitoring Operations

## Purpose

This document describes the monitoring and observability approach used in the Azure Operations & Monitoring Lab.

The objective is to detect operational issues, investigate them using metrics and logs, and validate recovery through repeatable monitoring procedures.

## Monitoring Model

The monitoring workflow used in this lab is:

```text
Azure Resource
      ↓
Metrics / Logs
      ↓
Azure Monitor
      ↓
Log Analytics
      ↓
KQL Queries
      ↓
Alert Rules
      ↓
Operational Investigation
      ↓
Remediation
      ↓
Validation
```

## Metrics

Metrics are numerical measurements collected over time.

Typical examples include:

* CPU percentage
* Disk operations
* Network traffic
* Availability signals
* Request counts

Metrics are useful for:

* Trend analysis
* Threshold-based alerts
* Performance monitoring
* Capacity analysis

Example operational question:

```text
Has CPU utilization remained above 80% for the last 10 minutes?
```

## Logs

Logs contain event-based or structured records that provide more detailed operational context.

Examples include:

* VM heartbeat data
* Performance counter data
* Application events
* Security events
* Diagnostic events
* Resource logs

Logs are useful for investigating:

* What happened
* When it happened
* Which resource was affected
* What pattern occurred before or after an incident

## Azure Monitor

Azure Monitor is the central monitoring service used to collect, analyze, and act on telemetry from Azure resources and workloads.

In this lab, Azure Monitor represents the operational monitoring layer.

The portfolio focuses on:

* Metrics
* Logs
* Alerting
* Investigation
* Validation

## Log Analytics

Log Analytics provides a query environment for Azure Monitor Logs.

Operational teams can use Log Analytics to investigate telemetry collected from multiple Azure resources.

Queries are written using Kusto Query Language (KQL).

## Kusto Query Language

KQL is used to search, filter, summarize, correlate, and analyze log data.

Example questions include:

* Which VM stopped sending heartbeat data?
* Which host had the highest CPU utilization?
* When did CPU usage increase?
* Which systems generated repeated errors?
* Did telemetry return after remediation?

## Example Heartbeat Query

```kusto
Heartbeat
| summarize LastHeartbeat=max(TimeGenerated) by Computer
| order by LastHeartbeat desc
```

This query returns the most recent heartbeat detected for each computer.

Operational use:

* Identify hosts that stopped reporting
* Compare last known telemetry time
* Validate monitoring recovery

## Example CPU Query

```kusto
Perf
| where CounterName == "% Processor Time"
| summarize AverageCPU=avg(CounterValue)
    by Computer, bin(TimeGenerated, 5m)
| order by TimeGenerated desc
```

This query summarizes CPU utilization in five-minute intervals.

Operational use:

* Identify sustained CPU pressure
* Investigate performance incidents
* Compare systems
* Validate post-remediation behavior

## Monitoring Investigation Flow

When a monitoring-related incident occurs, the operator should review:

1. Affected resource
2. Reported symptom
3. Metric data
4. Relevant logs
5. Query results
6. Alert configuration
7. Alert evaluation criteria
8. Notification configuration
9. Recent changes
10. Recovery evidence

## Alerting Principles

Alerts should be designed to detect actionable conditions.

An alert should define:

* Signal
* Condition
* Threshold
* Evaluation period
* Severity
* Target resource
* Notification or action
* Operational response

Alerts should avoid unnecessary noise.

An alert that fires too frequently without operational value can reduce trust in monitoring.

## Example CPU Alert

Conceptual alert:

```text
Signal:           Percentage CPU
Condition:        Greater than
Threshold:        80%
Evaluation:       5 minutes
Severity:         Sev 2
Target:           vm-linux-app-01
```

The exact threshold should be based on workload behavior and operational requirements rather than copied blindly between systems.

## Example Missing Heartbeat Alert

Conceptual condition:

```text
Expected heartbeat
        ↓
No recent telemetry
        ↓
Alert
        ↓
Operator investigation
```

A missing heartbeat may indicate:

* VM unavailable
* Monitoring agent issue
* Network problem
* Workspace connectivity problem
* Configuration issue

The alert identifies the symptom but does not automatically identify the root cause.

## Alert Troubleshooting

If an expected alert does not fire, investigate:

1. Is telemetry being collected?
2. Is the correct resource monitored?
3. Is the signal or query correct?
4. Is the threshold correct?
5. Is the evaluation window appropriate?
6. Is the alert enabled?
7. Is the action group or notification path configured?
8. Did the condition actually meet the trigger criteria?

## Evidence Collection

Useful monitoring evidence includes:

* Metric values
* KQL query results
* Alert configuration
* Alert history
* Timestamps
* Resource names
* Monitoring agent status
* Validation queries

## Cost Considerations

Azure Monitor Logs and Log Analytics may generate costs depending on data ingestion, retention, and configuration.

This portfolio does not require a live Log Analytics workspace.

KQL queries, monitoring procedures, alert designs, and simulated outputs are documented without requiring permanent paid monitoring resources.

## Planned Incident

The monitoring workflow will be demonstrated through:

**INC-003 — Monitoring Alert Failure**

Scenario:

A workload experiences sustained high CPU utilization, but the expected operational alert is not triggered.

The investigation will demonstrate:

* Metric versus log analysis
* KQL investigation
* Alert rule review
* Threshold analysis
* Evaluation window analysis
* Root cause identification
* Alert remediation
* Post-remediation validation

## Portfolio Note

Monitoring evidence used in this repository is clearly identified as simulated where no live Azure workspace exists.

The objective is to demonstrate monitoring methodology, KQL skills, alert design, and troubleshooting reasoning without creating unnecessary Azure costs.
