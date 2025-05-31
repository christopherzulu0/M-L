"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowUpRight,
  Home,
  Users,
  MessageSquare,
  ArrowDownRight,
  DollarSign,
  Calendar,
  MapPin,
  ChevronRight,
  BarChart2,
  LineChartIcon,
  Eye,
  BedIcon,
  BathIcon,
  Square,
  Clock,
  Bell,
  Search,
  Menu,
  TrendingUp,
  Filter,
  Download,
  Star,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Send,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Property {
  id: number
  image: string
  title: string
  address: string
  price: string
  beds: number
  baths: number
  sqft: number
  status: string
  listed: string
  rating: number
  views: number
}

interface PropertyType {
  name: string
  value: number
  percentage: number
}

interface SalesData {
  name: string
  total: number
  previous: number
}

interface Stats {
    totalProperties: number;
    propertiesGrowth: number;
    totalRevenue: string;
    activeAgents: number;
    newInquiries: number;
    revenueGrowth: number;
    agentsGrowth: number;
    inquiriesGrowth: number;
}

function getTypeColor(typeName: string): string {
  const colors: { [key: string]: string } = {
    "Apartments": "#4F46E5",
    "Houses": "#10B981",
    "Villas": "#8B5CF6",
    "Commercial": "#F59E0B",
    "Land": "#EC4899",
    "Other": "#6B7280"
  }
  return colors[typeName] || "#6B7280"
}

function getStatusBadgeStyles(status: string): string {
  switch (status) {
    case "For Sale":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
    case "For Rent":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30"
    case "New":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30"
    case "Pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30"
    case "Responded":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700/50"
  }
}

