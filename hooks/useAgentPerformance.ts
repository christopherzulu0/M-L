"use client";

import { useQuery } from "@tanstack/react-query";

// Function to fetch agent performance data
const fetchAgentPerformance = async (timePeriod: string) => {
  const response = await fetch(`/api/agents/performance?period=${encodeURIComponent(timePeriod)}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch agent performance data');
  }

  return response.json();
};

// Custom hook to fetch agent performance data
export function useAgentPerformance(timePeriod: string) {
  return useQuery({
    queryKey: ['agentPerformance', timePeriod],
    queryFn: () => fetchAgentPerformance(timePeriod),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
