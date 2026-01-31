# 自动化测试脚本
# 用途：在提交代码前自动运行测试

Write-Host "🧪 炼色项目 - 自动化测试" -ForegroundColor Cyan
Write-Host "=" * 50

# 检查项目文件
if (-not (Test-Path "assets/Scripts/TestRunner.ts")) {
    Write-Host "❌ 找不到TestRunner.ts" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 项目文件检查通过" -ForegroundColor Green

# 提示：需要在Cocos Creator中运行测试
Write-Host ""
Write-Host "📋 测试清单：" -ForegroundColor Yellow
Write-Host "  1. 打开 Cocos Creator" -ForegroundColor White
Write-Host "  2. 打开项目: E:\Project\LianSe\LSProject" -ForegroundColor White
Write-Host "  3. 在场景中确认TestRunner组件已挂载" -ForegroundColor White
Write-Host "  4. 点击运行按钮" -ForegroundColor White
Write-Host "  5. 查看控制台输出" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  必须确保测试通过率 100% 才能提交代码！" -ForegroundColor Yellow
Write-Host ""

# 询问测试是否通过
$response = Read-Host "测试是否全部通过？(y/n)"

if ($response -ne 'y') {
    Write-Host "❌ 测试未通过，请修复后再提交" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 测试通过，可以提交代码" -ForegroundColor Green
exit 0
