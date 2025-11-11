import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// Test data generators
const firstNames = [
  "Isabella",
  "Juan",
  "Sofia",
  "Carlos",
  "Maria",
  "Diego",
  "Ana",
  "Roberto",
  "Lucia",
  "Miguel",
  "Angela",
  "Francisco",
  "Teresa",
  "Luis",
  "Patricia",
  "Manuel",
  "Rosa",
  "Jose",
  "Elena",
  "Antonio",
  "Marta",
  "David",
  "Carmen",
  "Fernando",
  "Pilar",
  "Ricardo",
  "Laura",
  "Javier",
  "Beatriz",
  "Ramon",
]

const lastNames = [
  "Martinez",
  "Lopez",
  "Rodriguez",
  "Garcia",
  "Sanchez",
  "Fernandez",
  "Torres",
  "Perez",
  "Ramirez",
  "Moreno",
  "Cruz",
  "Castro",
  "Diaz",
  "Morales",
  "Reyes",
  "Mendez",
  "Delgado",
  "Vega",
  "Ramos",
  "Navarro",
]

const brands = [
  "Chanel",
  "Hermès",
  "Creed",
  "Tom Ford",
  "Dior",
  "Guerlain",
  "Givenchy",
  "Lancôme",
  "Yves Saint Laurent",
  "Versace",
  "Armani",
  "Calvin Klein",
  "Prada",
  "Dolce & Gabbana",
  "Burberry",
  "Coach",
  "Estée Lauder",
  "Clinique",
]

const productDescriptions = [
  "Sophisticated floral fragrance with notes of rose and jasmine",
  "Fresh citrus cologne with Mediterranean notes",
  "Intense oud with amber and sandalwood undertones",
  "Elegant vanilla and musk combination",
  "Woody fragrance with spice undertones",
  "Light fruity scent for everyday wear",
  "Deep musky fragrance for evening wear",
  "Refreshing aquatic notes",
  "Warm oriental fragrance",
  "Crisp bergamot and lavender blend",
]

const tiers = ["premium", "medium", "basic"]

const cities = [
  "Madrid",
  "Barcelona",
  "Valencia",
  "Seville",
  "Bilbao",
  "Malaga",
  "Murcia",
  "Palma",
  "Las Palmas",
  "Alicante",
  "Cordoba",
  "Valladolid",
  "Vigo",
  "Zaragoza",
]

