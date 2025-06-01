"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

// Define the blog post type based on the API response structure
type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  category: string;
  publishedAt?: string;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  // Additional fields for UI display
  authorImage?: string;
  date?: string;
  tags?: string[];
};

// Related posts component
function RelatedPosts({ currentPostId }: { currentPostId: number }) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        // Fetch all blog posts
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch related posts');
        }

        const data = await response.json();

        // Filter out the current post and get up to 3 related posts
        const related = data.blogPosts
          .filter((post: BlogPost) => post.id !== currentPostId)
          .slice(0, 3);

        // Add display-friendly date and author name
        const formattedPosts = related.map((post: BlogPost) => ({
          ...post,
          date: post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
          authorImage: post.author?.profileImage || '/placeholder.svg'
        }));

        setRelatedPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentPostId) {
      fetchRelatedPosts();
    }
  }, [currentPostId]);

  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border-none shadow-md">
              <div className="aspect-video bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
            <div className="aspect-video relative">
              <Image
                src={post.image || '/placeholder.svg'}
                alt={post.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium px-2.5 py-1 rounded">
                  {post.category}
                </span>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{post.date}</span>
                </div>
              </div>
              <h3 className="font-bold mb-2 hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-3 inline-flex items-center text-primary text-sm font-medium">
                Read more
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const unwrappedParams = React.use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const idParam = unwrappedParams.id;
        let response;

        // Check if the ID is numeric or a slug
        if (!isNaN(parseInt(idParam))) {
          // If it's a numeric ID, fetch by ID
          response = await fetch(`/api/blog/${idParam}`);
        } else {
          // If it's a slug, fetch by slug
          response = await fetch(`/api/blog?slug=${idParam}`);
        }

        if (!response.ok) {
          throw new Error(`Error fetching blog post: ${response.statusText}`);
        }

        const data = await response.json();

        // If fetching by slug, we get an array of posts
        const blogPost = Array.isArray(data.blogPosts)
          ? data.blogPosts[0]
          : data;

        if (blogPost) {
          // Format the blog post data for display
          const formattedPost: BlogPost = {
            ...blogPost,
            // Format date for display
            date: blogPost.publishedAt
              ? new Date(blogPost.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : new Date(blogPost.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }),
            // Set author image
            authorImage: blogPost.author?.profileImage || '/placeholder.svg',
            // Default tags if none provided
            tags: blogPost.tags || ['Real Estate']
          };

          setPost(formattedPost);
          setError(null);
        } else {
          setError("Blog post not found");
        }
      } catch (err) {
        setError("Error loading blog post");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [unwrappedParams.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
            <div className="aspect-video bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">{error || "Blog post not found"}</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Back to blog link */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      {/* Blog post header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded">{post.category}</span>
          <span className="text-sm text-muted-foreground">{post.date}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

        {/* Author info */}
        <div className="flex items-center mb-8">
          <Image
            src={post.authorImage || '/placeholder.svg'}
            alt={post.author?.firstName ? `${post.author.firstName} ${post.author.lastName}` : 'Author'}
            width={48}
            height={48}
            className="rounded-full mr-4"
          />
          <div>
            <p className="font-medium">
              {post.author?.firstName ? `${post.author.firstName} ${post.author.lastName}` : 'Anonymous'}
            </p>
            <p className="text-sm text-muted-foreground">
              {post.author?.firstName ? 'Real Estate Analyst' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Featured image */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="aspect-[21/9] relative rounded-lg overflow-hidden">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>
      </div>

      {/* Blog content */}
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }}></div>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags && post.tags.length > 0 ? (
            post.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </span>
            ))
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
              <Tag className="mr-1 h-3 w-3" />
              {post.category || 'Blog'}
            </span>
          )}
        </div>

        {/* Share buttons */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex items-center justify-between">
            <p className="font-medium">Share this article:</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Related posts */}
      <div className="max-w-7xl mx-auto">
        <RelatedPosts currentPostId={post.id} />
      </div>
    </div>
  );
}
