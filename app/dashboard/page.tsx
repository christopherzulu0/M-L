"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowUpRight,
  Home,
  Plus,
  Calendar,
  Clock,
  MapPin,
  ArrowDownRight,
  Filter,
  Download,
  User,
  DollarSign,
  MessageSquare,
  Users,
  Eye,
  Star,
  ChevronRight,
  Bed,
  Bath,
  Square,
} from "lucide-react"
import Image from "next/image"

const recentProperties = [
  {
    id: 1,
    image:
        "https://images.lifestyleasia.com/wp-content/uploads/sites/3/2020/09/15155131/9th-Floor-Infinity-Pool-Aman-Nai-Lert-Bangkok-Thailand-c-Aman-Nai-Lert-Bangkok-min-scaled.jpg",
    title: "Modern Apartment with Pool View",
    address: "123 Skyline Ave, Downtown",
    price: "ZMW 450,000",
    beds: 2,
    baths: 2,
    sqft: 1200,
    status: "For Sale",
    listed: "2 days ago",
    views: 243,
    rating: 4.8,
  },
  {
    id: 2,
    image:
        "https://www.travelandleisure.com/thmb/iAIrOVW7yWrDG-yYB9IvY0nF-8w=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/new-river-gorge-national-park-preserve-west-virginia-NEWNATPARK0421-d92f896451bf4c388289ff3b908cc6c6.jpg",
    title: "Luxury Villa with Garden",
    address: "456 Park Lane, Suburbia",
    price: "ZMW 850,000",
    beds: 4,
    baths: 3,
    sqft: 2800,
    status: "For Sale",
    listed: "1 week ago",
    views: 187,
    rating: 4.5,
  },
  {
    id: 3,
    image:
        "https://www.travelandleisure.com/thmb/iAIrOVW7yWrDG-yYB9IvY0nF-8w=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/new-river-gorge-national-park-preserve-west-virginia-NEWNATPARK0421-d92f896451bf4c388289ff3b908cc6c6.jpg",
    title: "Cozy Townhouse",
    address: "789 Maple St, Riverside",
    price: "ZMW 5,500/mo",
    beds: 3,
    baths: 2.5,
    sqft: 1800,
    status: "For Rent",
    listed: "3 days ago",
    views: 156,
    rating: 4.2,
  },
]

const recentAgents = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    properties: 24,
    sales: "ZMW 4.2M",
    rating: 4.8,
    status: "Active",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    properties: 18,
    sales: "ZMW 3.1M",
    rating: 4.5,
    status: "Active",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    properties: 12,
    sales: "ZMW 2.8M",
    rating: 4.7,
    status: "Active",
  },
]

const recentInquiries = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+260 97 1234567",
    property: "Modern Apartment with Pool View",
    date: "Today, 10:30 AM",
    status: "New",
    message: "I'm interested in scheduling a viewing for this property. Is it available this weekend?",
  },
  {
    id: 2,
    name: "Lisa Wong",
    email: "lisa.wong@example.com",
    phone: "+260 97 7654321",
    property: "Luxury Villa with Garden",
    date: "Yesterday, 3:45 PM",
    status: "Pending",
    message: "Could you provide more information about the neighborhood and nearby amenities?",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+260 97 2468135",
    property: "Cozy Townhouse",
    date: "2 days ago, 9:15 AM",
    status: "Responded",
    message: "I'm interested in the rental terms. Is the price negotiable for a longer lease period?",
  },
]

