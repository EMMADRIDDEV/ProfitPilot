#!/bin/bash
# Quick Start Script for New Authentication System
# This script helps set up the new authentication system quickly

echo "======================================"
echo "ProfitPilot Authentication System Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Check if npm or pnpm is installed
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
    echo "✅ Using pnpm as package manager"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
    echo "✅ Using npm as package manager"
else
    echo "❌ Neither npm nor pnpm found. Please install Node.js and npm."
    exit 1
fi

echo ""
echo "========== STEP 1: Database Migration =========="
echo ""
echo "⚠️  IMPORTANT: Before continuing, you need to:"
echo ""
echo "1. Go to Supabase Dashboard: https://app.supabase.io"
echo "2. Select your project"
echo "3. Go to SQL Editor"
echo "4. Open file: /scripts/005_new_auth_tables.sql"
echo "5. Copy ALL the SQL code"
echo "6. Paste it into Supabase SQL Editor"
echo "7. Click RUN to execute"
echo ""
read -p "Have you executed the database migration? (yes/no): " migration_done
if [ "$migration_done" != "yes" ]; then
    echo "❌ Please run the database migration first before continuing."
    exit 1
fi
echo "✅ Database migration completed"
echo ""

echo "========== STEP 2: Environment Variables =========="
echo ""
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists"
    read -p "Do you want to reconfigure it? (yes/no): " reconfigure
else
    reconfigure="yes"
fi

if [ "$reconfigure" = "yes" ]; then
    echo ""
    echo "Creating .env.local file..."
    echo ""
    
    read -p "Enter Supabase URL: " supabase_url
    read -p "Enter Supabase Anon Key: " supabase_key
    read -p "Enter SMTP Host (gmail.com by default): " smtp_host
    smtp_host=${smtp_host:-smtp.gmail.com}
    read -p "Enter SMTP Port (587 by default): " smtp_port
    smtp_port=${smtp_port:-587}
    read -p "Enter SMTP User (your Gmail): " smtp_user
    read -s -p "Enter SMTP Password (Gmail App Password): " smtp_password
    echo ""
    read -p "Enter Frontend URL (http://localhost:3000 by default): " frontend_url
    frontend_url=${frontend_url:-http://localhost:3000}
    
    # Generate JWT secret
    jwt_secret=$(openssl rand -base64 32)
    
    # Create .env.local
    cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=$supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabase_key

SMTP_HOST=$smtp_host
SMTP_PORT=$smtp_port
SMTP_SECURE=false
SMTP_USER=$smtp_user
SMTP_PASSWORD=$smtp_password

EMAIL_FROM=noreply@profitpilot.com
FRONTEND_URL=$frontend_url

JWT_SECRET=$jwt_secret

NODE_ENV=development
EOF
    
    echo "✅ .env.local created successfully"
else
    echo "✅ Skipping .env.local configuration"
fi

echo ""
echo "========== STEP 3: Install Dependencies =========="
echo ""
echo "Running: $PACKAGE_MANAGER install"
echo ""
$PACKAGE_MANAGER install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully"
echo ""

echo "========== STEP 4: Verify Setup =========="
echo ""
echo "Checking configuration..."

if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    exit 1
fi

if [ ! -f "scripts/005_new_auth_tables.sql" ]; then
    echo "❌ Migration file not found"
    exit 1
fi

echo "✅ All configuration files present"
echo ""

echo "========== SETUP COMPLETE! =========="
echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Start the development server:"
echo "   $PACKAGE_MANAGER run dev"
echo ""
echo "2. Open your browser and test:"
echo "   - Registration: http://localhost:3000/register"
echo "   - Login: http://localhost:3000/login"
echo "   - Verify Email: http://localhost:3000/verify-email"
echo ""
echo "3. Full documentation:"
echo "   - Setup Guide: /AUTH_SETUP_GUIDE.md"
echo "   - Implementation Checklist: /AUTH_IMPLEMENTATION_CHECKLIST.md"
echo "   - System Summary: /NEW_AUTH_SYSTEM_SUMMARY.md"
echo ""
echo "📧 Important:"
echo "   - Make sure to use Gmail App Password (not your regular password)"
echo "   - Enable 2FA on Gmail first: https://myaccount.google.com/security"
echo "   - Get app password at: https://myaccount.google.com/apppasswords"
echo ""
echo "======================================"
