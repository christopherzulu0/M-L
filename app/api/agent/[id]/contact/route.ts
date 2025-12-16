import { prisma } from "@/lib/prisma";
import { sendContactFormEmail } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";

// POST: Submit contact form for an agent
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: paramId } = await params;
        const agentId = parseInt(paramId);

        if (isNaN(agentId)) {
            return NextResponse.json(
                { error: "Invalid agent ID" },
                { status: 400 }
            );
        }

        // Fetch agent with user details
        const agent = await prisma.agent.findUnique({
            where: { id: agentId },
            include: {
                user: true,
            },
        });

        if (!agent) {
            return NextResponse.json(
                { error: "Agent not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields: name, email, and message are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Validate message length
        if (message.trim().length < 10) {
            return NextResponse.json(
                { error: "Message must be at least 10 characters long" },
                { status: 400 }
            );
        }

        // Save contact to database
        const contact = await prisma.agentContact.create({
            data: {
                agentId,
                name: name.trim(),
                email: email.trim().toLowerCase(),
                subject: subject?.trim() || null,
                message: message.trim(),
                status: "new",
            },
        });

        // Send email notification to agent via Resend
        try {
            await sendContactFormEmail({
                name: name.trim(),
                email: email.trim(),
                subject: subject?.trim() || `New inquiry from ${name}`,
                message: message.trim(),
                agentId: agentId.toString(),
                agentName: `${agent.user.firstName} ${agent.user.lastName}`,
                agentEmail: agent.user.email,
            });
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            // Don't fail the request if email fails, contact is already saved
        }

        return NextResponse.json(
            {
                success: true,
                message: "Your message has been sent successfully! The agent will contact you soon.",
                contact: {
                    id: contact.id,
                    createdAt: contact.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error submitting contact form:", error);
        return NextResponse.json(
            { error: "Failed to submit contact form" },
            { status: 500 }
        );
    }
}
