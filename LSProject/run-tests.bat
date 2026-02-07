@echo off
chcp 65001 >nul
echo ========================================
echo   LianSe Unit Tests
echo ========================================
echo.

cd /d "E:\Project\LianSe\LSProject\tests"

if not exist "node_modules" (
    echo [1/2] Installing dependencies...
    call npm install
    echo.
) else (
    echo [1/2] Dependencies installed
    echo.
)

echo [2/2] Running tests...
echo.

call npm test

echo.
echo ========================================
echo   Tests completed!
echo ========================================
echo.
echo Other commands:
echo   npm run test:watch     - Watch mode
echo   npm run test:coverage  - Coverage report
echo   npm test EnemyData     - Run specific test
echo.

pause
