import { NextResponse } from "next/server"
import prisma from '@/lib/prisma'
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns'

export async function GET() {
    try {
        const months = 8 // Last 8 months
        const salesData = []

        for (let i = months - 1; i >= 0; i--) {
            const startDate = startOfMonth(subMonths(new Date(), i))
            const endDate = endOfMonth(startDate)

            // Get current month sales
            const currentMonthSales = await prisma.property.findMany({
                where: {
                    status: 'SOLD',
                    createdAt: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                select: {
                    price: true
                }
            })

            // Get previous year's same month sales
            const previousYearStart = startOfMonth(subMonths(startDate, 12))
            const previousYearEnd = endOfMonth(previousYearStart)

            const previousYearSales = await prisma.property.findMany({
                where: {
                    status: 'SOLD',
                    createdAt: {
                        gte: previousYearStart,
                        lte: previousYearEnd
                    }
                },
                select: {
                    price: true
                }
            })

            const totalCurrent = currentMonthSales.reduce((sum, property) => sum + Number(property.price), 0)
            const totalPrevious = previousYearSales.reduce((sum, property) => sum + Number(property.price), 0)

            salesData.push({
                name: format(startDate, 'MMM'),
                total: totalCurrent,
                previous: totalPrevious
            })
        }

        return NextResponse.json(salesData)
    } catch (error) {
        console.error("Error fetching sales data:", error)
        return NextResponse.json(
            { error: "Failed to fetch sales data" },
            { status: 500 }
        )
    }
} 