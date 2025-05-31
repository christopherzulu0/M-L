"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { 
    MapPin, 
    ArrowLeft, 
    Home, 
    Calendar, 
    Clock, 
    Star, 
    ArrowUpRight, 
    Edit, 
    Share2, 
    Download, 
    Loader2, 
    Map as MapIcon,
    Globe,
    Building,
    Users,
    Navigation
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

// Define types for the location data
type Property = {
    id: number;
    title: string;
    description?: string | null;
    price: string | number;
    address: string;
    latitude?: string | number | null;
    longitude?: string | number | null;
    propertyType?: {
        name: string;
    };
    media?: Array<{
        filePath: string;
        isPrimary: boolean;
    }>;
}

type Location = {
    id: number;
    name: string;
    city?: string;
    stateProvince?: string | null;
    country?: string;
    postalCode?: string | null;
    region: string | null;
    description: string | null;
    featured: boolean;
    order: number;
    image: string | null;
    properties?: Property[];
    count?: number;
    createdAt?: string;
    growth?: string;
    avgPrice?: string;
}

// Dynamically import the Map components to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
)
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
)
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
)
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
)

// Custom icon for the map marker
const createMapIcon = () => {
    if (typeof window === 'undefined') return null;

    // Import Leaflet only on client side
    const L = require('leaflet');

    return L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-emerald-500 text-white rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
               </div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};

