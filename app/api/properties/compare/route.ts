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

    const properties = await prisma.property.findMany({
      where: {
        id: {
          in: propertyIds
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
        min: Math.min(...properties.map(p => p.price)),
        max: Math.max(...properties.map(p => p.price)),
        diff: Math.max(...properties.map(p => p.price)) - Math.min(...properties.map(p => p.price))
      },
      squareFootageRange: {
        min: Math.min(...properties.filter(p => p.squareFootage).map(p => p.squareFootage!)),
        max: Math.max(...properties.filter(p => p.squareFootage).map(p => p.squareFootage!))
      },
      commonFeatures: getCommonFeatures(properties),
      uniqueFeatures: getUniqueFeatures(properties)
    }

    return NextResponse.json({
      properties: enrichedProperties,
      summary
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error comparing properties' },
      { status: 500 }
    )
  }
}

function getCommonFeatures(properties: any[]) {
  if (!properties.length) return []
  
  const allFeatureSets = properties.map(p => 
    new Set(p.features.map((f: any) => f.feature.name))
  )
  
  return [...allFeatureSets[0]].filter(feature => 
    allFeatureSets.every(set => set.has(feature))
  )
}

function getUniqueFeatures(properties: any[]) {
  const uniqueFeatures: { [propertyId: string]: string[] } = {}
  
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