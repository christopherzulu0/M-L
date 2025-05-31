import { Button } from "@/components/ui/button"
import { Building2, Heart, Share2, BedSingle, Bath, Ruler, Video } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useFavorites } from "@/hooks/useFavorites"
import { shareProperty as sharePropertyUtil } from "@/lib/share-utils"
import VirtualTourModal from "./VirtualTourModal"

interface PropertyCardProps {
  image: string
  title: string
  address: string
  price: string
  period?: string
  type: string
  badges: string[]
  features?: {
    beds?: number
    baths?: number
    sqft?: number
  }
  propertyId?: number | string
  disableLink?: boolean
  virtualTourUrl?: string
}

export function PropertyCard({ image, title, address, price, period, type, badges, features, propertyId, disableLink = false, virtualTourUrl }: PropertyCardProps) {
  // Use the favorites hook
  const { isFavorite, toggleFavorite: toggleFavoriteState } = useFavorites();

  // State for virtual tour modal
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);

  // Check if this property is in favorites
  const isPropertyFavorite = propertyId ? isFavorite(propertyId) : false;

  // Handle favorite toggle with event prevention
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();

    if (!propertyId) return;

    toggleFavoriteState(propertyId, title);
  };

  // Handle property sharing with event prevention
  const shareProperty = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();

    sharePropertyUtil(propertyId, title, address, price);
  };

  // Handle virtual tour button click
  const openVirtualTour = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();

    setIsVirtualTourOpen(true);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card hover-card hover-lift">
      {/* Virtual Tour Modal */}
      {virtualTourUrl && (
        <VirtualTourModal
          isOpen={isVirtualTourOpen}
          onClose={() => setIsVirtualTourOpen(false)}
          tourUrl={virtualTourUrl}
          propertyTitle={title}
        />
      )}

      <div className="relative aspect-[4/3]">
        <Image
          src={image || "https://digiestateorg.wordpress.com/wp-content/uploads/2023/11/ask-us-1024x583-1.jpg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1 text-sm font-medium text-white shadow-lg animate-pulse-slow"
            >
              {badge}
            </span>
          ))}
        </div>
        <div className="absolute right-4 top-4 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className={`h-9 w-9 rounded-full ${isPropertyFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 hover:bg-white'} shadow-lg backdrop-blur-sm transition-transform hover:scale-110`}
            onClick={toggleFavorite}
            title={isPropertyFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-4 w-4 ${isPropertyFavorite ? 'fill-white' : ''}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 hover:bg-white"
            onClick={shareProperty}
            title="Share property"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          {virtualTourUrl && (
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full bg-blue-500 text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-110 hover:bg-blue-600"
              onClick={openVirtualTour}
              title="View virtual tour"
            >
              <Video className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>{type}</span>
        </div>
        <h3 className="mb-2 block text-lg font-semibold tracking-tight transition-colors hover:text-blue-600">
          {title}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">{address}</p>

        {features && (
          <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
            {features.beds && (
              <div className="flex items-center gap-1">
                <BedSingle className="h-4 w-4" />
                <span>{features.beds} Beds</span>
              </div>
            )}
            {features.baths && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{features.baths} Baths</span>
              </div>
            )}
            {features.sqft && (
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                <span>{features.sqft} sqft</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-blue-600">{price}</span>
            {period && <span className="text-sm text-muted-foreground">/{period}</span>}
          </div>
          {propertyId ? (
            disableLink ? (
              <Button variant="outline" size="sm" className="shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600">
                View Details
              </Button>
            ) : (
              <Link href={`/listing-single/${propertyId}`}>
                <Button variant="outline" size="sm" className="shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600">
                  View Details
                </Button>
              </Link>
            )
          ) : (
            <Button variant="outline" size="sm" className="shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600">
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
