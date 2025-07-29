"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { X, Send, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { modalAnimation, loadingSpinner, successCheckmark } from "@/lib/gsap-animations"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [senderEmail, setSenderEmail] = useState("")
  const [message, setMessage] = useState("Hi Abhishek, I came across your profile and wanted to connect!")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const backdropRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const spinnerRef = useRef<HTMLDivElement>(null)
  const checkmarkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!backdropRef.current || !modalRef.current) return

    if (isOpen) {
      // Enter animation
      modalAnimation.enter(modalRef.current, backdropRef.current)

      // Form fields stagger animation
      const formFields = modalRef.current.querySelectorAll("input, textarea, button")
      gsap.fromTo(
        formFields,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.3, ease: "power2.out" },
      )
    }
  }, [isOpen])

  useEffect(() => {
    if (isSubmitting && spinnerRef.current) {
      loadingSpinner(spinnerRef.current)
    }
  }, [isSubmitting])

  useEffect(() => {
    if (isSubmitted && checkmarkRef.current) {
      successCheckmark(checkmarkRef.current)
    }
  }, [isSubmitted])

  const handleClose = () => {
    if (!backdropRef.current || !modalRef.current) return

    const tl = modalAnimation.exit(modalRef.current, backdropRef.current)
    tl.then(() => {
      onClose()
      // Reset form state when closing
      setError("")
      setIsSubmitted(false)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: senderEmail,
          message,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
        setIsSubmitting(false)

        // Reset and close after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          setSenderEmail("")
          setMessage("Hi Abhishek, I came across your profile and wanted to connect!")
          handleClose()
        }, 3000)
      } else {
        throw new Error(data.error || "Failed to send message")
      }
    } catch (error) {
      console.error("Contact form error:", error)
      setError(error instanceof Error ? error.message : "Failed to send message. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div ref={backdropRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 xs:p-8 w-full max-w-md mx-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Mail size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Contact Me</h2>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            >
              <X size={18} />
            </Button>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Recipient (non-editable) */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3">To</label>
                <Input
                  value="abhishek23main@gmail.com"
                  disabled
                  className="bg-white/5 border-white/10 text-white/60 cursor-not-allowed"
                />
              </div>

              {/* Sender Email */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3">Your Email</label>
                <Input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={isSubmitting}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 disabled:opacity-50"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  disabled={isSubmitting}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 resize-none disabled:opacity-50"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-white/90 font-semibold py-3 transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div ref={spinnerRef} className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full" />
                    Sending...
                  </div>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div
                ref={checkmarkRef}
                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <div className="text-green-400 text-2xl">✓</div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Message Sent!</h3>
              <p className="text-white/60 text-sm">Your message has been delivered to Abhishek.</p>
              <p className="text-white/40 text-xs mt-2">You'll receive a reply at {senderEmail}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
