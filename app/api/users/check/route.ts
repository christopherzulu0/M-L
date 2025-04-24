import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    // Get the current session
    const session = await auth();
    
    if (!session || session.userId === null) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    // Get clerkId from query params or use the current user's ID
    const url = new URL(request.url);
    const clerkId = url.searchParams.get('clerkId') || session.userId;

    // Check if user exists in the database
    const user = await prisma.user.findFirst({
      where: {
        clerkid: clerkId,
      },
    });

    // Return whether the user exists
    return NextResponse.json({ 
      exists: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      } : null
    });
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json({ error: 'Error checking user' }, { status: 500 });
  }
}