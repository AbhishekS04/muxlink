"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: "success",
          message: data.message || "Message sent successfully!",
        })
        setFormData({ name: "", email: "", message: "" })

        // Close modal after 2 seconds
        setTimeout(() => {
          setIsOpen(false)
          setStatus({ type: null, message: "" })
        }, 2000)
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to send message",
        })
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Network error. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
        >
          <Mail className="w-4 h-4 mr-2" />
          Contact Me
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Send me a message</DialogTitle>
          <DialogDescription className="text-gray-300">I'll get back to you as soon as possible.</DialogDescription>
        </DialogHeader>

        {status.type && (
          <div
            className={`flex items-center gap-2 p-3 rounded-md ${
              status.type === "success"
                ? "bg-green-900/50 text-green-300 border border-green-700"
                : "bg-red-900/50 text-red-300 border border-red-700"
            }`}
          >
            {status.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-sm">{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              required
              disabled={isLoading}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
              disabled={isLoading}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your message..."
              required
              disabled={isLoading}
              rows={4}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-white/50 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || status.type === "success"}
            className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Sending...
              </>
            ) : status.type === "success" ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Sent!
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
