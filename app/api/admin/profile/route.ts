import { type NextRequest, NextResponse } from "next/server"
import { sql, testConnection } from "@/lib/db"

export async function GET() {
  try {
    console.log("👤 GET /api/admin/profile - Fetching profile data")
    await testConnection()

    const result = await sql`
      SELECT id, name, bio, profile_image, background_color, background_image
      FROM users 
      WHERE id = 1
    `

    const profile = result[0] || {
      id: 1,
      name: "Your Name",
      bio: "Your bio here",
      profile_image: null,
      background_color: "#000000",
      background_image: null,
    }

    console.log("✅ Profile data fetched successfully:", {
      id: profile.id,
      name: profile.name,
      bioLength: profile.bio?.length || 0,
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("❌ Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("👤 POST /api/admin/profile - Updating profile")
    const body = await request.json()
    console.log("📝 Profile update data:", {
      name: body.name,
      bioLength: body.bio?.length || 0,
      hasProfileImage: !!body.profile_image,
      backgroundColor: body.background_color,
      hasBackgroundImage: !!body.background_image,
    })

    await testConnection()

    // Check if user exists
    const existingUser = await sql`SELECT id FROM users WHERE id = 1`

    if (existingUser.length === 0) {
      console.log("👤 Creating new user profile")
      const result = await sql`
        INSERT INTO users (id, name, bio, profile_image, background_color, background_image)
        VALUES (1, ${body.name}, ${body.bio}, ${body.profile_image}, ${body.background_color}, ${body.background_image})
        RETURNING *
      `
      console.log("✅ User profile created successfully:", result[0])
      return NextResponse.json(result[0])
    } else {
      console.log("👤 Updating existing user profile")
      const result = await sql`
        UPDATE users 
        SET name = ${body.name}, 
            bio = ${body.bio}, 
            profile_image = ${body.profile_image}, 
            background_color = ${body.background_color}, 
            background_image = ${body.background_image}
        WHERE id = 1
        RETURNING *
      `
      console.log("✅ User profile updated successfully:", result[0])
      return NextResponse.json(result[0])
    }
  } catch (error) {
    console.error("❌ Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
