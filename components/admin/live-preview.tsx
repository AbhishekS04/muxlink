"use client"

import { motion } from "framer-motion"
import { Eye } from "lucide-react"
import type { User, Link, Button } from "@/lib/db"
import { ProfileSection } from "@/components/profile-section"
import { ButtonsSection } from "@/components/buttons-section"
import { SocialIcons } from "@/components/social-icons"

interface LivePreviewProps {
  user: User | null
  buttons: Button[]
  links: Link[]
}

export function LivePreview({ user, buttons, links }: LivePreviewProps) {
  const backgroundColor = user?.background_color || "#000000"
  const backgroundType = user?.background_type || "solid"
  const backgroundImageUrl = user?.background_image_url
  const overlayOpacity = user?.background_overlay_opacity || 0.5

  return (
    <div className="h-full p-6 xs:p-8">
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="h-full"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Eye size={16} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Live Preview</h2>
        </div>

        <div className="rounded-2xl border border-white/10 h-full overflow-hidden relative">
          {/* Background Layer */}
          <div className="absolute inset-0">
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
                {/* Dark Overlay */}
                <div
                  className="absolute inset-0 bg-black transition-opacity duration-300"
                  style={{ opacity: overlayOpacity }}
                />
              </>
            ) : backgroundType === "gradient" ? (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}dd, ${backgroundColor}aa)`,
                  }}
                />
                <div className="absolute inset-0 bg-black/10" />
              </>
            ) : (
              <div className="absolute inset-0" style={{ backgroundColor }} />
            )}
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-md mx-auto px-6 py-12 h-full overflow-y-auto">
            {user && <ProfileSection user={user} />}
            <SocialIcons links={links} />
            {buttons.length > 0 && <ButtonsSection buttons={buttons} />}

            {!user && buttons.length === 0 && links.length === 0 && (
              <div className="text-center py-20">
                <p className="text-white/40 font-medium">Start editing to see your changes here</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
