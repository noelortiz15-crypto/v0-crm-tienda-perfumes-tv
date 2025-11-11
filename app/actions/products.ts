"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface ProductData {
  name: string
  description?: string
  brand: string
  price: number
  tier: string
  expiry_date?: string
  stock_quantity: number
  supplier_id: string
  created_by: string
}

interface ProductUpdateData {
  name?: string
  description?: string
  brand?: string
  price?: number
  tier?: string
  expiry_date?: string
  stock_quantity?: number
  supplier_id?: string
}

export async function createProduct(data: ProductData) {
  const supabase = await createClient()

  const { data: product, error } = await supabase.from("products").insert([data]).select().single()

  if (error) {
    throw new Error(`Failed to create product: ${error.message}`)
  }

  revalidatePath("/dashboard/products")
  return product
}

export async function updateProduct(id: string, data: ProductUpdateData) {
  const supabase = await createClient()

  const { data: product, error } = await supabase.from("products").update(data).eq("id", id).select().single()

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`)
  }

  revalidatePath("/dashboard/products")
  return product
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`)
  }

  revalidatePath("/dashboard/products")
}
