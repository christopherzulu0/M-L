import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const specialization = await prisma.specialization.findUnique({
      where: { id: params.id },
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
    const body = await request.json()
    const { name, description } = body

    const specialization = await prisma.specialization.update({
      where: { id: params.id },
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
    await prisma.specialization.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting specialization' },
      { status: 500 }
    )
  }
}