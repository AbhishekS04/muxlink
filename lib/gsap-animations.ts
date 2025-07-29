import type React from "react"
import { gsap } from "gsap"

// Custom easing curves - much smoother
export const customEase = "power2.out"
export const bounceEase = "back.out(1.1)" // Reduced bounce
export const smoothEase = "power1.inOut"
export const subtleEase = "power1.out"

// Fade in up animation - smoother
export const fadeInUp = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 15, // Less movement
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8, // Longer duration
      delay,
      ease: "power2.out", // Smoother easing
    },
  )
}

// Fade in scale animation - smoother
export const fadeInScale = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.95, // Less dramatic scale
      y: 8, // Less movement
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.2, // Longer duration
      delay,
      ease: "power2.out", // Smoother easing
    },
  )
}

// Stagger fade in animation - much smoother
export const staggerFadeIn = (elements: HTMLElement[], baseDelay = 0) => {
  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 10, // Reduced movement
    },
    {
      opacity: 1,
      y: 0,
      duration: 1.0, // Longer, smoother duration
      stagger: 0.12, // Consistent stagger
      delay: baseDelay,
      ease: "power2.out", // Much smoother easing
    },
  )
}

// Icon hover effect - much smoother
export const iconHoverEffect = (element: HTMLElement) => {
  const tl = gsap.timeline({ paused: true })

  tl.to(element, {
    scale: 1.06, // Less dramatic scale
    duration: 0.5, // Longer duration
    ease: "power2.out", // Smoother easing
  })

  return {
    play: () => tl.play(),
    reverse: () => tl.reverse(),
  }
}

// Button hover with glow - smoother
export const buttonHoverGlow = (element: HTMLElement, glowElement: HTMLElement) => {
  const tl = gsap.timeline({ paused: true })

  tl.to(element, {
    scale: 1.008, // Very subtle scale
    duration: 0.5, // Longer duration
    ease: "power2.out", // Smoother easing
  })

  tl.to(
    glowElement,
    {
      opacity: 1,
      duration: 0.5, // Match main animation
      ease: "power2.out",
    },
    0,
  )

  return {
    play: () => tl.play(),
    reverse: () => tl.reverse(),
  }
}

// Hover scale animation - smoother
export const hoverScale = (element: HTMLElement) => {
  const tl = gsap.timeline({ paused: true })

  tl.to(element, {
    scale: 1.015, // Very subtle scale
    duration: 0.5, // Longer duration
    ease: "power2.out", // Smoother easing
  })

  return {
    play: () => tl.play(),
    reverse: () => tl.reverse(),
  }
}

// Icon hover with glow effect - much smoother and less jittery
export const iconHover = (element: HTMLElement, glowElement?: HTMLElement) => {
  const tl = gsap.timeline({ paused: true })

  tl.to(element, {
    scale: 1.08, // Reduced scale for smoothness
    y: -2, // Minimal vertical movement
    duration: 0.6, // Longer duration for smoothness
    ease: "power2.out", // Much smoother easing
  })

  if (glowElement) {
    tl.to(
      glowElement,
      {
        opacity: 0.2, // Subtle glow
        duration: 0.6, // Match the main animation
        ease: "power2.out",
      },
      0,
    )
  }

  return {
    play: () => tl.play(),
    reverse: () => tl.reverse(),
  }
}

// Modal animations - smoother
export const modalAnimation = {
  enter: (element: HTMLElement, backdrop: HTMLElement) => {
    const tl = gsap.timeline()

    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" })

    tl.fromTo(
      element,
      {
        opacity: 0,
        scale: 0.96, // Less dramatic scale
        y: 15, // Less movement
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6, // Longer duration
        ease: "power2.out", // Smoother easing
      },
      0.1,
    )

    return tl
  },

  exit: (element: HTMLElement, backdrop: HTMLElement) => {
    const tl = gsap.timeline()

    tl.to(element, {
      opacity: 0,
      scale: 0.96,
      y: 8,
      duration: 0.4, // Longer duration
      ease: "power2.out",
    })

    tl.to(
      backdrop,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      0.1,
    )

    return tl
  },
}

// Loading and success animations - smoother
export const loadingSpinner = (element: HTMLElement) => {
  return gsap.to(element, {
    rotation: 360,
    duration: 2, // Slower, smoother rotation
    repeat: -1,
    ease: "none",
  })
}

export const successCheckmark = (element: HTMLElement) => {
  const tl = gsap.timeline()

  tl.fromTo(
    element,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.6, // Longer duration
      ease: "back.out(1.1)", // Less bouncy
    },
  )

  return tl
}

