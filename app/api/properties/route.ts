import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/properties - Get properties with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Authentication is optional for this endpoint
    const { userId } = await auth()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const propertyTypeId = searchParams.get('propertyTypeId')
    const listingTypeId = searchParams.get('listingTypeId')
    const locationId = searchParams.get('locationId')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const limit = searchParams.get('limit')

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (propertyTypeId) {
      where.propertyTypeId = parseInt(propertyTypeId)
    }

    if (listingTypeId) {
      where.listingTypeId = parseInt(listingTypeId)
    }

    if (locationId) {
      where.locationId = parseInt(locationId)
    }

    if (minPrice) {
      where.price = {
        ...where.price,
        gte: parseFloat(minPrice)
      }
    }

    if (maxPrice) {
      where.price = {
        ...where.price,
        lte: parseFloat(maxPrice)
      }
    }

    // Query properties
    const properties = await prisma.property.findMany({
      where,
      include: {
        listingType: {
          select: {
            id: true,
            name: true
          }
        },
        propertyType: {
          select: {
            id: true,
            name: true
          }
        },
        location: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true
          }
        },
        media: {
          select: {
            id: true,
            filePath: true,
            isPrimary: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json({ properties })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
