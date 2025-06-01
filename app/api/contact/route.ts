import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/resend';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, agentId } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Prepare the contact form data
    const contactData = {
      name,
      email,
      subject,
      message,
      agentId,
    };

    // If an agent ID is provided, fetch the agent's details
    if (agentId) {
      const agent = await prisma.agent.findUnique({
        where: { id: parseInt(agentId) },
        include: {
          user: true,
        },
      });

      if (agent) {
        contactData.agentName = `${agent.user.firstName} ${agent.user.lastName}`;
        contactData.agentEmail = agent.user.email;
      }
    }

    // Send the email
    const result = await sendContactFormEmail(contactData);

    // Log the activity (optional)
    console.log('Contact form submitted:', {
      action: 'CONTACT_FORM_SUBMITTED',
      details: {
        name,
        email,
        subject: subject || 'No subject',
        agentId: agentId || 'No agent specified',
      },
    });

    return NextResponse.json(
      { message: 'Message sent successfully', data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending contact form:', error);
    return NextResponse.json(
      { message: 'Failed to send message', error: (error as Error).message },
      { status: 500 }
    );
  }
}
