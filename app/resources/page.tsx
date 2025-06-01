import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calculator, Globe, Save, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ResourcesPage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-10">
        {/* Header */}
        <div className="flex flex-col space-y-2 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Resources</h1>
          <p className="text-muted-foreground text-lg">
            Helpful tools and guides to assist you in your real estate journey
          </p>
        </div>

        {/* Featured Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Buyers Guide */}
          <ResourceCard
            title="Buyers Guide"
            description="Everything you need to know about purchasing your dream property"
            icon={<BookOpen className="h-6 w-6" />}
            href="/buyers-guide"
            color="blue"
          />

          {/* Sellers Guide */}
          <ResourceCard
            title="Sellers Guide"
            description="Tips and strategies to maximize your property's value"
            icon={<BookOpen className="h-6 w-6" />}
            href="/sellers-guide"
            color="purple"
          />

          {/* Mortgage Calculator */}
          <ResourceCard
            title="Calculator"
            description="Estimate your monthly payments and affordability"
            icon={<Calculator className="h-6 w-6" />}
            href="/calculator"
            color="green"
          />

          {/* Saved Searches */}
          <ResourceCard
            title="Saved Searches"
            description="Access your saved property searches and alerts"
            icon={<Save className="h-6 w-6" />}
            href="/saved-searches"
            color="amber"
          />
        </div>

        {/* Blog Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <Link href="/blog">
              <Button variant="ghost" className="text-primary">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Blog Posts - In a real app, these would be dynamically generated */}
            {[
              {
                title: "10 Tips for First-Time Home Buyers",
                excerpt: "Navigating the real estate market can be challenging for first-time buyers. Here are our top tips to help you make the right decision.",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=773&q=80",
                date: "June 1, 2025"
              },
              {
                title: "Understanding Property Taxes",
                excerpt: "Property taxes can significantly impact your homeownership costs. Learn how they're calculated and what you can do to manage them.",
                image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=811&q=80",
                date: "May 25, 2025"
              },
              {
                title: "The Future of Real Estate Technology",
                excerpt: "From virtual tours to blockchain transactions, technology is transforming the real estate industry. Here's what to expect in the coming years.",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=872&q=80",
                date: "May 18, 2025"
              }
            ].map((post, index) => (
              <BlogPostCard key={index} {...post} />
            ))}
          </div>
        </div>

        {/* Market Reports Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Market Reports</h2>
            <Link href="/market-trends/reports">
              <Button variant="ghost" className="text-primary">
                View All Reports
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MarketReportCard
              title="Q2 2025 Residential Market Analysis"
              description="Comprehensive analysis of residential property trends, pricing, and forecasts for the second quarter of 2025."
              image="https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
            />
            <MarketReportCard
              title="Commercial Real Estate Outlook 2025"
              description="Insights into commercial property market trends, investment opportunities, and sector-specific analysis."
              image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-slate-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-2">
              Find answers to common questions about real estate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How do I get pre-approved for a mortgage?",
                answer: "To get pre-approved, you'll need to apply with a lender who will review your financial information including credit score, income, assets, and debts. This process helps determine how much you can borrow."
              },
              {
                question: "What's the difference between a buyer's and seller's market?",
                answer: "A buyer's market occurs when supply exceeds demand, giving buyers an advantage in negotiations. A seller's market happens when demand exceeds supply, giving sellers the upper hand."
              },
              {
                question: "How long does the closing process take?",
                answer: "Typically, the closing process takes 30-45 days from contract to closing, but this can vary based on financing, inspection issues, and other factors."
              },
              {
                question: "What are closing costs and who pays them?",
                answer: "Closing costs are fees associated with finalizing a real estate transaction, typically 2-5% of the purchase price. They can be paid by either the buyer or seller, depending on the negotiated terms."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/faq">
              <Button variant="outline">
                View All FAQs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Resource Card Component
function ResourceCard({ title, description, icon, href, color }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: 'blue' | 'purple' | 'green' | 'amber';
}) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300 group-hover:text-blue-600",
    purple: "from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300 group-hover:text-purple-600",
    green: "from-green-50 to-green-100 border-green-200 hover:border-green-300 group-hover:text-green-600",
    amber: "from-amber-50 to-amber-100 border-amber-200 hover:border-amber-300 group-hover:text-amber-600",
  };

  const iconColorClasses = {
    blue: "text-blue-500 group-hover:text-blue-600",
    purple: "text-purple-500 group-hover:text-purple-600",
    green: "text-green-500 group-hover:text-green-600",
    amber: "text-amber-500 group-hover:text-amber-600",
  };

  return (
    <Link href={href}>
      <Card className={`h-full border transition-all hover:shadow-md group`}>
        <CardContent className="pt-6">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4`}>
            <div className={iconColorClasses[color]}>
              {icon}
            </div>
          </div>
          <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="p-0 h-auto text-primary">
            Learn more
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

// Blog Post Card Component
function BlogPostCard({ title, excerpt, image, date }: {
  title: string;
  excerpt: string;
  image: string;
  date: string;
}) {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
      <div className="aspect-video relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="text-sm text-muted-foreground mb-2">{date}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="p-0 h-auto text-primary">
          Read more
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

// Market Report Card Component
function MarketReportCard({ title, description, image }: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <div className="aspect-square md:h-full relative">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="md:w-2/3 p-6">
          <CardTitle className="text-xl mb-2">{title}</CardTitle>
          <CardDescription className="mb-4">{description}</CardDescription>
          <Button variant="outline" size="sm">
            Download Report
          </Button>
        </div>
      </div>
    </Card>
  )
}
