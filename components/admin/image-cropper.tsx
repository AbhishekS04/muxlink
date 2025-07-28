"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Crop, RotateCw, ZoomIn, Check, X, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface ImageCropperProps {
  imageUrl: string
  onCropComplete: (croppedImageUrl: string) => void
  onCancel: () => void
  aspectRatio?: number
  isBackground?: boolean
}

export function ImageCropper({
  imageUrl,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
  isBackground = false,
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

  const cropSize = 300

  useEffect(() => {
    const loadImage = async () => {
      try {
        const img = new Image()

        if (imageUrl.startsWith("blob:") || imageUrl.startsWith("data:")) {
          img.src = imageUrl
        } else {
          img.crossOrigin = "anonymous"
          img.src = imageUrl
        }

        img.onload = () => {
          imageRef.current = img
          setImageDimensions({ width: img.width, height: img.height })
          setImageLoaded(true)

          // Calculate initial scale to show full image
          const scaleToFit = Math.min(cropSize / img.width, cropSize / img.height) * 0.9
          setScale(scaleToFit)
          setPosition({ x: 0, y: 0 })

          setTimeout(() => drawImage(), 100)
        }

        img.onerror = (error) => {
          console.error("Failed to load image:", error)
          setImageLoaded(false)
          if (img.crossOrigin) {
            img.crossOrigin = null
            img.src = imageUrl
          }
        }
      } catch (error) {
        console.error("Error setting up image:", error)
        setImageLoaded(false)
      }
    }

    if (imageUrl) {
      loadImage()
    }
  }, [imageUrl])

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img || !imageLoaded) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    try {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Save context
      ctx.save()

      // Move to center of canvas
      ctx.translate(cropSize / 2, cropSize / 2)

      // Apply transformations
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(scale, scale)
      ctx.translate(position.x, position.y)

      // Draw image centered
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      // Restore context
      ctx.restore()

      // Draw crop overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Clear crop area
      ctx.globalCompositeOperation = "destination-out"

      if (isBackground) {
        // Rectangular crop for background images
        const cropWidth = cropSize * 0.8
        const cropHeight = (cropSize * 0.8) / aspectRatio
        const cropX = (canvas.width - cropWidth) / 2
        const cropY = (canvas.height - cropHeight) / 2
        ctx.fillRect(cropX, cropY, cropWidth, cropHeight)
      } else {
        // Circular crop for profile pictures
        const cropRadius = cropSize * 0.35
        ctx.beginPath()
        ctx.arc(cropSize / 2, cropSize / 2, cropRadius, 0, 2 * Math.PI)
        ctx.fill()
      }

      ctx.globalCompositeOperation = "source-over"

      // Draw crop border
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3

      if (isBackground) {
        const cropWidth = cropSize * 0.8
        const cropHeight = (cropSize * 0.8) / aspectRatio
        const cropX = (canvas.width - cropWidth) / 2
        const cropY = (canvas.height - cropHeight) / 2
        ctx.strokeRect(cropX, cropY, cropWidth, cropHeight)
      } else {
        const cropRadius = cropSize * 0.35
        ctx.beginPath()
        ctx.arc(cropSize / 2, cropSize / 2, cropRadius, 0, 2 * Math.PI)
        ctx.stroke()
      }

      // Add grid lines for better positioning
      if (!isBackground) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
        ctx.lineWidth = 1
        const cropRadius = cropSize * 0.35

        // Cross lines
        ctx.beginPath()
        ctx.moveTo(cropSize / 2 - cropRadius, cropSize / 2)
        ctx.lineTo(cropSize / 2 + cropRadius, cropSize / 2)
        ctx.moveTo(cropSize / 2, cropSize / 2 - cropRadius)
        ctx.lineTo(cropSize / 2, cropSize / 2 + cropRadius)
        ctx.stroke()
      }
    } catch (error) {
      console.error("Error drawing image:", error)
    }
  }, [scale, rotation, position, imageLoaded, aspectRatio, isBackground])

  useEffect(() => {
    drawImage()
  }, [drawImage])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left - position.x,
        y: e.clientY - rect.top - position.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setPosition({
        x: e.clientX - rect.left - dragStart.x,
        y: e.clientY - rect.top - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleCrop = () => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) {
      console.error("Canvas or image not available for cropping")
      return
    }

    try {
      const cropCanvas = document.createElement("canvas")
      const cropCtx = cropCanvas.getContext("2d")
      if (!cropCtx) return

      // Set output size
      const outputSize = isBackground ? 800 : 400
      cropCanvas.width = outputSize
      cropCanvas.height = isBackground ? outputSize / aspectRatio : outputSize

      // Fill with transparent background for circular crops
      if (!isBackground) {
        cropCtx.fillStyle = "transparent"
        cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height)
      }

      // Save context
      cropCtx.save()

      // Create clipping path for circular crops
      if (!isBackground) {
        cropCtx.beginPath()
        cropCtx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, 2 * Math.PI)
        cropCtx.clip()
      }

      // Move to center
      cropCtx.translate(cropCanvas.width / 2, cropCanvas.height / 2)

      // Apply transformations with proper scaling
      cropCtx.rotate((rotation * Math.PI) / 180)
      const scaleFactor = scale * (outputSize / cropSize)
      cropCtx.scale(scaleFactor, scaleFactor)
      cropCtx.translate(position.x * (outputSize / cropSize), position.y * (outputSize / cropSize))

      // Draw image
      cropCtx.drawImage(img, -img.width / 2, -img.height / 2)

      // Restore context
      cropCtx.restore()

      // Convert to base64 with high quality
      const croppedImageUrl = cropCanvas.toDataURL("image/png", 1.0)
      onCropComplete(croppedImageUrl)
    } catch (error) {
      console.error("Error cropping image:", error)
      alert("Failed to crop image. Please try again.")
    }
  }

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 })
    const img = imageRef.current
    if (img) {
      const scaleToFit = Math.min(cropSize / img.width, cropSize / img.height) * 0.9
      setScale(scaleToFit)
    }
    setRotation(0)
  }

  // Manual zoom functions
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 4))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.3))
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crop size={20} className="text-white" />
            <h3 className="text-lg font-semibold text-white">
              {isBackground ? "Crop Background Image" : "Crop Profile Picture"}
            </h3>
          </div>
          <p className="text-white/60 text-sm">Drag to reposition, use controls to adjust</p>
          {imageDimensions.width > 0 && (
            <p className="text-white/40 text-xs mt-1">
              Original: {imageDimensions.width} × {imageDimensions.height}px
            </p>
          )}
        </div>

        {/* Canvas */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={cropSize}
              height={cropSize}
              className="border border-white/20 rounded-lg cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-lg">
                <div className="text-white/60">Loading...</div>
              </div>
            )}

            <div className="absolute top-2 left-2 bg-black/50 rounded px-2 py-1 text-xs text-white/80 flex items-center gap-1">
              <Move size={12} />
              Drag to move
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-6">
          {/* Zoom with manual buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/80 flex items-center gap-1">
                <ZoomIn size={14} />
                Zoom
              </label>
              <div className="flex items-center gap-2">
                <Button
                  onClick={zoomOut}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent px-2 py-1 h-6"
                >
                  -
                </Button>
                <span className="text-xs text-white/60 min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
                <Button
                  onClick={zoomIn}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent px-2 py-1 h-6"
                >
                  +
                </Button>
              </div>
            </div>
            <Slider
              value={[scale]}
              onValueChange={(value) => setScale(value[0])}
              min={0.3}
              max={4}
              step={0.05}
              className="w-full"
            />
          </div>

          {/* Rotation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/80 flex items-center gap-1">
                <RotateCw size={14} />
                Rotation
              </label>
              <span className="text-xs text-white/60">{rotation}°</span>
            </div>
            <Slider
              value={[rotation]}
              onValueChange={(value) => setRotation(value[0])}
              min={-180}
              max={180}
              step={15}
              className="w-full"
            />
          </div>

          {/* Reset button */}
          <Button
            onClick={resetPosition}
            variant="outline"
            size="sm"
            className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            Reset Position
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            <X size={16} className="mr-2" />
            Cancel
          </Button>
          <Button onClick={handleCrop} className="flex-1 bg-white text-black hover:bg-white/90">
            <Check size={16} className="mr-2" />
            Apply Crop
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
