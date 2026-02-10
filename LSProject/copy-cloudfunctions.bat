@echo off
echo Copying cloudfunctions...
xcopy /E /I /Y cloudfunctions build\wechatgame-001\cloudfunctions
echo.
echo Done! Now manually edit project.config.json:
echo 1. Open: build\wechatgame-001\project.config.json
echo 2. Change "libVersion": "game" to "libVersion": "3.14.2"
echo 3. Add after miniprogramRoot line:
echo    "cloudfunctionRoot": "cloudfunctions/",
echo    "cloudbaseEnv": "cloud1-1gmq4aiz75a438a0",
echo.
pause
