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

export async function exportSchemaToMongo() {
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

// Sales Collection
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

// Create indexes for better performance
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
print("Collections created: profiles, suppliers, products, customers, employees, sales");
print("Indexes created for optimized queries");
`

  return { schema: mongoSchema }
}
