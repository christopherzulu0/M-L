"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Video } from "lucide-react"

interface VirtualTourModalProps {
  isOpen: boolean
  onClose: () => void
  tourUrl: string
  propertyTitle: string
}

export default function VirtualTourModal({ isOpen, onClose, tourUrl, propertyTitle }: VirtualTourModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        setError("Error attempting to enable fullscreen mode: " + err.message);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }

  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
  }

  const handleIframeError = () => {
    setIsLoading(false);
    setError("Failed to load virtual tour. Please try again later.");
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div>
            <DialogTitle className="text-xl font-bold">Virtual Tour</DialogTitle>
            <DialogDescription className="text-blue-100">
              {propertyTitle}
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative w-full" style={{ height: "calc(90vh - 80px)" }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading virtual tour...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center text-center max-w-md p-6">
                <div className="rounded-full bg-red-100 p-4 mb-4">
                  <Video className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Virtual Tour Unavailable</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>
          )}

          <iframe
            src={tourUrl}
            className="w-full h-full border-0"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={`Virtual tour of ${propertyTitle}`}
          />
        </div>

        <div className="p-2 bg-gray-100 border-t flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <RotateCcw className="h-4 w-4" />
            Reset View
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <ZoomIn className="h-4 w-4" />
            Zoom In
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <ZoomOut className="h-4 w-4" />
            Zoom Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
