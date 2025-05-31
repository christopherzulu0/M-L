import { NextResponse } from "next/server"
import prisma from '@/lib/prisma'
import { subMonths } from 'date-fns'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Await params before destructuring
        const paramsData = await params;
        const { id: paramId } = paramsData;
        const id = parseInt(paramId)

        // Find the location
        const location = await prisma.location.findUnique({
            where: { id },
            include: {
                properties: {
                    include: {
                        media: true,
                        propertyType: true
                    }
                }
            }
        })

        console.log("Location from database:", location)
        console.log("Properties in location:", location?.properties?.length || 0)

        // Check if properties exist in the database for this location
        const propertiesCount = await prisma.property.count({
            where: {
                locationId: id
            }
        })

        console.log("Properties count from direct query:", propertiesCount)

        // If properties are missing from the location, fetch them directly
        if (location && (!location.properties || location.properties.length === 0) && propertiesCount > 0) {
            console.log("Properties missing from location, fetching directly")

            // Fetch properties directly
            const properties = await prisma.property.findMany({
                where: {
                    locationId: id
                },
                include: {
                    media: true,
                    propertyType: true
                }
            })

            console.log("Properties fetched directly:", properties.length)

            // Add properties to location
            location.properties = properties
        }

        // Ensure all properties have their latitude and longitude fields
        if (location && location.properties) {
            // This ensures all property fields are properly serialized
            location.properties = location.properties.map(property => ({
                ...property,
                latitude: property.latitude,
                longitude: property.longitude,
                price: property.price.toString()
            }))
        }

        if (!location) {
            return NextResponse.json(
                { error: "Featured location not found" },
                { status: 404 }
            )
        }

        // Calculate average price for the location
        const avgPriceResult = await prisma.property.aggregate({
            where: {
                locationId: id
            },
            _avg: {
                price: true
            }
        })

        // Convert Decimal to number and handle null case
        const avgPrice = avgPriceResult._avg.price 
            ? Number(avgPriceResult._avg.price) 
            : null

        // Add growth and avgPrice to the location data
        const locationWithStats = {
            ...location,
            growth: location.properties.length.toString(),
            avgPrice: avgPrice !== null ? `ZMW ${Math.round(avgPrice).toLocaleString()}` : "N/A"
        }

        return NextResponse.json(locationWithStats)
    } catch (error) {
        console.error("Error fetching featured location:", error)
        return NextResponse.json(
            { error: "Failed to fetch featured location" },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Await params before destructuring
        const paramsData = await params;
        const { id: paramId } = paramsData;
        const id = parseInt(paramId)
        const body = await request.json()

        // Extract the fields from the request body
        const { 
            name, 
            region, 
            description, 
            featured, 
            order,
            image
        } = body

        // Check if location exists
        const location = await prisma.location.findUnique({
            where: { id }
        })

        if (!location) {
            return NextResponse.json(
                { error: "Featured location not found" },
                { status: 404 }
            )
        }

        // Update the location
        const updatedLocation = await prisma.location.update({
            where: { id },
            data: {
                name,
                region,
                description,
                featured,
                order,
                image
            }
        })

        return NextResponse.json(updatedLocation)
    } catch (error) {
        console.error("Error updating featured location:", error)
        return NextResponse.json(
            { error: "Failed to update featured location" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Await params before destructuring
        const paramsData = await params;
        const { id: paramId } = paramsData;
        const id = parseInt(paramId)

        // Check if location exists
        const location = await prisma.location.findUnique({
            where: { id }
        })

        if (!location) {
            return NextResponse.json(
                { error: "Featured location not found" },
                { status: 404 }
            )
        }

        // Delete the location
        await prisma.location.delete({
            where: { id }
        })

        return NextResponse.json({ message: "Featured location deleted successfully" })
    } catch (error) {
        console.error("Error deleting featured location:", error)
        return NextResponse.json(
            { error: "Failed to delete featured location" },
            { status: 500 }
        )
    }
} 
