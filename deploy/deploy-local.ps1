[CmdletBinding()]
param(
    [string]$Repository = "cqz-cio/TEIPEER-WEB",
    [string]$DeployHost = "124.220.2.69",
    [int]$DeployPort = 22,
    [string]$DeployUser = "ubuntu",
    [int]$SitePort = 18081,
    [string]$KeyPath = (Join-Path $env:USERPROFILE ".ssh\tripeer_github_actions"),
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-RequiredCommand {
    param([Parameter(Mandatory)][string]$Name)

    $command = Get-Command $Name -ErrorAction SilentlyContinue
    if (-not $command) {
        throw "Required command was not found: $Name"
    }
    return $command.Source
}

function Invoke-NativeCommand {
    param(
        [Parameter(Mandatory)][string]$Command,
        [Parameter(Mandatory)][string[]]$Arguments
    )

    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code $($LASTEXITCODE): $Command $($Arguments -join ' ')"
    }
}

function Invoke-NativeCapture {
    param(
        [Parameter(Mandatory)][string]$Command,
        [Parameter(Mandatory)][string[]]$Arguments
    )

    $output = & $Command @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) {
        $details = $output -join [Environment]::NewLine
        throw "Command failed with exit code $($LASTEXITCODE): $Command $($Arguments -join ' ') $details"
    }
    return ($output -join [Environment]::NewLine).Trim()
}

$repoRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$keyFullPath = [IO.Path]::GetFullPath($KeyPath)
$tempBase = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
$tempRoot = [IO.Path]::GetFullPath((Join-Path $tempBase ("tripeer-deploy-" + [guid]::NewGuid().ToString("N"))))
$worktreePath = Join-Path $tempRoot "source"
$archivePath = $null
$worktreeCreated = $false

