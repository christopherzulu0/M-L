import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail } from "lucide-react";

interface AgentCardProps {
  id: number | string;
  name: string;
  agency?: string;
  image: string;
  listings?: number;
  rating?: number;
  ratingLabel?: string;
  verified?: boolean;
  bio?: string;
  address?: string;
  location?: string;
  specialization?: string;
  serviceAreas?: string[];
  languages?: string[];
  socialMediaLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  featured?: boolean;
  isNew?: boolean;
  user?: {
    email?: string;
    phone?: string;
  };
}

export function AgentCard(props: AgentCardProps) {
  const {
    id,
    name,
    agency,
    image,
    listings,
    rating = 4,
    ratingLabel,
    verified,
    bio,
    address,
    location,
    specialization,
    featured = false,
    isNew = false,
    user,
  } = props;

  // Ensure displayRating is always a number
  const displayRating = typeof rating === 'number' ? rating : 4;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        {featured && (
          <div className="absolute top-2 left-2">
            <span className="bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded">Featured Agent</span>
          </div>
        )}
        {isNew && (
          <div className="absolute top-2 left-2">
            <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded">New Agent</span>
          </div>
        )}
        {verified && (
          <div className="absolute top-2 right-2">
            <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
              </svg>
              Verified
            </span>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="flex items-center text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground/70" />
          {address || location || "Location not specified"}
          {specialization && ` • ${specialization}`}
          {agency && !specialization && ` • ${agency}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center mb-2">
          {Array(5).fill(0).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < displayRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            ({displayRating.toFixed(1)}) {ratingLabel && `• ${ratingLabel}`}
          </span>
        </div>
        {listings !== undefined && (
          <div className="text-sm text-muted-foreground mb-2">
            <span className="font-medium">{listings}</span> listings
          </div>
        )}
        <div className="text-sm text-muted-foreground mb-4">
          <p>{bio || `Real estate professional specializing in providing exceptional service.`}</p>
        </div>
        {user && (
          <div className="flex flex-col space-y-2">
            {user.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.email && (
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/agent/${id}`}>View Profile</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/contact?agent=${id}`}>Contact</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function AgentCardDemo() {
  const [agents, setAgents] = useState<AgentCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/agents');
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        const data = await response.json();
        setAgents(data.agents || []);
      } catch (error) {
        console.error('Error fetching agents:', error);
        // Fallback to a sample agent if API fails
        setAgents([{
          id: 1,
          name: "Sarah Johnson",
          agency: "Premium Realty Group",
          image: "/placeholder.svg?height=200&width=200",
          listings: 24,
          rating: 4.8,
          ratingLabel: "127 reviews",
          verified: true,
          bio: "Experienced real estate professional with over 8 years in luxury residential sales. Specializing in waterfront properties and investment opportunities.",
          address: "Downtown Seattle, WA",
          serviceAreas: ["Seattle", "Bellevue", "Redmond", "Kirkland", "Mercer Island"],
          languages: ["English", "Spanish", "Mandarin"],
          socialMediaLinks: {
            facebook: "https://facebook.com",
            twitter: "https://twitter.com",
            instagram: "https://instagram.com",
          },
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Our Agents</h1>

        {isLoading ? (
          <div className="text-center py-12">Loading agents...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} {...agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
