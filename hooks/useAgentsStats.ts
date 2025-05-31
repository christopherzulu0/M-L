"use client";

import { useQuery } from "@tanstack/react-query";

// Function to fetch agents data
const fetchAgents = async () => {
  const response = await fetch('/api/agents', {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch agents data');
  }

  return response.json();
};

// Function to calculate stats from API response
const calculateStats = (response) => {
  const { agents, stats } = response;
  const { current, previous } = stats;

  // Calculate percentage changes
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return parseFloat(((current - previous) / previous * 100).toFixed(1));
  };

  const totalAgentsChange = calculatePercentageChange(current.totalAgents, previous.totalAgents);
  const averageRatingChange = calculatePercentageChange(current.averageRating, previous.averageRating);
  const totalPropertiesChange = calculatePercentageChange(current.totalProperties, previous.totalProperties);

  // Calculate total sales
  const averagePropertyValue = 500000; // ZMW 500,000 average property value
  const currentTotalSales = (current.totalSoldProperties * averagePropertyValue / 1000000);
  const previousTotalSales = (previous.totalSoldProperties * averagePropertyValue / 1000000);
  const totalSalesChange = calculatePercentageChange(currentTotalSales, previousTotalSales);

  return {
    totalAgents: current.totalAgents,
    totalAgentsChange,
    averageRating: current.averageRating.toFixed(1),
    averageRatingChange,
    totalProperties: current.totalProperties,
    totalPropertiesChange,
    totalSales: `ZMW ${currentTotalSales.toFixed(1)}M`,
    totalSalesChange
  };
};

// Custom hook to fetch agents data and calculate stats
export function useAgentsStats() {
  return useQuery({
    queryKey: ['agentsStats'],
    queryFn: async () => {
      const response = await fetchAgents();
      return calculateStats(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
