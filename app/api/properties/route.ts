import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// POST /api/properties - Create a new property
export async function POST(request: NextRequest) {
  try {
    // Authentication is required for creating properties
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['title', 'propertyTypeId', 'listingTypeId', 'price', 'address', 'locationId']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create the property
    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        propertyTypeId: parseInt(body.propertyTypeId),
        listingTypeId: parseInt(body.listingTypeId),
        price: parseFloat(body.price),
        priceType: body.priceType || 'total',
        address: body.address,
        locationId: parseInt(body.locationId),
        latitude: body.latitude,
        longitude: body.longitude,
        bedrooms: body.bedrooms ? parseInt(body.bedrooms) : null,
        bathrooms: body.bathrooms ? parseFloat(body.bathrooms) : null,
        squareFeet: body.squareFeet ? parseFloat(body.squareFeet) : null,
        lotSize: body.lotSize ? parseFloat(body.lotSize) : null,
        yearBuilt: body.yearBuilt ? parseInt(body.yearBuilt) : null,
        parkingSpaces: body.parkingSpaces ? parseInt(body.parkingSpaces) : null,
        status: body.status || 'draft',
        featured: body.featured || false,
        agentId: body.agentId ? parseInt(body.agentId) : null,
        ownerId: body.ownerId ? parseInt(body.ownerId) : null,
        // Store DView and FloorPlan directly on the property
        DView: body.DView || null,
        FloorPlan: body.FloorPlan || null,
        // Handle media creation if provided
        media: body.media?.create ? {
          create: body.media.create
        } : undefined,
        // Handle features if provided
        features: body.features?.create ? {
          create: body.features.create
        } : undefined,
      },
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
        }
      }
    })

    return NextResponse.json({ property }, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
