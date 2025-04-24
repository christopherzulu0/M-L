import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const media = await prisma.propertyMedia.findMany({
      where: { propertyId: params.id },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(media)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching property media' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { url, type, order = 0, caption } = body

    const media = await prisma.propertyMedia.create({
      data: {
        url,
        type,
        order,
        caption,
        property: { connect: { id: params.id } }
      }
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error adding property media' },
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
    const updates = body.map((item: any) => 
      prisma.propertyMedia.update({
        where: { id: item.id },
        data: { order: item.order, caption: item.caption }
      })
    )

    await prisma.$transaction(updates)
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating property media' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const mediaId = searchParams.get('mediaId')

    if (!mediaId) {
      return NextResponse.json(
        { error: 'Media ID is required' },
        { status: 400 }
      )
    }

    await prisma.propertyMedia.delete({
      where: { id: mediaId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting property media' },
      { status: 500 }
    )
  }
}