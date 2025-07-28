"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { Link } from "@/lib/db"
import { getSocialIcon, getSocialColor } from "@/lib/social-icons"
import { staggerFadeIn } from "@/lib/gsap-animations"

interface SocialIconsProps {
  links: Link[]
}

export function SocialIcons({ links }: SocialIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current || links.length === 0) return

    const ctx = gsap.context(() => {
      // Simple stagger animation for icons entrance
      const iconElements = iconsRef.current.filter(Boolean) as HTMLElement[]
      staggerFadeIn(iconElements, 0.8)

      // Clean popup hover animation only
      iconElements.forEach((icon) => {
        const iconElement = icon.querySelector(".social-icon") as HTMLElement
        if (!iconElement) return

        // Slower, smoother popup hover effect
        const handleMouseEnter = () => {
          gsap.to(iconElement, {
            scale: 1.15,
            y: -2,
            duration: 0.4, // Slower (was 0.2)
            ease: "power1.out", // Gentler easing
          })
        }

        const handleMouseLeave = () => {
          gsap.to(iconElement, {
            scale: 1,
            y: 0,
            duration: 0.4, // Slower (was 0.2)
            ease: "power1.out", // Gentler easing
          })
        }

        icon.addEventListener("mouseenter", handleMouseEnter)
        icon.addEventListener("mouseleave", handleMouseLeave)
      })
    }, containerRef)

    return () => ctx.revert()
  }, [links])

  if (links.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center gap-6 xs:gap-7 sm:gap-8 mb-12 xs:mb-16 sm:mb-20"
    >
      {links.map((link, index) => {
        const IconComponent = getSocialIcon(link.url)
        const iconColor = getSocialColor(link.url)

        return (
          <a
            key={link.id}
            ref={(el) => (iconsRef.current[index] = el)}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative cursor-pointer"
          >
            <IconComponent
              size={32}
              className="social-icon w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 transition-colors duration-200"
              style={{ color: iconColor }}
            />
          </a>
        )
      })}
    </div>
  )
}
