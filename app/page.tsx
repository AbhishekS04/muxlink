import { sql } from "@/lib/db"
import type { User, Link, Button } from "@/lib/db"
import { ProfileSection } from "@/components/profile-section"
import { ButtonsSection } from "@/components/buttons-section"
import { SocialIcons } from "@/components/social-icons"

// Revalidate this page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60

async function getUserData(): Promise<{
  user: User | null
  buttons: Button[]
  links: Link[]
}> {
  try {
    const [userResult, buttonsResult, linksResult] = await Promise.all([
      sql`SELECT * FROM users WHERE id = 1 LIMIT 1`,
      sql`SELECT * FROM buttons WHERE user_id = 1 ORDER BY order_index ASC`,
      sql`SELECT * FROM links WHERE user_id = 1 ORDER BY order_index ASC`,
    ])

    return {
      user: (userResult[0] as User) || null,
      buttons: buttonsResult as Button[],
      links: linksResult as Link[],
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    return { user: null, buttons: [], links: [] }
  }
}

export default async function HomePage() {
  const { user, buttons, links } = await getUserData()

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">Welcome</h1>
          <p className="text-white/60 font-medium">Setting up your profile...</p>
        </div>
      </div>
    )
  }

  const backgroundColor = user.background_color || "#000000"
  const backgroundType = user.background_type || "solid"
  const backgroundImageUrl = user.background_image_url
  const overlayOpacity = user.background_overlay_opacity || 0.5

  const getBackgroundStyle = () => {
    if (backgroundType === "image" && backgroundImageUrl) {
      return {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }
    } else if (backgroundType === "gradient") {
      return {
        background: `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}dd, ${backgroundColor}aa)`,
      }
    } else {
      return {
        backgroundColor,
      }
    }
  }

  return (
    <>
      {/* Background Container */}
      <div className="fixed inset-0 z-0">
        {backgroundType === "image" && backgroundImageUrl ? (
          <>
            {/* Responsive Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            />
            {/* Alternative: Object-fit approach for better control */}
            <img
              src={backgroundImageUrl || "/placeholder.svg"}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ display: "none" }} // Hidden, using CSS background instead
            />
            {/* Dark Overlay */}
            <div
              className="absolute inset-0 bg-black transition-opacity duration-300"
              style={{ opacity: overlayOpacity }}
            />
          </>
        ) : backgroundType === "gradient" ? (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}dd, ${backgroundColor}aa)`,
            }}
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor }} />
        )}

        {/* Subtle overlay for gradient backgrounds */}
        {backgroundType === "gradient" && <div className="absolute inset-0 bg-black/10" />}

        {/* Ambient light effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/2 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="w-full max-w-md mx-auto px-6 xs:px-8 py-16 xs:py-20 sm:py-24 md:py-28">
          <ProfileSection user={user} />
          <SocialIcons links={links} />
          {buttons.length > 0 && <ButtonsSection buttons={buttons} />}
        </div>
      </div>
    </>
  )
}
