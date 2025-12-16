"use client";

import React from "react";
import { Star, Calendar, Loader2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentReviews } from "@/hooks/useAgentReviews";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReviewsSectionProps {
    agentId: string;
    agentName: string;
}

// Skeleton loader for reviews
function ReviewsSkeleton() {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
                >
                    <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                </div>
            ))}
        </div>
    );
}

// Main reviews section
export function ReviewsSection({ agentId, agentName }: ReviewsSectionProps) {
    const { data: reviewsData, isLoading, isError, error } = useAgentReviews(agentId);

    // Loading state
    if (isLoading) {
        return <ReviewsSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {error instanceof Error ? error.message : "Failed to load reviews. Please try again later."}
                </AlertDescription>
            </Alert>
        );
    }

    // Empty state
    if (!reviewsData || reviewsData.reviews.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">
                    No reviews yet. Be the first to review {agentName}!
                </p>
            </div>
        );
    }

    // Reviews list
    return (
        <div className="space-y-6">
            {reviewsData.reviews.map((review) => (
                <div
                    key={review.id}
                    className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
                >
                    <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                {review.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-semibold">{review.name}</h4>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                </div>
            ))}
        </div>
    );
}
