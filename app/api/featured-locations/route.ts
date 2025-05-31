import { NextResponse } from "next/server"
import prisma from '@/lib/prisma'
import { subMonths } from 'date-fns'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""
        const sortBy = searchParams.get("sortBy") || "name"
        const sortOrder = searchParams.get("sortOrder") || "asc"
        const featured = searchParams.get("featured")
        const region = searchParams.get("region")

        // Build the where clause
        const where: any = {}
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { region: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ]
        }
        if (featured) {
            where.featured = featured === "true"
        }
        if (region) {
            where.region = region
        }

        // Build the orderBy clause
        const orderBy: any = {}

        // Map frontend sort fields to database fields
        if (sortBy === "count") {
            // For count, we'll sort after fetching the data
        } else if (sortBy === "createdAt") {
            orderBy["createdAt"] = sortOrder
        } else {
            orderBy[sortBy] = sortOrder
        }

        // Fetch locations with property counts
        const locations = await prisma.location.findMany({
            where,
            orderBy,
            include: {
                _count: {
                    select: { properties: true }
                }
            }
        })

        // Get last month's date for growth calculation
        const lastMonth = subMonths(new Date(), 1)

        // Transform the data to include property counts and other calculated fields
        const transformedLocations = await Promise.all(
            locations.map(async (location) => {
                // Get current property count
                const currentPropertyCount = location._count.properties

                // Get property count from last month
                const lastMonthPropertyCount = await prisma.property.count({
                    where: {
                        locationId: location.id,
                        createdAt: {
                            lt: lastMonth
                        }
                    }
                })

                // Calculate growth percentage
                let growth = 0
                let formattedGrowth = "0%"

                if (currentPropertyCount > 0) {
                    if (lastMonthPropertyCount === 0) {
                        // If there were no properties last month but there are now, show the actual count as growth
                        growth = currentPropertyCount
                        formattedGrowth = `+${growth}`
                    } else {
                        // Calculate percentage growth
                        growth = ((currentPropertyCount - lastMonthPropertyCount) / lastMonthPropertyCount) * 100
                        formattedGrowth = growth >= 0 
                            ? `+${growth.toFixed(1)}%` 
                            : `${growth.toFixed(1)}%`
                    }
                } else if (lastMonthPropertyCount > 0) {
                    // If there were properties last month but none now, show -100%
                    formattedGrowth = "-100%"
                }

                // Calculate average price for the location
                const avgPriceResult = await prisma.property.aggregate({
                    where: {
                        locationId: location.id
                    },
                    _avg: {
                        price: true
                    }
                })

                // Convert Decimal to number and handle null case
                const avgPrice = avgPriceResult._avg.price 
                    ? Number(avgPriceResult._avg.price) 
                    : null

                return {
                    id: location.id,
                    name: location.name,
                    region: location.region,
                    description: location.description,
                    featured: location.featured,
                    image: location.image,
                    count: currentPropertyCount,
                    createdAt: location.createdAt,
                    growth: currentPropertyCount.toString(),
                    avgPrice: avgPrice !== null ? `ZMW ${Math.round(avgPrice).toLocaleString()}` : "N/A"
                }
            })
        )

        // Apply custom sorting for count if needed
        if (sortBy === "count") {
            transformedLocations.sort((a, b) => {
                return sortOrder === "asc" 
                    ? a.count - b.count 
                    : b.count - a.count
            })
        }

        return NextResponse.json(transformedLocations)
    } catch (error) {
        console.error("Error fetching featured locations:", error)
        return NextResponse.json(
            { error: "Failed to fetch featured locations" },
            { status: 500 }
        )
    }
} 
