"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    MapPin,
    Search,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Grid,
    ListIcon,
    Filter,
    ArrowUpDown,
    Loader2,
    Calendar,
    Clock,
    Star,
    ArrowUpRight,
    Download,
    Share2,
    Home,
    Globe,
    Map,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Location {
    id: number
    name: string
    region: string
    description: string
    featured: boolean
    image: string
    count: number
    createdAt: string
    growth: string
    avgPrice: string
}

interface RegionStat {
    name: string
    count: number
    growth: string
    avgPrice: string
}

export default function LocationsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [locationToDelete, setLocationToDelete] = useState<number | null>(null)
    const [sortBy, setSortBy] = useState<"name" | "count" | "createdAt">("name")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const [activeTab, setActiveTab] = useState("all")
    const [locations, setLocations] = useState<Location[]>([])
    const [regionStats, setRegionStats] = useState<RegionStat[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchLocations()
        fetchRegionStats()
    }, [searchQuery, sortBy, sortOrder, activeTab])

    const fetchLocations = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const params = new URLSearchParams({
                search: searchQuery,
                sortBy,
                sortOrder,
                featured: activeTab === "featured" ? "true" : activeTab === "standard" ? "false" : ""
            })
            const response = await fetch(`/api/featured-locations?${params}`)
            if (!response.ok) {
                throw new Error('Failed to fetch locations')
            }
            const data = await response.json()
            setLocations(data)
        } catch (error) {
            console.error("Error fetching locations:", error)
            setError("Failed to load locations. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchRegionStats = async () => {
        try {
            setError(null)
            const response = await fetch("/api/featured-locations/region-stats")
            if (!response.ok) {
                throw new Error('Failed to fetch region stats')
            }
            const data = await response.json()
            setRegionStats(data)
        } catch (error) {
            console.error("Error fetching region stats:", error)
            setError("Failed to load region statistics. Please try again later.")
        }
    }

    const handleSort = (field: "name" | "count" | "createdAt") => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(field)
            setSortOrder("asc")
        }
    }

    const handleDeleteClick = (id: number) => {
        setLocationToDelete(id)
        setShowDeleteDialog(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await fetch(`/api/featured-locations/${locationToDelete}`, {
                method: "DELETE"
            })
            if (!response.ok) {
                throw new Error('Failed to delete location')
            }
            await fetchLocations()
        } catch (error) {
            console.error("Error deleting location:", error)
            setError("Failed to delete location. Please try again later.")
        } finally {
            setIsLoading(false)
            setShowDeleteDialog(false)
        }
    }

    const getStatusBadgeStyles = (featured: boolean) => {
        return featured
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30"
            : "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700/50"
    }

    const getRegionBadgeStyles = (region: string) => {
        switch (region) {
            case "Copperbelt":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
            case "Central":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/30"
            case "Southern":
                return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30"
            default:
                return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
                {/* Error message */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Loading state */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                )}

                {/* Page Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Locations Management
                        </h1>
                        <p className="text-muted-foreground">Manage featured locations and property distribution across regions</p>
                    </div>
                    <Button
                        className="shrink-0 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
                        asChild
                    >
                        <Link href="/dashboard/FeaturedLocations/add">
                            <Plus className="mr-2 h-4 w-4" /> Add Location
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {regionStats.map((region, index) => (
                        <Card key={index} className="overflow-hidden border-0 shadow-md bg-white dark:bg-gray-800">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{region.name} Region</p>
                                        <h3 className="text-xl font-bold mt-1">{region.count} Properties</h3>
                                        <p className="mt-1 text-xs text-emerald-600 flex items-center">
                                            <ArrowUpRight className="mr-1 h-3 w-3" />
                                            {region.growth} growth
                                        </p>
                                    </div>
                                    <div className={`rounded-full ${getRegionBadgeStyles(region.name)} p-3`}>
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground">
                                    Average Price: <span className="font-medium text-indigo-600">{region.avgPrice}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Search and Filters */}
                <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Search locations by name, region, or description..."
                                    className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                                        <DropdownMenuItem onSelect={() => setActiveTab("featured")}>
                                            <Star className="mr-2 h-4 w-4" />
                                            <span>Featured Locations</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setActiveTab("standard")}>
                                            <MapPin className="mr-2 h-4 w-4" />
                                            <span>Standard Locations</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onSelect={() => setActiveTab("all")}>
                                            <Globe className="mr-2 h-4 w-4" />
                                            <span>All Locations</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                                            <ArrowUpDown className="mr-2 h-4 w-4" />
                                            Sort
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleSort("name")}>
                                            <span>Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSort("count")}>
                                            <span>Property Count {sortBy === "count" && (sortOrder === "asc" ? "↑" : "↓")}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                                            <span>Date Added {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>


                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
                                <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1">
                                    <TabsTrigger
                                        value="all"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                                    >
                                        All
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="featured"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                                    >
                                        Featured
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="standard"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                                    >
                                        Standard
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                <div className="text-sm text-muted-foreground mr-2 hidden sm:block">
                                    {locations.length} location{locations.length !== 1 ? "s" : ""}
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex items-center">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="sm"
                                        className="h-8 rounded-md"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <Grid className="h-4 w-4 mr-1" />
                                        <span className="hidden sm:inline">Grid</span>
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="sm"
                                        className="h-8 rounded-md"
                                        onClick={() => setViewMode("list")}
                                    >
                                        <ListIcon className="h-4 w-4 mr-1" />
                                        <span className="hidden sm:inline">List</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {locations.length === 0 ? (
                    <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="rounded-full bg-gray-100 dark:bg-gray-900 p-3 mb-4">
                                <Search className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium mb-1">No locations found</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {searchQuery ? "Try adjusting your search terms" : "Add your first location to get started"}
                            </p>
                            {searchQuery ? (
                                <Button variant="outline" onClick={() => setSearchQuery("")}>
                                    Clear search
                                </Button>
                            ) : (
                                <Button
                                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white"
                                    asChild
                                >
                                    <Link href="/dashboard/locations/add">
                                        <Plus className="mr-2 h-4 w-4" /> Add Location
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {locations.map((location) => (
                            <Card
                                key={location.id}
                                className="overflow-hidden transition-all hover:shadow-lg group border-0 shadow-md bg-white dark:bg-gray-800"
                            >
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={location.image || "/placeholder.svg"}
                                        alt={location.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    {location.featured && (
                                        <div className="absolute right-3 top-3">
                                            <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white">
                                                <Star className="mr-1 h-3 w-3 fill-white" /> Featured
                                            </Badge>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <Badge
                                            variant="outline"
                                            className={`bg-white/80 backdrop-blur-sm ${getRegionBadgeStyles(location.region)}`}
                                        >
                                            {location.region}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                                        <div className="flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm px-2 py-1 text-xs text-white">
                                            <Home className="h-3 w-3" />
                                            <span>{location.count} Properties</span>
                                        </div>
                                        <div className="flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm px-2 py-1 text-xs text-white">
                                            <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                                            <span>{location.growth}</span>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold group-hover:text-indigo-600 transition-colors">
                                            {location.name}
                                        </h3>
                                        <div className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                            {location.avgPrice}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{location.description}</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            Added {location.createdAt ? new Date(location.createdAt).toLocaleDateString() : "N/A"}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="mr-1 h-3 w-3" />
                                            Last updated 2 days ago
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex justify-between gap-2 border-t border-gray-100 dark:border-gray-700 mt-3">
                                    <Button variant="outline" size="sm" className="w-full border-gray-200 dark:border-gray-700" asChild>
                                        <Link href={`/dashboard/FeaturedLocations/${location.id}`}>
                                            <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full border-gray-200 dark:border-gray-700" asChild>
                                        <Link href={`/dashboard/FeaturedLocations/edit/${location.id}`}>
                                            <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                                        </Link>
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="px-2 border-gray-200 dark:border-gray-700">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/FeaturedLocations/${location.id}`} className="cursor-pointer">
                                                    <Map className="mr-2 h-4 w-4" /> View Map
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Share2 className="mr-2 h-4 w-4" /> Share
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 cursor-pointer"
                                                onClick={() => handleDeleteClick(location.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-0 shadow-md bg-white dark:bg-gray-800 overflow-hidden">
                        <ScrollArea className="h-[calc(100vh-320px)] rounded-md">
                            <div className="min-w-[800px]">
                                <Table>
                                    <TableHeader className="bg-gray-50 dark:bg-gray-900">
                                        <TableRow>
                                            <TableHead className="w-[300px]">Location</TableHead>
                                            <TableHead className="w-[120px]">Region</TableHead>
                                            <TableHead className="w-[100px]">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="-ml-3 h-8 data-[state=open]:bg-accent"
                                                    onClick={() => handleSort("count")}
                                                >
                                                    Properties
                                                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                                                </Button>
                                            </TableHead>
                                            <TableHead className="w-[100px]">Status</TableHead>
                                            <TableHead className="w-[100px]">Growth</TableHead>
                                            <TableHead className="w-[120px]">Average Price</TableHead>
                                            <TableHead className="w-[120px]">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="-ml-3 h-8 data-[state=open]:bg-accent"
                                                    onClick={() => handleSort("createdAt")}
                                                >
                                                    Date Added
                                                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                                                </Button>
                                            </TableHead>
                                            <TableHead className="text-right w-[100px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {locations.map((location) => (
                                            <TableRow key={location.id} className="group">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative h-12 w-12 overflow-hidden rounded-md shrink-0">
                                                            <Image
                                                                src={location.image || "/placeholder.svg"}
                                                                alt={location.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-medium truncate group-hover:text-indigo-600 transition-colors">
                                                                {location.name}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                                                {location.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={getRegionBadgeStyles(location.region)}>
                                                        {location.region}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{location.count}</div>
                                                    <div className="text-xs text-muted-foreground">Properties</div>
                                                </TableCell>
                                                <TableCell>
                                                    {location.featured ? (
                                                        <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white">
                                                            <Star className="mr-1 h-3 w-3 fill-white" /> Featured
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">Standard</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-emerald-600 dark:text-emerald-400 flex items-center">
                                                        <ArrowUpRight className="mr-1 h-3 w-3" />
                                                        {location.growth}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-indigo-600 dark:text-indigo-400">
                                                        {location.avgPrice}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{location.createdAt ? new Date(location.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                                                        <Link href={`/dashboard/FeaturedLocations/${location.id}`}>
                                                                            <Eye className="h-4 w-4" />
                                                                            <span className="sr-only">View</span>
                                                                        </Link>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>View details</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                                                        <Link href={`/dashboard/FeaturedLocations/edit/${location.id}`}>
                                                                            <Edit className="h-4 w-4" />
                                                                            <span className="sr-only">Edit</span>
                                                                        </Link>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Edit location</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        <DropdownMenu>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                                <MoreHorizontal className="h-4 w-4" />
                                                                                <span className="sr-only">More options</span>
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>More options</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/dashboard/FeaturedLocations/${location.id}`} className="cursor-pointer">
                                                                        <Map className="mr-2 h-4 w-4" /> View Map
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                                                    onClick={() => handleDeleteClick(location.id)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </ScrollArea>
                    </Card>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Delete Location</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this location? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-sm text-muted-foreground">
                                Deleting this location will remove it from your website and all associated properties will be unlinked.
                            </p>
                        </div>
                        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowDeleteDialog(false)}
                                disabled={isLoading}
                                className="border-gray-200 dark:border-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDeleteConfirm}
                                disabled={isLoading}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Location"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Call to Action */}
                <Card className="border-0 shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Ready to expand your property listings?</h3>
                                <p className="text-indigo-100">Add new locations to reach more potential buyers and renters.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" className="border border-white/20 text-white hover:bg-white/10">
                                    <Map className="mr-2 h-4 w-4" />
                                    View Map
                                </Button>
                                <Button className="bg-white text-indigo-700 hover:bg-indigo-100" asChild>
                                    <Link href="/dashboard/locations/add">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Location
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
