import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Create sample users first
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.smith@example.com',
        firstName: 'John',
        lastName: 'Smith',
        phone: '+260977123456',
        passwordHash: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNuWkW', // hashed password
        role: 'AGENT'
      }
    }),
    prisma.user.create({
      data: {
        email: 'sarah.johnson@example.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '+260977654321',
        passwordHash: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNuWkW',
        role: 'AGENT'
      }
    }),
    prisma.user.create({
      data: {
        email: 'michael.chen@example.com',
        firstName: 'Michael',
        lastName: 'Chen',
        phone: '+260977789012',
        passwordHash: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNuWkW',
        role: 'AGENT'
      }
    })
  ])

  // Create agents for each user
  await Promise.all([
    prisma.agent.create({
      data: {
        userId: users[0].id,
        licenseNumber: 'AG123456',
        specialization: 'Residential Properties',
        bio: 'Specialized in residential properties and luxury homes.',
        commissionRate: 2.5
      }
    }),
    prisma.agent.create({
      data: {
        userId: users[1].id,
        licenseNumber: 'AG789012',
        specialization: 'Commercial Properties',
        bio: 'Expert in commercial real estate and investment properties.',
        commissionRate: 3.0
      }
    }),
    prisma.agent.create({
      data: {
        userId: users[2].id,
        licenseNumber: 'AG345678',
        specialization: 'First-time Buyers',
        bio: 'Focus on first-time home buyers and rental properties.',
        commissionRate: 2.0
      }
    })
  ])

  console.log('Sample agents created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 