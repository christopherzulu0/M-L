import { notFound } from "next/navigation"
import { promises as fs } from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"

// Function to get all possible slugs for static generation
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "app/content")
  const files = await fs.readdir(contentDir)

  return files
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => ({
      slug: file.replace(/\.(md|mdx)$/, ""),
    }))
}

// Function to get article content
async function getArticleBySlug(slug: string) {
  const contentDir = path.join(process.cwd(), "app/content")

  const possiblePaths = [path.join(contentDir, `${slug}.md`), path.join(contentDir, `${slug}.mdx`)]

  for (const filePath of possiblePaths) {
    try {
      const content = await fs.readFile(filePath, "utf8")
      return content
    } catch (error) {
      continue
    }
  }

  notFound()
}

type Params = { slug: string }

// Metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Params | Promise<Params>
}) {
  const resolvedParams = await Promise.resolve(params)
  if (!resolvedParams.slug) {
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist.",
    }
  }

  try {
    await getArticleBySlug(resolvedParams.slug)
    const slug = resolvedParams.slug
    return {
      title: `${slug.split("-").join(" ")} - Buyer's Guide`,
      description: `Learn about ${slug.split("-").join(" ")} in our comprehensive buyer's guide.`,
    }
  } catch {
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist.",
    }
  }
}

interface PageProps {
  params: Params | Promise<Params>
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params)
  if (!resolvedParams.slug) notFound()

  const content = await getArticleBySlug(resolvedParams.slug)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/buyers-guide" className="inline-flex items-center text-blue-500 mb-8 text-lg hover:underline">
        <FaArrowLeft className="mr-2" />
        Back to Buyer's Guide
      </Link>
      <article className="bg-white shadow-2xl rounded-lg p-8">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mb-6 text-gray-800" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-700" {...props} />,
            p: ({ node, ...props }) => <p className="mb-4 text-lg text-gray-600 leading-relaxed" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 text-gray-600" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 text-gray-600" {...props} />,
            li: ({ node, ...props }) => <li className="mb-2 text-lg" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-semibold text-gray-800" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  )
}
