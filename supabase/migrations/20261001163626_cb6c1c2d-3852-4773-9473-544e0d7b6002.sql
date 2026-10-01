ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '';