"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UserProfileCheck({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only check if user is signed in and clerk has loaded
    if (isLoaded && isSignedIn && user) {
      checkUserExists();
    } else if (isLoaded && !isSignedIn) {
      setIsChecking(false);
    }
  }, [isLoaded, isSignedIn, user]);

  const checkUserExists = async () => {
    try {
      // Check if user exists in the database
      const response = await fetch(`/api/users/check?clerkId=${user?.id}`);
      const data = await response.json();

      if (data.exists) {
        // User exists, continue to the app
        setIsChecking(false);
      } else {
        // User doesn't exist, show the form
        // Pre-fill form with data from Clerk
        setFormData({
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
        });
        setShowForm(true);
        setIsChecking(false);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setIsChecking(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "user", // Default role
        }),
      });

      if (response.ok) {
        toast({
          title: "Profile created",
          description: "Your profile has been created successfully.",
        });
        setShowForm(false);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still checking or not signed in, render children
  if (isChecking || !isSignedIn) {
    return <>{children}</>;
  }

  // Render the dialog if form should be shown
  if (isLoaded && isSignedIn) {
    return (
      <>
        {children}
        <Dialog
          open={showForm}
          onOpenChange={(open) => {
            // Prevent closing the dialog by clicking outside
            // It can only be closed programmatically after successful form submission
            if (open === false) return;
            setShowForm(open);
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-2xl font-bold text-center">Welcome to the Platform!</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Please complete your profile information to get started with our services.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2 transition-all duration-200 hover:scale-[1.01]">
                  <Label htmlFor="firstName" className="font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border-2 focus:border-primary"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="grid gap-2 transition-all duration-200 hover:scale-[1.01]">
                  <Label htmlFor="lastName" className="font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border-2 focus:border-primary"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
                <div className="grid gap-2 transition-all duration-200 hover:scale-[1.01]">
                  <Label htmlFor="email" className="font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-2 focus:border-primary"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div className="grid gap-2 transition-all duration-200 hover:scale-[1.01]">
                  <Label htmlFor="phone" className="font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border-2 focus:border-primary"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 text-base font-medium transition-all duration-200 hover:scale-[1.02]"
                >
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

}
