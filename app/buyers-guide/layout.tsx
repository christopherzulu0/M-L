import Link from "next/link"
import type React from "react"

export default function BuyersGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Buyer's Guide</h1>
      <nav className="mb-8">
        <ul className="flex space-x-4">
          <li>
            <Link href="/buyers-guide" className="text-blue-600 hover:underline">
              All Articles
            </Link>
          </li>
          <li>
            <Link href="/buyers-guide/property-buying" className="text-blue-600 hover:underline">
              Property Buying
            </Link>
          </li>
          <li>
            <Link href="/buyers-guide/mortgages" className="text-blue-600 hover:underline">
              Mortgages
            </Link>
          </li>
          <li>
            <Link href="/buyers-guide/taxes" className="text-blue-600 hover:underline">
              Taxes
            </Link>
          </li>
          <li>
            <Link href="/buyers-guide/financing" className="text-blue-600 hover:underline">
              Financing
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  )
}
