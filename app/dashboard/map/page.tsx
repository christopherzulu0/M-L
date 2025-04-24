"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  MapPin,
  Home,
  Building,
  Landmark,
  Map as MapIcon,
  Layers,
} from "lucide-react"

export default function MapPage() {
  const [mapView, setMapView] = useState("all")

  // Sample data for properties on map
  const mapProperties = [
    {
      id: 1,
      title: "Modern Apartment with Pool View",
      address: "123 Skyline Ave, Downtown",
      price: "ZMW 450,000",
      type: "Apartment",
      status: "For Sale",
      lat: -15.3875,
      lng: 28.3228,
    },
    {
      id: 2,
      title: "Luxury Villa with Garden",
      address: "456 Park Lane, Suburbia",
      price: "ZMW 850,000",
      type: "Villa",
      status: "For Sale",
      lat: -15.3975,
      lng: 28.3328,
    },
    {
      id: 3,
      title: "Cozy Townhouse",
      address: "789 Maple St, Riverside",
      price: "ZMW 5,500/mo",
      type: "Townhouse",
      status: "For Rent",
      lat: -15.4075,
      lng: 28.3128,
    },
    {
      id: 4,
      title: "Commercial Office Space",
      address: "101 Business Ave, CBD",
      price: "ZMW 12,000/mo",
      type: "Commercial",
      status: "For Rent",
      lat: -15.3775,
      lng: 28.3428,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Property Map</h2>
          <p className="text-sm text-muted-foreground">
            View properties on an interactive map
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search locations..." className="pl-8" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ChevronDown className="mr-2 h-4 w-4" />
              Property Type
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All Types</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Residential</DropdownMenuItem>
            <DropdownMenuItem>Commercial</DropdownMenuItem>
            <DropdownMenuItem>Land</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ChevronDown className="mr-2 h-4 w-4" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All Statuses</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>For Sale</DropdownMenuItem>
            <DropdownMenuItem>For Rent</DropdownMenuItem>
            <DropdownMenuItem>Sold</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="icon">
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            {/* This would be replaced with an actual map component like Google Maps or Mapbox */}
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">
                  Interactive map would be displayed here using Google Maps or Mapbox
                </p>
                <p className="text-sm text-muted-foreground">
                  (This is a placeholder for demonstration purposes)
                </p>
              </div>
            </div>
            
            {/* Simulated property markers */}
            <div className="absolute left-1/4 top-1/3 text-blue-600">
              <MapPin className="h-8 w-8" />
            </div>
            <div className="absolute left-2/3 top-1/2 text-blue-600">
              <MapPin className="h-8 w-8" />
            </div>
            <div className="absolute left-1/2 top-2/3 text-red-600">
              <MapPin className="h-8 w-8" />
            </div>
            <div className="absolute left-3/4 top-1/4 text-red-600">
              <MapPin className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Properties on Map</CardTitle>
          <CardDescription>View details of properties shown on the map</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mapProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{property.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-3.5 w-3.5" />
                          {property.address}
                        </div>
                      </div>
                      <Badge
                        variant={property.status === "For Sale" ? "default" : "secondary"}
                      >
                        {property.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        {property.type === "Apartment" ? (
                          <Building className="mr-1 h-3.5 w-3.5" />
                        ) : property.type === "Villa" ? (
                          <Home className="mr-1 h-3.5 w-3.5" />
                        ) : property.type === "Commercial" ? (
                          <Landmark className="mr-1 h-3.5 w-3.5" />
                        ) : (
                          <Home className="mr-1 h-3.5 w-3.5" />
                        )}
                        {property.type}
                      </div>
                      <p className="font-medium">{property.price}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}