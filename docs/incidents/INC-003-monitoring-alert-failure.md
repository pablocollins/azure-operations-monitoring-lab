# INC-003 — Monitoring Alert Failure

## Incident Summary

A monitored workload experienced sustained high CPU utilization, but the expected Azure Monitor alert was not triggered.

The incident is investigated by reviewing monitoring signals, KQL results, threshold configuration, evaluation logic, and alert design.

This incident is simulated for portfolio and troubleshooting demonstration purposes.

## Incident Classification

| Field             | Value                             |
| ----------------- | --------------------------------- |
| Incident ID       | `INC-003`                         |
| Category          | Monitoring                        |
| Severity          | SEV-3                             |
| Status            | Resolved                          |
| Environment       | Azure Operations & Monitoring Lab |
| Affected Resource | `vm-linux-app-01`                 |
| Incident Type     | Simulated                         |

## Business Impact

The application workload experienced sustained CPU pressure.

Because the expected alert did not trigger, the Cloud Operations team was not notified automatically.

In a production environment, this could delay incident detection and increase application degradation time.

## Reported Symptoms

The following symptoms are reported:

* Application performance degraded.
* CPU utilization increased significantly.
* Monitoring telemetry was still available.
* No alert notification was received.
* The VM remained available.

## Expected Monitoring Behavior

Conceptual alert design:

```text
Target:        vm-linux-app-01
Signal:        Percentage CPU
Condition:     Average CPU > 80%
Severity:      Sev 2
```

Expected outcome:

```text
CPU > 80%
    ↓
Alert condition met
    ↓
Azure Monitor alert
    ↓
Cloud Operations notified
```

Observed outcome:

```text
CPU > 80%
    ↓
No alert triggered
```

## Initial Assessment

The absence of an alert may be caused by:

* Missing telemetry
* Incorrect target resource
* Incorrect metric
* Incorrect threshold
* Incorrect aggregation
* Incorrect evaluation window
* Disabled alert rule
* Notification configuration problem

The monitoring pipeline should be investigated before modifying the alert.

## Step 1 — Confirm Telemetry Exists

The first step is to confirm whether CPU telemetry was actually collected.

Relevant KQL file:

```text
monitoring/kql/cpu-analysis.kql
```

Example query:

```kusto
Perf
| where CounterName == "% Processor Time"
| where InstanceName == "_Total"
| summarize AverageCPU = avg(CounterValue)
    by Computer, bin(TimeGenerated, 5m)
| order by TimeGenerated desc
```

## Simulated CPU Evidence

The following data is simulated and is not the result of a live Azure deployment.

```text
Computer           Time                 AverageCPU
-----------------  -------------------  ----------
vm-linux-app-01    10:00                42
vm-linux-app-01    10:05                78
vm-linux-app-01    10:10                86
vm-linux-app-01    10:15                91
vm-linux-app-01    10:20                88
vm-linux-app-01    10:25                84
vm-linux-app-01    10:30                67
```

The data confirms that CPU utilization exceeded 80% for several consecutive intervals.

## Step 2 — Confirm Monitoring Availability

Heartbeat telemetry is also reviewed to confirm that the workload continued to report monitoring data.

Relevant KQL file:

```text
monitoring/kql/vm-heartbeat.kql
```

Simulated result:

```text
Computer           LastHeartbeat
-----------------  -------------------
vm-linux-app-01    10:30
```

Result:

```text
Monitoring telemetry available.
```

This reduces the likelihood that the alert failure was caused by a general telemetry outage.

## Step 3 — Review Alert Configuration

The alert configuration is reviewed.

### Simulated Alert Configuration

```text
Signal:             Percentage CPU
Aggregation:        Average
Threshold:          Greater than 80%
Evaluation Window:  30 minutes
Evaluation:         Every 5 minutes
Severity:           Sev 2
Status:             Enabled
```

## Step 4 — Analyze the Evaluation Window

The workload exceeded 80% CPU for approximately 20 minutes.

However, the alert was configured to evaluate the average CPU across a 30-minute window.

Earlier lower CPU values reduced the 30-minute average below the configured threshold.

Example conceptual calculation:

```text
42 + 78 + 86 + 91 + 88 + 84
-----------------------------
             6

Average ≈ 78%
```

Therefore:

```text
30-minute average < 80%
```

and the alert condition was not met.

## Root Cause

The alert evaluation window was too large for the intended operational requirement.

Although CPU utilization exceeded 80% for several consecutive five-minute intervals, the longer averaging window included earlier lower values and prevented the alert from triggering.

Root cause:

```text
Alert evaluation logic did not match the intended detection requirement.
```

## Remediation

The alert design should be adjusted to detect sustained high CPU over a shorter operational window.

Conceptual corrected configuration:

```text
Signal:             Percentage CPU
Aggregation:        Average
Threshold:          Greater than 80%
Evaluation Window:  5 minutes
Evaluation:         Every 5 minutes
Severity:           Sev 2
```

The final threshold and evaluation period should be validated against actual workload behavior to reduce false positives and alert noise.

## Validation

After the conceptual remediation, the alert should be tested against the same simulated CPU pattern.

Expected behavior:

```text
10:10 → Average CPU > 80%
10:15 → Average CPU > 80%
10:20 → Average CPU > 80%
```

Expected result:

```text
Alert condition met
    ↓
Alert triggered
    ↓
Cloud Operations notified
```

Validation should confirm:

* CPU telemetry is available.
* The rule evaluates the correct resource.
* The threshold matches the operational requirement.
* The alert triggers when the condition is sustained.
* The alert clears when the condition no longer exists.

## Preventive Actions

Recommended preventive actions include:

* Define alert requirements before creating the rule.
* Validate thresholds against workload behavior.
* Validate aggregation type.
* Review evaluation windows.
* Test alerts after deployment.
* Document alert logic.
* Periodically review alert usefulness.
* Remove or tune noisy alerts.

## Tools Used

The investigation methodology uses:

* Azure Monitor concepts
* Log Analytics
* KQL
* Metric analysis
* Alert rule analysis
* Operational troubleshooting

Related repository files:

```text
docs/operations/monitoring.md
monitoring/kql/cpu-analysis.kql
monitoring/kql/vm-heartbeat.kql
monitoring/kql/memory-analysis.kql
monitoring/alerts/high-cpu-alert.md
monitoring/alerts/vm-heartbeat-alert.md
```

## Lessons Learned

An alert can be technically enabled and correctly connected to telemetry while still failing to detect the intended operational condition.

Monitoring troubleshooting should therefore validate:

```text
Telemetry
    ↓
Signal
    ↓
Aggregation
    ↓
Threshold
    ↓
Evaluation Window
    ↓
Alert State
    ↓
Notification
```

Alert configuration should reflect the behavior the operations team actually wants to detect.

## Portfolio Note

This incident is intentionally simulated because the project follows a zero-cost strategy and does not depend on a live Log Analytics workspace or Azure Monitor alert rule.

The investigation methodology, KQL logic, root cause analysis, remediation strategy, and validation workflow represent how the incident would be approached in a live Azure environment.
