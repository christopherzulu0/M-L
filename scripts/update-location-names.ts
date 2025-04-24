import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Get all locations
  const locations = await prisma.location.findMany()
  
  console.log(`Found ${locations.length} locations to update`)
  
  // Update each location to set name = city if name is empty
  for (const location of locations) {
    if (!location.name) {
      console.log(`Updating location ${location.id} to set name to "${location.city}"`)
      await prisma.location.update({
        where: { id: location.id },
        data: { name: location.city }
      })
    }
  }
  
  console.log('Location names updated successfully')
}

main()
  .catch((e) => {
    console.error('Error updating location names:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })