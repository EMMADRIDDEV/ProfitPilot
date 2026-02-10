-- Migration: Add premium fields to users table
-- Adds `is_premium` boolean and `premium_expires_at` timestamp with time zone
BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_premium'
  ) THEN
    ALTER TABLE public.users ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'premium_expires_at'
  ) THEN
    ALTER TABLE public.users ADD COLUMN premium_expires_at TIMESTAMP WITH TIME ZONE;
  END IF;
END$$;

COMMIT;

-- After running, update existing premium users if needed.
