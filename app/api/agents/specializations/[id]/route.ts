import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is properly awaited
    const { id: paramId } = params;
    const specialization = await prisma.specialization.findUnique({
      where: { id: paramId },
      include: {
        agents: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                profileImage: true
              }
            },
            properties: {
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

    if (!specialization) {
      return NextResponse.json(
        { error: 'Specialization not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(specialization)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching specialization' },
      { status: 500 }
    )
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
    const { name, description } = body

    const specialization = await prisma.specialization.update({
      where: { id: paramId },
      data: {
        name,
        description
      }
    })

    return NextResponse.json(specialization)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating specialization' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is properly awaited
    const { id: paramId } = params;
    await prisma.specialization.delete({
      where: { id: paramId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting specialization' },
      { status: 500 }
    )
  }
}
