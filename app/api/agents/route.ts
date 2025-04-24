import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {auth} from "@clerk/nextjs/server";

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImage: true
          }
        }
      }
    })

    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
 const session = await auth();

 if(!session || session?.userId === null){
   return NextResponse.json({error:"Unauthorized"},{status:401})
 }

  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      bio,
      specialization,
      licenseNumber,
      commissionRate,
      joinDate,
      status,
      rating,
      existingUser,
      userId,
      createAccount,
      profileImage
    } = body

    // If using existing user
    if (existingUser && userId) {
      // First verify the user exists and is not already an agent
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: { agent: true }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      if (user.agent) {
        return NextResponse.json({ error: 'User is already an agent' }, { status: 400 })
      }

      // Update user with new profile image if provided
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          role: 'AGENT',
          profileImage: profileImage || user.profileImage // Keep existing image if no new one provided
        }
      })

      // Create the agent
      const agent = await prisma.agent.create({
        data: {
          userId: user.id,
          bio,
          specialization,
          licenseNumber,
          commissionRate: commissionRate ? parseFloat(commissionRate) : undefined,
          joinDate: joinDate ? new Date(joinDate) : new Date(),
          status,
          rating: rating ? parseFloat(rating) : undefined
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
          }
        }
      })

      return NextResponse.json(agent, { status: 201 })
    }

    // Create new user and agent
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        profileImage: profileImage || null, // Ensure profile Image is properly set
        role: 'AGENT',
        agent: {
          create: {
            bio,
            specialization,
            licenseNumber,
            commissionRate: commissionRate ? parseFloat(commissionRate) : undefined,
            joinDate: joinDate ? new Date(joinDate) : new Date(),
            status,
            rating: rating ? parseFloat(rating) : undefined
          }
        }
      },
      include: {
        agent: true
      }
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: 'Error creating agent' },
      { status: 500 }
    )
  }
}