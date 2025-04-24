import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const inquiries = await prisma.propertyInquiry.findMany({
      where: { propertyId: params.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching property inquiries' },
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
    const {
      userId,
      name,
      email,
      phone,
      message,
      preferredContactMethod,
      viewingRequestDate
    } = body

    const inquiry = await prisma.propertyInquiry.create({
      data: {
        property: { connect: { id: params.id } },
        ...(userId && { user: { connect: { id: userId } } }),
        name,
        email,
        phone,
        message,
        preferredContactMethod,
        viewingRequestDate: viewingRequestDate ? new Date(viewingRequestDate) : null,
        status: 'PENDING'
      },
      include: {
        property: {
          include: {
            agent: {
              include: {
                user: {
                  select: {
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating property inquiry' },
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
    const inquiryId = searchParams.get('inquiryId')
    
    if (!inquiryId) {
      return NextResponse.json(
        { error: 'Inquiry ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status, agentNotes } = body

    const inquiry = await prisma.propertyInquiry.update({
      where: { id: inquiryId },
      data: {
        status,
        agentNotes
      }
    })

    return NextResponse.json(inquiry)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating property inquiry' },
      { status: 500 }
    )
  }
}