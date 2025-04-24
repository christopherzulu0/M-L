"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Property {
  id: string
  title: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  yearBuilt: number
}

const sampleProperties: Property[] = [
  { id: "1", title: "Modern Apartment", price: 250000, bedrooms: 2, bathrooms: 2, area: 1000, yearBuilt: 2020 },
  { id: "2", title: "Suburban House", price: 350000, bedrooms: 3, bathrooms: 2.5, area: 1800, yearBuilt: 2015 },
  { id: "3", title: "Downtown Condo", price: 200000, bedrooms: 1, bathrooms: 1, area: 750, yearBuilt: 2018 },
]

export function PropertyComparison() {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])

  const handlePropertySelect = (propertyId: string) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(selectedProperties.filter((id) => id !== propertyId))
    } else if (selectedProperties.length < 3) {
      setSelectedProperties([...selectedProperties, propertyId])
    }
  }

  const compareProperties = sampleProperties.filter((property) => selectedProperties.includes(property.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Properties</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="mb-4 flex gap-2">
          {[1, 2, 3].map((index) => (
            <Select key={index} onValueChange={handlePropertySelect} value={selectedProperties[index - 1]}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={`Select Property ${index}`} />
              </SelectTrigger>
              <SelectContent>
                {sampleProperties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
        {compareProperties.length > 0 && (
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
                  <TableCell>Bedrooms</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>{property.bedrooms}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Bathrooms</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>{property.bathrooms}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Area (sq ft)</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>{property.area}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Year Built</TableCell>
                  {compareProperties.map((property) => (
                    <TableCell key={property.id}>{property.yearBuilt}</TableCell>
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
