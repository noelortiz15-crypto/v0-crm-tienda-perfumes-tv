-- Seed 10,000 test records for CRM
-- This script generates:
-- - 500 suppliers
-- - 2,000 products
-- - 3,000 customers
-- - 1,500 employees
-- - 3,000 sales with line items

-- First, verify a user exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles LIMIT 1) THEN
    RAISE EXCEPTION 'No users found. Please create an admin user first.';
  END IF;
END $$;

-- Get the user ID for all inserts
WITH first_user AS (
  SELECT id FROM profiles LIMIT 1
)

-- SEED SUPPLIERS (500)
-- Fixed column name from user_id to created_by
, inserted_suppliers AS (
  INSERT INTO suppliers (created_by, company_name, contact_person, email, phone, address, description)
  SELECT
    (SELECT id FROM first_user),
    'Supplier ' || gs.i || ' - ' || 
      CASE (gs.i % 5)
        WHEN 0 THEN 'Premium Fragrances'
        WHEN 1 THEN 'Luxury Scents'
        WHEN 2 THEN 'Classic Perfumes'
        WHEN 3 THEN 'Modern Aromas'
        ELSE 'Artisan Fragrances'
      END,
    'Contact Person ' || gs.i,
    'supplier' || gs.i || '@perfumery.com',
    '+34 91 ' || LPAD((100000 + (gs.i * 137) % 9000000)::text, 7, '0'),
    'Calle ' || gs.i || ', ' || 
      CASE (gs.i % 6)
        WHEN 0 THEN 'Madrid'
        WHEN 1 THEN 'Barcelona'
        WHEN 2 THEN 'Valencia'
        WHEN 3 THEN 'Seville'
        WHEN 4 THEN 'Bilbao'
        ELSE 'Malaga'
      END,
    'High-quality fragrance supplier specializing in premium scents'
  FROM generate_series(1, 500) AS gs(i)
  RETURNING id
)

-- SEED PRODUCTS (2,000)
-- Fixed column names: user_id to created_by, quantity to stock_quantity
, inserted_products AS (
  INSERT INTO products (created_by, name, brand, description, price, tier, stock_quantity, expiry_date, supplier_id)
  SELECT
    (SELECT id FROM first_user),
    'Perfume ' || gs.i || ' - ' || 
      CASE (gs.i % 5)
        WHEN 0 THEN 'Eau de Parfum'
        WHEN 1 THEN 'Eau de Toilette'
        WHEN 2 THEN 'Cologne'
        WHEN 3 THEN 'Eau de Cologne'
        ELSE 'Fragrance Oil'
      END,
    CASE (gs.i % 10)
      WHEN 0 THEN 'Chanel'
      WHEN 1 THEN 'Hermès'
      WHEN 2 THEN 'Creed'
      WHEN 3 THEN 'Tom Ford'
      WHEN 4 THEN 'Dior'
      WHEN 5 THEN 'Guerlain'
      WHEN 6 THEN 'Givenchy'
      WHEN 7 THEN 'Yves Saint Laurent'
      WHEN 8 THEN 'Versace'
      ELSE 'Armani'
    END,
    CASE (gs.i % 5)
      WHEN 0 THEN 'Sophisticated floral fragrance with notes of jasmine and rose'
      WHEN 1 THEN 'Fresh citrus cologne with bergamot and lemon'
      WHEN 2 THEN 'Intense oud fragrance with woody undertones'
      WHEN 3 THEN 'Elegant vanilla blend with amber notes'
      ELSE 'Woody spice notes with cedar and sandalwood'
    END,
    CASE 
      WHEN (gs.i % 10) < 3 THEN 5000 + (gs.i * 73) % 15000
      WHEN (gs.i % 10) < 7 THEN 2000 + (gs.i * 53) % 3000
      ELSE 500 + (gs.i * 37) % 1500
    END,
    CASE 
      WHEN (gs.i % 10) < 3 THEN 'premium'
      WHEN (gs.i % 10) < 7 THEN 'medium'
      ELSE 'basic'
    END,
    10 + (gs.i * 17) % 140,
    CURRENT_DATE + ((365 + (gs.i * 23) % 365) || ' days')::INTERVAL,
    (SELECT id FROM inserted_suppliers OFFSET ((gs.i * 7) % 500) LIMIT 1)
  FROM generate_series(1, 2000) AS gs(i)
  RETURNING id, price
)

