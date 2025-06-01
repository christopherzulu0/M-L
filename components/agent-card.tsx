import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { Facebook, Twitter, Instagram, Mail, Phone, CheckCircle2, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface AgentCardProps {
  id: number
  name: string
  agency: string
  image: string
  listings: number
  rating: number
  ratingLabel: string
  verified: boolean
  bio: string
  address?: string
  serviceAreas?: string[]
  languages?: string[]
  socialMediaLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
}

export function AgentCard({
  id,
  name,
  agency,
  image,
  listings,
  rating,
  ratingLabel,
  verified,
  bio,
  address,
  serviceAreas,
  languages,
  socialMediaLinks
}: AgentCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white card-shadow subtle-border">
      {/* Badges Container - Positioned absolutely relative to card */}
      <div className="absolute top-0 left-0 right-0 px-6 pt-6 flex justify-between">
        <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-600 shadow-md">
          {listings} listings
        </div>
        {verified ? (
          <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600 shadow-md">
            <CheckCircle2 className="h-4 w-4" />
            <span>Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-600 shadow-md">
            <XCircle className="h-4 w-4" />
            <span>Pending</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center pt-20 px-6">
        {/* Agent Image */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg mb-4">
          <Image src={image} alt={`${name} - Real Estate Agent`} fill className="object-cover" />
        </div>

        {/* Agent Info */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold tracking-tight mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground">{agency}</p>
        </div>

        <div className="w-full mb-4">
          <StarRating rating={rating} label={ratingLabel} />
        </div>

        <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-3">{bio}</p>

        {/* Agent Details */}
        {address && (
          <div className="w-full text-sm text-muted-foreground mb-2">
            <p className="text-center">{address}</p>
          </div>
        )}

        {/* Service Areas */}
        {serviceAreas && serviceAreas.length > 0 && (
          <div className="w-full text-sm mb-2">
            <p className="text-center text-xs font-medium text-gray-500 mb-1">Service Areas</p>
            <div className="flex flex-wrap justify-center gap-1">
              {serviceAreas.map((area, index) => (
                <span key={index} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="w-full text-sm mb-4">
            <p className="text-center text-xs font-medium text-gray-500 mb-1">Languages</p>
            <p className="text-center text-sm">{languages.join(", ")}</p>
          </div>
        )}

        {/* Social Links */}
        <div className="flex justify-center gap-2 mb-6">
          {socialMediaLinks ? (
            <>
              {socialMediaLinks.facebook && (
                <a href={socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-gray-50 shadow-sm transition-transform hover:scale-110 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                </a>
              )}
              {socialMediaLinks.twitter && (
                <a href={socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-gray-50 shadow-sm transition-transform hover:scale-110 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                </a>
              )}
              {socialMediaLinks.instagram && (
                <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-gray-50 shadow-sm transition-transform hover:scale-110 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Instagram className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </>
          ) : (
            // Fallback to default social icons if no links provided
            [Facebook, Twitter, Instagram].map((Icon, index) => (
              <Button
                key={index}
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-gray-50 shadow-sm transition-transform hover:scale-110 hover:bg-blue-50 hover:text-blue-600"
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center justify-between border-t pt-3 pb-3">
          <Link href={`/agent/${id}`}>
            <Button className="gradient-bg text-white transition-all hover:shadow-lg hover:brightness-110">
              View Profile
            </Button>
          </Link>
          <div className="flex gap-2">
            {[Phone, Mail].map((Icon, index) => (
              <Button
                key={index}
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-full shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
