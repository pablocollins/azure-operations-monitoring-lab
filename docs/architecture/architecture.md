# Architecture

## Purpose

The Azure Operations & Monitoring Lab simulates a small enterprise Azure environment operated by a Cloud Operations team.

The objective is to demonstrate practical Azure administration, monitoring, automation, security, and troubleshooting skills.

## Logical Architecture

The environment is designed around the following operational layers:

### Identity

Microsoft Entra ID provides identity and authentication for administrators and workloads.

Azure Role-Based Access Control (RBAC) provides authorization to Azure resources.

### Networking

An Azure Virtual Network provides network isolation for the environment.

The network is logically divided into server and management subnets.

Network Security Groups control network traffic according to least-privilege principles.

### Compute

Windows and Linux virtual machines represent enterprise workloads managed by the Cloud Operations team.

### Monitoring

Azure Monitor and Log Analytics provide monitoring and centralized log analysis.

Kusto Query Language (KQL) is used to investigate operational events and troubleshoot incidents.

### Protection

Azure Backup represents the backup and recovery layer of the environment.

## Core Components

| Component               | Purpose                              |
| ----------------------- | ------------------------------------ |
| Microsoft Entra ID      | Identity and authentication          |
| Azure RBAC              | Authorization                        |
| Azure Virtual Network   | Network isolation                    |
| Azure Subnets           | Network segmentation                 |
| Network Security Groups | Network traffic filtering            |
| Azure Virtual Machines  | Windows and Linux workloads          |
| Managed Identities      | Passwordless workload authentication |
| Azure Monitor           | Monitoring and observability         |
| Log Analytics           | Centralized log analysis             |
| KQL                     | Log investigation                    |
| Azure Alerts            | Operational notifications            |
| Azure Backup            | Backup and recovery                  |

## Design Principles

The environment follows several operational principles:

* Least privilege access
* Network segmentation
* No hardcoded credentials
* Managed identities where appropriate
* Centralized monitoring
* Repeatable troubleshooting procedures
* Documented incident response
* Cost awareness

## Cost Considerations

This architecture represents the target operational environment.

Resources that can generate Azure charges do not need to remain deployed for the portfolio project.

Where practical, configuration, scripts, queries, runbooks, and simulated incidents are documented without maintaining paid Azure resources.
