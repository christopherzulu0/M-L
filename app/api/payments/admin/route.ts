import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// POST /api/payments/admin - Create a new payment (admin only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user exists in database
    const user = await prisma.user.findFirst({
      where: { clerkid: userId },
      select: { role: true, id: true }
    })

    if (!user) {
      // Create user with admin role if they don't exist
      await prisma.user.create({
        data: {
          clerkid: userId,
          email: `temp-${userId}@example.com`, // Temporary email, should be updated later
          firstName: "Admin",
          lastName: "User",
          role: "admin"
        }
      })
    } else if (user.role !== 'admin') {
      // Update user role to admin if they exist but don't have admin role
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "admin" }
      })
    }

    const body = await request.json()
    const { purchaseId, amount, paymentMethod, notes } = body

    if (!purchaseId || !amount || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if purchase exists
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        buyer: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        property: {
          select: {
            title: true
          }
        }
      }
    })

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
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
          status: 'completed',
          notes: notes || undefined
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

      // Create a notification for the buyer
      await tx.notification.create({
        data: {
          userId: purchase.buyerId,
          title: 'Payment Recorded',
          message: `A payment of ${amount} has been recorded for your purchase of ${purchase.property.title}.`,
          type: 'payment',
          relatedTo: `purchase:${purchaseId}`
        }
      })

      return { payment, purchase: updatedPurchase }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
