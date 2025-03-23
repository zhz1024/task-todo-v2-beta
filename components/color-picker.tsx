"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  className?: string
}

const presetColors = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#22c55e", // green
  "#ef4444", // red
  "#f59e0b", // amber
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#14b8a6", // teal
  "#f97316", // orange
  "#6366f1", // indigo
]

export default function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(color)
  const [customColor, setCustomColor] = useState(color)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setSelectedColor(color)
    setCustomColor(color)
  }, [color])

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor)
    onChange(newColor)
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setCustomColor(newColor)
    setSelectedColor(newColor)
    onChange(newColor)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn("h-8 w-8 rounded-full border border-border flex items-center justify-center", className)}
          style={{ backgroundColor: selectedColor }}
          aria-label="选择颜色"
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  "border border-border hover:scale-110 transition-transform",
                )}
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  handleColorChange(presetColor)
                  setOpen(false)
                }}
                aria-label={`选择颜色 ${presetColor}`}
              >
                {selectedColor.toLowerCase() === presetColor.toLowerCase() && (
                  <Check className="h-4 w-4 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label htmlFor="custom-color" className="text-xs text-muted-foreground mb-1 block">
                自定义颜色
              </label>
              <input
                id="custom-color"
                type="text"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-full h-8 px-2 rounded-md border border-border bg-background text-sm"
                placeholder="#RRGGBB"
              />
            </div>
            <div>
              <label htmlFor="color-picker" className="text-xs text-muted-foreground mb-1 block">
                选择器
              </label>
              <input
                id="color-picker"
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-8 h-8 p-0 border border-border rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

