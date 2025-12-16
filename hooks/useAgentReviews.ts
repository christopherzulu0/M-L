"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Review {
    id: number;
    agentId: number;
    name: string;
    email: string;
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ReviewsResponse {
    reviews: Review[];
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
    };
}

interface SubmitReviewData {
    name: string;
    email: string;
    rating: number;
    comment: string;
}

// Fetch agent reviews
const fetchAgentReviews = async (agentId: string, page: number = 1): Promise<ReviewsResponse> => {
    console.log(`[useAgentReviews] Fetching reviews for agent ${agentId}, page ${page}`);

    const response = await fetch(`/api/agent/${agentId}/reviews?page=${page}&limit=10`, {
        cache: 'no-store'
    });

    console.log(`[useAgentReviews] Response status: ${response.status}`);

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[useAgentReviews] Error response:`, errorText);
        throw new Error(`Failed to fetch reviews for agent ${agentId}: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[useAgentReviews] Received ${data.reviews?.length || 0} reviews`);

    return data;
};


// Submit a new review
const submitReview = async (agentId: string, data: SubmitReviewData) => {
    const response = await fetch(`/api/agent/${agentId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
    }

    return response.json();
};

// Hook to fetch agent reviews with Suspense support
export function useAgentReviews(agentId: string, page: number = 1) {
    return useQuery({
        queryKey: ['agentReviews', agentId, page],
        queryFn: () => fetchAgentReviews(agentId, page),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!agentId, // Only fetch when agentId is available
    });
}

// Hook to submit a review
export function useSubmitReview(agentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SubmitReviewData) => submitReview(agentId, data),
        onSuccess: () => {
            // Invalidate reviews query to refetch
            queryClient.invalidateQueries({ queryKey: ['agentReviews', agentId] });
        },
    });
}
