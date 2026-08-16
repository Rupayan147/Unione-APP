$ErrorActionPreference = "Stop"

$RecommendedNodeVersion = "22.18.0"
$MinimumNodeVersion = [version]"20.19.4"
$MaximumNodeMajor = 23
$RequiredPnpmVersion = "11.21.0"
$script:CurrentStep = "Starting"

function Get-CommandPath {
    param([Parameter(Mandatory = $true)][string]$Name)

    $command = Get-Command $Name -ErrorAction SilentlyContinue
    if ($null -eq $command) {
        return $null
    }
    return $command.Source
}

try {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " UNIONE - Windows Project Setup" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "This script checks prerequisites, installs workspace dependencies," 
    Write-Host "and runs the repository typecheck. It does not delete files or change"
    Write-Host "PowerShell execution policy."
    Write-Host ""

    $script:CurrentStep = "Confirming repository root"
    $RepositoryRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
    $RootPackage = Join-Path $RepositoryRoot "package.json"
    $WorkspaceFile = Join-Path $RepositoryRoot "pnpm-workspace.yaml"
    $MobileDirectory = Join-Path $RepositoryRoot "artifacts\unione-mobile"

    if (-not (Test-Path -LiteralPath $RootPackage)) {
        throw "package.json was not found beside setup.ps1. Run the script from a complete UNIONE clone."
    }
    if (-not (Test-Path -LiteralPath $WorkspaceFile)) {
        throw "pnpm-workspace.yaml was not found. The repository root is incomplete."
    }
    if (-not (Test-Path -LiteralPath $MobileDirectory)) {
        throw "The mobile app directory was not found at artifacts\unione-mobile."
    }

    Set-Location -LiteralPath $RepositoryRoot
    Write-Host "Repository: $RepositoryRoot" -ForegroundColor Green

    $script:CurrentStep = "Checking Git"
    $GitCommand = Get-CommandPath -Name "git.exe"
    if ($null -eq $GitCommand) {
        Write-Warning "Git was not found. The project can continue because it is already cloned, but Git is required for normal development."
    }
    else {
        $GitVersion = (& $GitCommand --version).Trim()
        Write-Host "Git:        $GitVersion" -ForegroundColor Green
    }

    $script:CurrentStep = "Checking Node.js"
    $NodeCommand = Get-CommandPath -Name "node.exe"
    if ($null -eq $NodeCommand) {
        Write-Host "Node.js is required." -ForegroundColor Red
        Write-Host "Recommended version: $RecommendedNodeVersion"

        $WingetCommand = Get-CommandPath -Name "winget.exe"
        if ($null -ne $WingetCommand) {
            Write-Host ""
            Write-Host "winget is available. The following command can install the verified Node version:"
            Write-Host "winget install --id OpenJS.NodeJS.LTS --exact --version $RecommendedNodeVersion" -ForegroundColor Yellow
            $InstallNode = Read-Host "Run that system installation now? [y/N]"
            if ($InstallNode -match "^[Yy]$") {
                & $WingetCommand install --id OpenJS.NodeJS.LTS --exact --version $RecommendedNodeVersion
                Write-Host "Node installation finished. Close this terminal, open a new PowerShell window, and run setup.ps1 again." -ForegroundColor Yellow
                exit 0
            }
        }

        throw "Install Node.js $RecommendedNodeVersion from https://nodejs.org/download/release/v$RecommendedNodeVersion/ and rerun setup.ps1."
    }

    $NodeVersionText = (& $NodeCommand --version).Trim().TrimStart("v")
    $NodeVersion = [version]$NodeVersionText
    if ($NodeVersion -lt $MinimumNodeVersion -or $NodeVersion.Major -ge $MaximumNodeMajor) {
        throw "Node.js $NodeVersionText is outside the supported range >=20.19.4 and <23. Install Node.js $RecommendedNodeVersion."
    }

    Write-Host "Node:       v$NodeVersionText" -ForegroundColor Green
    if ($NodeVersionText -ne $RecommendedNodeVersion) {
        Write-Warning "Node.js $NodeVersionText is supported, but $RecommendedNodeVersion is the version verified for this repository."
    }

    $script:CurrentStep = "Checking Corepack and pnpm"
    $PnpmCommand = Get-CommandPath -Name "pnpm.cmd"
    $PnpmNeedsActivation = $true

    if ($null -ne $PnpmCommand) {
        $DetectedPnpmVersion = (& $PnpmCommand --version).Trim()
        if ($DetectedPnpmVersion -eq $RequiredPnpmVersion) {
            $PnpmNeedsActivation = $false
        }
        else {
            Write-Warning "pnpm $DetectedPnpmVersion is active; this repository pins pnpm $RequiredPnpmVersion."
        }
    }

    if ($PnpmNeedsActivation) {
        $CorepackCommand = Get-CommandPath -Name "corepack.cmd"
        if ($null -eq $CorepackCommand) {
            throw "Corepack was not found. Reinstall Node.js $RecommendedNodeVersion, then run corepack enable."
        }

        Write-Host "Activating pnpm $RequiredPnpmVersion with Corepack..." -ForegroundColor Yellow
        & $CorepackCommand enable
        & $CorepackCommand prepare "pnpm@$RequiredPnpmVersion" --activate

        $PnpmCommand = Get-CommandPath -Name "pnpm.cmd"
        if ($null -eq $PnpmCommand) {
            throw "Corepack completed but pnpm.cmd is not visible. Open a new PowerShell window and run setup.ps1 again."
        }
    }

    $DetectedPnpmVersion = (& $PnpmCommand --version).Trim()
    if ($DetectedPnpmVersion -ne $RequiredPnpmVersion) {
        throw "Expected pnpm $RequiredPnpmVersion but detected $DetectedPnpmVersion."
    }
    Write-Host "pnpm:       $DetectedPnpmVersion" -ForegroundColor Green

    $script:CurrentStep = "Installing pnpm workspace dependencies"
    Write-Host ""
    Write-Host "Running pnpm install from the repository root..." -ForegroundColor Cyan
    & $PnpmCommand install
    if ($LASTEXITCODE -ne 0) {
        throw "pnpm install returned exit code $LASTEXITCODE."
    }

    $script:CurrentStep = "Running TypeScript validation"
    $PackageConfig = Get-Content -LiteralPath $RootPackage -Raw | ConvertFrom-Json
    if ($null -ne $PackageConfig.scripts -and $null -ne $PackageConfig.scripts.typecheck) {
        Write-Host ""
        Write-Host "Running pnpm run typecheck..." -ForegroundColor Cyan
        & $PnpmCommand run typecheck
        if ($LASTEXITCODE -ne 0) {
            throw "pnpm run typecheck returned exit code $LASTEXITCODE."
        }
    }
    else {
        Write-Warning "No root typecheck script was found; validation was skipped."
    }

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " UNIONE setup completed successfully" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Start the mobile app with:"
    Write-Host "  cd artifacts\unione-mobile" -ForegroundColor Cyan
    Write-Host "  npx expo start" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Install Expo Go on your phone, keep the phone and PC on the same"
    Write-Host "compatible network, and scan the QR code. Android Studio is not"
    Write-Host "required for physical-device Expo Go testing."
}
catch {
    Write-Host ""
    Write-Host "UNIONE SETUP FAILED" -ForegroundColor Red
    Write-Host "Step: $script:CurrentStep" -ForegroundColor Red
    Write-Host "Reason: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "See SETUP_NEW_PC.txt for manual setup and troubleshooting."
    exit 1
}
