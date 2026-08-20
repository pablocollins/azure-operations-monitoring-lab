# Azure Operations & Monitoring Lab

> Enterprise-style Azure administration, monitoring, automation, and troubleshooting lab designed as a zero-cost portfolio project.

## Overview

Azure Operations & Monitoring Lab is a portfolio project focused on the day-to-day responsibilities of an **Azure Administrator / Junior Cloud Engineer**.

Rather than focusing on infrastructure provisioning, this project demonstrates how a Cloud Operations team would operate, monitor, troubleshoot, and recover a small Azure environment.

The repository contains:

- Operational documentation
- Troubleshooting runbooks
- PowerShell automation
- Azure CLI workflows
- KQL queries
- Monitoring and alert designs
- Simulated production-style incidents
- Root cause analysis and remediation procedures

The Azure environment is intentionally **not deployed as permanent infrastructure**. The architecture, commands, scripts, monitoring queries, and incident evidence are documented or simulated to keep the project at **zero Azure cost**.

---

## Business Scenario

A fictional Cloud Operations team manages a small Azure environment containing Windows and Linux workloads.

The team is responsible for:

- Identity and access management
- Virtual machine operations
- Network connectivity
- Monitoring and alerting
- Backup and recovery
- Operational automation
- Incident response
- Root cause analysis

The lab is designed around the operational lifecycle:

```text
Monitor
   ↓
Detect
   ↓
Investigate
   ↓
Diagnose
   ↓
Remediate
   ↓
Validate
   ↓
Document
```

---

## Architecture

The conceptual environment includes:

- Microsoft Entra ID
- Azure Role-Based Access Control (RBAC)
- Managed Identities
- Azure Virtual Network
- Server and management subnets
- Network Security Groups
- Windows Server VM
- Linux VM
- Azure Monitor
- Log Analytics
- KQL
- Azure Monitor Alerts
- Recovery Services Vault
- Azure Backup

### Logical Architecture

```text
                    Microsoft Entra ID
                           |
                    Authentication
                           |
                           v
                       Azure RBAC
                           |
          +----------------+----------------+
          |                                 |
          v                                 v
   Cloud Operations                 Managed Identities
          |
          v
+-------------------------------------------------------+
|                 Azure Subscription                    |
|                                                       |
|  Resource Group: rg-ops-lab                           |
|                                                       |
|  +-------------------------------------------------+  |
|  | VNet: vnet-ops-lab  10.10.0.0/16               |  |
|  |                                                 |  |
|  |  snet-servers          snet-management          |  |
|  |  10.10.1.0/24         10.10.2.0/24             |  |
|  |       |                       |                 |  |
|  |       +-- vm-win-ops-01       |                 |  |
|  |       +-- vm-linux-app-01     |                 |  |
|  |                                                 |  |
|  |            Network Security Groups              |  |
|  +-------------------------------------------------+  |
|                                                       |
|  Azure Monitor ---> Log Analytics ---> KQL            |
|         |                                             |
|         +------------> Alert Rules                    |
|                                                       |
|  Azure Backup ---> Recovery Services Vault            |
+-------------------------------------------------------+
```

---

## Network Design

| Resource | Address Space |
|---|---|
| `vnet-ops-lab` | `10.10.0.0/16` |
| `snet-servers` | `10.10.1.0/24` |
| `snet-management` | `10.10.2.0/24` |

The networking documentation covers:

- VNet and subnet design
- NSG evaluation
- Rule priority
- TCP connectivity troubleshooting
- Routing
- Guest OS firewall checks
- Application listener validation

---

## Operational Areas

### Identity & RBAC

The identity and authorization section covers:

- Microsoft Entra ID concepts
- Azure RBAC
- Scope inheritance
- Least privilege
- Role assignment investigation
- Managed Identity concepts
- Access-denied troubleshooting

### Virtual Machine Operations

Windows and Linux operational procedures include:

- Azure VM power state
- Guest OS health
- CPU and memory
- Disk utilization
- Network configuration
- Services and processes
- TCP listeners
- Restart decision procedures

### Networking

Network troubleshooting follows a layered approach:

```text
Source
  ↓
NIC
  ↓
IP / Subnet
  ↓
NSG
  ↓
Routing
  ↓
Guest OS Firewall
  ↓
Application Listener
```

