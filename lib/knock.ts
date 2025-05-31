import { Knock } from '@knocklabs/node';

// Initialize the Knock client with your API key
// In a real application, this would be stored in an environment variable
const knockClient = new Knock(process.env.KNOCK_API_KEY || 'your-api-key');

export interface InvoiceNotificationData {
  purchaseId: number;
  buyerId: number;
  buyerEmail: string;
  buyerName: string;
  propertyTitle: string;
  totalAmount: number;
  remainingAmount: number;
  notes?: string;
}

/**
 * Send an invoice notification using Knock
 * @param data The invoice data
 */
export async function sendInvoiceNotification(data: InvoiceNotificationData) {
  try {
    // The workflow slug should match what you've set up in Knock
    const workflowSlug = 'invoice-notification';

    // Send the notification
    await knockClient.workflows.trigger(workflowSlug, {
      // The recipient is identified by their user ID
      recipients: [data.buyerId.toString()],

      // Data to be used in the notification templates
      data: {
        purchaseId: data.purchaseId,
        buyerName: data.buyerName,
        propertyTitle: data.propertyTitle,
        totalAmount: data.totalAmount,
        remainingAmount: data.remainingAmount,
        notes: data.notes || 'Please complete your payment at your earliest convenience.',
        invoiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/client/invoices/${data.purchaseId}`,
      },

      // Removed actor parameter as it requires the actor to be identified first
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending notification via Knock:', error);
    throw error;
  }
}

// Function to identify a user in Knock's system
export async function identifyUser(userId: string, userData: { email: string; name: string }) {
  try {
    await knockClient.users.identify(userId, {
      email: userData.email,
      name: userData.name,
    });
    return { success: true };
  } catch (error) {
    console.error('Error identifying user in Knock:', error);
    throw error;
  }
}
