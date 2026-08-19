# Runbook — RBAC Access Denied

## Purpose

Use this runbook when a user, group, service principal, or managed identity receives an Azure authorization error while attempting to perform an operation.

The objective is to identify the root cause before modifying permissions and to apply least-privilege remediation.

## Common Symptoms

Typical symptoms include:

* `AuthorizationFailed`
* Access denied when modifying an Azure resource
* A user can view a resource but cannot modify it
* A managed identity can authenticate but cannot access a target resource
* An operation works in one resource group but fails in another

## Troubleshooting Procedure

### 1. Identify the Affected Identity

Confirm which security principal is experiencing the problem.

Record:

* Identity type
* User principal name or identity name
* Microsoft Entra group membership if relevant
* Affected Azure resource

Possible identity types include:

* User
* Group
* Service Principal
* Managed Identity

### 2. Confirm Authentication

Determine whether the identity authenticated successfully.

If authentication failed, investigate the authentication problem before continuing with Azure RBAC troubleshooting.

If authentication succeeded but the Azure operation was denied, continue investigating authorization.

### 3. Capture the Failed Operation

Record:

* Azure resource
* Operation attempted
* Error message
* Timestamp
* Relevant resource group
* Subscription context

Do not modify permissions before identifying the failed operation.

### 4. Review Group Membership

If the affected identity is a user, verify whether the user belongs to the expected Microsoft Entra security groups.

Example investigation areas:

* Expected group membership
* Missing group membership
* Incorrect group
* Access expected through group-based RBAC

### 5. Review Azure RBAC Assignments

Review the role assignments associated with the affected identity.

Check:

* Direct role assignments
* Group-based role assignments
* Role names
* Assignment scopes

Useful PowerShell commands include:

```powershell
Get-AzADUser
Get-AzADGroupMember
Get-AzRoleAssignment
```

Useful Azure CLI commands include:

```bash
az ad user show
az ad group member list
az role assignment list
```

### 6. Validate RBAC Scope

Confirm that the role assignment applies to the affected resource.

Review assignments at:

```text
Subscription
    ↓
Resource Group
    ↓
Resource
```

An appropriate role assigned at the wrong scope may not provide access to the affected resource.

### 7. Identify the Required Permission

Determine exactly which Azure operation the identity needs to perform.

Compare the required operation against the permissions provided by the current RBAC role.

Do not assume that a broader role is required.

### 8. Determine the Root Cause

Possible root causes include:

* Missing role assignment
* Incorrect RBAC role
* Incorrect assignment scope
* Missing Microsoft Entra group membership
* Incorrect assumption about inherited permissions
* Wrong identity being used
* Permissions that do not include the required operation

### 9. Apply Least-Privilege Remediation

Select the minimum access required to resolve the business requirement.

The remediation should answer:

* Which identity requires access?
* Which role is required?
* At which scope should it be assigned?
* Why is the permission required?

Avoid using broad roles such as `Owner` or `Contributor` as a troubleshooting shortcut.

### 10. Validate the Resolution

After remediation:

1. Repeat the previously failing operation.
2. Confirm that the required operation succeeds.
3. Confirm that unnecessary permissions were not introduced.
4. Verify the role assignment and scope.
5. Record the validation result.

### 11. Document the Incident

The incident report should contain:

* Incident summary
* Business impact
* Symptoms
* Investigation steps
* Diagnostic commands
* Evidence
* Root cause
* Remediation
* Validation
* Preventive actions
* Lessons learned

## Escalation Criteria

Escalate the incident when:

* The required permissions cannot be determined.
* Privileged administrative access is required.
* The affected scope includes sensitive or production resources.
* Azure Policy or deny assignments may be involved.
* The requested access conflicts with least-privilege requirements.
* The remediation requires security approval.

## Expected Outcome

At the end of the investigation, the operator should be able to explain:

1. Why the operation failed.
2. Which permission was missing or incorrect.
3. At which scope the permission was required.
4. How the issue was remediated.
5. How the resolution was validated.
6. How similar incidents can be prevented.
