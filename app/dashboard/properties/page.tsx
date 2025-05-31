"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Filter,
  Home,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Calendar,
  Building2,
  Building,
  Warehouse,
  ParkingCircle,
  DollarSign,
  X,
  Clock,
  Tag,
  Map,
  Download,
  Share2,
  Loader2,
} from "lucide-react"
import PropertyList from "@/app/dashboard/PropertyList"

export default function PropertiesPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [properties, setProperties] = useState<any[]>([])
  const [stats, setStats] = useState<any>({
    overview: { totalProperties: 0, averagePrice: 0, priceRange: { min: 0, max: 0 } },
    distributions: { status: [], propertyTypes: [] }
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [selectedTab, setSelectedTab] = useState<string>("all")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch properties
        const statusFilter = selectedTab !== "all" ? 
          selectedTab === "sale" ? "For Sale" :
          selectedTab === "rent" ? "For Rent" :
          selectedTab === "sold" ? "Sold" : "" : "";

        const propertiesResponse = await fetch(`/api/properties?page=${currentPage}&limit=10${statusFilter ? `&status=${statusFilter}` : ""}`)

        if (!propertiesResponse.ok) {
          throw new Error("Failed to fetch properties")
        }

        const propertiesData = await propertiesResponse.json()
        // Check if the response is an array (direct properties) or an object with pagination
        if (Array.isArray(propertiesData)) {
          setProperties(propertiesData)
          setTotalPages(1) // Default to 1 page if no pagination info
        } else {
          // Handle case where response includes pagination info
          setProperties(propertiesData.properties || [])
          setTotalPages(propertiesData.pagination?.pages || 1)
        }

        // Fetch stats
        const statsResponse = await fetch("/api/properties/stats")

        if (!statsResponse.ok) {
          throw new Error("Failed to fetch property statistics")
        }

        const statsData = await statsResponse.json()
        setStats(statsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage, selectedTab])

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Properties
              </h2>
              <p className="text-muted-foreground">Manage your real estate property listings</p>
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
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              // Loading skeleton for stats cards
              Array(4).fill(0).map((_, index) => (
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
              ))
            ) : error ? (
              <div className="col-span-4 p-4 text-center text-red-500">
                <p>Error loading statistics: {error}</p>
              </div>
            ) : (
              [
                {
                  title: "Total Properties",
                  value: stats.overview?.totalProperties?.toString() || "0",
                  icon: <Home className="h-5 w-5" />,
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                },
                {
                  title: "For Sale",
                  value: stats.distributions?.status?.find((s: any) => s.status === "For Sale")?._count?.toString() || "0",
                  icon: <Tag className="h-5 w-5" />,
                  color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
                },
                {
                  title: "For Rent",
                  value: stats.distributions?.status?.find((s: any) => s.status === "For Rent")?._count?.toString() || "0",
                  icon: <Building className="h-5 w-5" />,
                  color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
                },
                {
                  title: "Average Price",
                  value: `K ${Math.round(stats.overview?.averagePrice || 0).toLocaleString()}`,
                  icon: <DollarSign className="h-5 w-5" />,
                  color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
                },
              ].map((stat, index) => (
                <Card key={index} className="overflow-hidden border-0 shadow-md bg-white dark:bg-gray-800">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      </div>
                      <div className={`rounded-full p-3 ${stat.color}`}>{stat.icon}</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Search and Filters */}
          <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      placeholder="Search properties by name, location, or ID..."
                      className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Property Filters</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => addFilter("For Sale")}>
                          <Tag className="mr-2 h-4 w-4" />
                          <span>For Sale</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => addFilter("For Rent")}>
                          <Building className="mr-2 h-4 w-4" />
                          <span>For Rent</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => addFilter("Apartment")}>
                          <Building2 className="mr-2 h-4 w-4" />
                          <span>Apartment</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => addFilter("House")}>
                          <Home className="mr-2 h-4 w-4" />
                          <span>House</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => addFilter("Commercial")}>
                          <Warehouse className="mr-2 h-4 w-4" />
                          <span>Commercial</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => addFilter("With Parking")}>
                          <ParkingCircle className="mr-2 h-4 w-4" />
                          <span>With Parking</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => addFilter("Price < $500k")}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          <span>Price &lt; $500k</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
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
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Newest First</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Oldest First</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>Price: Low to High</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>Price: High to Low</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700" onClick={() => {}}>
                    <Map className="mr-2 h-4 w-4" />
                    Map View
                  </Button>

                  <div className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-900">
                    <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {activeFilters.map((filter) => (
                        <Badge
                            key={filter}
                            variant="secondary"
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {filter}
                          <button
                              className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                              onClick={() => removeFilter(filter)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                    ))}
                    <Button
                        variant="link"
                        size="sm"
                        className="text-xs h-6 px-2 text-muted-foreground"
                        onClick={() => setActiveFilters([])}
                    >
                      Clear all
                    </Button>
                  </div>
              )}
            </CardContent>
          </Card>

          {/* Property Categories */}
          <Tabs 
            defaultValue="all" 
            className="w-full"
            value={selectedTab}
            onValueChange={(value) => {
              setSelectedTab(value);
              setCurrentPage(1); // Reset to first page when changing tabs
            }}
          >
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                All
              </TabsTrigger>
              <TabsTrigger value="sale" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                For Sale
              </TabsTrigger>
              <TabsTrigger value="rent" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                For Rent
              </TabsTrigger>
              <TabsTrigger value="sold" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                Sold
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Property List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {loading ? (
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : error ? (
                <p className="text-sm text-red-500">Error: {error}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{properties.length}</span> of <span className="font-medium">{stats.overview?.totalProperties || 0}</span> properties
                </p>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {loading ? (
              // Loading skeleton for property list
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array(6).fill(0).map((_, index) => (
                  <Card key={index} className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800 rounded-xl">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="h-56 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      </div>
                      <div className="p-5 space-y-4">
                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="grid grid-cols-3 gap-2">
                          {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-500 mb-2">Failed to load properties</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : properties.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground mb-2">No properties found</p>
                <Button 
                  onClick={() => {
                    setSelectedTab("all");
                    setActiveFilters([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <PropertyList properties={properties} />
            )}

            {/* Pagination */}
            {!loading && !error && properties.length > 0 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button 
                        key={i} 
                        variant="outline" 
                        size="sm" 
                        className={pageNum === currentPage ? "bg-indigo-50 text-indigo-600 border-indigo-200" : ""}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  )
}
