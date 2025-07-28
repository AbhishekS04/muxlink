"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import type { User } from "@/lib/db"
import { fadeInScale, fadeInUp, customEase } from "@/lib/gsap-animations"
import { getDominantColor, lightenColor } from "@/lib/color-utils"

interface ProfileSectionProps {
  user: User
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const bioRef = useRef<HTMLParagraphElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [glowColor, setGlowColor] = useState("#ffffff")

  useEffect(() => {
    // Extract dominant color from profile image
    if (user.profile_image_url) {
      getDominantColor(user.profile_image_url)
        .then((color) => {
          setGlowColor(color)
        })
        .catch(() => {
          setGlowColor("#ffffff")
        })
    }
  }, [user.profile_image_url])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Image animation with glow effect
      if (imageRef.current) {
        fadeInScale(imageRef.current, 0.2)
      }

      // Name animation with subtle floating
      if (nameRef.current) {
        gsap.fromTo(
          nameRef.current,
          {
            opacity: 0,
            y: 20,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: 0.6,
            ease: customEase,
          },
        )

        // Add subtle floating animation
        gsap.to(nameRef.current, {
          y: -2,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: 1.5,
        })
      }

      // Bio animation
      if (bioRef.current) {
        fadeInUp(bioRef.current, 0.8)
      }

      // Enhanced hover effect for profile image with adaptive background glow
      if (imageRef.current && glowRef.current) {
        const imageElement = imageRef.current
        const glowElement = glowRef.current

        const handleMouseEnter = () => {
          // Animate the main glow
          gsap.to(glowElement, {
            opacity: 0.6, // Increased intensity
            scale: 1.8,
            duration: 0.6,
            ease: "power2.out",
          })

          // Subtle image scale
          gsap.to(imageElement.querySelector("img"), {
            scale: 1.05,
            duration: 0.6,
            ease: "power2.out",
          })
        }

        const handleMouseLeave = () => {
          gsap.to(glowElement, {
            opacity: 0,
            scale: 1.5,
            duration: 0.6,
            ease: "power2.out",
          })

          gsap.to(imageElement.querySelector("img"), {
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          })
        }

        imageElement.addEventListener("mouseenter", handleMouseEnter)
        imageElement.addEventListener("mouseleave", handleMouseLeave)

        return () => {
          imageElement.removeEventListener("mouseenter", handleMouseEnter)
          imageElement.removeEventListener("mouseleave", handleMouseLeave)
        }
      }
    }, containerRef)

    return () => ctx.revert()
  }, [user, glowColor])

  const lightGlowColor = lightenColor(glowColor, 30)

  return (
    <div ref={containerRef} className="text-center mb-12 xs:mb-16 sm:mb-20">
      <div className="mb-8 xs:mb-10 sm:mb-12">
        <div ref={imageRef} className="relative inline-block group cursor-pointer">
          {/* Background glow layers - positioned behind the image */}
          <div className="absolute inset-0 -z-10">
            {/* Primary adaptive glow */}
            <div
              ref={glowRef}
              className="absolute inset-0 rounded-full blur-xl scale-150 opacity-0 transition-all duration-500"
              style={{
                background: `radial-gradient(circle, ${lightGlowColor}60, ${glowColor}30, transparent)`,
                transform: "scale(1.5)",
              }}
            />

            {/* Secondary intense glow */}
            <div
              className="absolute inset-0 rounded-full blur-2xl scale-[2] opacity-0 group-hover:opacity-30 transition-all duration-500"
              style={{
                background: `radial-gradient(circle, ${glowColor}80, ${lightGlowColor}40, transparent)`,
                transform: "scale(2)",
              }}
            />

            {/* Outer ambient glow */}
            <div
              className="absolute inset-0 rounded-full blur-3xl scale-[2.5] opacity-0 group-hover:opacity-20 transition-all duration-700"
              style={{
                background: `radial-gradient(circle, ${glowColor}40, transparent)`,
                transform: "scale(2.5)",
              }}
            />
          </div>

          {/* Profile Image */}
          <div className="relative z-10">
            <Image
              src={user.profile_image_url || "/placeholder.svg?height=120&width=120&query=minimal+profile+avatar"}
              alt={user.name}
              width={120}
              height={120}
              className="w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full mx-auto border-2 border-white/20 shadow-2xl shadow-black/50 object-cover transition-all duration-500 group-hover:border-white/40 group-hover:shadow-3xl"
            />

            {/* Subtle overlay on image */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </div>

      <h1
        ref={nameRef}
        className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 xs:mb-6 tracking-tight whitespace-nowrap"
        style={{ whiteSpace: "nowrap" }}
      >
        {user.name}
      </h1>

      {user.bio && (
        <p
          ref={bioRef}
          className="text-white/70 text-base xs:text-lg sm:text-xl font-medium leading-relaxed max-w-md mx-auto px-4"
        >
          {user.bio}
        </p>
      )}
    </div>
  )
}
