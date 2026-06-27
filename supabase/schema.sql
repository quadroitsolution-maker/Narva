-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Enums/Types if necessary or use TEXT constraints
-- products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    compare_price NUMERIC(10, 2) CHECK (compare_price >= 0),
    stock_qty INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    low_stock_threshold INTEGER DEFAULT 5 CHECK (low_stock_threshold >= 0),
    is_subscription_eligible BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    images TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- customers table (linked to auth.users if available, but fully queryable)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY, -- references auth.users(id)
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    default_address_id UUID,
    razorpay_customer_id TEXT,
    total_orders INTEGER DEFAULT 0 CHECK (total_orders >= 0),
    ltv NUMERIC(10, 2) DEFAULT 0.00 CHECK (ltv >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- addresses table
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    line1 TEXT NOT NULL,
    line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id),
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'refunded', 'cancelled')),
    payment_id TEXT,
    payment_method TEXT,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10, 2) DEFAULT 0.00 CHECK (discount >= 0),
    shipping NUMERIC(10, 2) DEFAULT 0.00 CHECK (shipping >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    shipping_address_id UUID REFERENCES public.addresses(id),
    tracking_number TEXT,
    courier TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) NOT NULL,
    product_id UUID REFERENCES public.products(id) NOT NULL,
    razorpay_subscription_id TEXT UNIQUE,
    plan_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('created', 'authenticated', 'active', 'pending', 'halted', 'cancelled')),
    current_cycle INTEGER DEFAULT 1 CHECK (current_cycle >= 1),
    next_charge_at TIMESTAMP WITH TIME ZONE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    discount_pct NUMERIC(5, 2) DEFAULT 0.00 CHECK (discount_pct >= 0 AND discount_pct <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.customers(id),
    order_id UUID REFERENCES public.orders(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    body TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_reply TEXT,
    reply_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('pct', 'flat', 'free_shipping')),
    value NUMERIC(10, 2) NOT NULL CHECK (value >= 0),
    min_order_value NUMERIC(10, 2) DEFAULT 0.00 CHECK (min_order_value >= 0),
    max_discount NUMERIC(10, 2) CHECK (max_discount >= 0),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0 CHECK (used_count >= 0),
    is_first_order_only BOOLEAN DEFAULT FALSE,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    body JSONB NOT NULL, -- tip tap JSON
    cover_image_url TEXT,
    author_name TEXT NOT NULL,
    author_image_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    schema_type TEXT DEFAULT 'Article',
    published_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- consultation_slots table
CREATE TABLE IF NOT EXISTS public.consultation_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE NOT NULL,
    booking_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- consultation_bookings table
CREATE TABLE IF NOT EXISTS public.consultation_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slot_id UUID REFERENCES public.consultation_slots(id) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no_show')),
    meeting_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- inventory_log table
CREATE TABLE IF NOT EXISTS public.inventory_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    change_qty INTEGER NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('sale', 'restock', 'manual_adjustment')),
    reference_id UUID,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) configurations
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_log ENABLE ROW LEVEL SECURITY;

-- Define RLS Policies
-- Products: read is public, edit is admin
CREATE POLICY "Allow public read-only access to products" ON public.products
    FOR SELECT USING (is_active = TRUE AND deleted_at IS NULL);

-- Customers: read/write for self, admin sees all
CREATE POLICY "Allow users to access their own customer profile" ON public.customers
    FOR ALL USING (auth.uid() = id);

-- Addresses: read/write for self
CREATE POLICY "Allow users to access their own addresses" ON public.addresses
    FOR ALL USING (customer_id = auth.uid());

-- Orders: read for self, write for checkout
CREATE POLICY "Allow users to view their own orders" ON public.orders
    FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Allow users to create their own orders" ON public.orders
    FOR INSERT WITH CHECK (customer_id = auth.uid());

-- Order Items: read for self
CREATE POLICY "Allow users to view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE public.orders.id = public.order_items.order_id 
            AND public.orders.customer_id = auth.uid()
        )
    );

-- Subscriptions: read for self
CREATE POLICY "Allow users to view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (customer_id = auth.uid());

-- Reviews: read is public, create is authenticated
CREATE POLICY "Allow public to read approved reviews" ON public.reviews
    FOR SELECT USING (status = 'approved');
CREATE POLICY "Allow authenticated users to create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Coupons: read is authenticated (validation check)
CREATE POLICY "Allow users to view active coupons" ON public.coupons
    FOR SELECT USING (is_active = TRUE AND valid_until > now());

-- Blog Posts: read is public for published
CREATE POLICY "Allow public to read published blog posts" ON public.blog_posts
    FOR SELECT USING (status = 'published' AND published_at <= now());

-- Consultation Slots: read is public for active slots
CREATE POLICY "Allow public to read consultation slots" ON public.consultation_slots
    FOR SELECT USING (TRUE);

-- Consultation Bookings: read for self
CREATE POLICY "Allow users to view their bookings" ON public.consultation_bookings
    FOR SELECT USING (customer_email = (SELECT email FROM public.customers WHERE id = auth.uid()));
CREATE POLICY "Allow public to create consultation bookings" ON public.consultation_bookings
    FOR INSERT WITH CHECK (TRUE);
