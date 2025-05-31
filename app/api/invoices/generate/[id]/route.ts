import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// POST /api/invoices/generate/[id] - Generate an invoice for a payment
export async function POST(
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

    // Fetch the payment with related data
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        purchase: {
          include: {
            property: true,
            buyer: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Check if user has permission to generate invoice for this payment
    if (user.role !== 'admin' && payment.purchase.buyerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Generate HTML for the invoice
    const invoiceHtml = generateInvoiceHtml(payment)

    // In a real implementation, you would use a library like puppeteer or jspdf to convert HTML to PDF
    // For this example, we'll return the HTML directly with a PDF content type
    // This is a simplified approach - in production, you would use a proper PDF generation library

    // Create a temporary HTML file
    const tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const tempFilePath = path.join(tempDir, `invoice-${paymentId}.html`)
    fs.writeFileSync(tempFilePath, invoiceHtml)

    // Read the file and return it as a response
    const fileBuffer = fs.readFileSync(tempFilePath)

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath)

    // Return the HTML as a PDF (this is a simplified approach)
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${paymentId}.pdf"`
      }
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateInvoiceHtml(payment: any) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice #${payment.id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          color: #4f46e5;
        }
        .company-details {
          text-align: right;
        }
        .invoice-details {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f9fafb;
          border-radius: 5px;
        }
        .invoice-details-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .invoice-details-label {
          font-weight: bold;
          color: #6b7280;
        }
        .client-details {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #4f46e5;
        }
        .property-details {
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background-color: #f3f4f6;
          padding: 10px;
          text-align: left;
          font-weight: bold;
          color: #4b5563;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        .total-row {
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div>
            <div class="invoice-title">INVOICE</div>
            <div>Estate MLS</div>
          </div>
          <div class="company-details">
            <div>Estate MLS Inc.</div>
            <div>123 Real Estate Blvd</div>
            <div>Lusaka, Zambia</div>
            <div>info@estatemls.com</div>
          </div>
        </div>

        <div class="invoice-details">
          <div class="invoice-details-row">
            <div>
              <div class="invoice-details-label">Invoice Number</div>
              <div>INV-${payment.id}</div>
            </div>
            <div>
              <div class="invoice-details-label">Payment Date</div>
              <div>${formatDate(payment.paymentDate)}</div>
            </div>
          </div>
          <div class="invoice-details-row">
            <div>
              <div class="invoice-details-label">Payment Method</div>
              <div>${payment.paymentMethod.split('_').map((word: string) => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}</div>
            </div>
            <div>
              <div class="invoice-details-label">Payment Status</div>
              <div>${payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</div>
            </div>
          </div>
        </div>

        <div class="client-details">
          <div class="section-title">Client Information</div>
          <div>${payment.purchase.buyer.firstName} ${payment.purchase.buyer.lastName}</div>
          <div>${payment.purchase.buyer.email}</div>
          ${payment.purchase.buyer.phone ? `<div>${payment.purchase.buyer.phone}</div>` : ''}
        </div>

        <div class="property-details">
          <div class="section-title">Property Information</div>
          <div>${payment.purchase.property.title}</div>
          <div>${payment.purchase.property.address}</div>
        </div>

        <div class="section-title">Payment Details</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Payment for property purchase</td>
              <td>${formatCurrency(payment.amount)}</td>
            </tr>
            <tr class="total-row">
              <td>Total</td>
              <td>${formatCurrency(payment.amount)}</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title">Purchase Summary</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Purchase Amount</td>
              <td>${formatCurrency(payment.purchase.totalAmount)}</td>
            </tr>
            <tr>
              <td>Amount Paid (Including this payment)</td>
              <td>${formatCurrency(payment.purchase.totalAmount - payment.purchase.remainingAmount)}</td>
            </tr>
            <tr>
              <td>Remaining Balance</td>
              <td>${formatCurrency(payment.purchase.remainingAmount)}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>This is an automatically generated invoice.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
