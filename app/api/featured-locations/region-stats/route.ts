import { NextResponse } from "next/server"
import prisma from '@/lib/prisma'
import { subMonths } from 'date-fns'

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

                // Get current property count
                const currentPropertyCount = await prisma.property.count({
                    where: {
                        location: {
                            region
                        }
                    }
                })

                // Get property count from last month
                const lastMonth = subMonths(new Date(), 1)
                const lastMonthPropertyCount = await prisma.property.count({
                    where: {
                        location: {
                            region
                        },
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

                // Convert Decimal to number and handle null case
                const avgPrice = avgPriceResult._avg.price 
                    ? Number(avgPriceResult._avg.price) 
                    : null

                return {
                    name: region,
                    count: currentPropertyCount,
                    growth: currentPropertyCount.toString(),
                    avgPrice: avgPrice !== null ? `ZMW ${Math.round(avgPrice).toLocaleString()}` : "N/A"
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
