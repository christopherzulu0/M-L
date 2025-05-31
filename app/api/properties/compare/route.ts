import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyIds = searchParams.getAll('ids')

    if (!propertyIds.length) {
      return NextResponse.json(
        { error: 'Property IDs are required' },
        { status: 400 }
      )
    }

    // Convert string IDs to integers for Prisma
    const propertyIdsAsIntegers = propertyIds.map(id => {
      const parsedId = parseInt(id, 10)
      if (isNaN(parsedId)) {
        throw new Error(`Invalid property ID: ${id}. Property IDs must be valid integers.`)
      }
      return parsedId
    })

    const properties = await prisma.property.findMany({
      where: {
        id: {
          in: propertyIdsAsIntegers
        }
      },
      include: {
        propertyType: true,
        listingType: true,
        location: true,
        features: {
          include: {
            feature: true
          }
        },
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
        }
      }
    })

    // Calculate additional comparison metrics
    const enrichedProperties = properties.map(property => {
      const pricePerSqFt = property.squareFootage
        ? property.price / property.squareFootage
        : null

      return {
        ...property,
        metrics: {
          pricePerSqFt,
          totalRooms: (property.bedrooms || 0) + (property.bathrooms || 0),
          hasParking: property.features.some(f =>
            f.feature.name.toLowerCase().includes('parking') ||
            f.feature.name.toLowerCase().includes('garage')
          ),
          hasOutdoorSpace: property.features.some(f =>
            f.feature.name.toLowerCase().includes('garden') ||
            f.feature.name.toLowerCase().includes('patio') ||
            f.feature.name.toLowerCase().includes('balcony')
          )
        }
      }
    })

    // Calculate comparison summary
    const summary = {
      priceRange: {
        min: properties.length ? Math.min(...properties.map(p => p.price)) : 0,
        max: properties.length ? Math.max(...properties.map(p => p.price)) : 0,
        diff: properties.length > 1 ? Math.max(...properties.map(p => p.price)) - Math.min(...properties.map(p => p.price)) : 0
      },
      squareFootageRange: {
        min: properties.filter(p => p.squareFootage).length ? Math.min(...properties.filter(p => p.squareFootage).map(p => p.squareFootage!)) : 0,
        max: properties.filter(p => p.squareFootage).length ? Math.max(...properties.filter(p => p.squareFootage).map(p => p.squareFootage!)) : 0
      },
      commonFeatures: getCommonFeatures(properties),
      uniqueFeatures: getUniqueFeatures(properties)
    }

    return NextResponse.json({
      properties: enrichedProperties,
      summary
    })
  } catch (error) {
    console.error('Property comparison error:', error)
    return NextResponse.json(
      {
        error: 'Error comparing properties',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function getCommonFeatures(properties: any[]) {
  if (!properties.length) return []

  // For a single property, all its features are "common"
  if (properties.length === 1) {
    return properties[0].features.map((f: any) => f.feature.name)
  }

  const allFeatureSets = properties.map(p =>
    new Set(p.features.map((f: any) => f.feature.name))
  )

  return [...allFeatureSets[0]].filter(feature =>
    allFeatureSets.every(set => set.has(feature))
  )
}

function getUniqueFeatures(properties: any[]) {
  const uniqueFeatures: { [propertyId: string]: string[] } = {}

  // For a single property, the concept of "unique features" doesn't apply
  // But we can return all features as "unique" for consistency
  if (properties.length === 1) {
    const property = properties[0]
    uniqueFeatures[property.id] = property.features.map((f: any) => f.feature.name)
    return uniqueFeatures
  }

  properties.forEach(property => {
    const propertyFeatures = new Set(property.features.map((f: any) => f.feature.name))
    const otherProperties = properties.filter(p => p.id !== property.id)

    const uniqueToThisProperty = [...propertyFeatures].filter(feature =>
      !otherProperties.some(p =>
        p.features.some((f: any) => f.feature.name === feature)
      )
    )

    if (uniqueToThisProperty.length > 0) {
      uniqueFeatures[property.id] = uniqueToThisProperty
    }
  })

  return uniqueFeatures
}
