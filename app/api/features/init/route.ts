import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const defaultFeatures = [
  "Air Conditioning",
  "Garden",
  "Fireplace",
  "Garage",
  "Swimming Pool",
  "Security System",
  "Solar Panels",
  "High Speed Internet"
]

export async function POST() {
  try {
    console.log('Starting feature initialization...');
    
    // Get existing features
    const existingFeatures = await prisma.feature.findMany({
      select: { name: true, id: true }
    });
    console.log('Existing features:', existingFeatures);
    
    const existingFeatureNames = new Set(existingFeatures.map(f => f.name));
    
    // Create features that don't exist
    const featuresToCreate = defaultFeatures.filter(
      name => !existingFeatureNames.has(name)
    );
    
    console.log('Features to create:', featuresToCreate);
    
    if (featuresToCreate.length > 0) {
      const createdFeatures = await prisma.feature.createMany({
        data: featuresToCreate.map(name => ({
          name,
          category: "general"
        })),
        skipDuplicates: true
      });
      console.log('Created features:', createdFeatures);
    }
    
    // Get all features after creation
    const allFeatures = await prisma.feature.findMany();
    console.log('All features in database:', allFeatures);

    return NextResponse.json({ 
      message: 'Features initialized successfully',
      features: allFeatures
    });
  } catch (error) {
    console.error('Error initializing features:', error);
    return NextResponse.json(
      { error: 'Error initializing features' },
      { status: 500 }
    );
  }
} 