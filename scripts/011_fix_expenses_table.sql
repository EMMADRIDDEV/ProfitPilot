-- Fix expenses table schema cache issue by recreating the table with all columns
-- NOTE: This app uses custom JWT auth (not Supabase Auth), so RLS is not used.
-- Authorization is enforced server-side in server actions.

-- Drop the old table if it exists
DROP TABLE IF EXISTS public.expenses;

-- Create the expenses table with all required columns
CREATE TABLE public.expenses (
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

-- Note: RLS disabled since this app uses custom JWT auth enforced server-side.
-- ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_expenses_business_id ON public.expenses(business_id);
CREATE INDEX idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX idx_expenses_category ON public.expenses(category);
