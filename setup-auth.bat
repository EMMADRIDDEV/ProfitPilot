@echo off
REM Quick Start Script for New Authentication System (Windows)
REM This script helps set up the new authentication system quickly

cls
echo ======================================
echo ProfitPilot Authentication System Setup
echo ======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js detected: %NODE_VERSION%
echo.

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% equ 0 (
    set PACKAGE_MANAGER=pnpm
    echo Using pnpm as package manager
) else (
    set PACKAGE_MANAGER=npm
    echo Using npm as package manager
)

echo.
echo ========== STEP 1: Database Migration ==========
echo.
echo IMPORTANT: Before continuing, you need to:
echo.
echo 1. Go to Supabase Dashboard: https://app.supabase.io
echo 2. Select your project
echo 3. Go to SQL Editor
echo 4. Open file: /scripts/005_new_auth_tables.sql
echo 5. Copy ALL the SQL code
echo 6. Paste it into Supabase SQL Editor
echo 7. Click RUN to execute
echo.
set /p migration_done="Have you executed the database migration? (yes/no): "
if /i "%migration_done%"=="yes" (
    echo Database migration completed
) else (
    echo Please run the database migration first before continuing.
    pause
    exit /b 1
)

echo.
echo ========== STEP 2: Environment Variables ==========
echo.

if exist ".env.local" (
    echo .env.local already exists
    set /p reconfigure="Do you want to reconfigure it? (yes/no): "
) else (
    set reconfigure=yes
)

if /i "%reconfigure%"=="yes" (
    echo.
    echo Creating .env.local file...
    echo.
    
    set /p supabase_url="Enter Supabase URL: "
    set /p supabase_key="Enter Supabase Anon Key: "
    set /p smtp_host="Enter SMTP Host (default: smtp.gmail.com): "
    if "%smtp_host%"=="" set smtp_host=smtp.gmail.com
    set /p smtp_port="Enter SMTP Port (default: 587): "
    if "%smtp_port%"=="" set smtp_port=587
    set /p smtp_user="Enter SMTP User (your Gmail): "
    set /p smtp_password="Enter SMTP Password (Gmail App Password): "
    set /p frontend_url="Enter Frontend URL (default: http://localhost:3000): "
    if "%frontend_url%"=="" set frontend_url=http://localhost:3000
    
    REM Generate random JWT secret (using PowerShell)
    for /f "tokens=*" %%i in ('powershell -Command "[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString())) + [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random)))"') do set jwt_secret=%%i
    
    (
        echo NEXT_PUBLIC_SUPABASE_URL=%supabase_url%
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY=%supabase_key%
        echo.
        echo SMTP_HOST=%smtp_host%
        echo SMTP_PORT=%smtp_port%
        echo SMTP_SECURE=false
        echo SMTP_USER=%smtp_user%
        echo SMTP_PASSWORD=%smtp_password%
        echo.
        echo EMAIL_FROM=noreply@profitpilot.com
        echo FRONTEND_URL=%frontend_url%
        echo.
        echo JWT_SECRET=%jwt_secret%
        echo.
        echo NODE_ENV=development
    ) > .env.local
    
    echo .env.local created successfully
) else (
    echo Skipping .env.local configuration
)

echo.
echo ========== STEP 3: Install Dependencies ==========
echo.
echo Running: %PACKAGE_MANAGER% install
echo.
call %PACKAGE_MANAGER% install

if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully
echo.

echo ========== STEP 4: Verify Setup ==========
echo.
echo Checking configuration...

if not exist ".env.local" (
    echo .env.local file not found
    pause
    exit /b 1
)

if not exist "scripts\005_new_auth_tables.sql" (
    echo Migration file not found
    pause
    exit /b 1
)

echo All configuration files present
echo.

echo ========== SETUP COMPLETE! ==========
echo.
echo Next steps:
echo.
echo 1. Start the development server:
echo    %PACKAGE_MANAGER% run dev
echo.
echo 2. Open your browser and test:
echo    - Registration: http://localhost:3000/register
echo    - Login: http://localhost:3000/login
echo    - Verify Email: http://localhost:3000/verify-email
echo.
echo 3. Full documentation:
echo    - Setup Guide: /AUTH_SETUP_GUIDE.md
echo    - Implementation Checklist: /AUTH_IMPLEMENTATION_CHECKLIST.md
echo    - System Summary: /NEW_AUTH_SYSTEM_SUMMARY.md
echo.
echo Important:
echo    - Make sure to use Gmail App Password (not your regular password)
echo    - Enable 2FA on Gmail first: https://myaccount.google.com/security
echo    - Get app password at: https://myaccount.google.com/apppasswords
echo.
echo ======================================
echo.

pause
