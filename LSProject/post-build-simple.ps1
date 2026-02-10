# Post-build script for WeChat Mini Game
# Run this after building in Cocos Creator

Write-Host "=== Post-Build Processing ===" -ForegroundColor Cyan
Write-Host ""

$buildDir = "build\wechatgame-001"

# 1. Copy cloudfunctions
Write-Host "1. Copying cloudfunctions..." -ForegroundColor Yellow
Copy-Item -Recurse -Force cloudfunctions $buildDir\
Write-Host "   [OK] cloudfunctions copied" -ForegroundColor Green
Write-Host ""

# 2. Fix project.config.json
Write-Host "2. Fixing project.config.json..." -ForegroundColor Yellow
$configPath = "$buildDir\project.config.json"
$config = Get-Content $configPath -Raw | ConvertFrom-Json

# Add cloud configs
$config | Add-Member -NotePropertyName "cloudfunctionRoot" -NotePropertyValue "cloudfunctions/" -Force
$config | Add-Member -NotePropertyName "cloudbaseRoot" -NotePropertyValue "cloudfunctions/" -Force
$config | Add-Member -NotePropertyName "cloudfunctionTemplateRoot" -NotePropertyValue "cloudfunctionTemplate/" -Force
$config | Add-Member -NotePropertyName "cloudbaseEnv" -NotePropertyValue "cloud1-1gmq4aiz75a438a0" -Force

# Fix libVersion
$config.libVersion = "3.14.2"

# Save
$config | ConvertTo-Json -Depth 10 | Set-Content $configPath

Write-Host "   [OK] project.config.json fixed" -ForegroundColor Green
Write-Host ""

Write-Host "=== Post-Build Complete ===" -ForegroundColor Green
Write-Host "You can now open the project in WeChat DevTools" -ForegroundColor Cyan
Write-Host ""
