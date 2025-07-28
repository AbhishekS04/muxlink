export const uploadImageToBlob = async (file: File): Promise<string> => {
  try {
    // Create a blob URL for immediate use
    const blobUrl = URL.createObjectURL(file)

    // In a real implementation, you would upload to Vercel Blob, Cloudinary, etc.
    // For now, we'll simulate the upload and return the blob URL

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return blobUrl
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error("Failed to upload image")
  }
}

export const validateImageFile = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error("Please upload a valid image file (JPEG, PNG, WebP, or GIF)")
  }

  if (file.size > maxSize) {
    throw new Error("Image file size must be less than 10MB")
  }

  return true
}

// Convert image to base64 for storage (maintains highest quality)
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Resize image while maintaining quality (optional)
export const resizeImage = (file: File, maxWidth = 400, quality = 0.9): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      const base64 = canvas.toDataURL(file.type, quality)
      resolve(base64)
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
