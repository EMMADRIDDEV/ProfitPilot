-- Migration: Convert businesses.user_id to BIGINT to match users.id (if users.id is BIGINT)
-- Safe conversion: numeric user_id strings will be cast; non-numeric values will be set to NULL
-- Run this in Supabase SQL editor. Backup your data before running.
BEGIN;

-- Drop existing FK constraint if present
ALTER TABLE IF EXISTS public.businesses
  DROP CONSTRAINT IF EXISTS businesses_user_id_fkey;

-- If the column was declared NOT NULL, drop that constraint so conversion can introduce NULLs safely
ALTER TABLE IF EXISTS public.businesses
  ALTER COLUMN user_id DROP NOT NULL;

-- Change column type to BIGINT using safe cast for numeric strings, else NULL
ALTER TABLE public.businesses
  ALTER COLUMN user_id TYPE BIGINT USING (
    CASE
      WHEN user_id::text ~ '^[0-9]+$' THEN user_id::text::bigint
      ELSE NULL
    END
  );

-- Recreate FK to users(id) assuming users.id is BIGINT
ALTER TABLE public.businesses
  ADD CONSTRAINT businesses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

COMMIT;

-- Notes:
-- If you have existing businesses whose user_id cannot be cast to bigint, those rows will have user_id set to NULL.
-- After running, verify rows and update any orphaned businesses to the correct user IDs.
