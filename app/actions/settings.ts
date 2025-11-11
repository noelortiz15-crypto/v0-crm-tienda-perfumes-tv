"use server"

import { cookies } from "next/headers"

interface MongoConfig {
  uri: string
  database: string
  username?: string
  password?: string
}

export async function getMongoConfig(): Promise<MongoConfig | null> {
  const cookieStore = await cookies()
  const configCookie = cookieStore.get("mongo_config")

  if (!configCookie) {
    return null
  }

  try {
    return JSON.parse(configCookie.value)
  } catch {
    return null
  }
}

export async function saveMongoConfig(config: MongoConfig) {
  const cookieStore = await cookies()
  cookieStore.set("mongo_config", JSON.stringify(config), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  return { success: true }
}

export async function testMongoConnection(config: MongoConfig) {
  try {
    // In a real implementation, you would use the mongodb driver
    // For now, we'll just validate the config
    if (!config.uri || !config.database) {
      return { success: false, error: "URI and database name are required" }
    }

    // Basic URI validation
    if (!config.uri.startsWith("mongodb://") && !config.uri.startsWith("mongodb+srv://")) {
      return { success: false, error: "Invalid MongoDB URI format" }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: "Connection test failed" }
  }
}

const sqlSchema = `-- Supabase SQL Schema Export
-- Generated on ${new Date().toISOString()}
-- Import this file using: psql -f supabase-schema.sql

-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
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
  tier TEXT NOT NULL,
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

-- Create sales table
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'completed',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sales_items table
CREATE TABLE IF NOT EXISTS public.sales_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_items ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_created_by ON public.suppliers(created_by);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON public.products(created_by);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_customers_created_by ON public.customers(created_by);
CREATE INDEX IF NOT EXISTS idx_employees_created_by ON public.employees(created_by);
CREATE INDEX IF NOT EXISTS idx_sales_created_by ON public.sales(created_by);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON public.sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_employee_id ON public.sales(employee_id);
CREATE INDEX IF NOT EXISTS idx_sales_items_sale_id ON public.sales_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sales_items_product_id ON public.sales_items(product_id);
`

export async function exportSupabaseSchema() {
  return { schema: sqlSchema }
}

const mongoSchema = `// MongoDB Schema Export from Supabase
// Generated on ${new Date().toISOString()}
// Import this file using: mongosh < mongodb-schema.js

use perfume_crm;

// Create collections with validation schemas

// Profiles Collection
db.createCollection("profiles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "role", "createdAt"],
      properties: {
        _id: { bsonType: "string", description: "User ID from authentication" },
        email: { bsonType: "string", description: "User email address" },
        role: { enum: ["admin", "user"], description: "User role" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Suppliers Collection
db.createCollection("suppliers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["companyName", "createdBy", "createdAt"],
      properties: {
        companyName: { bsonType: "string" },
        description: { bsonType: "string" },
        address: { bsonType: "string" },
        contactPerson: { bsonType: "string" },
        email: { bsonType: "string" },
        phone: { bsonType: "string" },
        createdBy: { bsonType: "string", description: "User ID who created this" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Products Collection
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "brand", "price", "tier", "supplierId", "createdBy"],
      properties: {
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        brand: { bsonType: "string" },
        price: { bsonType: "decimal" },
        tier: { enum: ["premium", "medium", "basic"] },
        expiryDate: { bsonType: "date" },
        stockQuantity: { bsonType: "int" },
        supplierId: { bsonType: "string" },
        createdBy: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Customers Collection
db.createCollection("customers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["firstName", "lastName", "createdBy"],
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        description: { bsonType: "string" },
        email: { bsonType: "string" },
        phone: { bsonType: "string" },
        address: { bsonType: "string" },
        birthDate: { bsonType: "date" },
        createdBy: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Employees Collection
db.createCollection("employees", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["firstName", "lastName", "createdBy"],
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        description: { bsonType: "string" },
        email: { bsonType: "string" },
        phone: { bsonType: "string" },
        address: { bsonType: "string" },
        birthDate: { bsonType: "date" },
        createdBy: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Sales Collection (embedded sales_items)
db.createCollection("sales", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customerId", "employeeId", "totalAmount", "status", "createdBy"],
      properties: {
        customerId: { bsonType: "string" },
        employeeId: { bsonType: "string" },
        totalAmount: { bsonType: "decimal" },
        status: { enum: ["pending", "completed", "cancelled"] },
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["productId", "quantity", "unitPrice", "subtotal"],
            properties: {
              productId: { bsonType: "string" },
              quantity: { bsonType: "int" },
              unitPrice: { bsonType: "decimal" },
              subtotal: { bsonType: "decimal" }
            }
          }
        },
        createdBy: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Create indexes for performance
db.suppliers.createIndex({ "createdBy": 1 });
db.suppliers.createIndex({ "companyName": 1 });

db.products.createIndex({ "createdBy": 1 });
db.products.createIndex({ "supplierId": 1 });
db.products.createIndex({ "tier": 1 });
db.products.createIndex({ "brand": 1 });

db.customers.createIndex({ "createdBy": 1 });
db.customers.createIndex({ "email": 1 }, { unique: true, sparse: true });

db.employees.createIndex({ "createdBy": 1 });
db.employees.createIndex({ "email": 1 }, { unique: true, sparse: true });

db.sales.createIndex({ "createdBy": 1 });
db.sales.createIndex({ "customerId": 1 });
db.sales.createIndex({ "employeeId": 1 });
db.sales.createIndex({ "status": 1 });
db.sales.createIndex({ "createdAt": -1 });

print("MongoDB schema created successfully!");
print("Collections: profiles, suppliers, products, customers, employees, sales");
print("Indexes created for optimized queries");
`

export async function exportSchemaToMongo() {
  return { schema: mongoSchema }
}
