"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Home, Building, Star, Filter, Search, Calendar, Loader2 } from "lucide-react"
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
  leaseTerm?: string;
  media: {
    id: number;
    filePath: string;
    isPrimary: boolean;
  }[];
}

// Static properties for rent data for fallback
const staticRentProperties = [
  {
    id: 1,
    title: "Stylish Downtown Apartment",
    address: "456 Urban Avenue, Downtown",
    price: 2800,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1100,
    leaseTerm: "1 Year",
    propertyType: "Apartment",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 2,
    title: "Modern Studio in Arts District",
    address: "789 Creative Lane, Arts District",
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 650,
    leaseTerm: "6 Months",
    propertyType: "Studio",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 3,
    title: "Luxury Condo with City Views",
    address: "123 Skyline Drive, Highrise District",
    price: 4500,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1800,
    leaseTerm: "1 Year",
    propertyType: "Condo",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 4,
    title: "Charming Suburban House",
    address: "456 Family Lane, Greenfield",
    price: 3200,
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2200,
    leaseTerm: "2 Years",
    propertyType: "House",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 5,
    title: "Cozy Studio Near University",
    address: "789 College Road, University District",
    price: 1200,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 500,
    leaseTerm: "9 Months",
    propertyType: "Studio",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 6,
    title: "Waterfront Apartment with Balcony",
    address: "123 Harbor View, Marina District",
    price: 3800,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1300,
    leaseTerm: "1 Year",
    propertyType: "Apartment",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  }
];

export default function RentListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("any");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [useStaticData, setUseStaticData] = useState(false);

  // Fetch properties for rent from the API
  useEffect(() => {
    const fetchPropertiesForRent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch properties with "For Rent" listing type
        // In a real implementation, you might want to fetch by listingTypeId
        const response = await fetch('/api/properties?status=published&limit=20');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.properties && data.properties.length > 0) {
          // Filter for properties with "For Rent" listing type
          const rentProperties = data.properties.filter((property: Property) =>
            property.listingType?.name === 'For Rent'
          );

          if (rentProperties.length > 0) {
            setProperties(rentProperties);
            setUseStaticData(false);
          } else {
            // No properties for rent found, use static data
            console.log('No properties for rent found in API, using static data');
            setUseStaticData(true);
          }
        } else {
          // No properties found, use static data
          console.log('No properties found in API, using static data');
          setUseStaticData(true);
        }
      } catch (error) {
        console.error('Error fetching properties for rent:', error);
        setError('Failed to fetch properties. Using sample data instead.');
        setUseStaticData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertiesForRent();
  }, []);

  // Filter properties based on search query, property type, and rent range
  useEffect(() => {
    if (useStaticData) {
      // Filter static data
      let filtered = [...staticRentProperties];

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

      if (minRent) {
        const min = parseFloat(minRent);
        filtered = filtered.filter(property => property.price >= min);
      }

      if (maxRent) {
        const max = parseFloat(maxRent);
        filtered = filtered.filter(property => property.price <= max);
      }

      if (leaseTerm !== 'any') {
        filtered = filtered.filter(property => {
          if (leaseTerm === 'short' && property.leaseTerm?.includes('Month')) return true;
          if (leaseTerm === '6month' && property.leaseTerm?.includes('6 Month')) return true;
          if (leaseTerm === '1year' && property.leaseTerm?.includes('1 Year')) return true;
          if (leaseTerm === '2year' && property.leaseTerm?.includes('2 Year')) return true;
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

      if (minRent) {
        const min = parseFloat(minRent);
        filtered = filtered.filter(property => property.price >= min);
      }

      if (maxRent) {
        const max = parseFloat(maxRent);
        filtered = filtered.filter(property => property.price <= max);
      }

      // Note: API data might not have leaseTerm field, so this filter might not work
      // In a real implementation, you would need to ensure this data is available
      if (leaseTerm !== 'any' && filtered.some(p => p.leaseTerm)) {
        filtered = filtered.filter(property => {
          if (!property.leaseTerm) return false;
          if (leaseTerm === 'short' && property.leaseTerm.includes('Month')) return true;
          if (leaseTerm === '6month' && property.leaseTerm.includes('6 Month')) return true;
          if (leaseTerm === '1year' && property.leaseTerm.includes('1 Year')) return true;
          if (leaseTerm === '2year' && property.leaseTerm.includes('2 Year')) return true;
          return false;
        });
      }

      setFilteredProperties(filtered);
    }
  }, [searchQuery, propertyType, minRent, maxRent, leaseTerm, properties, useStaticData]);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Properties For Rent</h1>
          <p className="text-muted-foreground">Browse our available rental properties</p>
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
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
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

        {/* Rent Range Filter */}
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Rent Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Select value={minRent} onValueChange={setMinRent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Min Rent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="0">$0</SelectItem>
                    <SelectItem value="1000">$1,000</SelectItem>
                    <SelectItem value="2000">$2,000</SelectItem>
                    <SelectItem value="3000">$3,000</SelectItem>
                    <SelectItem value="5000">$5,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={maxRent} onValueChange={setMaxRent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Max Rent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="2000">$2,000</SelectItem>
                    <SelectItem value="3000">$3,000</SelectItem>
                    <SelectItem value="5000">$5,000</SelectItem>
                    <SelectItem value="10000">$10,000</SelectItem>
                    <SelectItem value="20000">$20,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={leaseTerm} onValueChange={setLeaseTerm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lease Term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="short">Short Term</SelectItem>
                    <SelectItem value="6month">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="2year">2+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* For Rent Property Listings */}
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
                <RentPropertyCard
                  key={property.id}
                  title={property.title}
                  address={property.address}
                  price={property.price}
                  beds={property.bedrooms}
                  baths={property.bathrooms}
                  sqft={property.squareFeet}
                  leaseTerm={property.leaseTerm}
                  image={property.image}
                  propertyType={property.propertyType}
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
                <RentPropertyCard
                  key={property.id}
                  title={property.title}
                  address={property.address}
                  price={property.price}
                  beds={property.bedrooms}
                  baths={property.bathrooms}
                  sqft={property.squareFeet}
                  leaseTerm={property.leaseTerm}
                  image={property.media && property.media.length > 0
                    ? property.media[0].filePath
                    : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"}
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

// For Rent Property Card Component
interface RentPropertyCardProps {
  title: string;
  address: string;
  price: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  leaseTerm?: string;
  image: string;
  propertyType?: string;
  id: number;
}

function RentPropertyCard({ title, address, price, beds, baths, sqft, leaseTerm, image, propertyType, id }: RentPropertyCardProps) {
  // Format price with commas
  const formattedPrice = `$${price.toLocaleString()}/month`;

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
          <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded">For Rent</span>
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
          {leaseTerm && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{leaseTerm}</span>
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
        {sqft && (
          <div className="text-sm text-muted-foreground mt-2">
            {sqft.toLocaleString()} sqft
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link href={`/listing-single/${id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        <Link href={`/contact?agent=${id}`}>
          <Button size="sm">
            Schedule Viewing
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
