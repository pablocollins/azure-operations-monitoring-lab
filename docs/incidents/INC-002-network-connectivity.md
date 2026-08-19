# INC-002 — Network Connectivity Failure

## Incident Summary

A Linux application server is unable to establish a TCP connection to a Windows operations server over port 443.

The incident is investigated using a structured network troubleshooting methodology covering IP configuration, subnet membership, Network Security Groups, routing, guest operating system firewalls, and application listeners.

This incident is simulated for portfolio and troubleshooting demonstration purposes.

## Incident Classification

| Field         | Value                             |
| ------------- | --------------------------------- |
| Incident ID   | `INC-002`                         |
| Category      | Networking                        |
| Severity      | SEV-3                             |
| Status        | Resolved                          |
| Environment   | Azure Operations & Monitoring Lab |
| Source        | `vm-linux-app-01`                 |
| Destination   | `vm-win-ops-01`                   |
| Protocol      | TCP                               |
| Port          | 443                               |
| Incident Type | Simulated                         |

## Business Impact

The application server cannot communicate with the operations server over the required HTTPS port.

In a production environment, this could interrupt application communication, management operations, monitoring integrations, or dependent services.

## Expected Network Flow

```text
vm-linux-app-01
10.10.1.10
       |
       | TCP/443
       v
Azure Virtual Network
       |
       v
Network Security Group
       |
       v
vm-win-ops-01
10.10.1.20
```

Expected result:

```text
TCP/443 → ALLOWED
```

Observed result:

```text
TCP/443 → FAILED
```

## Reported Symptoms

The following symptoms are reported:

* Both workloads are expected to be available.
* The destination IP address is known.
* TCP connectivity to port 443 fails.
* The source workload cannot establish the required connection.
* No general Azure authentication issue is reported.

## Initial Assessment

The connectivity failure may exist at several layers.

Initial hypotheses include:

* Incorrect IP configuration
* Incorrect subnet membership
* Network Security Group rule
* Incorrect NSG priority
* Routing issue
* Guest operating system firewall
* Destination application not listening on TCP/443

No configuration change should be made until evidence identifies the likely root cause.

## Step 1 — Validate Source and Destination

Simulated network information:

| Property   | Source            | Destination     |
| ---------- | ----------------- | --------------- |
| VM         | `vm-linux-app-01` | `vm-win-ops-01` |
| Private IP | `10.10.1.10`      | `10.10.1.20`    |
| Subnet     | `snet-servers`    | `snet-servers`  |
| VNet       | `vnet-ops-lab`    | `vnet-ops-lab`  |

Both workloads are located within:

```text
snet-servers
10.10.1.0/24
```

## Step 2 — Test TCP Connectivity

A connectivity test is performed from the source workload.

Equivalent PowerShell test:

```powershell
Test-NetConnection 10.10.1.20 -Port 443
```

### Simulated Evidence

The following output is simulated and is not the result of a live Azure deployment.

```text
ComputerName     : 10.10.1.20
RemoteAddress    : 10.10.1.20
RemotePort       : 443
InterfaceAlias   : Ethernet
SourceAddress    : 10.10.1.10
TcpTestSucceeded : False
```

Result:

```text
TCP connectivity confirmed as failing.
```

This establishes the symptom but does not identify the root cause.

## Step 3 — Validate NIC Configuration

The network interfaces should be inspected to verify:

* Private IP address
* Subnet
* VNet
* Associated NSG

Azure CLI investigation:

```bash
az network nic show \
  --resource-group rg-ops-lab \
  --name nic-linux-app-01
```

and:

```bash
az network nic show \
  --resource-group rg-ops-lab \
  --name nic-win-ops-01
```

### Simulated Result

```text
nic-linux-app-01
Private IP: 10.10.1.10
Subnet:     snet-servers

nic-win-ops-01
Private IP: 10.10.1.20
Subnet:     snet-servers
```

The IP configuration is consistent with the expected network design.

## Step 4 — Review Network Security Group

The server subnet is protected by:

```text
nsg-servers
```

Azure CLI investigation:

```bash
az network nsg rule list \
  --resource-group rg-ops-lab \
  --nsg-name nsg-servers \
  --output table
```

### Simulated NSG Evidence

