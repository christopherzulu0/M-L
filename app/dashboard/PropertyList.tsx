"use client"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {
    Edit,
    Eye,
    MapPin,
    Star,
    Bed,
    Bath,
    Square,
    Heart,
    Share2,
    Clock,
    MoreHorizontal,
    Building,
    Home,
    Briefcase,
    ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const recentProperties = [
    {
        id: 1,
        image:
            "https://images.lifestyleasia.com/wp-content/uploads/sites/3/2020/09/15155131/9th-Floor-Infinity-Pool-Aman-Nai-Lert-Bangkok-Thailand-c-Aman-Nai-Lert-Bangkok-min-scaled.jpg",
        title: "Modern Apartment with Pool View",
        address: "Minsundu RD, Ndola",
        price: "ZMW 2,500,000",
        period: "total",
        type: "Apartment",
        badges: ["Sale", "Featured"],
        features: {
            beds: 3,
            baths: 2,
            sqft: 1200,
        },
        status: "Active",
        views: 245,
        inquiries: 12,
        location: { lat: -12.9684, lng: 28.6339 },
        rating: 4.8,
        listedDate: "2 weeks ago",
    },
    {
        id: 2,
        image: "https://www.conradvillas.com/uploads/properties/116/koh-samui-luxury-villas-for-sale-bangpor-89875071.jpg",
        title: "Luxury Family Villa",
        address: "45 Independence Ave, Kitwe, Zambia",
        price: "ZMW 3,200",
        period: "month",
        type: "House",
        badges: ["Rent", "New"],
        features: {
            beds: 4,
            baths: 3,
            sqft: 2500,
        },
        status: "Pending",
        views: 187,
        inquiries: 8,
        location: { lat: -12.8016, lng: 28.2088 },
        rating: 4.5,
        listedDate: "3 days ago",
    },
    {
        id: 3,
        image:
            "https://portablepartitions.com.au/wp-content/uploads/2022/06/Commercial-Office-Space-Design-Revolutionising-the-Workplace.jpeg",
        title: "Commercial Office Space",
        address: "78 Cairo Rd, Ndola, Zambia",
        price: "ZMW 1,800,000",
        period: "total",
        type: "Commercial",
        badges: ["Sale", "Hot Deal"],
        features: {
            sqft: 3500,
        },
        status: "Sold",
        views: 320,
        inquiries: 15,
        location: { lat: -12.9684, lng: 28.6339 },
        rating: 4.2,
        listedDate: "1 month ago",
    },
    {
        id: 4,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTOxOI9s0skGIEUKYEc7dCuGC4bee2H-5naw&s",
        title: "Riverside Cottage",
        address: "12 Zambezi Rd, Livingstone, Zambia",
        price: "ZMW 1,200,000",
        period: "total",
        type: "House",
        badges: ["Sale", "Waterfront"],
        features: {
            beds: 2,
            baths: 1,
            sqft: 950,
        },
        status: "Active",
        views: 156,
        inquiries: 6,
        location: { lat: -17.8419, lng: 25.8544 },
        rating: 4.6,
        listedDate: "1 week ago",
    },
]

export default function PropertyList() {
    const [viewMode, setViewMode] = useState("grid")
    const [favorites, setFavorites] = useState<number[]>([])

    const toggleFavorite = (id: number) => {
        if (favorites.includes(id)) {
            setFavorites(favorites.filter((favId) => favId !== id))
        } else {
            setFavorites([...favorites, id])
        }
    }

    const getPropertyTypeIcon = (type: string) => {
        switch (type) {
            case "Apartment":
                return <Building className="h-3 w-3" />
            case "House":
                return <Home className="h-3 w-3" />
            case "Commercial":
                return <Briefcase className="h-3 w-3" />
            default:
                return <Home className="h-3 w-3" />
        }
    }

    const getBadgeStyles = (badge: string) => {
        switch (badge) {
            case "Sale":
                return "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            case "Featured":
                return "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600"
            case "Rent":
                return "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600"
            case "New":
                return "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
            case "Hot Deal":
                return "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
            case "Waterfront":
                return "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600"
            default:
                return "bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600"
        }
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30"
            case "Pending":
                return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30"
            case "Sold":
                return "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700/50"
            default:
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
        }
    }

    return (
        <>
            {/* Property List */}
            {viewMode === "grid" && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentProperties.map((property) => (
                        <Card
                            key={property.id}
                            className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-xl"
                        >
                            <CardContent className="p-0">
                                <div className="relative">
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <Image
                                            src={property.image || "/placeholder.svg"}
                                            alt={property.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105 duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                    </div>

                                    <div className="absolute left-3 top-3 flex flex-col gap-2">
                                        <Badge
                                            className={`${getPropertyTypeIcon(property.type) ? "pl-2 pr-3" : "px-3"} py-1 text-xs font-medium bg-white/90 text-gray-800 hover:bg-white/100 backdrop-blur-sm`}
                                        >
                                            {getPropertyTypeIcon(property.type)}
                                            <span className="ml-1">{property.type}</span>
                                        </Badge>
                                    </div>

                                    <div className="absolute right-3 top-3 flex flex-wrap gap-2 max-w-[70%] justify-end">
                                        {property.badges.map((badge) => (
                                            <Badge key={badge} className={`${getBadgeStyles(badge)} text-white shadow-sm`}>
                                                {badge}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                        <div className="flex items-center gap-0.5 rounded-md bg-black/60 backdrop-blur-sm px-2 py-1 text-xs text-white">
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                            <span>{property.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-0.5 rounded-md bg-black/60 backdrop-blur-sm px-2 py-1 text-xs text-white">
                                            <Eye className="h-3 w-3" />
                                            <span>{property.views}</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
                                                        onClick={() => toggleFavorite(property.id)}
                                                    >
                                                        <Heart
                                                            className={`h-4 w-4 ${favorites.includes(property.id) ? "fill-red-500 text-red-500" : ""}`}
                                                        />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{favorites.includes(property.id) ? "Remove from favorites" : "Add to favorites"}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
                                                    >
                                                        <Share2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Share property</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {property.title}
                                            </h3>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>View Details</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        <span>Edit Property</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                        <span>Delete Property</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                                            <span className="line-clamp-1">{property.address}</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <div>
                                                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{property.price}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {property.period === "month" ? "per month" : ""}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className={`${getStatusStyles(property.status)}`}>
                                                {property.status}
                                            </Badge>
                                        </div>

                                        <div className="mt-4 grid grid-cols-3 gap-2">
                                            {property.features.beds && (
                                                <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 p-2">
                                                    <Bed className="h-4 w-4 text-gray-500 mb-1" />
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm font-medium">{property.features.beds}</span>
                                                        <span className="text-xs text-muted-foreground">Beds</span>
                                                    </div>
                                                </div>
                                            )}
                                            {property.features.baths && (
                                                <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 p-2">
                                                    <Bath className="h-4 w-4 text-gray-500 mb-1" />
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm font-medium">{property.features.baths}</span>
                                                        <span className="text-xs text-muted-foreground">Baths</span>
                                                    </div>
                                                </div>
                                            )}
                                            {property.features.sqft && (
                                                <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 p-2">
                                                    <Square className="h-4 w-4 text-gray-500 mb-1" />
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm font-medium">{property.features.sqft}</span>
                                                        <span className="text-xs text-muted-foreground">sqft</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>Listed {property.listedDate}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <span className="text-muted-foreground">{property.inquiries} inquiries</span>
                                                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-sm hover:shadow-md transition-all">
                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                            </Button>
                                            <Button variant="outline" className="flex-1 border-gray-200 dark:border-gray-700">
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </>
    )
}
