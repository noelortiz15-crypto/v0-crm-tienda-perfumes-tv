-- SIMPLE ADMIN USER SETUP
-- 
-- STEP 1: Go to Supabase Dashboard > Authentication > Users
-- STEP 2: Click "Add User" and create:
--         Email: admin@tiendaperfumes.com
--         Password: Admin@123456
--         Auto Confirm User: YES
-- 
-- STEP 3: After creating the user, copy the User ID (UUID)
-- STEP 4: Replace 'PASTE_USER_ID_HERE' below with the actual UUID
-- STEP 5: Run this script in SQL Editor

-- Create profile for admin user
-- REPLACE 'PASTE_USER_ID_HERE' with the actual user ID from Step 3
INSERT INTO public.profiles (id, email, role)
VALUES (
  '581cda4f-9a38-49e8-a8da-384bcc205a2b'::UUID,  -- Replace this with actual user ID
  'admin@tiendaperfumes.com',
  'admin'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin',
    email = 'admin@tiendaperfumes.com';

-- Verify the profile was created
SELECT * FROM public.profiles WHERE email = 'admin@tiendaperfumes.com';
