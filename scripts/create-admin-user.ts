/**
 * Script to create an admin test user
 * Run after database tables are created
 *
 * Usage: npx ts-node scripts/create-admin-user.ts
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: "admin@tiendaperfumes.com",
      password: "Admin@123456",
      email_confirm: true,
      user_metadata: {
        full_name: "Admin Tienda Perfumes",
      },
    })

    if (error) {
      console.error("Error creating user:", error)
      return
    }

    console.log("Admin user created successfully:")
    console.log("Email: admin@tiendaperfumes.com")
    console.log("Password: Admin@123456")
    console.log("User ID:", data.user.id)

    // Create profile for the admin user
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: "Admin Tienda Perfumes",
      avatar_url: null,
    })

    if (profileError) {
      console.error("Error creating profile:", profileError)
      return
    }

    console.log("Admin profile created successfully")
  } catch (error) {
    console.error("Unexpected error:", error)
  }
}

createAdminUser()
