-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user', -- 'admin', 'user'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  tier TEXT NOT NULL, -- 'premium', 'medium', 'basic'
  expiry_date DATE,
  stock_quantity INTEGER DEFAULT 0,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  description TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  birth_date DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create employees table
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  description TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  birth_date DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sales table (transactions)
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'cancelled'
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sales_items table (products in each sale)
CREATE TABLE IF NOT EXISTS public.sales_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Allow users to view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for suppliers (any authenticated user can view, only creator can edit)
CREATE POLICY "Allow authenticated users to view suppliers"
  ON public.suppliers FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to insert suppliers"
  ON public.suppliers FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Allow users to update their own suppliers"
  ON public.suppliers FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Allow users to delete their own suppliers"
  ON public.suppliers FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for products
CREATE POLICY "Allow authenticated users to view products"
  ON public.products FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to insert products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Allow users to update their own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Allow users to delete their own products"
  ON public.products FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for customers
CREATE POLICY "Allow authenticated users to view customers"
  ON public.customers FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Allow users to update their own customers"
  ON public.customers FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Allow users to delete their own customers"
  ON public.customers FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for employees
CREATE POLICY "Allow authenticated users to view employees"
  ON public.employees FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to insert employees"
  ON public.employees FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Allow users to update their own employees"
  ON public.employees FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Allow users to delete their own employees"
  ON public.employees FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for sales
CREATE POLICY "Allow authenticated users to view sales"
  ON public.sales FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to insert sales"
  ON public.sales FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Allow users to update their own sales"
  ON public.sales FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Allow users to delete their own sales"
  ON public.sales FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for sales_items
CREATE POLICY "Allow authenticated users to view sales_items"
  ON public.sales_items FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to insert sales_items"
  ON public.sales_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.sales WHERE id = sale_id AND created_by = auth.uid()));

CREATE POLICY "Allow users to update sales_items"
  ON public.sales_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.sales WHERE id = sale_id AND created_by = auth.uid()));

CREATE POLICY "Allow users to delete sales_items"
  ON public.sales_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.sales WHERE id = sale_id AND created_by = auth.uid()));
