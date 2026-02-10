@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   WeChat Mini Game Post-Build Fix
echo ========================================
echo.

:: Step 1: Copy cloudfunctions
echo [1/2] Copying cloudfunctions...
xcopy /E /I /Y /Q cloudfunctions build\wechatgame-001\cloudfunctions >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Failed to copy cloudfunctions
    pause
    exit /b 1
)
echo [OK] cloudfunctions copied
echo.

:: Step 2: Fix project.config.json
echo [2/2] Fixing project.config.json...

:: Create temp file with correct config
(
echo {
echo     "description": "项目配置文件。",
echo     "miniprogramRoot": "./",
echo     "cloudfunctionRoot": "cloudfunctions/",
echo     "cloudbaseRoot": "cloudfunctions/",
echo     "cloudfunctionTemplateRoot": "cloudfunctionTemplate/",
echo     "cloudbaseEnv": "cloud1-1gmq4aiz75a438a0",
echo     "setting": {
echo         "urlCheck": true,
echo         "postcss": true,
echo         "minified": true,
echo         "newFeature": false,
echo         "enhance": true,
echo         "useIsolateContext": true,
echo         "es6": false,
echo         "compileWorklet": false,
echo         "uglifyFileName": false,
echo         "uploadWithSourceMap": true,
echo         "packNpmManually": false,
echo         "packNpmRelationList": [],
echo         "minifyWXSS": true,
echo         "minifyWXML": true,
echo         "localPlugins": false,
echo         "disableUseStrict": false,
echo         "useCompilerPlugins": false,
echo         "condition": false,
echo         "swc": false,
echo         "disableSWC": true,
echo         "babelSetting": {
echo             "ignore": [],
echo             "disablePlugins": [],
echo             "outputPath": ""
echo         }
echo     },
echo     "compileType": "game",
echo     "libVersion": "3.14.2",
echo     "appid": "wx9cef61e5dbb47018",
echo     "projectname": "技能消消消",
echo     "condition": {
echo         "search": {
echo             "current": -1,
echo             "list": []
echo         },
echo         "conversation": {
echo             "current": -1,
echo             "list": []
echo         },
echo         "game": {
echo             "currentL": -1,
echo             "list": [],
echo             "current": -1
echo         },
echo         "miniprogram": {
echo             "current": -1,
echo             "list": []
echo         }
echo     },
echo     "simulatorPluginLibVersion": {},
echo     "packOptions": {
echo         "ignore": [],
echo         "include": []
echo     },
echo     "isGameTourist": false,
echo     "editorSetting": {}
echo }
) > build\wechatgame-001\project.config.json

if errorlevel 1 (
    echo [ERROR] Failed to write project.config.json
    pause
    exit /b 1
)
echo [OK] project.config.json fixed
echo.

echo ========================================
echo   Post-Build Fix Complete!
echo ========================================
echo.
echo You can now open the project in WeChat DevTools:
echo   build\wechatgame-001
echo.
pause
