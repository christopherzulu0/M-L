import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {auth} from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        profileImage: true,
        createdAt: true,
        status: true,
        emailVerified: true,
      }
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if(!session || !session.userId === null){
      return NextResponse.json({error: 'Not authorized'},{status: 401})
    }

    const body = await request.json()
    const { email, firstName, lastName, phone, role } = body

    const user = await prisma.user.create({
      data: {
        clerkid: session?.userId,
        email,
        firstName,
        lastName,
        phone,
        role,
        

      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating user' }, 
      { status: 500 }
    )
  }
}