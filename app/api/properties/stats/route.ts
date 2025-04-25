import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30' // days
    const locationId = searchParams.get('locationId')
    const propertyTypeId = searchParams.get('propertyTypeId')

    const dateFilter = new Date()
    dateFilter.setDate(dateFilter.getDate() - parseInt(timeframe))

    const where: any = {
      createdAt: {
        gte: dateFilter
      }
    }

    if (locationId) where.locationId = parseInt(locationId)
    if (propertyTypeId) where.propertyTypeId = parseInt(propertyTypeId)

    // Get total properties and average price
    const [totalProperties, avgPrice, priceRange, statusDistribution, typeDistribution] = await Promise.all([
      // Total properties count
      prisma.property.count({
        where
      }),

      // Average price
      prisma.property.aggregate({
        where,
        _avg: {
          price: true
        }
      }),

      // Price range
      prisma.property.aggregate({
        where,
        _min: {
          price: true
        },
        _max: {
          price: true
        }
      }),

      // Status distribution
      prisma.property.groupBy({
        where,
        by: ['status'],
        _count: true
      }),

      // Property type distribution
      prisma.property.groupBy({
        where,
        by: ['propertyTypeId'],
        _count: true
      })
    ])

    // Get trend data
    const trendData = await prisma.property.groupBy({
      where,
      by: ['createdAt'],
      _count: true,
      _avg: {
        price: true
      }
    })

    // Calculate price per square foot distribution
    const pricePerSqFt = await prisma.property.findMany({
      where,
      select: {
        price: true,
        squareFeet: true
      }
    })

    const pricePerSqFtStats = pricePerSqFt
      .filter(p => p.squareFeet > 0)
      .map(p => ({
        value: p.price / p.squareFeet
      }))

    // Get property types for mapping IDs to names
    const propertyTypes = await prisma.propertyType.findMany({
      select: {
        id: true,
        name: true
      }
    })

    const typeDistributionWithNames = typeDistribution.map(type => ({
      type: propertyTypes.find(pt => pt.id === type.propertyTypeId)?.name || 'Unknown',
      count: type._count
    }))

    return NextResponse.json({
      overview: {
        totalProperties,
        averagePrice: avgPrice._avg.price || 0,
        priceRange: {
          min: priceRange._min.price || 0,
          max: priceRange._max.price || 0
        }
      },
      distributions: {
        status: statusDistribution,
        propertyTypes: typeDistributionWithNames,
        pricePerSqFt: pricePerSqFtStats
      },
      trends: {
        daily: trendData
      }
    })
  } catch (error) {
    console.error('Property stats error:', error)
    return NextResponse.json(
      { error: 'Error fetching property statistics' },
      { status: 500 }
    )
  }
}
