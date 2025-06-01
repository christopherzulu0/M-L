"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Star, Phone, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"

// Function to fetch agents data
const fetchAgents = async () => {
  const response = await fetch('/api/agents');
  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }
  return response.json();
};

export default function AgentsPage() {
  // Use React Query to fetch agents data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const agentsPerPage = 6; // Number of agents to display per page

  // Search and filter state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [specializationFilter, setSpecializationFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('rating');

  // Reset to first page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, specializationFilter, sortBy]);

  // Filter and sort agents based on search query and filters
  const filteredAgents = React.useMemo(() => {
    if (!data?.agents) return [];

    return data.agents
      .filter(agent => {
        // Filter by search query (name or specialization)
        const matchesSearch = searchQuery === '' ||
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.specialization.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by specialization
        const matchesSpecialization = specializationFilter === 'all' ||
          agent.specialization.toLowerCase() === specializationFilter.toLowerCase();

        return matchesSearch && matchesSpecialization;
      })
      .sort((a, b) => {
        // Sort by selected criteria
        switch (sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'experience':
            // Sort by join date (older first)
            return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          case 'listings':
            return (b.listings || 0) - (a.listings || 0);
          case 'sales':
            return (b.soldPropertyCount || 0) - (a.soldPropertyCount || 0);
          default:
            return 0;
        }
      });
  }, [data?.agents, searchQuery, specializationFilter, sortBy]);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Our Agents</h1>
          <p className="text-muted-foreground">Meet our team of professional real estate agents</p>
        </div>

        {/* Search and Filter Section */}
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search agents by name, specialization..."
                    className="pl-10 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="experience">Most Experience</SelectItem>
                    <SelectItem value="listings">Most Listings</SelectItem>
                    <SelectItem value="sales">Highest Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading agents...</span>
          </div>
        )}

        {isError && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <h3 className="text-lg font-medium text-destructive">Error loading agents</h3>
              <p className="text-muted-foreground">{error?.message || 'Please try again later'}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Tabs for different agent categories */}
        {!isLoading && !isError && data?.agents && (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
              <TabsTrigger value="all">All Agents</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="top">Top Rated</TabsTrigger>
              <TabsTrigger value="new">New Agents</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.length === 0 ? (
                  <div className="col-span-3 py-10 text-center">
                    <p className="text-muted-foreground">No agents found matching your criteria.</p>
                  </div>
                ) : (
                  filteredAgents
                    .slice((currentPage - 1) * agentsPerPage, currentPage * agentsPerPage)
                    .map((agent) => (
                      <AgentCard
                        key={agent.id}
                        agent={agent}
                      />
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="featured" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents
                  .filter(agent => agent.featured)
                  .length === 0 ? (
                    <div className="col-span-3 py-10 text-center">
                      <p className="text-muted-foreground">No featured agents found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredAgents
                      .filter(agent => agent.featured)
                      .map((agent) => (
                        <AgentCard
                          key={agent.id}
                          agent={agent}
                          featured={true}
                        />
                      ))
                  )}
              </div>
            </TabsContent>

            <TabsContent value="top" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents
                  .filter(agent => agent.rating >= 4.5)
                  .length === 0 ? (
                    <div className="col-span-3 py-10 text-center">
                      <p className="text-muted-foreground">No top-rated agents found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredAgents
                      .filter(agent => agent.rating >= 4.5)
                      .map((agent) => (
                        <AgentCard
                          key={agent.id}
                          agent={agent}
                          rating={agent.rating}
                        />
                      ))
                  )}
              </div>
            </TabsContent>

            <TabsContent value="new" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents
                  .filter(agent => {
                    // Consider agents joined in the last 30 days as new
                    const joinDate = new Date(agent.joinDate);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return joinDate >= thirtyDaysAgo;
                  })
                  .length === 0 ? (
                    <div className="col-span-3 py-10 text-center">
                      <p className="text-muted-foreground">No new agents found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredAgents
                      .filter(agent => {
                        // Consider agents joined in the last 30 days as new
                        const joinDate = new Date(agent.joinDate);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return joinDate >= thirtyDaysAgo;
                      })
                      .map((agent) => (
                        <AgentCard
                          key={agent.id}
                          agent={agent}
                          isNew={true}
                        />
                      ))
                  )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Pagination */}
        {!isLoading && !isError && filteredAgents.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {Array.from({ length: Math.ceil(filteredAgents.length / agentsPerPage) }).map((_, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={currentPage === index + 1 ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAgents.length / agentsPerPage)))}
                disabled={currentPage === Math.ceil(filteredAgents.length / agentsPerPage)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Agent Card Component
interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    image: string;
    location: string;
    specialization: string;
    rating: number;
    bio: string;
    user: {
      email: string;
      phone: string;
    };
    featured?: boolean;
  };
  featured?: boolean;
  rating?: number;
  isNew?: boolean;
}

function AgentCard({ agent, featured = false, rating, isNew = false }: AgentCardProps) {
  // Use the agent's rating if provided, otherwise use the rating prop or default to the agent's rating
  // Ensure displayRating is always a number
  const displayRating = typeof rating === 'number' ? rating :
                        (typeof agent.rating === 'number' ? agent.rating : 4);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={agent.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"}
            alt={agent.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        {(featured || agent.featured) && (
          <div className="absolute top-2 left-2">
            <span className="bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded">Featured Agent</span>
          </div>
        )}
        {isNew && (
          <div className="absolute top-2 left-2">
            <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded">New Agent</span>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{agent.name}</CardTitle>
        <CardDescription className="flex items-center text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground/70" />
          {agent.location} • {agent.specialization}
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
          <span className="ml-2 text-sm text-muted-foreground">({displayRating.toFixed(1)})</span>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          <p>{agent.bio || `${agent.specialization} specialist with experience in the ${agent.location} market.`}</p>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{agent.user.phone || "Not available"}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{agent.user.email}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/agent/${agent.id}`}>View Profile</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/contact?agent=${agent.id}`}>Contact</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
