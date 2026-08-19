# Identity and RBAC Operations

## Purpose

This document describes the operational procedures used to review and troubleshoot Microsoft Entra ID identities and Azure Role-Based Access Control (RBAC).

The goal is to identify authorization problems systematically without granting unnecessary permissions.

## Operational Principles

RBAC troubleshooting should follow these principles:

* Confirm the affected identity first.
* Separate authentication issues from authorization issues.
* Review group membership.
* Review direct and inherited role assignments.
* Confirm the RBAC scope.
* Identify the failed operation.
* Determine the minimum permission required.
* Avoid assigning broad roles as a troubleshooting shortcut.
* Validate access after remediation.
* Document the root cause and resolution.

## RBAC Troubleshooting Flow

The standard troubleshooting flow is:

User or Managed Identity

↓

Authentication Status

↓

Group Membership

↓

Role Assignments

↓

RBAC Scope

↓

Required Permission

↓

Effective Access

↓

Root Cause

↓

Least-Privilege Remediation

↓

Validation

## Common RBAC Symptoms

Examples of common authorization problems include:

* A user can view a resource but cannot modify it.
* A user can access one resource group but not another.
* A managed identity can authenticate but cannot access a target resource.
* A role assignment exists at the wrong scope.
* A user is expected to inherit access through a group but is not a member of the expected group.
* A role assignment exists but does not provide the permission required for the attempted operation.

## Investigation Questions

Before changing permissions, the operator should answer:

1. Which identity is affected?
2. Did authentication succeed?
3. What exact operation failed?
4. What error message was returned?
5. Which Microsoft Entra groups is the identity a member of?
6. Which Azure RBAC roles are assigned?
7. Are the assignments direct or group-based?
8. At which scope are those roles assigned?
9. Are permissions inherited from a parent scope?
10. What minimum permission is required to perform the operation?

## PowerShell Investigation Commands

Azure PowerShell can be used to investigate identities and RBAC assignments.

Common commands include:

```powershell
Get-AzADUser
Get-AzADGroup
Get-AzADGroupMember
Get-AzRoleAssignment
```

Example user lookup:

```powershell
Get-AzADUser -UserPrincipalName user@contoso.com
```

Example RBAC investigation:

```powershell
Get-AzRoleAssignment -SignInName user@contoso.com
```

Role assignments should always be reviewed together with their scopes.

## Azure CLI Investigation Commands

Azure CLI provides equivalent capabilities.

Common commands include:

```bash
az ad user show
az ad group show
az ad group member list
az role assignment list
```

Example:

```bash
az role assignment list \
  --assignee user@contoso.com \
  --all \
  --output table
```

## RBAC Scope Validation

RBAC scope is critical during troubleshooting.

The main Azure scopes relevant to this lab are:

```text
Subscription
    ↓
Resource Group
    ↓
Resource
```

A role assignment should be evaluated based on both:

* The assigned role
* The scope of the assignment

Having an appropriate role at an unrelated scope does not provide access to the affected resource.

## Least-Privilege Remediation

Remediation should grant only the access required by the operational requirement.

Broad roles such as `Owner` or `Contributor` should not be assigned simply to resolve an authorization error.

The remediation process should include:

1. Identify the required operation.
2. Determine which Azure RBAC permission is required.
3. Identify an appropriate built-in role.
4. Select the narrowest practical scope.
5. Apply the role assignment.
6. Validate the required operation.
7. Confirm that unnecessary permissions have not been introduced.
8. Document the change.

## Managed Identity Troubleshooting

Managed Identities should be treated as Azure security principals.

A Managed Identity may authenticate successfully but still fail to access a resource because it does not have the required Azure RBAC authorization.

The investigation should therefore verify:

1. The Managed Identity exists and is enabled.
2. Authentication succeeds.
3. The correct identity is being used.
4. The identity has the required RBAC role.
5. The role is assigned at the correct scope.

Authentication success does not automatically imply authorization success.

## Validation

After remediation, validate that:

* The required operation succeeds.
* Unnecessary operations remain restricted.
* The role assignment exists at the expected scope.
* The correct identity received the permission.
* The incident can be considered resolved.

## Evidence Collection

Evidence collected during an RBAC investigation may include:

* PowerShell command output
* Azure CLI command output
* Role assignment information
* Microsoft Entra group membership
* Azure authorization error messages
* Resource and scope information
* Validation results

Evidence should support the troubleshooting conclusions documented in the incident report.

## Security Considerations

Sensitive information must not be committed to the public GitHub repository.

Examples of information that must not be stored include:

* Passwords
* Client secrets
* Access tokens
* Private keys
* Authentication cookies
* Sensitive tenant information

Credentials must never be hardcoded into PowerShell or Azure CLI scripts.

## Planned Incident

The RBAC operational procedures will be demonstrated through:

**INC-001 — RBAC Access Denied**

Scenario:

An application support user can view an Azure virtual machine but cannot perform an operational action such as restarting it.

The investigation will demonstrate:

* Authentication versus authorization
* Microsoft Entra group membership analysis
* Azure RBAC role assignment analysis
* RBAC scope analysis
* PowerShell diagnostics
* Azure CLI diagnostics
* Least-privilege remediation
* Post-change validation
* Root cause documentation

## Cost Considerations

RBAC troubleshooting and documentation do not require permanent paid Azure resources.

This section of the portfolio is designed to remain compatible with the project's zero-cost-first strategy.
