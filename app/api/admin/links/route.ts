import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const links = await request.json();
    if (!Array.isArray(links)) {
      return NextResponse.json({ error: "Invalid data format: expected an array of links." }, { status: 400 });
    }

    // Start transaction
    await sql`BEGIN`;
    try {
      await sql`DELETE FROM links WHERE user_id = 1`;

      const insertPromises = links.map((link: any, index: number) => {
        if (!link.title || !link.url) {
          throw new Error("Each link must have a title and url.");
        }
        return sql`
          INSERT INTO links (user_id, title, url, icon_url, order_index)
          VALUES (1, ${link.title}, ${link.url}, ${link.icon_url ?? null}, ${index})
          RETURNING *
        `;
      });

      const results = await Promise.all(insertPromises);
      const newLinks = results.map((result) => result[0]);

      await sql`COMMIT`;
      // Revalidate the main page to show updated data
      revalidatePath("/")
      return NextResponse.json(newLinks);
    } catch (err) {
      await sql`ROLLBACK`;
      console.error("Transaction error updating links:", err);
      return NextResponse.json({ error: "Failed to update links: " + (err instanceof Error ? err.message : "Unknown error") }, { status: 500 });
    }
  } catch (error) {
    console.error("Error updating links:", error);
    return NextResponse.json({ error: "Failed to update links" }, { status: 500 });
  }
}
