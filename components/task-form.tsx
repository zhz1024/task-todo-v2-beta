"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task, Category } from "@/lib/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface TaskFormProps {
  task?: Task
  onSubmit: (task: Task) => void
  onCancel: () => void
  categories: Category[]
  initialDate?: Date | null
}

export default function TaskForm({ task, onSubmit, onCancel, categories, initialDate }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [categoryId, setCategoryId] = useState(task?.categoryId || "")
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : initialDate || undefined,
  )
  const [important, setImportant] = useState(task?.important || false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    const newTask: Task = {
      id: task?.id || crypto.randomUUID(),
      title,
      description,
      categoryId: categoryId || null,
      completed: task?.completed || false,
      important,
      dueDate: dueDate ? dueDate.toISOString() : null,
      createdAt: task?.createdAt || new Date().toISOString(),
    }

    onSubmit(newTask)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="任务标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="text-lg font-medium"
          autoFocus
        />

        <Textarea
          placeholder="描述（可选）"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">分类</label>
          <Select value={categoryId || "none"} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">无分类</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">截止日期</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP", { locale: zhCN }) : "设置截止日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dueDate} onSelect={setDueDate} locale={zhCN} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "gap-1 rounded-full",
            important &&
              "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-500",
          )}
          onClick={() => setImportant(!important)}
        >
          {important && <Check className="h-3.5 w-3.5" />}
          标记为重要
        </Button>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">{task ? "更新任务" : "添加任务"}</Button>
      </div>
    </form>
  )
}

