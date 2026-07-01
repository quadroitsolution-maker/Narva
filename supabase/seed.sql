-- ============================================================
-- Narva Health — Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- 1. Insert Melatonin Gummies Product (with ingredients)
INSERT INTO public.products (
    id, slug, name, description,
    price, compare_price, stock_qty, low_stock_threshold,
    is_subscription_eligible, is_active, images, ingredients
) VALUES (
    '88888888-8888-8888-8888-888888888888',
    'melatonin-gummies',
    'Narva Melatonin Sleep Gummies',
    'Doctor-formulated sleep aid designed for high-performers. Made with premium L-Theanine, Chamomile, and Magnesium. Helps you fall asleep faster, wake up refreshed, and feel fully recovered without any morning grogginess.',
    399.00, 499.00, 150, 10, TRUE, TRUE,
    ARRAY['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=600&auto=format&fit=crop'],
    '[
        {"name": "Melatonin (3mg)", "desc": "Naturally regulates your sleep-wake cycle."},
        {"name": "L-Theanine (100mg)", "desc": "Promotes relaxation and reduces bedtime anxiety."},
        {"name": "Magnesium (50mg)", "desc": "Supports muscle relaxation and sleep depth."},
        {"name": "Chamomile Extract", "desc": "Soothes the nervous system for gentle rest."}
    ]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Approved Reviews
INSERT INTO public.reviews (
    product_id, customer_name, city, rating, title, body,
    is_verified_purchase, status,
    video_url, admin_reply, reply_at
) VALUES (
    '88888888-8888-8888-8888-888888888888',
    'Priya Sharma', 'Mumbai', 5,
    'My night ritual!',
    'I take 1 gummy every night and wake up feeling so refreshed. The science behind this is actual gold.',
    TRUE, 'approved',
    'https://assets.mixkit.co/videos/preview/mixkit-woman-lying-in-bed-and-smiling-41855-large.mp4',
    NULL, NULL
), (
    '88888888-8888-8888-8888-888888888888',
    'Rohan Malhotra', 'Bangalore', 5,
    'Startup life saver',
    'Shattered sleep is now a thing of the past. Absolute sanity saver.',
    TRUE, 'approved',
    'https://assets.mixkit.co/videos/preview/mixkit-young-woman-sleeping-in-bed-41857-large.mp4',
    NULL, NULL
), (
    '88888888-8888-8888-8888-888888888888',
    'Dr. Kabir Sen', 'Delhi', 5,
    'Highly recommended clinically',
    'Excellent non-habit-forming formulation. Great response from my patients.',
    TRUE, 'approved',
    'https://assets.mixkit.co/videos/preview/mixkit-putting-on-a-sleep-mask-in-bed-42475-large.mp4',
    NULL, NULL
), (
    '88888888-8888-8888-8888-888888888888',
    'Arya Sharma', 'Mumbai', 5,
    'Absolutely life-changing!',
    'As an early-stage startup founder, my sleep schedule was completely wrecked. Taking one Narva gummy 30 mins before bed has helped me fall asleep consistently.',
    TRUE, 'approved',
    NULL,
    'Thanks for the kind words, Arya! Glad to know Narva helps you stay rested during your grind.',
    timezone('utc'::text, now())
), (
    '88888888-8888-8888-8888-888888888888',
    'Dr. Kabir Sen', 'Delhi', 5,
    'No morning grogginess',
    'I have tried other melatonin pills before and they always made me feel like a zombie in the morning. Narvas formula with L-theanine and magnesium is incredibly clean. Feel totally refreshed at 6 AM.',
    TRUE, 'approved',
    NULL, NULL, NULL
), (
    '88888888-8888-8888-8888-888888888888',
    'Rohan Mehta', 'Bangalore', 4,
    'Great taste and works well',
    'Tastes like real berries, and works within 25 minutes. Docked 1 star because shipping took 4 days to Bangalore, but the product itself is top-tier.',
    TRUE, 'approved',
    NULL, NULL, NULL
);

