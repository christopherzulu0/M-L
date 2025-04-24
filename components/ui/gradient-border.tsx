import type React from "react"

interface GradientBorderProps {
  children: React.ReactNode
  className?: string
}

export function GradientBorder({ children, className = "" }: GradientBorderProps) {
  return (
    <div className={`relative rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 p-[1px] ${className}`}>
      <div className="relative rounded-xl bg-white dark:bg-gray-950">{children}</div>
    </div>
  )
}
