"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface SupplierData {
  company_name: string
  description?: string
  address?: string
  contact_person?: string
  email?: string
  phone?: string
  created_by: string
}

interface SupplierUpdateData {
  company_name?: string
  description?: string
  address?: string
  contact_person?: string
  email?: string
  phone?: string
}

export async function createSupplier(data: SupplierData) {
  const supabase = await createClient()

  const { data: supplier, error } = await supabase.from("suppliers").insert([data]).select().single()

  if (error) {
    throw new Error(`Failed to create supplier: ${error.message}`)
  }

  revalidatePath("/dashboard/suppliers")
  return supplier
}

export async function updateSupplier(id: string, data: SupplierUpdateData) {
  const supabase = await createClient()

  const { data: supplier, error } = await supabase.from("suppliers").update(data).eq("id", id).select().single()

  if (error) {
    throw new Error(`Failed to update supplier: ${error.message}`)
  }

  revalidatePath("/dashboard/suppliers")
  return supplier
}

export async function deleteSupplier(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("suppliers").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete supplier: ${error.message}`)
  }

  revalidatePath("/dashboard/suppliers")
}
