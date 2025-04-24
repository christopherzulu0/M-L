import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const propertyTypes = await prisma.propertyType.findMany({
      include: {
        properties: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
    return NextResponse.json(propertyTypes)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching property types' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    const propertyType = await prisma.propertyType.create({
      data: {
        name,
        description
      }
    })

    return NextResponse.json(propertyType, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating property type' }, 
      { status: 500 }
    )
  }
}