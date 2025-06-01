"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Building, Star, Filter, Search, TrendingUp, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"

// Define the property interface
interface Property {
  id: number;
  title: string;
  address: string;
  price: number;
  listingType: {
    id: number;
    name: string;
  };
  propertyType: {
    id: number;
    name: string;
  };
  floors?: number;
  squareFeet?: number;
  buildingClass?: string;
  annualRate?: number;
  media: {
    id: number;
    filePath: string;
    isPrimary: boolean;
  }[];
}

// Static commercial properties data for fallback
const staticCommercialProperties = [
  {
    id: 1,
    title: "Downtown Office Building",
    address: "789 Business District, Financial Center",
    price: 12500000,
    floors: 12,
    squareFeet: 25000,
    buildingClass: "Class A",
    annualRate: 45,
    transactionType: "For Sale",
    propertyType: "Office Space",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 2,
    title: "Retail Space in Shopping Center",
    address: "456 Retail Row, Shopping District",
    price: 4500000,
    floors: 1,
    squareFeet: 3500,
    buildingClass: "Class B",
    annualRate: 35,
    transactionType: "For Sale",
    propertyType: "Retail",
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 3,
    title: "Industrial Warehouse with Loading Docks",
    address: "123 Industrial Park, Manufacturing Zone",
    price: 7800000,
    floors: 1,
    squareFeet: 15000,
    buildingClass: "Industrial",
    annualRate: 28,
    transactionType: "For Sale",
    propertyType: "Warehouse",
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 4,
    title: "Mixed-Use Development Opportunity",
    address: "789 Urban Center, Downtown",
    price: 18500000,
    floors: 6,
    squareFeet: 32000,
    buildingClass: "Mixed Use",
    annualRate: 40,
    transactionType: "Investment",
    propertyType: "Mixed Use",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 5,
    title: "Office Space for Lease",
    address: "456 Corporate Drive, Business Park",
    price: 35,
    floors: 3,
    squareFeet: 5000,
    buildingClass: "Class B",
    annualRate: 35,
    transactionType: "For Lease",
    propertyType: "Office Space",
    image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 6,
    title: "Industrial Manufacturing Facility",
    address: "123 Factory Lane, Industrial Zone",
    price: 9200000,
    floors: 2,
    squareFeet: 18000,
    buildingClass: "Industrial",
    annualRate: 30,
    transactionType: "For Sale",
    propertyType: "Industrial",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  }
];