### Monitoring & KQL

The monitoring section demonstrates:

- Azure Monitor concepts
- Metrics versus logs
- Log Analytics
- KQL
- Heartbeat analysis
- CPU analysis
- Memory analysis
- Alert thresholds
- Evaluation windows
- Monitoring troubleshooting

### Backup & Recovery

Backup operations cover:

- Recovery Services Vault concepts
- Backup policies
- Backup job investigation
- Recovery points
- RPO and RTO
- Restore planning
- Recovery validation

---

## Incident Portfolio

Four production-style incidents are documented.

| Incident | Area | Scenario | Root Cause |
|---|---|---|---|
| `INC-001` | Identity & RBAC | Access denied to Azure resource | Incorrect/missing RBAC assignment |
| `INC-002` | Networking | TCP/443 connectivity failure | Incorrect NSG rule priority |
| `INC-003` | Monitoring | High CPU alert did not trigger | Incorrect alert evaluation window |
| `INC-004` | Backup | Scheduled VM backup failed | Unhealthy VM backup extension |

Each incident follows a structured workflow:

```text
Incident
   ↓
Symptoms
   ↓
Evidence Collection
   ↓
Hypothesis
   ↓
Investigation
   ↓
Root Cause
   ↓
Remediation
   ↓
Validation
   ↓
Preventive Actions
```

Incident documentation is available under:

```text
docs/incidents/
```

---

## PowerShell Automation

PowerShell scripts are included for operational diagnostics and auditing.

Examples include:

- VM health checks
- Network diagnostics
- Backup status auditing

Scripts are designed around safe operational principles and favor **read-only investigation before remediation**.

Location:

```text
scripts/powershell/
```

---

## Azure CLI

Azure CLI workflows provide command-line alternatives for operational investigation.

Examples include:

- VM status checks
- NIC inspection
- Network diagnostics
- Backup job auditing

Location:

```text
scripts/azure-cli/
```

---

## KQL Queries

Reusable KQL queries are included for monitoring investigations.

### VM Heartbeat

Used to identify the latest telemetry received from monitored systems.

### CPU Analysis

Used to analyze CPU utilization over five-minute intervals.

### Memory Analysis

Used to analyze available memory over time.

Location:

```text
monitoring/kql/
```

---

## Alert Design

The repository includes conceptual Azure Monitor alert designs for:

- Sustained high CPU
- Missing VM heartbeat

The alert documentation covers:

- Signal selection
- Thresholds
- Aggregation
- Evaluation windows
- Severity
- Investigation
- Validation

Location:

```text
monitoring/alerts/
```

---

## Runbooks

Operational runbooks provide repeatable procedures for common support scenarios.

Examples include:

- RBAC access denied
- VM unreachable
- VM health checks
- Azure Backup failure

Location:

```text
runbooks/
```
## Project Navigation

### Architecture

- [Architecture Overview](docs/architecture/architecture.md)
- [Identity Design](docs/architecture/identity-design.md)
- [Network Design](docs/architecture/network-design.md)

### Operations

- [Identity & RBAC Operations](docs/operations/identity-and-rbac.md)
- [Networking Operations](docs/operations/networking.md)
- [Virtual Machine Administration](docs/operations/vm-administration.md)
- [Monitoring Operations](docs/operations/monitoring.md)
- [Backup & Recovery Operations](docs/operations/backup-and-recovery.md)

### Incident Investigations

- [INC-001 — RBAC Access Denied](docs/incidents/INC-001-rbac-access-denied.md)
- [INC-002 — Network Connectivity Failure](docs/incidents/INC-002-network-connectivity.md)
- [INC-003 — Monitoring Alert Failure](docs/incidents/INC-003-monitoring-alert-failure.md)
- [INC-004 — Azure VM Backup Failure](docs/incidents/INC-004-backup-failure.md)

### Runbooks

- [RBAC Access Denied](runbooks/rbac-access-denied.md)
- [VM Unreachable](runbooks/vm-unreachable.md)
- [VM Health Check](runbooks/vm-health-check.md)
- [Azure Backup Failure](runbooks/backup-failure.md)

### PowerShell

