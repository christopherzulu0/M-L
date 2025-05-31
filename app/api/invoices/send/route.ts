import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import { sendInvoiceNotification, identifyUser } from '@/lib/knock';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { purchaseId, notes } = body;

    if (!purchaseId) {
      return NextResponse.json(
        { message: 'Purchase ID is required' },
        { status: 400 }
      );
    }

    // Fetch the purchase with related data
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        property: true,
        buyer: true,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { message: 'Purchase not found' },
        { status: 404 }
      );
    }

    // Make sure the buyer has an email
    if (!purchase.buyer.email) {
      return NextResponse.json(
        { message: 'Buyer email is required to send an invoice' },
        { status: 400 }
      );
    }

    // Identify the user in Knock's system
    await identifyUser(purchase.buyerId.toString(), {
      email: purchase.buyer.email,
      name: `${purchase.buyer.firstName} ${purchase.buyer.lastName}`,
    });

    // Send the invoice notification
    await sendInvoiceNotification({
      purchaseId: purchase.id,
      buyerId: purchase.buyerId,
      buyerEmail: purchase.buyer.email,
      buyerName: `${purchase.buyer.firstName} ${purchase.buyer.lastName}`,
      propertyTitle: purchase.property.title,
      totalAmount: purchase.totalAmount,
      remainingAmount: purchase.remainingAmount,
      notes: notes,
    });

    // Activity logging is disabled because the ActivityLog model doesn't exist in the schema
    // To enable activity logging, add the ActivityLog model to the schema and run migrations
    console.log('Invoice sent:', {
      action: 'INVOICE_SENT',
      entityType: 'PURCHASE',
      entityId: purchase.id,
      details: {
        purchaseId: purchase.id,
        propertyId: purchase.propertyId,
        buyerId: purchase.buyerId,
        remainingAmount: purchase.remainingAmount,
        notes: notes || 'No additional notes',
      },
    });

    return NextResponse.json(
      { message: 'Invoice sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending invoice:', error);
    return NextResponse.json(
      { message: 'Failed to send invoice', error: (error as Error).message },
      { status: 500 }
    );
  }
}
