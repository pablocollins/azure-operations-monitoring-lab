# Identity and Access Design

## Overview

The Azure Operations & Monitoring Lab uses Microsoft Entra ID for identity and authentication and Azure Role-Based Access Control (RBAC) for authorization.

The identity model is designed around least privilege, group-based access, controlled RBAC scopes, and managed identities for Azure workloads.

## Authentication and Authorization

Authentication and authorization are treated as separate security processes.

**Authentication** verifies the identity requesting access.

**Authorization** determines what an authenticated identity is allowed to do.

An identity may authenticate successfully but still receive an authorization error if the required Azure RBAC permissions are missing.

## Access Model

Administrative permissions should be assigned through Microsoft Entra security groups where practical.

The preferred access model is:

User

↓

Microsoft Entra Security Group

↓

Azure RBAC Role

↓

Scope

↓

Azure Resource

This approach simplifies access management and reduces unnecessary direct role assignments to individual users.

## Security Groups

### Cloud Operations

Group:

`grp-cloud-ops`

Purpose:

Represents administrators responsible for day-to-day virtual machine operations.

Planned RBAC role:

`Virtual Machine Contributor`

Planned scope:

`rg-ops-lab`

### Cloud Readers

Group:

`grp-cloud-readers`

Purpose:

Provides read-only access for users who need visibility into the Azure environment without modification permissions.

Planned RBAC role:

`Reader`

Planned scope:

`rg-ops-lab`

### Application Support

Group:

`grp-app-support`

Purpose:

Represents application support personnel.

Permissions for this group should be limited to the minimum access required for application support activities.

Access should not be expanded to broad roles such as Owner or Contributor unless a documented requirement exists.

## RBAC Scope

Azure RBAC permissions can be assigned at different scopes.

The relevant hierarchy is:

Management Group

↓

Subscription

↓

Resource Group

↓

Resource

Permissions assigned at a parent scope can be inherited by resources below that scope.

Role assignments should therefore be created at the narrowest practical scope.

## Least Privilege

The environment follows the principle of least privilege.

Users and workloads should receive only the permissions required to perform their responsibilities.

Broad permissions should not be used as a default troubleshooting solution.

For example, an authorization failure should be investigated before assigning roles such as:

* Owner
* Contributor

The investigation should identify the required operation, existing role assignments, assignment scope, inherited permissions, and the minimum role required.

## Managed Identities

Azure workloads should use Managed Identities where appropriate instead of storing credentials in scripts or configuration files.

A system-assigned managed identity can provide an Azure resource with an identity in Microsoft Entra ID.

Conceptual authentication flow:

Azure Resource

↓

Managed Identity

↓

Microsoft Entra ID

↓

Access Token

↓

Target Azure Resource

A Managed Identity provides authentication but does not automatically provide authorization.

Azure RBAC role assignments are still required when the identity needs access to protected Azure resources.

## Credential Security

The project follows these credential security principles:

* No passwords stored in source code
* No client secrets committed to Git
* No credentials stored in documentation
* Managed identities preferred for Azure workloads where appropriate
* Sensitive local files excluded through `.gitignore`

## RBAC Troubleshooting Methodology

Authorization incidents should be investigated systematically.

The troubleshooting process includes:

1. Identify the affected security principal.
2. Confirm successful authentication.
3. Identify the failed Azure operation.
4. Review direct role assignments.
5. Review group-based role assignments.
6. Review assignment scopes.
7. Review inherited permissions.
8. Determine the permission required by the failed operation.
9. Identify the minimum appropriate RBAC role.
10. Apply remediation only after the root cause is understood.
11. Validate access after remediation.
12. Document the incident and preventive actions.

## Planned Incident Scenario

The lab will include:

**INC-001 — RBAC Access Denied**

An application support user will be able to view an Azure virtual machine but will be unable to perform an operational action such as restarting it.

The investigation will demonstrate:

* Authentication versus authorization
* Microsoft Entra group membership analysis
* Azure RBAC role assignment analysis
* RBAC scope analysis
* PowerShell diagnostics
* Azure CLI diagnostics
* Least-privilege remediation
* Post-change validation
* Incident documentation

## Cost Considerations

The identity and RBAC architecture can be documented and investigated without deploying permanent compute resources.

No paid Azure resources are required to maintain this section of the portfolio.
