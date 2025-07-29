import { sql } from "@/lib/db"
import type { User, Link, Button } from "@/lib/db"
import { AdminPanel } from "@/components/admin-panel"

async function getUserData(): Promise<{
  user: User | null
  buttons: Button[]
  links: Link[]
}> {
  try {
    console.log("📊 Fetching admin data...")

    const [userResult, buttonsResult, linksResult] = await Promise.all([
      sql`SELECT * FROM users WHERE id = 1 LIMIT 1`,
      sql`SELECT * FROM buttons WHERE user_id = 1 ORDER BY order_index ASC`,
      sql`SELECT * FROM links WHERE user_id = 1 ORDER BY order_index ASC`,
    ])

    console.log("✅ Admin data fetched successfully")
    console.log("👤 User:", userResult[0] ? "Found" : "Not found")
    console.log("🔘 Buttons:", buttonsResult.length)
    console.log("🔗 Links:", linksResult.length)

    return {
      user: (userResult[0] as User) || null,
      buttons: buttonsResult as Button[],
      links: linksResult as Link[],
    }
  } catch (error) {
    console.error("❌ Error fetching admin data:", error)
    return { user: null, buttons: [], links: [] }
  }
}

export default async function AdminPage() {
  console.log("🔧 Admin page loading...")

  const { user, buttons, links } = await getUserData()

  return (
    <div className="min-h-screen bg-black">
      <AdminPanel initialUser={user} initialButtons={buttons} initialLinks={links} />
    </div>
  )
}