export default function OverviewPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("bar")
  const [recentProperties, setRecentProperties] = useState<Property[]>([])
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    propertiesGrowth: 0,
    totalRevenue: 'ZMW 0',
    activeAgents: 0,
    newInquiries: 0,
    revenueGrowth: 0,
    agentsGrowth: 0,
    inquiriesGrowth: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, typesRes, salesRes, statsRes] = await Promise.all([
          fetch('/api/overviews/recent-properties'),
          fetch('/api/overviews/property-types'),
          fetch('/api/overviews/sales'),
          fetch('/api/overviews/stats')
        ])

        if (!propertiesRes.ok || !typesRes.ok || !salesRes.ok || !statsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const propertiesData = await propertiesRes.json()
        const typesData = await typesRes.json()
        const salesData = await salesRes.json()
        const statsData = await statsRes.json()

        setRecentProperties(propertiesData)
        setPropertyTypes(typesData)
        setSalesData(salesData)
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate total properties from propertyTypes
  const totalProperties = propertyTypes.reduce((sum, type) => sum + type.value, 0)

  // Monitor stats changes
  useEffect(() => {
    // Stats state has been updated
  }, [stats]);

  if (!mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        {/* Top Navigation Bar */}
        {/*<div className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">*/}
        {/*  <div className="container mx-auto px-4">*/}
        {/*    <div className="flex h-16 items-center justify-between">*/}
        {/*      <div className="flex items-center gap-2 md:gap-4">*/}
        {/*        <Button variant="ghost" size="icon" className="md:hidden">*/}
        {/*          <Menu className="h-5 w-5" />*/}
        {/*        </Button>*/}
        {/*        <div className="hidden md:flex items-center gap-2">*/}
        {/*          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">*/}
        {/*            <Home className="h-4 w-4 text-white" />*/}
        {/*          </div>*/}
        {/*          <span className="font-bold text-lg">ML</span>*/}
        {/*        </div>*/}
        {/*        <div className="relative hidden md:flex items-center">*/}
        {/*          <Search className="absolute left-3 h-4 w-4 text-gray-400" />*/}
        {/*          <input*/}
        {/*              type="text"*/}
        {/*              placeholder="Search properties, agents..."*/}
        {/*              className="pl-9 pr-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-indigo-500 w-64"*/}
        {/*          />*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*      <div className="flex items-center gap-3">*/}
        {/*        <Button variant="ghost" size="icon" className="relative">*/}
        {/*          <Bell className="h-5 w-5" />*/}
        {/*          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>*/}
        {/*        </Button>*/}
        {/*        <Avatar className="h-8 w-8 border-2 border-white shadow-sm">*/}
        {/*          <AvatarImage src="/placeholder.svg" />*/}
        {/*          <AvatarFallback>JD</AvatarFallback>*/}
        {/*        </Avatar>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="container mx-auto px-4 py-6 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-muted-foreground">Welcome back, John! Here's what's happening today.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <select className="pl-9 pr-4 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm w-full sm:w-auto focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Last 3 Months</option>
                  <option>This Year</option>
                </select>
              </div>
              <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all">
                <Eye className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Total Properties",
                value: stats.totalProperties.toString(),
                change: `${stats.propertiesGrowth >= 0 ? "+" : ""}${stats.propertiesGrowth.toFixed(1)}%`,
                trend: stats.propertiesGrowth >= 0 ? "up" : "down",
                icon: <Home className="h-5 w-5" />,
                color: "from-blue-600 to-indigo-600",
                lightColor: "bg-blue-50 text-blue-600",
              },
              {
                title: "Total Revenue",
                value: stats.totalRevenue,
                change: `${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth.toFixed(1)}%`,
                trend: stats.revenueGrowth >= 0 ? "up" : "down",
                icon: <DollarSign className="h-5 w-5" />,
                color: "from-emerald-600 to-teal-600",
                lightColor: "bg-emerald-50 text-emerald-600",
              },
              {
                title: "Active Agents",
                value: stats.activeAgents.toString(),
                change: `${stats.agentsGrowth >= 0 ? "+" : ""}${stats.agentsGrowth.toFixed(1)}%`,
                trend: stats.agentsGrowth >= 0 ? "up" : "down",
                icon: <Users className="h-5 w-5" />,
                color: "from-purple-600 to-violet-600",
                lightColor: "bg-purple-50 text-purple-600",
              },
              {
                title: "New Inquiries",
                value: stats.newInquiries.toString(),
                change: `${stats.inquiriesGrowth >= 0 ? "+" : ""}${stats.inquiriesGrowth.toFixed(1)}%`,
                trend: stats.inquiriesGrowth >= 0 ? "up" : "down",
                icon: <MessageSquare className="h-5 w-5" />,
                color: "from-amber-600 to-orange-600",
                lightColor: "bg-amber-50 text-amber-600",
              },
            ].map((stat, index) => (
                <Card key={index} className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <h3 className="text-2xl md:text-3xl font-bold mt-1">{stat.value}</h3>
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

          <div className="grid gap-6 md:grid-cols-7">
            <Card className="col-span-7 md:col-span-4 border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl font-bold">Sales Overview</CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </div>
                <Tabs defaultValue="bar" className="w-[200px]" onValueChange={setActiveTab}>
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
                {activeTab === "bar" && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                          data={salesData}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 5,
                          }}
                      >
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e0e0e0" }} />
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
                            formatter={(value: any) =>
                                new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "ZMW",
                                  minimumFractionDigits: 0,
                                }).format(Number(value))
                            }
                            contentStyle={{
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              border: "none",
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: 10 }} />
                        <Bar
                            dataKey="total"
                            name="Current Year"
                            fill="url(#colorTotal)"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                            animationDuration={1500}
                        />
                        <Bar
                            dataKey="previous"
                            name="Previous Year"
                            fill="#E0E7FF"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                            animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                )}
                {activeTab === "line" && (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                          data={salesData}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 5,
                          }}
                      >
                        <defs>
                          <linearGradient id="colorTotalLine" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e0e0e0" }} />
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
                            formatter={(value: any) =>
                                new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "ZMW",
                                  minimumFractionDigits: 0,
                                }).format(Number(value))
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
                            dataKey="total"
                            name="Current Year"
                            stroke="#4F46E5"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: "#4F46E5" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="previous"
                            name="Previous Year"
                            stroke="#94A3B8"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 4, strokeWidth: 2 }}
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

            <Card className="col-span-7 md:col-span-3 border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-bold">Featured Properties</CardTitle>
                    <CardDescription>Top performing listings this month</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <Filter className="h-3 w-3" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentProperties.map((property) => (
                      <div
                          key={property.id}
                          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-1 transition-all hover:shadow-md"
                      >
                        <div className="flex gap-4 overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-3">
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                                src={property.image || "/placeholder.svg"}
                                alt={property.title}
                                className="object-cover transition-transform group-hover:scale-110"
                                fill
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{property.rating}</span>
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold line-clamp-1">{property.title}</p>
                              <Badge
                                  variant="outline"
                                  className={`ml-2 shrink-0 ${getStatusBadgeStyles(property.status)}`}
                              >
                                {property.status}
                              </Badge>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              <span className="line-clamp-1">{property.address}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-indigo-600 dark:text-indigo-400">{property.price}</span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                <span>{property.views} views</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1">
                                <BedIcon className="h-3 w-3 text-gray-500" />
                                <span>{property.beds} beds</span>
                              </div>
                              <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1">
                                <BathIcon className="h-3 w-3 text-gray-500" />
                                <span>{property.baths} baths</span>
                              </div>
                              <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1">
                                <Square className="h-3 w-3 text-gray-500" />
                                <span>{property.sqft} sqft</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-center">
                <Button
                    onClick={() => router.push("/dashboard/properties")}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
                >
                  View all properties
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Property Types</CardTitle>
                <CardDescription>Distribution by property category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {propertyTypes.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: getTypeColor(item.name) }}></div>
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{item.value}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-muted-foreground">
                            {item.percentage}%
                        </span>
                          </div>
                        </div>
                        <Progress
                        value={item.percentage}
                            className="h-2"
                            style={{ backgroundColor: "#f3f4f6" }}
                        >
                          <div
                              className="h-full rounded-full"
                              style={{
                            width: `${item.percentage}%`,
                            backgroundColor: getTypeColor(item.name),
                              }}
                          ></div>
                        </Progress>
                      </div>
                  ))}
                </div>
                <div className="mt-6 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-indigo-100 p-2 text-indigo-600">
                        <TrendingUp className="h-4 w-4" />
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

            <Card className="col-span-1 border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                <CardDescription>Latest actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-5">
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
                  {[
                    {
                      user: "John Doe",
                      action: "added a new property",
                      time: "2 hours ago",
                      avatar: "JD",
                      status: "success",
                    },
                    {
                      user: "Sarah Smith",
                      action: "updated property details",
                      time: "5 hours ago",
                      avatar: "SS",
                      status: "success",
                    },
                    {
                      user: "Mike Johnson",
                      action: "responded to an inquiry",
                      time: "Yesterday",
                      avatar: "MJ",
                      status: "warning",
                    },
                    {
                      user: "Emma Wilson",
                      action: "scheduled a viewing",
                      time: "Yesterday",
                      avatar: "EW",
                      status: "success",
                    },
                  ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 relative">
                        <div
                            className={`absolute left-3 -translate-x-1/2 h-6 w-6 rounded-full flex items-center justify-center z-10 ${
                                activity.status === "success" ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                        >
                          {activity.status === "success" ? (
                              <CheckCircle2 className="h-3 w-3 text-white" />
                          ) : (
                              <AlertCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div className="ml-8 space-y-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 w-full">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View all activity
                </Button>
              </CardContent>
            </Card>


          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="col-span-3 md:col-span-2 border-0 shadow-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Ready to boost your property listings?</h3>
                    <p className="text-indigo-100">Upgrade to our premium plan and get 50% more visibility.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="border border-white/20 text-white hover:bg-white/10">
                      Learn more
                    </Button>
                    <Button className="bg-white text-indigo-700 hover:bg-indigo-100">Upgrade now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-1 border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                <CardDescription>Frequently used tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { title: "Add Property", icon: <Home className="h-5 w-5" /> },
                    { title: "New Agent", icon: <UserPlus className="h-5 w-5" /> },
                    { title: "Export Data", icon: <Download className="h-5 w-5" /> },
                    { title: "Send Report", icon: <Send className="h-5 w-5" /> },
                  ].map((action, index) => (
                      <Button
                          key={index}
                          variant="outline"
                          className="h-auto flex-col gap-2 p-4 justify-start items-center"
                      >
                        <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-2">{action.icon}</div>
                        <span>{action.title}</span>
                      </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