-- SEED CUSTOMERS (3,000)
-- Fixed column names: user_id to created_by, name to first_name and last_name
, inserted_customers AS (
  INSERT INTO customers (created_by, first_name, last_name, email, phone, address, birth_date, description)
  SELECT
    (SELECT id FROM first_user),
    'Customer ' || gs.i,
    CASE (gs.i % 5)
      WHEN 0 THEN 'Martinez'
      WHEN 1 THEN 'Lopez'
      WHEN 2 THEN 'Rodriguez'
      WHEN 3 THEN 'Garcia'
      ELSE 'Sanchez'
    END,
    'customer' || gs.i || '@example.com',
    '+34 91 ' || LPAD((200000 + (gs.i * 149) % 9000000)::text, 7, '0'),
    'Avenida ' || gs.i || ', ' || 
      CASE (gs.i % 5)
        WHEN 0 THEN 'Madrid'
        WHEN 1 THEN 'Barcelona'
        WHEN 2 THEN 'Valencia'
        WHEN 3 THEN 'Seville'
        ELSE 'Bilbao'
      END,
    CURRENT_DATE - ((6570 + (gs.i * 11) % 15000) || ' days')::INTERVAL,
    CASE (gs.i % 5)
      WHEN 0 THEN 'Premium customer with excellent purchase history'
      WHEN 1 THEN 'Regular customer'
      WHEN 2 THEN 'VIP member with special privileges'
      WHEN 3 THEN 'New customer'
      ELSE 'Occasional buyer'
    END
  FROM generate_series(1, 3000) AS gs(i)
  RETURNING id
)

-- SEED EMPLOYEES (1,500)
-- Fixed column names: user_id to created_by, name to first_name and last_name
, inserted_employees AS (
  INSERT INTO employees (created_by, first_name, last_name, email, phone, address, birth_date, description)
  SELECT
    (SELECT id FROM first_user),
    'Employee ' || gs.i,
    CASE (gs.i % 5)
      WHEN 0 THEN 'Garcia'
      WHEN 1 THEN 'Martinez'
      WHEN 2 THEN 'Lopez'
      WHEN 3 THEN 'Rodriguez'
      ELSE 'Fernandez'
    END,
    'employee' || gs.i || '@company.com',
    '+34 91 ' || LPAD((300000 + (gs.i * 167) % 9000000)::text, 7, '0'),
    'Work Address ' || gs.i || ', ' || 
      CASE (gs.i % 3)
        WHEN 0 THEN 'Madrid HQ'
        WHEN 1 THEN 'Barcelona Branch'
        ELSE 'Valencia Store'
      END,
    CURRENT_DATE - ((7300 + (gs.i * 13) % 15000) || ' days')::INTERVAL,
    'Sales Associate - ' || (1 + (gs.i % 15)) || ' years experience'
  FROM generate_series(1, 1500) AS gs(i)
  RETURNING id
)

-- SEED SALES (3,000)
-- Fixed column name from user_id to created_by
, inserted_sales AS (
  INSERT INTO sales (created_by, customer_id, employee_id, total_amount, status, created_at)
  SELECT
    (SELECT id FROM first_user),
    (SELECT id FROM inserted_customers OFFSET ((gs.i * 19) % 3000) LIMIT 1),
    (SELECT id FROM inserted_employees OFFSET ((gs.i * 29) % 1500) LIMIT 1),
    1000 + (gs.i * 317) % 49000,
    CASE ((gs.i * 7) % 10)
      WHEN 0 THEN 'pending'
      WHEN 1 THEN 'cancelled'
      ELSE 'completed'
    END,
    CURRENT_TIMESTAMP - ((gs.i * 3) % 365 || ' days')::INTERVAL
  FROM generate_series(1, 3000) AS gs(i)
  RETURNING id, total_amount
)

-- SEED SALES ITEMS (6,000+)
, inserted_sales_items AS (
  INSERT INTO sales_items (sale_id, product_id, quantity, unit_price, subtotal)
  SELECT
    s.id,
    (SELECT id FROM inserted_products OFFSET ((s.rn * 41) % 2000) LIMIT 1),
    1 + ((s.rn * 7) % 3),
    p.price,
    p.price * (1 + ((s.rn * 7) % 3))
  FROM (
    SELECT id, total_amount, ROW_NUMBER() OVER () as rn
    FROM inserted_sales
  ) s
  CROSS JOIN LATERAL (
    SELECT price FROM inserted_products OFFSET ((s.rn * 41) % 2000) LIMIT 1
  ) p
  LIMIT 6000
  RETURNING id
)

-- Final summary
SELECT 
  (SELECT COUNT(*) FROM inserted_suppliers) as suppliers_created,
  (SELECT COUNT(*) FROM inserted_products) as products_created,
  (SELECT COUNT(*) FROM inserted_customers) as customers_created,
  (SELECT COUNT(*) FROM inserted_employees) as employees_created,
  (SELECT COUNT(*) FROM inserted_sales) as sales_created,
  (SELECT COUNT(*) FROM inserted_sales_items) as sales_items_created;
