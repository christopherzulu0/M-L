import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const listingTypes = await prisma.listingType.findMany({
      include: {
        properties: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
    return NextResponse.json(listingTypes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching listing types' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    const listingType = await prisma.listingType.create({
      data: {
        name,
        description
      }
    })

    return NextResponse.json(listingType, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating listing type' }, 
      { status: 500 }
    )
  }
}
