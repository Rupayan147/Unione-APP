$ErrorActionPreference = "Continue"

$RepositoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
$HasFailure = $false

function Write-Check {
    param(
        [Parameter(Mandatory = $true)][string]$Label,
        [Parameter(Mandatory = $true)][bool]$Passed,
        [Parameter(Mandatory = $true)][string]$Detail
    )

    if ($Passed) {
        Write-Host ("{0,-14} OK       {1}" -f $Label, $Detail) -ForegroundColor Green
    }
    else {
        Write-Host ("{0,-14} MISSING  {1}" -f $Label, $Detail) -ForegroundColor Red
        $script:HasFailure = $true
    }
}

Write-Host "UNIONE environment health check" -ForegroundColor Cyan
Write-Host "Repository: $RepositoryRoot"
Write-Host ""

$GitCommand = Get-Command "git.exe" -ErrorAction SilentlyContinue
Write-Check "Git" ($null -ne $GitCommand) $(if ($null -ne $GitCommand) { (& $GitCommand.Source --version).Trim() } else { "Install Git for Windows" })

$NodeCommand = Get-Command "node.exe" -ErrorAction SilentlyContinue
$NodeDetail = if ($null -ne $NodeCommand) { (& $NodeCommand.Source --version).Trim() } else { "Recommended: v22.18.0" }
$NodeValid = $false
if ($null -ne $NodeCommand) {
    try {
        $ParsedNode = [version]$NodeDetail.TrimStart("v")
        $NodeValid = ($ParsedNode -ge [version]"20.19.4" -and $ParsedNode.Major -lt 23)
        if (-not $NodeValid) { $NodeDetail = "$NodeDetail (supported: >=20.19.4 and <23)" }
    }
    catch { $NodeValid = $false }
}
Write-Check "Node" $NodeValid $NodeDetail

$PnpmCommand = Get-Command "pnpm.cmd" -ErrorAction SilentlyContinue
$PnpmDetail = if ($null -ne $PnpmCommand) { (& $PnpmCommand.Source --version).Trim() } else { "Expected: 11.21.0" }
$PnpmValid = ($null -ne $PnpmCommand -and $PnpmDetail -eq "11.21.0")
Write-Check "pnpm" $PnpmValid $PnpmDetail

$WorkspaceValid = (Test-Path -LiteralPath (Join-Path $RepositoryRoot "package.json")) -and (Test-Path -LiteralPath (Join-Path $RepositoryRoot "pnpm-workspace.yaml"))
Write-Check "Workspace" $WorkspaceValid $(if ($WorkspaceValid) { "package.json + pnpm-workspace.yaml" } else { "Repository files not found" })

$ModulesValid = Test-Path -LiteralPath (Join-Path $RepositoryRoot "node_modules")
Write-Check "node_modules" $ModulesValid $(if ($ModulesValid) { "Installed" } else { "Run pnpm install" })

$ExpoConfig = Join-Path $RepositoryRoot "artifacts\unione-mobile\app.json"
$MobilePackage = Join-Path $RepositoryRoot "artifacts\unione-mobile\package.json"
$ExpoValid = (Test-Path -LiteralPath $ExpoConfig) -and (Test-Path -LiteralPath $MobilePackage)
Write-Check "Expo config" $ExpoValid $(if ($ExpoValid) { "artifacts\unione-mobile\app.json" } else { "Mobile Expo config not found" })

if ($PnpmValid -and $ModulesValid -and $WorkspaceValid) {
    Write-Host ""
    Write-Host "Running TypeScript validation..." -ForegroundColor Cyan
    Push-Location -LiteralPath $RepositoryRoot
    & $PnpmCommand.Source run typecheck
    $TypecheckValid = ($LASTEXITCODE -eq 0)
    Pop-Location
    Write-Check "TypeScript" $TypecheckValid $(if ($TypecheckValid) { "pnpm run typecheck passed" } else { "pnpm run typecheck failed" })
}
else {
    Write-Check "TypeScript" $false "Skipped until prerequisites are ready"
}

Write-Host ""
if ($HasFailure) {
    Write-Host "One or more checks need attention. See SETUP_NEW_PC.txt." -ForegroundColor Yellow
    exit 1
}

Write-Host "Environment is ready for npx expo start." -ForegroundColor Green
