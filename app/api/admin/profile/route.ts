import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const {
      name,
      bio,
      profile_image_url,
      background_color,
      background_type,
      background_image_url,
      background_overlay_opacity,
    } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    await sql`BEGIN`;
    try {
      // Try update with all fields
      let result = await sql`
        UPDATE users 
        SET 
          name = ${name}, 
          bio = ${bio}, 
          profile_image_url = ${profile_image_url},
          background_color = ${background_color || "#000000"},
          background_type = ${background_type || "solid"},
          background_image_url = ${background_image_url || null},
          background_overlay_opacity = ${background_overlay_opacity || 0.5},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
        RETURNING *
      `;

      if (result.length === 0) {
        // Create user if doesn't exist
        result = await sql`
          INSERT INTO users (id, name, bio, profile_image_url, background_color, background_type, background_image_url, background_overlay_opacity)
          VALUES (1, ${name}, ${bio}, ${profile_image_url}, ${background_color || "#000000"}, ${background_type || "solid"}, ${background_image_url || null}, ${background_overlay_opacity || 0.5})
          RETURNING *
        `;
      }

      await sql`COMMIT`;
      return NextResponse.json(result[0]);
    } catch (dbError: any) {
      await sql`ROLLBACK`;
      // If image columns don't exist, fall back to basic update/insert
      if (
        dbError.message?.includes("background_image_url") ||
        dbError.message?.includes("background_overlay_opacity")
      ) {
        console.log("Image background columns not found, using fallback...");
        await sql`BEGIN`;
        let result = await sql`
          UPDATE users 
          SET 
            name = ${name}, 
            bio = ${bio}, 
            profile_image_url = ${profile_image_url},
            background_color = ${background_color || "#000000"},
            background_type = ${background_type || "solid"},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = 1
          RETURNING *
        `;
        if (result.length === 0) {
          result = await sql`
            INSERT INTO users (id, name, bio, profile_image_url, background_color, background_type)
            VALUES (1, ${name}, ${bio}, ${profile_image_url}, ${background_color || "#000000"}, ${background_type || "solid"})
            RETURNING *
          `;
        }
        await sql`COMMIT`;
        return NextResponse.json(result[0]);
      } else {
        throw dbError;
      }
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
