import { MDXProvider } from "@mdx-js/react"
import { components } from "./mdx-components"
import React, { ReactNode } from "react"

interface MDXLayoutProps {
  children: ReactNode;
}

export function MDXLayout({ children }: MDXLayoutProps) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
