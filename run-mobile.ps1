$ErrorActionPreference = "Stop"

try {
    $RepositoryRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
    $MobileDirectory = Join-Path $RepositoryRoot "artifacts\unione-mobile"
    $RootNodeModules = Join-Path $RepositoryRoot "node_modules"
    $ExpoCommand = Join-Path $MobileDirectory "node_modules\.bin\expo.cmd"

    if (-not (Test-Path -LiteralPath $MobileDirectory)) {
        throw "Mobile app directory not found: $MobileDirectory"
    }
    if (-not (Test-Path -LiteralPath $RootNodeModules) -or -not (Test-Path -LiteralPath $ExpoCommand)) {
        throw "Dependencies are not installed. Run .\setup.ps1 or pnpm install from the repository root first."
    }

    $NpxCommand = Get-Command "npx.cmd" -ErrorAction SilentlyContinue
    if ($null -eq $NpxCommand) {
        throw "npx.cmd was not found. Install Node.js 22.18.0 and reopen PowerShell."
    }

    Set-Location -LiteralPath $MobileDirectory
    Write-Host "Starting UNIONE with Expo..." -ForegroundColor Cyan
    Write-Host "Open Expo Go and scan the QR code. Stop Metro with Ctrl+C." -ForegroundColor Cyan
    & $NpxCommand.Source --no-install expo start
    if ($LASTEXITCODE -ne 0) {
        throw "Expo exited with code $LASTEXITCODE."
    }
}
catch {
    Write-Host "Unable to start UNIONE: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "See SETUP_NEW_PC.txt for troubleshooting."
    exit 1
}
