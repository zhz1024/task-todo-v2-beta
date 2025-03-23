export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  important: boolean
  categoryId: string | null
  dueDate: string | null
  createdAt: string
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface UserSettings {
  primaryColor: string
  compactMode: boolean
  showAnimations: boolean
  defaultView: string
  sidebarCollapsed: boolean
  openaiApiKey: string
  openaiBaseUrl: string
  openaiModel: string
}

