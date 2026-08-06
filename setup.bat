@echo off
echo =============================================
echo   Plannerix — Backend Setup Script
echo =============================================
echo.

REM Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found: 
node --version

REM Check for npm
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm not found.
    pause
    exit /b 1
)
echo [OK] npm found:
npm --version

echo.
echo [1/3] Installing dependencies...
npm install

echo.
echo [2/3] Checking for .env file...
if not exist .env (
    copy .env.example .env
    echo [OK] Created .env from example. Please edit .env and set your MySQL password!
) else (
    echo [OK] .env already exists.
)

echo.
echo [3/3] Ready! Run the server with:
echo        node server.js
echo.
echo IMPORTANT: Before starting, make sure MySQL is running and you have:
echo   1. Set DB_PASSWORD in .env
echo   2. Run the schema:  mysql -u root -p ^< database\schema.sql
echo.
pause
