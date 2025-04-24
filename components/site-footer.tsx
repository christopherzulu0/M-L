import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">About Us</h3>
            <p className="mb-4 text-muted-foreground">
              We are a leading real estate platform helping people find their dream homes since 2010.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-blue-600">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-blue-600">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-blue-600">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-blue-600">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {["About Us", "Contact Us", "Terms & Conditions", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground hover:text-blue-600">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Property Types</h3>
            <ul className="space-y-2">
              {["Apartments", "Houses", "Offices", "Villas", "Land"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground hover:text-blue-600">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Info</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>123 Main Street, New York, NY 10001</li>
              <li>+1 234 567 890</li>
              <li>contact@realestate.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} M & L Real Estate Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
