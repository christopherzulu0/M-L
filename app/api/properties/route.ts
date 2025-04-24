import { PrismaClient } from '@/lib/generated/prisma'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Filtering
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999999')
    const propertyType = searchParams.get('propertyType')
    const location = searchParams.get('location')
    const status = searchParams.get('status')
    const agentId = searchParams.get('agentId')
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {
      price: {
        gte: minPrice,
        lte: maxPrice
      }
    }

    if (propertyType) where.propertyTypeId = parseInt(propertyType)
    if (location) where.locationId = parseInt(location)
    if (status) where.status = status
    if (agentId) where.agentId = parseInt(agentId)

    // Execute query
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        skip,
        take: limit,
        where,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          propertyType: true,
          listingType: true,
          location: true,
          agent: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                  profileImage: true
                }
              }
            }
          },
          features: {
            include: {
              feature: true
            }
          },
          media: true
        }
      }),
      prisma.property.count({ where })
    ])

    return NextResponse.json({
      properties,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching properties' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      price,
      status,
      propertyTypeId,
      listingTypeId,
      locationId,
      agentId,
      features,
      media,
      DView,
      address,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      squareFeet,
      lotSize,
      yearBuilt,
      parkingSpaces
    } = body

    console.log('Received request body:', body)

    // Validate required fields
    if (!title || !propertyTypeId || !listingTypeId || !locationId || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if agent exists if agentId is provided
    if (agentId) {
      const existingAgent = await prisma.agent.findUnique({
        where: { id: Number(agentId) }
      });
      
      if (!existingAgent) {
        return NextResponse.json(
          { error: 'Selected agent does not exist' },
          { status: 400 }
        );
      }
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: typeof price === 'string' ? parseFloat(price) : price,
        status,
        DView,
        address,
        latitude,
        longitude,
        bedrooms,
        bathrooms,
        squareFeet,
        lotSize,
        yearBuilt,
        parkingSpaces,
        propertyType: {
          connect: {
            id: Number(propertyTypeId)
          }
        },
        listingType: {
          connect: {
            id: Number(listingTypeId)
          }
        },
        location: {
          connect: {
            id: Number(locationId)
          }
        },
        agent: agentId ? {
          connect: {
            id: Number(agentId)
          }
        } : undefined,
        features: features?.create?.length ? {
          create: features.create
        } : undefined,
        media: media
      },
      include: {
        propertyType: true,
        listingType: true,
        location: true,
        agent: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        features: {
          include: {
            feature: true
          }
        },
        media: true
      }
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Property creation error:', error)
    return NextResponse.json(
      { error: 'Error creating property' },
      { status: 500 }
    )
  }
}