import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CheckCircle, Home, DollarSign, Users, Calendar, Lightbulb, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SellersGuidePage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-10">
        {/* Header */}
        <div className="flex flex-col space-y-4 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Seller's Guide</h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about selling your property for maximum value
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="aspect-[21/9] relative">
            <Image
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80"
              alt="Selling Your Home"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Your Complete Guide to Selling</h2>
              <p className="text-sm sm:text-base opacity-90 mb-4 max-w-3xl">
                From preparing your home for sale to closing the deal, we'll walk you through every step of the selling process.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="mr-2 h-5 w-5 text-primary" />
                Preparing Your Home
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Learn how to prepare your property for sale to attract more buyers and maximize your selling price.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="p-0 h-auto text-primary" onClick={() => document.getElementById('preparing')?.scrollIntoView({ behavior: 'smooth' })}>
                Read More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                Pricing Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover effective pricing strategies to sell your home quickly while getting the best possible price.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="p-0 h-auto text-primary" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                Read More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Working with Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Learn how to select the right real estate agent and what to expect during the selling process.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="p-0 h-auto text-primary" onClick={() => document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' })}>
                Read More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Selling Process Tabs */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center">The Selling Process</h2>
          <Tabs defaultValue="prepare" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto mb-8">
              <TabsTrigger value="prepare">Prepare</TabsTrigger>
              <TabsTrigger value="price">Price</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="negotiate">Negotiate</TabsTrigger>
              <TabsTrigger value="close">Close</TabsTrigger>
            </TabsList>

            <TabsContent value="prepare" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Preparing Your Home for Sale</CardTitle>
                  <CardDescription>
                    First impressions matter. Here's how to make your property shine.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Essential Preparation Steps</h3>
                      <ul className="space-y-3">
                        {[
                          "Declutter and depersonalize your space",
                          "Make necessary repairs and touch-ups",
                          "Deep clean every room, including carpets and windows",
                          "Enhance curb appeal with landscaping and exterior maintenance",
                          "Consider professional staging to showcase your home's potential",
                          "Ensure good lighting throughout the property",
                          "Address any odors from pets, cooking, or moisture"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative rounded-lg overflow-hidden aspect-video">
                      <Image
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
                        alt="Home Preparation"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start mt-6">
                    <Lightbulb className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Pro Tip</p>
                      <p className="text-amber-700 text-sm">
                        Consider getting a pre-listing home inspection to identify and address potential issues before buyers discover them. This can help prevent surprises during the buyer's inspection and give you more control over repairs.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/blog/home-preparation-checklist">
                    <Button variant="outline">
                      Download Home Preparation Checklist
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="price" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Pricing Your Property Right</CardTitle>
                  <CardDescription>
                    Setting the right price is crucial for a successful sale.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Pricing Strategies</h3>
                      <p className="text-muted-foreground mb-4">
                        Pricing your home correctly from the start is one of the most important decisions you'll make. Consider these factors when determining your asking price:
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Comparable sales in your neighborhood (comps)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Current market conditions (buyer's vs. seller's market)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Your home's unique features and improvements</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Seasonal timing of your sale</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Your timeline and motivation to sell</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4">Common Pricing Mistakes</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Overpricing based on emotional attachment</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Pricing based on what you need rather than market value</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Ignoring recent market changes</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Failing to adjust price when necessary</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Underpricing in a strong seller's market</span>
                        </li>
                      </ul>

                      <div className="bg-slate-50 p-4 rounded-lg mt-6">
                        <p className="font-medium">The Cost of Overpricing</p>
                        <p className="text-sm text-muted-foreground">
                          Homes that are priced too high initially often end up selling for less than they would have if priced correctly from the start. This happens because overpriced listings sit on the market longer, becoming "stale" and eventually requiring price reductions that can signal desperation to buyers.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    Get a Free Home Valuation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="market" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Marketing Your Property</CardTitle>
                  <CardDescription>
                    Effective marketing strategies to attract qualified buyers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Professional Photography</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          High-quality photos are essential in today's digital marketplace. Professional photography can make your property stand out online and attract more potential buyers.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Virtual Tours</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          3D virtual tours and video walkthroughs allow buyers to experience your home remotely, helping to attract serious buyers and filter out those who aren't genuinely interested.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Online Listings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Your property will be featured on major real estate platforms, social media, and our website to maximize exposure to potential buyers.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Open Houses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Strategic open houses can create buzz and allow multiple buyers to view your property in a competitive environment, potentially driving up offers.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Property Brochures</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Professional marketing materials highlight your home's best features and provide important details for potential buyers to take with them.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Targeted Advertising</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          We use demographic data and buyer profiles to target marketing efforts toward the most likely buyers for your specific property.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button>
                    Learn About Our Marketing Package
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="negotiate" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Negotiating Offers</CardTitle>
                  <CardDescription>
                    Strategies for evaluating and negotiating offers to maximize your outcome.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Evaluating Offers</h3>
                        <p className="text-muted-foreground mb-4">
                          When evaluating offers, consider these important factors beyond just the price:
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium">Financing:</span>
                              <span className="text-muted-foreground"> Cash offers vs. mortgage pre-approval status</span>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium">Contingencies:</span>
                              <span className="text-muted-foreground"> Inspection, appraisal, and financing contingencies</span>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium">Timeline:</span>
                              <span className="text-muted-foreground"> Closing date and possession terms</span>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium">Earnest Money:</span>
                              <span className="text-muted-foreground"> Amount of deposit showing buyer commitment</span>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium">Included Items:</span>
                              <span className="text-muted-foreground"> Furniture, appliances, or fixtures requested</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-4">Negotiation Strategies</h3>
                        <div className="space-y-4">
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="font-medium">Multiple Offer Situations</p>
                            <p className="text-sm text-muted-foreground">
                              When you receive multiple offers, you can leverage competition to improve terms. Options include accepting the best offer, countering one or more offers, or requesting "best and final" offers from all interested buyers.
                            </p>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="font-medium">Counter Offers</p>
                            <p className="text-sm text-muted-foreground">
                              You can counter on price, contingencies, closing date, or other terms. Focus on your priorities and be willing to compromise on less important aspects.
                            </p>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="font-medium">Concessions</p>
                            <p className="text-sm text-muted-foreground">
                              Sometimes offering concessions (like covering closing costs or including furniture) can help secure a higher sale price or better terms in other areas.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start">
                      <Lightbulb className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Pro Tip</p>
                        <p className="text-amber-700 text-sm">
                          Don't get emotionally involved in negotiations. Focus on your goals and the bottom line. Sometimes rejecting an offer that feels insulting can be counterproductive if it's actually close to your minimum acceptable price.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="close" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Closing the Deal</CardTitle>
                  <CardDescription>
                    Understanding the closing process and final steps to complete your sale.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative overflow-hidden rounded-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10" />
                      <div className="relative p-6">
                        <h3 className="text-lg font-medium mb-4">The Closing Timeline</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-2">1</div>
                              <h4 className="font-medium">Under Contract</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Offer accepted, contract signed, and earnest money deposited
                            </p>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-2">2</div>
                              <h4 className="font-medium">Due Diligence</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Buyer conducts inspections and reviews property documents
                            </p>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-2">3</div>
                              <h4 className="font-medium">Appraisal</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Lender orders appraisal to verify property value
                            </p>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-2">4</div>
                              <h4 className="font-medium">Closing Day</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Final documents signed, funds transferred, and keys handed over
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Seller's Closing Costs</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Real Estate Commission</span>
                            <span className="font-medium">5-6% of sale price</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Title Insurance</span>
                            <span className="font-medium">$500-$2,000</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Escrow Fees</span>
                            <span className="font-medium">$500-$2,000</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Transfer Taxes</span>
                            <span className="font-medium">Varies by location</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Attorney Fees (if applicable)</span>
                            <span className="font-medium">$500-$1,500</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Outstanding Mortgage Payoff</span>
                            <span className="font-medium">Remaining balance</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Prorated Property Taxes</span>
                            <span className="font-medium">Varies</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Closing Day Checklist</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Bring photo identification</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Bring all keys, garage door openers, and access codes</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Provide forwarding address for mail and final bills</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Review and sign closing documents</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Bring wiring instructions for proceeds (if applicable)</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Cancel home insurance (effective after closing)</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Cancel utilities or transfer to new owner</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/blog/closing-process-explained">
                    <Button variant="outline">
                      Learn More About the Closing Process
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Detailed Sections */}
        <div id="preparing" className="scroll-mt-24 mt-16">
          <h2 className="text-2xl font-bold mb-6">Preparing Your Home for Sale</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-muted-foreground mb-4">
                The way you present your home can significantly impact its perceived value and how quickly it sells. Here are some key areas to focus on:
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">Curb Appeal</h3>
              <p className="text-muted-foreground mb-4">
                First impressions matter. Enhance your home's exterior with these improvements:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
                <li>Fresh paint or power washing for the exterior</li>
                <li>Well-maintained landscaping with trimmed bushes and fresh mulch</li>
                <li>Clean walkways and driveway</li>
                <li>Functional and attractive outdoor lighting</li>
                <li>New or freshly painted front door</li>
              </ul>

              <h3 className="text-lg font-medium mt-6 mb-3">Interior Preparation</h3>
              <p className="text-muted-foreground mb-4">
                Create a clean, spacious, and neutral environment that allows buyers to envision themselves living in the space:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Declutter all spaces, including closets and storage areas</li>
                <li>Remove personal items and family photos</li>
                <li>Apply fresh, neutral paint colors</li>
                <li>Clean or replace carpets and flooring</li>
                <li>Ensure all light fixtures work and have appropriate bulbs</li>
                <li>Make minor repairs (leaky faucets, loose handles, etc.)</li>
                <li>Deep clean bathrooms and kitchen</li>
              </ul>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Return on Investment</CardTitle>
                  <CardDescription>
                    Not all improvements offer equal returns. Focus on these high-ROI projects:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center pb-2 border-b">
                      <span>Minor Kitchen Updates</span>
                      <span className="font-medium text-green-600">80-100% ROI</span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b">
                      <span>Fresh Interior Paint</span>
                      <span className="font-medium text-green-600">60-100% ROI</span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b">
                      <span>Landscaping Improvements</span>
                      <span className="font-medium text-green-600">100%+ ROI</span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b">
                      <span>Bathroom Updates</span>
                      <span className="font-medium text-green-600">70-80% ROI</span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b">
                      <span>New Front Door</span>
                      <span className="font-medium text-green-600">75-100% ROI</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Professional Staging</span>
                      <span className="font-medium text-green-600">200%+ ROI</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Get Personalized Recommendations
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        <div id="pricing" className="scroll-mt-24 mt-16">
          <h2 className="text-2xl font-bold mb-6">Pricing Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-muted-foreground mb-6">
                Pricing your home correctly is both an art and a science. It requires understanding the current market conditions, analyzing comparable properties, and considering your specific selling goals and timeline.
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">Comparative Market Analysis (CMA)</h3>
              <p className="text-muted-foreground mb-4">
                A CMA is a detailed evaluation of recently sold properties in your area that are similar to yours. This analysis helps determine a competitive listing price based on:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
                <li>Recent sales of similar homes in your neighborhood</li>
                <li>Current listings that will be your competition</li>
                <li>Expired listings that didn't sell</li>
                <li>Adjustments for differences in features, condition, and location</li>
              </ul>

              <h3 className="text-lg font-medium mt-6 mb-3">Market Conditions</h3>
              <p className="text-muted-foreground mb-4">
                Your pricing strategy should reflect current market conditions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Seller's Market</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      When inventory is low and demand is high, you may be able to price at or slightly above market value, especially if your home is in a desirable location or has unique features.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Buyer's Market</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      When inventory is high and demand is low, you may need to price more competitively to attract buyers and generate interest in your property.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Strategies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium">Value Range Pricing</p>
                    <p className="text-sm text-muted-foreground">
                      Listing your home within a price range rather than at a specific price point to attract buyers from multiple price brackets.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium">Competitive Pricing</p>
                    <p className="text-sm text-muted-foreground">
                      Setting your price slightly below similar properties to generate more interest and potentially create a bidding war.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium">Psychological Pricing</p>
                    <p className="text-sm text-muted-foreground">
                      Using price points just below round numbers (e.g., $499,900 instead of $500,000) to make the price appear lower.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium">Prestige Pricing</p>
                    <p className="text-sm text-muted-foreground">
                      For luxury properties, setting a higher price can sometimes signal quality and exclusivity to the right buyers.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Request a Free Market Analysis
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        <div id="agents" className="scroll-mt-24 mt-16">
          <h2 className="text-2xl font-bold mb-6">Working with Real Estate Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-muted-foreground mb-6">
                A skilled real estate agent can make a significant difference in your selling experience and outcome. They bring market knowledge, negotiation expertise, and marketing resources that can help you sell faster and for a better price.
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">What a Good Agent Provides</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Pricing Expertise</p>
                    <p className="text-sm text-muted-foreground">
                      Accurate pricing based on market data and property condition
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Marketing Plan</p>
                    <p className="text-sm text-muted-foreground">
                      Professional photography, listing strategy, and targeted advertising
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Negotiation Skills</p>
                    <p className="text-sm text-muted-foreground">
                      Experience in handling offers and counteroffers to maximize your return
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Network Access</p>
                    <p className="text-sm text-muted-foreground">
                      Connections to potential buyers, other agents, and service providers
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Transaction Management</p>
                    <p className="text-sm text-muted-foreground">
                      Guidance through inspections, appraisals, and closing processes
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Market Knowledge</p>
                    <p className="text-sm text-muted-foreground">
                      Understanding of local trends, buyer preferences, and neighborhood values
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-6 mb-3">Choosing the Right Agent</h3>
              <p className="text-muted-foreground mb-4">
                When interviewing potential agents, consider these factors:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Local experience and knowledge of your specific neighborhood</li>
                <li>Track record of sales similar to your property</li>
                <li>Marketing strategy and online presence</li>
                <li>Communication style and responsiveness</li>
                <li>References from past clients</li>
                <li>Personality fit and comfort level</li>
              </ul>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Agent vs. FSBO</CardTitle>
                  <CardDescription>
                    Comparing agent-assisted sales to For Sale By Owner
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Average Sale Price</p>
                      <div className="flex items-center mt-2">
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">+10-15%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Agent-assisted sales typically achieve 10-15% higher prices
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">Time on Market</p>
                      <div className="flex items-center mt-2">
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">-30%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Agent-listed homes typically sell 30% faster
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">Legal Protection</p>
                      <div className="flex items-center mt-2">
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">High</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Agents provide contract expertise and disclosure guidance
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">Exposure to Buyers</p>
                      <div className="flex items-center mt-2">
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">+500%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        MLS listings reach significantly more potential buyers
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Connect with Top Agents
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Sell Your Property?</h2>
            <p className="text-muted-foreground mb-6">
              Our experienced agents are ready to help you navigate the selling process and maximize your home's value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                Get a Free Home Valuation
              </Button>
              <Button size="lg" variant="outline">
                Speak with an Agent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
