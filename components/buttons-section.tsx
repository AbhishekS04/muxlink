"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { Button } from "@/lib/db"
import { ContactModal } from "@/components/contact-modal"
import { staggerFadeIn, buttonHoverGlow } from "@/lib/gsap-animations"

interface ButtonsSectionProps {
  buttons: Button[]
}

export function ButtonsSection({ buttons }: ButtonsSectionProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current || buttons.length === 0) return

    const ctx = gsap.context(() => {
      const buttonElements = buttonsRef.current.filter(Boolean) as HTMLElement[]
      staggerFadeIn(buttonElements, 0.5)

      // Add sophisticated hover animations
      buttonElements.forEach((button) => {
        const glowElement = button.querySelector(".button-glow") as HTMLElement
        if (!glowElement) return

        const hoverAnimation = buttonHoverGlow(button, glowElement)

        const handleMouseEnter = () => hoverAnimation.play()
        const handleMouseLeave = () => hoverAnimation.reverse()

        button.addEventListener("mouseenter", handleMouseEnter)
        button.addEventListener("mouseleave", handleMouseLeave)
      })
    }, containerRef)

    return () => ctx.revert()
  }, [buttons])

  const handleButtonClick = (button: Button, e: React.MouseEvent) => {
    if (button.label.toLowerCase().includes("contact")) {
      e.preventDefault()
      setIsContactModalOpen(true)
    }
  }

  return (
    <>
      <div ref={containerRef} className="mb-12 xs:mb-16 sm:mb-20 space-y-4 xs:space-y-5">
        {buttons.map((button, index) => (
          <a
            key={button.id}
            ref={(el) => (buttonsRef.current[index] = el)}
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-full relative overflow-hidden cursor-pointer"
            onClick={(e) => handleButtonClick(button, e)}
          >
            {/* Subtle glow effect */}
            <div className="button-glow absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 rounded-2xl opacity-0" />

            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-4 xs:py-5 sm:py-5 px-6 xs:px-8 text-center font-medium text-white transition-all duration-300 group-hover:border-white/20">
              <span className="text-base xs:text-lg sm:text-xl font-semibold tracking-wide">{button.label}</span>
            </div>
          </a>
        ))}
      </div>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  )
}
