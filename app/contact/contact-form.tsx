"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useAgent } from "@/hooks/useAgent";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Send,
  Loader2,
} from "lucide-react";

export function ContactForm() {
  // Get the agent ID from the query parameters
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent');

  // State for form fields
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch agent data if agentId is provided
  const { data: agent, isLoading, isError, error } = agentId
    ? useAgent(agentId)
    : { data: null, isLoading: false, isError: false, error: null };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare the form data
      const formData = {
        name,
        email,
        subject,
        message,
        agentId: agentId || undefined,
      };

      // Send the form data to the API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }

      // Reset form on success
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');

      // Show success message
      alert('Message sent successfully!');
    } catch (error) {
      // Show error message
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to send message'}`);
      console.error('Error sending contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-8">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2">
          <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
            <h2 className="text-2xl font-bold mb-4">
              {agentId && !isLoading && !isError && agent
                ? `Get In Touch With ${agent.name}`
                : 'Get In Touch With Us'}
            </h2>
            <p className="mb-6 text-indigo-100">
              {agentId && !isLoading && !isError && agent
                ? `Have questions about buying or selling a property? Send ${agent.name} a message and ${agent.name.includes(' ') ? agent.name.split(' ')[0] : agent.name}'ll get back to you as soon as possible.`
                : 'Have questions about our services or properties? Send us a message and our team will get back to you as soon as possible.'}
            </p>

            {/* Loading state for agent data */}
            {agentId && isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <span className="ml-2">Loading agent information...</span>
              </div>
            )}

            {/* Error state for agent data */}
            {agentId && isError && (
              <div className="py-8 text-center">
                <p className="text-red-300 mb-2">Error loading agent information</p>
                <p className="text-sm text-indigo-200">{error instanceof Error ? error.message : 'Unknown error'}</p>
              </div>
            )}

            {/* Contact Information */}
            {(!agentId || (agentId && !isLoading && !isError && agent)) && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200">Phone Number</p>
                    <p className="font-medium">
                      {agentId && agent ? (agent.phone || "Phone not available") : "+1 (555) 123-4567"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200">Email Address</p>
                    <p className="font-medium">
                      {agentId && agent ? (agent.email || "Email not available") : "contact@realestate.com"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200">Office Address</p>
                    <p className="font-medium">
                      {agentId && agent ? (agent.address || "Address not available") : "123 Real Estate St, City, State 12345"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Actions */}
            {agentId && !isLoading && !isError && agent && (
              <div className="mt-8 flex gap-3">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
              </div>
            )}
          </div>

          <div className="p-8">
            <h3 className="text-xl font-bold mb-2">Send a Message</h3>
            <p className="text-muted-foreground mb-6">
              {agentId && !isLoading && !isError && agent
                ? `Fill out the form below and ${agent.name} will get back to you shortly.`
                : 'Fill out the form below and our team will get back to you shortly.'}
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Your name*"
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    placeholder="Your email*"
                    type="email"
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Input
                  placeholder="Subject"
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your message"
                  className="min-h-[120px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
