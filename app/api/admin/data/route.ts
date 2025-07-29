import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const [userResult, buttonsResult, linksResult] = await Promise.all([
      sql`SELECT * FROM users WHERE id = 1 LIMIT 1`,
      sql`SELECT * FROM buttons WHERE user_id = 1 ORDER BY order_index ASC`,
      sql`SELECT * FROM links WHERE user_id = 1 ORDER BY order_index ASC`,
    ])
    return NextResponse.json({
      user: userResult[0] || null,
      buttons: buttonsResult,
      links: linksResult,
    })
  } catch (error) {
    console.error("Error fetching admin data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
