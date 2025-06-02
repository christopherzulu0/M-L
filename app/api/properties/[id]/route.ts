import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    const property = await prisma.property.findUnique({
      where: { id },
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
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching property' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      price,
      status,
      features,
      media,
      ...updateData
    } = body

    const { id: paramId } = await params;
    const id = parseInt(paramId);
    const property = await prisma.property.update({
      where: { id },
      data: {
        ...updateData,
        title,
        description,
        price,
        status,
        // Handle features update
        features: features ? {
          deleteMany: {},
          create: features?.map((featureId: number) => ({
            feature: {
              connect: { id: featureId }
            }
          }))
        } : undefined,
        // Handle media update if provided
        media: media?.create ? {
          deleteMany: {},
          create: media.create
        } : undefined
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
        media: true
      }
    })

    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating property' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    await prisma.property.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting property' }, { status: 500 })
  }
}