const streets = [
  "Calle Mayor",
  "Paseo de la Castellana",
  "Gran Vía",
  "Avenida Diagonal",
  "Calle Alcalá",
  "Paseo Marítimo",
  "Avenida de América",
  "Calle Serrano",
  "Ramblas",
  "Calle Larios",
  "Avenida Principal",
  "Plaza Mayor",
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomDate(daysAgo = 365): Date {
  const date = new Date()
  date.setDate(date.getDate() - getRandomInt(0, daysAgo))
  return date
}

function generateEmail(name: string): string {
  return `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`
}

function generatePhone(): string {
  return `+34-${getRandomInt(900, 999)}-${String(getRandomInt(100000, 999999)).padStart(6, "0")}`
}

function generateAddress(): string {
  return `${getRandomElement(streets)} ${getRandomInt(1, 200)}, ${getRandomElement(cities)}`
}

async function seedData() {
  console.log("Starting large dataset seeding (10,000 records)...")

  try {
    // Get the first user (admin)
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()
    if (userError || !userData.users.length) {
      console.error("No users found. Please create an admin user first.")
      return
    }

    const userId = userData.users[0].id
    console.log(`Using user ID: ${userId}`)

    // Seed suppliers (500)
    console.log("Seeding 500 suppliers...")
    const suppliers: any[] = []
    for (let i = 0; i < 500; i++) {
      const firstName = getRandomElement(firstNames)
      const lastName = getRandomElement(lastNames)
      suppliers.push({
        user_id: userId,
        company_name: `${firstName} & ${lastName} Perfumes Inc`,
        contact_person: `${firstName} ${lastName}`,
        email: generateEmail(`supplier-${i}`),
        phone: generatePhone(),
        address: generateAddress(),
        description: `Premium fragrance supplier - Category ${getRandomInt(1, 5)}`,
      })
    }

    const { data: supplierData, error: suppliersError } = await supabase.from("suppliers").insert(suppliers).select()

    if (suppliersError) {
      console.error("Error inserting suppliers:", suppliersError)
      return
    }
    console.log(`✓ Created ${supplierData.length} suppliers`)

    // Seed products (2000)
    console.log("Seeding 2,000 products...")
    const products: any[] = []
    for (let i = 0; i < 2000; i++) {
      const supplierId = supplierData[getRandomInt(0, supplierData.length - 1)].id
      products.push({
        user_id: userId,
        name: `${getRandomElement(brands)} Fragrance ${i + 1}`,
        brand: getRandomElement(brands),
        description: getRandomElement(productDescriptions),
        price: getRandomInt(500, 20000),
        tier: getRandomElement(tiers),
        quantity: getRandomInt(5, 200),
        expiry_date: new Date(Date.now() + getRandomInt(365, 1095) * 24 * 60 * 60 * 1000).toISOString(),
        supplier_id: supplierId,
      })
    }

    // Insert products in batches
    const batchSize = 100
    const productData: any[] = []
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      const { data: batchData, error: batchError } = await supabase.from("products").insert(batch).select()
      if (batchError) {
        console.error("Error inserting products batch:", batchError)
        return
      }
      productData.push(...batchData)
    }
    console.log(`✓ Created ${productData.length} products`)

    // Seed customers (3000)
    console.log("Seeding 3,000 customers...")
    const customers: any[] = []
    for (let i = 0; i < 3000; i++) {
      const firstName = getRandomElement(firstNames)
      const lastName = getRandomElement(lastNames)
      customers.push({
        user_id: userId,
        name: `${firstName} ${lastName}`,
        email: generateEmail(`customer-${i}`),
        phone: generatePhone(),
        address: generateAddress(),
        birth_date: getRandomDate(15000).toISOString().split("T")[0],
        description: `Customer segment ${getRandomInt(1, 5)} - ${["Premium", "Regular", "New", "VIP", "Occasional"][getRandomInt(0, 4)]}`,
      })
    }

    // Insert customers in batches
    const customerData: any[] = []
    for (let i = 0; i < customers.length; i += batchSize) {
      const batch = customers.slice(i, i + batchSize)
      const { data: batchData, error: batchError } = await supabase.from("customers").insert(batch).select()
      if (batchError) {
        console.error("Error inserting customers batch:", batchError)
        return
      }
      customerData.push(...batchData)
    }
    console.log(`✓ Created ${customerData.length} customers`)

    // Seed employees (1500)
    console.log("Seeding 1,500 employees...")
    const employees: any[] = []
    for (let i = 0; i < 1500; i++) {
      const firstName = getRandomElement(firstNames)
      const lastName = getRandomElement(lastNames)
      employees.push({
        user_id: userId,
        name: `${firstName} ${lastName}`,
        email: generateEmail(`employee-${i}`),
        phone: generatePhone(),
        address: generateAddress(),
        birth_date: getRandomDate(15000).toISOString().split("T")[0],
        description: `Sales Associate - Experience Level ${getRandomInt(1, 10)} years`,
      })
    }

    // Insert employees in batches
    const employeeData: any[] = []
    for (let i = 0; i < employees.length; i += batchSize) {
      const batch = employees.slice(i, i + batchSize)
      const { data: batchData, error: batchError } = await supabase.from("employees").insert(batch).select()
      if (batchError) {
        console.error("Error inserting employees batch:", batchError)
        return
      }
      employeeData.push(...batchData)
    }
    console.log(`✓ Created ${employeeData.length} employees`)

    // Seed sales (3000) with sales items
    console.log("Seeding 3,000 sales transactions...")
    let totalSalesItems = 0
    const salesBatch: any[] = []

    for (let i = 0; i < 3000; i++) {
      const customerId = customerData[getRandomInt(0, customerData.length - 1)].id
      const employeeId = employeeData[getRandomInt(0, employeeData.length - 1)].id
      const itemCount = getRandomInt(1, 5)
      let totalAmount = 0

      // Calculate total for this sale
      for (let j = 0; j < itemCount; j++) {
        const product = productData[getRandomInt(0, productData.length - 1)]
        const quantity = getRandomInt(1, 3)
        totalAmount += product.price * quantity
      }

      salesBatch.push({
        user_id: userId,
        customer_id: customerId,
        employee_id: employeeId,
        total_amount: totalAmount,
        status: getRandomElement(["completed", "pending", "cancelled"]),
        created_at: getRandomDate(365).toISOString(),
      })
    }

    // Insert sales in batches
    const saleData: any[] = []
    for (let i = 0; i < salesBatch.length; i += batchSize) {
      const batch = salesBatch.slice(i, i + batchSize)
      const { data: batchData, error: batchError } = await supabase.from("sales").insert(batch).select()
      if (batchError) {
        console.error("Error inserting sales batch:", batchError)
        return
      }
      saleData.push(...batchData)
    }
    console.log(`✓ Created ${saleData.length} sales transactions`)

    // Seed sales items (randomly distributed)
    console.log("Seeding sales line items...")
    const saleItems: any[] = []
    for (const sale of saleData) {
      const itemCount = getRandomInt(1, 5)
      for (let i = 0; i < itemCount; i++) {
        const product = productData[getRandomInt(0, productData.length - 1)]
        const quantity = getRandomInt(1, 3)
        saleItems.push({
          sale_id: sale.id,
          product_id: product.id,
          quantity: quantity,
          unit_price: product.price,
          subtotal: product.price * quantity,
        })
      }
    }

    // Insert sales items in batches
    for (let i = 0; i < saleItems.length; i += batchSize) {
      const batch = saleItems.slice(i, i + batchSize)
      const { error: batchError } = await supabase.from("sales_items").insert(batch)
      if (batchError) {
        console.error("Error inserting sales items batch:", batchError)
        return
      }
    }
    totalSalesItems = saleItems.length
    console.log(`✓ Created ${totalSalesItems} sales line items`)

    const totalRecords =
      supplierData.length +
      productData.length +
      customerData.length +
      employeeData.length +
      saleData.length +
      totalSalesItems

    console.log("\n" + "=".repeat(50))
    console.log(`✓ SEEDING COMPLETE!`)
    console.log("=".repeat(50))
    console.log(`Total records created: ${totalRecords}`)
    console.log(`  - Suppliers: ${supplierData.length}`)
    console.log(`  - Products: ${productData.length}`)
    console.log(`  - Customers: ${customerData.length}`)
    console.log(`  - Employees: ${employeeData.length}`)
    console.log(`  - Sales: ${saleData.length}`)
    console.log(`  - Sales Items: ${totalSalesItems}`)
    console.log("=".repeat(50))
  } catch (error) {
    console.error("Error during seeding:", error)
  }
}

seedData()