```text
Priority   Name                  Protocol   Port   Action
--------   -------------------   --------   ----   ------
100        Allow-SSH-Mgmt        TCP        22     Allow
200        Deny-HTTPS-Servers    TCP        443    Deny
300        Allow-HTTPS-Mgmt      TCP        443    Allow
```

## Step 5 — Analyze NSG Priority

Azure NSG rules use numerical priority.

Lower numbers are evaluated before higher numbers.

Relevant rules:

```text
Priority 200
Deny-HTTPS-Servers
TCP/443
DENY
```

and:

```text
Priority 300
Allow-HTTPS-Mgmt
TCP/443
ALLOW
```

Because priority `200` is evaluated before priority `300`, traffic matching the deny rule is blocked before the later allow rule can permit it.

This identifies the NSG configuration as the likely root cause.

## Step 6 — Validate Other Layers

Before remediation, additional layers should still be considered.

### Routing

Expected workloads are located in the same VNet and subnet.

No user-defined route is expected to redirect the traffic.

Example checks:

```powershell
Get-NetRoute
```

```bash
ip route
```

### Guest Operating System Firewall

The destination Windows firewall should be checked to confirm that TCP/443 is permitted where required.

Example:

```powershell
Get-NetFirewallRule
```

### Application Listener

The destination workload should also be checked to confirm that a process is listening on TCP/443.

Example:

```powershell
Get-NetTCPConnection -LocalPort 443
```

These checks prevent an NSG change from being incorrectly treated as the solution when another layer is also blocking communication.

## Root Cause

The required TCP/443 traffic was blocked by an incorrectly prioritized Network Security Group deny rule.

The deny rule was evaluated before the intended allow rule.

Root cause:

```text
Incorrect NSG rule priority
```

## Remediation

The remediation should correct the NSG rule configuration so that the required traffic is explicitly permitted before a broader deny rule is evaluated.

Conceptual corrected configuration:

```text
Priority 150
Allow-Required-HTTPS
Source:      Required source
Destination: Required destination
Protocol:    TCP
Port:        443
Action:      Allow

Priority 200
Deny-Unapproved-HTTPS
Action:      Deny
```

The exact source and destination should be restricted to the required workloads or network ranges.

A broad `Allow Any/Any` rule should not be introduced.

## Validation

After remediation, repeat the original test:

```powershell
Test-NetConnection 10.10.1.20 -Port 443
```

Expected simulated result:

```text
ComputerName     : 10.10.1.20
RemoteAddress    : 10.10.1.20
RemotePort       : 443
SourceAddress    : 10.10.1.10
TcpTestSucceeded : True
```

Validation should confirm:

* TCP/443 succeeds.
* The correct source can reach the destination.
* Unrelated network traffic remains restricted.
* The NSG configuration follows least-privilege principles.

## Preventive Actions

Recommended actions include:

* Document required network flows before creating NSG rules.
* Use descriptive NSG rule names.
* Review rule priorities during change implementation.
* Avoid unnecessarily broad allow rules.
* Validate effective security configuration after network changes.
* Maintain a documented network flow matrix.
* Include connectivity validation in operational change procedures.

## Tools Used

The troubleshooting methodology uses:

* Azure Virtual Network concepts
* Azure Network Security Groups
* Azure NIC configuration
* Azure CLI
* PowerShell
* Windows networking tools
* Linux networking tools

Related repository files:

```text
docs/architecture/network-design.md
docs/operations/networking.md
runbooks/vm-unreachable.md
scripts/powershell/network-diagnostics.ps1
scripts/azure-cli/network-diagnostics.sh
```

## Lessons Learned

A failed TCP connection does not automatically indicate an NSG problem.

Network troubleshooting should isolate each layer systematically:

```text
Source
  ↓
NIC
  ↓
IP
  ↓
Subnet
  ↓
NSG
  ↓
Routing
  ↓
Destination OS Firewall
  ↓
Application Listener
```

Configuration should only be changed after evidence identifies the likely failure point.

## Portfolio Note

This incident is intentionally simulated because the project follows a zero-cost strategy and does not depend on permanent Azure resources.

The commands, investigation methodology, root cause analysis, remediation strategy, and validation workflow represent how the incident would be approached in a live Azure environment.
