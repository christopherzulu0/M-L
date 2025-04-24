import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fetching features from database...');
    const features = await prisma.feature.findMany({
      include: {
        properties: {
          include: {
            property: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });
    console.log('Features found:', features);
    return NextResponse.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json({ error: 'Error fetching features' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating feature with data:', body);
    const { name, description, category } = body;

    const feature = await prisma.feature.create({
      data: {
        name,
        description,
        category
      }
    });
    console.log('Created feature:', feature);

    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json(
      { error: 'Error creating feature' }, 
      { status: 500 }
    );
  }
}