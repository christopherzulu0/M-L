import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "./property-card";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Filter, List, MapPin, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Dynamically import the Map component with ssr: false to prevent server-side rendering
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <p className="text-lg font-medium">Loading map...</p>
        <p className="text-sm text-gray-500">Please wait while we load the property map</p>
      </div>
    </div>
  ),
});

interface Property {
  id: number;
  title: string;
  address: string;
  price: number;
  listingType: {
    name: string;
  };
  propertyType: {
    name: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  latitude?: string | null;
  longitude?: string | null;
  media: {
    filePath: string;
    type: string;
  }[];
}

export default function PropertyMapView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"list" | "map">("map");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-15.3875, 28.3228]); // Default to Lusaka, Zambia
  const [mapZoom, setMapZoom] = useState(12);
  const [filters, setFilters] = useState({
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    minBeds: "",
    minBaths: ""
  });

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/properties?limit=50`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.properties) {
          setProperties(data.properties);
        } else {
          console.error("No properties found in response:", data);
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search query and filters
  useEffect(() => {
    let filtered = [...properties];

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.propertyType?.name.toLowerCase().includes(query)
      );
    }

    // Apply property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property =>
        property.propertyType?.name === filters.propertyType
      );
    }

    // Apply price range filters
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered.filter(property => property.price >= minPrice);
    }

    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered.filter(property => property.price <= maxPrice);
    }

    // Apply bedroom filter
    if (filters.minBeds) {
      const minBeds = parseInt(filters.minBeds);
      filtered = filtered.filter(property =>
        property.bedrooms !== undefined && property.bedrooms >= minBeds
      );
    }

    // Apply bathroom filter
    if (filters.minBaths) {
      const minBaths = parseFloat(filters.minBaths);
      filtered = filtered.filter(property =>
        property.bathrooms !== undefined && property.bathrooms >= minBaths
      );
    }

    // Only include properties with valid coordinates for map view
    const propertiesWithCoordinates = filtered.filter(
      property => property.latitude && property.longitude
    );

    setFilteredProperties(filtered);

    // If we have properties with coordinates and map view is active, center the map on the first property
    if (propertiesWithCoordinates.length > 0 && activeTab === "map") {
      const firstProperty = propertiesWithCoordinates[0];
      if (firstProperty.latitude && firstProperty.longitude) {
        setMapCenter([
          parseFloat(firstProperty.latitude),
          parseFloat(firstProperty.longitude)
        ]);
      }
    }
  }, [searchQuery, properties, filters, activeTab]);

  // Handle property selection on the map
  const handlePropertySelect = (propertyId: number) => {
    setSelectedProperty(propertyId);

    // Find the selected property
    const property = properties.find(p => p.id === propertyId);
    if (property && property.latitude && property.longitude) {
      // Center the map on the selected property
      setMapCenter([parseFloat(property.latitude), parseFloat(property.longitude)]);
      setMapZoom(15); // Zoom in closer
    }
  };

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Property Map</h2>
          <p className="text-lg text-muted-foreground">Explore properties on the map or as a list</p>
        </div>

        <div className="mb-6">
          <Tabs defaultValue="map" className="w-full" onValueChange={(value) => setActiveTab(value as "list" | "map")}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Map View
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List View
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-grow max-w-md">
                  <Input
                    type="text"
                    placeholder="Search properties..."
                    className="pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {showFilters ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {showFilters && (
              <Card className="mb-6 border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Property Type</label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={filters.propertyType}
                        onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                      >
                        <option value="">Any type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Villa">Villa</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Land">Land</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Min Price</label>
                      <Input
                        type="number"
                        placeholder="Min price"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Max Price</label>
                      <Input
                        type="number"
                        placeholder="Max price"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Min Bedrooms</label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={filters.minBeds}
                        onChange={(e) => setFilters({...filters, minBeds: e.target.value})}
                      >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Min Bathrooms</label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={filters.minBaths}
                        onChange={(e) => setFilters({...filters, minBaths: e.target.value})}
                      >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilters({
                          propertyType: "",
                          minPrice: "",
                          maxPrice: "",
                          minBeds: "",
                          minBaths: ""
                        });
                      }}
                      className="mr-2"
                    >
                      Reset Filters
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "map" && (
              <MapComponent
                properties={filteredProperties.filter(property => property.latitude && property.longitude)}
                selectedProperty={selectedProperty}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
                onPropertySelect={handlePropertySelect}
              />
            )}

            {activeTab === "list" && (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  // Loading state
                  Array(6).fill(0).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-[4/3] rounded-xl bg-gray-200"></div>
                      <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>
                      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
                      <div className="mt-4 h-8 w-full rounded bg-gray-200"></div>
                    </div>
                  ))
                ) : filteredProperties.length === 0 ? (
                  // No properties found
                  <div className="col-span-3 py-10 text-center">
                    <p className="text-lg text-muted-foreground">
                      {properties.length === 0 ? "No properties found" : "No properties match your search"}
                    </p>
                  </div>
                ) : (
                  // Properties list
                  filteredProperties.map((property) => {
                    // Determine badges based on listing type
                    const badges = [];
                    if (property.listingType?.name === "For Sale") {
                      badges.push("Sale");
                    } else if (property.listingType?.name === "For Rent") {
                      badges.push("Rent");
                    }

                    // Add a featured badge for some properties (optional)
                    if (property.id % 5 === 0) {
                      badges.push("Featured");
                    }

                    // Get the first image from media array or use a default
                    const propertyMedia = property.media || [];
                    const imageUrl = propertyMedia.length > 0 && propertyMedia[0]?.filePath
                      ? propertyMedia[0].filePath
                      : "https://digiestateorg.wordpress.com/wp-content/uploads/2023/11/ask-us-1024x583-1.jpg";

                    // Format price with currency
                    const formattedPrice = `ZMW ${property.price.toLocaleString()}`;

                    // Determine if it's monthly or total price
                    const period = property.listingType?.name === "For Rent" ? "month" : "total";

                    return (
                      <div
                        key={property.id}
                        className={cn(
                          "transition-transform hover:scale-105",
                          selectedProperty === property.id && "ring-2 ring-blue-500 rounded-xl"
                        )}
                        onClick={() => handlePropertySelect(property.id)}
                      >
                        <PropertyCard
                          image={imageUrl}
                          title={property.title}
                          address={property.address}
                          price={formattedPrice}
                          period={period}
                          type={property.propertyType?.name || "Property"}
                          badges={badges}
                          features={{
                            beds: property.bedrooms,
                            baths: property.bathrooms,
                            sqft: property.squareFeet
                          }}
                          propertyId={property.id}
                          disableLink={false}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
