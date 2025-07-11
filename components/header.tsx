"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, ShoppingBag, Heart, User } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { CartSheet } from "@/components/cart-sheet"
import { AuthDialog } from "@/components/auth-dialog"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

function HeaderContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const { items } = useCart()
  const { user, signOut } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  // Improved helper function to determine if link is active
  const isActive = (href: string) => {
    if (href === "/") return pathname === href
    if (href === "/contact") return pathname === href
    
    // For product category links
    if (href.includes("category=")) {
      const category = new URLSearchParams(href.split("?")[1]).get("category")
      const currentCategory = searchParams.get("category")
      return currentCategory === category
    }
    
    // For general products page (only active when no category is selected)
    if (href === "/products") {
      return pathname === "/products" && !searchParams.get("category")
    }
    
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                <Menu className="h-5 w-5 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-white/95">
              <div className="flex flex-col space-y-6 mt-10">
                {[
                  { href: "/products", label: "All Perfumes" },
                  { href: "/products?category=women", label: "Women" },
                  { href: "/products?category=men", label: "Men" },
                  { href: "/products?category=unisex", label: "Unisex" },
                  { href: "/contact", label: "Contact" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg font-medium py-2 px-4 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? "bg-amber-50 text-amber-900 border-l-4 border-amber-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-3xl font-serif tracking-widest text-gray-900 hover:text-amber-800 transition-colors">
            ÉDEN
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { href: "/products", label: "ALL PERFUMES" },
              { href: "/products?category=women", label: "WOMEN" },
              { href: "/products?category=men", label: "MEN" },
              { href: "/products?category=unisex", label: "UNISEX" },
              { href: "/contact", label: "CONTACT" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-xs font-medium tracking-wider transition-all relative group ${
                  isActive(link.href) ? "text-amber-800" : "text-gray-700 hover:text-amber-600"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-amber-600 rounded-full"></span>
                )}
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-amber-600 rounded-full transition-all duration-300 ${
                  isActive(link.href) ? "w-6" : "w-0 group-hover:w-6"
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:bg-gray-50 text-gray-700"
              >
                <Search className="h-5 w-5" />
              </Button>

              {isSearchOpen && (
                <div className="fixed sm:absolute left-0 sm:left-auto sm:right-0 top-16 sm:top-full w-full sm:w-80 px-4 sm:px-0 sm:mt-2 z-50">
                  <div className="bg-white border border-gray-100 shadow-xl rounded-lg p-4 mx-auto max-w-7xl sm:mx-0">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full">
                      <Input
                        type="text"
                        placeholder="Search our collection..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 min-w-0 border-gray-200 focus:border-amber-300"
                        autoFocus
                      />
                      <Button 
                        type="submit" 
                        size="sm" 
                        className="bg-amber-700 hover:bg-amber-800 text-white whitespace-nowrap"
                      >
                        Search
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            <Button variant="ghost" size="sm" className="hover:bg-gray-50 text-gray-700">
              <Heart className="h-5 w-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="relative hover:bg-gray-50 text-gray-700" 
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-amber-700 hover:bg-amber-800">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {user ? (
              <div className="flex items-center space-x-2 ml-2">
                <span className="text-sm hidden sm:block text-gray-700">Welcome, {user.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="hover:bg-gray-50 text-gray-700"
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAuthOpen(true)}
                className="hover:bg-gray-50 text-gray-700"
              >
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </header>
  )
}

export function Header() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="text-3xl font-serif tracking-widest text-gray-900">ÉDEN</div>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  )
}