import { Button } from "./ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const blogPosts = [
  {
    id: 1,
    title: "First-Time Home Buyer's Complete Guide",
    description:
      "Everything you need to know about purchasing your first property, from financing to closing the deal...",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "Buying Guide",
  },
  {
    id: 2,
    title: "5 Home Renovation Projects That Add Value",
    description:
      "Discover the most impactful renovations that can significantly increase your property's market value...",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    date: "March 12, 2024",
    readTime: "6 min read",
    category: "Home Improvement",
  },
  {
    id: 3,
    title: "Real Estate Market Trends for 2024",
    description:
      "Analysis of current market conditions and predictions for the real estate market in the coming year...",
    image:
      "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
    date: "March 10, 2024",
    readTime: "5 min read",
    category: "Market Analysis",
  },
]

export default function Blog() {
  return (
    <>
      {/* Blog Posts Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Latest News & Tips</h2>
              <p className="mt-2 text-lg text-muted-foreground">Stay updated with real estate insights</p>
            </div>
            <Button variant="outline" className="hidden sm:inline-flex">
              View All Posts <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.id} className="group overflow-hidden rounded-2xl bg-white card-shadow subtle-border">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-3 flex gap-4">
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold group-hover:text-blue-600">{post.title}</h3>
                  <p className="mb-4 text-muted-foreground line-clamp-2">{post.description}</p>
                  <Link href={`/blog/${post.id}`} className="inline-flex items-center text-blue-600 hover:underline">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline">
              View All Posts <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
