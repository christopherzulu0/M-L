import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultFeatures = [
  "Air Conditioning",
  "Garden",
  "Fireplace",
  "Garage",
  "Swimming Pool",
  "Security System",
  "Solar Panels",
  "High Speed Internet"
];

async function main() {
  console.log('Starting feature initialization...');
  
  // Get existing features
  const existingFeatures = await prisma.feature.findMany({
    select: { name: true }
  });
  const existingFeatureNames = new Set(existingFeatures.map(f => f.name));
  
  // Create features that don't exist
  const featuresToCreate = defaultFeatures.filter(
    name => !existingFeatureNames.has(name)
  );
  
  if (featuresToCreate.length > 0) {
    console.log('Creating new features:', featuresToCreate);
    await prisma.feature.createMany({
      data: featuresToCreate.map(name => ({
        name,
        category: "general"
      })),
      skipDuplicates: true
    });
  } else {
    console.log('All features already exist in the database');
  }
  
  // Verify the features
  const allFeatures = await prisma.feature.findMany();
  console.log('Current features in database:', allFeatures);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 