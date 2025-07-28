import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const buttons = await request.json()

    // Delete all existing buttons
    await sql`DELETE FROM buttons WHERE user_id = 1`

    // Insert new buttons
    const insertPromises = buttons.map((button: any, index: number) => {
      return sql`
        INSERT INTO buttons (user_id, label, url, order_index)
        VALUES (1, ${button.label}, ${button.url}, ${index})
        RETURNING *
      `
    })

    const results = await Promise.all(insertPromises)
    const newButtons = results.map((result) => result[0])

    return NextResponse.json(newButtons)
  } catch (error) {
    console.error("Error updating buttons:", error)
    return NextResponse.json({ error: "Failed to update buttons" }, { status: 500 })
  }
}
