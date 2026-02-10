@echo off
chcp 65001 >nul
echo 开始构建后处理...
echo.

echo 复制cloudfunctions...
xcopy /E /I /Y cloudfunctions build\wechatgame-001\cloudfunctions >nul
echo [OK] cloudfunctions已复制
echo.

echo 修复project.config.json...
powershell -Command "$config = Get-Content 'build\wechatgame-001\project.config.json' -Raw | ConvertFrom-Json; $config.libVersion = '3.14.2'; $config | Add-Member -NotePropertyName 'cloudfunctionRoot' -NotePropertyValue 'cloudfunctions/' -Force; $config | Add-Member -NotePropertyName 'cloudbaseRoot' -NotePropertyValue 'cloudfunctions/' -Force; $config | Add-Member -NotePropertyName 'cloudbaseEnv' -NotePropertyValue 'cloud1-1gmq4aiz75a438a0' -Force; $config | ConvertTo-Json -Depth 10 | Set-Content 'build\wechatgame-001\project.config.json'"
echo [OK] project.config.json已修复
echo.

echo 构建后处理完成！
echo 现在可以在微信开发者工具中打开项目了。
pause
