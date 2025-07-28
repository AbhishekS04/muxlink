// Extract dominant color from an image
export const getDominantColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        resolve("#ffffff")
        return
      }

      // Resize image for faster processing
      const size = 50
      canvas.width = size
      canvas.height = size

      ctx.drawImage(img, 0, 0, size, size)

      try {
        const imageData = ctx.getImageData(0, 0, size, size)
        const data = imageData.data

        let r = 0,
          g = 0,
          b = 0
        let pixelCount = 0

        // Sample pixels and calculate average
        for (let i = 0; i < data.length; i += 16) {
          // Skip pixels for performance
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
          pixelCount++
        }

        r = Math.round(r / pixelCount)
        g = Math.round(g / pixelCount)
        b = Math.round(b / pixelCount)

        // Convert to hex
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
        resolve(hex)
      } catch (error) {
        // Fallback for CORS issues
        resolve("#ffffff")
      }
    }

    img.onerror = () => resolve("#ffffff")
    img.src = imageUrl
  })
}

// Lighten a color for glow effect
export const lightenColor = (hex: string, percent: number): string => {
  const num = Number.parseInt(hex.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = ((num >> 8) & 0x00ff) + amt
  const B = (num & 0x0000ff) + amt

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  )
}

// Check if color is light or dark
export const isLightColor = (hex: string): boolean => {
  const num = Number.parseInt(hex.replace("#", ""), 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}
