"use client"

import React from 'react'
import PropertyMapView from '@/components/PropertyMapView'
import { Metadata } from 'next'
import { SectionHeader } from '@/components/ui/section-header'

export default function PropertyMapPage() {
  return (
    <main className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <SectionHeader
          title="Property Map Explorer"
          subtitle="Find properties by location and explore neighborhoods"
        />
        <PropertyMapView />
      </div>
    </main>
  )
}
