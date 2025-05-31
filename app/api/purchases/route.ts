import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/purchases - Get all purchases (admin) or user's purchases (regular user)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findFirst({
      where: { clerkid: userId },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get status filter from query params if it exists
    const statusFilter = request.nextUrl.searchParams.get('status')

    // Build where clause
    const whereClause: any = {}

    // If not admin, only show purchases made by this user
    if (user.role !== 'admin') {
      whereClause.buyerId = user.id
    }

    // Add status filter if provided
    if (statusFilter) {
      whereClause.status = statusFilter
    }

    const purchases = await prisma.purchase.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            price: true,
            status: true
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
            status: true
          }
        }
      },
      orderBy: {
        purchaseDate: 'desc'
      }
    })

    return NextResponse.json(purchases)
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/purchases - Create a new purchase
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findFirst({
      where: { clerkid: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { propertyId, totalAmount, downPayment, remainingAmount, paymentMethod } = body

    if (!propertyId || !totalAmount || !downPayment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if property exists and is available
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    if (property.status !== 'published') {
      return NextResponse.json({ error: 'Property is not available for purchase' }, { status: 400 })
    }

    // Create purchase transaction
    const purchase = await prisma.$transaction(async (tx) => {
      // Create the purchase
      const newPurchase = await tx.purchase.create({
        data: {
          propertyId,
          buyerId: user.id,
          totalAmount,
          downPayment,
          remainingAmount,
          status: 'pending'
        }
      })

      // Create the initial payment (down payment)
      await tx.payment.create({
        data: {
          purchaseId: newPurchase.id,
          amount: downPayment,
          paymentMethod: paymentMethod || 'bank_transfer',
          status: 'completed'
        }
      })

      // Update property status to pending
      await tx.property.update({
        where: { id: propertyId },
        data: { status: 'pending' }
      })

      return newPurchase
    })

    return NextResponse.json(purchase, { status: 201 })
  } catch (error) {
    console.error('Error creating purchase:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