export default function CommercialListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [transactionType, setTransactionType] = useState("all");
  const [sizeRange, setSizeRange] = useState("any");
  const [zoning, setZoning] = useState("any");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [useStaticData, setUseStaticData] = useState(false);

  // Fetch commercial properties from the API
  useEffect(() => {
    const fetchCommercialProperties = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch properties with "Commercial" property type
        // In a real implementation, you might want to fetch by propertyTypeId
        const response = await fetch('/api/properties?status=published&limit=20');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.properties && data.properties.length > 0) {
          // Filter for commercial properties
          const commercialProperties = data.properties.filter((property: Property) =>
            property.propertyType?.name === 'Commercial'
          );

          if (commercialProperties.length > 0) {
            setProperties(commercialProperties);
            setUseStaticData(false);
          } else {
            // No commercial properties found, use static data
            console.log('No commercial properties found in API, using static data');
            setUseStaticData(true);
          }
        } else {
          // No properties found, use static data
          console.log('No properties found in API, using static data');
          setUseStaticData(true);
        }
      } catch (error) {
        console.error('Error fetching commercial properties:', error);
        setError('Failed to fetch properties. Using sample data instead.');
        setUseStaticData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommercialProperties();
  }, []);

  // Filter properties based on search query and filters
  useEffect(() => {
    if (useStaticData) {
      // Filter static data
      let filtered = [...staticCommercialProperties];

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(property =>
          property.title.toLowerCase().includes(query) ||
          property.address.toLowerCase().includes(query) ||
          property.propertyType.toLowerCase().includes(query)
        );
      }

      if (propertyType !== 'all') {
        filtered = filtered.filter(property =>
          property.propertyType.toLowerCase() === propertyType.toLowerCase()
        );
      }

      if (transactionType !== 'all') {
        filtered = filtered.filter(property =>
          property.transactionType.toLowerCase().includes(transactionType.toLowerCase())
        );
      }

      if (sizeRange !== 'any') {
        filtered = filtered.filter(property => {
          const size = property.squareFeet || 0;
          if (sizeRange === 'under1000' && size < 1000) return true;
          if (sizeRange === '1000to5000' && size >= 1000 && size <= 5000) return true;
          if (sizeRange === '5000to10000' && size > 5000 && size <= 10000) return true;
          if (sizeRange === 'over10000' && size > 10000) return true;
          return false;
        });
      }

      if (zoning !== 'any') {
        filtered = filtered.filter(property => {
          // This is a simplified approach since our static data doesn't have a zoning field
          // In a real implementation, you would check against an actual zoning field
          if (zoning === 'commercial' && property.propertyType.includes('Office')) return true;
          if (zoning === 'industrial' && property.propertyType.includes('Industrial')) return true;
          if (zoning === 'mixed' && property.propertyType.includes('Mixed')) return true;
          if (zoning === 'special' && property.buildingClass?.includes('Class A')) return true;
          return false;
        });
      }

      setFilteredProperties(filtered);
    } else {
      // Filter API data
      let filtered = [...properties];

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(property =>
          property.title.toLowerCase().includes(query) ||
          property.address.toLowerCase().includes(query) ||
          property.propertyType?.name.toLowerCase().includes(query)
        );
      }

      if (propertyType !== 'all') {
        filtered = filtered.filter(property => {
          const type = property.propertyType?.name.toLowerCase();
          return type?.includes(propertyType.toLowerCase());
        });
      }

      // Note: API data might not have these fields, so these filters might not work
      // In a real implementation, you would need to ensure this data is available

      if (transactionType !== 'all' && filtered.some(p => p.listingType)) {
        filtered = filtered.filter(property => {
          const type = property.listingType?.name.toLowerCase();
          if (transactionType === 'sale' && type?.includes('sale')) return true;
          if (transactionType === 'lease' && type?.includes('rent')) return true;
          if (transactionType === 'investment') return true; // No direct mapping
          return false;
        });
      }

      if (sizeRange !== 'any' && filtered.some(p => p.squareFeet)) {
        filtered = filtered.filter(property => {
          const size = property.squareFeet || 0;
          if (sizeRange === 'under1000' && size < 1000) return true;
          if (sizeRange === '1000to5000' && size >= 1000 && size <= 5000) return true;
          if (sizeRange === '5000to10000' && size > 5000 && size <= 10000) return true;
          if (sizeRange === 'over10000' && size > 10000) return true;
          return false;
        });
      }

      // Zoning filter would require additional data in the API

      setFilteredProperties(filtered);
    }
  }, [searchQuery, propertyType, transactionType, sizeRange, zoning, properties, useStaticData]);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Commercial Properties</h1>
          <p className="text-muted-foreground">Browse our commercial real estate listings</p>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* Search and Filter Section */}
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by location, property name..."
                    className="pl-10 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="office">Office Space</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
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

        {/* Commercial Property Filters */}
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Commercial Property Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="lease">For Lease</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={sizeRange} onValueChange={setSizeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Size (sq ft)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Size</SelectItem>
                    <SelectItem value="under1000">Under 1,000</SelectItem>
                    <SelectItem value="1000to5000">1,000 - 5,000</SelectItem>
                    <SelectItem value="5000to10000">5,000 - 10,000</SelectItem>
                    <SelectItem value="over10000">Over 10,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={zoning} onValueChange={setZoning}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zoning" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="mixed">Mixed Use</SelectItem>
                    <SelectItem value="special">Special Purpose</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commercial Property Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading state
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-video rounded-xl bg-gray-200"></div>
                <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
                <div className="mt-4 h-8 w-full rounded bg-gray-200"></div>
              </div>
            ))
          ) : useStaticData ? (
            // Static data
            filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <CommercialPropertyCard
                  key={property.id}
                  title={property.title}
                  address={property.address}
                  price={property.price}
                  floors={property.floors}
                  sqft={property.squareFeet}
                  buildingClass={property.buildingClass}
                  annualRate={property.annualRate}
                  image={property.image}
                  propertyType={property.propertyType}
                  transactionType={property.transactionType}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-lg text-muted-foreground">No properties match your search criteria</p>
              </div>
            )
          ) : (
            // API data
            filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <CommercialPropertyCard
                  key={property.id}
                  title={property.title}
                  address={property.address}
                  price={property.price}
                  floors={property.floors}
                  sqft={property.squareFeet}
                  buildingClass={property.buildingClass}
                  annualRate={property.annualRate}
                  image={property.media && property.media.length > 0
                    ? property.media[0].filePath
                    : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"}
                  propertyType={property.propertyType?.name}
                  transactionType={property.listingType?.name}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-lg text-muted-foreground">No properties match your search criteria</p>
              </div>
            )
          )}
        </div>

        {/* Pagination */}
        {(useStaticData ? filteredProperties.length > 0 : filteredProperties.length > 0) && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Commercial Property Card Component
function CommercialPropertyCard() {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
            alt="Commercial Property"
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-purple-500 text-white text-xs font-medium px-2.5 py-1 rounded">Office Space</span>
        </div>
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm rounded-full">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Downtown Office Building</CardTitle>
        <CardDescription className="flex items-center text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground/70" />
          789 Business District, Financial Center
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between text-sm mb-4">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>12 Floors</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>25,000 sqft</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>Class A</span>
          </div>
        </div>
        <div className="text-xl font-bold text-primary">$12,500,000</div>
        <div className="text-sm text-muted-foreground">$45/sqft/year</div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button size="sm">
          Contact Broker
        </Button>
      </CardFooter>
    </Card>
  )
}
