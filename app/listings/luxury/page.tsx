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

// Static luxury properties data for fallback
const staticLuxuryProperties = [
  {
    id: 1,
    title: "Exquisite Waterfront Mansion",
    address: "456 Oceanview Drive, Malibu",
    price: 12500000,
    bedrooms: 8,
    bathrooms: 10,
    squareFeet: 12500,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 2,
    title: "Elegant Penthouse with City Views",
    address: "789 Skyline Avenue, New York",
    price: 8750000,
    bedrooms: 5,
    bathrooms: 6,
    squareFeet: 7200,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 3,
    title: "Mediterranean Villa with Private Beach",
    address: "123 Coastal Road, Monaco",
    price: 15800000,
    bedrooms: 7,
    bathrooms: 8,
    squareFeet: 10800,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 4,
    title: "Modern Architectural Masterpiece",
    address: "567 Hollywood Hills, Los Angeles",
    price: 9950000,
    bedrooms: 6,
    bathrooms: 7,
    squareFeet: 9000,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 5,
    title: "Historic Estate with Private Vineyard",
    address: "890 Wine Country Road, Napa Valley",
    price: 18500000,
    bedrooms: 10,
    bathrooms: 12,
    squareFeet: 15000,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 6,
    title: "Beachfront Paradise with Infinity Pool",
    address: "234 Oceanfront Lane, Miami Beach",
    price: 14200000,
    bedrooms: 7,
    bathrooms: 9,
    squareFeet: 11200,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  }
];

export default function LuxuryListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [useStaticData, setUseStaticData] = useState(false);

  // Fetch luxury properties from the API
  useEffect(() => {
    const fetchLuxuryProperties = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch properties with Villa property type (luxury properties)
        // In a real implementation, you might want to fetch by propertyTypeId
        // or use a specific endpoint for luxury properties
        const response = await fetch('/api/properties?status=published&limit=20');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.properties && data.properties.length > 0) {
          // Filter for luxury properties (Villa, Mansion, etc.)
          const luxuryProperties = data.properties.filter((property: Property) =>
            property.propertyType?.name === 'Villa' ||
            property.price > 1000000 // Consider properties over $1M as luxury
          );

          if (luxuryProperties.length > 0) {
            setProperties(luxuryProperties);
            setUseStaticData(false);
          } else {
            // No luxury properties found, use static data
            console.log('No luxury properties found in API, using static data');
            setUseStaticData(true);
          }
        } else {
          // No properties found, use static data
          console.log('No properties found in API, using static data');
          setUseStaticData(true);
        }
      } catch (error) {
        console.error('Error fetching luxury properties:', error);
        setError('Failed to fetch properties. Using sample data instead.');
        setUseStaticData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLuxuryProperties();
  }, []);

  // Filter properties based on search query and property type
  useEffect(() => {
    if (useStaticData) {
      // Filter static data
      let filtered = [...staticLuxuryProperties];

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(property =>
          property.title.toLowerCase().includes(query) ||
          property.address.toLowerCase().includes(query)
        );
      }

      if (propertyType !== 'all') {
        // For static data, we don't have actual property types, so this is simplified
        filtered = filtered.filter(property => {
          if (propertyType === 'villa' && property.title.toLowerCase().includes('villa')) return true;
          if (propertyType === 'mansion' && property.title.toLowerCase().includes('mansion')) return true;
          if (propertyType === 'penthouse' && property.title.toLowerCase().includes('penthouse')) return true;
          if (propertyType === 'estate' && property.title.toLowerCase().includes('estate')) return true;
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
          return type === propertyType.toLowerCase();
        });
      }

      setFilteredProperties(filtered);
    }
  }, [searchQuery, propertyType, properties, useStaticData]);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Luxury Homes</h1>
          <p className="text-muted-foreground">Browse our exclusive luxury property listings</p>
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
                    <SelectItem value="mansion">Mansion</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="estate">Estate</SelectItem>
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

        {/* Luxury Property Listings */}
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
                <LuxuryPropertyCard
                  key={property.id}
                  title={property.title}
                  address={property.address}
                  price={property.price}
                  beds={property.bedrooms}
                  baths={property.bathrooms}
                  sqft={property.squareFeet}
                  image={property.image}
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
                <LuxuryPropertyCard
                  key={property.id}
                  title={property.title}
                  address={property.address}
                  price={property.price}
                  beds={property.bedrooms}
                  baths={property.bathrooms}
                  sqft={property.squareFeet}
                  image={property.media && property.media.length > 0
                    ? property.media[0].filePath
                    : "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"}
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

// Luxury Property Card Component
interface LuxuryPropertyCardProps {
  title: string;
  address: string;
  price: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  image: string;
  id: number;
}

function LuxuryPropertyCard({ title, address, price, beds, baths, sqft, image, id }: LuxuryPropertyCardProps) {
  // Format price with commas
  const formattedPrice = `$${price.toLocaleString()}`;

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
          <span className="bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded">Premium</span>
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
        <div className="text-xl font-bold text-primary">{formattedPrice}</div>
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
