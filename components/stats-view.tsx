"use client"

import { useMemo } from "react"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Task, Category } from "@/lib/types"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StatsViewProps {
  tasks: Task[]
  categories: Category[]
}

export default function StatsView({ tasks, categories }: StatsViewProps) {
  // 计算任务完成率
  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter((task) => task.completed).length
    return Math.round((completedTasks / tasks.length) * 100)
  }, [tasks])

  // 按分类统计任务
  const tasksByCategory = useMemo(() => {
    const result = categories.map((category) => {
      const categoryTasks = tasks.filter((task) => task.categoryId === category.id)
      const completedTasks = categoryTasks.filter((task) => task.completed).length

      return {
        name: category.name,
        value: categoryTasks.length,
        completed: completedTasks,
        color: category.color,
      }
    })

    // 添加无分类的任务
    const uncategorizedTasks = tasks.filter((task) => !task.categoryId)
    if (uncategorizedTasks.length > 0) {
      result.push({
        name: "未分类",
        value: uncategorizedTasks.length,
        completed: uncategorizedTasks.filter((task) => task.completed).length,
        color: "#94a3b8", // slate-400
      })
    }

    return result.filter((item) => item.value > 0)
  }, [tasks, categories])

  // 按周统计任务
  const tasksByWeekday = useMemo(() => {
    const weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    const result = weekdays.map((day, index) => {
      const dayTasks = tasks.filter((task) => {
        if (!task.dueDate) return false
        const date = new Date(task.dueDate)
        // 注意：getDay() 返回 0-6，其中 0 是周日
        const dayOfWeek = date.getDay()
        // 转换为 1-7，其中 1 是周一，7 是周日
        const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek
        return adjustedDay === index + 1
      })

      return {
        name: day,
        value: dayTasks.length,
        completed: dayTasks.filter((task) => task.completed).length,
      }
    })

    return result
  }, [tasks])

  // 按月统计任务
  const tasksByMonth = useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const months = []

    // 生成过去6个月的数据
    for (let i = 5; i >= 0; i--) {
      const month = now.getMonth() - i
      const year = currentYear + Math.floor(month / 12)
      const adjustedMonth = ((month % 12) + 12) % 12 // 处理负数月份

      const startDate = new Date(year, adjustedMonth, 1)
      const endDate = new Date(year, adjustedMonth + 1, 0)

      const monthTasks = tasks.filter((task) => {
        if (!task.createdAt) return false
        const date = new Date(task.createdAt)
        return date >= startDate && date <= endDate
      })

      months.push({
        name: startDate.toLocaleDateString("zh-CN", { month: "short" }),
        value: monthTasks.length,
        completed: monthTasks.filter((task) => task.completed).length,
      })
    }

    return months
  }, [tasks])

  // 计算重要任务的完成情况
  const importantTasksStats = useMemo(() => {
    const importantTasks = tasks.filter((task) => task.important)
    const completedImportantTasks = importantTasks.filter((task) => task.completed)

    return {
      total: importantTasks.length,
      completed: completedImportantTasks.length,
      rate: importantTasks.length > 0 ? Math.round((completedImportantTasks.length / importantTasks.length) * 100) : 0,
    }
  }, [tasks])

  // 计算逾期任务
  const overdueTasks = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return tasks.filter((task) => {
      if (!task.dueDate || task.completed) return false
      const dueDate = new Date(task.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate < today
    }).length
  }, [tasks])

  // 自定义工具提示
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-2 border border-border rounded-md shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">总数: {payload[0].value}</p>
          <p className="text-sm">已完成: {payload[0].payload.completed}</p>
          <p className="text-sm">
            完成率: {payload[0].value > 0 ? Math.round((payload[0].payload.completed / payload[0].value) * 100) : 0}%
          </p>
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{completionRate}%</CardTitle>
            <CardDescription>总体完成率</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${completionRate}%` }} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              共 {tasks.length} 个任务，已完成 {tasks.filter((task) => task.completed).length} 个
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{importantTasksStats.rate}%</CardTitle>
            <CardDescription>重要任务完成率</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${importantTasksStats.rate}%` }} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              共 {importantTasksStats.total} 个重要任务，已完成 {importantTasksStats.completed} 个
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{overdueTasks}</CardTitle>
            <CardDescription>逾期任务</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-destructive rounded-full"
                style={{ width: `${tasks.length > 0 ? (overdueTasks / tasks.length) * 100 : 0}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {overdueTasks > 0 ? `有 ${overdueTasks} 个任务已经逾期` : "没有逾期的任务"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="category">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="category">按分类</TabsTrigger>
          <TabsTrigger value="weekday">按星期</TabsTrigger>
          <TabsTrigger value="month">按月份</TabsTrigger>
        </TabsList>

        <TabsContent value="category">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>任务分布</CardTitle>
                <CardDescription>按分类统计的任务数量</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full max-w-full overflow-hidden">
                  {tasksByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tasksByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {tasksByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">没有足够的数据</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>分类完成率</CardTitle>
                <CardDescription>各分类的任务完成情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full max-w-full overflow-auto">
                  {tasksByCategory.length > 0 ? (
                    <ChartContainer
                      config={{
                        value: {
                          label: "任务数",
                          color: "hsl(var(--chart-1))",
                        },
                        completed: {
                          label: "已完成",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={tasksByCategory}
                          margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                          layout="vertical"
                        >
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="value" name="总数" fill="var(--color-value)" radius={[0, 4, 4, 0]}>
                            {tasksByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                          <Bar dataKey="completed" name="已完成" fill="var(--color-completed)" radius={[0, 4, 4, 0]}>
                            {tasksByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`${entry.color}80`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">没有足够的数据</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weekday">
          <Card>
            <CardHeader>
              <CardTitle>每周任务分布</CardTitle>
              <CardDescription>按星期统计的任务数量</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full max-w-full overflow-auto">
                <ChartContainer
                  config={{
                    value: {
                      label: "任务数",
                      color: "hsl(var(--chart-1))",
                    },
                    completed: {
                      label: "已完成",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tasksByWeekday} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" name="总数" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" name="已完成" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month">
          <Card>
            <CardHeader>
              <CardTitle>月度任务趋势</CardTitle>
              <CardDescription>过去6个月的任务创建和完成情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full max-w-full overflow-auto">
                <ChartContainer
                  config={{
                    value: {
                      label: "任务数",
                      color: "hsl(var(--chart-1))",
                    },
                    completed: {
                      label: "已完成",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tasksByMonth} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" name="总数" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" name="已完成" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

