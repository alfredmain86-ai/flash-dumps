-- ============================================
-- Initial Database Schema
-- Construction Debris Hauling Platform
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================
-- ENUMS
-- ==================

CREATE TYPE user_role AS ENUM ('admin', 'driver', 'customer');
CREATE TYPE waste_type AS ENUM (
  'concrete_brick', 'drywall_plaster', 'wood_lumber', 'metal_rebar',
  'roofing_shingles', 'mixed_debris', 'tile_ceramic', 'appliances_fixtures'
);
CREATE TYPE load_size AS ENUM ('light', 'medium', 'heavy', 'full_truck');
CREATE TYPE pickup_frequency AS ENUM ('one_time', 'weekly', 'biweekly', 'retainer');
CREATE TYPE time_slot AS ENUM ('morning', 'afternoon', 'emergency');
CREATE TYPE quote_status AS ENUM ('new', 'reviewed', 'priced', 'sent', 'accepted', 'booked', 'expired');
CREATE TYPE booking_status AS ENUM ('scheduled', 'confirmed', 'en_route', 'arrived', 'loading', 'completed', 'cancelled');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE truck_status AS ENUM ('available', 'in_use', 'maintenance');
CREATE TYPE customer_tag AS ENUM ('one_time', 'recurring', 'contractor', 'homeowner', 'vip');
CREATE TYPE customer_type AS ENUM ('residential', 'commercial');
CREATE TYPE expense_category AS ENUM ('fuel', 'tipping_fees', 'maintenance', 'labor', 'insurance', 'other');

-- ==================
-- PROFILES (extends Supabase Auth)
-- ==================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================
-- CUSTOMERS
-- ==================

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  company_name TEXT,
  customer_type customer_type NOT NULL DEFAULT 'residential',
  tags customer_tag[] DEFAULT '{}',
  notes TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
  total_jobs INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_user_id ON customers(user_id);

-- ==================
-- TRUCKS
-- ==================

CREATE TABLE trucks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  plate_number TEXT NOT NULL UNIQUE,
  capacity_tons NUMERIC(5,2) NOT NULL DEFAULT 10,
  status truck_status NOT NULL DEFAULT 'available',
  current_driver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  maintenance_due DATE,
  mileage INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================
-- QUOTES
-- ==================

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  waste_types waste_type[] NOT NULL,
  load_size load_size NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  frequency pickup_frequency NOT NULL DEFAULT 'one_time',
  preferred_date DATE,
  time_slot time_slot,
  is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
  photo_urls TEXT[] DEFAULT '{}',
  estimated_price_min NUMERIC(10,2) NOT NULL,
  estimated_price_max NUMERIC(10,2) NOT NULL,
  admin_adjusted_price NUMERIC(10,2),
  distance_miles NUMERIC(6,2),
  status quote_status NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);

-- ==================
-- BOOKINGS
-- ==================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  truck_id UUID REFERENCES trucks(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  time_slot time_slot NOT NULL,
  status booking_status NOT NULL DEFAULT 'scheduled',
  address TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  waste_types waste_type[] NOT NULL,
  load_size load_size NOT NULL,
  estimated_price NUMERIC(10,2) NOT NULL,
  final_price NUMERIC(10,2),
  actual_weight NUMERIC(6,2),
  driver_notes TEXT,
  completion_photos TEXT[] DEFAULT '{}',
  special_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_truck_id ON bookings(truck_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_driver_id ON bookings(driver_id);

-- ==================
-- INVOICES
-- ==================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  status invoice_status NOT NULL DEFAULT 'draft',
  stripe_payment_id TEXT,
  stripe_invoice_id TEXT,
  due_date DATE NOT NULL,
  paid_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- ==================
-- PRICING CONFIG
-- ==================

CREATE TABLE pricing_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  base_rates JSONB NOT NULL,
  waste_multipliers JSONB NOT NULL,
  distance_factors JSONB NOT NULL,
  frequency_discounts JSONB NOT NULL,
  emergency_surcharge NUMERIC(4,2) NOT NULL DEFAULT 0.30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one active pricing config at a time
CREATE UNIQUE INDEX idx_pricing_config_active ON pricing_config(is_active) WHERE is_active = TRUE;

-- ==================
-- REVIEWS
-- ==================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);

-- ==================
-- EXPENSES
-- ==================

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  category expense_category NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  truck_id UUID REFERENCES trucks(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_truck_id ON expenses(truck_id);

-- ==================
-- ROUTE HISTORY
-- ==================

CREATE TABLE route_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  truck_id UUID NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  stops JSONB NOT NULL DEFAULT '[]',
  total_miles NUMERIC(7,2),
  total_time_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_route_history_truck_date ON route_history(truck_id, date);

-- ==================
-- BLOG POSTS (for SEO)
-- ==================

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at DESC);

-- ==================
-- UPDATED_AT TRIGGER
-- ==================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trucks_updated_at BEFORE UPDATE ON trucks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================
-- ROW LEVEL SECURITY
-- ==================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY admin_all_profiles ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY admin_all_customers ON customers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY admin_all_quotes ON quotes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY admin_all_bookings ON bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY admin_all_trucks ON trucks FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY admin_all_invoices ON invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY admin_all_pricing ON pricing_config FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY admin_all_expenses ON expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY admin_all_route_history ON route_history FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Drivers can see their own bookings
CREATE POLICY driver_own_bookings ON bookings FOR SELECT USING (
  driver_id = auth.uid()
);

CREATE POLICY driver_update_bookings ON bookings FOR UPDATE USING (
  driver_id = auth.uid()
);

-- Customers can see their own data
CREATE POLICY customer_own_profile ON profiles FOR SELECT USING (
  id = auth.uid()
);

CREATE POLICY customer_own_quotes ON quotes FOR SELECT USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

CREATE POLICY customer_own_bookings ON bookings FOR SELECT USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

CREATE POLICY customer_own_invoices ON invoices FOR SELECT USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

CREATE POLICY customer_own_reviews ON reviews FOR ALL USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

-- Public can insert quotes (for the quote calculator)
CREATE POLICY public_insert_quotes ON quotes FOR INSERT WITH CHECK (TRUE);

-- Public can read published blog posts
CREATE POLICY public_read_blog ON blog_posts FOR SELECT USING (published = TRUE);

-- Admins can manage blog posts
CREATE POLICY admin_all_blog ON blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Public can read pricing config
CREATE POLICY public_read_pricing ON pricing_config FOR SELECT USING (is_active = TRUE);

-- Public can read trucks (for availability)
CREATE POLICY public_read_trucks ON trucks FOR SELECT USING (TRUE);

-- Public can read reviews
CREATE POLICY public_read_reviews ON reviews FOR SELECT USING (TRUE);
