"use client"

import { DropdownMenuGroup } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { useAgentsStats } from "@/hooks/useAgentsStats"
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
  X,
} from "lucide-react"
import AgentsAnalytics from "@/app/dashboard/AgentsAnalytics"

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timePeriod, setTimePeriod] = useState("This Month")

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState({
    performance: null, // "Top Performers", "Commercial Specialists", "Residential Specialists"
    location: null, // "Lusaka", "Ndola", "Kitwe"
  })
  const [sortOption, setSortOption] = useState(null) // "Highest Rating", "Most Sales", "Most Properties", "Recently Active"

  // Fetch agent stats using React Query
  const { 
    data: agentStats, 
    isLoading: isStatsLoading, 
    error: statsError 
  } = useAgentsStats()

  // Fetch agents data
  const fetchAgents = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching agents from API...')
      const response = await fetch('/api/agents')

      if (!response.ok) {
        throw new Error('Failed to fetch agents')
      }

      const data = await response.json()
      console.log('API response:', data)

      // Extract the agents array from the response
      const agentsData = data.agents || []
      console.log('Extracted agents array:', agentsData)

      // Transform the data to match the expected format
      console.log('Transforming agents data...')
      const formattedAgents = agentsData.map(agent => ({
        id: agent.id,
        name: `${agent.user.firstName} ${agent.user.lastName}`,
        email: agent.user.email,
        phone: agent.user.phone || 'N/A',
        avatar: agent.user.profileImage || `https://i.pravatar.cc/150?img=${agent.id}`,
        properties: agent.propertyCount || Math.floor(Math.random() * 25) + 5,
        sales: agent.soldPropertyCount ? `ZMW ${(agent.soldPropertyCount * 0.5).toFixed(1)}M` : `ZMW 0.0M`,
        rating: agent.rating || (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
        status: agent.status || 'Active',
        location: agent.location || 'Lusaka, Zambia',
        specialty: agent.specialization || 'Residential',
        joined: agent.joinDate ? new Date(agent.joinDate).toLocaleDateString() : '1 year ago',
        performance: agent.soldPropertyCount ? 
          (agent.soldPropertyCount > 10 ? 'Excellent' : 
           agent.soldPropertyCount > 5 ? 'Good' : 
           agent.soldPropertyCount > 0 ? 'Average' : 'Poor') : 'Average',
        lastActive: agent.lastActive || (Math.random() > 0.5 ? 'Today' : Math.random() > 0.3 ? 'Yesterday' : '1 week ago'),
        verified: agent.verified !== undefined ? agent.verified : true,
        featured: agent.featured !== undefined ? agent.featured : Math.random() > 0.7,
      }))

      console.log('Formatted agents data:', formattedAgents);
      setAgents(formattedAgents)
      console.log('Agents state set with', formattedAgents.length, 'agents')
      setError(null)
    } catch (err) {
      console.error('Error fetching agents:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
      console.log('Loading state set to false')
    }
  }

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents()
  }, [])

  const getStatusBadgeStyles = (status: string) => {
    const statusLower = status?.toLowerCase() || '';

    switch (statusLower) {
      case "active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30"
      case "new":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
      case "inactive":
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

  // Helper function to apply search filter
  const applySearchFilter = (agent) => {
    if (!searchTerm || searchTerm.trim() === '') return true;

    const searchLower = searchTerm.toLowerCase().trim();
    console.log('Searching for:', searchLower);
    console.log('Agent:', agent.name, agent.email, agent.location);

    // Ensure agent properties exist before trying to search them
    const agentName = agent.name ? agent.name.toLowerCase() : '';
    const agentEmail = agent.email ? agent.email.toLowerCase() : '';
    const agentLocation = agent.location ? agent.location.toLowerCase() : '';

    const nameMatch = agentName.includes(searchLower);
    const emailMatch = agentEmail.includes(searchLower);
    const locationMatch = agentLocation.includes(searchLower);

    console.log('Matches:', { nameMatch, emailMatch, locationMatch });

    return nameMatch || emailMatch || locationMatch;
  };

  // Helper function to apply performance filter
  const applyPerformanceFilter = (agent) => {
    if (!selectedFilters.performance) return true;

    switch (selectedFilters.performance) {
      case "Top Performers":
        return agent.performance === "Excellent" || agent.performance === "Good";
      case "Commercial Specialists":
        return agent.specialty === "Commercial";
      case "Residential Specialists":
        return agent.specialty === "Residential";
      default:
        return true;
    }
  };

  // Helper function to apply location filter
  const applyLocationFilter = (agent) => {
    if (!selectedFilters.location) return true;

    return agent.location.includes(selectedFilters.location);
  };

  // Apply tab filters first
  console.log('Starting filtering process with', agents.length, 'agents');
  console.log('Active tab:', activeTab);

  let filteredAgents = activeTab === "all"
    ? agents
    : agents.filter((agent) =>
        activeTab === "active"
          ? agent.status?.toLowerCase() === "active"
          : activeTab === "new"
            ? agent.status?.toLowerCase() === "new"
            : activeTab === "inactive"
              ? agent.status?.toLowerCase() === "inactive"
              : activeTab === "featured"
                ? agent.featured
                : true,
      );

  console.log('After tab filter:', filteredAgents.length, 'out of', agents.length);
  console.log('First agent after tab filter:', filteredAgents[0] || 'No agents after tab filter');

  // Apply search and additional filters
  const afterSearchFilter = filteredAgents.filter(applySearchFilter);
  console.log('After search filter:', afterSearchFilter.length, 'out of', filteredAgents.length);

  const afterPerformanceFilter = afterSearchFilter.filter(applyPerformanceFilter);
  console.log('After performance filter:', afterPerformanceFilter.length, 'out of', afterSearchFilter.length);

  const afterLocationFilter = afterPerformanceFilter.filter(applyLocationFilter);
  console.log('After location filter:', afterLocationFilter.length, 'out of', afterPerformanceFilter.length);

  filteredAgents = afterLocationFilter;

  console.log('Final filtered agents:', filteredAgents.length, 'out of', agents.length);
  console.log('First agent in final filtered list:', filteredAgents[0] || 'No agents in final filtered list');

  // Apply sorting
  if (sortOption) {
    filteredAgents = [...filteredAgents].sort((a, b) => {
      switch (sortOption) {
        case "Highest Rating":
          return parseFloat(b.rating) - parseFloat(a.rating);
        case "Most Sales":
          // Extract numeric value from sales string (e.g., "ZMW 2.5M" -> 2.5)
          const aSales = parseFloat(a.sales.replace(/[^0-9.]/g, ''));
          const bSales = parseFloat(b.sales.replace(/[^0-9.]/g, ''));
          return bSales - aSales;
        case "Most Properties":
          return b.properties - a.properties;
        case "Recently Active":
          // Sort by lastActive (assuming "Today" is most recent, then "Yesterday", etc.)
          const activityOrder = { "Today": 0, "Yesterday": 1, "1 week ago": 2 };
          return (activityOrder[a.lastActive] || 99) - (activityOrder[b.lastActive] || 99);
        default:
          return 0;
      }
    });
  }

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
              {/*<Button*/}
              {/*    variant="outline"*/}
              {/*    size="sm"*/}
              {/*    className="border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"*/}
              {/*>*/}
              {/*  <Filter className="mr-2 h-4 w-4" />*/}
              {/*  Filter*/}
              {/*</Button>*/}
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
            {/* Total Agents Card */}
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
                        {isStatsLoading ? (
                          <div className="animate-pulse h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                        ) : statsError ? (
                          <div className="text-red-500 text-sm">Error loading data</div>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <h3 className="text-2xl font-bold">{agentStats?.totalAgents || 0}</h3>
                            <span className={`text-xs ${agentStats?.totalAgentsChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
                              {agentStats?.totalAgentsChange >= 0 ? 
                                <ArrowUp className="h-3 w-3 mr-0.5" /> : 
                                <ArrowDown className="h-3 w-3 mr-0.5" />
                              }
                              {Math.abs(agentStats?.totalAgentsChange || 0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-2 bg-gradient-to-b from-blue-600 to-indigo-600"></div>
                </div>
              </CardContent>
            </Card>

            {/* Average Rating Card */}
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
                        {isStatsLoading ? (
                          <div className="animate-pulse h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                        ) : statsError ? (
                          <div className="text-red-500 text-sm">Error loading data</div>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <h3 className="text-2xl font-bold">{agentStats?.averageRating || '0.0'}</h3>
                            <span className={`text-xs ${agentStats?.averageRatingChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
                              {agentStats?.averageRatingChange >= 0 ? 
                                <ArrowUp className="h-3 w-3 mr-0.5" /> : 
                                <ArrowDown className="h-3 w-3 mr-0.5" />
                              }
                              {Math.abs(agentStats?.averageRatingChange || 0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-2 bg-gradient-to-b from-emerald-600 to-teal-600"></div>
                </div>
              </CardContent>
            </Card>

            {/* Total Properties Card */}
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
                        {isStatsLoading ? (
                          <div className="animate-pulse h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                        ) : statsError ? (
                          <div className="text-red-500 text-sm">Error loading data</div>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <h3 className="text-2xl font-bold">{agentStats?.totalProperties || 0}</h3>
                            <span className={`text-xs ${agentStats?.totalPropertiesChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
                              {agentStats?.totalPropertiesChange >= 0 ? 
                                <ArrowUp className="h-3 w-3 mr-0.5" /> : 
                                <ArrowDown className="h-3 w-3 mr-0.5" />
                              }
                              {Math.abs(agentStats?.totalPropertiesChange || 0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-2 bg-gradient-to-b from-purple-600 to-violet-600"></div>
                </div>
              </CardContent>
            </Card>

            {/* Total Sales Card */}
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
                        {isStatsLoading ? (
                          <div className="animate-pulse h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                        ) : statsError ? (
                          <div className="text-red-500 text-sm">Error loading data</div>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <h3 className="text-2xl font-bold">{agentStats?.totalSales || 'ZMW 0.0M'}</h3>
                            <span className={`text-xs ${agentStats?.totalSalesChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
                              {agentStats?.totalSalesChange >= 0 ? 
                                <ArrowUp className="h-3 w-3 mr-0.5" /> : 
                                <ArrowDown className="h-3 w-3 mr-0.5" />
                              }
                              {Math.abs(agentStats?.totalSalesChange || 0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-2 bg-gradient-to-b from-amber-600 to-orange-600"></div>
                </div>
              </CardContent>
            </Card>
          </div>




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
                      {timePeriod}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTimePeriod("This Week")}>This Week</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimePeriod("This Month")}>This Month</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimePeriod("Last 3 Months")}>Last 3 Months</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimePeriod("This Year")}>This Year</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimePeriod("All Time")}>All Time</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <AgentsAnalytics timePeriod={timePeriod} />
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-muted-foreground">Top performers</span>
                </div>
                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Updated recently</span>
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
              {/*<Button*/}

              {/*    variant="outline" size="sm">*/}
              {/*  View All Agents*/}
              {/*  <ChevronRight className="ml-2 h-4 w-4" />*/}
              {/*</Button>*/}
            </CardFooter>
          </Card>
        </div>
      </div>
  )
}
