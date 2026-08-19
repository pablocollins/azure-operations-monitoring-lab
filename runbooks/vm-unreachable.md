# Runbook — VM Network Connectivity Failure

## Purpose

Use this runbook when an Azure virtual machine cannot establish the expected network connection to another workload.

The objective is to identify the failed network layer systematically before making configuration changes.

## Example Scenario

Source workload:

`vm-linux-app-01`

Destination workload:

`vm-win-ops-01`

Required communication:

`TCP/443`

Expected traffic flow:

```text
vm-linux-app-01
        |
        | TCP/443
        v
Azure Network
        |
        v
vm-win-ops-01
```

## Common Symptoms

Typical symptoms include:

* Connection timeout
* Connection refused
* Application communication failure
* A service works locally but cannot be reached remotely
* One subnet can reach the workload while another cannot
* TCP connectivity tests fail

## Troubleshooting Procedure

### 1. Define the Traffic Flow

Before troubleshooting, identify:

* Source workload
* Source IP address
* Destination workload
* Destination IP address
* Protocol
* Destination port

Example:

```text
Source:       vm-linux-app-01
Source IP:    10.10.1.10
Destination:  vm-win-ops-01
Destination:  10.10.1.20
Protocol:     TCP
Port:         443
```

Do not modify NSG or firewall rules until the expected traffic flow is understood.

### 2. Confirm Workload State

Confirm that both workloads are expected to be running.

Check:

* Source VM state
* Destination VM state
* NIC attachment
* Expected network configuration

A stopped or unavailable destination should be investigated before modifying network security.

### 3. Validate IP Configuration

Confirm the source and destination IP addresses.

Windows:

```powershell
Get-NetIPAddress -AddressFamily IPv4
```

Linux:

```bash
ip addr
```

Verify that each workload has the expected private IP address and belongs to the expected network.

### 4. Validate Subnet Membership

Expected lab network:

```text
vnet-ops-lab
|
+-- snet-servers
|   10.10.1.0/24
|
+-- snet-management
    10.10.2.0/24
```

Confirm that the workloads are attached to the expected subnet.

### 5. Test TCP Connectivity

From Windows:

```powershell
Test-NetConnection 10.10.1.20 -Port 443
```

Important output includes:

```text
RemoteAddress
RemotePort
TcpTestSucceeded
```

From Linux:

```bash
curl -v https://10.10.1.20
```

A failed test establishes the symptom but does not by itself identify the root cause.

### 6. Review Network Security Groups

Identify which NSGs apply to:

* Source subnet
* Source NIC
* Destination subnet
* Destination NIC

Review:

* Direction
* Priority
* Source
* Destination
* Protocol
* Destination port
* Action

Azure CLI example:

```bash
az network nsg rule list \
  --resource-group rg-ops-lab \
  --nsg-name nsg-servers \
  --output table
```

### 7. Review NSG Rule Priority

NSG rules are evaluated according to priority.

Lower numerical values have higher priority.

Example:

```text
Priority 100
ALLOW TCP/443

Priority 200
DENY TCP/443
```

The rule with priority `100` is evaluated before priority `200`.

During investigation, verify which rule actually matches the traffic.

### 8. Review Effective Security Rules

Where available, inspect the effective NSG configuration associated with the network interface.

Azure CLI example:

```bash
az network nic list-effective-nsg \
  --resource-group rg-ops-lab \
  --name <nic-name>
```

This helps determine which network security configuration effectively applies to the workload.

### 9. Validate Routing

Review the route between source and destination.

Windows:

```powershell
Get-NetRoute
```

Linux:

```bash
ip route
```

Azure troubleshooting should also consider:

* Azure system routes
* User-defined routes
* Effective routes
* Network virtual appliances if present

### 10. Validate Guest OS Firewall

Even if Azure networking allows the connection, the guest operating system may block it.

Windows:

```powershell
Get-NetFirewallRule
```

Linux:

```bash
iptables -L
```

or, where applicable:

```bash
nft list ruleset
```

Do not disable the entire firewall as a permanent troubleshooting solution.

### 11. Confirm the Application Listener

Verify that the destination application is actually listening on the expected port.

Windows:

```powershell
Get-NetTCPConnection -LocalPort 443
```

or:

```powershell
netstat -ano
```

Linux:

```bash
ss -tulpn
```

If no process is listening on the required port, changing the NSG will not resolve the application problem.

### 12. Determine Root Cause

Possible root causes include:

* Incorrect destination IP
* Incorrect subnet
* NSG deny rule
* Incorrect NSG rule priority
* Incorrect route
* Guest OS firewall rule
* Application not listening
* Destination workload unavailable

### 13. Apply Least-Change Remediation

Modify only the component responsible for the failure.

For example, if TCP/443 is required between two defined network segments, create or correct a rule that permits only that required traffic.

Avoid broad rules such as:

```text
Source:       Any
Destination:  Any
Protocol:     Any
Port:         Any
Action:       Allow
```

### 14. Validate the Resolution

Repeat the original connectivity test.

Example:

```powershell
Test-NetConnection 10.10.1.20 -Port 443
```

Expected result:

```text
TcpTestSucceeded : True
```

Also confirm that unrelated traffic remains restricted.

### 15. Document the Incident

Record:

* Original symptom
* Source and destination
* Protocol and port
* Diagnostic commands
* Evidence
* Root cause
* Configuration change
* Validation
* Preventive actions

## Troubleshooting Decision Path

```text
Connectivity Failure
        |
        v
Are both workloads available?
        |
        v
Are IP addresses correct?
        |
        v
Are subnets correct?
        |
        v
Does an NSG block the traffic?
        |
        v
Is routing correct?
        |
        v
Does the OS firewall block it?
        |
        v
Is the application listening?
        |
        v
Root Cause
        |
        v
Remediation
        |
        v
Validation
```

## Escalation Criteria

Escalate when:

* Routing involves infrastructure outside the operational team's responsibility.
* Network Virtual Appliances are involved.
* Azure Firewall or third-party firewalls require another team's involvement.
* The requested network access violates security requirements.
* The root cause cannot be isolated using available evidence.

## Expected Outcome

At the end of the investigation, the operator should be able to explain:

1. Which network flow was failing.
2. At which layer the failure occurred.
3. What evidence identified the root cause.
4. Which configuration was changed.
5. Why the remediation was appropriately scoped.
6. How successful connectivity was validated.

## Portfolio Note

This runbook is designed for a simulated Azure environment.

Commands represent the diagnostic workflow that would be used in a live Azure environment, while the portfolio project remains independent of paid Azure resources.
