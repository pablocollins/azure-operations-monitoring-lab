Azure Operations & Monitoring Lab
Overview

Azure Operations & Monitoring Lab is a portfolio project focused on practical Azure administration, operations, monitoring, automation, and troubleshooting.

The project simulates a small enterprise Azure environment managed by a Cloud Operations team.

The primary goal is to demonstrate operational Azure skills rather than infrastructure provisioning.

Project Objectives

This lab is designed to demonstrate practical experience with:

Azure Virtual Machines
Virtual Networks and Subnets
Network Security Groups (NSGs)
Microsoft Entra ID
Azure Role-Based Access Control (RBAC)
Managed Identities
Azure Monitor
Log Analytics
Kusto Query Language (KQL)
Azure Alerts
Azure Backup
PowerShell
Azure CLI
Incident troubleshooting
Business Scenario

Contoso Operations runs a small Azure environment containing Windows and Linux workloads.

The Cloud Operations team is responsible for:

Identity and access management
Virtual machine administration
Network connectivity
Monitoring and alerting
Backup and recovery
Operational automation
Incident response
Architecture

The lab is based on the following logical components:

Microsoft Entra ID for identity and authentication
Azure RBAC for authorization
Azure Virtual Network for network isolation
Separate server and management subnets
Windows and Linux virtual machines
Network Security Groups for traffic filtering
Managed Identities for workload authentication
Azure Monitor and Log Analytics for observability
Azure Backup for recovery
Network Design
Resource	Address Space
vnet-ops-lab	10.10.0.0/16
snet-servers	10.10.1.0/24
snet-management	10.10.2.0/24
Operational Scenarios

The project will include troubleshooting scenarios involving:

RBAC authorization failures
Network connectivity problems
Monitoring and alert failures
Backup and recovery failures

Each incident will include investigation steps, diagnostic commands, root cause analysis, remediation, validation, and preventive actions.

Cost Strategy

This project follows a zero-cost-first approach.

Azure services that may normally generate charges are included in the architecture for learning and documentation purposes, but paid resources are not required to remain deployed.

Any temporary deployment must be evaluated before creation and removed after testing.

The GitHub repository is the permanent deliverable of the project.

Disclaimer

This project is a personal portfolio lab designed to simulate Azure operational responsibilities and troubleshooting scenarios. It does not represent a production environment.