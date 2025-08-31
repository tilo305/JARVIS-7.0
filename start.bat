@echo off
echo ========================================
echo    JARVIS Chatbot - Auto Startup
echo ========================================
echo.

echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Dependencies not found. Installing...
    echo.
    pnpm install
    if %errorlevel% neq 0 (
        echo Failed to install dependencies!
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
) else (
    echo Dependencies found.
    echo.
)

echo Starting development server...
echo.
echo Your JARVIS chatbot will be available at:
echo http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

pnpm dev

pause
