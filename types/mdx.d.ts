declare module "*.mdx" {
  import type { ComponentProps, ComponentType } from "react"

  export const frontMatter: {
    title: string
    description: string
    date: string
    [key: string]: any
  }

  const MDXComponent: ComponentType<ComponentProps<"div">>
  export default MDXComponent
}
