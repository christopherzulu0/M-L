"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Fetch mortgage rates from API
const fetchMortgageRates = async () => {
  const response = await fetch('/api/mortgage/rates')
  if (!response.ok) {
    throw new Error('Failed to fetch mortgage rates')
  }
  return response.json()
}

export function MortgageCalculator() {
  // Fetch mortgage rates using React Query
  const { data: mortgageData, isLoading, error } = useQuery({
    queryKey: ['mortgageRates'],
    queryFn: fetchMortgageRates,
  })

  // Use default values until data is loaded
  const [homeValue, setHomeValue] = useState(300000)
  const [downPayment, setDownPayment] = useState(60000)
  const [loanTerm, setLoanTerm] = useState(30)
  const [interestRate, setInterestRate] = useState(3.5)

  // Update state values when data is loaded
  useEffect(() => {
    if (mortgageData) {
      setHomeValue(mortgageData.defaultHomeValue)
      setDownPayment(mortgageData.defaultDownPayment)
      setLoanTerm(mortgageData.defaultLoanTerm)
      setInterestRate(mortgageData.defaultInterestRate)
    }
  }, [mortgageData])

  // Update interest rate when loan term changes
  const handleLoanTermChange = (value: string) => {
    const term = parseInt(value)
    setLoanTerm(term)

    // Find the matching interest rate for this term
    if (mortgageData?.currentRates) {
      const rateInfo = mortgageData.currentRates.find(rate => rate.term === term)
      if (rateInfo) {
        setInterestRate(rateInfo.rate)
      }
    }
  }

  const calculateMortgage = () => {
    const principal = homeValue - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    // Handle edge cases
    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      return "0.00"
    }

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    return monthlyPayment.toFixed(2)
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mortgage Calculator</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-center h-40">
            <p>Loading mortgage rates...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mortgage Calculator</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-destructive">Error loading mortgage rates. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mortgage Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="homeValue">Home Value</Label>
            <Input
              id="homeValue"
              type="number"
              value={homeValue}
              onChange={(e) => setHomeValue(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="downPayment">Down Payment</Label>
            <Input
              id="downPayment"
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="loanTerm">Loan Term (years)</Label>
            <Select value={loanTerm.toString()} onValueChange={handleLoanTermChange}>
              <SelectTrigger id="loanTerm">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {mortgageData?.availableTerms.map((term) => (
                  <SelectItem key={term} value={term.toString()}>
                    {term} years
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              disabled
            />
            <p className="text-xs text-muted-foreground">Rate automatically set based on term</p>
          </div>
          <div className="mt-4 col-span-2">
            <p className="text-lg font-semibold">Estimated Monthly Payment: ZMW {calculateMortgage()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