export default function ViewLocationPage() {
    const params = useParams()
    const locationId = params.id as string

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [location, setLocation] = useState<Location | null>(null)
    const [activeTab, setActiveTab] = useState("overview")

    // Log when activeTab changes
    useEffect(() => {
        console.log("Active tab changed to:", activeTab);

        // Additional logging for map tab
        if (activeTab === "map") {
            console.log("Map tab activated");

            // Check if Leaflet CSS is loaded
            if (typeof window !== 'undefined') {
                const leafletCssLoaded = document.querySelector('link[href*="leaflet.css"]');
                console.log("Leaflet CSS loaded (in tab change):", !!leafletCssLoaded);
            }
        }
    }, [activeTab])
    const [mapIcon, setMapIcon] = useState(null)

    // Fetch the location data
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await fetch(`/api/featured-locations/${locationId}`)

                if (!response.ok) {
                    throw new Error('Failed to fetch location')
                }

                const data = await response.json()
                console.log("Location data from API:", data)
                console.log("Properties in location data:", data.properties)
                setLocation(data)
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching location:", error)
                setError("Failed to load location. Please try again later.")
                setIsLoading(false)
            }
        }

        if (locationId) {
            fetchLocation()
        }
    }, [locationId])

    // Initialize map icon when component mounts
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const icon = createMapIcon();
            console.log("Map icon created:", icon);
            setMapIcon(icon);

            // Check if Leaflet CSS is loaded
            const leafletCssLoaded = document.querySelector('link[href*="leaflet.css"]');
            console.log("Leaflet CSS loaded:", !!leafletCssLoaded);
        }
    }, [])

    const getRegionBadgeStyles = (region: string | null) => {
        if (!region) return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30"

        switch (region) {
            case "Copperbelt Province":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
            case "Central Province":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/30"
            case "Southern Province":
                return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30"
            case "Lusaka Province":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30"
            default:
                return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30"
        }
    }

    return (
        <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
                            <Link href="/dashboard/FeaturedLocations">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Back to locations</span>
                            </Link>
                        </Button>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {isLoading ? "Loading Location..." : location?.name || "Location Details"}
                        </h2>
                    </div>
                    <p className="text-muted-foreground">
                        {isLoading ? "Loading details..." : `View details for ${location?.name || "this location"}`}
                    </p>
                </div>
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <Link href="/dashboard/FeaturedLocations">
                            Back to Locations
                        </Link>
                    </Button>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href={`/dashboard/FeaturedLocations/edit/${locationId}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Location
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-lg font-medium">Loading location details...</p>
                        <p className="text-sm text-muted-foreground mt-2">Please wait while we fetch the information</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/30">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mb-4">
                                <MapPin className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Error Loading Location</h3>
                            <p className="text-sm text-red-600/80 dark:text-red-400/80 max-w-md mb-4">{error}</p>
                            <Button variant="outline" className="border-red-200 text-red-600" asChild>
                                <Link href="/dashboard/FeaturedLocations">
                                    Return to Locations
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Location Content */}
            {!isLoading && !error && location && (
                <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Image */}
                        <div className="relative w-full overflow-hidden rounded-xl shadow-md aspect-[21/9] bg-slate-100 dark:bg-slate-800">
                            <Image
                                src={location.image || "/placeholder.svg"}
                                alt={location.name}
                                fill
                                className="object-cover"
                                priority
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/placeholder.svg";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            {location.featured && (
                                <div className="absolute right-4 top-4">
                                    <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-3 py-1">
                                        <Star className="mr-1 h-3 w-3 fill-white" /> Featured Location
                                    </Badge>
                                </div>
                            )}
                            <div className="absolute left-4 top-4">
                                <Badge
                                    variant="outline"
                                    className={`bg-white/80 backdrop-blur-sm ${getRegionBadgeStyles(location.region)}`}
                                >
                                    {location.region || "No Region"}
                                </Badge>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                                <div className="flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm px-3 py-1.5 text-sm text-white">
                                    <Home className="h-4 w-4" />
                                    <span>{location.properties?.length || 0} Properties</span>
                                </div>
                                {location.growth && (
                                    <div className="flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm px-3 py-1.5 text-sm text-white">
                                        <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                                        <span>{location.growth}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1">
                                <TabsTrigger
                                    value="overview"
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="properties"
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                                >
                                    Properties
                                </TabsTrigger>
                                <TabsTrigger
                                    value="map"
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                                >
                                    Map View
                                </TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="mt-6">
                                <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-2xl">{location.name}</CardTitle>
                                        <CardDescription>
                                            {location.region && (
                                                <span className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                                    {location.region}
                                                </span>
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">About this Location</h3>
                                            <div className="relative">
                                                <p className="text-muted-foreground whitespace-pre-line max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                                    {location.description || "No description available for this location."}
                                                </p>
                                                {location.description && location.description.length > 300 && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
                                                )}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">Properties</p>
                                                <p className="text-xl font-semibold">{location.properties?.length || 0}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">Growth</p>
                                                <p className="text-xl font-semibold text-emerald-600 flex items-center">
                                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                                    {location.growth || "0%"}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">Average Price</p>
                                                <p className="text-xl font-semibold">{location.avgPrice || "N/A"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">Added On</p>
                                                <p className="text-xl font-semibold">
                                                    {location.createdAt ? new Date(location.createdAt).toLocaleDateString() : "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-medium mb-4">Location Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Country</p>
                                                        <p className="font-medium">{location.country || "Zambia"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">City</p>
                                                        <p className="font-medium">{location.city || location.name}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Region/Province</p>
                                                        <p className="font-medium">{location.region || "Not specified"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Postal Code</p>
                                                        <p className="font-medium">{location.postalCode || "Not specified"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between border-t pt-6">
                                        <Button variant="outline" asChild>
                                            <Link href="/dashboard/FeaturedLocations">
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Back to Locations
                                            </Link>
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => setActiveTab("map")}>
                                                <MapIcon className="mr-2 h-4 w-4" />
                                                View Map
                                            </Button>
                                            <Button variant="outline" onClick={() => setActiveTab("properties")}>
                                                <Home className="mr-2 h-4 w-4" />
                                                View Properties
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            {/* Properties Tab */}
                            <TabsContent value="properties" className="mt-6">
                                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-gray-800 dark:to-gray-750 border-b border-slate-100 dark:border-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Home className="h-5 w-5 text-emerald-500" />
                                            <CardTitle>Properties in {location.name}</CardTitle>
                                        </div>
                                        <CardDescription className="flex items-center">
                                            <Badge variant="outline" className="mr-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30">
                                                {location.properties?.length || 0}
                                            </Badge>
                                            properties found in this location
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        {console.log("Properties tab rendering, properties:", location.properties)}
                                        {(location.properties?.length || 0) > 0 ? (
                                            <div className="grid gap-6 grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                                {location.properties?.map((property, index) => (
                                                    <Card key={index} className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                                                            {/* Image loading indicator */}
                                                            <div className="absolute inset-0 flex items-center justify-center z-0">
                                                                <Loader2 className="h-8 w-8 animate-spin text-slate-300 dark:text-slate-600" />
                                                            </div>
                                                            <Image
                                                                src={
                                                                    // First try to find the primary image
                                                                    property.media?.find(m => m.isPrimary)?.filePath ||
                                                                    // Then try to use the first image
                                                                    (property.media && property.media.length > 0 ? property.media[0].filePath : "/placeholder.svg")
                                                                }
                                                                alt={property.title || `Property ${index + 1}`}
                                                                fill
                                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                                priority={index < 6}
                                                                className="object-cover z-10 transition-all duration-500 hover:scale-110"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = "/placeholder.svg";
                                                                }}
                                                            />
                                                            {/* Gradient overlay */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20 opacity-0 hover:opacity-100 transition-opacity duration-300" />

                                                            {/* Property type badge */}
                                                            <div className="absolute top-3 right-3 z-30">
                                                                <Badge className="bg-white/90 text-slate-800 dark:bg-slate-800/90 dark:text-slate-200 backdrop-blur-sm font-medium px-2.5 py-1 shadow-sm">
                                                                    {property.propertyType?.name || "Residential"}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <CardContent className="p-5 flex-grow flex flex-col">
                                                            <h3 className="font-bold mb-2 text-lg text-slate-800 dark:text-slate-100">{property.title || `Property ${index + 1}`}</h3>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 flex-grow" title={property.description || "No description available"}>
                                                                {property.description || "No description available"}
                                                            </p>
                                                            <div className="pt-2 mt-auto border-t border-slate-100 dark:border-slate-800">
                                                                <p className="font-bold text-lg text-emerald-600 dark:text-emerald-500">{property.price || "Price on request"}</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                                <div className="relative">
                                                    <div className="absolute -inset-4 rounded-full bg-emerald-100/50 dark:bg-emerald-900/20 blur-xl"></div>
                                                    <div className="relative rounded-full bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-700 p-5 mb-6 shadow-md border border-slate-200 dark:border-slate-700">
                                                        <Home className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">No Properties Found</h3>
                                                <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
                                                    There are currently no properties listed in <span className="font-medium text-emerald-600 dark:text-emerald-400">{location.name}</span>.
                                                    You can add properties to showcase this location.
                                                </p>
                                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6">
                                                    <Home className="mr-2 h-4 w-4" />
                                                    Add a Property
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Map Tab */}
                            <TabsContent value="map" className="mt-6">
                                <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                                    <CardHeader>
                                        <CardTitle>Map View</CardTitle>
                                        <CardDescription>
                                            Geographic location of {location.name} and its properties
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Filter properties with valid coordinates */}
                                        {(() => {
                                            // Get properties with valid coordinates
                                            const propertiesWithCoordinates = location.properties?.filter(
                                                property => 
                                                    property.latitude && 
                                                    property.longitude && 
                                                    !isNaN(Number(property.latitude)) && 
                                                    !isNaN(Number(property.longitude))
                                            ) || [];

                                            console.log("Properties with coordinates:", propertiesWithCoordinates);
                                            console.log("All properties:", location.properties);

                                            // Log detailed property coordinates for debugging
                                            if (location.properties && location.properties.length > 0) {
                                                console.log("Detailed property coordinates:");
                                                location.properties.forEach((property, index) => {
                                                    console.log(`Property ${index + 1} (${property.title}):`);
                                                    console.log(`  - latitude: ${property.latitude} (${typeof property.latitude})`);
                                                    console.log(`  - longitude: ${property.longitude} (${typeof property.longitude})`);
                                                    console.log(`  - Has valid coordinates: ${!!(property.latitude && 
                                                        property.longitude && 
                                                        !isNaN(Number(property.latitude)) && 
                                                        !isNaN(Number(property.longitude)))}`);
                                                });
                                            }

                                            // Calculate center point if we have properties with coordinates
                                            let centerLat = -15.4167; // Default to Zambia's center
                                            let centerLng = 28.2833;
                                            let defaultZoom = 6;

                                            if (propertiesWithCoordinates.length > 0) {
                                                // Calculate average lat/lng as center point
                                                const totalLat = propertiesWithCoordinates.reduce(
                                                    (sum, property) => sum + Number(property.latitude), 
                                                    0
                                                );
                                                const totalLng = propertiesWithCoordinates.reduce(
                                                    (sum, property) => sum + Number(property.longitude), 
                                                    0
                                                );

                                                centerLat = totalLat / propertiesWithCoordinates.length;
                                                centerLng = totalLng / propertiesWithCoordinates.length;
                                                defaultZoom = propertiesWithCoordinates.length === 1 ? 14 : 10;
                                            }

                                            if (propertiesWithCoordinates.length === 0) {
                                                return (
                                                    <div className="relative h-[400px] w-full bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                                                        <div className="text-center">
                                                            <MapIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                                <p className="text-lg font-medium">No Properties with Location Data</p>
                                                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30">
                                                                    {location.properties?.length || 0}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mt-2 max-w-md">
                                                                There are {location.properties?.length || 0} properties in this location, but none have geographic coordinates.
                                                                Add latitude and longitude data to properties to see them on the map.
                                                                <span className="block mt-2 text-xs italic">
                                                                    Tip: You can add coordinates by editing each property in the properties management section.
                                                                </span>
                                                            </p>
                                                            <div className="mt-4">
                                                                <Button variant="outline" size="sm" onClick={() => setActiveTab("properties")}>
                                                                    <Home className="mr-2 h-4 w-4" />
                                                                    View Properties
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            console.log("Rendering map component with center:", [centerLat, centerLng], "and zoom:", defaultZoom);
                                            console.log("Map icon available:", !!mapIcon);

                                            // Check if Leaflet is available
                                            if (typeof window !== 'undefined') {
                                                try {
                                                    const L = require('leaflet');
                                                    console.log("Leaflet library loaded:", !!L);
                                                } catch (error) {
                                                    console.error("Error loading Leaflet:", error);
                                                }
                                            }

                                            return (
                                                <div className="relative h-[500px] w-full rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
                                                    {console.log("Rendering MapContainer component")}
                                                    <MapContainer 
                                                        center={[centerLat, centerLng]} 
                                                        zoom={defaultZoom} 
                                                        style={{ height: '100%', width: '100%' }}
                                                        className="z-0"
                                                        whenCreated={(map) => console.log("Map instance created:", !!map)}
                                                    >
                                                        <TileLayer
                                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        />

                                                        {propertiesWithCoordinates.map((property, index) => (
                                                            <Marker 
                                                                key={property.id || index}
                                                                position={[Number(property.latitude), Number(property.longitude)]}
                                                                icon={mapIcon}
                                                            >
                                                                <Popup maxWidth={300}>
                                                                    <div className="p-2 w-[280px]">
                                                                        {/* Property Image */}
                                                                        <div className="relative w-full h-36 mb-2 rounded-md overflow-hidden bg-slate-100 shadow-sm">
                                                                            {/* Loading indicator */}
                                                                            <div className="absolute inset-0 flex items-center justify-center z-0">
                                                                                <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                                                                            </div>
                                                                            <Image
                                                                                src={
                                                                                    // First try to find the primary image
                                                                                    property.media?.find(m => m.isPrimary)?.filePath ||
                                                                                    // Then try to use the first image
                                                                                    (property.media && property.media.length > 0 ? property.media[0].filePath : "/placeholder.svg")
                                                                                }
                                                                                alt={property.title || "Property"}
                                                                                fill
                                                                                className="object-cover z-10"
                                                                                onError={(e) => {
                                                                                    const target = e.target as HTMLImageElement;
                                                                                    target.src = "/placeholder.svg";
                                                                                }}
                                                                            />
                                                                            {/* Gradient overlay */}
                                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-20" />
                                                                        </div>

                                                                        {/* Property Details */}
                                                                        <h3 className="font-semibold text-sm">{property.title}</h3>
                                                                        <p className="text-xs text-muted-foreground mt-1">{property.address}</p>
                                                                        <p className="text-xs font-medium text-emerald-600 mt-1">{property.price}</p>

                                                                        {/* Property Type Badge */}
                                                                        {property.propertyType && (
                                                                            <div className="mt-2">
                                                                                <Badge variant="outline" className="text-xs">
                                                                                    {property.propertyType.name}
                                                                                </Badge>
                                                                            </div>
                                                                        )}

                                                                        {/* Get Directions Button */}
                                                                        <div className="mt-3">
                                                                            <Button 
                                                                                size="sm" 
                                                                                className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    // Prevent the popup from closing
                                                                                    e.preventDefault();
                                                                                    // Use navigator.geolocation to get the user's current location
                                                                                    if (navigator.geolocation) {
                                                                                        navigator.geolocation.getCurrentPosition(
                                                                                            (position) => {
                                                                                                // Successfully got user's location
                                                                                                const origin = `${position.coords.latitude},${position.coords.longitude}`;
                                                                                                const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${property.longitude},${property.latitude}`;
                                                                                                window.open(url, '_blank');

                                                                                                // Show success toast notification
                                                                                                toast({
                                                                                                    title: "Directions Opened",
                                                                                                    description: `Directions to ${property.title} have been opened in a new tab.`,
                                                                                                    duration: 3000,
                                                                                                });
                                                                                            },
                                                                                            (error) => {
                                                                                                // Failed to get user's location, fallback to just destination
                                                                                                console.error("Error getting user location:", error);
                                                                                                const url = `https://www.google.com/maps/dir/?api=1&destination=${property.longitude},${property.latitude}`;
                                                                                                window.open(url, '_blank');

                                                                                                // Notify user about location access issue
                                                                                                toast({
                                                                                                    title: "Location Access Denied",
                                                                                                    description: `Directions to ${property.title} opened, but using default starting point. For better directions, please allow location access.`,
                                                                                                    duration: 5000,
                                                                                                });
                                                                                            }
                                                                                        );
                                                                                    } else {
                                                                                        // Browser doesn't support geolocation
                                                                                        const url = `https://www.google.com/maps/dir/?api=1&destination=${property.longitude},${property.latitude}`;
                                                                                        window.open(url, '_blank');

                                                                                        // Notify user about geolocation not supported
                                                                                        toast({
                                                                                            title: "Directions Opened",
                                                                                            description: `Directions to ${property.title} opened. Your browser doesn't support geolocation, so using default starting point.`,
                                                                                            duration: 5000,
                                                                                        });
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <Navigation className="h-3 w-3 mr-1" />
                                                                                Get Directions
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </Popup>
                                                            </Marker>
                                                        ))}
                                                    </MapContainer>

                                                    <div className="absolute bottom-3 left-3 z-[1000] bg-white dark:bg-slate-800 rounded-md shadow-md p-3 text-xs">
                                                        <p className="font-medium">Map Legend</p>
                                                        <div className="flex items-center mt-2">
                                                            <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div>
                                                            <span>Property Location</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium">Properties on Map</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {location.properties?.filter(
                                                        property => 
                                                            property.latitude && 
                                                            property.longitude && 
                                                            !isNaN(Number(property.latitude)) && 
                                                            !isNaN(Number(property.longitude))
                                                    ).length || 0} of {location.properties?.length || 0} properties have map coordinates
                                                </p>
                                                {location.properties?.length > 0 && location.properties?.filter(
                                                    property => 
                                                        property.latitude && 
                                                        property.longitude && 
                                                        !isNaN(Number(property.latitude)) && 
                                                        !isNaN(Number(property.longitude))
                                                ).length === 0 && (
                                                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                        Properties need latitude and longitude values to appear on the map.
                                                    </p>
                                                )}
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => setActiveTab("properties")}>
                                                <Home className="mr-2 h-4 w-4" />
                                                View Property List
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle>Location Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="mr-3 rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
                                                <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Properties</p>
                                                <p className="text-xs text-muted-foreground">Total listings</p>
                                            </div>
                                        </div>
                                        <p className="text-xl font-bold">{location.properties?.length || 0}</p>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="mr-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-2">
                                                <ArrowUpRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Growth</p>
                                                <p className="text-xs text-muted-foreground">Monthly change</p>
                                            </div>
                                        </div>
                                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{location.growth || "0%"}</p>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="mr-3 rounded-full bg-purple-100 dark:bg-purple-900/30 p-2">
                                                <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Avg. Price</p>
                                                <p className="text-xs text-muted-foreground">Property value</p>
                                            </div>
                                        </div>
                                        <p className="text-xl font-bold">{location.avgPrice || "N/A"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button className="w-full" asChild>
                                    <Link href={`/dashboard/FeaturedLocations/edit/${locationId}`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Location
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share Location
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Data
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Related Locations */}
                        <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle>Related Locations</CardTitle>
                                <CardDescription>Other locations in {location.region}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-700/50">
                                        <p className="text-sm text-muted-foreground">
                                            Related locations will be displayed here based on the region.
                                        </p>
                                    </div>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/dashboard/FeaturedLocations">
                                            <Globe className="mr-2 h-4 w-4" />
                                            View All Locations
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
