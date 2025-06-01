import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is properly awaited
    const { id: paramId } = params;
    const feature = await prisma.feature.findUnique({
      where: { id: paramId },
      include: {
        properties: {
          include: {
            property: {
              select: {
                id: true,
                title: true,
                price: true,
                status: true
              }
            }
          }
        }
      }
    })

    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 })
    }

    return NextResponse.json(feature)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching feature' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is properly awaited
    const { id: paramId } = params;
    const body = await request.json()
    const { name, description, category } = body

    const feature = await prisma.feature.update({
      where: { id: paramId },
      data: {
        name,
        description,
        category
      }
    })

    return NextResponse.json(feature)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating feature' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is properly awaited
    const { id: paramId } = params;
    await prisma.feature.delete({
      where: { id: paramId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting feature' }, { status: 500 })
  }
}
