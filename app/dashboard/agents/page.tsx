"use client"

import { DropdownMenuGroup } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Phone,
  Mail,
  Star,
  Users,
  TrendingUp,
  Home,
  ArrowUpRight,
  Download,
  UserPlus,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Award,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Building,
  Eye,
  MessageSquare,
  Settings,
  FileText,
  Share2,
} from "lucide-react"
import AgentsAnalytics from "@/app/dashboard/AgentsAnalytics"

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/agents')

        if (!response.ok) {
          throw new Error('Failed to fetch agents')
        }

        const data = await response.json()

        // Transform the data to match the expected format
        const formattedAgents = data.map(agent => ({
          id: agent.id,
          name: `${agent.user.firstName} ${agent.user.lastName}`,
          email: agent.user.email,
          phone: agent.user.phone || 'N/A',
          avatar: agent.user.profileImage || `https://i.pravatar.cc/150?img=${agent.id}`,
          properties: agent.propertyCount || Math.floor(Math.random() * 25) + 5,
          sales: `ZMW ${((Math.random() * 5) + 1).toFixed(1)}M`,
          rating: agent.rating || (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
          status: agent.status || 'Active',
          location: agent.location || 'Lusaka, Zambia',
          specialty: agent.specialization || 'Residential',
          joined: agent.joinDate ? new Date(agent.joinDate).toLocaleDateString() : '1 year ago',
          performance: agent.performance || (Math.random() > 0.7 ? 'Excellent' : Math.random() > 0.4 ? 'Good' : 'Average'),
          lastActive: agent.lastActive || (Math.random() > 0.5 ? 'Today' : Math.random() > 0.3 ? 'Yesterday' : '1 week ago'),
          verified: agent.verified !== undefined ? agent.verified : true,
          featured: agent.featured !== undefined ? agent.featured : Math.random() > 0.7,
        }))

        setAgents(formattedAgents)
        setError(null)
      } catch (err) {
        console.error('Error fetching agents:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgents()
  }, [])

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30"
      case "New":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
      case "Inactive":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700/50"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700/50"
    }
  }

  const getPerformanceIndicator = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return <ArrowUp className="h-3 w-3 text-emerald-500" />
      case "Good":
        return <ArrowUpRight className="h-3 w-3 text-blue-500" />
      case "Average":
        return <ChevronRight className="h-3 w-3 text-amber-500" />
      default:
        return <ArrowDown className="h-3 w-3 text-red-500" />
    }
  }

  const filteredAgents =
      activeTab === "all"
          ? agents
          : agents.filter((agent) =>
              activeTab === "active"
                  ? agent.status === "Active"
                  : activeTab === "new"
                      ? agent.status === "New"
                      : activeTab === "inactive"
                          ? agent.status === "Inactive"
                          : activeTab === "featured"
                              ? agent.featured
                              : true,
          )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-6 flex justify-center items-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-muted-foreground">Loading agents data...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="text-center text-red-600 dark:text-red-400">
                <p className="font-medium">Error loading agents data</p>
                <p className="text-sm mt-1">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Agents Management
              </h2>
              <p className="text-muted-foreground">View and manage your real estate agents</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Agent
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div className="p-4 md:p-6 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 text-blue-600 dark:text-blue-400">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                        <div className="flex items-baseline gap-1">
                          <h3 className="text-2xl font-bold">24</h3>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                          <ArrowUp className="h-3 w-3 mr-0.5" />
                          12%
                        </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-2 bg-gradient-to-b from-blue-600 to-indigo-600"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div className="p-4 md:p-6 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3 text-emerald-600 dark:text-emerald-400">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                        <div className="flex items-baseline gap-1">
                          <h3 className="text-2xl font-bold">4.7</h3>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                          <ArrowUp className="h-3 w-3 mr-0.5" />
                          0.2
                        </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-2 bg-gradient-to-b from-emerald-600 to-teal-600"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div className="p-4 md:p-6 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 text-purple-600 dark:text-purple-400">
                        <Home className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                        <div className="flex items-baseline gap-1">
                          <h3 className="text-2xl font-bold">248</h3>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                          <ArrowUp className="h-3 w-3 mr-0.5" />
                          8%
                        </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-2 bg-gradient-to-b from-purple-600 to-violet-600"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div className="p-4 md:p-6 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-3 text-amber-600 dark:text-amber-400">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                        <div className="flex items-baseline gap-1">
                          <h3 className="text-2xl font-bold">ZMW 12.4M</h3>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                          <ArrowUp className="h-3 w-3 mr-0.5" />
                          15%
                        </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-2 bg-gradient-to-b from-amber-600 to-orange-600"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      placeholder="Search agents by name, email, or location..."
                      className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Agent Filters</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Award className="mr-2 h-4 w-4" />
                          <span>Top Performers</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Building className="mr-2 h-4 w-4" />
                          <span>Commercial Specialists</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Home className="mr-2 h-4 w-4" />
                          <span>Residential Specialists</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>Lusaka</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>Ndola</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>Kitwe</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Sort By
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        <span>Highest Rating</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        <span>Most Sales</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Home className="mr-2 h-4 w-4" />
                        <span>Most Properties</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Recently Active</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Performance Analytics */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Agent Performance</CardTitle>
                  <CardDescription>Comparing key performance metrics across top agents</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                      <Calendar className="mr-2 h-4 w-4" />
                      This Month
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>This Week</DropdownMenuItem>
                    <DropdownMenuItem>This Month</DropdownMenuItem>
                    <DropdownMenuItem>Last 3 Months</DropdownMenuItem>
                    <DropdownMenuItem>This Year</DropdownMenuItem>
                    <DropdownMenuItem>All Time</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

          {/* Agent Directory */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Agent Directory</CardTitle>
                  <CardDescription>Manage your real estate agents</CardDescription>
                </div>
                <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-[400px]">
                  <TabsList className="grid w-full grid-cols-5 p-1 bg-gray-100 dark:bg-gray-700">
                    <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                        value="active"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                    >
                      Active
                    </TabsTrigger>
                    <TabsTrigger
                        value="new"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                    >
                      New
                    </TabsTrigger>
                    <TabsTrigger
                        value="inactive"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                    >
                      Inactive
                    </TabsTrigger>
                    <TabsTrigger
                        value="featured"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                    >
                      Featured
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => (
                    <Card
                        key={agent.id}
                        className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-0">
                        <div className="relative h-24 bg-gradient-to-r from-indigo-600 to-purple-600">
                          <div className="absolute inset-0 bg-[url('/placeholder-pattern.svg')] opacity-10"></div>
                          {agent.featured && (
                              <Badge className="absolute top-2 right-2 bg-amber-500">
                                <Award className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                          )}
                        </div>
                        <div className="px-5 pt-0 pb-5">
                          <div className="flex justify-between -mt-10">
                            <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-md">
                              <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                              <AvatarFallback className="text-lg">{agent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Badge variant="outline" className={`mt-2 ${getStatusBadgeStyles(agent.status)}`}>
                              {agent.status}
                            </Badge>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">{agent.name}</h3>
                              {agent.verified && (
                                  <Badge
                                      variant="outline"
                                      className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                              <Briefcase className="h-3 w-3" />
                              <span>{agent.specialty}</span>
                            </div>

                            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                              <MapPin className="h-3 w-3" />
                              <span>{agent.location}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-4">
                              <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 p-2">
                                <div className="text-sm font-semibold">{agent.properties}</div>
                                <div className="text-xs text-muted-foreground">Properties</div>
                              </div>
                              <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 p-2">
                                <div className="text-sm font-semibold">{agent.sales}</div>
                                <div className="text-xs text-muted-foreground">Sales</div>
                              </div>
                              <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 p-2">
                                <div className="flex items-center text-sm font-semibold">
                                  {agent.rating}
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400 ml-0.5" />
                                </div>
                                <div className="text-xs text-muted-foreground">Rating</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>Active {agent.lastActive}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <span className="text-muted-foreground">Performance</span>
                                <div className="flex items-center gap-0.5">
                              <span
                                  className={`
                                ${
                                      agent.performance === "Excellent"
                                          ? "text-emerald-600 dark:text-emerald-400"
                                          : agent.performance === "Good"
                                              ? "text-blue-600 dark:text-blue-400"
                                              : agent.performance === "Average"
                                                  ? "text-amber-600 dark:text-amber-400"
                                                  : "text-red-600 dark:text-red-400"
                                  }
                              `}
                              >
                                {agent.performance}
                              </span>
                                  {getPerformanceIndicator(agent.performance)}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Eye className="h-4 w-4 mr-1" />
                                Profile
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Phone className="mr-2 h-4 w-4" />
                                    <span>Call</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span>Email</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>View Listings</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Edit Profile</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    <span>Share Profile</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                    <span>Deactivate</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredAgents.length}</span> of{" "}
                <span className="font-medium">{agents.length}</span> agents
              </div>
              <Button variant="outline" size="sm">
                View All Agents
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
  )
}
