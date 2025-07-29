"use client"

import { useState, forwardRef, useImperativeHandle } from "react"
import { motion, Reorder } from "framer-motion"
import { Plus, Save, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Link } from "@/lib/db"

interface LinksEditorProps {
  links: Link[]
  onUpdate: (links: Link[]) => void
}

export const LinksEditor = forwardRef<{ handleSave: () => Promise<void> }, LinksEditorProps>(({ links, onUpdate }, ref) => {
  const [localLinks, setLocalLinks] = useState(links)
  const [isLoading, setIsLoading] = useState(false)

  // handleSave method will be exposed to parent component via useImperativeHandle below

  const addLink = () => {
    const newLink: Link = {
      id: Date.now(), // Temporary ID
      user_id: 1,
      title: "",
      url: "",
      icon_url: "",
      order_index: localLinks.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setLocalLinks([...localLinks, newLink])
  }

  const updateLink = (id: number, field: keyof Link, value: string) => {
    setLocalLinks(localLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const deleteLink = (id: number) => {
    setLocalLinks(localLinks.filter((link) => link.id !== id))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localLinks),
      })

      if (response.ok) {
        const updatedLinks = await response.json()
        onUpdate(updatedLinks)
        setLocalLinks(updatedLinks)
      }
    } catch (error) {
      console.error("Error updating links:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Expose the handleSave method to the parent component
  useImperativeHandle(ref, () => ({
    handleSave
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Social Links</span>
            <Button
              onClick={addLink}
              size="sm"
              variant="outline"
              className="border-border hover:bg-accent bg-transparent"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Reorder.Group axis="y" values={localLinks} onReorder={setLocalLinks} className="space-y-3">
            {localLinks.map((link) => (
              <Reorder.Item key={link.id} value={link} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="text-muted-foreground cursor-grab" />

                  <div className="flex-1 space-y-2">
                    <Input
                      value={link.title}
                      onChange={(e) => updateLink(link.id, "title", e.target.value)}
                      placeholder="Link title"
                      className="bg-input border-border text-foreground"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(link.id, "url", e.target.value)}
                      placeholder="https://example.com"
                      className="bg-input border-border text-foreground"
                    />
                    <Input
                      value={link.icon_url || ""}
                      onChange={(e) => updateLink(link.id, "icon_url", e.target.value)}
                      placeholder="Icon URL (optional)"
                      className="bg-input border-border text-foreground"
                    />
                  </div>

                  <Button
                    onClick={() => deleteLink(link.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {localLinks.length > 0 && (
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save size={16} className="mr-2" />
              {isLoading ? "Saving..." : "Save Links"}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
});
