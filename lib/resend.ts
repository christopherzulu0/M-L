import { Resend } from 'resend';

// Initialize the Resend client with your API key
// In a real application, this would be stored in an environment variable
const apiKey = process.env.RESEND_API_KEY;
const resendClient = apiKey ? new Resend(apiKey) : null;

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  agentId?: string;
  agentName?: string;
  agentEmail?: string;
}

/**
 * Send a contact form email using Resend
 * @param data The contact form data
 */
export async function sendContactFormEmail(data: ContactFormData) {
  try {
    // Determine the recipient based on whether an agent is specified
    const to = data.agentEmail || process.env.DEFAULT_CONTACT_EMAIL || 'contact@realestate.com';

    // Create the email subject
    const subject = data.subject
      ? `Contact Form: ${data.subject}`
      : 'New Contact Form Submission';

    // Check if Resend client is available
    if (!resendClient) {
      console.log('Resend client not initialized. API key may be missing or invalid.');
      console.log('Would have sent email to:', to);
      console.log('Subject:', subject);
      console.log('From:', data.name, '(', data.email, ')');

      // Return mock success response
      return {
        success: true,
        data: {
          id: 'mock-email-id',
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: [to],
          created_at: new Date().toISOString()
        }
      };
    }

    // Send the email
    const { data: emailData, error } = await resendClient.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to,
      subject,
      html: generateContactEmailHtml(data),
      // Optional CC to the sender for confirmation
      cc: data.email,
    });

    if (error) {
      console.error('Error sending email via Resend:', error);
      throw error;
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    throw error;
  }
}

/**
 * Generate HTML content for the contact form email
 * @param data The contact form data
 */
function generateContactEmailHtml(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${data.subject || 'Contact Form Submission'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${data.subject || 'New Contact Form Submission'}</h1>
        </div>
        <div class="content">
          <p><strong>From:</strong> ${data.name} (${data.email})</p>
          ${data.agentName ? `<p><strong>To Agent:</strong> ${data.agentName}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="footer">
          <p>This email was sent from the contact form on your real estate website.</p>
        </div>
      </body>
    </html>
  `;
}
