"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaSearch, FaHome, FaMoneyBillWave, FaCalculator, FaPiggyBank } from "react-icons/fa"

const articles = [
  { slug: "property-buying", title: "Guide to Property Buying", icon: FaHome, category: "Buying" },
  { slug: "mortgages", title: "Understanding Mortgages", icon: FaMoneyBillWave, category: "Financing" },
  { slug: "taxes", title: "Real Estate Taxes Explained", icon: FaCalculator, category: "Taxes" },
  { slug: "financing", title: "Financing Options for Home Buyers", icon: FaPiggyBank, category: "Financing" },
]

export default function BuyersGuidePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || article.category === selectedCategory),
  )

  const categories = ["All", ...new Set(articles.map((article) => article.category))]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold mb-12 text-center text-gray-800">Buyer's Guide</h1>
      <div className="mb-8">
        <div className="flex items-center bg-white shadow-md rounded-lg p-4">
          <FaSearch className="text-gray-400 mr-4 text-xl" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-12 flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-6 py-3 rounded-full text-lg font-semibold transition duration-300 ${
              selectedCategory === category ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {filteredArticles.map((article) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Link href={`/buyers-guide/${article.slug}`}>
                <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
                  <div>
                    <article.icon className="text-5xl mb-6 text-blue-500" />
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">{article.title}</h2>
                    <p className="text-gray-600 mb-4">{article.category}</p>
                  </div>
                  <div className="text-blue-500 font-semibold">Read More →</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
