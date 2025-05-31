import { NextResponse } from "next/server"
import prisma from '@/lib/prisma'
import { subDays } from 'date-fns'

export async function GET() {
    try {
        const recentProperties = await prisma.property.findMany({
            where: {
                createdAt: {
                    gte: subDays(new Date(), 30) // Last 30 days
                }
            },
            include: {
                propertyType: true,
                listingType: true,
                location: true,
                agent: {
                    include: {
                        user: true
                    }
                },
                media: {
                    where: {
                        mediaType: "image"
                    },
                    take: 1
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 3
        })

        const formattedProperties = recentProperties.map(property => ({
            id: property.id,
            image: property.media[0]?.filePath || "/placeholder.svg",
            title: property.title,
            address: property.address,
            price: `ZMW ${property.price.toLocaleString()}`,
            beds: property.bedrooms || 0,
            baths: property.bathrooms || 0,
            sqft: property.squareFeet || 0,
            status: property.listingType.name,
            listed: formatTimeAgo(property.createdAt),
            rating: property.agent?.rating || 4.5,
            views: property.views
        }))

        return NextResponse.json(formattedProperties)
    } catch (error) {
        console.error("Error fetching recent properties:", error)
        return NextResponse.json(
            { error: "Failed to fetch recent properties" },
            { status: 500 }
        )
    }
}

function formatTimeAgo(date: Date): string {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
} 