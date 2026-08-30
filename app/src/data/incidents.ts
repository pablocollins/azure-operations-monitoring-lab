export type Incident = {
  id: string;
  slug: string;
  title: string;
  area: string;
  severity: string;
  status: "Resolved" | "Active";
  impact: string;
  symptoms: string[];
  evidence: string[];
  rootCause: string;
  remediation: string;
  validation: string;
  tools: string[];
  interactive: boolean;
};

export const incidents: Incident[] = [
  {
    id: "INC-001",
    slug: "inc-001",
    title: "RBAC Access Denied",
    area: "Identity & Access",
    severity: "SEV-3",
    status: "Resolved",
    impact:
      "A user cannot access the target Azure resource despite expecting operational access.",
    symptoms: [
      "Azure portal returns an authorization failure.",
      "The resource is visible but protected actions fail.",
      "The user reports that access worked previously.",
    ],
    evidence: [
      "User identity confirmed.",
      "Target resource scope verified.",
      "Effective Azure RBAC role assignments inspected.",
      "No valid role assignment found at the required scope.",
    ],
    rootCause:
      "The user did not have the required Azure RBAC role assignment at the target resource scope.",
    remediation:
      "Assign the minimum required Azure RBAC role at the appropriate scope and validate access.",
    validation:
      "The user successfully accesses the required resource without receiving an authorization error.",
    tools: [
      "Microsoft Entra ID",
      "Azure RBAC",
      "PowerShell",
      "Azure CLI",
    ],
    interactive: false,
  },

  {
    id: "INC-002",
    slug: "inc-002",
    title: "TCP/443 Connectivity Failure",
    area: "Networking",
    severity: "SEV-2",
    status: "Resolved",
    impact:
      "HTTPS traffic between the Linux workload and Windows Server is unavailable.",
    symptoms: [
      "Application connectivity over TCP/443 fails.",
      "Both virtual machines remain online.",
      "General IP connectivity remains available.",
    ],
    evidence: [
      "TCP/443 connectivity test fails.",
      "Source and destination IP configuration verified.",
      "Routing path reviewed.",
      "Network Security Group rules evaluated by priority.",
    ],
    rootCause:
      "A higher-priority NSG deny rule matched TCP/443 before the intended allow rule.",
    remediation:
      "Correct NSG rule priority so the intended HTTPS allow rule evaluates before the deny rule.",
    validation:
      "TCP/443 connectivity succeeds and the service becomes reachable again.",
    tools: [
      "Network Security Groups",
      "PowerShell",
      "Azure CLI",
      "Test-NetConnection",
    ],
    interactive: true,
  },

  {
    id: "INC-003",
    slug: "inc-003",
    title: "Monitoring Alert Failure",
    area: "Monitoring",
    severity: "SEV-3",
    status: "Resolved",
    impact:
      "A sustained high CPU condition occurs without triggering the expected alert.",
    symptoms: [
      "CPU utilization exceeds the expected threshold.",
      "Telemetry remains visible in monitoring data.",
      "No alert notification is generated.",
    ],
    evidence: [
      "CPU telemetry verified in Log Analytics.",
      "KQL confirms the threshold breach.",
      "Alert rule configuration inspected.",
      "Evaluation window does not match the failure pattern.",
    ],
    rootCause:
      "The Azure Monitor alert evaluation window was configured incorrectly, preventing the condition from satisfying the alert criteria.",
    remediation:
      "Adjust the evaluation period and alert logic so sustained CPU utilization is evaluated correctly.",
    validation:
      "A simulated sustained CPU condition now triggers the expected alert.",
    tools: [
      "Azure Monitor",
      "Log Analytics",
      "KQL",
      "Alert Rules",
    ],
    interactive: false,
  },

  {
    id: "INC-004",
    slug: "inc-004",
    title: "Azure VM Backup Failure",
    area: "Backup & Recovery",
    severity: "SEV-3",
    status: "Resolved",
    impact:
      "The scheduled VM backup fails, reducing recovery readiness.",
    symptoms: [
      "Backup job reports failed status.",
      "No new successful recovery point is created.",
      "Protected VM remains operational.",
    ],
    evidence: [
      "Backup job history reviewed.",
      "Recovery Services Vault checked.",
      "VM backup extension health inspected.",
      "Backup extension reports unhealthy state.",
    ],
    rootCause:
      "The Azure VM backup extension was unhealthy and prevented the scheduled backup from completing.",
    remediation:
      "Restore backup extension health and rerun the backup operation.",
    validation:
      "Backup completes successfully and a valid recovery point becomes available.",
    tools: [
      "Azure Backup",
      "Recovery Services Vault",
      "PowerShell",
      "Backup Jobs",
    ],
    interactive: false,
  },
];

export function getIncidentBySlug(slug: string) {
  return incidents.find((incident) => incident.slug === slug);
}