# 微信小游戏构建后处理脚本
# 自动复制cloudfunctions并修复project.config.json

$buildDir = "E:\Project\LianSe\LSProject\build\wechatgame-001"
$sourceCloudFunctions = "E:\Project\LianSe\LSProject\cloudfunctions"

Write-Host "开始构建后处理..." -ForegroundColor Green

# 1. 复制cloudfunctions
if (Test-Path $sourceCloudFunctions) {
    Write-Host "复制cloudfunctions..." -ForegroundColor Yellow
    Copy-Item -Recurse $sourceCloudFunctions $buildDir -Force
    Write-Host "✓ cloudfunctions已复制" -ForegroundColor Green
} else {
    Write-Host "✗ 源cloudfunctions目录不存在" -ForegroundColor Red
}

# 2. 修复project.config.json
$configPath = "$buildDir\project.config.json"
if (Test-Path $configPath) {
    Write-Host "修复project.config.json..." -ForegroundColor Yellow
    
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    
    # 添加云开发配置
    $config | Add-Member -NotePropertyName "cloudfunctionRoot" -NotePropertyValue "cloudfunctions/" -Force
    $config | Add-Member -NotePropertyName "cloudbaseRoot" -NotePropertyValue "cloudfunctions/" -Force
    $config | Add-Member -NotePropertyName "cloudfunctionTemplateRoot" -NotePropertyValue "cloudfunctionTemplate/" -Force
    $config | Add-Member -NotePropertyName "cloudbaseEnv" -NotePropertyValue "cloud1-1gmq4aiz75a438a0" -Force
    
    # 修复libVersion
    $config.libVersion = "3.14.2"
    
    # 保存
    $config | ConvertTo-Json -Depth 10 | Set-Content $configPath
    
    Write-Host "✓ project.config.json已修复" -ForegroundColor Green
} else {
    Write-Host "✗ project.config.json不存在" -ForegroundColor Red
}

Write-Host "`n构建后处理完成！" -ForegroundColor Green
Write-Host "现在可以在微信开发者工具中打开项目了。" -ForegroundColor Cyan
