import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    domains: [
      "sjc.microlink.io",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      "digiestateorg.wordpress.com",
      "encrypted-tbn0.gstatic.com",
      "portablepartitions.com.au",
      "www.conradvillas.com",
      "images.lifestyleasia.com",
      "images.unsplash.com",
    ],
  },
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
    // Experimental:{
    //   appDir: true,
    // },
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
