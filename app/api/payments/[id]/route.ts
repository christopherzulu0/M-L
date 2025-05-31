import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/payments/[id] - Get a specific payment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Await params before accessing its properties
    const unwrappedParams = await params
    const paymentId = parseInt(unwrappedParams.id)

    if (isNaN(paymentId)) {
      return NextResponse.json({ error: 'Invalid payment ID' }, { status: 400 })
    }

    // Get user from database
    const user = await prisma.user.findFirst({
      where: { clerkid: userId },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Build query
    const paymentQuery: any = {
      where: { id: paymentId },
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
      }
    }

    const payment = await prisma.payment.findUnique(paymentQuery)

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Check if user has permission to view this payment
    if (user.role !== 'admin' && payment.purchase.buyerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
