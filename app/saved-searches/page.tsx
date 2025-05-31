"use client"

import React from 'react'
import SavedSearches from '@/components/SavedSearches'
import { SectionHeader } from '@/components/ui/section-header'

export default function SavedSearchesPage() {
  return (
    <main className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <SectionHeader
          title="Your Saved Searches"
          subtitle="Manage your saved property searches and get notified about new matching properties"
        />
        <div className="mt-8">
          <SavedSearches />
        </div>
      </div>
    </main>
  )
}
