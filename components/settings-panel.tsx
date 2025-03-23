"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserSettings } from "@/lib/types"
import { cn } from "@/lib/utils"

// Import ColorPicker
import ColorPicker from "@/components/color-picker"

interface SettingsPanelProps {
  settings: UserSettings
  onUpdateSettings: (settings: UserSettings) => void
  onCancel: () => void
}

export default function SettingsPanel({ settings, onUpdateSettings, onCancel }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>({ ...settings })
  const [customModel, setCustomModel] = useState("")
  const [isCustomModel, setIsCustomModel] = useState(
    ![
      "gpt-3.5-turbo",
      "gpt-4",
      "gpt-4-turbo",
      "gpt-4o",
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307",
    ].includes(settings.openaiModel),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 如果是自定义模型，使用自定义输入的值
    if (isCustomModel && customModel) {
      onUpdateSettings({
        ...localSettings,
        openaiModel: customModel,
      })
    } else {
      onUpdateSettings(localSettings)
    }
  }

  // Add this helper function at the beginning of the component
  const getColorForTheme = (theme: string): string => {
    switch (theme) {
      case "blue":
        return "#3b82f6"
      case "purple":
        return "#8b5cf6"
      case "green":
        return "#22c55e"
      case "rose":
        return "#e11d48"
      case "amber":
        return "#f59e0b"
      default:
        return "#3b82f6"
    }
  }

  // 初始化自定义模型值
  React.useEffect(() => {
    if (isCustomModel) {
      setCustomModel(settings.openaiModel)
    }
  }, [isCustomModel, settings.openaiModel])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="appearance">外观</TabsTrigger>
          <TabsTrigger value="preferences">偏好</TabsTrigger>
          <TabsTrigger value="ai">AI 助手</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <div>
            <Label className="text-base">主题颜色</Label>
            <div className="flex flex-col gap-4 mt-2">
              <RadioGroup
                value={localSettings.primaryColor}
                onValueChange={(value) => setLocalSettings({ ...localSettings, primaryColor: value })}
                className="grid grid-cols-5 gap-2"
              >
                <div>
                  <RadioGroupItem value="blue" id="blue" className="sr-only peer" />
                  <Label
                    htmlFor="blue"
                    className={cn(
                      "flex h-9 w-9 rounded-full bg-blue-600 cursor-pointer border-2 border-transparent peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                      localSettings.primaryColor === "blue" && "border-border",
                    )}
                  />
                </div>
                <div>
                  <RadioGroupItem value="purple" id="purple" className="sr-only peer" />
                  <Label
                    htmlFor="purple"
                    className={cn(
                      "flex h-9 w-9 rounded-full bg-purple-600 cursor-pointer border-2 border-transparent peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                      localSettings.primaryColor === "purple" && "border-border",
                    )}
                  />
                </div>
                <div>
                  <RadioGroupItem value="green" id="green" className="sr-only peer" />
                  <Label
                    htmlFor="green"
                    className={cn(
                      "flex h-9 w-9 rounded-full bg-green-600 cursor-pointer border-2 border-transparent peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                      localSettings.primaryColor === "green" && "border-border",
                    )}
                  />
                </div>
                <div>
                  <RadioGroupItem value="rose" id="rose" className="sr-only peer" />
                  <Label
                    htmlFor="rose"
                    className={cn(
                      "flex h-9 w-9 rounded-full bg-rose-600 cursor-pointer border-2 border-transparent peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                      localSettings.primaryColor === "rose" && "border-border",
                    )}
                  />
                </div>
                <div>
                  <RadioGroupItem value="amber" id="amber" className="sr-only peer" />
                  <Label
                    htmlFor="amber"
                    className={cn(
                      "flex h-9 w-9 rounded-full bg-amber-600 cursor-pointer border-2 border-transparent peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                      localSettings.primaryColor === "amber" && "border-border",
                    )}
                  />
                </div>
              </RadioGroup>

              <div className="flex items-center gap-2">
                <Label htmlFor="custom" className="text-sm mr-2">
                  自定义颜色:
                </Label>
                <ColorPicker
                  color={
                    ["blue", "purple", "green", "rose", "amber"].includes(localSettings.primaryColor)
                      ? getColorForTheme(localSettings.primaryColor)
                      : localSettings.primaryColor
                  }
                  onChange={(color) => setLocalSettings({ ...localSettings, primaryColor: color })}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-mode" className="cursor-pointer">
                紧凑模式
              </Label>
              <Switch
                id="compact-mode"
                checked={localSettings.compactMode}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, compactMode: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-animations" className="cursor-pointer">
                显示动画
              </Label>
              <Switch
                id="show-animations"
                checked={localSettings.showAnimations}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, showAnimations: checked })}
              />
            </div>

            <div>
              <Label className="text-base">默认视图</Label>
              <RadioGroup
                value={localSettings.defaultView}
                onValueChange={(value) => setLocalSettings({ ...localSettings, defaultView: value })}
                className="grid grid-cols-3 gap-2 mt-2"
              >
                <div>
                  <RadioGroupItem value="tasks" id="tasks" className="sr-only peer" />
                  <Label
                    htmlFor="tasks"
                    className={cn(
                      "flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                      localSettings.defaultView === "tasks" && "border-primary bg-primary/10",
                    )}
                  >
                    任务
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="calendar" id="calendar" className="sr-only peer" />
                  <Label
                    htmlFor="calendar"
                    className={cn(
                      "flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                      localSettings.defaultView === "calendar" && "border-primary bg-primary/10",
                    )}
                  >
                    日历
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="stats" id="stats" className="sr-only peer" />
                  <Label
                    htmlFor="stats"
                    className={cn(
                      "flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                      localSettings.defaultView === "stats" && "border-primary bg-primary/10",
                    )}
                  >
                    统计
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="openai-api-key">OpenAI API 密钥</Label>
              <Input
                id="openai-api-key"
                type="password"
                placeholder="sk-..."
                value={localSettings.openaiApiKey}
                onChange={(e) => setLocalSettings({ ...localSettings, openaiApiKey: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">您的 API 密钥仅存储在本地浏览器中，不会发送到任何服务器。</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openai-base-url">API 基础地址（可选）</Label>
              <Input
                id="openai-base-url"
                placeholder="https://api.openai.com/v1"
                value={localSettings.openaiBaseUrl}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, openaiBaseUrl: e.target.value || "https://api.openai.com/v1" })
                }
              />
              <p className="text-xs text-muted-foreground">如果您使用代理或自定义端点，可以在此处更改基础 URL。</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openai-model">AI 模型</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <RadioGroup
                    value={isCustomModel ? "custom" : "preset"}
                    onValueChange={(value) => setIsCustomModel(value === "custom")}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="preset" id="preset-model" />
                      <Label htmlFor="preset-model">预设模型</Label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="custom" id="custom-model" />
                      <Label htmlFor="custom-model">自定义模型</Label>
                    </div>
                  </RadioGroup>
                </div>

                {isCustomModel ? (
                  <Input
                    placeholder="输入自定义模型名称"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                  />
                ) : (
                  <Select
                    value={localSettings.openaiModel}
                    onValueChange={(value) => setLocalSettings({ ...localSettings, openaiModel: value })}
                  >
                    <SelectTrigger id="openai-model">
                      <SelectValue placeholder="选择模型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <p className="text-xs text-muted-foreground">选择要使用的 AI 模型。不同模型有不同的能力和价格。</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">保存设置</Button>
      </div>
    </form>
  )
}

