-- Migration: Ensure required columns exist on `sales` table
-- Adds columns if missing: sale_date, product_name, quantity, unit_price, total_amount, payment_method, notes
-- Run in Supabase SQL editor. Backup DB first.
BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sales' AND column_name = 'sale_date'
  ) THEN
    ALTER TABLE public.sales ADD COLUMN sale_date DATE;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sales' AND column_name = 'product_name'
  ) THEN
    ALTER TABLE public.sales ADD COLUMN product_name VARCHAR(255);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sales' AND column_name = 'quantity'
  ) THEN
    ALTER TABLE public.sales ADD COLUMN quantity INT NOT NULL DEFAULT 0;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sales' AND column_name = 'unit_price'
  ) THEN
    ALTER TABLE public.sales ADD COLUMN unit_price DECIMAL(10,2) NOT NULL DEFAULT 0;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sales' AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE public.sales ADD COLUMN total_amount DECIMAL(10,2) NOT NULL DEFAULT 0;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sales' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE public.sales ADD COLUMN payment_method VARCHAR(50);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sales' AND column_name = 'notes'
  ) THEN
    ALTER TABLE public.sales ADD COLUMN notes TEXT;
  END IF;
END$$;

COMMIT;

-- After running, verify: SELECT * FROM information_schema.columns WHERE table_name='sales';
-- If you use PostgREST/Realtime (Supabase), it may take a moment to refresh the schema cache.
