import { neon } from "@neondatabase/serverless"

// Your Neon database URL with fallback to environment variable
const DATABASE_URL =
  "postgresql://neondb_owner:npg_6YLtwIhabxd1@ep-little-paper-ad1iuiu1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" ||
  process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}

export const sql = neon(DATABASE_URL)

// Database types
export interface User {
  id: number
  name: string
  bio: string
  profile_image?: string
  background_color?: string
  background_image?: string
  created_at: Date
  updated_at: Date
}

export interface Link {
  id: number
  user_id: number
  title: string
  url: string
  order_index: number
  created_at: Date
  updated_at: Date
}

export interface Button {
  id: number
  user_id: number
  title: string
  url: string
  order_index: number
  created_at: Date
  updated_at: Date
}

// Test database connection
export async function testConnection() {
  try {
    console.log("🔍 Testing database connection...")
    const result = await sql`SELECT 1 as test`
    console.log("✅ Database connection successful:", result)
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}
