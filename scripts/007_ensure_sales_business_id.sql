-- Migration: Ensure `sales.business_id` column exists and has FK to `businesses(id)`
-- Run in Supabase SQL editor. Backup your DB first.
BEGIN;

-- Add business_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sales' AND column_name = 'business_id'
  ) THEN
    ALTER TABLE public.sales ADD COLUMN business_id UUID;
  END IF;
END$$;

-- Add foreign key constraint if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'sales' AND c.conname = 'sales_business_id_fkey'
  ) THEN
    ALTER TABLE public.sales
      ADD CONSTRAINT sales_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;
  END IF;
END$$;

COMMIT;

-- After running: verify the column exists and that existing sales have a valid business_id value.