const upcomingTasks = [
  {
    id: 1,
    title: "Property Viewing - Modern Apartment",
    date: "Today, 2:00 PM",
    client: "John Smith",
    priority: "High",
  },
  {
    id: 2,
    title: "Contract Signing - Luxury Villa",
    date: "Tomorrow, 10:30 AM",
    client: "Lisa Wong",
    priority: "High",
  },
  {
    id: 3,
    title: "Property Photoshoot - Riverside Condo",
    date: "Aug 15, 9:00 AM",
    client: "Internal",
    priority: "Medium",
  },
  {
    id: 4,
    title: "Client Meeting - Investment Options",
    date: "Aug 16, 3:30 PM",
    client: "Robert Johnson",
    priority: "Medium",
  },
]

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState("grid")
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusBadgeStyles = (status: string) => {
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

  const getPriorityBadgeStyles = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/30"
      case "Medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30"
      case "Low":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700/50"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            <Download className="mr-2 h-4 w-4" />
            Reports
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Properties",
            value: "248",
            change: "+12%",
            trend: "up",
            icon: <Home className="h-5 w-5" />,
            color: "from-blue-600 to-indigo-600",
            lightColor: "bg-blue-50 text-blue-600",
          },
          {
            title: "Total Revenue",
            value: "ZMW 2.4M",
            change: "+8%",
            trend: "up",
            icon: <DollarSign className="h-5 w-5" />,
            color: "from-emerald-600 to-teal-600",
            lightColor: "bg-emerald-50 text-emerald-600",
          },
          {
            title: "Active Agents",
            value: "24",
            change: "+4%",
            trend: "up",
            icon: <Users className="h-5 w-5" />,
            color: "from-purple-600 to-violet-600",
            lightColor: "bg-purple-50 text-purple-600",
          },
          {
            title: "New Inquiries",
            value: "38",
            change: "-3%",
            trend: "down",
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
                        className={`mt-1 text-xs md:text-sm ${
                            stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                        }`}
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

      {/* Main Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Featured Properties */}
        <Card className="col-span-7 md:col-span-4 border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
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
                            <Bed className="h-3 w-3 text-gray-500" />
                            <span>{property.beds} beds</span>
                          </div>
                          <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1">
                            <Bath className="h-3 w-3 text-gray-500" />
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
            <Button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all">
              View all properties
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Inquiries */}
        <Card className="col-span-7 md:col-span-3 border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Recent Inquiries</CardTitle>
                <CardDescription>Latest client messages</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                  <div
                      key={inquiry.id}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{inquiry.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{inquiry.name}</p>
                          <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusBadgeStyles(inquiry.status)}>
                        {inquiry.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      <span className="font-medium">Property:</span> {inquiry.property}
                    </p>
                    <p className="text-xs line-clamp-2 text-muted-foreground mb-2">{inquiry.message}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {inquiry.date}
                      </p>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600">
                        Respond
                      </Button>
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Upcoming Tasks */}
        <Card className="col-span-7 md:col-span-3 border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Upcoming Tasks</CardTitle>
                <CardDescription>Your schedule for the next few days</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-3 w-3" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                  <div
                      key={task.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                            className={`h-2 w-2 rounded-full ${
                                task.priority === "High"
                                    ? "bg-red-500"
                                    : task.priority === "Medium"
                                        ? "bg-amber-500"
                                        : "bg-emerald-500"
                            }`}
                        ></div>
                        <p className="font-medium text-sm">{task.title}</p>
                      </div>
                      <div className="mt-1 flex items-center gap-4">
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {task.date}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {task.client}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getPriorityBadgeStyles(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Mark all as complete
            </Button>
            <Button variant="ghost" size="sm" className="text-indigo-600">
              View Calendar
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Top Agents */}
        <Card className="col-span-7 md:col-span-4 border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Top Performing Agents</CardTitle>
                <CardDescription>Agents with the highest sales this month</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600">
                View all agents
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAgents.map((agent, index) => (
                  <div
                      key={agent.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                        <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-semibold">{agent.properties}</p>
                        <p className="text-xs text-muted-foreground">Properties</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold">{agent.sales}</p>
                        <p className="text-xs text-muted-foreground">Sales</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold flex items-center">
                          {agent.rating}
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 ml-0.5" />
                        </p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
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
    </div>
  )
}