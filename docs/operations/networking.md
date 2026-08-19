# Networking Operations

## Purpose

This document describes the operational procedures used to review and troubleshoot Azure networking in the Azure Operations & Monitoring Lab.

The objective is to investigate connectivity issues systematically before making configuration changes.

## Operational Principles

Azure networking troubleshooting should follow these principles:

* Confirm the affected source and destination.
* Validate IP addressing.
* Confirm subnet membership.
* Review Network Security Group rules.
* Review effective security rules where available.
* Validate routing.
* Test connectivity from the source workload.
* Review the guest operating system firewall.
* Confirm that the destination application is listening.
* Change only the component supported by evidence.

## Troubleshooting Flow

The standard troubleshooting flow is:

Source Workload

↓

Source NIC

↓

Source IP Address

↓

Subnet

↓

Network Security Group

↓

Routing

↓

Destination NIC

↓

Destination IP Address

↓

Guest OS Firewall

↓

Application Listener

↓

Root Cause

↓

Remediation

↓

Validation

## Common Networking Symptoms

Examples include:

* A virtual machine cannot reach another virtual machine.
* TCP connection attempts time out.
* A service responds locally but not remotely.
* A workload works from one subnet but not another.
* Traffic is blocked by an NSG rule.
* A guest operating system firewall blocks the required port.
* The destination application is not listening on the expected port.
* The destination IP address is incorrect.

## Investigation Questions

Before changing network configuration, answer:

1. What is the source workload?
2. What is the destination workload?
3. Which protocol is being used?
4. Which destination port is required?
5. What are the source and destination IP addresses?
6. Are both workloads in the expected subnets?
7. Which NSGs apply?
8. Which NSG rules match the traffic?
9. Is routing correct?
10. Does the guest operating system firewall allow the traffic?
11. Is the application listening on the expected port?

## PowerShell Diagnostics

Useful PowerShell commands include:

```powershell
Test-NetConnection
Get-NetIPAddress
Get-NetRoute
Get-NetFirewallRule
```

Example:

```powershell
Test-NetConnection 10.10.1.20 -Port 443
```

This can help determine whether a TCP connection can be established to the destination.

## Linux Diagnostics

Useful Linux commands include:

```bash
ip addr
ip route
ss -tulpn
curl
ping
```

Example:

```bash
curl -v https://10.10.1.20
```

## Azure CLI Diagnostics

Useful Azure CLI commands include:

```bash
az network nic show
az network nsg show
az network nsg rule list
az network nic list-effective-nsg
```

Example:

```bash
az network nsg rule list \
  --resource-group rg-ops-lab \
  --nsg-name nsg-servers \
  --output table
```

## NSG Rule Evaluation

Network Security Group rules are evaluated by priority.

A lower numerical priority value is evaluated before a higher numerical value.

Example:

```text
Priority 100 → Allow TCP/443
Priority 200 → Deny TCP/443
```

In this example, the allow rule is evaluated first.

Troubleshooting should therefore consider:

* Rule priority
* Source
* Destination
* Protocol
* Port
* Direction
* Action

## Routing Validation

Routing should be reviewed when traffic does not follow the expected path.

Key areas include:

* Subnet routes
* Effective routes
* User-defined routes
* Default Azure system routes
* Destination IP address

## Guest Operating System Validation

Azure network configuration may be correct while the guest operating system still blocks traffic.

Windows checks may include:

```powershell
Get-NetFirewallRule
Test-NetConnection
netstat -ano
```

Linux checks may include:

```bash
ss -tulpn
iptables -L
nft list ruleset
```

The operator should confirm that the application is actually listening on the required port.

## Least-Change Remediation

Networking issues should not be resolved by broadly allowing all traffic.

Avoid rules such as:

```text
Source: Any
Destination: Any
Port: Any
Action: Allow
```

unless there is a documented and approved requirement.

The remediation should modify only the rule, route, or firewall configuration necessary to restore the required communication.

## Validation

After remediation:

1. Repeat the original connectivity test.
2. Confirm the required port is reachable.
3. Confirm unrelated traffic remains restricted.
4. Recheck NSG or firewall configuration.
5. Document the result.

## Planned Incident

The networking operational procedures will be demonstrated through:

**INC-002 — Network Connectivity Failure**

Scenario:

A Linux application server is unable to communicate with a Windows operational server over TCP/443.

The investigation will demonstrate:

* IP validation
* Subnet validation
* NSG analysis
* Rule priority analysis
* PowerShell connectivity testing
* Azure CLI diagnostics
* Guest OS validation
* Root cause identification
* Least-change remediation
* Post-change validation

## Cost Considerations

This networking troubleshooting methodology is documented without requiring permanent Azure resources.

The lab uses simulated evidence and expected outputs to preserve the project's zero-cost-first strategy.
