"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface SaleItem {
  product_id: string
  quantity: number
  unit_price: number
}

interface CreateSaleData {
  customer_id: string
  employee_id: string
  total_amount: number
  items: SaleItem[]
  created_by: string
}

export async function createSale(data: CreateSaleData) {
  const supabase = await createClient()

  // Create the sale
  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert([
      {
        customer_id: data.customer_id,
        employee_id: data.employee_id,
        total_amount: data.total_amount,
        status: "completed",
        created_by: data.created_by,
      },
    ])
    .select()
    .single()

  if (saleError) {
    throw new Error(`Failed to create sale: ${saleError.message}`)
  }

  // Create sale items and update product stock
  for (const item of data.items) {
    // Insert sale item
    const { error: itemError } = await supabase.from("sales_items").insert([
      {
        sale_id: sale.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price,
      },
    ])

    if (itemError) {
      throw new Error(`Failed to create sale item: ${itemError.message}`)
    }

    // Update product stock
    const { data: product } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.product_id)
      .single()

    if (product) {
      await supabase
        .from("products")
        .update({ stock_quantity: product.stock_quantity - item.quantity })
        .eq("id", item.product_id)
    }
  }

  revalidatePath("/dashboard/sales")
  revalidatePath("/dashboard/products")
  return sale
}
