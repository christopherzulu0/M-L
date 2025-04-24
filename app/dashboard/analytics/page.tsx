"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  Download,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Users,
  Home,
  Calendar,
} from "lucide-react"
import AgentsAnalytics from "@/app/dashboard/AgentsAnalytics"

export default function AnalyticsPage() {
  const [analyticsView, setAnalyticsView] = useState("overview")

  // Sample data for charts
  const monthlyData = [
    { name: "Jan", sales: 1200000, listings: 24, inquiries: 65 },
    { name: "Feb", sales: 900000, listings: 18, inquiries: 59 },
    { name: "Mar", sales: 1600000, listings: 32, inquiries: 75 },
    { name: "Apr", sales: 1700000, listings: 28, inquiries: 87 },
    { name: "May", sales: 1400000, listings: 22, inquiries: 63 },
    { name: "Jun", sales: 2100000, listings: 36, inquiries: 92 },
    { name: "Jul", sales: 1900000, listings: 30, inquiries: 84 },
    { name: "Aug", sales: 2300000, listings: 42, inquiries: 97 },
  ]

  const propertyTypeData = [
    { name: "Apartments", value: 35 },
    { name: "Houses", value: 40 },
    { name: "Villas", value: 15 },
    { name: "Land", value: 10 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Track performance metrics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={analyticsView} onValueChange={setAnalyticsView} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>
      </Tabs>

      {analyticsView === "overview" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <h3 className="text-3xl font-bold">ZMW 12.4M</h3>
                  <p className="mt-1 text-sm text-green-600">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      8% from last month
                    </span>
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3 text-green-600">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                  <h3 className="text-3xl font-bold">248</h3>
                  <p className="mt-1 text-sm text-green-600">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      12% from last month
                    </span>
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                  <Home className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                  <h3 className="text-3xl font-bold">24</h3>
                  <p className="mt-1 text-sm text-green-600">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      4% from last month
                    </span>
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <h3 className="text-3xl font-bold">18.2%</h3>
                  <p className="mt-1 text-sm text-green-600">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      2.1% from last month
                    </span>
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-3 text-orange-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {analyticsView === "overview" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "ZMW",
                        minimumFractionDigits: 0,
                      }).format(value)
                    }
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Property Distribution</CardTitle>
              <CardDescription>By property type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {analyticsView === "sales" && (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>Monthly sales and listings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#82ca9d"
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(value)
                    }
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="listings" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {analyticsView === "properties" && (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Metrics</CardTitle>
              <CardDescription>Listings and inquiries over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={monthlyData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="listings"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                  <Area
                    type="monotone"
                    dataKey="inquiries"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {analyticsView === "agents" && (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance</CardTitle>
              <CardDescription>Comparing key metrics across agents</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentsAnalytics />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}