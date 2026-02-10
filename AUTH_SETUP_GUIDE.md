# New Authentication System - Setup Guide

## Overview
The authentication system has been completely redesigned to use email/password and Google OAuth instead of access codes.

### New Features:
1. **Email & Password Registration** - Users can sign up with their name, email, and password
2. **Email Verification** - Users receive a verification code via Gmail that they must confirm
3. **Email & Password Login** - Users login with their email and password
4. **Google OAuth** - (Framework in place, implementation pending) Users can sign up/login with Google
5. **Secure Session Management** - JWT-based sessions stored in database

## Step 1: Run Database Migration

Execute the SQL migration to create new tables:

```sql
-- Copy and paste the entire contents of scripts/005_new_auth_tables.sql
-- into your Supabase SQL Editor and execute
```

**Tables Created:**
- `users` - Main user table with email, password hash, and OAuth fields
- `email_verification_codes` - Temporary verification codes sent via email
- `sessions` - Stores active session tokens
- `password_reset_tokens` - For future password reset functionality
- Indexes for improved query performance

## Step 2: Update Environment Variables

Create a `.env.local` file in the root directory with the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Configuration (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password  # Use Gmail App Password, not your account password

EMAIL_FROM=noreply@profitpilot.com
FRONTEND_URL=http://localhost:3000  # Change to your production URL later

# Generate a secure random string for JWT_SECRET
JWT_SECRET=your_very_secure_random_secret_key_here_min_32_chars

NODE_ENV=development
```

### Getting Gmail App Password:
1. Enable 2-Factor Authentication on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer" (or your device)
4. Copy the generated app password and use it as `SMTP_PASSWORD`

## Step 3: Install Dependencies

```bash
npm install
# or
pnpm install
```

This will install the new packages:
- `bcryptjs` - For password hashing
- `nodemailer` - For sending emails
- `jsonwebtoken` - For session management
- `next-auth` - Framework for future OAuth implementation

## Step 4: Restart Development Server

```bash
npm run dev
```

## Updated Pages

### `/register` - User Registration
- Users enter: Name, Email, Password
- Validation ensures password is at least 8 characters
- User receives verification email after successful registration
- Redirects to `/verify-email` page

### `/verify-email` - Email Verification
- Users enter the code from their verification email
- Code is valid for 24 hours
- Alternative: Click link in email to auto-verify
- Can resend code if needed
- After verification, redirects to `/dashboard/setup`

### `/login` - User Login
- Users enter email and password
- Checks if email is verified before allowing login
- Creates secure session token
- If email not verified, redirects to `/verify-email`
- Google OAuth button placeholder (to be implemented)

### `/get-access-code` - Now Redirects to Register
- Old access code page now redirects to `/register`
- All access code functionality has been removed

## API Endpoints Used

All authentication is handled through server actions in `/app/actions/auth.ts`:

### Registration & Verification
- `registerUser(email, fullName, password)` - Create new user account
- `verifyEmail(code)` - Verify email address
- `resendVerificationCode(email)` - Send new verification code

### Login
- `loginWithEmail(email, password)` - Login with email/password
- `loginWithGoogle(email, fullName, googleId)` - Login/register with Google (framework ready)

### Session Management
- `getCurrentUser()` - Get current logged-in user
- `logout()` - Logout user and clear session

### Other
- `getBusiness()` - Get business info for current user

## Security Features

1. **Password Hashing** - Bcryptjs with 10 salt rounds
2. **Email Verification** - Required before login
3. **Session Tokens** - JWT signed tokens stored in database
4. **Secure Cookies** - HttpOnly, Secure, SameSite attributes
5. **Protected Routes** - Middleware ensures authentication
6. **SMTP Security** - Nodemailer sends emails securely

## Testing the New System

### Test Registration Flow:
1. Go to http://localhost:3000/register
2. Fill in name, email, password (min 8 chars)
3. Check your email for verification code
4. Go to http://localhost:3000/verify-email
5. Enter the code from email
6. Should redirect to /dashboard/setup

### Test Login Flow:
1. Go to http://localhost:3000/login
2. Enter email and password used in registration
3. Should redirect to /dashboard/setup
4. User is now authenticated

### Test Unverified User:
1. Register with one email
2. Try to login without verifying
3. Should show message to verify email
4. Should offer to resend code

## Production Deployment

When deploying to production:

1. Update `FRONTEND_URL` in environment to your production URL
2. Set `NODE_ENV=production`
3. Ensure `SMTP_SECURE=true` for production SMTP
4. Generate a new strong `JWT_SECRET` using a password generator
5. Keep all secrets in secure environment variables
6. Set up email sending from a proper email service
7. Update login/register links if domain changes

## Implementing Google OAuth (Next Steps)

The framework is ready for Google OAuth. To complete implementation:

1. Create Google OAuth app at https://console.cloud.google.com
2. Get Client ID and Client Secret
3. Add to environment variables
4. Update `/app/api/auth/callback/google` endpoint
5. Implement OAuth flow in authentication logic

## Troubleshooting

### Email not sending:
- Check `SMTP_USER` and `SMTP_PASSWORD` are correct
- Verify Gmail account has 2FA enabled
- Using Gmail App Password (not regular password)
- Check `EMAIL_FROM` format is valid

### Verification code not working:
- Code expires after 24 hours
- Check code matches exactly (case-sensitive)
- Ensure user exists in database
- Check browser console for detailed errors

### Can't login after registration:
- Verify email first at `/verify-email`
- Check password matches (case-sensitive)
- Ensure email is correct and lowercase

### Database errors:
- Run migration SQL at `/scripts/005_new_auth_tables.sql`
- Check Supabase connection strings
- Verify tables were created successfully

## File Changes Summary

### New Files:
- `/app/register/page.tsx` - Registration page
- `/app/verify-email/page.tsx` - Email verification page
- `/scripts/005_new_auth_tables.sql` - Database migration
- `.env.example` - Environment variables template

### Modified Files:
- `/app/actions/auth.ts` - Complete rewrite for new auth system
- `/app/login/page.tsx` - Changed from access code to email/password
- `/app/get-access-code/page.tsx` - Now redirects to register
- `/middleware.ts` - Updated for session-based auth
- `/package.json` - Added new dependencies

### Removed Functionality:
- Access code generation
- Access code validation
- Access code login
- `generateAccessCode()` function
- `/access_codes` table (replaced)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check server logs for detailed errors
4. Verify all environment variables are set correctly
