import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const location = await prisma.location.findUnique({
      where: { id: params.id },
      include: {
        properties: {
          include: {
            propertyType: true,
            media: true,
            agent: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    return NextResponse.json(location)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching location' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, cityName, stateName, countryName, postalCode } = body

    const location = await prisma.location.update({
      where: { id: params.id },
      data: {
        name,
        cityName,
        stateName,
        countryName,
        postalCode
      }
    })

    return NextResponse.json(location)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating location' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // Check if location exists
    const location = await prisma.location.findUnique({
      where: { id }
    })

    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      )
    }

    // Delete the location
    await prisma.location.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Location deleted successfully" })
  } catch (error) {
    console.error("Error deleting location:", error)
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    )
  }
}
