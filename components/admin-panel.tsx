"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LogOut, Settings } from "lucide-react"
import type { User, Link, Button } from "@/lib/db"
import { ProfileEditor } from "@/components/admin/profile-editor"
import { ButtonsEditor } from "@/components/admin/buttons-editor"
import { LinksEditor } from "@/components/admin/links-editor"
import { LivePreview } from "@/components/admin/live-preview"
import { Button as UIButton } from "@/components/ui/button"

interface AdminPanelProps {
  initialUser: User | null
  initialButtons: Button[]
  initialLinks: Link[]
}

export function AdminPanel({ initialUser, initialButtons, initialLinks }: AdminPanelProps) {
  const [user, setUser] = useState(initialUser)
  const [buttons, setButtons] = useState(initialButtons)
  const [links, setLinks] = useState(initialLinks)
  const [refreshing, setRefreshing] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  // Fetch latest data from the DB
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const res = await fetch("/api/admin/data")
      if (res.ok) {
        const { user, buttons, links } = await res.json()
        setUser(user)
        setButtons(buttons)
        setLinks(links)
      } else {
        alert("Failed to refresh data from the database.")
      }
    } catch (err) {
      alert("Error refreshing data. Check your connection.")
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black">
      {/* Admin Panel */}
      <div className="w-full lg:w-1/2 p-6 xs:p-8 border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-8 xs:mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Settings size={20} className="text-white" />
              </div>
              <h1 className="text-2xl xs:text-3xl font-semibold text-white tracking-tight">Admin Panel</h1>
            </div>
            <div className="flex gap-2">
              <UIButton
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="border-white/20 hover:bg-white/10 bg-transparent text-white/80 hover:text-white font-semibold"
                disabled={refreshing}
              >
                {refreshing ? "Refreshing..." : "Refresh Data"}
              </UIButton>
              <UIButton
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-white/20 hover:bg-white/10 bg-transparent text-white/80 hover:text-white font-semibold"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </UIButton>
            </div>
          </div>

          <div className="space-y-8 xs:space-y-12">
            <ProfileEditor user={user} onUpdate={setUser} />
            <ButtonsEditor buttons={buttons} onUpdate={setButtons} />
            <LinksEditor links={links} onUpdate={setLinks} />
          </div>
        </motion.div>
      </div>

      {/* Live Preview */}
      <div className="w-full lg:w-1/2 bg-gray-900/20 min-h-[50vh] lg:min-h-screen">
        <LivePreview user={user} buttons={buttons} links={links} />
      </div>
    </div>
  )
}
