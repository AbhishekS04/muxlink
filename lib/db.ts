import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export interface User {
  id: number
  name: string
  profile_image_url?: string
  bio?: string
  background_color?: string
  background_type?: string
  background_image_url?: string
  background_overlay_opacity?: number
  created_at: string
  updated_at: string
}

export interface Link {
  id: number
  user_id: number
  title: string
  url: string
  icon_url?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Button {
  id: number
  user_id: number
  label: string
  url: string
  order_index: number
  created_at: string
  updated_at: string
}
