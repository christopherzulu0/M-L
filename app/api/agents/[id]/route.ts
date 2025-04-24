import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {auth} from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await  auth();

    if(!session || session.userId === null){
      return NextResponse.json({error:"Not authorized"},{status:401})
    }

    const agent = await prisma.agent.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            profileImage: true,
            status: true
          }
        },
        specializations: true,
        properties: {
          include: {
            propertyType: true,
            location: true,
            features: {
              include: {
                feature: true
              }
            }
          }
        }
      }
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json(agent)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching agent' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      licenseNumber,
      agency,
      experience,
      bio,
      specializations
    } = body

    const agent = await prisma.agent.update({
      where: { id: params.id },
      data: {
        licenseNumber,
        agency,
        experience,
        bio,
        specializations: {
          set: specializations?.map((id: number) => ({ id })) || []
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImage: true
          }
        },
        specializations: true
      }
    })

    return NextResponse.json(agent)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating agent' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.agent.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting agent' }, { status: 500 })
  }
}