import { NextResponse } from "next/server"
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // Get all unique regions
        const regions = await prisma.location.findMany({
            select: {
                region: true
            },
            distinct: ['region'],
            where: {
                region: {
                    not: null
                }
            }
        })

        // Get statistics for each region
        const regionStats = await Promise.all(
            regions.map(async ({ region }) => {
                if (!region) return null

                const locationCount = await prisma.location.count({
                    where: { region }
                })

                const propertyCount = await prisma.property.count({
                    where: {
                        location: {
                            region
                        }
                    }
                })

                // Calculate average price for the region
                const avgPriceResult = await prisma.property.aggregate({
                    where: {
                        location: {
                            region
                        }
                    },
                    _avg: {
                        price: true
                    }
                })

                return {
                    name: region,
                    count: propertyCount,
                    growth: "+5%", // This should be calculated based on historical data
                    avgPrice: `ZMW ${Math.round(avgPriceResult._avg.price || 0).toLocaleString()}`
                }
            })
        )

        // Filter out null values and return the stats
        return NextResponse.json(regionStats.filter(Boolean))
    } catch (error) {
        console.error("Error fetching region stats:", error)
        return NextResponse.json(
            { error: "Failed to fetch region statistics" },
            { status: 500 }
        )
    }
} 