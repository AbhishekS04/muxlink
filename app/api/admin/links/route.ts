import { type NextRequest, NextResponse } from "next/server"
import { sql, testConnection } from "@/lib/db"

export async function GET() {
  try {
    console.log("🔗 GET /api/admin/links - Fetching links")
    await testConnection()

    const result = await sql`
      SELECT id, title, url, is_active, sort_order
      FROM links 
      ORDER BY sort_order ASC
    `

    console.log("✅ Links fetched successfully:", result.length, "links")
    return NextResponse.json(result)
  } catch (error) {
    console.error("❌ Error fetching links:", error)
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔗 POST /api/admin/links - Updating links")
    const { links } = await request.json()
    console.log("📝 Links update data:", links.length, "links")

    await testConnection()

    // Clear existing links
    await sql`DELETE FROM links`
    console.log("🗑️ Existing links cleared")

    // Insert new links
    for (let i = 0; i < links.length; i++) {
      const link = links[i]
      await sql`
        INSERT INTO links (title, url, is_active, sort_order)
        VALUES (${link.title}, ${link.url}, ${link.is_active}, ${i + 1})
      `
    }

    console.log("✅ Links updated successfully:", links.length, "links saved")
    return NextResponse.json({ success: true, count: links.length })
  } catch (error) {
    console.error("❌ Error updating links:", error)
    return NextResponse.json({ error: "Failed to update links" }, { status: 500 })
  }
}
