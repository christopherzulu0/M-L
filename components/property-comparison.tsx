"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"

// Define the property interface based on the API response
interface Property {
  id: string
  title: string
  price: number
  bedrooms: number | null
  bathrooms: number | null
  squareFootage: number | null
  yearBuilt: number | null
  propertyType: {
    name: string
  }
  metrics?: {
    pricePerSqFt: number | null
    totalRooms: number
    hasParking: boolean
    hasOutdoorSpace: boolean
  }
}

// Fetch available properties from API
const fetchAvailableProperties = async () => {
  const response = await fetch('/api/properties?status=published&limit=20')
  if (!response.ok) {
    throw new Error('Failed to fetch properties')
  }
  return response.json()
}

// Fetch comparison data for selected properties
const fetchComparisonData = async (propertyIds: string[]) => {
  if (!propertyIds.length) return { properties: [] }

  const queryParams = new URLSearchParams()
  propertyIds.forEach(id => queryParams.append('ids', id))

  const response = await fetch(`/api/properties/compare?${queryParams.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch comparison data')
  }
  return response.json()
}

export function PropertyComparison() {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])

  // Fetch available properties
  const { data: availablePropertiesData, isLoading: isLoadingProperties, error: propertiesError } = useQuery({
    queryKey: ['availableProperties'],
    queryFn: fetchAvailableProperties,
  })

  // Fetch comparison data when selected properties change
  const { data: comparisonData, isLoading: isLoadingComparison, error: comparisonError } = useQuery({
    queryKey: ['propertyComparison', selectedProperties],
    queryFn: () => fetchComparisonData(selectedProperties),
    enabled: selectedProperties.length > 0,
  })

  // Updated to handle selection for specific position
  const handlePropertySelect = (propertyId: string, position: number) => {
    // Create a copy of the current selections
    const updatedSelections = [...selectedProperties]

    // If the property is already selected in another position, remove it first
    const existingIndex = updatedSelections.indexOf(propertyId)
    if (existingIndex !== -1) {
      updatedSelections.splice(existingIndex, 1)
    }

    // Update the property at the specified position
    updatedSelections[position] = propertyId

    // Filter out any undefined values that might occur
    setSelectedProperties(updatedSelections.filter(Boolean))
  }

  const compareProperties = comparisonData?.properties || []

  // Handle loading state
  if (isLoadingProperties) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compare Properties</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-center h-40">
            <p>Loading properties...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle error state
  if (propertiesError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compare Properties</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-red-500">Error loading properties. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Properties</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="mb-4 flex gap-2">
          {[1, 2, 3].map((index) => (
            <Select
              key={index}
              onValueChange={(value) => handlePropertySelect(value, index - 1)}
              value={selectedProperties[index - 1]}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={`Select Property ${index}`} />
              </SelectTrigger>
              <SelectContent>
                {availablePropertiesData?.properties?.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title} - {property.location?.name || 'Unknown location'}, {property.propertyType?.name || 'Unknown type'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {isLoadingComparison && (
          <div className="flex items-center justify-center h-40">
            <p>Loading comparison data...</p>
          </div>
        )}

        {comparisonError && (
          <div className="flex items-center justify-center h-40">
            <p className="text-red-500">Error loading comparison data. Please try again later.</p>
          </div>
        )}

        {!isLoadingComparison && !comparisonError && compareProperties.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  {compareProperties.map((property) => (
                    <TableHead key={property.id}>{property.title}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Price</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>ZMW {property.price.toLocaleString()}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Property Type</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>{property.propertyType?.name || 'N/A'}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Bedrooms</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>{property.bedrooms || 'N/A'}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Bathrooms</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>{property.bathrooms || 'N/A'}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Area (sq ft)</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>{property.squareFootage || 'N/A'}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Price per sq ft</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>
                      {property.metrics?.pricePerSqFt
                        ? `ZMW ${property.metrics.pricePerSqFt.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                        : 'N/A'}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Year Built</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>{property.yearBuilt || 'N/A'}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Parking</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>{property.metrics?.hasParking ? 'Yes' : 'No'}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Outdoor Space</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>{property.metrics?.hasOutdoorSpace ? 'Yes' : 'No'}</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
