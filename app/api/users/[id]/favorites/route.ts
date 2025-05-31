import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = await params
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            propertyType: true,
            location: true,
            media: {
              take: 1,
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(favorites)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching favorites' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = await params
    const body = await request.json()
    const { propertyId } = body

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        propertyId
      }
    })

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Property already in favorites' },
        { status: 400 }
      )
    }

    const favorite = await prisma.favorite.create({
      data: {
        user: { connect: { id: userId } },
        property: { connect: { id: propertyId } }
      },
      include: {
        property: {
          include: {
            propertyType: true,
            location: true
          }
        }
      }
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error adding to favorites' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = await params
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    await prisma.favorite.deleteMany({
      where: {
        userId,
        propertyId
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error removing from favorites' },
      { status: 500 }
    )
  }
}
