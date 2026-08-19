<#
.SYNOPSIS
    Audits Azure RBAC assignments for a Microsoft Entra ID user.

.DESCRIPTION
    This script retrieves a Microsoft Entra ID user and displays
    Azure RBAC role assignments associated with that identity.

    The script is read-only and does not create, modify, or remove
    Azure role assignments.

.PARAMETER UserPrincipalName
    User Principal Name (UPN) of the Microsoft Entra ID user
    to investigate.

.EXAMPLE
    .\rbac-audit.ps1 -UserPrincipalName user@contoso.com

.NOTES
    Project: Azure Operations & Monitoring Lab
    Purpose: RBAC troubleshooting and operational auditing
#>

param (
    [Parameter(Mandatory = $true)]
    [string]$UserPrincipalName
)

Write-Host ""
Write-Host "========================================"
Write-Host " Azure RBAC Audit"
Write-Host "========================================"
Write-Host ""

# ------------------------------------------------------------
# Step 1 - Validate Azure context
# ------------------------------------------------------------

Write-Host "[1] Checking Azure context..."

$context = Get-AzContext

if (-not $context) {
    Write-Error "No active Azure context found. Authenticate with Connect-AzAccount first."
    exit 1
}

Write-Host "Account:      $($context.Account.Id)"
Write-Host "Subscription: $($context.Subscription.Name)"
Write-Host "Tenant:       $($context.Tenant.Id)"
Write-Host ""

# ------------------------------------------------------------
# Step 2 - Find Microsoft Entra ID user
# ------------------------------------------------------------

Write-Host "[2] Searching for Microsoft Entra ID user..."

$user = Get-AzADUser -UserPrincipalName $UserPrincipalName

if (-not $user) {
    Write-Error "User not found: $UserPrincipalName"
    exit 1
}

Write-Host "User found."
Write-Host ""
Write-Host "Display Name: $($user.DisplayName)"
Write-Host "UPN:          $($user.UserPrincipalName)"
Write-Host "Object ID:    $($user.Id)"
Write-Host ""

# ------------------------------------------------------------
# Step 3 - Review Azure RBAC assignments
# ------------------------------------------------------------

Write-Host "[3] Reviewing Azure RBAC role assignments..."

$assignments = Get-AzRoleAssignment -ObjectId $user.Id

if (-not $assignments) {

    Write-Warning "No direct Azure RBAC assignments were found for this identity."

}
else {

    $assignments |
        Select-Object RoleDefinitionName, Scope, ObjectType |
        Format-Table -AutoSize
}

# ------------------------------------------------------------
# Step 4 - Complete audit
# ------------------------------------------------------------

Write-Host ""
Write-Host "[4] Audit complete."
Write-Host ""
Write-Host "Review the role definitions and scopes before applying any permission changes."
Write-Host "This script does not modify Azure RBAC assignments."