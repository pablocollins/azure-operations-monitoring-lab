<#
.SYNOPSIS
    Reviews Azure Backup job status for a Recovery Services Vault.

.DESCRIPTION
    This script retrieves a Recovery Services Vault, sets the vault context,
    and lists recent Azure Backup jobs.

    The script is read-only and does not create, modify, or remove
    backup configuration.

.PARAMETER ResourceGroupName
    Resource group containing the Recovery Services Vault.

.PARAMETER VaultName
    Name of the Recovery Services Vault.

.EXAMPLE
    .\backup-status.ps1 `
        -ResourceGroupName rg-ops-lab `
        -VaultName rsv-ops-lab

.NOTES
    Project: Azure Operations & Monitoring Lab
    Purpose: Azure Backup operational auditing
#>

param (
    [Parameter(Mandatory = $true)]
    [string]$ResourceGroupName,

    [Parameter(Mandatory = $true)]
    [string]$VaultName
)

Write-Host ""
Write-Host "========================================"
Write-Host " Azure Backup Status Audit"
Write-Host "========================================"
Write-Host ""

# ------------------------------------------------------------
# Step 1 - Validate Azure context
# ------------------------------------------------------------

Write-Host "[1] Checking Azure context..."

$context = Get-AzContext

if (-not $context) {
    Write-Error "No active Azure context found."
    exit 1
}

Write-Host "Account:      $($context.Account.Id)"
Write-Host "Subscription: $($context.Subscription.Name)"
Write-Host ""

# ------------------------------------------------------------
# Step 2 - Retrieve Recovery Services Vault
# ------------------------------------------------------------

Write-Host "[2] Retrieving Recovery Services Vault..."

$vault = Get-AzRecoveryServicesVault `
    -ResourceGroupName $ResourceGroupName `
    -Name $VaultName

if (-not $vault) {
    Write-Error "Recovery Services Vault not found: $VaultName"
    exit 1
}

Write-Host "Vault found."
Write-Host "Name:     $($vault.Name)"
Write-Host "Location: $($vault.Location)"
Write-Host ""

# ------------------------------------------------------------
# Step 3 - Set vault context
# ------------------------------------------------------------

Write-Host "[3] Setting Recovery Services Vault context..."

Set-AzRecoveryServicesVaultContext -Vault $vault

Write-Host "Vault context configured."
Write-Host ""

# ------------------------------------------------------------
# Step 4 - Review recent backup jobs
# ------------------------------------------------------------

Write-Host "[4] Reviewing recent backup jobs..."

$jobs = Get-AzRecoveryServicesBackupJob

if (-not $jobs) {

    Write-Warning "No backup jobs were returned."

}
else {

    $jobs |
        Select-Object `
            WorkloadName,
            Operation,
            Status,
            StartTime,
            EndTime |
        Sort-Object StartTime -Descending |
        Format-Table -AutoSize
}

# ------------------------------------------------------------
# Step 5 - Review failed jobs
# ------------------------------------------------------------

Write-Host ""
Write-Host "[5] Failed backup jobs"

$failedJobs = $jobs |
    Where-Object Status -eq "Failed"

if ($failedJobs) {

    $failedJobs |
        Select-Object `
            WorkloadName,
            Operation,
            Status,
            StartTime,
            EndTime |
        Format-Table -AutoSize

}
else {

    Write-Host "No failed backup jobs detected in the returned job list."
}

# ------------------------------------------------------------
# Step 6 - Finish
# ------------------------------------------------------------

Write-Host ""
Write-Host "[6] Backup audit complete."
Write-Host ""
Write-Host "Review:"
Write-Host "- Failed jobs"
Write-Host "- Latest successful backup"
Write-Host "- Recovery point availability"
Write-Host "- RPO impact"
Write-Host ""
Write-Host "This script does not modify Azure Backup configuration."