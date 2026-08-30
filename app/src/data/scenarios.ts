export type ScenarioStepType =
  | "detection"
  | "evidence"
  | "analysis"
  | "root-cause"
  | "remediation"
  | "validation";

export type ScenarioStep = {
  title: string;
  subtitle: string;
  type: ScenarioStepType;
  description: string;
  command?: string;
  output?: string;
  note?: string;
};

export type Scenario = {
  id: string;
  incidentId: string;
  title: string;
  area: string;
  severity: string;
  description: string;
  source?: string;
  destination?: string;
  affectedResource?: string;
  service?: string;
  steps: ScenarioStep[];
};

export const scenarios: Scenario[] = [
  {
    id: "rbac-access-denied",
    incidentId: "INC-001",
    title: "RBAC Access Denied",
    area: "Identity & Access",
    severity: "SEV-3",
    description:
      "A user cannot perform the expected operation because the required Azure RBAC assignment is missing at the target scope.",
    affectedResource: "rg-ops-lab",
    service: "Azure RBAC",
    steps: [
      {
        title: "Detection",
        subtitle: "Authorization failure reported",
        type: "detection",
        description:
          "A user reports an authorization error while attempting to access an Azure resource.",
        note:
          "The resource is visible, but the requested operation is denied.",
      },
      {
        title: "Evidence",
        subtitle: "Effective assignments inspected",
        type: "evidence",
        description:
          "Confirm the user identity and inspect role assignments before changing access.",
        command:
          "Get-AzRoleAssignment -SignInName user@contoso.com",
        output: `RoleDefinitionName : Reader
Scope              : /subscriptions/ops-lab-subscription
DisplayName        : Cloud Operator

No Contributor assignment found at:
/subscriptions/ops-lab-subscription/resourceGroups/rg-ops-lab`,
      },
      {
        title: "RBAC Analysis",
        subtitle: "Required scope compared",
        type: "analysis",
        description:
          "Compare the user's effective permissions with the permissions required by the target operation.",
        note:
          "Reader permissions allow viewing resources but do not allow the requested modification.",
      },
      {
        title: "Root Cause",
        subtitle: "Required role missing",
        type: "root-cause",
        description:
          "The user does not have the minimum required role assignment at the required scope.",
      },
      {
        title: "Remediation",
        subtitle: "Least-privilege role assigned",
        type: "remediation",
        description:
          "Assign the minimum role required for the operation at the resource group scope.",
        command:
          'New-AzRoleAssignment -SignInName user@contoso.com -RoleDefinitionName "Virtual Machine Contributor" -ResourceGroupName rg-ops-lab',
        output: `Role assignment created.
Scope : rg-ops-lab
Role  : Virtual Machine Contributor`,
      },
      {
        title: "Validation",
        subtitle: "Authorization restored",
        type: "validation",
        description:
          "Repeat the original operation and verify that access is now successful.",
        output: `AuthorizationResult : Allowed
Resource            : rg-ops-lab
Validation           : Successful`,
      },
    ],
  },

  {
    id: "network-https-failure",
    incidentId: "INC-002",
    title: "TCP/443 Connectivity Failure",
    area: "Networking",
    severity: "SEV-2",
    description:
      "An incorrect Network Security Group rule priority prevents HTTPS connectivity between two Azure workloads.",
    source: "vm-linux-app-01",
    destination: "vm-win-ops-01",
    service: "TCP/443",
    steps: [
      {
        title: "Detection",
        subtitle: "Connectivity alert received",
        type: "detection",
        description:
          "The monitoring layer reports an HTTPS connectivity failure between two workloads.",
        note:
          "Both virtual machines remain online, but the application path over TCP/443 is unavailable.",
      },
      {
        title: "Evidence",
        subtitle: "TCP/443 probe failed",
        type: "evidence",
        description:
          "Confirm the reported symptom before modifying network configuration.",
        command: "Test-NetConnection 10.10.1.20 -Port 443",
        output: `ComputerName     : 10.10.1.20
RemoteAddress    : 10.10.1.20
RemotePort       : 443
InterfaceAlias   : Ethernet
SourceAddress    : 10.10.1.10
TcpTestSucceeded : False`,
      },
      {
        title: "NSG Evaluation",
        subtitle: "Rule priority conflict detected",
        type: "analysis",
        description:
          "Evaluate Network Security Group rules in priority order.",
        output: `Priority 100  Allow-SSH    Allow
Priority 200  Deny-HTTPS   Deny   <- MATCHED
Priority 300  Allow-HTTPS  Allow  <- NOT EVALUATED`,
        note:
          "NSG processing stops at the first matching rule.",
      },
      {
        title: "Root Cause",
        subtitle: "Higher-priority deny rule matched",
        type: "root-cause",
        description:
          "A higher-priority deny rule matches TCP/443 before the intended allow rule.",
      },
      {
        title: "Remediation",
        subtitle: "Correct NSG rule priority",
        type: "remediation",
        description:
          "Reorder the NSG rules while preserving the intended security policy.",
        output: `Before:
200 -> DENY TCP/443
300 -> ALLOW TCP/443

After:
200 -> ALLOW TCP/443
300 -> DENY unmatched traffic`,
      },
      {
        title: "Validation",
        subtitle: "TCP/443 connectivity restored",
        type: "validation",
        description:
          "Repeat the connectivity test and validate service recovery.",
        command: "Test-NetConnection 10.10.1.20 -Port 443",
        output: `ComputerName     : 10.10.1.20
RemoteAddress    : 10.10.1.20
RemotePort       : 443
InterfaceAlias   : Ethernet
SourceAddress    : 10.10.1.10
TcpTestSucceeded : True`,
      },
    ],
  },

  {
    id: "monitoring-alert-failure",
    incidentId: "INC-003",
    title: "Monitoring Alert Failure",
    area: "Monitoring",
    severity: "SEV-3",
    description:
      "A sustained CPU condition is visible in telemetry but does not trigger the expected Azure Monitor alert.",
    affectedResource: "vm-linux-app-01",
    service: "Azure Monitor",
    steps: [
      {
        title: "Detection",
        subtitle: "Alert did not trigger",
        type: "detection",
        description:
          "Operations identifies sustained CPU pressure without a corresponding alert.",
        note:
          "Telemetry exists, so the investigation focuses on alert logic rather than data collection.",
      },
      {
        title: "Evidence",
        subtitle: "CPU telemetry confirmed",
        type: "evidence",
        description:
          "Use KQL to verify that the high CPU condition is present in monitoring data.",
        command: `Perf
| where CounterName == "% Processor Time"
| summarize AvgCPU = avg(CounterValue) by bin(TimeGenerated, 5m)
| order by TimeGenerated desc`,
        output: `TimeGenerated          AvgCPU
---------------------  ------
01:20                  91.2
01:15                  93.6
01:10                  89.7
01:05                  92.1`,
      },
      {
        title: "Alert Analysis",
        subtitle: "Evaluation window inspected",
        type: "analysis",
        description:
          "Inspect the alert threshold, aggregation and evaluation window.",
        output: `Threshold          : 85%
Aggregation         : Average
Evaluation Frequency: 5 minutes
Evaluation Window   : 1 minute`,
        note:
          "The evaluation window is too short to represent the sustained five-minute CPU pattern.",
      },
      {
        title: "Root Cause",
        subtitle: "Evaluation window misconfigured",
        type: "root-cause",
        description:
          "The alert evaluation window does not match the intended sustained CPU condition.",
      },
      {
        title: "Remediation",
        subtitle: "Alert logic corrected",
        type: "remediation",
        description:
          "Change the alert window so the monitoring rule evaluates the intended duration.",
        output: `Updated Alert Configuration

Threshold          : 85%
Aggregation         : Average
Evaluation Frequency: 5 minutes
Evaluation Window   : 5 minutes`,
      },
      {
        title: "Validation",
        subtitle: "Alert fires successfully",
        type: "validation",
        description:
          "Replay the sustained CPU condition and validate that the alert is generated.",
        output: `Alert Rule       : high-cpu-sustained
Status           : Fired
Severity         : 2
Resource         : vm-linux-app-01
Validation       : Successful`,
      },
    ],
  },

  {
    id: "backup-failure",
    incidentId: "INC-004",
    title: "Azure VM Backup Failure",
    area: "Backup & Recovery",
    severity: "SEV-3",
    description:
      "A scheduled Azure VM backup fails because the VM backup extension is unhealthy.",
    affectedResource: "vm-win-ops-01",
    service: "Azure Backup",
    steps: [
      {
        title: "Detection",
        subtitle: "Scheduled backup failed",
        type: "detection",
        description:
          "The latest scheduled backup job reports a failed status.",
        note:
          "The virtual machine itself remains online.",
      },
      {
        title: "Evidence",
        subtitle: "Backup job inspected",
        type: "evidence",
        description:
          "Review recent backup jobs and identify the failing workload.",
        command:
          "Get-AzRecoveryServicesBackupJob | Select WorkloadName, Status, Operation",
        output: `WorkloadName       Status  Operation
-----------------  ------  ---------
vm-win-ops-01      Failed  Backup
vm-linux-app-01    Completed Backup`,
      },
      {
        title: "Extension Analysis",
        subtitle: "Backup extension unhealthy",
        type: "analysis",
        description:
          "Inspect the VM backup extension health and recovery readiness.",
        output: `Extension             Status
--------------------  ---------
VMSnapshot             Unhealthy
ProvisioningState      Failed
LatestRecoveryPoint    Stale`,
      },
      {
        title: "Root Cause",
        subtitle: "VM backup extension failure",
        type: "root-cause",
        description:
          "The unhealthy VM backup extension prevents the backup workflow from completing.",
      },
      {
        title: "Remediation",
        subtitle: "Extension health restored",
        type: "remediation",
        description:
          "Restore the backup extension to a healthy state and rerun the backup.",
        output: `Backup extension health : Healthy
Manual backup requested : Yes
Job status              : InProgress`,
      },
      {
        title: "Validation",
        subtitle: "Recovery point created",
        type: "validation",
        description:
          "Verify that the backup completes and produces a usable recovery point.",
        output: `WorkloadName       : vm-win-ops-01
BackupStatus       : Completed
RecoveryPoint      : Available
RecoveryValidation : Successful`,
      },
    ],
  },
];

export function getScenarioById(id: string) {
  return scenarios.find((scenario) => scenario.id === id);
}

export function getScenarioByIncidentId(incidentId: string) {
  return scenarios.find(
    (scenario) => scenario.incidentId === incidentId
  );
}