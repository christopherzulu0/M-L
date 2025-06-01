"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Home, Building, Star, Filter, Search, Loader2 } from "lucide-react"
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
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  media: {
    id: number;
    filePath: string;
    isPrimary: boolean;
  }[];
}

// Static properties for sale data for fallback
const staticSaleProperties = [
  {
    id: 1,
    title: "Modern Family Home",
    address: "789 Suburban Lane, Springfield",
    price: 450000,
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2200,
    propertyType: "House",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 2,
    title: "Downtown Apartment",
    address: "456 Urban Street, Metropolis",
    price: 325000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1100,
    propertyType: "Apartment",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 3,
    title: "Suburban Townhouse",
    address: "123 Pleasant View, Greenville",
    price: 375000,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1800,
    propertyType: "Townhouse",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 4,
    title: "Luxury Condo with City Views",
    address: "789 Skyline Avenue, Downtown",
    price: 550000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1400,
    propertyType: "Condo",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 5,
    title: "Charming Cottage",
    address: "567 Maple Street, Riverside",
    price: 295000,
    bedrooms: 3,
    bathrooms: 1,
    squareFeet: 1500,
    propertyType: "House",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 6,
    title: "Modern Architectural Home",
    address: "901 Highland Drive, Hillcrest",
    price: 675000,
    bedrooms: 4,
    bathrooms: 3.5,
    squareFeet: 3200,
    propertyType: "House",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  }
];

export default function SaleListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [useStaticData, setUseStaticData] = useState(false);

  // Fetch properties for sale from the API
  useEffect(() => {
    const fetchPropertiesForSale = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch properties with "For Sale" listing type
        // In a real implementation, you might want to fetch by listingTypeId
        const response = await fetch('/api/properties?status=published&limit=20');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.properties && data.properties.length > 0) {
          // Filter for properties with "For Sale" listing type
          const saleProperties = data.properties.filter((property: Property) =>
            property.listingType?.name === 'For Sale'
          );

          if (saleProperties.length > 0) {
            setProperties(saleProperties);
            setUseStaticData(false);
          } else {
            // No properties for sale found, use static data
            console.log('No properties for sale found in API, using static data');
            setUseStaticData(true);
          }
        } else {
          // No properties found, use static data
          console.log('No properties found in API, using static data');
          setUseStaticData(true);
        }
      } catch (error) {
        console.error('Error fetching properties for sale:', error);
        setError('Failed to fetch properties. Using sample data instead.');
        setUseStaticData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertiesForSale();
  }, []);

  // Filter properties based on search query, property type, and price range
  useEffect(() => {
    if (useStaticData) {
      // Filter static data
      let filtered = [...staticSaleProperties];

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

      if (minPrice) {
        const min = parseFloat(minPrice);
        filtered = filtered.filter(property => property.price >= min);
      }

      if (maxPrice) {
        const max = parseFloat(maxPrice);
        filtered = filtered.filter(property => property.price <= max);
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
          return type === propertyType.toLowerCase();
        });
      }

      if (minPrice) {
        const min = parseFloat(minPrice);
        filtered = filtered.filter(property => property.price >= min);
      }

      if (maxPrice) {
        const max = parseFloat(maxPrice);
        filtered = filtered.filter(property => property.price <= max);
      }

      setFilteredProperties(filtered);
    }
  }, [searchQuery, propertyType, minPrice, maxPrice, properties, useStaticData]);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Properties For Sale</h1>
          <p className="text-muted-foreground">Browse our available properties for sale</p>
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
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
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

        {/* Price Range Filter */}
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Price Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select value={minPrice} onValueChange={setMinPrice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Min Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="0">$0</SelectItem>
                    <SelectItem value="100000">$100,000</SelectItem>
                    <SelectItem value="200000">$200,000</SelectItem>
                    <SelectItem value="500000">$500,000</SelectItem>
                    <SelectItem value="1000000">$1,000,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={maxPrice} onValueChange={setMaxPrice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Max Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="200000">$200,000</SelectItem>
                    <SelectItem value="500000">$500,000</SelectItem>
                    <SelectItem value="1000000">$1,000,000</SelectItem>
                    <SelectItem value="2000000">$2,000,000</SelectItem>
                    <SelectItem value="5000000">$5,000,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* For Sale Property Listings */}
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
                <SalePropertyCard
                  key={property.id}
                  title={property.title}
                  address={property.address}
                  price={property.price}
                  beds={property.bedrooms}
                  baths={property.bathrooms}
                  sqft={property.squareFeet}
                  image={property.image}
                  propertyType={property.propertyType}
                  id={property.id}
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
                <SalePropertyCard
                  key={property.id}
                  title={property.title}
                  address={property.address}
                  price={property.price}
                  beds={property.bedrooms}
                  baths={property.bathrooms}
                  sqft={property.squareFeet}
                  image={property.media && property.media.length > 0
                    ? property.media[0].filePath
                    : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"}
                  propertyType={property.propertyType?.name}
                  id={property.id}
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

// For Sale Property Card Component
interface SalePropertyCardProps {
  title: string;
  address: string;
  price: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  image: string;
  propertyType?: string;
  id: number;
}

function SalePropertyCard({ title, address, price, beds, baths, sqft, image, propertyType, id }: SalePropertyCardProps) {
  // Format price with commas
  const formattedPrice = `ZMW ${price.toLocaleString()}`;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded">For Sale</span>
        </div>
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm rounded-full">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="flex items-center text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground/70" />
          {address}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between text-sm mb-4">
          {beds && (
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{beds} Beds</span>
            </div>
          )}
          {baths && (
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{baths} Baths</span>
            </div>
          )}
          {sqft && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{sqft.toLocaleString()} sqft</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-primary">{formattedPrice}</div>
          {propertyType && (
            <div className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
              {propertyType}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link href={`/listing-single/${id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        <Link href={`/contact?agent=${id}`}>
          <Button size="sm">
            Contact Agent
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
