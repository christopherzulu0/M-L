"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ArrowRight, Calendar, User, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Static fallback data for blog posts
const staticBlogPosts = [
  {
    id: 1,
    title: "10 Tips for First-Time Home Buyers",
    excerpt: "Navigating the real estate market can be challenging for first-time buyers. Here are our top tips to help you make the right decision.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=773&q=80",
    publishedAt: new Date("2025-06-01").toISOString(),
    category: "Tips",
    author: {
      firstName: "Sarah",
      lastName: "Johnson",
      profileImage: null
    }
  },
  {
    id: 2,
    title: "Understanding Property Taxes",
    excerpt: "Property taxes can significantly impact your homeownership costs. Learn how they're calculated and what you can do to manage them.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=811&q=80",
    publishedAt: new Date("2025-05-25").toISOString(),
    category: "Guides",
    author: {
      firstName: "Michael",
      lastName: "Chen",
      profileImage: null
    }
  },
  {
    id: 3,
    title: "The Future of Real Estate Technology",
    excerpt: "From virtual tours to blockchain transactions, technology is transforming the real estate industry. Here's what to expect in the coming years.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=872&q=80",
    publishedAt: new Date("2025-05-18").toISOString(),
    category: "News",
    author: {
      firstName: "Alex",
      lastName: "Rivera",
      profileImage: null
    }
  },
  {
    id: 4,
    title: "Market Report: Q2 2025 Housing Trends",
    excerpt: "Our comprehensive analysis of the housing market for the second quarter of 2025, including price trends, inventory levels, and forecasts.",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    publishedAt: new Date("2025-05-10").toISOString(),
    category: "Market",
    author: {
      firstName: "Jessica",
      lastName: "Williams",
      profileImage: null
    }
  },
  {
    id: 5,
    title: "5 Home Renovation Projects with the Best ROI",
    excerpt: "Not all home improvements are created equal. Discover which renovation projects offer the best return on investment when selling your home.",
    image: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=913&q=80",
    publishedAt: new Date("2025-05-03").toISOString(),
    category: "Tips",
    author: {
      firstName: "David",
      lastName: "Thompson",
      profileImage: null
    }
  },
  {
    id: 6,
    title: "Commercial Real Estate Outlook for 2025",
    excerpt: "An in-depth look at the commercial real estate sector, including office spaces, retail, and industrial properties in the post-pandemic era.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    publishedAt: new Date("2025-04-28").toISOString(),
    category: "Market",
    author: {
      firstName: "Robert",
      lastName: "Kim",
      profileImage: null
    }
  }
];

// Featured article data
const featuredArticle = {
  id: 0,
  title: "The Future of Real Estate: Trends to Watch in 2025",
  excerpt: "From sustainable housing to AI-powered transactions, discover the innovations shaping the real estate landscape in the coming years.",
  image: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80",
  publishedAt: new Date("2025-06-05").toISOString(),
  category: "Featured",
  author: {
    firstName: "John",
    lastName: "Doe",
    profileImage: null
  }
};

// Function to fetch blog posts from the API
function getBlogPosts(page = 1, category = '', search = '', retryCount = 0) {
  return new Promise(async (resolve) => {
    try {
      // Validate inputs
      const validPage = Math.max(1, parseInt(page) || 1); // Ensure page is a positive integer
      const validCategory = category ? category.trim() : '';
      const validSearch = search ? search.trim() : '';

      // Use absolute URL to avoid "Failed to parse URL" error
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      // Build URL with query parameters
      let url = `${baseUrl}/api/blog?page=${validPage}`;
      if (validCategory && validCategory !== 'all') {
        url += `&category=${encodeURIComponent(validCategory)}`;
      }
      if (validSearch) {
        url += `&search=${encodeURIComponent(validSearch)}`;
      }

      // Set timeout for fetch to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout (increased from 5)

      try {
        const response = await fetch(url, {
          cache: 'no-cache', // Ensure we're not using a stale cached response
          signal: controller.signal
        });

        // Clear the timeout since the request completed
        clearTimeout(timeoutId);

        // Check if the response is OK and has the correct content type before parsing
        if (!response.ok) {
          console.warn(`API returned status ${response.status}`);
          resolve({ posts: null, pagination: null, error: `API error: ${response.status}` });
          return;
        }

        // Check content type to ensure we're getting JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn(`API returned non-JSON content type: ${contentType}`);
          resolve({ posts: null, pagination: null, error: 'Invalid content type' });
          return;
        }

        // Now it's safe to parse the response as JSON
        const data = await response.json();

        // Check if the response contains blog posts
        if (data && Array.isArray(data.blogPosts) && data.blogPosts.length > 0) {
          resolve({
            posts: data.blogPosts,
            pagination: data.pagination || {
              page: 1,
              totalPages: 1,
              total: data.blogPosts.length,
              pageSize: data.blogPosts.length
            },
            error: null
          });
        } else {
          console.warn('API returned empty blog posts array');
          resolve({ posts: null, pagination: null, error: 'No posts found' });
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);

        // Handle timeout errors with retry logic
        if (fetchError.name === 'AbortError') {
          console.error('Request timed out after 15 seconds');

          // Retry up to 2 times (3 attempts total)
          if (retryCount < 2) {
            console.log(`Retrying request (attempt ${retryCount + 2} of 3)...`);
            // Recursive call with incremented retry count
            const retryResult = await getBlogPosts(page, category, search, retryCount + 1);
            resolve(retryResult);
            return;
          }

          resolve({ posts: null, pagination: null, error: 'Request timed out. Please try again later.' });
        } else {
          console.error('Fetch error:', fetchError);
          resolve({ posts: null, pagination: null, error: 'Failed to fetch data' });
        }
      }
    } catch (error) {
      console.error('Error in getBlogPosts:', error);
      resolve({ posts: null, pagination: null, error: 'An unexpected error occurred' });
    }
  });
}

