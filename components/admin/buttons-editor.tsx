"use client"

import { useState, forwardRef, useImperativeHandle } from "react"
import { motion, Reorder } from "framer-motion"
import { Plus, Save, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Button as ButtonType } from "@/lib/db"

interface ButtonsEditorProps {
  buttons: ButtonType[]
  onUpdate: (buttons: ButtonType[]) => void
}

export const ButtonsEditor = forwardRef<{ saveToDB: (buttons: ButtonType[]) => Promise<void> }, ButtonsEditorProps>(({ buttons, onUpdate }, ref) => {
  const [localButtons, setLocalButtons] = useState(buttons)
  const [isLoading, setIsLoading] = useState(false)

  // saveToDB method will be exposed to parent component via useImperativeHandle below

  // Auto-save to DB on every change
  const saveToDB = async (updatedButtons: ButtonType[]) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/buttons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedButtons),
      })
      if (response.ok) {
        const newButtons = await response.json()
        onUpdate(newButtons)
        setLocalButtons(newButtons)
      }
    } catch (error) {
      console.error("Error auto-saving buttons:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Expose the saveToDB method to the parent component
  useImperativeHandle(ref, () => ({
    saveToDB
  }))

  const addButton = () => {
    const newButton: ButtonType = {
      id: Date.now(), // Temporary ID
      user_id: 1,
      label: "",
      url: "",
      order_index: localButtons.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const updated = [...localButtons, newButton]
    setLocalButtons(updated)
    saveToDB(updated)
  }

  const updateButton = (id: number, field: keyof ButtonType, value: string) => {
    const updated = localButtons.map((button) => (button.id === id ? { ...button, [field]: value } : button))
    setLocalButtons(updated)
    saveToDB(updated)
  }

  const deleteButton = (id: number) => {
    const updated = localButtons.filter((button) => button.id !== id)
    setLocalButtons(updated)
    saveToDB(updated)
  }

  // Auto-save on reorder
  const handleReorder = (newOrder: ButtonType[]) => {
    setLocalButtons(newOrder)
    saveToDB(newOrder)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>CTA Buttons</span>
            <Button
              onClick={addButton}
              size="sm"
              variant="outline"
              className="border-border hover:bg-accent bg-transparent"
              disabled={isLoading}
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Reorder.Group axis="y" values={localButtons} onReorder={handleReorder} className="space-y-3">
            {localButtons.map((button) => (
              <Reorder.Item key={button.id} value={button} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="text-muted-foreground cursor-grab" />

                  <div className="flex-1 space-y-2">
                    <Input
                      value={button.label}
                      onChange={(e) => updateButton(button.id, "label", e.target.value)}
                      placeholder="Button label"
                      className="bg-input border-border text-foreground"
                      disabled={isLoading}
                    />
                    <Input
                      value={button.url}
                      onChange={(e) => updateButton(button.id, "url", e.target.value)}
                      placeholder="https://example.com"
                      className="bg-input border-border text-foreground"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    onClick={() => deleteButton(button.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center"
                    disabled={isLoading}
                    aria-label="Delete button"
                  >
                    <Trash2 size={16} className="text-red-600 group-hover:text-white transition-colors" />
                  </Button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </CardContent>
      </Card>
    </motion.div>
  )
});
