import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Create property types
  const propertyTypes = [
    { name: 'Apartment', description: 'Residential unit in a multi-unit building' },
    { name: 'House', description: 'Single-family detached home' },
    { name: 'Villa', description: 'Luxury detached house with garden' },
    { name: 'Commercial', description: 'Property for business use' },
    { name: 'Land', description: 'Undeveloped property' }
  ]

  for (const type of propertyTypes) {
    await prisma.propertyType.upsert({
      where: { name: type.name },
      update: {},
      create: type
    })
  }

  // Create listing types
  const listingTypes = [
    { name: 'For Sale', description: 'Property available for purchase' },
    { name: 'For Rent', description: 'Property available for rent' },
    { name: 'Short Term', description: 'Property available for short-term rental' }
  ]

  for (const type of listingTypes) {
    await prisma.listingType.upsert({
      where: { name: type.name },
      update: {},
      create: type
    })
  }

  // Create locations
  const locations = [
    { name: 'Lusaka', city: 'Lusaka', stateProvince: 'Lusaka Province', country: 'Zambia' },
    { name: 'Kitwe', city: 'Kitwe', stateProvince: 'Copperbelt Province', country: 'Zambia' },
    { name: 'Ndola', city: 'Ndola', stateProvince: 'Copperbelt Province', country: 'Zambia' },
    { name: 'Livingstone', city: 'Livingstone', stateProvince: 'Southern Province', country: 'Zambia' }
  ]

  for (const location of locations) {
    // Try to find existing location
    const existingLocation = await prisma.location.findFirst({
      where: {
        city: location.city,
        stateProvince: location.stateProvince,
        country: location.country
      }
    })

    if (!existingLocation) {
      await prisma.location.create({
        data: location
      })
    }
  }

  // Create some features
  const features = [
    { name: 'Air Conditioning', category: 'comfort' },
    { name: 'Garden', category: 'outdoor' },
    { name: 'Fireplace', category: 'indoor' },
    { name: 'Swimming Pool', category: 'outdoor' },
    { name: 'Security System', category: 'security' },
    { name: 'High Speed Internet', category: 'utilities' }
  ]

  for (const feature of features) {
    await prisma.feature.upsert({
      where: { name: feature.name },
      update: {},
      create: feature
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
