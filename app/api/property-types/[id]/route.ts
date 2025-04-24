import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const propertyType = await prisma.propertyType.findUnique({
      where: { id: params.id },
      include: {
        properties: {
          include: {
            location: true,
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

    if (!propertyType) {
      return NextResponse.json({ error: 'Property type not found' }, { status: 404 })
    }

    return NextResponse.json(propertyType)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching property type' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description } = body

    const propertyType = await prisma.propertyType.update({
      where: { id: params.id },
      data: {
        name,
        description
      }
    })

    return NextResponse.json(propertyType)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating property type' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.propertyType.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting property type' }, { status: 500 })
  }
}