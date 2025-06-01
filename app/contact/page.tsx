import React, { Suspense } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  Mail,
  ChevronRight,
  Home
} from "lucide-react";
import Link from 'next/link';
import { ContactForm } from './contact-form';

export default function ContactPage() {

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-6 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground font-medium">Contact Us</span>
        </div>

        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our services or properties? We're here to help. Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Form Card */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading contact form...</div>}>
          <ContactForm />
        </Suspense>

        {/* Additional Contact Information */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Visit Our Office</h3>
              <p className="text-muted-foreground">
                123 Real Estate St<br />
                City, State 12345<br />
                United States
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-muted-foreground">
                Main Office: +1 (555) 123-4567<br />
                Support: +1 (555) 987-6543<br />
                Toll-free: 1-800-REAL-EST
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground">
                General Inquiries: info@realestate.com<br />
                Support: support@realestate.com<br />
                Careers: careers@realestate.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
