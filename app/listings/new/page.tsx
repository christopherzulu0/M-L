import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Home, Building, Star, Filter, Search, Zap, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default function NewDevelopmentsPage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">New Developments</h1>
            <Badge className="bg-red-500 text-white">Hot</Badge>
          </div>
          <p className="text-muted-foreground">Explore the latest property developments and pre-construction opportunities</p>
        </div>

        {/* Search and Filter Section */}
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by location, development name..."
                    className="pl-10 bg-background"
                  />
                </div>
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="condo">Condominiums</SelectItem>
                    <SelectItem value="townhouse">Townhouses</SelectItem>
                    <SelectItem value="apartment">Apartment Buildings</SelectItem>
                    <SelectItem value="community">Master Communities</SelectItem>
                    <SelectItem value="mixed">Mixed Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Status Filter */}
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Development Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Development Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="preconstruction">Pre-Construction</SelectItem>
                    <SelectItem value="construction">Under Construction</SelectItem>
                    <SelectItem value="completed">Newly Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Completion Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                    <SelectItem value="2028">2028+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Price</SelectItem>
                    <SelectItem value="under500k">Under $500K</SelectItem>
                    <SelectItem value="500kto1m">$500K - $1M</SelectItem>
                    <SelectItem value="1mto2m">$1M - $2M</SelectItem>
                    <SelectItem value="over2m">Over $2M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured New Developments */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Featured New Developments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Property Cards - In a real app, these would be dynamically generated */}
            {[1, 2, 3].map((item) => (
              <NewDevelopmentCard key={item} featured={true} />
            ))}
          </div>
        </div>

        {/* All New Developments */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">All New Developments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Property Cards - In a real app, these would be dynamically generated */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <NewDevelopmentCard key={item} featured={false} />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// New Development Card Component
function NewDevelopmentCard({ featured }: { featured: boolean }) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${featured ? 'border-2 border-amber-400' : ''}`}>
      <div className="relative">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
            alt="New Development"
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        <div className="absolute top-2 left-2 flex space-x-2">
          <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded">New Launch</span>
          {featured && (
            <span className="bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded">Featured</span>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm rounded-full">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">The Skyline Residences</CardTitle>
        <CardDescription className="flex items-center text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground/70" />
          123 New Development Ave, Downtown
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between text-sm mb-4">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>45 Units</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>Est. 2026</span>
          </div>
          <div className="flex items-center">
            <Zap className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>Pre-Construction</span>
          </div>
        </div>
        <div className="text-xl font-bold text-primary">From $750,000</div>
        <div className="mt-2 flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <span className="text-xs text-green-600 ml-2">65% Sold</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button size="sm">
          Register Interest
        </Button>
      </CardFooter>
    </Card>
  )
}
