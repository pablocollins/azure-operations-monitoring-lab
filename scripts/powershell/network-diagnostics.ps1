<#
.SYNOPSIS
    Performs read-only network diagnostics for a target host and TCP port.

.DESCRIPTION
    Collects local IPv4 configuration, routing information and TCP
    connectivity results to support network troubleshooting.

    This script does not modify network configuration.

.PARAMETER Destination
    Destination IP address or DNS name to test.

.PARAMETER Port
    TCP destination port to test.

.EXAMPLE
    .\network-diagnostics.ps1 -Destination 10.10.1.20 -Port 443

.NOTES
    Project: Azure Operations & Monitoring Lab
    Purpose: Network connectivity troubleshooting
#>

param (
    [Parameter(Mandatory = $true)]
    [string]$Destination,

    [Parameter(Mandatory = $true)]
    [ValidateRange(1, 65535)]
    [int]$Port
)

Write-Host ""
Write-Host "========================================"
Write-Host " Network Diagnostics"
Write-Host "========================================"
Write-Host ""

# ------------------------------------------------------------
# Step 1 - Display diagnostic target
# ------------------------------------------------------------

Write-Host "[1] Diagnostic target"
Write-Host "Destination: $Destination"
Write-Host "TCP Port:    $Port"
Write-Host ""

# ------------------------------------------------------------
# Step 2 - Review local IPv4 configuration
# ------------------------------------------------------------

Write-Host "[2] Local IPv4 configuration"

Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        $_.IPAddress -notlike "127.*" -and
        $_.AddressState -eq "Preferred"
    } |
    Select-Object InterfaceAlias, IPAddress, PrefixLength |
    Format-Table -AutoSize

# ------------------------------------------------------------
# Step 3 - Review default route
# ------------------------------------------------------------

Write-Host "[3] Default route"

Get-NetRoute -AddressFamily IPv4 |
    Where-Object {
        $_.DestinationPrefix -eq "0.0.0.0/0"
    } |
    Select-Object InterfaceAlias, DestinationPrefix, NextHop, RouteMetric |
    Format-Table -AutoSize

# ------------------------------------------------------------
# Step 4 - Test TCP connectivity
# ------------------------------------------------------------

Write-Host "[4] Testing TCP connectivity..."

$result = Test-NetConnection `
    -ComputerName $Destination `
    -Port $Port `
    -WarningAction SilentlyContinue

Write-Host ""
Write-Host "Remote Address:     $($result.RemoteAddress)"
Write-Host "Remote Port:        $($result.RemotePort)"
Write-Host "Source Address:     $($result.SourceAddress)"
Write-Host "TCP Test Succeeded: $($result.TcpTestSucceeded)"

# ------------------------------------------------------------
# Step 5 - Interpret result
# ------------------------------------------------------------

Write-Host ""
Write-Host "[5] Result"

if ($result.TcpTestSucceeded) {

    Write-Host "TCP connectivity succeeded."

}
else {

    Write-Warning "TCP connectivity failed."

    Write-Host ""
    Write-Host "Possible investigation areas:"
    Write-Host "- Destination workload state"
    Write-Host "- Destination IP address"
    Write-Host "- Network Security Group rules"
    Write-Host "- Routing"
    Write-Host "- Guest OS firewall"
    Write-Host "- Application listener"
}

# ------------------------------------------------------------
# Step 6 - Finish
# ------------------------------------------------------------

Write-Host ""
Write-Host "[6] Diagnostic complete."
Write-Host "No network configuration was modified."