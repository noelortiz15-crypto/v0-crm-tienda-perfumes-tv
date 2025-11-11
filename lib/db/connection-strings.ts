"use server"

import { cookies } from "next/headers"

interface MongoConfig {
  uri: string
  database: string
  username?: string
  password?: string
}

async function getMongoConfig(): Promise<MongoConfig | null> {
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

/**
 * Generate Supabase PostgreSQL connection string
 */
export async function generateSupabaseConnectionString(): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabasePostgresUrl = process.env.SUPABASE_POSTGRES_URL || ""

  // Use direct Postgres URL if available
  if (supabasePostgresUrl) {
    return supabasePostgresUrl
  }

  if (supabaseUrl) {
    const host = supabaseUrl.replace("https://", "").replace("http://", "")
    const connectionString = `postgresql://postgres:[YOUR-PASSWORD]@${host}:5432/postgres`
    return connectionString
  }

  return "Not configured"
}

/**
 * Generate MongoDB connection string
 */
export async function generateMongoConnectionString(): Promise<string> {
  const mongoConfigData = await getMongoConfig()

  if (!mongoConfigData?.uri || !mongoConfigData?.database) {
    return "Not configured"
  }

  const { uri, database, username, password } = mongoConfigData

  // If URI already includes credentials, use as is
  if (uri.includes("@")) {
    return `${uri}/${database}`
  }

  // Add credentials to URI if provided
  if (username && password) {
    const protocol = uri.startsWith("mongodb+srv://") ? "mongodb+srv://" : "mongodb://"
    const host = uri.replace("mongodb+srv://", "").replace("mongodb://", "")
    return `${protocol}${username}:${password}@${host}/${database}`
  }

  // Return URI without credentials
  return `${uri}/${database}`
}

/**
 * Generate all connection strings
 */
export async function generateAllConnectionStrings() {
  const [supabase, mongodb] = await Promise.all([generateSupabaseConnectionString(), generateMongoConnectionString()])

  return {
    supabase,
    mongodb,
  }
}
