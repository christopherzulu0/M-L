import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const specializations = await prisma.specialization.findMany({
      include: {
        agents: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(specializations)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching specializations' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    const specialization = await prisma.specialization.create({
      data: {
        name,
        description
      }
    })

    return NextResponse.json(specialization, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating specialization' },
      { status: 500 }
    )
  }
}