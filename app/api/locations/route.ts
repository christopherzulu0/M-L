import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {auth} from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const locations = await prisma.location.findMany({
      include: {
        properties: {
          select: {
            id: true,
            title: true,
            price: true,
            status: true
          }
        }
      }
    })
    return NextResponse.json(locations)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching locations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if(!session || session?.userId === null){
      return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    const body = await request.json()
    const { 
      name, 
      city, 
      stateProvince, 
      country, 
      postalCode, 
      region, 
      description, 
      featured, 
      order, 
      image 
    } = body

    const location = await prisma.location.create({
      data: {
        name,
        city,
        stateProvince,
        country,
        postalCode,
        region,
        description,
        featured: featured || false,
        order: order || 0,
        image
      }
    })

    return NextResponse.json(location, { status: 201 })
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json(
      { error: 'Error creating location' }, 
      { status: 500 }
    )
  }
}
