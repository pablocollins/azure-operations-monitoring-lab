# INC-001 — RBAC Access Denied

## Incident Summary

An application support user can view the Azure virtual machine `vm-linux-app-01` but cannot restart it.

The user reports an Azure authorization error when attempting the operation.

This incident is simulated for portfolio and troubleshooting demonstration purposes.

## Incident Classification

| Field             | Value                             |
| ----------------- | --------------------------------- |
| Incident ID       | `INC-001`                         |
| Category          | Identity and Access Management    |
| Severity          | SEV-3                             |
| Status            | Resolved                          |
| Environment       | Azure Operations & Monitoring Lab |
| Affected Resource | `vm-linux-app-01`                 |
| Incident Type     | Simulated                         |

## Business Impact

The application support user is unable to perform an operational restart of the application server.

This could delay recovery during an application issue and require escalation to the Cloud Operations team.

## Reported Symptoms

The user reports:

* The virtual machine is visible in Azure.
* Resource properties can be reviewed.
* The restart operation fails.
* Authentication succeeds.
* Azure returns an authorization error.

Example error:

```text
AuthorizationFailed

The client does not have authorization to perform the requested action over the specified scope.
```

## Initial Assessment

Because the user can authenticate and view the resource, the issue is treated as an authorization problem rather than an authentication problem.

Initial hypothesis:

* Missing Azure RBAC permission
* Incorrect role assignment
* Incorrect RBAC scope
* Missing group membership

## Affected Identity

Simulated user:

```text
alice@contoso.com
```

Expected group:

```text
grp-app-support
```

Affected resource:

```text
vm-linux-app-01
```

Resource group:

```text
rg-ops-lab
```

## Troubleshooting Process

### Step 1 — Confirm Authentication

The user is able to sign in and view the Azure resource.

Result:

```text
Authentication: Successful
Authorization: Investigation required
```

### Step 2 — Identify Failed Operation

Failed action:

```text
Restart virtual machine
```

The issue is therefore related to a management operation rather than read-only access.

### Step 3 — Review Microsoft Entra Group Membership

The expected identity model is:

```text
alice@contoso.com
        ↓
grp-app-support
        ↓
Azure RBAC
```

The user's group membership should be verified before modifying Azure permissions.

PowerShell investigation:

```powershell
Get-AzADUser -UserPrincipalName alice@contoso.com
Get-AzADGroupMember -GroupDisplayName "grp-app-support"
```

Azure CLI investigation:

```bash
az ad user show --id alice@contoso.com
az ad group member list --group grp-app-support --output table
```

### Step 4 — Review RBAC Role Assignments

PowerShell:

```powershell
Get-AzRoleAssignment -SignInName alice@contoso.com
```

Azure CLI:

```bash
az role assignment list \
  --assignee alice@contoso.com \
  --all \
  --output table
```

## Simulated Evidence

The following output is simulated and is not the result of a live Azure deployment.

```text
Principal                Role      Scope
-----------------------  --------  --------------------------------------------
alice@contoso.com        Reader    /subscriptions/xxxx/resourceGroups/rg-ops-lab
```

## Analysis

The user has the `Reader` role at the resource group scope.

This explains why the user can:

* View the virtual machine
* Review resource properties
* Inspect the resource group

However, the role does not provide the required virtual machine management operation.

The authorization failure is therefore consistent with the assigned permissions.

## Root Cause

The application support user had only the `Reader` role assigned at the `rg-ops-lab` scope.

The assigned role allowed resource visibility but did not provide the permissions required to restart the virtual machine.

## Remediation Decision

The incident should not be resolved by assigning broad roles such as:

```text
Owner
Contributor
```

Instead, the required operational access should be evaluated according to least privilege.

For this lab scenario, a role capable of performing the required virtual machine operation would be selected at the narrowest practical scope.

Conceptual remediation:

```text
grp-app-support
        ↓
Appropriate VM operational role
        ↓
vm-linux-app-01
```

This limits the permission to the affected workload instead of granting unnecessary access to the entire subscription.

## Validation

After the conceptual RBAC remediation, the following checks would be performed:

1. Confirm the expected role assignment exists.
2. Confirm the assignment scope is correct.
3. Ask the user to repeat the restart operation.
4. Confirm the restart succeeds.
5. Confirm the user does not receive unnecessary permissions on unrelated resources.

Expected result:

```text
View VM:       SUCCESS
Restart VM:    SUCCESS
Unrelated administrative access: RESTRICTED
```

## Preventive Actions

Recommended preventive actions:

* Use group-based RBAC assignments instead of direct user assignments where practical.
* Document expected access for each operational team.
* Review RBAC scopes during access provisioning.
* Apply least privilege.
* Periodically audit Azure role assignments.
* Avoid broad roles as a troubleshooting shortcut.

## Tools Used

The investigation methodology uses:

* Microsoft Entra ID
* Azure RBAC
* Azure PowerShell
* Azure CLI
* Operational runbooks

Related files:

```text
docs/operations/identity-and-rbac.md
runbooks/rbac-access-denied.md
scripts/powershell/rbac-audit.ps1
scripts/azure-cli/rbac-audit.sh
```

## Lessons Learned

Successful authentication does not guarantee authorization.

RBAC troubleshooting requires reviewing:

```text
Identity
    ↓
Group Membership
    ↓
Role
    ↓
Scope
    ↓
Required Operation
```

Permission changes should only be made after identifying the failed operation and understanding the root cause.

## Portfolio Note

This incident is intentionally simulated because the project is designed to remain zero-cost and does not require a permanent Azure subscription or live paid resources.

The troubleshooting methodology, commands, analysis, remediation logic, and validation process reflect the operational workflow that would be used in a real Azure environment.
