"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import AgentGuard from "./agent-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
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
} from "recharts"
import {
    Home,
    DollarSign,
    Users,
    Calendar,
    Clock,
    Star,
    CheckCircle,
    ArrowUpRight,
    MessageSquare,
    Settings,
    User,
    FileText,
    Search,
    Filter,
    ChevronRight,
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    MapPin,
    Phone,
    Mail,
    CalendarDays,
    TrendingUp,
    Award,
    Target,
    Zap,
    Download,
    Share2,
    Bed,
    Bath,
    Square,
    Heart,
    Bell,
} from "lucide-react"

export default function AgentDashboard() {
    return (
        <AgentGuard>
            <AgentDashboardContent />
        </AgentGuard>
    );
}

function AgentDashboardContent() {
    const [activeTab, setActiveTab] = useState("overview")
    const [timeRange, setTimeRange] = useState("month")
    const [agentData, setAgentData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [monthlyPerformance, setMonthlyPerformance] = useState([])
    const [propertyTypeData, setPropertyTypeData] = useState([])
    const [activeListings, setActiveListings] = useState([])
    const [listingsLoading, setListingsLoading] = useState(false)
    const [overviewLoading, setOverviewLoading] = useState(false)
    const [listingsPagination, setListingsPagination] = useState({
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 10
    })

    // Fetch agent data for the current user
    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/agent/me')

                if (!response.ok) {
                    throw new Error('Failed to fetch agent data')
                }

                const data = await response.json()

                // Use only the data from the API response without fallback values
                const enhancedData = {
                    ...data,
                    specializations: data.specialization ?
                        data.specialization.split(',').map(s => s.trim()) :
                        [],
                }

                setAgentData(enhancedData)
                setError(null)
            } catch (err) {
                console.error('Error fetching agent data:', err)
                setError('Failed to load agent data. Please try again later.')
                setAgentData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchAgentData()
    }, [])

    // Fetch performance data for the Overview tab
    const fetchPerformanceData = async () => {
        try {
            setOverviewLoading(true)
            const response = await fetch('/api/agent/performance')

            if (!response.ok) {
                throw new Error('Failed to fetch performance data')
            }

            const data = await response.json()
            setMonthlyPerformance(data)
        } catch (err) {
            console.error('Error fetching performance data:', err)
            // Set empty array if there's an error
            setMonthlyPerformance([])
        } finally {
            setOverviewLoading(false)
        }
    }

    // Fetch property type data for the Overview tab
    const fetchPropertyTypeData = async () => {
        try {
            setOverviewLoading(true)
            const response = await fetch('/api/agent/property-types')

            if (!response.ok) {
                throw new Error('Failed to fetch property type data')
            }

            const data = await response.json()
            setPropertyTypeData(data)
        } catch (err) {
            console.error('Error fetching property type data:', err)
            // Set empty array if there's an error
            setPropertyTypeData([])
        } finally {
            setOverviewLoading(false)
        }
    }

    // Fetch listings data for the Listings tab
    const fetchListingsData = async (page = 1) => {
        try {
            setListingsLoading(true)
            const response = await fetch(`/api/agent/properties?page=${page}&limit=10`)

            if (!response.ok) {
                throw new Error('Failed to fetch listings data')
            }

            const data = await response.json()
            setActiveListings(data.properties)
            setListingsPagination(data.pagination)
        } catch (err) {
            console.error('Error fetching listings data:', err)
            // Set empty arrays if there's an error
            setActiveListings([])
            setListingsPagination({
                totalCount: 0,
                totalPages: 0,
                currentPage: 1,
                limit: 10
            })
        } finally {
            setListingsLoading(false)
        }
    }

    // Fetch data when the active tab changes
    useEffect(() => {
        if (activeTab === "overview") {
            fetchPerformanceData()
            fetchPropertyTypeData()
        } else if (activeTab === "listings") {
            fetchListingsData()
        }
    }, [activeTab])

    // The following are sample data for other tabs that are not yet connected to API endpoints

    // Empty arrays for clients, tasks, and activity - no fallback data
    const recentClients = []
    const upcomingTasks = []
    const recentActivity = []

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

    const getStatusBadgeStyles = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30"
            case "Pending":
                return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30"
            case "Inactive":
                return "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700/50"
            default:
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
        }
    }

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Loading agent data...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error && !agentData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // If we have data, render the dashboard
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Agent Profile Header */}
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
                    <div className="relative h-32 md:h-48 w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                        <div className="absolute inset-0 bg-[url('/placeholder-pattern.svg')] opacity-10"></div>
                    </div>
                    <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-[260px] px-6 -mt-12 relative z-10">
                                <div className="relative aspect-square w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg mx-auto md:mx-0">
                                    <Image
                                        src={agentData?.image || "/placeholder.svg"}
                                        alt={agentData?.name || ""}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="mt-4 text-center md:text-left space-y-4">
                                    <div className="flex flex-col">
                                        <h1 className="text-xl md:text-2xl font-bold">{agentData?.name}</h1>
                                        <p className="text-indigo-600 dark:text-indigo-400 font-medium">{agentData?.role || agentData?.specialization}</p>
                                        <div className="mt-2 flex items-center justify-center md:justify-start">
                                            {agentData?.rating ? (
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${
                                                                i < Math.floor(agentData.rating)
                                                                    ? "fill-amber-400 text-amber-400"
                                                                    : "text-gray-300 dark:text-gray-600"
                                                            }`}
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm text-muted-foreground">({agentData.reviews || 0} reviews)</span>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    {agentData?.badges && agentData.badges.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                            {agentData.badges.map((badge, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30"
                                                >
                                                    {badge}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : null}

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                <Phone className="h-4 w-4" />
                                            </div>
                                            <span>{agentData.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm">{agentData.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                <CalendarDays className="h-4 w-4" />
                                            </div>
                                            <span>Joined {agentData.joinDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-xl font-bold">Agent Dashboard</h2>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Settings
                                        </Button>
                                        <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Listing
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                    <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                                                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                                        {agentData?.performance?.totalSales}
                                                    </h3>
                                                </div>
                                                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-2 text-indigo-600 dark:text-indigo-400">
                                                    <DollarSign className="h-5 w-5" />
                                                </div>
                                            </div>
                                            {agentData?.performance?.salesTrend && (
                                                <div className="mt-2 flex items-center text-xs text-emerald-600">
                                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                                    <span>{agentData.performance.salesTrend}</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Commission</p>
                                                    <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                                        {agentData?.performance?.totalCommission}
                                                    </h3>
                                                </div>
                                                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-2 text-emerald-600 dark:text-emerald-400">
                                                    <DollarSign className="h-5 w-5" />
                                                </div>
                                            </div>
                                            {agentData?.performance?.commissionTrend && (
                                                <div className="mt-2 flex items-center text-xs text-emerald-600">
                                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                                    <span>{agentData.performance.commissionTrend}</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                                                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                        {agentData?.performance?.activeListings}
                                                    </h3>
                                                </div>
                                                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 text-blue-600 dark:text-blue-400">
                                                    <Home className="h-5 w-5" />
                                                </div>
                                            </div>
                                            {agentData?.performance?.listingsTrend && (
                                                <div className="mt-2 flex items-center text-xs text-emerald-600">
                                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                                    <span>{agentData.performance.listingsTrend}</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Sold Properties</p>
                                                    <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                                        {agentData?.performance?.soldProperties}
                                                    </h3>
                                                </div>
                                                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2 text-purple-600 dark:text-purple-400">
                                                    <CheckCircle className="h-5 w-5" />
                                                </div>
                                            </div>
                                            {agentData?.performance?.soldTrend && (
                                                <div className="mt-2 flex items-center text-xs text-emerald-600">
                                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                                    <span>{agentData.performance.soldTrend}</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Pending Deals</p>
                                                    <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                                        {agentData?.performance?.pendingDeals}
                                                    </h3>
                                                </div>
                                                <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2 text-amber-600 dark:text-amber-400">
                                                    <Clock className="h-5 w-5" />
                                                </div>
                                            </div>
                                            {agentData?.performance?.pendingTrend && (
                                                <div className="mt-2 flex items-center text-xs text-amber-600">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    <span>{agentData.performance.pendingTrend}</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                                                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                                        {agentData?.performance?.conversionRate ? `${agentData.performance.conversionRate}%` : ''}
                                                    </h3>
                                                </div>
                                                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-2 text-indigo-600 dark:text-indigo-400">
                                                    <TrendingUp className="h-5 w-5" />
                                                </div>
                                            </div>
                                            {agentData?.performance?.conversionTrend && (
                                                <div className="mt-2 flex items-center text-xs text-emerald-600">
                                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                                    <span>{agentData.performance.conversionTrend}</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Performance Goals</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Target className="h-4 w-4 text-indigo-600" />
                                                    <span className="font-medium">Sales Target</span>
                                                </div>
                                                <span className="text-sm font-semibold">
                          {agentData?.performance?.totalSales} / {agentData?.goals?.salesTarget}
                        </span>
                                            </div>
                                            <Progress
                                                value={agentData?.goals?.salesProgress}
                                                className="h-2"
                                                style={{ backgroundColor: "#f3f4f6" }}
                                            >
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                                    style={{ width: agentData?.goals?.salesProgress ? `${agentData.goals.salesProgress}%` : '0%' }}
                                                ></div>
                                            </Progress>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Home className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">Listings Target</span>
                                                </div>
                                                <span className="text-sm font-semibold">
                          {agentData?.performance?.activeListings} / {agentData?.goals?.listingsTarget}
                        </span>
                                            </div>
                                            <Progress
                                                value={agentData?.goals?.listingsProgress}
                                                className="h-2"
                                                style={{ backgroundColor: "#f3f4f6" }}
                                            >
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                                                    style={{ width: agentData?.goals?.listingsProgress ? `${agentData.goals.listingsProgress}%` : '0%' }}
                                                ></div>
                                            </Progress>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-emerald-600" />
                                                    <span className="font-medium">Clients Target</span>
                                                </div>
                                                <span className="text-sm font-semibold">
                                                    {agentData?.clientsCount} / {agentData?.goals?.clientsTarget}
                                                </span>
                                            </div>
                                            <Progress
                                                value={agentData?.goals?.clientsProgress}
                                                className="h-2"
                                                style={{ backgroundColor: "#f3f4f6" }}
                                            >
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600"
                                                    style={{ width: agentData?.goals?.clientsProgress ? `${agentData.goals.clientsProgress}%` : '0%' }}
                                                ></div>
                                            </Progress>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Dashboard Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5 lg:w-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <TabsTrigger
                            value="overview"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="listings"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
                        >
                            Listings
                        </TabsTrigger>
                        <TabsTrigger
                            value="clients"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
                        >
                            Clients
                        </TabsTrigger>
                        <TabsTrigger
                            value="calendar"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
                        >
                            Calendar
                        </TabsTrigger>
                        <TabsTrigger
                            value="activity"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
                        >
                            Activity
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab Content */}
                    <TabsContent value="overview" className="mt-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-7">
                            <Card className="col-span-7 md:col-span-4 border-0 shadow-lg bg-white dark:bg-gray-800">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div>
                                        <CardTitle className="text-xl font-bold">Monthly Performance</CardTitle>
                                        <CardDescription>Sales and commission overview</CardDescription>
                                    </div>
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
                                </CardHeader>
                                <CardContent className="pt-4">
                                    {overviewLoading ? (
                                        <div className="flex items-center justify-center h-[300px]">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart
                                                data={monthlyPerformance}
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
                                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                                                    </linearGradient>
                                                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e0e0e0" }} />
                                                <YAxis
                                                    yAxisId="left"
                                                    orientation="left"
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
                                                <YAxis
                                                    yAxisId="right"
                                                    orientation="right"
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
                                                        if (name === "sales" || name === "commission") {
                                                            return [
                                                                new Intl.NumberFormat("en-US", {
                                                                    style: "currency",
                                                                    currency: "ZMW",
                                                                    minimumFractionDigits: 0,
                                                                }).format(value as number),
                                                                name === "sales" ? "Sales" : "Commission",
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
                                                    yAxisId="left"
                                                    type="monotone"
                                                    dataKey="sales"
                                                    name="Sales"
                                                    stroke="#4F46E5"
                                                    strokeWidth={3}
                                                    dot={{ r: 4, strokeWidth: 2 }}
                                                    activeDot={{ r: 6, strokeWidth: 0, fill: "#4F46E5" }}
                                                />
                                                <Line
                                                    yAxisId="right"
                                                    type="monotone"
                                                    dataKey="commission"
                                                    name="Commission"
                                                    stroke="#10B981"
                                                    strokeWidth={2}
                                                    dot={{ r: 4, strokeWidth: 2 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                                <CardFooter className="pt-0 border-t flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                                            <span className="text-xs text-muted-foreground">Sales</span>
                                        </div>
                                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                                            <span className="text-xs text-muted-foreground">Commission</span>
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

                            <Card className="col-span-7 md:col-span-3 border-0 shadow-lg bg-white dark:bg-gray-800">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-xl font-bold">Property Types</CardTitle>
                                            <CardDescription>Distribution by category</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" className="text-xs gap-1">
                                            <Filter className="h-3 w-3" />
                                            Filter
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {overviewLoading ? (
                                        <div className="flex items-center justify-center h-[300px]">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                        </div>
                                    ) : (
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
                                                    formatter={(value, name) => [`${value}`, name]}
                                                    contentStyle={{
                                                        borderRadius: "8px",
                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                        border: "none",
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Upcoming Tasks</CardTitle>
                                    <CardDescription>Your schedule for the next few days</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {upcomingTasks.length > 0 ? (
                                        <div className="space-y-4">
                                            {upcomingTasks.slice(0, 3).map((task) => (
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
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                                                <Calendar className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium mb-2">No upcoming tasks</h3>
                                            <p className="text-sm text-muted-foreground">You don't have any scheduled tasks.</p>
                                        </div>
                                    )}
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

                            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                                    <CardDescription>Latest actions on the platform</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {recentActivity.length > 0 ? (
                                        <div className="relative space-y-5">
                                            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
                                            {recentActivity.slice(0, 4).map((activity, index) => (
                                                <div key={activity.id} className="flex items-start gap-4 relative">
                                                    <div className="absolute left-3 -translate-x-1/2 h-6 w-6 rounded-full flex items-center justify-center z-10 bg-indigo-500">
                                                        <CheckCircle className="h-3 w-3 text-white" />
                                                    </div>
                                                    <div className="ml-8 space-y-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 w-full">
                                                        <p className="text-sm">
                                                            <span className="font-medium">You</span> {activity.action}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                                        <p className="text-xs text-indigo-600 dark:text-indigo-400">{activity.details}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                                                <Clock className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                                            <p className="text-sm text-muted-foreground">Your recent actions will appear here.</p>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="border-t pt-4 flex justify-center">
                                    <Button variant="outline" size="sm" className="w-full">
                                        View all activity
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                    </TabsContent>

                    {/* Listings Tab Content */}
                    <TabsContent value="listings" className="mt-6 space-y-6">
                        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-xl font-bold">My Listings</CardTitle>
                                    <CardDescription>Manage your property listings</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search listings..."
                                            className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg w-[200px]"
                                        />
                                    </div>
                                    <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Listing
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {listingsLoading ? (
                                    <div className="flex items-center justify-center h-[300px]">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                    </div>
                                ) : activeListings.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-[300px] text-center">
                                        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                                            <Home className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium mb-2">No listings found</h3>
                                        <p className="text-sm text-muted-foreground mb-4">You don't have any active listings yet.</p>
                                        <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Your First Listing
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {activeListings.map((listing) => (
                                            <Card
                                                key={listing.id}
                                                className="overflow-hidden transition-all hover:shadow-lg group border-0 shadow-md bg-white dark:bg-gray-800"
                                            >
                                                <div className="relative">
                                                    <div className="aspect-video relative overflow-hidden">
                                                        <Image
                                                            src={listing.image || "/placeholder.svg"}
                                                            alt={listing.title}
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-105 duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                    </div>

                                                    <div className="absolute top-3 left-3">
                                                        <Badge className="bg-white/90 text-gray-800 hover:bg-white/100 backdrop-blur-sm">
                                                            {listing.type}
                                                        </Badge>
                                                    </div>

                                                    <div className="absolute top-3 right-3">
                                                        <Badge
                                                            className={`${
                                                                listing.status === "Active"
                                                                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500"
                                                                    : "bg-gradient-to-r from-amber-600 to-amber-500"
                                                            } text-white shadow-sm`}
                                                        >
                                                            {listing.status}
                                                        </Badge>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
                                                    >
                                                        <Heart className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="font-semibold text-lg group-hover:text-indigo-600 transition-colors">
                                                        {listing.title}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                        <MapPin className="mr-1 h-3 w-3" />
                                                        <span>{listing.address}</span>
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{listing.price}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <div className="flex items-center">
                                                                <Eye className="mr-1 h-3 w-3" />
                                                                <span>{listing.views}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <MessageSquare className="mr-1 h-3 w-3" />
                                                                <span>{listing.inquiries}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex items-center gap-4 text-xs">
                                                        <div className="flex items-center gap-1">
                                                            <Bed className="h-3 w-3 text-gray-500" />
                                                            <span>{listing.beds} beds</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Bath className="h-3 w-3 text-gray-500" />
                                                            <span>{listing.baths} baths</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Square className="h-3 w-3 text-gray-500" />
                                                            <span>{listing.sqft} sqft</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            <span>Listed {listing.daysListed} days ago</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="p-4 pt-0 flex justify-between gap-2">
                                                    <Button variant="outline" size="sm" className="w-full border-gray-200 dark:border-gray-700">
                                                        <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="w-full border-gray-200 dark:border-gray-700">
                                                        <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline" size="sm" className="px-2 border-gray-200 dark:border-gray-700">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[160px]">
                                                            <DropdownMenuItem>
                                                                <Share2 className="mr-2 h-4 w-4" /> Share
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Download className="mr-2 h-4 w-4" /> Download
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium">{activeListings.length}</span> of{" "}
                                    <span className="font-medium">{listingsPagination.totalCount}</span> listings
                                </div>
                                {listingsPagination.totalPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={listingsPagination.currentPage === 1 || listingsLoading}
                                            onClick={() => fetchListingsData(listingsPagination.currentPage - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <div className="text-sm">
                                            Page <span className="font-medium">{listingsPagination.currentPage}</span> of{" "}
                                            <span className="font-medium">{listingsPagination.totalPages}</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={listingsPagination.currentPage === listingsPagination.totalPages || listingsLoading}
                                            onClick={() => fetchListingsData(listingsPagination.currentPage + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>

                    </TabsContent>

                    {/* Clients Tab Content */}
                    <TabsContent value="clients" className="mt-6 space-y-6">
                        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-xl font-bold">My Clients</CardTitle>
                                    <CardDescription>Manage your client relationships</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search clients..."
                                            className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg w-[200px]"
                                        />
                                    </div>
                                    <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Client
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {recentClients.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentClients.map((client) => (
                                            <Card key={client.id} className="border border-gray-200 dark:border-gray-700 shadow-sm">
                                                <CardContent className="p-4">
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                                <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
                                                                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <h3 className="font-semibold">{client.name}</h3>
                                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                                                                    <div className="flex items-center">
                                                                        <Mail className="mr-1 h-3 w-3" />
                                                                        <span>{client.email}</span>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Phone className="mr-1 h-3 w-3" />
                                                                        <span>{client.phone}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge variant="outline" className={getStatusBadgeStyles(client.status)}>
                                                                {client.status}
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
                                                            >
                                                                {client.interest}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
                                                            <p className="text-xs text-muted-foreground">Budget</p>
                                                            <p className="font-medium">{client.budget}</p>
                                                        </div>
                                                        <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
                                                            <p className="text-xs text-muted-foreground">Last Contact</p>
                                                            <p className="font-medium">{client.lastContact}</p>
                                                        </div>
                                                        <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
                                                            <p className="text-xs text-muted-foreground">Notes</p>
                                                            <p className="text-sm line-clamp-1">{client.notes}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex justify-end gap-2">
                                                        <Button variant="outline" size="sm">
                                                            <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Message
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" size="sm" className="px-2">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                                <DropdownMenuItem>
                                                                    <Calendar className="mr-2 h-4 w-4" /> Schedule Meeting
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <FileText className="mr-2 h-4 w-4" /> View History
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Remove Client
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                                            <Users className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium mb-2">No clients found</h3>
                                        <p className="text-sm text-muted-foreground">You don't have any clients yet.</p>
                                        <Button className="mt-4 bg-gradient-to-r from-indigo-600 to-indigo-500">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Your First Client
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="border-t pt-4 flex justify-between">
                                <div className="text-sm text-muted-foreground">
                                    {recentClients.length > 0 ? (
                                        <>
                                            Showing <span className="font-medium">{recentClients.length}</span> clients
                                        </>
                                    ) : (
                                        <>No clients to display</>
                                    )}
                                </div>
                                <Button variant="outline" size="sm">
                                    View All Clients
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Calendar Tab Content */}
                    <TabsContent value="calendar" className="mt-6 space-y-6">
                        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-xl font-bold">My Schedule</CardTitle>
                                    <CardDescription>Manage your appointments and tasks</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Today
                                    </Button>
                                    <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Event
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    {upcomingTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4"
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
                                                    <p className="font-medium">{task.title}</p>
                                                </div>
                                                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                    <p className="text-sm text-muted-foreground flex items-center">
                                                        <Calendar className="mr-1 h-3 w-3" />
                                                        {task.date}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground flex items-center">
                                                        <User className="mr-1 h-3 w-3" />
                                                        {task.client}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground flex items-center">
                                                        <MapPin className="mr-1 h-3 w-3" />
                                                        {task.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={getPriorityBadgeStyles(task.priority)}>
                                                    {task.priority}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="border-t pt-4 flex justify-between">
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    Mark all as complete
                                </Button>
                                <Button variant="ghost" size="sm" className="text-indigo-600">
                                    View Full Calendar
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Activity Tab Content */}
                    <TabsContent value="activity" className="mt-6 space-y-6">
                        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                                    <CardDescription>Your latest actions and updates</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filter
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="relative space-y-5">
                                    <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
                                    {recentActivity.map((activity, index) => (
                                        <div key={activity.id} className="flex items-start gap-4 relative">
                                            <div className="absolute left-3 -translate-x-1/2 h-6 w-6 rounded-full flex items-center justify-center z-10 bg-indigo-500">
                                                <CheckCircle className="h-3 w-3 text-white" />
                                            </div>
                                            <div className="ml-8 space-y-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 w-full">
                                                <p className="text-sm">
                                                    <span className="font-medium">You</span> {activity.action}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                                                <p className="text-xs text-indigo-600 dark:text-indigo-400">{activity.details}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="border-t pt-4 flex justify-center">
                                <Button variant="outline" size="sm" className="w-full">
                                    Load more activity
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Notifications</CardTitle>
                                <CardDescription>Recent system notifications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                                        <Bell className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">No notifications</h3>
                                    <p className="text-sm text-muted-foreground">You don't have any notifications yet.</p>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t pt-4 flex justify-between">
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    Mark all as read
                                </Button>
                                <Button variant="ghost" size="sm" className="text-indigo-600">
                                    View All Notifications
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