-- 3. Insert Active Coupons
INSERT INTO public.coupons (
    code, type, value, min_order_value, max_discount,
    usage_limit, used_count, is_first_order_only,
    valid_from, valid_until, is_active
) VALUES (
    'WELCOME10', 'pct', 10.00, 299.00, 100.00,
    500, 14, TRUE,
    timezone('utc'::text, now() - INTERVAL '1 day'),
    timezone('utc'::text, now() + INTERVAL '30 days'),
    TRUE
), (
    'FREESHIP', 'free_shipping', 40.00, 350.00, 40.00,
    1000, 89, FALSE,
    timezone('utc'::text, now() - INTERVAL '1 day'),
    timezone('utc'::text, now() + INTERVAL '60 days'),
    TRUE
) ON CONFLICT (code) DO NOTHING;

-- 4. Insert Consultation Slots
INSERT INTO public.consultation_slots (date, start_time, end_time, is_booked) VALUES
(CURRENT_DATE + 1, '10:00:00', '10:30:00', FALSE),
(CURRENT_DATE + 1, '11:00:00', '11:30:00', FALSE),
(CURRENT_DATE + 1, '14:00:00', '14:30:00', FALSE),
(CURRENT_DATE + 1, '15:00:00', '15:30:00', FALSE),
(CURRENT_DATE + 2, '10:00:00', '10:30:00', FALSE),
(CURRENT_DATE + 2, '11:00:00', '11:30:00', FALSE),
(CURRENT_DATE + 2, '14:00:00', '14:30:00', FALSE);

-- 5. Insert Blog Posts
INSERT INTO public.blog_posts (
    slug, title, excerpt, body,
    cover_image_url, author_name, author_image_url,
    category, read_time,
    seo_title, seo_description, schema_type,
    published_at, status
) VALUES (
    'how-to-fix-your-circadian-rhythm',
    'How to Fix Your Circadian Rhythm: A Doctor-Backed Guide',
    'Struggling to sleep and wake up at consistent times? Learn how light, timing, and simple habits can reset your internal clock naturally.',
    '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Your circadian rhythm is your bodys internal 24-hour clock. Resetting it requires consistent environmental triggers, the most powerful of which is morning sunlight."}]}]}'::jsonb,
    'https://images.unsplash.com/photo-1511295742364-92767eb89d9e?q=80&w=600&auto=format&fit=crop',
    'Dr. Rohan Mehta, MBBS (AIIMS)',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop',
    'Sleep Health', '5 min read',
    'Reset Your Circadian Rhythm | Narva Health Journal',
    'Step-by-step medical tips to align your sleep schedule with your daily grind.',
    'MedicalWebPage',
    timezone('utc'::text, now()),
    'published'
), (
    'blue-light-and-sleep-quality',
    'How Blue Light Wrecks Your Melatonin Secretion',
    'Discover the scientific impact of screens on your pineal gland and how to protect your sleep score from evening blue light exposure.',
    '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Screens emit high-energy visible light that suppresses melatonin production, delaying your sleep cycle by up to 2 hours."}]}]}'::jsonb,
    'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600&auto=format&fit=crop',
    'Dr. Ananya Nair, MBBS (AIIMS)',
    'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop',
    'Science', '4 min read',
    'How Blue Light Wrecks Your Sleep | Narva Health',
    'Scientific breakdown of blue light effect on sleep quality and how to prevent screen-induced insomnia.',
    'MedicalWebPage',
    timezone('utc'::text, now()),
    'published'
) ON CONFLICT (slug) DO NOTHING;

-- 6. Insert Sample Email Subscribers
INSERT INTO public.subscribers (email, name, source) VALUES
('arya@example.com', 'Arya Sharma', 'Homepage CTA'),
('priya.k@gmail.com', 'Priya K.', 'Footer'),
('health@vikramnair.com', 'Vikram N.', 'Blog Post'),
('meena.s@outlook.com', 'Meena S.', 'Homepage CTA'),
('kabir.docs@gmail.com', 'Dr. Kabir Sen', 'Science Page'),
('aditi.rao@yahoo.com', 'Aditi Rao', 'Blog Post')
ON CONFLICT (email) DO NOTHING;
