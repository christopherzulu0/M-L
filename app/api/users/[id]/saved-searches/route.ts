import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = await params
    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(savedSearches)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching saved searches' },
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
    const {
      name,
      searchParams,
      notificationsEnabled = false
    } = body

    const savedSearch = await prisma.savedSearch.create({
      data: {
        user: { connect: { id: userId } },
        name,
        searchParams,
        notificationsEnabled
      }
    })

    return NextResponse.json(savedSearch, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error saving search' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const searchId = searchParams.get('searchId')

    if (!searchId) {
      return NextResponse.json(
        { error: 'Search ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, notificationsEnabled } = body

    const savedSearch = await prisma.savedSearch.update({
      where: { id: searchId },
      data: {
        name,
        notificationsEnabled
      }
    })

    return NextResponse.json(savedSearch)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating saved search' },
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
    const searchId = searchParams.get('searchId')

    if (!searchId) {
      return NextResponse.json(
        { error: 'Search ID is required' },
        { status: 400 }
      )
    }

    await prisma.savedSearch.delete({
      where: { id: searchId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting saved search' },
      { status: 500 }
    )
  }
}
