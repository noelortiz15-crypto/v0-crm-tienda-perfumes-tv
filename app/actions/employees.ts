"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface EmployeeData {
  first_name: string
  last_name: string
  description?: string
  address?: string
  email?: string
  phone?: string
  birth_date?: string
  created_by: string
}

interface EmployeeUpdateData {
  first_name?: string
  last_name?: string
  description?: string
  address?: string
  email?: string
  phone?: string
  birth_date?: string
}

export async function createEmployee(data: EmployeeData) {
  const supabase = await createClient()

  const { data: employee, error } = await supabase.from("employees").insert([data]).select().single()

  if (error) {
    throw new Error(`Failed to create employee: ${error.message}`)
  }

  revalidatePath("/dashboard/employees")
  return employee
}

export async function updateEmployee(id: string, data: EmployeeUpdateData) {
  const supabase = await createClient()

  const { data: employee, error } = await supabase.from("employees").update(data).eq("id", id).select().single()

  if (error) {
    throw new Error(`Failed to update employee: ${error.message}`)
  }

  revalidatePath("/dashboard/employees")
  return employee
}

export async function deleteEmployee(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("employees").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete employee: ${error.message}`)
  }

  revalidatePath("/dashboard/employees")
}
