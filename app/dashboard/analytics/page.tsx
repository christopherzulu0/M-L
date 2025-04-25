"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  RadialBarChart,
  RadialBar,
} from "recharts"
import {
  Download,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Users,
  Home,
  Calendar,
  ChevronRight,
  Clock,
  Filter,
  BarChart2,
  LineChartIcon,
  FileText,
  MapPin,
  Star,
  CheckCircle,
} from "lucide-react"
import AgentsAnalytics from "@/app/dashboard/AgentsAnalytics"

export default function AnalyticsPage() {
  const [analyticsView, setAnalyticsView] = useState("overview")
  const [timeRange, setTimeRange] = useState("month")
  const [chartType, setChartType] = useState("bar")

  // Sample data for charts
  const monthlyData = [
    { name: "Jan", sales: 1200000, listings: 24, inquiries: 65, viewings: 42 },
    { name: "Feb", sales: 900000, listings: 18, inquiries: 59, viewings: 36 },
    { name: "Mar", sales: 1600000, listings: 32, inquiries: 75, viewings: 48 },
    { name: "Apr", sales: 1700000, listings: 28, inquiries: 87, viewings: 52 },
    { name: "May", sales: 1400000, listings: 22, inquiries: 63, viewings: 40 },
    { name: "Jun", sales: 2100000, listings: 36, inquiries: 92, viewings: 58 },
    { name: "Jul", sales: 1900000, listings: 30, inquiries: 84, viewings: 54 },
    { name: "Aug", sales: 2300000, listings: 42, inquiries: 97, viewings: 62 },
  ]

  const propertyTypeData = [
    { name: "Apartments", value: 35, color: "#4F46E5" },
    { name: "Houses", value: 40, color: "#10B981" },
    { name: "Villas", value: 15, color: "#8B5CF6" },
    { name: "Land", value: 10, color: "#F59E0B" },
  ]

  const regionData = [
    { name: "Lusaka", value: 35, fill: "#4F46E5" },
    { name: "Copperbelt", value: 30, fill: "#10B981" },
    { name: "Southern", value: 20, fill: "#8B5CF6" },
    { name: "Central", value: 15, fill: "#F59E0B" },
  ]

  const topAgents = [
    {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      sales: "ZMW 4.2M",
      properties: 24,
      rating: 4.8,
      performance: "Excellent",
    },
    {
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=2",
      sales: "ZMW 3.1M",
      properties: 18,
      rating: 4.5,
      performance: "Good",
    },
    {
      name: "Emily Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=3",
      sales: "ZMW 2.8M",
      properties: 12,
      rating: 4.7,
      performance: "Excellent",
    },
  ]

  const topLocations = [
    { name: "Kitwe", count: 305, growth: "+12%", avgPrice: "ZMW 450,000" },
    { name: "Lusaka", count: 258, growth: "+8%", avgPrice: "ZMW 850,000" },
    { name: "Ndola", count: 196, growth: "+15%", avgPrice: "ZMW 420,000" },
    { name: "Livingstone", count: 152, growth: "+5%", avgPrice: "ZMW 650,000" },
  ]

  const conversionMetrics = [
    { name: "Inquiries to Viewings", value: 68 },
    { name: "Viewings to Offers", value: 42 },
    { name: "Offers to Sales", value: 85 },
    { name: "Overall Conversion", value: 18 },
  ]

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return "text-emerald-600 dark:text-emerald-400"
      case "Good":
        return "text-blue-600 dark:text-blue-400"
      case "Average":
        return "text-amber-600 dark:text-amber-400"
      default:
        return "text-red-600 dark:text-red-400"
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Track performance metrics and insights for your real estate business
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <select
                    className="pl-9 pr-4 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm w-full sm:w-auto focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">Last 3 Months</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <h3 className="text-2xl md:text-3xl font-bold mt-1">ZMW 12.4M</h3>
                    <p className="mt-1 text-xs md:text-sm text-emerald-600">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      8% from last month
                    </span>
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 p-3 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600"
                        style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                    <h3 className="text-2xl md:text-3xl font-bold mt-1">248</h3>
                    <p className="mt-1 text-xs md:text-sm text-emerald-600">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      12% from last month
                    </span>
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-50 dark:bg-blue-900/30 p-3 text-blue-600 dark:text-blue-400">
                    <Home className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                        style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                    <h3 className="text-2xl md:text-3xl font-bold mt-1">24</h3>
                    <p className="mt-1 text-xs md:text-sm text-emerald-600">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      4% from last month
                    </span>
                    </p>
                  </div>
                  <div className="rounded-full bg-purple-50 dark:bg-purple-900/30 p-3 text-purple-600 dark:text-purple-400">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-600"
                        style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                    <h3 className="text-2xl md:text-3xl font-bold mt-1">18.2%</h3>
                    <p className="mt-1 text-xs md:text-sm text-emerald-600">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      2.1% from last month
                    </span>
                    </p>
                  </div>
                  <div className="rounded-full bg-amber-50 dark:bg-amber-900/30 p-3 text-amber-600 dark:text-amber-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-600 to-orange-600"
                        style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs */}
          <Tabs value={analyticsView} onValueChange={setAnalyticsView} className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:w-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                  value="sales"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
              >
                Sales
              </TabsTrigger>
              <TabsTrigger
                  value="properties"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
              >
                Properties
              </TabsTrigger>
              <TabsTrigger
                  value="agents"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
              >
                Agents
              </TabsTrigger>
              <TabsTrigger
                  value="locations"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
              >
                Locations
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-2 md:col-span-4 border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-xl font-bold">Revenue Overview</CardTitle>
                      <CardDescription>Monthly sales performance</CardDescription>
                    </div>
                    <Tabs defaultValue={chartType} className="w-[200px]" onValueChange={setChartType}>
                      <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-700">
                        <TabsTrigger
                            value="bar"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                        >
                          <BarChart2 className="h-4 w-4 mr-2" />
                          Bar
                        </TabsTrigger>
                        <TabsTrigger
                            value="line"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                        >
                          <LineChartIcon className="h-4 w-4 mr-2" />
                          Line
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {chartType === "bar" ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                              data={monthlyData}
                              margin={{
                                top: 5,
                                right: 10,
                                left: 10,
                                bottom: 5,
                              }}
                          >
                            <defs>
                              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.2} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: "#e0e0e0" }}
                            />
                            <YAxis
                                tickFormatter={(value) =>
                                    new Intl.NumberFormat("en-US", {
                                      notation: "compact",
                                      compactDisplay: "short",
                                    }).format(value)
                                }
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: "#e0e0e0" }}
                            />
                            <Tooltip
                                formatter={(value) =>
                                    new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: "ZMW",
                                      minimumFractionDigits: 0,
                                    }).format(value as number)
                                }
                                contentStyle={{
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                  border: "none",
                                }}
                            />
                            <Legend wrapperStyle={{ paddingTop: 10 }} />
                            <Bar
                                dataKey="sales"
                                name="Sales Revenue"
                                fill="url(#colorSales)"
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                                animationDuration={1500}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart
                              data={monthlyData}
                              margin={{
                                top: 5,
                                right: 10,
                                left: 10,
                                bottom: 5,
                              }}
                          >
                            <defs>
                              <linearGradient id="colorSalesLine" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: "#e0e0e0" }}
                            />
                            <YAxis
                                tickFormatter={(value) =>
                                    new Intl.NumberFormat("en-US", {
                                      notation: "compact",
                                      compactDisplay: "short",
                                    }).format(value)
                                }
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: "#e0e0e0" }}
                            />
                            <Tooltip
                                formatter={(value) =>
                                    new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: "ZMW",
                                      minimumFractionDigits: 0,
                                    }).format(value as number)
                                }
                                contentStyle={{
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                  border: "none",
                                }}
                            />
                            <Legend wrapperStyle={{ paddingTop: 10 }} />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                name="Sales Revenue"
                                stroke="#4F46E5"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: "#4F46E5" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 border-t flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs text-muted-foreground">+18.5% growth</span>
                      </div>
                      <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Updated 1h ago</span>
                      </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    >
                      View detailed report
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="col-span-2 md:col-span-3 border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl font-bold">Property Distribution</CardTitle>
                        <CardDescription>By property type</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs gap-1">
                        <Filter className="h-3 w-3" />
                        Filter
                      </Button>
                    </div>
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
                              <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [`${value}%`, name]}
                            contentStyle={{
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              border: "none",
                            }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Based on <span className="font-medium">248</span> properties
                    </div>
                    <Button variant="ghost" size="sm" className="text-indigo-600">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Conversion Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {conversionMetrics.map((metric) => (
                          <div key={metric.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{metric.name}</span>
                              <span className="font-semibold">{metric.value}%</span>
                            </div>
                            <Progress
                                value={metric.value}
                                className="h-2"
                                style={
                                  {
                                    backgroundColor: "#f3f4f6",
                                    "--progress-background":
                                        metric.name === "Overall Conversion"
                                            ? "linear-gradient(to right, #4F46E5, #8B5CF6)"
                                            : undefined,
                                  } as React.CSSProperties
                                }
                            />
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Top Locations</CardTitle>
                    <CardDescription>Highest performing areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topLocations.map((location) => (
                          <div
                              key={location.name}
                              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <MapPin className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">{location.name}</p>
                                <p className="text-xs text-muted-foreground">{location.count} properties</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-indigo-600 dark:text-indigo-400">{location.avgPrice}</p>
                              <p className="text-xs text-emerald-600 flex items-center justify-end">
                                <ArrowUpRight className="mr-1 h-3 w-3" />
                                {location.growth}
                              </p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Top Agents</CardTitle>
                    <CardDescription>Best performing agents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topAgents.map((agent) => (
                          <div
                              key={agent.name}
                              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{agent.name}</p>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  <span className="text-xs">{agent.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-indigo-600 dark:text-indigo-400">{agent.sales}</p>
                              <p className={`text-xs ${getPerformanceColor(agent.performance)}`}>{agent.performance}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Need deeper insights into your real estate business?</h3>
                      <p className="text-indigo-100">Generate custom reports tailored to your specific needs.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" className="border border-white/20 text-white hover:bg-white/10">
                        <FileText className="mr-2 h-4 w-4" />
                        Learn more
                      </Button>
                      <Button className="bg-white text-indigo-700 hover:bg-indigo-100">
                        <Download className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sales Tab Content */}
            <TabsContent value="sales" className="mt-6 space-y-6">
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-bold">Sales Performance</CardTitle>
                      <CardDescription>Monthly sales and listings</CardDescription>
                    </div>
                    <Tabs defaultValue="line" className="w-[200px]">
                      <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-700">
                        <TabsTrigger
                            value="line"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                        >
                          <LineChartIcon className="h-4 w-4 mr-2" />
                          Line
                        </TabsTrigger>
                        <TabsTrigger
                            value="area"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                        >
                          <BarChart2 className="h-4 w-4 mr-2" />
                          Area
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
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
                      <defs>
                        <linearGradient id="colorSalesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e0e0e0" }} />
                      <YAxis
                          yAxisId="left"
                          orientation="left"
                          stroke="#8884d8"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: "#e0e0e0" }}
                      />
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
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: "#e0e0e0" }}
                      />
                      <Tooltip
                          formatter={(value, name) => {
                            if (name === "sales") {
                              return [
                                new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "ZMW",
                                  minimumFractionDigits: 0,
                                }).format(value as number),
                                "Sales Revenue",
                              ]
                            }
                            return [value, name]
                          }}
                          contentStyle={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            border: "none",
                          }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="sales"
                          name="Sales Revenue"
                          stroke="#4F46E5"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6, strokeWidth: 0, fill: "#4F46E5" }}
                      />
                      <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="listings"
                          name="New Listings"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ r: 4, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                      <span className="text-xs text-muted-foreground">Sales Revenue</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-muted-foreground">New Listings</span>
                    </div>
                  </div>
                  <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    Download Report
                    <Download className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Sales by Property Type</CardTitle>
                    <CardDescription>Distribution of sales revenue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="10%"
                          outerRadius="80%"
                          barSize={20}
                          data={propertyTypeData}
                      >
                        <RadialBar label={{ position: "insideStart", fill: "#fff" }} background dataKey="value" />
                        <Legend
                            iconSize={10}
                            layout="vertical"
                            verticalAlign="middle"
                            wrapperStyle={{ right: 0, top: 0, bottom: 0 }}
                        />
                        <Tooltip
                            formatter={(value) => [`${value}%`, "Percentage"]}
                            contentStyle={{
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              border: "none",
                            }}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Sales by Region</CardTitle>
                    <CardDescription>Geographic distribution of sales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                          data={regionData}
                          layout="vertical"
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" scale="band" width={100} />
                        <Tooltip
                            formatter={(value) => [`${value}%`, "Percentage"]}
                            contentStyle={{
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              border: "none",
                            }}
                        />
                        <Legend />
                        <Bar dataKey="value" name="Sales Percentage" radius={[0, 4, 4, 0]}>
                          {regionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Properties Tab Content */}
            <TabsContent value="properties" className="mt-6 space-y-6">
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-bold">Property Metrics</CardTitle>
                      <CardDescription>Listings and inquiries over time</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </div>
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
                      <defs>
                        <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorViewings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e0e0e0" }} />
                      <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e0e0e0" }} />
                      <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            border: "none",
                          }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Area
                          type="monotone"
                          dataKey="listings"
                          name="New Listings"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorListings)"
                      />
                      <Area
                          type="monotone"
                          dataKey="inquiries"
                          name="Inquiries"
                          stroke="#82ca9d"
                          fillOpacity={1}
                          fill="url(#colorInquiries)"
                      />
                      <Area
                          type="monotone"
                          dataKey="viewings"
                          name="Viewings"
                          stroke="#ffc658"
                          fillOpacity={1}
                          fill="url(#colorViewings)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Updated 2h ago</span>
                    </div>
                  </div>
                  <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    View detailed report
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Property Types</CardTitle>
                    <CardDescription>Distribution by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      {propertyTypeData.map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="font-medium">{item.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{item.value}%</span>
                              </div>
                            </div>
                            <Progress
                                value={item.value}
                                className="h-2"
                                style={{
                                  backgroundColor: "#f3f4f6",
                                }}
                            >
                              <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${item.value}%`,
                                    backgroundColor: item.color,
                                  }}
                              ></div>
                            </Progress>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Property Status</CardTitle>
                    <CardDescription>Current listing status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-center">
                        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">156</div>
                        <div className="text-sm text-muted-foreground mt-1">For Sale</div>
                      </div>
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-center">
                        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">92</div>
                        <div className="text-sm text-muted-foreground mt-1">For Rent</div>
                      </div>
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-center">
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">38</div>
                        <div className="text-sm text-muted-foreground mt-1">Pending</div>
                      </div>
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">24</div>
                        <div className="text-sm text-muted-foreground mt-1">New This Week</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-indigo-100 p-2 text-indigo-600">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Trending Category</p>
                            <p className="text-xs text-muted-foreground">Apartments +24% this month</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Agents Tab Content */}
            <TabsContent value="agents" className="mt-6 space-y-6">
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-bold">Agent Performance</CardTitle>
                      <CardDescription>Comparing key metrics across agents</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      This Month
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AgentsAnalytics />
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-muted-foreground">+12.5% growth</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Updated 2h ago</span>
                    </div>
                  </div>
                  <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    View detailed report
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <div className="grid gap-6 md:grid-cols-3">
                {topAgents.map((agent, index) => (
                    <Card key={index} className="border-0 shadow-lg bg-white dark:bg-gray-800">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-16 w-16 border-4 border-white dark:border-gray-800 shadow-md">
                            <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                            <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold">{agent.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm">{agent.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3 text-center">
                            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{agent.sales}</div>
                            <div className="text-xs text-muted-foreground mt-1">Total Sales</div>
                          </div>
                          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3 text-center">
                            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                              {agent.properties}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">Properties</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="text-sm text-muted-foreground">Performance</div>
                          <Badge
                              variant="outline"
                              className={`${
                                  agent.performance === "Excellent"
                                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200"
                                      : "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200"
                              }`}
                          >
                            {agent.performance}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </TabsContent>

            {/* Locations Tab Content */}
            <TabsContent value="locations" className="mt-6 space-y-6">
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-bold">Location Analytics</CardTitle>
                      <CardDescription>Property distribution by region</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={regionData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e0e0e0" }} />
                      <YAxis
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: "#e0e0e0" }}
                          tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                          formatter={(value) => [`${value}%`, "Percentage"]}
                          contentStyle={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            border: "none",
                          }}
                      />
                      <Legend />
                      <Bar dataKey="value" name="Properties Percentage" radius={[4, 4, 0, 0]} barSize={40}>
                        {regionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Top Performing Locations</CardTitle>
                    <CardDescription>Highest growth areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topLocations.map((location, index) => (
                          <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <MapPin className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">{location.name}</p>
                                <p className="text-xs text-muted-foreground">{location.count} properties</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-indigo-600 dark:text-indigo-400">{location.avgPrice}</p>
                              <p className="text-xs text-emerald-600 flex items-center justify-end">
                                <ArrowUpRight className="mr-1 h-3 w-3" />
                                {location.growth}
                              </p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Location Insights</CardTitle>
                    <CardDescription>Key metrics by region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {regionData.map((region, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: region.fill }}></div>
                                <span className="font-medium">{region.name}</span>
                              </div>
                              <span className="text-sm font-medium">{region.value}%</span>
                            </div>
                            <Progress
                                value={region.value}
                                className="h-2"
                                style={{
                                  backgroundColor: "#f3f4f6",
                                }}
                            >
                              <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${region.value}%`,
                                    backgroundColor: region.fill,
                                  }}
                              ></div>
                            </Progress>
                            <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Avg. Price: ZMW{" "}
                            {index === 0 ? "850,000" : index === 1 ? "450,000" : index === 2 ? "650,000" : "420,000"}
                          </span>
                              <span>
                            Growth: {index === 0 ? "+8%" : index === 1 ? "+12%" : index === 2 ? "+5%" : "+15%"}
                          </span>
                            </div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}