// Additional animation functions for complete compatibility
export const animateProfileSection = (
  profileRef: React.RefObject<HTMLDivElement>,
  nameRef: React.RefObject<HTMLHeadingElement>,
  bioRef: React.RefObject<HTMLDivElement>,
) => {
  if (!profileRef.current || !nameRef.current || !bioRef.current) return

  const tl = gsap.timeline()

  // Set initial states
  gsap.set([nameRef.current, bioRef.current], {
    opacity: 0,
    y: 30,
  })

  // Animate profile section
  tl.to(profileRef.current, {
    opacity: 1,
    duration: 0.8,
    ease: "power2.out",
  })
    .to(
      nameRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.4",
    )
    .to(
      bioRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.6",
    )
}

export const animateLinksSection = (linksRef: React.RefObject<HTMLDivElement>) => {
  if (!linksRef.current) return

  const links = linksRef.current.querySelectorAll(".link-item")

  gsap.set(links, {
    opacity: 0,
    y: 20,
    scale: 0.95,
  })

  gsap.to(links, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.12,
    delay: 0.3,
  })
}

export const animateButtonsSection = (buttonsRef: React.RefObject<HTMLDivElement>) => {
  if (!buttonsRef.current) return

  const buttons = buttonsRef.current.querySelectorAll(".button-item")

  gsap.set(buttons, {
    opacity: 0,
    y: 20,
    scale: 0.95,
  })

  gsap.to(buttons, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.12,
    delay: 0.6,
  })
}

export const animateSocialIcons = (socialRef: React.RefObject<HTMLDivElement>) => {
  if (!socialRef.current) return

  const icons = socialRef.current.querySelectorAll(".social-icon")

  gsap.set(icons, {
    opacity: 0,
    scale: 0.8,
    y: 20,
  })

  gsap.to(icons, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.12,
    delay: 0.9,
  })
}

export const animateContactButton = (contactRef: React.RefObject<HTMLButtonElement>) => {
  if (!contactRef.current) return

  gsap.set(contactRef.current, {
    opacity: 0,
    y: 20,
  })

  gsap.to(contactRef.current, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out",
    delay: 1.2,
  })
}

// Smooth hover animations for icons
export const addIconHoverAnimations = () => {
  // Social icons hover
  const socialIcons = document.querySelectorAll(".social-icon")
  socialIcons.forEach((icon) => {
    const element = icon as HTMLElement

    element.addEventListener("mouseenter", () => {
      gsap.to(element, {
        scale: 1.08,
        y: -3,
        duration: 0.6,
        ease: "power2.out",
      })
    })

    element.addEventListener("mouseleave", () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      })
    })
  })

  // Link items hover
  const linkItems = document.querySelectorAll(".link-item")
  linkItems.forEach((link) => {
    const element = link as HTMLElement

    element.addEventListener("mouseenter", () => {
      gsap.to(element, {
        scale: 1.008,
        duration: 0.6,
        ease: "power2.out",
      })
    })

    element.addEventListener("mouseleave", () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      })
    })
  })

  // Button items hover
  const buttonItems = document.querySelectorAll(".button-item")
  buttonItems.forEach((button) => {
    const element = button as HTMLElement

    element.addEventListener("mouseenter", () => {
      gsap.to(element, {
        scale: 1.008,
        duration: 0.6,
        ease: "power2.out",
      })
    })

    element.addEventListener("mouseleave", () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      })
    })
  })
}

// Modal animations
export const animateModalOpen = (modalRef: React.RefObject<HTMLDivElement>) => {
  if (!modalRef.current) return

  const modal = modalRef.current
  const content = modal.querySelector(".modal-content")

  gsap.set(modal, { opacity: 0 })
  gsap.set(content, { scale: 0.9, y: 20 })

  const tl = gsap.timeline()

  tl.to(modal, {
    opacity: 1,
    duration: 0.4,
    ease: "power2.out",
  }).to(
    content,
    {
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    },
    "-=0.2",
  )
}

export const animateModalClose = (modalRef: React.RefObject<HTMLDivElement>, onComplete?: () => void) => {
  if (!modalRef.current) return

  const modal = modalRef.current
  const content = modal.querySelector(".modal-content")

  const tl = gsap.timeline({
    onComplete,
  })

  tl.to(content, {
    scale: 0.9,
    y: 20,
    duration: 0.4,
    ease: "power2.in",
  }).to(
    modal,
    {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    },
    "-=0.1",
  )
}

// Loading spinner animation
export const animateSpinner = (spinnerRef: React.RefObject<HTMLDivElement>) => {
  if (!spinnerRef.current) return

  gsap.to(spinnerRef.current, {
    rotation: 360,
    duration: 2,
    ease: "none",
    repeat: -1,
  })
}

// Success checkmark animation
export const animateSuccessCheckmark = (checkmarkRef: React.RefObject<HTMLDivElement>) => {
  if (!checkmarkRef.current) return

  gsap.set(checkmarkRef.current, { scale: 0 })

  gsap.to(checkmarkRef.current, {
    scale: 1,
    duration: 0.8,
    ease: "back.out(1.7)",
  })
}
