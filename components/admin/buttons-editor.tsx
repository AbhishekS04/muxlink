"use client"

import { useState } from "react"
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

export function ButtonsEditor({ buttons, onUpdate }: ButtonsEditorProps) {
  const [localButtons, setLocalButtons] = useState(buttons)
  const [isLoading, setIsLoading] = useState(false)

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
    setLocalButtons([...localButtons, newButton])
  }

  const updateButton = (id: number, field: keyof ButtonType, value: string) => {
    setLocalButtons(localButtons.map((button) => (button.id === id ? { ...button, [field]: value } : button)))
  }

  const deleteButton = (id: number) => {
    setLocalButtons(localButtons.filter((button) => button.id !== id))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/buttons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localButtons),
      })

      if (response.ok) {
        const updatedButtons = await response.json()
        onUpdate(updatedButtons)
        setLocalButtons(updatedButtons)
      }
    } catch (error) {
      console.error("Error updating buttons:", error)
    } finally {
      setIsLoading(false)
    }
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
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Reorder.Group axis="y" values={localButtons} onReorder={setLocalButtons} className="space-y-3">
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
                    />
                    <Input
                      value={button.url}
                      onChange={(e) => updateButton(button.id, "url", e.target.value)}
                      placeholder="https://example.com"
                      className="bg-input border-border text-foreground"
                    />
                  </div>

                  <Button
                    onClick={() => deleteButton(button.id)}
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

          {localButtons.length > 0 && (
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save size={16} className="mr-2" />
              {isLoading ? "Saving..." : "Save Buttons"}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
