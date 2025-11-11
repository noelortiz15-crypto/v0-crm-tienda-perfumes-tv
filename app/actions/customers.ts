"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface CustomerData {
  first_name: string
  last_name: string
  description?: string
  address?: string
  email?: string
  phone?: string
  birth_date?: string
  created_by: string
}

interface CustomerUpdateData {
  first_name?: string
  last_name?: string
  description?: string
  address?: string
  email?: string
  phone?: string
  birth_date?: string
}

export async function createCustomer(data: CustomerData) {
  const supabase = await createClient()

  const { data: customer, error } = await supabase.from("customers").insert([data]).select().single()

  if (error) {
    throw new Error(`Failed to create customer: ${error.message}`)
  }

  revalidatePath("/dashboard/customers")
  return customer
}

export async function updateCustomer(id: string, data: CustomerUpdateData) {
  const supabase = await createClient()

  const { data: customer, error } = await supabase.from("customers").update(data).eq("id", id).select().single()

  if (error) {
    throw new Error(`Failed to update customer: ${error.message}`)
  }

  revalidatePath("/dashboard/customers")
  return customer
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("customers").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete customer: ${error.message}`)
  }

  revalidatePath("/dashboard/customers")
}
