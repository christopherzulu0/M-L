"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "@/components/ui/use-toast";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  slug: z.string().min(5, {
    message: "Slug must be at least 5 characters.",
  }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens.",
  }),
  excerpt: z.string().optional(),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
  image: z.string().optional(),
  category: z.string({
    required_error: "Please select a category.",
  }),
  status: z.enum(["draft", "published"], {
    required_error: "Please select a status.",
  }),
});

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image: "",
      category: "",
      status: "draft",
    },
  });

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/blog/${id}`);
        if (response.ok) {
          const blogPost = await response.json();

          // Set form values
          form.reset({
            title: blogPost.title,
            slug: blogPost.slug,
            excerpt: blogPost.excerpt || "",
            content: blogPost.content,
            image: blogPost.image || "",
            category: blogPost.category,
            status: blogPost.status,
          });

          // Set image preview if available
          if (blogPost.image) {
            setImagePreview(blogPost.image);
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch blog post");
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError("An error occurred while fetching the blog post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [id, form]);

  // Set up uploadthing
  const { startUpload } = useUploadThing("blogImageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        // Use the first image URL
        setImagePreview(res[0].url);
        form.setValue("image", res[0].url);
        setIsUploading(false);
        toast({
          title: "Upload complete",
          description: "Your image has been uploaded successfully",
        });
      }
    },
    onUploadError: (error) => {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        await startUpload(acceptedFiles);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      await startUpload(Array.from(files));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue("image", "");
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle title change to auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);

    // Only auto-generate slug if it hasn't been manually edited or is empty
    const currentSlug = form.getValues("slug");
    if (!currentSlug || currentSlug === generateSlug(form.getValues("title"))) {
      form.setValue("slug", generateSlug(title));
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        router.push('/dashboard/blog');
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update blog post");
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      setError("An error occurred while updating the blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/blog')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Error</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => router.push('/dashboard/blog')}>
                Return to Blog Management
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/blog')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Post Details</CardTitle>
          <CardDescription>Edit your blog post content and settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter blog post title"
                          {...field}
                          onChange={handleTitleChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="enter-blog-post-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        Used for the URL. Auto-generated from title.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief summary of the blog post"
                        className="resize-none h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A short summary that appears in blog listings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your blog post content here..."
                        className="resize-none min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {imagePreview ? (
                          <div className="relative rounded-lg border overflow-hidden transition-all duration-200 group hover:shadow-md">
                            <div className="relative h-[250px] w-full overflow-hidden">
                              <Image
                                src={imagePreview}
                                alt="Blog post featured image"
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center">
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={removeImage}
                                    className="rounded-full"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Remove
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => {
                                      // Create a file input element
                                      const input = document.createElement('input');
                                      input.type = 'file';
                                      input.accept = 'image/*';
                                      input.onchange = (e) => handleImageUpload(e as React.ChangeEvent<HTMLInputElement>);
                                      input.click();
                                    }}
                                    disabled={isUploading}
                                  >
                                    {isUploading ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                        Uploading...
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="h-4 w-4 mr-1" />
                                        Change
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            {...getRootProps()}
                            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-all duration-200 ${
                              isDragActive ? "border-primary bg-primary/5" : "border-slate-200"
                            }`}
                          >
                            <input {...getInputProps()} />
                            {isUploading ? (
                              <div className="flex flex-col items-center">
                                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                                <p className="text-sm font-medium">Uploading image...</p>
                              </div>
                            ) : (
                              <>
                                <div className="mb-4 rounded-full bg-slate-100 p-3">
                                  <Upload className="h-6 w-6 text-slate-500" />
                                </div>
                                <p className="mb-2 text-sm font-medium">Drag and drop an image here</p>
                                <p className="mb-4 text-xs text-muted-foreground">PNG, JPG or WEBP (max. 4MB)</p>
                                <Button type="button" variant="outline" className="rounded-full">
                                  Browse Files
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                        <Input type="hidden" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a featured image for your blog post. This image will be displayed in blog listings and at the top of your post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Market">Market</SelectItem>
                          <SelectItem value="Guides">Guides</SelectItem>
                          <SelectItem value="Tips">Tips</SelectItem>
                          <SelectItem value="News">News</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Draft posts are not visible to the public.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/blog')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Post
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
