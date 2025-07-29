import { type NextRequest, NextResponse } from "next/server"
import { sql, testConnection } from "@/lib/db"

export async function GET() {
  try {
    console.log("🔘 GET /api/admin/buttons - Fetching buttons")
    await testConnection()

    const result = await sql`
      SELECT id, title, url, icon, is_active, sort_order
      FROM buttons 
      ORDER BY sort_order ASC
    `

    console.log("✅ Buttons fetched successfully:", result.length, "buttons")
    return NextResponse.json(result)
  } catch (error) {
    console.error("❌ Error fetching buttons:", error)
    return NextResponse.json({ error: "Failed to fetch buttons" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔘 POST /api/admin/buttons - Updating buttons")
    const { buttons } = await request.json()
    console.log("📝 Buttons update data:", buttons.length, "buttons")

    await testConnection()

    // Clear existing buttons
    await sql`DELETE FROM buttons`
    console.log("🗑️ Existing buttons cleared")

    // Insert new buttons
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i]
      await sql`
        INSERT INTO buttons (title, url, icon, is_active, sort_order)
        VALUES (${button.title}, ${button.url}, ${button.icon}, ${button.is_active}, ${i + 1})
      `
    }

    console.log("✅ Buttons updated successfully:", buttons.length, "buttons saved")
    return NextResponse.json({ success: true, count: buttons.length })
  } catch (error) {
    console.error("❌ Error updating buttons:", error)
    return NextResponse.json({ error: "Failed to update buttons" }, { status: 500 })
  }
}
