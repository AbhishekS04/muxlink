import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const links = await request.json()

    // Delete all existing links
    await sql`DELETE FROM links WHERE user_id = 1`

    // Insert new links
    const insertPromises = links.map((link: any, index: number) => {
      return sql`
        INSERT INTO links (user_id, title, url, icon_url, order_index)
        VALUES (1, ${link.title}, ${link.url}, ${link.icon_url}, ${index})
        RETURNING *
      `
    })

    const results = await Promise.all(insertPromises)
    const newLinks = results.map((result) => result[0])

    return NextResponse.json(newLinks)
  } catch (error) {
    console.error("Error updating links:", error)
    return NextResponse.json({ error: "Failed to update links" }, { status: 500 })
  }
}
