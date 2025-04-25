"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Bell,
    Calendar,
    ChevronDown,
    Clock,
    CreditCard,
    FileText,
    Heart,
    Home,
    LogOut,
    Mail,
    MapPin,
    MessageSquare,
    MoreHorizontal,
    Search,
    Settings,
    User,
    Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {PropertyCard} from "@/components/property-card";

export default function ClientDashboard() {
    const [activeTab, setActiveTab] = useState("overview")
    const [notifications, setNotifications] = useState(5)
    const [priceRange, setPriceRange] = useState([500000, 1500000])

    // Mock data
    const savedProperties = [
        {
            id: 1,
            image: "/placeholder.svg?height=400&width=600",
            title: "Modern Apartment with Ocean View",
            address: "123 Coastal Drive, Miami, FL",
            price: "$850,000",
            period: "total",
            propertyType: "Apartment",
            badges: ["Sale", "Premium"],
            features: {
                beds: 3,
                baths: 2,
                sqft: 1850,
            },
        },
        {
            id: 2,
            image: "/placeholder.svg?height=400&width=600",
            title: "Luxury Penthouse in Downtown",
            address: "456 Central Avenue, New York, NY",
            price: "$1,250,000",
            period: "total",
            propertyType: "Penthouse",
            badges: ["Sale", "Luxury"],
            features: {
                beds: 4,
                baths: 3,
                sqft: 2400,
            },
        },
        {
            id: 3,
            image: "/placeholder.svg?height=400&width=600",
            title: "Cozy Suburban Family Home",
            address: "789 Maple Street, Austin, TX",
            price: "$3,200",
            period: "month",
            propertyType: "House",
            badges: ["Rent", "Family"],
            features: {
                beds: 4,
                baths: 2.5,
                sqft: 2100,
            },
        },
    ]

    const recentSearches = [
        "3 bedroom apartments in Miami",
        "Luxury condos with ocean view",
        "Houses with pool in Austin",
        "Pet-friendly rentals in New York",
    ]

    const upcomingAppointments = [
        {
            id: 1,
            property: "Modern Apartment with Ocean View",
            address: "123 Coastal Drive, Miami, FL",
            date: "May 15, 2023",
            time: "10:00 AM",
            agent: {
                name: "Sarah Johnson",
                image: "/placeholder.svg?height=100&width=100",
            },
        },
        {
            id: 2,
            property: "Luxury Penthouse in Downtown",
            address: "456 Central Avenue, New York, NY",
            date: "May 18, 2023",
            time: "2:30 PM",
            agent: {
                name: "Michael Chen",
                image: "/placeholder.svg?height=100&width=100",
            },
        },
    ]

    const documents = [
        {
            id: 1,
            name: "Pre-Approval Letter",
            date: "April 28, 2023",
            status: "Signed",
            type: "PDF",
        },
        {
            id: 2,
            name: "Offer Contract - 123 Coastal Drive",
            date: "May 2, 2023",
            status: "Pending",
            type: "PDF",
        },
        {
            id: 3,
            name: "Property Disclosure - 456 Central Avenue",
            date: "May 5, 2023",
            status: "Reviewed",
            type: "PDF",
        },
    ]

    const messages = [
        {
            id: 1,
            from: "Sarah Johnson",
            avatar: "/placeholder.svg?height=100&width=100",
            message: "I've found 3 properties that match your criteria. Would you like to schedule viewings?",
            time: "2 hours ago",
            unread: true,
        },
        {
            id: 2,
            from: "Michael Chen",
            avatar: "/placeholder.svg?height=100&width=100",
            message: "The seller has accepted your offer! Let's discuss next steps.",
            time: "Yesterday",
            unread: true,
        },
        {
            id: 3,
            from: "Emma Rodriguez",
            avatar: "/placeholder.svg?height=100&width=100",
            message: "I've sent the updated contract for your review. Please let me know if you have any questions.",
            time: "3 days ago",
            unread: false,
        },
    ]

    const recommendedProperties = [
        {
            id: 4,
            image: "/placeholder.svg?height=400&width=600",
            title: "Waterfront Villa with Private Dock",
            address: "101 Harbor View, Tampa, FL",
            price: "$1,750,000",
            period: "total",
            propertyType: "Villa",
            badges: ["Sale", "Waterfront"],
            features: {
                beds: 5,
                baths: 4,
                sqft: 3200,
            },
        },
        {
            id: 5,
            image: "/placeholder.svg?height=400&width=600",
            title: "Contemporary Loft in Arts District",
            address: "202 Gallery Row, Los Angeles, CA",
            price: "$4,500",
            period: "month",
            propertyType: "Loft",
            badges: ["Rent", "Modern"],
            features: {
                beds: 2,
                baths: 2,
                sqft: 1650,
            },
        },
    ]

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-950 sm:px-6">
                <div className="flex items-center gap-4">
                    <Home className="h-6 w-6 text-indigo-600" />
                    <h1 className="text-lg font-semibold">RealEstate Client Portal</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {notifications > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {notifications}
              </span>
                        )}
                    </Button>

                    <Button variant="ghost" size="icon">
                        <MessageSquare className="h-5 w-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <span className="hidden md:inline-block">John Doe</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Billing</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6">
                {/* Client Profile Summary */}
                <div className="mb-6 grid gap-6 md:grid-cols-3">
                    <Card className="col-span-2 overflow-hidden">
                        <CardHeader className="relative p-0">
                            <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                            <div className="absolute -bottom-12 left-6">
                                <Avatar className="h-24 w-24 border-4 border-white bg-white">
                                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="John Doe" />
                                    <AvatarFallback className="text-2xl">JD</AvatarFallback>
                                </Avatar>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-16">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">John Doe</h2>
                                    <p className="text-muted-foreground">Premium Client since 2022</p>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
                                    <Badge
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                                    >
                                        First-time Buyer
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400"
                                    >
                                        Pre-Approved
                                    </Badge>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-6 sm:grid-cols-3">
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Budget Range</span>
                                    <span className="font-medium">$500K - $1.5M</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Preferred Location</span>
                                    <span className="font-medium">Miami, FL</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Property Type</span>
                                    <span className="font-medium">Apartment, Condo</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your Agent</CardTitle>
                            <CardDescription>Your dedicated real estate professional</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Sarah Johnson" />
                                    <AvatarFallback>SJ</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">Sarah Johnson</h3>
                                    <p className="text-sm text-muted-foreground">Senior Real Estate Agent</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        >
                                            Top Performer
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button size="sm" className="flex-1">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Message
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Schedule
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Dashboard Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="properties">Saved Properties</TabsTrigger>
                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{savedProperties.length}</div>
                                    <p className="text-xs text-muted-foreground">+2 in the last 30 days</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Upcoming Viewings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                                    <p className="text-xs text-muted-foreground">Next on {upcomingAppointments[0]?.date}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Search Completion</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">85%</div>
                                    <Progress value={85} className="mt-2" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{messages.filter((m) => m.unread).length}</div>
                                    <p className="text-xs text-muted-foreground">From {messages.filter((m) => m.unread).length} agents</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Searches</CardTitle>
                                    <CardDescription>Your recent property searches</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {recentSearches.map((search, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-2 rounded-md border p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                <Search className="h-4 w-4 text-muted-foreground" />
                                                <span>{search}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="ghost" className="w-full">
                                        View All Searches
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Recommended Properties</CardTitle>
                                    <CardDescription>Based on your preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {recommendedProperties.slice(0, 2).map((property) => (
                                        <div
                                            key={property.id}
                                            className="flex gap-4 rounded-md border p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                                <img
                                                    src={property.image || "/placeholder.svg"}
                                                    alt={property.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium truncate">{property.title}</h4>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <MapPin className="mr-1 h-3 w-3" />
                                                    <span className="truncate">{property.address}</span>
                                                </div>
                                                <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                                    {property.price}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                                <CardFooter>
                                    <Button variant="ghost" className="w-full">
                                        View All Recommendations
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Search Preferences</CardTitle>
                                <CardDescription>Update your property search criteria</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Preferred Location</Label>
                                        <Input id="location" defaultValue="Miami, FL" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="property-type">Property Type</Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between">
                                                    <span>Apartment, Condo</span>
                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                                <DropdownMenuItem>Apartment</DropdownMenuItem>
                                                <DropdownMenuItem>Condo</DropdownMenuItem>
                                                <DropdownMenuItem>House</DropdownMenuItem>
                                                <DropdownMenuItem>Townhouse</DropdownMenuItem>
                                                <DropdownMenuItem>Villa</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Price Range</Label>
                                        <span className="text-sm text-muted-foreground">
                      ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                    </span>
                                    </div>
                                    <Slider
                                        defaultValue={priceRange}
                                        max={3000000}
                                        min={100000}
                                        step={50000}
                                        onValueChange={setPriceRange}
                                        className="py-4"
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="beds">Bedrooms</Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between">
                                                    <span>3+</span>
                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                                <DropdownMenuItem>Any</DropdownMenuItem>
                                                <DropdownMenuItem>1+</DropdownMenuItem>
                                                <DropdownMenuItem>2+</DropdownMenuItem>
                                                <DropdownMenuItem>3+</DropdownMenuItem>
                                                <DropdownMenuItem>4+</DropdownMenuItem>
                                                <DropdownMenuItem>5+</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="baths">Bathrooms</Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between">
                                                    <span>2+</span>
                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                                <DropdownMenuItem>Any</DropdownMenuItem>
                                                <DropdownMenuItem>1+</DropdownMenuItem>
                                                <DropdownMenuItem>2+</DropdownMenuItem>
                                                <DropdownMenuItem>3+</DropdownMenuItem>
                                                <DropdownMenuItem>4+</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sqft">Square Feet</Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between">
                                                    <span>1500+ sqft</span>
                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                                <DropdownMenuItem>Any</DropdownMenuItem>
                                                <DropdownMenuItem>1000+ sqft</DropdownMenuItem>
                                                <DropdownMenuItem>1500+ sqft</DropdownMenuItem>
                                                <DropdownMenuItem>2000+ sqft</DropdownMenuItem>
                                                <DropdownMenuItem>2500+ sqft</DropdownMenuItem>
                                                <DropdownMenuItem>3000+ sqft</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">Reset</Button>
                                <Button>Update Preferences</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Saved Properties Tab */}
                    <TabsContent value="properties" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Saved Properties</h2>
                            <Button>
                                <Search className="mr-2 h-4 w-4" />
                                Find More Properties
                            </Button>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {savedProperties.map((property) => (
                                <PropertyCard key={property.id} {...property} />
                            ))}
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recently Viewed</CardTitle>
                                <CardDescription>Properties you've viewed recently</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {recommendedProperties.map((property) => (
                                        <div
                                            key={property.id}
                                            className="flex gap-4 rounded-md border p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                                                <img
                                                    src={property.image || "/placeholder.svg"}
                                                    alt={property.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium truncate">{property.title}</h4>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <MapPin className="mr-1 h-3 w-3" />
                                                    <span className="truncate">{property.address}</span>
                                                </div>
                                                <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                                    {property.price}
                                                </p>
                                                <div className="mt-2 flex gap-2">
                                                    <Button size="sm" variant="ghost" className="h-7 px-2">
                                                        <Heart className="h-3.5 w-3.5 mr-1" />
                                                        Save
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-7 px-2">
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Appointments Tab */}
                    <TabsContent value="appointments" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Your Appointments</h2>
                            <Button>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule New Viewing
                            </Button>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Appointments</CardTitle>
                                <CardDescription>Your scheduled property viewings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {upcomingAppointments.map((appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="flex flex-col rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                                <div className="mb-2 sm:mb-0">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                                                        <Calendar className="h-6 w-6" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{appointment.property}</h3>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <MapPin className="mr-1 h-3 w-3" />
                                                        <span>{appointment.address}</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-3">
                                                        <div className="flex items-center text-sm">
                                                            <Calendar className="mr-1 h-3 w-3" />
                                                            <span>{appointment.date}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm">
                                                            <Clock className="mr-1 h-3 w-3" />
                                                            <span>{appointment.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center gap-4 sm:mt-0">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage
                                                            src={appointment.agent.image || "/placeholder.svg"}
                                                            alt={appointment.agent.name}
                                                        />
                                                        <AvatarFallback>
                                                            {appointment.agent.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <span className="text-sm font-medium">{appointment.agent.name}</span>
                                                        <p className="text-xs text-muted-foreground">Your Agent</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">
                                                        Reschedule
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" className="w-full">
                                    View All Appointments
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Past Viewings</CardTitle>
                                <CardDescription>Properties you've visited</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex flex-col rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between opacity-70">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                            <div className="mb-2 sm:mb-0">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                    <Calendar className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-medium">Riverside Apartment</h3>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <MapPin className="mr-1 h-3 w-3" />
                                                    <span>567 River Road, Chicago, IL</span>
                                                </div>
                                                <div className="mt-1 flex items-center gap-3">
                                                    <div className="flex items-center text-sm">
                                                        <Calendar className="mr-1 h-3 w-3" />
                                                        <span>April 28, 2023</span>
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        <span>1:00 PM</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center gap-4 sm:mt-0">
                                            <Badge variant="outline">Completed</Badge>
                                            <Button size="sm" variant="outline">
                                                View Property
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Your Documents</h2>
                            <Button>
                                <FileText className="mr-2 h-4 w-4" />
                                Upload Document
                            </Button>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Important Documents</CardTitle>
                                <CardDescription>Your real estate paperwork and contracts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {documents.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{doc.name}</h3>
                                                    <p className="text-sm text-muted-foreground">Added on {doc.date}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Badge
                                                    variant="outline"
                                                    className={`
                            ${doc.status === "Signed" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}
                            ${doc.status === "Pending" ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : ""}
                            ${doc.status === "Reviewed" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : ""}
                          `}
                                                >
                                                    {doc.status}
                                                </Badge>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>View Document</DropdownMenuItem>
                                                        <DropdownMenuItem>Download</DropdownMenuItem>
                                                        <DropdownMenuItem>Share</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 dark:text-red-400">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" className="w-full">
                                    View All Documents
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Document Templates</CardTitle>
                                <CardDescription>Common forms and templates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-4 rounded-lg border p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">Purchase Agreement</h3>
                                            <p className="text-sm text-muted-foreground">Standard purchase contract</p>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            Download
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-4 rounded-lg border p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">Disclosure Form</h3>
                                            <p className="text-sm text-muted-foreground">Property disclosure statement</p>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Messages Tab */}
                    <TabsContent value="messages" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Your Messages</h2>
                            <Button>
                                <Users className="mr-2 h-4 w-4" />
                                New Message
                            </Button>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Conversations</CardTitle>
                                <CardDescription>Messages from your real estate team</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex gap-4 rounded-lg border p-4 ${message.unread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
                                        >
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.from} />
                                                <AvatarFallback>
                                                    {message.from
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium">{message.from}</h3>
                                                    <span className="text-xs text-muted-foreground">{message.time}</span>
                                                </div>
                                                <p className="mt-1 text-sm">{message.message}</p>
                                                <div className="mt-2 flex gap-2">
                                                    <Button size="sm" variant="outline">
                                                        Reply
                                                    </Button>
                                                    {message.unread && (
                                                        <Button size="sm" variant="ghost">
                                                            Mark as Read
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" className="w-full">
                                    View All Messages
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
