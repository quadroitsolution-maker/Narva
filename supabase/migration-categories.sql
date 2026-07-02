-- ============================================================
-- Narva Health — Add Categories Support
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add category column to products table if not exists
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;

-- 3. Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 4. Enable public read policy on categories
DROP POLICY IF EXISTS "categories_public_read" ON public.categories;
CREATE POLICY "categories_public_read" ON public.categories
    FOR SELECT USING (TRUE);

-- 5. Seed initial categories
INSERT INTO public.categories (name, slug) VALUES
('Sleep Health', 'sleep-health'),
('Science', 'science'),
('Cognitive', 'cognitive')
ON CONFLICT (slug) DO NOTHING;

-- 6. Update Melatonin Gummies product category
UPDATE public.products SET category = 'Sleep Health' WHERE slug = 'melatonin-gummies';
