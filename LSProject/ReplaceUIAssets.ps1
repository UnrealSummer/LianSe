# ReplaceUIAssets.ps1
# 正确替换UI资源，保留.meta文件和UUID

$replacements = @{
    "buttons\button_primary.png" = "ui\kenney\Green\Default\button_square_gradient.png"
    "buttons\button_secondary.png" = "ui\kenney\Blue\Default\button_square_flat.png"
    "buttons\button_danger.png" = "ui\kenney\Red\Default\button_square_gradient.png"
    "buttons\button_success.png" = "ui\kenney\Green\Default\button_square_gloss.png"
    "buttons\button_small.png" = "ui\kenney\Blue\Default\button_round_flat.png"
    "ui\hp_bar.png" = "ui\kenney\Red\Default\slide_horizontal_color.png"
    "ui\energy_bar.png" = "ui\kenney\Blue\Default\slide_horizontal_color.png"
    "ui\time_bar.png" = "ui\kenney\Yellow\Default\slide_horizontal_color.png"
    "icons\star.png" = "ui\kenney\Yellow\Default\star.png"
}

$basePath = "E:\Project\LianSe\LSProject\assets\textures"

Write-Host "=== UI Asset Replacement Script ===" -ForegroundColor Cyan
Write-Host ""

# 检查是否有buttons_Old备份
$buttonsOldPath = Join-Path $basePath "buttons_Old"
if (-not (Test-Path $buttonsOldPath)) {
    Write-Host "Warning: buttons_Old not found. Creating backup first..." -ForegroundColor Yellow
    $buttonsPath = Join-Path $basePath "buttons"
    Copy-Item $buttonsPath $buttonsOldPath -Recurse -Force
    Write-Host "Backup created: $buttonsOldPath" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 1: Restoring original assets from buttons_Old..." -ForegroundColor Yellow

# 恢复旧资源
$buttonsPath = Join-Path $basePath "buttons"
Copy-Item "$buttonsOldPath\*" $buttonsPath -Force
Write-Host "✓ Restored original button assets" -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Replacing PNG files while preserving .meta files..." -ForegroundColor Yellow

foreach ($target in $replacements.Keys) {
    $source = $replacements[$target]
    $targetPath = Join-Path $basePath $target
    $sourcePath = Join-Path $basePath $source
    
    if (-not (Test-Path $sourcePath)) {
        Write-Host "✗ Source not found: $source" -ForegroundColor Red
        continue
    }
    
    # 备份.meta文件
    $metaPath = "$targetPath.meta"
    $metaBackup = "$metaPath.backup"
    
    if (Test-Path $metaPath) {
        Copy-Item $metaPath $metaBackup -Force
    }
    
    # 替换PNG文件
    Copy-Item $sourcePath $targetPath -Force
    Write-Host "  ✓ Replaced: $(Split-Path $target -Leaf)" -ForegroundColor Green
    
    # 恢复.meta文件
    if (Test-Path $metaBackup) {
        Copy-Item $metaBackup $metaPath -Force
        Remove-Item $metaBackup
    }
}

Write-Host ""
Write-Host "=== Replacement Complete! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open Cocos Creator"
Write-Host "2. Press F5 to refresh assets"
Write-Host "3. Check all scenes to verify assets are displayed correctly"
Write-Host ""
Write-Host "If assets are still missing, see FIX_MISSING_REFERENCES.md" -ForegroundColor Yellow
