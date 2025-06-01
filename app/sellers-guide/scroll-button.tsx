"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface ScrollButtonProps {
  targetId: string
  children: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

export function ScrollButton({ targetId, children, variant = "ghost", className = "p-0 h-auto text-primary" }: ScrollButtonProps) {
  const handleClick = () => {
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Button variant={variant} className={className} onClick={handleClick}>
      {children}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )
}
