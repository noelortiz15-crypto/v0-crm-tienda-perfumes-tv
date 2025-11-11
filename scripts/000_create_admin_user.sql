-- Create admin user directly in Supabase
-- This script creates a test admin user for the CRM system
-- 
-- IMPORTANT: Run this in Supabase SQL Editor AFTER running 001_create_tables.sql
-- 
-- Credentials:
-- Email: admin@tiendaperfumes.com
-- Password: Admin@123456

-- First, we need to create the user in auth.users
-- Note: In Supabase, you typically create users through the Auth API or Dashboard
-- This is a workaround for testing purposes

-- Insert a user into auth.users (this requires admin privileges)
-- You should do this through Supabase Dashboard > Authentication > Users > Add User
-- OR use the Supabase Auth API

-- After creating the user through Supabase Dashboard, get the user ID and run:
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from the created user

-- Example: If your user ID is '12345678-1234-1234-1234-123456789012'
-- INSERT INTO public.profiles (id, email, role)
-- VALUES ('12345678-1234-1234-1234-123456789012', 'admin@tiendaperfumes.com', 'admin');

-- ALTERNATIVE: Use this function to create user with profile
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Note: This function requires you to have already created the user in Supabase Auth
  -- Get the user ID from auth.users where email matches
  SELECT id INTO new_user_id
  FROM auth.users
  WHERE email = 'admin@tiendaperfumes.com'
  LIMIT 1;

  -- If user exists, create profile
  IF new_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, role)
    VALUES (new_user_id, 'admin@tiendaperfumes.com', 'admin')
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin';
    
    RAISE NOTICE 'Profile created for user: %', new_user_id;
  ELSE
    RAISE NOTICE 'User not found. Please create user in Supabase Dashboard first.';
  END IF;
END;
$$;

-- After creating the user in Supabase Dashboard, run:
-- SELECT create_admin_user();
