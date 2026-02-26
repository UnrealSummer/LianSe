# Lianse Assets Cleanup Script
# Auto backup, delete old assets, copy new assets

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=== Lianse Assets Cleanup Started ===" -ForegroundColor Cyan

# Project paths
$projectRoot = "E:\Project\LianSe\LSProject"
$assetsTextures = Join-Path $projectRoot "assets\textures"
$prototypeAssets = Join-Path $projectRoot "downloaded_assets\prototype_assets"

# Step 1: Create backup
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = Join-Path $projectRoot "assets_backup_$timestamp"

Write-Host "`n[1/3] Creating backup at: $backupDir" -ForegroundColor Yellow

New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
Copy-Item $assetsTextures -Destination (Join-Path $backupDir "textures") -Recurse -Force
Write-Host "Backup completed" -ForegroundColor Green

# Step 2: Delete unused assets
Write-Host "`n[2/3] Deleting unused assets..." -ForegroundColor Yellow

$toDelete = @(
    (Join-Path $assetsTextures "blocks_test"),
    (Join-Path $assetsTextures "buttons"),
    (Join-Path $assetsTextures "buttons_Old"),
    (Join-Path $assetsTextures "ui\kenney"),
    (Join-Path $assetsTextures "ui\buttons"),
    (Join-Path $assetsTextures "ui\background.png"),
    (Join-Path $assetsTextures "ui\board_frame.png"),
    (Join-Path $assetsTextures "ui\bottom_bar.png"),
    (Join-Path $assetsTextures "ui\energy_bar.png"),
    (Join-Path $assetsTextures "ui\hp_bar.png"),
    (Join-Path $assetsTextures "ui\panel_main.png"),
    (Join-Path $assetsTextures "ui\panel_small.png"),
    (Join-Path $assetsTextures "ui\time_bar.png"),
    (Join-Path $assetsTextures "ui\top_bar.png")
)

$deletedCount = 0
foreach ($path in $toDelete) {
    if (Test-Path $path) {
        Remove-Item $path -Recurse -Force
        $deletedCount++
        $itemName = Split-Path $path -Leaf
        Write-Host "  - Deleted: $itemName" -ForegroundColor Gray
    }
}
Write-Host "Deleted $deletedCount items" -ForegroundColor Green

# Step 3: Copy new assets
Write-Host "`n[3/3] Copying prototype assets..." -ForegroundColor Yellow

# Create target directories
$blocksProto = Join-Path $assetsTextures "blocks_prototype"
$buttonsDir = Join-Path $assetsTextures "buttons"
New-Item -ItemType Directory -Force -Path $blocksProto | Out-Null
New-Item -ItemType Directory -Force -Path $buttonsDir | Out-Null

# Copy gem blocks
Copy-Item (Join-Path $prototypeAssets "blocks\*") -Destination $blocksProto -Force
Write-Host "  Copied 6 gem blocks to blocks_prototype/" -ForegroundColor Gray

# Copy UI elements
Copy-Item (Join-Path $prototypeAssets "ui\*") -Destination (Join-Path $assetsTextures "ui") -Force
Write-Host "  Copied 6 UI elements to ui/" -ForegroundColor Gray

# Copy buttons
Copy-Item (Join-Path $prototypeAssets "buttons\*") -Destination $buttonsDir -Force
Write-Host "  Copied 4 buttons to buttons/" -ForegroundColor Gray

# Copy icons
Copy-Item (Join-Path $prototypeAssets "icons\*") -Destination (Join-Path $assetsTextures "icons") -Force
Write-Host "  Copied 2 icons to icons/" -ForegroundColor Gray

Write-Host "`n=== Assets Cleanup Completed ===" -ForegroundColor Cyan
Write-Host "`nBackup location: $backupDir" -ForegroundColor Yellow
Write-Host "Please refresh assets in Cocos Creator" -ForegroundColor Yellow