- [RBAC Audit](scripts/powershell/rbac-audit.ps1)
- [Network Diagnostics](scripts/powershell/network-diagnostics.ps1)
- [VM Health Check](scripts/powershell/vm-health-check.ps1)
- [Backup Status](scripts/powershell/backup-status.ps1)

### Azure CLI

- [RBAC Audit](scripts/azure-cli/rbac-audit.sh)
- [Network Diagnostics](scripts/azure-cli/network-diagnostics.sh)
- [VM Health Check](scripts/azure-cli/vm-health-check.sh)
- [Backup Status](scripts/azure-cli/backup-status.sh)

### Monitoring

**KQL**

- [VM Heartbeat](monitoring/kql/vm-heartbeat.kql)
- [CPU Analysis](monitoring/kql/cpu-analysis.kql)
- [Memory Analysis](monitoring/kql/memory-analysis.kql)

**Alert Designs**

- [High CPU Alert](monitoring/alerts/high-cpu-alert.md)
- [Missing VM Heartbeat Alert](monitoring/alerts/vm-heartbeat-alert.md)
---

## Repository Structure

```text
azure-operations-monitoring-lab/
│
├── docs/
│   ├── architecture/
│   ├── incidents/
│   └── operations/
│
├── monitoring/
│   ├── alerts/
│   └── kql/
│
├── runbooks/
│
├── scripts/
│   ├── azure-cli/
│   └── powershell/
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## Skills Demonstrated

This project demonstrates knowledge and operational reasoning across:

**Azure Administration**

- Azure Virtual Machines
- Virtual Networks
- Subnets
- Network Security Groups
- Microsoft Entra ID
- Azure RBAC
- Managed Identities
- Azure Monitor
- Log Analytics
- Azure Backup

**Operations & Troubleshooting**

- Incident investigation
- Evidence collection
- Root cause analysis
- Network troubleshooting
- Access troubleshooting
- VM health assessment
- Monitoring troubleshooting
- Backup failure investigation
- Recovery planning
- Post-remediation validation

**Automation & Querying**

- PowerShell
- Azure CLI
- Kusto Query Language (KQL)
- Git
- GitHub
- Markdown documentation

---

## Operational Principles

Several principles are applied throughout the project:

1. **Collect evidence before making changes.**
2. **Troubleshoot systematically rather than guessing.**
3. **Apply least privilege to access management.**
4. **Treat alerts as symptoms, not root causes.**
5. **Validate service recovery after remediation.**
6. **Treat backup as a recovery capability, not only a successful job.**
7. **Document incidents and preventive actions.**

---

## Zero-Cost Strategy

This project intentionally avoids deploying permanent Azure resources.

Services such as:

- Virtual Machines
- Log Analytics
- Azure Monitor alert rules
- Recovery Services Vaults
- Azure Backup

may generate charges in a live environment.

For this reason, they are represented through architecture documentation, operational procedures, scripts, KQL queries, alert designs, and clearly labelled simulated incident evidence.

The permanent deliverable is this GitHub repository.

**Azure cost for the documented lab implementation: €0.**

---

## Execution Transparency

This repository distinguishes between:

**Locally validated tooling**

- Git
- Azure CLI installation
- Azure PowerShell modules
- PowerShell scripting environment

and:

**Documented / simulated Azure operations**

- Azure VM operations
- RBAC incident scenarios
- Azure networking incidents
- Azure Monitor telemetry
- Log Analytics query results
- Azure Monitor alerts
- Azure Backup jobs and recovery points

Simulated evidence is explicitly labelled inside the relevant incident documentation.

This approach keeps the portfolio technically transparent while demonstrating how the procedures would be performed in a live Azure environment.

---

## Project Goal

The goal of this project is to demonstrate readiness for roles such as:

- Junior Azure Administrator
- Junior Cloud Engineer
- Cloud Operations Engineer
- Azure Support Engineer

The emphasis is not on provisioning infrastructure, but on **operating it safely, diagnosing failures, automating repetitive investigation, and documenting technical decisions clearly**.

---

## Disclaimer

This is a personal portfolio project based on a fictional enterprise scenario.

It is not a production Azure environment, and simulated outputs are not presented as live Azure execution evidence.