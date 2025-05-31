import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/payments - Get all payments (admin) or user's payments (regular user)
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

    // Build query based on user role
    let paymentsQuery: any = {
      include: {
        purchase: {
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
            }
          }
        }
      },
      orderBy: {
        paymentDate: 'desc'
      }
    }

    // If not admin, only show payments for purchases made by this user
    if (user.role !== 'admin') {
      paymentsQuery.where = {
        purchase: {
          buyerId: user.id
        }
      }
    }

    const payments = await prisma.payment.findMany(paymentsQuery)

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/payments - Create a new payment (for users)
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
    const { purchaseId, amount, paymentMethod } = body

    if (!purchaseId || !amount || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if purchase exists and belongs to the user
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId }
    })

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    if (purchase.buyerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (purchase.status === 'completed' || purchase.status === 'cancelled') {
      return NextResponse.json({ error: 'Cannot make payment on a completed or cancelled purchase' }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Payment amount must be greater than zero' }, { status: 400 })
    }

    if (amount > purchase.remainingAmount) {
      return NextResponse.json({ error: 'Payment amount cannot exceed the remaining amount' }, { status: 400 })
    }

    // Create payment and update purchase in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the payment
      const payment = await tx.payment.create({
        data: {
          purchaseId,
          amount,
          paymentMethod,
          status: 'completed'
        }
      })

      // Calculate new remaining amount
      const newRemainingAmount = purchase.remainingAmount - amount

      // Update purchase
      const updatedPurchase = await tx.purchase.update({
        where: { id: purchaseId },
        data: {
          remainingAmount: newRemainingAmount,
          status: newRemainingAmount <= 0 ? 'completed' : 'pending',
          completionDate: newRemainingAmount <= 0 ? new Date() : null
        }
      })

      // If purchase is now completed, update property status
      if (newRemainingAmount <= 0) {
        await tx.property.update({
          where: { id: purchase.propertyId },
          data: {
            status: 'sold',
            soldRentedAt: new Date()
          }
        })
      }

      return { payment, purchase: updatedPurchase }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
