# Database Migration - Copy & Paste Instructions

## ⚡ Quick Steps

1. Go to https://app.supabase.io
2. Click your ProfitPilot project
3. Click "SQL Editor" in left sidebar
4. Click "New Query"
5. **Copy ALL the code below**
6. **Paste into the SQL editor**
7. **Click "RUN"**
8. **Wait for "Query executed successfully"**

---

## SQL Code to Run

Copy everything from the line below to the end of this file:

```sql
-- Drop old access_codes table (no longer needed)
DROP TABLE IF EXISTS public.access_codes CASCADE;

-- Create new users table with email/password authentication
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  password_hash VARCHAR(255),
  google_id VARCHAR(255),
  oauth_provider VARCHAR(50),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create email verification codes table
CREATE TABLE IF NOT EXISTS public.email_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  code VARCHAR(32) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create sessions table for OAuth and token management
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create businesses table (unchanged)
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_name VARCHAR(255),
  business_email VARCHAR(255),
  business_phone VARCHAR(20),
  business_address TEXT,
  business_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create sales table (unchanged)
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  sale_date DATE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create inventory table (unchanged)
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  product_code VARCHAR(100),
  category VARCHAR(100),
  quantity_in_stock INT NOT NULL DEFAULT 0,
  reorder_level INT DEFAULT 10,
  unit_cost DECIMAL(10, 2),
  selling_price DECIMAL(10, 2),
  supplier_name VARCHAR(255),
  supplier_contact VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create expenses table (unchanged)
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  expense_date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_google_id ON public.users(google_id);
CREATE INDEX idx_email_verification_user_id ON public.email_verification_codes(user_id);
CREATE INDEX idx_email_verification_code ON public.email_verification_codes(code);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_token ON public.sessions(session_token);
CREATE INDEX idx_password_reset_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_token ON public.password_reset_tokens(token);
CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX idx_sales_business_id ON public.sales(business_id);
CREATE INDEX idx_inventory_business_id ON public.inventory(business_id);
CREATE INDEX idx_expenses_business_id ON public.expenses(business_id);
```

---

## Verify It Worked

After clicking RUN, you should see:
- ✅ "Query executed successfully"
- No error messages

Then check tables were created:
1. Click "Table Editor" in left sidebar
2. Refresh the page
3. You should see these tables:
   - ✅ users
   - ✅ email_verification_codes
   - ✅ sessions
   - ✅ password_reset_tokens
   - ✅ businesses
   - ✅ sales
   - ✅ inventory
   - ✅ expenses

---

## What Each Table Does

| Table | Purpose |
|-------|---------|
| `users` | Stores user accounts with email, password hash, oauth fields |
| `email_verification_codes` | Temporary codes sent to user emails (valid 24 hours) |
| `sessions` | Active user sessions and JWT tokens |
| `password_reset_tokens` | Tokens for password reset (future feature) |
| `businesses` | User business information |
| `sales` | Sales records |
| `inventory` | Inventory items |
| `expenses` | Expense records |

---

## Troubleshooting

### "Table already exists"
- This is normal if you've run it before
- The SQL uses "IF NOT EXISTS"
- It won't duplicate tables
- Just continue

### Error: "access_codes table doesn't exist"
- The table might have already been deleted
- This is fine, the migration still works
- Just continue

### Error: "foreign key constraint"
- All required tables are being created
- Should not happen with this SQL
- Contact support if it does

### Query executed but nothing visible
- Refresh the page
- Click "Table Editor"
- Check if tables appear
- Might take a few seconds

---

## Next Steps After Migration

1. ✅ Migration complete
2. Create `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   EMAIL_FROM=noreply@profitpilot.com
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your_random_secret
   NODE_ENV=development
   ```
3. Run `npm install`
4. Run `npm run dev`
5. Test at http://localhost:3000/register

---

**That's it! The database is ready.** Now set up your environment variables.
