# Alert Design — High CPU

## Purpose

This document describes the conceptual design of a high CPU alert for the Azure Operations & Monitoring Lab.

The alert is documented for portfolio purposes and is not deployed in a live Azure environment.

## Alert Objective

Detect sustained CPU utilization that may indicate performance degradation or application instability.

## Target Workload

Conceptual target:

`vm-linux-app-01`

## Signal

Metric:

`Percentage CPU`

## Condition

Trigger when:

```text
Average CPU > 80%
```

## Evaluation Window

Conceptual evaluation:

```text
5 minutes
```

The alert should detect sustained CPU pressure rather than a single short spike.

## Severity

Suggested severity:

```text
Sev 2
```

Reason:

Sustained high CPU may affect application performance and requires operational investigation.

## Expected Workflow

```text
High CPU
   ↓
Azure Monitor
   ↓
Alert Rule
   ↓
Alert Triggered
   ↓
Cloud Operations
   ↓
Investigation
   ↓
Remediation
   ↓
Validation
```

## Investigation Steps

When the alert fires:

1. Confirm the affected VM.
2. Review CPU trend.
3. Identify the time window.
4. Review processes.
5. Review memory and disk.
6. Review recent changes.
7. Correlate with application symptoms.
8. Determine whether remediation is required.

## Related KQL

Relevant query:

```text
monitoring/kql/cpu-analysis.kql
```

## Validation

After remediation:

* CPU should return to an expected level.
* Application performance should recover.
* No repeated alert should occur unless the condition returns.
* Monitoring should continue to receive telemetry.

## Cost Considerations

This alert design is documented only.

No Azure Monitor alert rule or Log Analytics workspace is deployed for this portfolio, preserving the zero-cost-first strategy.

## Portfolio Note

This file demonstrates alert design, threshold selection, evaluation logic, and operational response planning without claiming live production execution.
