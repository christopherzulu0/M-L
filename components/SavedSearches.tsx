"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Save, Trash2, Bell, BellOff, Edit, X, Check, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface SearchCriteria {
  query?: string;
  propertyType?: string;
  minPrice?: string;
  maxPrice?: string;
  minBeds?: string;
  minBaths?: string;
  location?: string;
}

interface SavedSearch {
  id: string;
  name: string;
  criteria: SearchCriteria;
  notifications: boolean;
  createdAt: string;
}

export default function SavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null);
  const [searchName, setSearchName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load saved searches from localStorage
  useEffect(() => {
    const loadSavedSearches = () => {
      try {
        const savedData = localStorage.getItem('savedSearches');
        if (savedData) {
          setSavedSearches(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading saved searches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedSearches();
  }, []);

  // Save to localStorage whenever savedSearches changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
    }
  }, [savedSearches, isLoading]);

  // Format criteria for display
  const formatCriteria = (criteria: SearchCriteria): string[] => {
    const formatted = [];

    if (criteria.query) {
      formatted.push(`"${criteria.query}"`);
    }

    if (criteria.propertyType) {
      formatted.push(criteria.propertyType);
    }

    if (criteria.location) {
      formatted.push(criteria.location);
    }

    if (criteria.minPrice || criteria.maxPrice) {
      const priceRange = [];
      if (criteria.minPrice) priceRange.push(`ZMW ${parseInt(criteria.minPrice).toLocaleString()}`);
      if (criteria.minPrice && criteria.maxPrice) priceRange.push('to');
      if (criteria.maxPrice) priceRange.push(`ZMW ${parseInt(criteria.maxPrice).toLocaleString()}`);
      formatted.push(priceRange.join(' '));
    }

    if (criteria.minBeds) {
      formatted.push(`${criteria.minBeds}+ beds`);
    }

    if (criteria.minBaths) {
      formatted.push(`${criteria.minBaths}+ baths`);
    }

    return formatted;
  };

  // Toggle notifications for a saved search
  const toggleNotifications = (id: string) => {
    setSavedSearches(prev =>
      prev.map(search =>
        search.id === id
          ? { ...search, notifications: !search.notifications }
          : search
      )
    );

    toast({
      title: "Notification settings updated",
      description: "Your search notification preferences have been saved.",
      duration: 3000,
    });
  };

  // Delete a saved search
  const deleteSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id));
    setDeleteConfirmId(null);

    toast({
      title: "Search deleted",
      description: "Your saved search has been removed.",
      duration: 3000,
    });
  };

  // Update a saved search
  const updateSearch = () => {
    if (!editingSearch || !searchName.trim()) return;

    setSavedSearches(prev =>
      prev.map(search =>
        search.id === editingSearch.id
          ? { ...search, name: searchName.trim() }
          : search
      )
    );

    setEditingSearch(null);
    setSearchName('');
    setIsDialogOpen(false);

    toast({
      title: "Search updated",
      description: "Your saved search has been updated successfully.",
      duration: 3000,
    });
  };

  // Save current search (would be called from the property listing page)
  const saveCurrentSearch = (criteria: SearchCriteria, name: string) => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: name.trim(),
      criteria,
      notifications: true,
      createdAt: new Date().toISOString(),
    };

    setSavedSearches(prev => [...prev, newSearch]);

    toast({
      title: "Search saved",
      description: "Your search criteria have been saved. You'll receive notifications for new matching properties.",
      duration: 3000,
    });
  };

  // Execute a saved search
  const executeSearch = (criteria: SearchCriteria) => {
    // In a real implementation, this would navigate to the search results page with the criteria
    console.log('Executing search with criteria:', criteria);
    window.location.href = `/listings?${new URLSearchParams(criteria as Record<string, string>).toString()}`;
  };

  // Demo function to add example saved searches
  const addExampleSearches = () => {
    const exampleSearches: SavedSearch[] = [
      {
        id: '1',
        name: 'Luxury Homes in Lusaka',
        criteria: {
          propertyType: 'House',
          location: 'Lusaka',
          minPrice: '500000',
          minBeds: '4',
          minBaths: '3',
        },
        notifications: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Affordable Apartments',
        criteria: {
          propertyType: 'Apartment',
          maxPrice: '200000',
          minBeds: '2',
        },
        notifications: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Commercial Properties',
        criteria: {
          propertyType: 'Commercial',
          location: 'Kitwe',
        },
        notifications: true,
        createdAt: new Date().toISOString(),
      },
    ];

    setSavedSearches(exampleSearches);

    toast({
      title: "Example searches added",
      description: "Example saved searches have been added for demonstration.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Saved Searches</h2>
          <p className="text-muted-foreground">
            Manage your saved property searches and notifications
          </p>
        </div>

        {savedSearches.length === 0 && !isLoading && (
          <Button onClick={addExampleSearches} variant="outline">
            Add Example Searches
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : savedSearches.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-blue-50 p-4 mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No saved searches yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Save your property search criteria to get notified when new properties match your requirements.
            </p>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Your First Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedSearches.map((search) => (
            <Card key={search.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{search.name}</CardTitle>
                    <CardDescription>
                      Saved on {new Date(search.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-blue-600"
                      onClick={() => {
                        setEditingSearch(search);
                        setSearchName(search.name);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-red-600"
                      onClick={() => setDeleteConfirmId(search.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2 mb-4">
                  {formatCriteria(search.criteria).map((criterion, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700">
                      {criterion}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${search.notifications ? 'text-blue-600' : 'text-slate-500'}`}
                  onClick={() => toggleNotifications(search.id)}
                >
                  {search.notifications ? (
                    <>
                      <Bell className="h-4 w-4" />
                      <span className="hidden sm:inline">Notifications On</span>
                      <span className="sm:hidden">On</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="h-4 w-4" />
                      <span className="hidden sm:inline">Notifications Off</span>
                      <span className="sm:hidden">Off</span>
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => executeSearch(search.criteria)}
                >
                  <Search className="h-4 w-4" />
                  View Results
                </Button>
              </CardFooter>

              {/* Delete Confirmation */}
              {deleteConfirmId === search.id && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4 rounded-lg border border-red-200">
                  <div className="text-center space-y-4 max-w-xs">
                    <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Delete this saved search?</h3>
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone. You will no longer receive notifications for this search.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirmId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSearch(search.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Edit Search Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Saved Search</DialogTitle>
            <DialogDescription>
              Update the name of your saved search.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter search name"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateSearch} disabled={!searchName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
