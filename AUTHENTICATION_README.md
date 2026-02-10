# ProfitPilot - New Authentication System

## 🎯 Quick Summary

The authentication system has been completely redesigned. Instead of access codes, users now:
1. **Register** with name, email, and password
2. **Receive** a verification code in their Gmail
3. **Verify** their email address
4. **Login** with email and password
5. **Access** the business dashboard

---

## ⚡ Quick Start (5 Steps)

### Step 1: Run Database Migration
- Go to [Supabase Dashboard](https://app.supabase.io)
- Click "SQL Editor"
- Copy all code from `/scripts/005_new_auth_tables.sql`
- Paste into SQL Editor and click "RUN"

### Step 2: Configure Environment
Run the setup script for your OS:
```bash
# Windows
setup-auth.bat

# Mac/Linux
bash setup-auth.sh
```

Or manually:
- Copy `.env.example` to `.env.local`
- Fill in Supabase credentials
- Add Gmail app password
- Set JWT_SECRET

### Step 3: Install Dependencies
```bash
npm install
# or
pnpm install
```

### Step 4: Start Development Server
```bash
npm run dev
# or
pnpm dev
```

### Step 5: Test It Out
- Register: http://localhost:3000/register
- Verify: http://localhost:3000/verify-email
- Login: http://localhost:3000/login

---

## 📖 Full Documentation

| Document | Purpose |
|----------|---------|
| [AUTH_SETUP_GUIDE.md](AUTH_SETUP_GUIDE.md) | Complete setup and configuration |
| [AUTH_IMPLEMENTATION_CHECKLIST.md](AUTH_IMPLEMENTATION_CHECKLIST.md) | Step-by-step checklist |
| [NEW_AUTH_SYSTEM_SUMMARY.md](NEW_AUTH_SYSTEM_SUMMARY.md) | System overview and changes |
| [lib/auth/constants.ts](lib/auth/constants.ts) | Type definitions and constants |

---

## 🔐 Key Features

✅ **Email & Password Registration** - Secure account creation  
✅ **Email Verification** - Required before login (24-hour codes)  
✅ **Secure Login** - JWT session tokens stored in database  
✅ **Google OAuth Ready** - Framework in place for future implementation  
✅ **Protected Routes** - Middleware enforces authentication  
✅ **Session Management** - 30-day sessions with server-side invalidation  

---

## 📁 New/Updated Files

### New Pages
- `/app/register/page.tsx` - User registration
- `/app/verify-email/page.tsx` - Email verification
- `/app/api/auth/callback/google/route.ts` - OAuth placeholder

### Updated Files
- `/app/actions/auth.ts` - Complete auth rewrite
- `/app/login/page.tsx` - Email/password login
- `/middleware.ts` - Session-based protection

### Database
- `/scripts/005_new_auth_tables.sql` - Tables for new system

### Documentation
- `AUTH_SETUP_GUIDE.md` - Setup instructions
- `AUTH_IMPLEMENTATION_CHECKLIST.md` - Implementation guide
- `NEW_AUTH_SYSTEM_SUMMARY.md` - System summary
- `.env.example` - Environment template
- `lib/auth/constants.ts` - Constants & types

---

## 🗄️ Database Changes

**New Tables:**
- `users` - User accounts with email/password
- `email_verification_codes` - Temporary verification codes
- `sessions` - Active user sessions
- `password_reset_tokens` - Password reset tokens

**Removed:**
- `access_codes` table

---

## 🚀 User Flows

### Registration
```
Register Page → Enter: Name, Email, Password
                       ↓
              Validation & Account Creation
                       ↓
              Verification Email Sent
                       ↓
              Verify Email Page → Enter Code
                       ↓
              Email Verified ✓
                       ↓
              Redirect to Dashboard Setup
```

### Login
```
Login Page → Enter: Email, Password
                    ↓
          Validation & Authentication
                    ↓
          Create Session Token
                    ↓
          Redirect to Dashboard
```

---

## 🔧 Configuration

### Required Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
JWT_SECRET=your_secret_key
```

### Optional
```
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
```

---

## 🔑 Getting Gmail App Password

1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Go to App Passwords: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the generated password
5. Paste as `SMTP_PASSWORD` in `.env.local`

---

## ❓ Troubleshooting

### Emails Not Sending
- ✓ Gmail has 2FA enabled
- ✓ Using app password (not regular password)
- ✓ SMTP credentials are correct

### Can't Verify Email
- ✓ Code not expired (24 hours)
- ✓ Code matches exactly
- ✓ User exists in database

### Can't Login
- ✓ Email verified first
- ✓ Password is correct (case-sensitive)
- ✓ Email is lowercase

---

## 📊 Project Structure

```
app/
  ├── register/
  │   └── page.tsx          # Registration form
  ├── login/
  │   └── page.tsx          # Login form
  ├── verify-email/
  │   └── page.tsx          # Verification form
  ├── actions/
  │   └── auth.ts           # Auth functions (rewritten)
  ├── api/auth/callback/
  │   └── google/route.ts   # OAuth callback
  └── dashboard/
      └── setup/            # Post-verification flow

scripts/
  └── 005_new_auth_tables.sql  # Database migration

lib/
  ├── auth/
  │   └── constants.ts      # Types and constants
  └── supabase/
      └── server.ts         # Supabase client

middleware.ts               # Session validation
```

---

## 🎓 Learning Resources

- [Bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [Nodemailer Documentation](https://nodemailer.com/)
- [JWT Documentation](https://jwt.io/)
- [Next.js Authentication](https://nextjs.org/docs/authentication)

---

## 🚢 Deployment Checklist

- [ ] Database migration applied
- [ ] Production environment variables set
- [ ] Email service configured
- [ ] JWT_SECRET changed to production value
- [ ] FRONTEND_URL updated
- [ ] Google OAuth credentials added (optional)
- [ ] Testing in staging environment
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Monitoring/logging set up

---

## 📞 Support

- **Setup Issues**: See [AUTH_SETUP_GUIDE.md](AUTH_SETUP_GUIDE.md)
- **Implementation**: See [AUTH_IMPLEMENTATION_CHECKLIST.md](AUTH_IMPLEMENTATION_CHECKLIST.md)
- **Overview**: See [NEW_AUTH_SYSTEM_SUMMARY.md](NEW_AUTH_SYSTEM_SUMMARY.md)

---

## 📝 Version History

- **v2.0.0** (Feb 2026) - Email/Password + OAuth Framework
  - Removed access codes
  - Added email verification requirement
  - Secure session tokens
  - Framework for Google OAuth

- **v1.0.0** (Earlier) - Access Code Authentication
  - Simple 8-character codes
  - No verification needed

---

## ⚠️ Breaking Changes

Access code authentication has been **completely removed**. This is a breaking change:

- ❌ No more `/get-access-code` endpoint
- ❌ No more access code login
- ❌ All users must use email/password or Google OAuth
- ❌ Old `access_codes` table is gone

Existing user data needs to be migrated manually if needed.

---

**Last Updated:** February 2026  
**Status:** Ready for Production  
**Maintainer:** Development Team
