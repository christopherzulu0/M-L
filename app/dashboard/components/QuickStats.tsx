"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Home,
  DollarSign,
  Users,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { useEffect, useState } from "react"

interface StatsData {
  totalProperties: number
  propertiesGrowth: number
  totalRevenue: string
  revenueGrowth: number
  activeAgents: number
  agentsGrowth: number
  newInquiries: number
  inquiriesGrowth: number
}

export default function QuickStats() {
  const [stats, setStats] = useState<StatsData>({
    totalProperties: 0,
    propertiesGrowth: 0,
    totalRevenue: 'ZMW 0',
    revenueGrowth: 0,
    activeAgents: 0,
    agentsGrowth: 0,
    newInquiries: 0,
    inquiriesGrowth: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/overviews/stats')

        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }

        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden border-0 shadow-md bg-white dark:bg-gray-800">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
                </div>
                <div className="rounded-full p-3 bg-gray-200 dark:bg-gray-700 animate-pulse h-12 w-12"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error loading statistics: {error}</p>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties.toString(),
      change: `${stats.propertiesGrowth >= 0 ? "+" : ""}${stats.propertiesGrowth.toFixed(1)}%`,
      trend: stats.propertiesGrowth >= 0 ? "up" : "down",
      icon: <Home className="h-5 w-5" />,
      color: "from-blue-600 to-indigo-600",
      lightColor: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      title: "Total Revenue",
      value: stats.totalRevenue,
      change: `${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth.toFixed(1)}%`,
      trend: stats.revenueGrowth >= 0 ? "up" : "down",
      icon: <DollarSign className="h-5 w-5" />,
      color: "from-emerald-600 to-teal-600",
      lightColor: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    },
    {
      title: "Active Agents",
      value: stats.activeAgents.toString(),
      change: `${stats.agentsGrowth >= 0 ? "+" : ""}${stats.agentsGrowth.toFixed(1)}%`,
      trend: stats.agentsGrowth >= 0 ? "up" : "down",
      icon: <Users className="h-5 w-5" />,
      color: "from-purple-600 to-violet-600",
      lightColor: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      title: "New Inquiries",
      value: stats.newInquiries.toString(),
      change: `${stats.inquiriesGrowth >= 0 ? "+" : ""}${stats.inquiriesGrowth.toFixed(1)}%`,
      trend: stats.inquiriesGrowth >= 0 ? "up" : "down",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "from-amber-600 to-orange-600",
      lightColor: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p
                  className={`mt-1 text-xs md:text-sm ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"}`}
                >
                  <span className="flex items-center">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {stat.change} from last month
                  </span>
                </p>
              </div>
              <div className={`rounded-full ${stat.lightColor} p-3`}>{stat.icon}</div>
            </div>
            <div className="mt-4">
              <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                  style={{ width: stat.trend === "up" ? "70%" : "40%" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
