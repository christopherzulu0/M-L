import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/purchases/[id] - Get a specific purchase
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const purchaseId = parseInt(id)

    if (isNaN(purchaseId)) {
      return NextResponse.json({ error: 'Invalid purchase ID' }, { status: 400 })
    }

    // Get user from database
    const user = await prisma.user.findFirst({
      where: { clerkid: userId },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch the purchase
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            price: true,
            status: true,
            media: {
              select: {
                filePath: true,
                isPrimary: true
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            paymentMethod: true,
            paymentDate: true,
            status: true,
            notes: true
          },
          orderBy: {
            paymentDate: 'desc'
          }
        }
      }
    })

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    // Check if user is authorized to view this purchase
    // Allow if user is admin or the buyer
    if (user.role !== 'admin' && purchase.buyerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(purchase)
  } catch (error) {
    console.error('Error fetching purchase:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/purchases/[id] - Update a purchase (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findFirst({
      where: { clerkid: userId },
      select: { role: true }
    })

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const purchaseId = parseInt(id)

    if (isNaN(purchaseId)) {
      return NextResponse.json({ error: 'Invalid purchase ID' }, { status: 400 })
    }

    const body = await request.json()
    const { status, notes } = body

    // Validate status
    if (status && !['pending', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
    }

    // Check if purchase exists
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId }
    })

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    // Update purchase
    const updatedPurchase = await prisma.$transaction(async (tx) => {
      const updated = await tx.purchase.update({
        where: { id: purchaseId },
        data: {
          status: status || undefined,
          notes: notes !== undefined ? notes : undefined,
          completionDate: status === 'completed' ? new Date() : undefined
        }
      })

      // If status is completed, update property status to sold
      if (status === 'completed') {
        await tx.property.update({
          where: { id: purchase.propertyId },
          data: {
            status: 'sold',
            soldRentedAt: new Date()
          }
        })
      }

      // If status is cancelled, update property status back to active
      if (status === 'cancelled') {
        await tx.property.update({
          where: { id: purchase.propertyId },
          data: {
            status: 'active',
            soldRentedAt: null
          }
        })
      }

      return updated
    })

    return NextResponse.json(updatedPurchase)
  } catch (error) {
    console.error('Error updating purchase:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
