"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Tag } from "lucide-react"

export function CouponBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <Tag className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">
          Use code{" "}
          <Badge variant="secondary" className="mx-2 bg-white text-amber-700">
            EDEN20
          </Badge>
          for 20% off your first order
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