if (-not $tempRoot.StartsWith($tempBase, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Temporary deployment path escaped the system temporary directory: $tempRoot"
}

$git = Get-RequiredCommand "git.exe"
$gh = Get-RequiredCommand "gh.exe"
$node = Get-RequiredCommand "node.exe"
$npm = Get-RequiredCommand "npm.cmd"
$tar = Get-RequiredCommand "tar.exe"
$scp = Get-RequiredCommand "scp.exe"
$ssh = Get-RequiredCommand "ssh.exe"

if (-not (Test-Path -LiteralPath $keyFullPath -PathType Leaf)) {
    throw "SSH private key was not found: $keyFullPath"
}

$nodeVersion = Invoke-NativeCapture $node @("--version")
if ($nodeVersion -notmatch '^v(?<major>\d+)\.') {
    throw "Could not determine the installed Node.js version: $nodeVersion"
}
$nodeMajor = [int]$Matches.major
if ($nodeMajor -lt 22) {
    throw "Node.js 22 or newer is required, but $nodeVersion is installed."
}
if ($nodeMajor -ne 22) {
    Write-Warning "CI uses Node.js 22; this local deployment will build with $nodeVersion."
}

Write-Host "Resolving the latest successful main CI run..." -ForegroundColor Cyan
$runsJson = Invoke-NativeCapture $gh @(
    "api",
    "--method", "GET",
    "repos/$Repository/actions/workflows/ci.yml/runs?branch=main&status=success&event=push&per_page=1"
)
$runsPayload = $runsJson | ConvertFrom-Json
$ciRun = @($runsPayload.workflow_runs) | Select-Object -First 1
if (-not $ciRun) {
    throw "No successful CI run was found for a push to main."
}

$commitSha = [string]$ciRun.head_sha
$ciRunId = [string]$ciRun.id
if ($commitSha -notmatch '^[0-9a-f]{40}$' -or $ciRunId -notmatch '^\d+$') {
    throw "GitHub returned an invalid CI revision or run id."
}

$releaseId = "$commitSha-$ciRunId"
$remoteArchive = "/tmp/tripeer-$releaseId.tar.gz"
$archivePath = Join-Path $tempRoot "tripeer-$releaseId.tar.gz"

Write-Host "Selected CI run: $ciRunId" -ForegroundColor Green
Write-Host "Selected commit: $commitSha" -ForegroundColor Green

New-Item -ItemType Directory -Path $tempRoot | Out-Null

try {
    $commitObject = $commitSha + "^{commit}"
    & $git -C $repoRoot cat-file -e $commitObject 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Fetching the selected commit..." -ForegroundColor Cyan
        Invoke-NativeCommand $git @("-C", $repoRoot, "fetch", "--no-tags", "origin", $commitSha)
    }

    Write-Host "Creating an isolated source checkout..." -ForegroundColor Cyan
    Invoke-NativeCommand $git @("-C", $repoRoot, "worktree", "add", "--detach", $worktreePath, $commitSha)
    $worktreeCreated = $true

    Push-Location $worktreePath
    try {
        Write-Host "Installing dependencies..." -ForegroundColor Cyan
        Invoke-NativeCommand $npm @("ci", "--no-audit", "--no-fund")

        Write-Host "Building the successful CI revision..." -ForegroundColor Cyan
        Invoke-NativeCommand $npm @("run", "build")

        $indexPath = Join-Path $worktreePath "dist\index.html"
        $assetsPath = Join-Path $worktreePath "dist\assets"
        if (-not (Test-Path -LiteralPath $indexPath -PathType Leaf) -or
            -not (Test-Path -LiteralPath $assetsPath -PathType Container)) {
            throw "Build output is missing dist/index.html or dist/assets."
        }

        Write-Host "Creating the temporary release archive..." -ForegroundColor Cyan
        Invoke-NativeCommand $tar @("-C", (Join-Path $worktreePath "dist"), "-czf", $archivePath, ".")
    }
    finally {
        Pop-Location
    }

    $archiveSizeMb = [math]::Round((Get-Item -LiteralPath $archivePath).Length / 1MB, 2)
    Write-Host "Release archive: $archiveSizeMb MB" -ForegroundColor Green

    if ($DryRun) {
        Write-Host "Dry run completed. Nothing was uploaded or deployed." -ForegroundColor Yellow
        return
    }

    $commonSshOptions = @(
        "-i", $keyFullPath,
        "-o", "BatchMode=yes",
        "-o", "IdentitiesOnly=yes",
        "-o", "StrictHostKeyChecking=yes",
        "-o", "ConnectTimeout=10",
        "-o", "ServerAliveInterval=15",
        "-o", "ServerAliveCountMax=4"
    )

    Write-Host "Uploading from this computer to Tencent Cloud..." -ForegroundColor Cyan
    $destination = $DeployUser + "@" + $DeployHost + ":" + $remoteArchive
    $scpArguments = @("-P", [string]$DeployPort) + $commonSshOptions + @($archivePath, $destination)
    Invoke-NativeCommand $scp $scpArguments

    Write-Host "Activating the release on Tencent Cloud..." -ForegroundColor Cyan
    $sshTarget = $DeployUser + "@" + $DeployHost
    $activateCommand = "sudo /usr/local/sbin/tripeer-deploy '$remoteArchive' '$releaseId'"
    $sshArguments = @("-p", [string]$DeployPort) + $commonSshOptions + @($sshTarget, $activateCommand)
    Invoke-NativeCommand $ssh $sshArguments

    $websiteUrl = "http://" + $DeployHost + ":" + $SitePort + "/"
    Write-Host "Checking $websiteUrl ..." -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri $websiteUrl -Method Get -TimeoutSec 15 -UseBasicParsing
    if ($response.StatusCode -ne 200) {
        throw "Public website check returned HTTP $($response.StatusCode)."
    }

    Write-Host "Deployment completed successfully: $websiteUrl" -ForegroundColor Green
    Write-Host "Release: $releaseId" -ForegroundColor Green
}
finally {
    if ($worktreeCreated) {
        & $git -C $repoRoot worktree remove --force $worktreePath 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Could not remove temporary Git worktree: $worktreePath"
        }
    }

    if (Test-Path -LiteralPath $tempRoot) {
        Remove-Item -LiteralPath $tempRoot -Recurse -Force
    }
    & $git -C $repoRoot worktree prune 2>$null
}
