"use client"

import type React from "react"

import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { motion } from "framer-motion"
import { Save, User, Palette, Upload, X, Link, ImageIcon, Camera, Crop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { User as UserType } from "@/lib/db"
import { validateImageFile } from "@/lib/file-upload"
import { ImageCropper } from "@/components/admin/image-cropper"

interface ProfileEditorProps {
  user: UserType | null
  onUpdate: (user: UserType | null) => void
}

export const ProfileEditor = forwardRef<{ handleSave: () => Promise<void> }, ProfileEditorProps>(({ user, onUpdate }, ref) => {
  const [name, setName] = useState(user?.name || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [profileImage, setProfileImage] = useState(user?.profile_image_url || "")
  const [backgroundColor, setBackgroundColor] = useState(user?.background_color || "#000000")
  const [backgroundType, setBackgroundType] = useState(user?.background_type || "solid")
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(user?.background_image_url || "")
  const [backgroundOverlayOpacity, setBackgroundOverlayOpacity] = useState(user?.background_overlay_opacity || 0.5)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingProfile, setUploadingProfile] = useState(false)

  // Cropper state
  const [showCropper, setShowCropper] = useState(false)
  const [tempImageForCrop, setTempImageForCrop] = useState("")

  // Add these state variables after the existing cropper state
  const [showBackgroundCropper, setShowBackgroundCropper] = useState(false)
  const [tempBackgroundForCrop, setTempBackgroundForCrop] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const profileFileInputRef = useRef<HTMLInputElement>(null)
  
  // handleSave method will be exposed to parent component via useImperativeHandle below

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          profile_image_url: profileImage,
          background_color: backgroundColor,
          background_type: backgroundType,
          background_image_url: backgroundImageUrl,
          background_overlay_opacity: backgroundOverlayOpacity,
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        onUpdate(updatedUser)
      } else {
        const errorData = await response.json()
        console.error("Server error:", errorData)
        alert("Failed to save profile. Please try again.")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to save profile. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Expose the handleSave method to the parent component
  useImperativeHandle(ref, () => ({
    handleSave
  }))

  // Profile image upload handler with cropping
  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("File selected:", file.name, file.type, file.size)

    try {
      validateImageFile(file)
      setUploadingProfile(true)

      // Create temporary URL for cropping
      const tempUrl = URL.createObjectURL(file)
      console.log("Created blob URL:", tempUrl)

      setTempImageForCrop(tempUrl)
      setShowCropper(true)

      // Clear the file input
      if (profileFileInputRef.current) {
        profileFileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading profile image:", error)
      alert(error instanceof Error ? error.message : "Failed to upload profile image")
    } finally {
      setUploadingProfile(false)
    }
  }

  const handleCropComplete = (croppedImageUrl: string) => {
    setProfileImage(croppedImageUrl)
    setShowCropper(false)
    setTempImageForCrop("")
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setTempImageForCrop("")
    if (tempImageForCrop) {
      URL.revokeObjectURL(tempImageForCrop)
    }
  }

  // Add these functions after handleCropCancel
  const handleBackgroundCropComplete = (croppedImageUrl: string) => {
    setBackgroundImageUrl(croppedImageUrl)
    setBackgroundType("image")
    setShowBackgroundCropper(false)
    setTempBackgroundForCrop("")
  }

  const handleBackgroundCropCancel = () => {
    setShowBackgroundCropper(false)
    setTempBackgroundForCrop("")
    if (tempBackgroundForCrop) {
      URL.revokeObjectURL(tempBackgroundForCrop)
    }
  }

  // Replace the handleFileUpload function with this enhanced version
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      validateImageFile(file)
      setUploadingImage(true)

      // Create temporary URL for cropping
      const tempUrl = URL.createObjectURL(file)
      setTempBackgroundForCrop(tempUrl)
      setShowBackgroundCropper(true)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setBackgroundImageUrl("")
    setBackgroundType("solid")
  }

  const presetColors = [
    "#000000", // Black
    "#1a1a1a", // Dark Gray
    "#0f172a", // Slate
    "#1e1b4b", // Indigo
    "#1f2937", // Gray
    "#374151", // Cool Gray
    "#450a0a", // Dark Red
    "#14532d", // Dark Green
    "#1e3a8a", // Dark Blue
    "#581c87", // Dark Purple
  ]

  // High-quality responsive background images
  const presetImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1920&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1080&h=1920&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1080&h=1920&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1080&h=1920&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1080&h=1920&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1920&fit=crop&crop=center",
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white font-semibold text-xl">
              <User size={20} />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-3">Display Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-3">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people about yourself..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 resize-none font-light"
                rows={3}
              />
            </div>

            {/* Profile Image Section */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-white/80">Profile Picture</label>

              {/* Current Profile Image Preview */}
              {profileImage && (
                <div className="flex items-center gap-4">
                  <img
                    src={profileImage || "/placeholder.svg"}
                    alt="Profile preview"
                    className="w-16 h-16 rounded-full object-cover border border-white/20"
                  />
                  <Button
                    onClick={() => setProfileImage("")}
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <X size={14} className="mr-1" />
                    Remove
                  </Button>
                </div>
              )}

              {/* Upload Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Custom Upload with Cropping */}
                <Button
                  type="button"
                  onClick={() => profileFileInputRef.current?.click()}
                  disabled={uploadingProfile}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-12"
                  variant="outline"
                >
                  <div className="flex items-center">
                    <Camera size={16} className="mr-2" />
                    <Crop size={14} className="mr-1" />
                    {uploadingProfile ? "Uploading..." : "Upload & Crop"}
                  </div>
                </Button>
                <input
                  ref={profileFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />

                {/* URL Input */}
                <div className="flex items-center gap-2">
                  <Input
                    value={profileImage.startsWith("data:") ? "" : profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="Or paste image URL"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 font-light text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-white/50">📸 Upload from device with crop tool, or paste an image URL</p>
            </div>

            {/* Background Settings */}
            <div className="space-y-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Palette size={16} className="text-white/80" />
                <label className="text-sm font-semibold text-white/80">Background Settings</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Background Type</label>
                <Select value={backgroundType} onValueChange={setBackgroundType}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10">
                    <SelectItem value="solid" className="text-white hover:bg-white/10">
                      Solid Color
                    </SelectItem>
                    <SelectItem value="gradient" className="text-white hover:bg-white/10">
                      Gradient
                    </SelectItem>
                    <SelectItem value="image" className="text-white hover:bg-white/10">
                      Custom Image
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Solid/Gradient Background */}
              {backgroundType !== "image" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Background Color</label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-16 h-10 p-1 bg-white/5 border-white/10 rounded cursor-pointer"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Preset Colors */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Quick Presets</label>
                    <div className="grid grid-cols-5 gap-2">
                      {presetColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setBackgroundColor(color)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                            backgroundColor === color
                              ? "border-white/50 scale-110"
                              : "border-white/20 hover:border-white/40"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Image Background */}
              {backgroundType === "image" && (
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon size={16} className="text-white/80" />
                      <h3 className="text-sm font-semibold text-white/80">Upload Custom Image</h3>
                    </div>

                    <div className="space-y-4">
                      {/* File Upload Button */}
                      <div>
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 h-12"
                          variant="outline"
                        >
                          <Upload size={16} className="mr-2" />
                          {uploadingImage ? "Uploading..." : "Choose & Crop Image"}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <p className="text-xs text-white/50 mt-2 text-center">
                          Supports JPEG, PNG, WebP, GIF (max 10MB) • Best: 1080x1920 or higher
                        </p>
                      </div>

                      {/* URL Input */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-gray-900 px-2 text-white/50">or</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-3">
                          <Link size={16} className="text-white/60" />
                          <Input
                            value={backgroundImageUrl}
                            onChange={(e) => setBackgroundImageUrl(e.target.value)}
                            placeholder="https://example.com/background.jpg"
                            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preset Images */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-3">Responsive Presets</label>
                    <div className="grid grid-cols-3 gap-3">
                      {presetImages.map((imageUrl, index) => (
                        <button
                          key={index}
                          onClick={() => setBackgroundImageUrl(imageUrl)}
                          className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            backgroundImageUrl === imageUrl
                              ? "border-white/50 scale-105"
                              : "border-white/20 hover:border-white/40"
                          }`}
                        >
                          <img
                            src={imageUrl || "/placeholder.svg"}
                            alt={`Preset ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-1 right-1 text-xs text-white/80 bg-black/50 px-1 rounded">
                            HD
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-white/40 mt-2">
                      ✨ All presets are optimized for mobile and desktop screens
                    </p>
                  </div>

                  {/* Image Preview */}
                  {backgroundImageUrl && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-white/70 mb-3">Current Background</label>
                      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={backgroundImageUrl || "/placeholder.svg"}
                          alt="Background preview"
                          className="w-full h-full object-cover object-center"
                          onError={() => setBackgroundImageUrl("")}
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            onClick={handleRemoveImage}
                            size="sm"
                            variant="destructive"
                            className="bg-red-500/80 hover:bg-red-500"
                          >
                            <X size={14} className="mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Overlay Opacity */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-3">
                      Dark Overlay: {Math.round(backgroundOverlayOpacity * 100)}%
                    </label>
                    <Slider
                      value={[backgroundOverlayOpacity]}
                      onValueChange={(value) => setBackgroundOverlayOpacity(value[0])}
                      max={0.9}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-white/50 mt-2">
                      <span>No overlay</span>
                      <span>Dark overlay</span>
                    </div>
                    <p className="text-xs text-white/40 mt-2">
                      💡 Adjust overlay to keep text readable over your image
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-white/90 font-semibold py-5 text-base"
            >
              <Save size={16} className="mr-2" />
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Image Cropper Modal */}
      {showCropper && tempImageForCrop && (
        <ImageCropper
          imageUrl={tempImageForCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1} // Square crop for profile pictures
        />
      )}

      {/* Background Image Cropper Modal */}
      {showBackgroundCropper && tempBackgroundForCrop && (
        <ImageCropper
          imageUrl={tempBackgroundForCrop}
          onCropComplete={handleBackgroundCropComplete}
          onCancel={handleBackgroundCropCancel}
          aspectRatio={9 / 16} // Portrait aspect ratio for mobile-first backgrounds
          isBackground={true}
        />
      )}
    </>
  )
});
