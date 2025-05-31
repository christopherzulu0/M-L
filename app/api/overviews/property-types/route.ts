import { NextResponse } from "next/server"
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const propertyTypes = await prisma.propertyType.findMany({
            include: {
                _count: {
                    select: {
                        properties: true
                    }
                }
            }
        })

        const totalProperties = propertyTypes.reduce(
            (sum, type) => sum + type._count.properties,
            0
        )

        const distribution = propertyTypes.map(type => ({
            name: type.name,
            value: type._count.properties,
            percentage: Math.round((type._count.properties / totalProperties) * 100)
        }))

        return NextResponse.json(distribution)
    } catch (error) {
        console.error("Error fetching property type distribution:", error)
        return NextResponse.json(
            { error: "Failed to fetch property type distribution" },
            { status: 500 }
        )
    }
} 