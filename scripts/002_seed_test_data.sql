-- Seed test data for CRM development and testing
-- This script inserts sample data for suppliers, products, customers, employees, and sales

-- Insert sample suppliers
INSERT INTO suppliers (id, user_id, company_name, contact_person, email, phone, address, description, created_at)
VALUES 
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Fragrance Imports Ltd', 'Carlos Rodriguez', 'carlos@fragrance-imports.com', '+34-91-555-0101', 'Calle Serrano 45, Madrid, Spain', 'Premium fragrance supplier from France and Italy', NOW()),
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Luxury Scents Global', 'Marie Dubois', 'marie@luxuryscents.com', '+33-1-555-0202', 'Avenue des Champs, Paris, France', 'High-end designer fragrances', NOW()),
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Middle East Perfumes', 'Ahmed Al-Zahrani', 'ahmed@meperfumes.com', '+966-11-555-0303', 'King Fahd Road, Riyadh, Saudi Arabia', 'Oud and traditional Middle Eastern fragrances', NOW());

-- Fixed: Store supplier IDs in a temporary table to use them reliably
CREATE TEMP TABLE temp_suppliers AS
SELECT id FROM suppliers ORDER BY created_at DESC LIMIT 3;

-- Insert sample products with correct supplier references
INSERT INTO products (id, user_id, name, brand, description, price, tier, quantity, expiry_date, supplier_id, created_at)
VALUES 
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Eau de Parfum Elegance', 'Chanel', 'Sophisticated floral fragrance with notes of rose and jasmine', 15000, 'premium', 50, NOW() + INTERVAL '2 years', (SELECT id FROM temp_suppliers LIMIT 1), NOW()),
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Cologne Madrid', 'Hermès', 'Fresh citrus cologne with Mediterranean notes', 8500, 'medium', 75, NOW() + INTERVAL '2 years', (SELECT id FROM temp_suppliers LIMIT 1 OFFSET 1), NOW()),
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Oud Royal Collection', 'Creed', 'Intense oud with amber and sandalwood undertones', 18000, 'premium', 25, NOW() + INTERVAL '2 years', (SELECT id FROM temp_suppliers LIMIT 1 OFFSET 2), NOW());

-- Fixed: Store customer IDs in a temporary table for reliable references
CREATE TEMP TABLE temp_customers AS
INSERT INTO customers (id, user_id, name, email, phone, address, birth_date, description, created_at)
VALUES 
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Isabella Martinez', 'isabella@email.com', '+34-91-555-1001', 'Paseo de la Castellana 200, Madrid', '1990-05-15'::date, 'Premium customer, prefers luxury fragrances', NOW()),
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Juan Carlos López', 'juan@email.com', '+34-91-555-1002', 'Gran Vía 28, Madrid', '1985-08-22'::date, 'Regular customer, interested in new releases', NOW()),
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Sofia Rodriguez', 'sofia@email.com', '+34-91-555-1003', 'Calle Alcalá 150, Madrid', '1995-12-03'::date, 'Corporate accounts manager', NOW())
RETURNING id;

-- Fixed: Store employee IDs in a temporary table for reliable references
CREATE TEMP TABLE temp_employees AS
INSERT INTO employees (id, user_id, name, email, phone, address, birth_date, description, created_at)
VALUES 
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Ana García', 'ana.garcia@tienda.com', '+34-91-555-2001', 'Calle Mayor 10, Madrid', '1988-03-10'::date, 'Senior Sales Associate - 5 years experience', NOW()),
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Diego Fernández', 'diego.fernandez@tienda.com', '+34-91-555-2002', 'Avenida Diagonal 400, Barcelona', '1992-07-18'::date, 'Sales Representative - Product specialist', NOW()),
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Laura Sánchez', 'laura.sanchez@tienda.com', '+34-91-555-2003', 'Paseo Marítimo 50, Valencia', '1990-11-25'::date, 'Store Manager - 3 years experience', NOW())
RETURNING id;

-- Fixed: Use temporary tables for reliable cross-table references
INSERT INTO sales (id, user_id, customer_id, employee_id, total_amount, status, created_at)
VALUES 
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM temp_customers LIMIT 1), (SELECT id FROM temp_employees LIMIT 1), 15000, 'completed', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM temp_customers LIMIT 1 OFFSET 1), (SELECT id FROM temp_employees LIMIT 1 OFFSET 1), 8500, 'completed', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM temp_customers LIMIT 1 OFFSET 2), (SELECT id FROM temp_employees LIMIT 1 OFFSET 2), 18000, 'completed', NOW() - INTERVAL '1 day');
