# Network Design

## Overview

The Azure Operations & Monitoring Lab uses a segmented virtual network designed to simulate a small enterprise Azure environment.

The network design focuses on simplicity, security, troubleshooting, and operational visibility.

## Virtual Network

| Property      | Value                                          |
| ------------- | ---------------------------------------------- |
| Name          | `vnet-ops-lab`                                 |
| Address Space | `10.10.0.0/16`                                 |
| Purpose       | Primary private network for the operations lab |

The `/16` address space provides sufficient room to create multiple subnets while maintaining a simple and predictable addressing scheme.

## Subnet Design

### Server Subnet

| Property      | Value                                    |
| ------------- | ---------------------------------------- |
| Name          | `snet-servers`                           |
| Address Range | `10.10.1.0/24`                           |
| Purpose       | Hosts Windows and Linux server workloads |

Planned workloads:

* `vm-win-ops-01`
* `vm-linux-app-01`

### Management Subnet

| Property      | Value                                              |
| ------------- | -------------------------------------------------- |
| Name          | `snet-management`                                  |
| Address Range | `10.10.2.0/24`                                     |
| Purpose       | Represents management and administrative workloads |

Separating server and management workloads allows network traffic to be controlled according to its source, destination, protocol, and port.

## Network Security

Network Security Groups (NSGs) are used to control inbound and outbound network traffic.

The primary NSG for the server subnet is:

`nsg-servers`

Security rules should follow the principle of least privilege.

Only explicitly required traffic should be permitted.

## Traffic Flow

Example permitted management traffic:

Management subnet:

`10.10.2.0/24`

↓

Network Security Group

↓

TCP/443

↓

Server subnet:

`10.10.1.0/24`

## Security Principles

The network design follows these principles:

* Network segmentation
* Least-privilege connectivity
* Explicit traffic requirements
* Predictable IP addressing
* Documented NSG rules
* Repeatable troubleshooting procedures

## Troubleshooting Approach

Network connectivity incidents should be investigated systematically.

The troubleshooting process includes:

1. Validate virtual machine power state.
2. Validate NIC configuration.
3. Confirm source and destination IP addresses.
4. Confirm subnet configuration.
5. Review NSG rules.
6. Review effective security rules.
7. Validate routing.
8. Test network connectivity.
9. Review the guest operating system firewall.
10. Confirm that the destination application is listening on the expected port.

Changes should only be made after evidence identifies the likely root cause.

## Planned Incident Scenario

The lab will include a simulated network connectivity incident:

**INC-002 — Network Connectivity Failure**

A workload will be unable to communicate with another workload over TCP/443.

The incident investigation will demonstrate:

* Connectivity testing
* NSG analysis
* Effective security rule analysis
* Azure CLI diagnostics
* PowerShell diagnostics
* Root cause identification
* Remediation
* Post-change validation
* Preventive actions

## Cost Considerations

The network architecture is documented without requiring permanent Azure resources.

The logical network design itself does not require any resources to be deployed for the portfolio documentation.
