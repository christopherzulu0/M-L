import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return default mortgage rates
    // In a real application, these could be fetched from a database
    const mortgageRates = {
      defaultHomeValue: 300000,
      defaultDownPayment: 60000,
      defaultLoanTerm: 30,
      defaultInterestRate: 3.5,
      availableTerms: [15, 20, 25, 30],
      currentRates: [
        { term: 15, rate: 3.0 },
        { term: 20, rate: 3.25 },
        { term: 25, rate: 3.4 },
        { term: 30, rate: 3.5 }
      ]
    }

    return NextResponse.json(mortgageRates)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching mortgage rates' }, { status: 500 })
  }
}
