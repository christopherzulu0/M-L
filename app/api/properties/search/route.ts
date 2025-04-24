import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Search parameters
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Advanced filters
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999999')
    const propertyTypes = searchParams.getAll('propertyType')
    const features = searchParams.getAll('feature')
    const bedrooms = parseInt(searchParams.get('bedrooms') || '0')
    const bathrooms = parseInt(searchParams.get('bathrooms') || '0')
    const cityName = searchParams.get('city')
    const stateName = searchParams.get('state')

    // Build where clause
    const where: any = {
      AND: [
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        {
          price: {
            gte: minPrice,
            lte: maxPrice
          }
        }
      ]
    }

    // Add property type filter
    if (propertyTypes.length > 0) {
      where.AND.push({
        propertyType: {
          id: { in: propertyTypes.map(id => parseInt(id)) }
        }
      })
    }

    // Add features filter
    if (features.length > 0) {
      where.AND.push({
        features: {
          some: {
            feature: {
              id: { in: features.map(id => parseInt(id)) }
            }
          }
        }
      })
    }

    // Add rooms filter
    if (bedrooms > 0) {
      where.AND.push({ bedrooms: { gte: bedrooms } })
    }
    if (bathrooms > 0) {
      where.AND.push({ bathrooms: { gte: bathrooms } })
    }

    // Add location filter
    if (cityName || stateName) {
      where.AND.push({
        location: {
          ...(cityName && { cityName: { equals: cityName, mode: 'insensitive' } }),
          ...(stateName && { stateName: { equals: stateName, mode: 'insensitive' } })
        }
      })
    }

    // Execute search query
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
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
        },
        orderBy: [
          { score: 'desc' },
          { createdAt: 'desc' }
        ]
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
    console.error('Property search error:', error)
    return NextResponse.json(
      { error: 'Error searching properties' },
      { status: 500 }
    )
  }
}