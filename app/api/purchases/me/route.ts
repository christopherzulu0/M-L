import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/purchases/me - Get current user's purchases
export async function GET(request: NextRequest) {
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

    const purchases = await prisma.purchase.findMany({
      where: {
        buyerId: user.id
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            price: true,
            status: true,
            media: {
              where: {
                isPrimary: true
              },
              select: {
                filePath: true,
                isPrimary: true
              },
              take: 1
            }
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            paymentMethod: true,
            paymentDate: true,
            status: true
          },
          orderBy: {
            paymentDate: 'desc'
          }
        }
      },
      orderBy: {
        purchaseDate: 'desc'
      }
    })

    // Transform the result to ensure property.media is always an array
    const transformedPurchases = purchases.map(purchase => ({
      ...purchase,
      property: {
        ...purchase.property,
        media: purchase.property.media.length > 0 ? purchase.property.media : []
      }
    }))

    return NextResponse.json(transformedPurchases)
  } catch (error) {
    console.error('Error fetching user purchases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
