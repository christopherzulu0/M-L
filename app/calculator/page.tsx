import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Home, DollarSign, Percent, Calendar, ArrowRight, Info } from "lucide-react"
import Link from "next/link"

export default function CalculatorPage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-2 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mortgage Calculator</h1>
          <p className="text-muted-foreground text-lg">
            Plan your finances with our easy-to-use real estate calculators
          </p>
        </div>

        {/* Calculator Tabs */}
        <Tabs defaultValue="mortgage" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 w-full mb-8">
            <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
            <TabsTrigger value="affordability">Affordability</TabsTrigger>
            <TabsTrigger value="refinance">Refinance</TabsTrigger>
          </TabsList>

          {/* Mortgage Calculator */}
          <TabsContent value="mortgage" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Mortgage Payment Calculator</CardTitle>
                <CardDescription>
                  Calculate your monthly mortgage payments based on property price, down payment, interest rate, and loan term.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Inputs */}
                  <div className="space-y-6">
                    {/* Home Price */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="homePrice">Home Price</Label>
                        <div className="text-sm text-muted-foreground">$500,000</div>
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="homePrice"
                          type="number"
                          placeholder="500000"
                          className="pl-10"
                          defaultValue="500000"
                        />
                      </div>
                      <Slider
                        defaultValue={[500000]}
                        max={2000000}
                        step={10000}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>$100,000</span>
                        <span>$2,000,000</span>
                      </div>
                    </div>

                    {/* Down Payment */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="downPayment">Down Payment</Label>
                        <div className="text-sm text-muted-foreground">$100,000 (20%)</div>
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="downPayment"
                          type="number"
                          placeholder="100000"
                          className="pl-10"
                          defaultValue="100000"
                        />
                      </div>
                      <Slider
                        defaultValue={[20]}
                        max={50}
                        step={1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>5%</span>
                        <span>50%</span>
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="interestRate">Interest Rate</Label>
                        <div className="text-sm text-muted-foreground">4.5%</div>
                      </div>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="interestRate"
                          type="number"
                          placeholder="4.5"
                          className="pl-10"
                          defaultValue="4.5"
                          step="0.1"
                        />
                      </div>
                      <Slider
                        defaultValue={[4.5]}
                        max={10}
                        step={0.1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>2%</span>
                        <span>10%</span>
                      </div>
                    </div>

                    {/* Loan Term */}
                    <div className="space-y-2">
                      <Label htmlFor="loanTerm">Loan Term</Label>
                      <Select defaultValue="30">
                        <SelectTrigger id="loanTerm">
                          <SelectValue placeholder="Select loan term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 Years</SelectItem>
                          <SelectItem value="20">20 Years</SelectItem>
                          <SelectItem value="15">15 Years</SelectItem>
                          <SelectItem value="10">10 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Right Column - Results */}
                  <div className="bg-slate-50 rounded-xl p-6 space-y-6">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</div>
                      <div className="text-4xl font-bold text-primary">$2,027</div>
                      <div className="text-sm text-muted-foreground mt-1">Principal & Interest</div>
                    </div>

                    <div className="space-y-4 mt-6">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <div className="text-sm">Principal & Interest</div>
                        <div className="font-medium">$2,027</div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <div className="text-sm">Property Taxes</div>
                        <div className="font-medium">$500</div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <div className="text-sm">Home Insurance</div>
                        <div className="font-medium">$100</div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <div className="text-sm">PMI</div>
                        <div className="font-medium">$0</div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="text-base font-medium">Total Monthly Payment</div>
                        <div className="text-lg font-bold">$2,627</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="text-sm text-muted-foreground mb-2">Loan Summary</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Loan Amount</div>
                          <div className="font-medium">$400,000</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Loan Term</div>
                          <div className="font-medium">30 Years</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Total Interest</div>
                          <div className="font-medium">$329,627</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Total Payments</div>
                          <div className="font-medium">$729,627</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    This calculator provides estimates only. Actual payments may vary based on additional factors.
                  </p>
                </div>
                <Button>
                  Get Pre-Approved
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Affordability Calculator */}
          <TabsContent value="affordability" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Home Affordability Calculator</CardTitle>
                <CardDescription>
                  Find out how much house you can afford based on your income, expenses, and financial situation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="annualIncome">Annual Household Income</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="annualIncome"
                            type="number"
                            placeholder="120000"
                            className="pl-10"
                            defaultValue="120000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="monthlyDebts">Monthly Debt Payments</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="monthlyDebts"
                            type="number"
                            placeholder="500"
                            className="pl-10"
                            defaultValue="500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="downPaymentAmount">Down Payment Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="downPaymentAmount"
                            type="number"
                            placeholder="60000"
                            className="pl-10"
                            defaultValue="60000"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="interestRateAfford">Interest Rate</Label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="interestRateAfford"
                            type="number"
                            placeholder="4.5"
                            className="pl-10"
                            defaultValue="4.5"
                            step="0.1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="loanTermAfford">Loan Term</Label>
                        <Select defaultValue="30">
                          <SelectTrigger id="loanTermAfford">
                            <SelectValue placeholder="Select loan term" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 Years</SelectItem>
                            <SelectItem value="20">20 Years</SelectItem>
                            <SelectItem value="15">15 Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="propertyTaxRate">Property Tax Rate</Label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="propertyTaxRate"
                            type="number"
                            placeholder="1.2"
                            className="pl-10"
                            defaultValue="1.2"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 text-center">
                    <div className="text-sm text-muted-foreground mb-1">You Can Afford a Home Up To</div>
                    <div className="text-4xl font-bold text-primary">$420,000</div>
                    <div className="text-sm text-muted-foreground mt-1">Based on your inputs</div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div>
                        <div className="text-sm text-muted-foreground">Monthly Payment</div>
                        <div className="font-medium">$2,210</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Loan Amount</div>
                        <div className="font-medium">$360,000</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Down Payment</div>
                        <div className="font-medium">$60,000</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  Find Homes in Your Budget
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Refinance Calculator */}
          <TabsContent value="refinance" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Refinance Calculator</CardTitle>
                <CardDescription>
                  Calculate potential savings by refinancing your current mortgage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentLoanBalance">Current Loan Balance</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="currentLoanBalance"
                          type="number"
                          placeholder="300000"
                          className="pl-10"
                          defaultValue="300000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentInterestRate">Current Interest Rate</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="currentInterestRate"
                          type="number"
                          placeholder="5.5"
                          className="pl-10"
                          defaultValue="5.5"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentLoanTerm">Current Loan Term</Label>
                      <Select defaultValue="30">
                        <SelectTrigger id="currentLoanTerm">
                          <SelectValue placeholder="Select loan term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 Years</SelectItem>
                          <SelectItem value="20">20 Years</SelectItem>
                          <SelectItem value="15">15 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsRemaining">Years Remaining</Label>
                      <Input
                        id="yearsRemaining"
                        type="number"
                        placeholder="25"
                        defaultValue="25"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newInterestRate">New Interest Rate</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newInterestRate"
                          type="number"
                          placeholder="4.0"
                          className="pl-10"
                          defaultValue="4.0"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newLoanTerm">New Loan Term</Label>
                      <Select defaultValue="30">
                        <SelectTrigger id="newLoanTerm">
                          <SelectValue placeholder="Select loan term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 Years</SelectItem>
                          <SelectItem value="20">20 Years</SelectItem>
                          <SelectItem value="15">15 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 space-y-6">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Monthly Savings</div>
                      <div className="text-4xl font-bold text-primary">$267</div>
                      <div className="text-sm text-muted-foreground mt-1">Per Month</div>
                    </div>

                    <div className="space-y-4 mt-6">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <div className="text-sm">Current Monthly Payment</div>
                        <div className="font-medium">$1,703</div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <div className="text-sm">New Monthly Payment</div>
                        <div className="font-medium">$1,436</div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <div className="text-sm">Total Savings</div>
                        <div className="font-medium">$16,020</div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <div className="text-sm">Break-Even Point</div>
                        <div className="font-medium">15 months</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button className="w-full">
                        Get Refinance Quotes
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Resources */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Understanding Mortgage Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn about common mortgage terminology and what different terms mean for your home loan.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/blog/understanding-mortgage-terms">
                  <Button variant="outline">
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>First-Time Homebuyer Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Essential advice for first-time homebuyers to navigate the mortgage and home buying process.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/blog/first-time-homebuyer-tips">
                  <Button variant="outline">
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mortgage Pre-Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Understand the pre-approval process and why it's an important step in your home buying journey.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/blog/mortgage-pre-approval-guide">
                  <Button variant="outline">
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
