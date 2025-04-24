import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-4xl font-bold mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-semibold mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold mb-2">{children}</h3>,
    p: ({ children }) => <p className="mb-4">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5 mb-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
    li: ({ children }) => <li className="mb-2">{children}</li>,
    a: ({ href, children }) => (
      <Link href={href} className="text-blue-600 hover:underline">
        {children}
      </Link>
    ),
    img: (props) => <Image sizes="100vw" style={{ width: "100%", height: "auto" }} {...props} alt={props.alt || ""} />,
    ...components,
  }
}