export default function BlogPage() {
  // State for blog posts and pagination
  const [blogPosts, setBlogPosts] = React.useState(staticBlogPosts);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentCategory, setCurrentCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [pagination, setPagination] = React.useState({
    page: 1,
    totalPages: 1,
    total: staticBlogPosts.length,
    pageSize: 6
  });
  // Add loading and error states
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Fetch blog posts when component mounts or pagination/category/search changes
  React.useEffect(() => {
    // Reset error state on new request
    setError(null);

    // Debounce search to avoid too many API calls
    const timer = setTimeout(async () => {
      // Set loading state to true when starting a request
      setIsLoading(true);

      try {
        const result = await getBlogPosts(currentPage, currentCategory, searchQuery);

        // Check for errors returned from getBlogPosts
        if (result.error) {
          setError(result.error);
          // Still use static data as fallback when there's an error
          if (searchQuery) {
            // Filter static data by search query
            const filteredPosts = staticBlogPosts.filter(post => {
              const searchLower = searchQuery.toLowerCase();
              return (
                post.title.toLowerCase().includes(searchLower) ||
                post.excerpt.toLowerCase().includes(searchLower) ||
                post.category.toLowerCase().includes(searchLower)
              );
            });
            setBlogPosts(filteredPosts);
            setPagination({
              page: 1,
              totalPages: 1,
              total: filteredPosts.length,
              pageSize: filteredPosts.length || 1
            });
          } else if (currentCategory !== 'all') {
            // Filter static data by category
            const filteredPosts = staticBlogPosts.filter(post =>
              post.category.toLowerCase() === currentCategory.toLowerCase()
            );
            setBlogPosts(filteredPosts);
            setPagination({
              page: 1,
              totalPages: 1,
              total: filteredPosts.length,
              pageSize: filteredPosts.length || 1
            });
          } else {
            // Use all static data
            setBlogPosts(staticBlogPosts);
            setPagination({
              page: 1,
              totalPages: 1,
              total: staticBlogPosts.length,
              pageSize: staticBlogPosts.length
            });
          }
        } else if (result.posts && result.posts.length > 0) {
          // Use API results if available
          setBlogPosts(result.posts);
          if (result.pagination) {
            setPagination(result.pagination);
          }
          // Clear any previous errors
          setError(null);
        } else if (searchQuery) {
          // If API returns no results but we have a search query, filter static data
          const filteredPosts = staticBlogPosts.filter(post => {
            const searchLower = searchQuery.toLowerCase();
            return (
              post.title.toLowerCase().includes(searchLower) ||
              post.excerpt.toLowerCase().includes(searchLower) ||
              post.category.toLowerCase().includes(searchLower)
            );
          });

          setBlogPosts(filteredPosts);
          setPagination({
            page: 1,
            totalPages: 1,
            total: filteredPosts.length,
            pageSize: filteredPosts.length || 1
          });
        } else if (currentCategory !== 'all') {
          // If no search but category filter is active, filter static data by category
          const filteredPosts = staticBlogPosts.filter(post =>
            post.category.toLowerCase() === currentCategory.toLowerCase()
          );

          setBlogPosts(filteredPosts);
          setPagination({
            page: 1,
            totalPages: 1,
            total: filteredPosts.length,
            pageSize: filteredPosts.length || 1
          });
        } else {
          // Fallback to all static data
          setBlogPosts(staticBlogPosts);
          setPagination({
            page: 1,
            totalPages: 1,
            total: staticBlogPosts.length,
            pageSize: staticBlogPosts.length
          });
        }
      } catch (err) {
        console.error('Error in useEffect:', err);
        setError('An unexpected error occurred while fetching blog posts');
        // Use static data as fallback
        setBlogPosts(staticBlogPosts);
      } finally {
        // Always set loading to false when done
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [currentPage, currentCategory, searchQuery]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    try {
      setSearchQuery(e.target.value);
      setCurrentPage(1); // Reset to first page when searching
    } catch (error) {
      console.error('Error updating search query:', error);
      // Fallback in case of error
      setSearchQuery('');
    }
  };

  // Handle search clear
  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-2 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">News & Blog</h1>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest real estate news, market trends, and helpful guides
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <div className="relative w-full">
              <Input
                placeholder="Search articles..."
                className="pl-10 bg-background pr-10"
                value={searchQuery}
                onChange={handleSearchChange}
                disabled={isLoading} // Disable input while loading
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={clearSearch}
                  disabled={isLoading} // Disable button while loading
                >
                  ✕
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-muted-foreground">Loading blog posts...</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="text-center py-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <p className="mt-2 text-sm">Using cached data instead. Please try again later.</p>
            </div>
          </div>
        )}

        {/* Search status */}
        {searchQuery && !isLoading && (
          <div className="text-center">
            <p className="text-muted-foreground">
              {blogPosts.length === 0
                ? `No results found for "${searchQuery}"`
                : `Found ${blogPosts.length} result${blogPosts.length !== 1 ? 's' : ''} for "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs
          defaultValue="all"
          className="w-full"
          value={currentCategory}
          onValueChange={handleCategoryChange}
          disabled={isLoading}
        >
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-5 w-full max-w-xl mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 gap-12">
              {/* Featured Article */}
              <div className="relative rounded-xl overflow-hidden">
                <div className="aspect-[21/9] relative">
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded">{featuredArticle.category}</span>
                      <span className="text-sm opacity-80">{new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">{featuredArticle.title}</h2>
                    <p className="text-sm sm:text-base opacity-90 mb-4 max-w-3xl">
                      {featuredArticle.excerpt}
                    </p>
                    <Button variant="secondary">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Article Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post, index) => (
                  <BlogPostCard
                    key={post.id || index}
                    title={post.title}
                    excerpt={post.excerpt || ''}
                    image={post.image || '/placeholder-image.jpg'}
                    date={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                    category={post.category}
                    author={post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown Author'}
                    index={post.id || index}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Other tab contents filtered by category */}
          <TabsContent value="market" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts
                .filter(post => post.category.toLowerCase() === 'market')
                .map((post, index) => (
                  <BlogPostCard
                    key={post.id || index}
                    title={post.title}
                    excerpt={post.excerpt || ''}
                    image={post.image || '/placeholder-image.jpg'}
                    date={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                    category={post.category}
                    author={post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown Author'}
                    index={post.id || index}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="guides" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts
                .filter(post => post.category.toLowerCase() === 'guides')
                .map((post, index) => (
                  <BlogPostCard
                    key={post.id || index}
                    title={post.title}
                    excerpt={post.excerpt || ''}
                    image={post.image || '/placeholder-image.jpg'}
                    date={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                    category={post.category}
                    author={post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown Author'}
                    index={post.id || index}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="tips" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts
                .filter(post => post.category.toLowerCase() === 'tips')
                .map((post, index) => (
                  <BlogPostCard
                    key={post.id || index}
                    title={post.title}
                    excerpt={post.excerpt || ''}
                    image={post.image || '/placeholder-image.jpg'}
                    date={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                    category={post.category}
                    author={post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown Author'}
                    index={post.id || index}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts
                .filter(post => post.category.toLowerCase() === 'news')
                .map((post, index) => (
                  <BlogPostCard
                    key={post.id || index}
                    title={post.title}
                    excerpt={post.excerpt || ''}
                    image={post.image || '/placeholder-image.jpg'}
                    date={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                    category={post.category}
                    author={post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown Author'}
                    index={post.id || index}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {/* Previous button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={isLoading || currentPage <= 1}
            >
              Previous
            </Button>

            {/* Page number buttons */}
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (pagination.totalPages <= 5) {
                // If we have 5 or fewer pages, show all
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // If we're near the start, show first 5 pages
                pageNum = i + 1;
              } else if (currentPage >= pagination.totalPages - 2) {
                // If we're near the end, show last 5 pages
                pageNum = pagination.totalPages - 4 + i;
              } else {
                // Otherwise show 2 pages before and after current page
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant="outline"
                  size="sm"
                  className={currentPage === pageNum ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoading}
                >
                  {pageNum}
                </Button>
              );
            })}

            {/* Next button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={isLoading || currentPage >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-slate-50 rounded-xl p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Stay updated with the latest real estate news, market trends, and exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder="Enter your email" className="sm:flex-1" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Blog Post Card Component
function BlogPostCard({ title, excerpt, image, date, category, author, index = 0 }: {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  author: string;
  index?: number;
}) {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
      <div className="aspect-video relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium px-2.5 py-1 rounded">
            {category}
          </span>
        </div>
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <User className="h-3.5 w-3.5 mr-1" />
            <span>{author}</span>
          </div>
        </div>
        <CardTitle className="text-lg hover:text-primary transition-colors">
          <Link href={`/blog/${index}`}>
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/blog/${index}`}>
          <Button variant="ghost" className="p-0 h-auto text-primary">
            Read more
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
