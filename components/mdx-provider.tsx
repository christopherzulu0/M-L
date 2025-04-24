import { MDXProvider } from "@mdx-js/react"
import { components } from "./mdx-components"

export function MDXLayout({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
