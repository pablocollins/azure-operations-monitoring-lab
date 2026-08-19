<#
.SYNOPSIS
    Performs a read-only health check for a Windows host.

.DESCRIPTION
    Collects local operating system, CPU, memory, disk, service
    and network information to support VM troubleshooting.

    This script does not modify system configuration.

.PARAMETER TargetPort
    Optional TCP port used to review local listening state.

.EXAMPLE
    .\vm-health-check.ps1

.EXAMPLE
    .\vm-health-check.ps1 -TargetPort 443

.NOTES
    Project: Azure Operations & Monitoring Lab
    Purpose: Windows VM operational health check
#>

param (
    [ValidateRange(1, 65535)]
    [int]$TargetPort = 443
)

Write-Host ""
Write-Host "========================================"
Write-Host " Windows VM Health Check"
Write-Host "========================================"
Write-Host ""

# ------------------------------------------------------------
# Step 1 - Host information
# ------------------------------------------------------------

Write-Host "[1] Host information"

Write-Host "Computer Name: $env:COMPUTERNAME"
Write-Host "Current User:  $env:USERNAME"

$os = Get-CimInstance Win32_OperatingSystem

Write-Host "Operating System: $($os.Caption)"
Write-Host "Version:          $($os.Version)"
Write-Host "Last Boot Time:   $($os.LastBootUpTime)"
Write-Host ""

# ------------------------------------------------------------
# Step 2 - CPU information
# ------------------------------------------------------------

Write-Host "[2] CPU"

$cpu = Get-CimInstance Win32_Processor |
    Measure-Object -Property LoadPercentage -Average

Write-Host "Average CPU Load: $([math]::Round($cpu.Average, 2))%"
Write-Host ""

# ------------------------------------------------------------
# Step 3 - Memory information
# ------------------------------------------------------------

Write-Host "[3] Memory"

$totalMemoryMB = [math]::Round($os.TotalVisibleMemorySize / 1024, 2)
$freeMemoryMB = [math]::Round($os.FreePhysicalMemory / 1024, 2)
$usedMemoryMB = [math]::Round($totalMemoryMB - $freeMemoryMB, 2)

Write-Host "Total Memory: $totalMemoryMB MB"
Write-Host "Used Memory:  $usedMemoryMB MB"
Write-Host "Free Memory:  $freeMemoryMB MB"
Write-Host ""

# ------------------------------------------------------------
# Step 4 - Disk information
# ------------------------------------------------------------

Write-Host "[4] Disk usage"

Get-Volume |
    Where-Object DriveLetter |
    Select-Object `
        DriveLetter,
        FileSystemLabel,
        @{
            Name = "SizeGB"
            Expression = {
                [math]::Round($_.Size / 1GB, 2)
            }
        },
        @{
            Name = "FreeGB"
            Expression = {
                [math]::Round($_.SizeRemaining / 1GB, 2)
            }
        } |
    Format-Table -AutoSize

# ------------------------------------------------------------
# Step 5 - Network configuration
# ------------------------------------------------------------

Write-Host "[5] IPv4 configuration"

Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        $_.IPAddress -notlike "127.*" -and
        $_.AddressState -eq "Preferred"
    } |
    Select-Object InterfaceAlias, IPAddress, PrefixLength |
    Format-Table -AutoSize

# ------------------------------------------------------------
# Step 6 - Failed automatic services
# ------------------------------------------------------------

Write-Host "[6] Automatic services not running"

$failedServices = Get-Service |
    Where-Object {
        $_.StartType -eq "Automatic" -and
        $_.Status -ne "Running"
    }

if ($failedServices) {

    $failedServices |
        Select-Object Name, DisplayName, Status, StartType |
        Format-Table -AutoSize

}
else {

    Write-Host "No stopped automatic services detected."
}

# ------------------------------------------------------------
# Step 7 - Listening port
# ------------------------------------------------------------

Write-Host ""
Write-Host "[7] Checking local TCP port $TargetPort"

$listener = Get-NetTCPConnection `
    -State Listen `
    -LocalPort $TargetPort `
    -ErrorAction SilentlyContinue

if ($listener) {

    Write-Host "TCP port $TargetPort is listening."

    $listener |
        Select-Object LocalAddress, LocalPort, State, OwningProcess |
        Format-Table -AutoSize

}
else {

    Write-Warning "No local listener detected on TCP port $TargetPort."
}

# ------------------------------------------------------------
# Step 8 - Summary
# ------------------------------------------------------------

Write-Host ""
Write-Host "[8] Health check complete."
Write-Host ""
Write-Host "Review the collected information together with:"
Write-Host "- Azure VM power state"
Write-Host "- Monitoring data"
Write-Host "- Application logs"
Write-Host "- Recent changes"
Write-Host ""
Write-Host "No system configuration was modified."