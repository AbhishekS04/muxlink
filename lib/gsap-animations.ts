import { gsap } from "gsap"

// Custom easing curves
export const customEase = "power2.out"
export const bounceEase = "back.out(1.7)"
export const smoothEase = "power1.inOut"
export const subtleEase = "power1.out"

// Fade in up animation
export const fadeInUp = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay,
      ease: subtleEase,
    },
  )
}

// Fade in scale animation
export const fadeInScale = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.9,
      y: 10,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1,
      delay,
      ease: customEase,
    },
  )
}

// Stagger fade in animation
export const staggerFadeIn = (elements: HTMLElement[], baseDelay = 0) => {
  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 15,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8, // Slower duration (was 0.5)
      stagger: 0.12, // Slower stagger (was 0.08)
      delay: baseDelay,
      ease: "power1.out", // Gentler easing
    },
  )
}

// Icon hover effect
export const iconHoverEffect = (element: HTMLElement) => {
  const tl = gsap.timeline({ paused: true })

  tl.to(element, {
    scale: 1.1,
    duration: 0.2,
    ease: subtleEase,
  })

  return {
    play: () => tl.play(),
    reverse: () => tl.reverse(),
  }
}

// Button hover with glow
export const buttonHoverGlow = (element: HTMLElement, glowElement: HTMLElement) => {
  const tl = gsap.timeline({ paused: true })

  tl.to(element, {
    scale: 1.01,
    duration: 0.3,
    ease: subtleEase,
  })

  tl.to(
    glowElement,
    {
      opacity: 1,
      duration: 0.3,
      ease: subtleEase,
    },
    0,
  )

  return {
    play: () => tl.play(),
    reverse: () => tl.reverse(),
  }
}

// Hover scale animation
export const hoverScale = (element: HTMLElement) => {
  const tl = gsap.timeline({ paused: true })

  tl.to(element, {
    scale: 1.02,
    duration: 0.3,
    ease: subtleEase,
  })

  return {
    play: () => tl.play(),
    reverse: () => tl.reverse(),
  }
}

// Icon hover with glow effect
export const iconHover = (element: HTMLElement, glowElement?: HTMLElement) => {
  const tl = gsap.timeline({ paused: true })

  tl.to(element, {
    scale: 1.15, // Slightly more scale
    y: -2, // Less vertical movement
    duration: 0.4, // Slower duration (was 0.2)
    ease: "power1.out", // Gentler easing
  })

  if (glowElement) {
    tl.to(
      glowElement,
      {
        opacity: 0.3,
        duration: 0.4, // Match the main animation
        ease: "power1.out",
      },
      0,
    )
  }

  return {
    play: () => tl.play(),
    reverse: () => tl.reverse(),
  }
}

// Modal animations
export const modalAnimation = {
  enter: (element: HTMLElement, backdrop: HTMLElement) => {
    const tl = gsap.timeline()

    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: subtleEase })

    tl.fromTo(
      element,
      {
        opacity: 0,
        scale: 0.95,
        y: 20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: customEase,
      },
      0.1,
    )

    return tl
  },

  exit: (element: HTMLElement, backdrop: HTMLElement) => {
    const tl = gsap.timeline()

    tl.to(element, {
      opacity: 0,
      scale: 0.95,
      y: 10,
      duration: 0.25,
      ease: subtleEase,
    })

    tl.to(
      backdrop,
      {
        opacity: 0,
        duration: 0.2,
        ease: subtleEase,
      },
      0.1,
    )

    return tl
  },
}

// Loading and success animations
export const loadingSpinner = (element: HTMLElement) => {
  return gsap.to(element, {
    rotation: 360,
    duration: 1,
    repeat: -1,
    ease: "none",
  })
}

export const successCheckmark = (element: HTMLElement) => {
  const tl = gsap.timeline()

  tl.fromTo(element, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: customEase })

  return tl
}
