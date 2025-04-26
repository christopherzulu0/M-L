import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import "@/app/globals.css"
import type React from "react"
import { ClerkProvider } from "@clerk/nextjs";
import { UserProfileCheck } from "@/components/user-profile-check";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <Providers>
            <UserProfileCheck>
              {children}
            </UserProfileCheck>
            <SiteFooter />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
