"use client";

import { useQuery } from "@tanstack/react-query";

// Function to fetch agent data
const fetchAgent = async (id: string) => {
  const response = await fetch(`/api/agent/${id}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch agent with ID ${id}`);
  }
  
  return response.json();
};

// Custom hook to fetch agent data
export function useAgent(id: string) {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: () => fetchAgent(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}