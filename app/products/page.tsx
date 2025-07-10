"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingBag, Star } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { useSearchParams } from "next/navigation"

const products = [
  {
    id: 1,
    name: "Eden Noir",
    category: "unisex",
    price: 285,
    originalPrice: 320,
    image: "/noir-perfume.jpg",
    rating: 4.8,
    reviews: 124,
    isNew: true,
    description: "A mysterious blend of dark woods, black truffle, and exotic spices",
  },
  {
    id: 2,
    name: "Rose Éternelle",
    category: "women",
    price: 245,
    image: "/rose-perfume.jpg",
    rating: 4.9,
    reviews: 89,
    isBestseller: true,
    description: "Timeless elegance with Bulgarian rose, white musk, and vanilla absolute",
  },
  {
    id: 3,
    name: "Gentleman's Reserve",
    category: "men",
    price: 195,
    image: "/mens-perfume.jpg",
    rating: 4.7,
    reviews: 156,
    description: "Sophisticated blend of aged leather, Cuban tobacco, and Himalayan cedar",
  },
  {
    id: 4,
    name: "Mystic Garden",
    category: "unisex",
    price: 265,
    image: "/unisex-perfume.jpg",
    rating: 4.8,
    reviews: 92,
    isLimited: true,
    description: "Enchanting night-blooming florals with hints of green tea and bamboo",
  },
  {
    id: 5,
    name: "Velvet Dreams",
    category: "women",
    price: 225,
    image: "/velvet-perfume.jpg",
    rating: 4.6,
    reviews: 78,
    description: "Luxurious Tahitian vanilla and cashmere with soft peony petals",
  },
  {
    id: 6,
    name: "Urban Legend",
    category: "men",
    price: 175,
    image: "/urban-perfume.jpg",
    rating: 4.5,
    reviews: 134,
    description: "Modern bergamot with smoked vetiver and industrial steel accord",
  },
]

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [sortBy, setSortBy] = useState("featured")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const { addItem } = useCart()
  const searchParams = useSearchParams()

  const categoryParam = searchParams.get("category") || "all"
  const searchQueryParam = searchParams.get("search") || ""

  useEffect(() => {
    if (categoryParam !== categoryFilter) {
      setCategoryFilter(categoryParam)
    }

    let filtered = products

    if (searchQueryParam) {
      const q = searchQueryParam.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }

    if (categoryParam !== "all") {
      filtered = filtered.filter((p) => p.category === categoryParam)
    }

    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }, [categoryFilter, sortBy, categoryParam, searchQueryParam])

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  const getCollectionTitle = () => {
    if (searchQueryParam) {
      return `Search Results for "${searchQueryParam}"`
    }
    switch (categoryFilter) {
      case "women": return "For Her"
      case "men": return "For Him"
      case "unisex": return "Unisex"
      default: return "Signature Collection"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wider mb-4">
            {getCollectionTitle()}
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-6" />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
            Discover our curated selection of artisanal fragrances
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="border-gray-200">
                <SelectItem value="all" className="hover:bg-amber-50">All Collections</SelectItem>
                <SelectItem value="women" className="hover:bg-amber-50">For Her</SelectItem>
                <SelectItem value="men" className="hover:bg-amber-50">For Him</SelectItem>
                <SelectItem value="unisex" className="hover:bg-amber-50">Unisex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-light">{filteredProducts.length} luxury scents</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="border-gray-200">
                <SelectItem value="featured" className="hover:bg-amber-50">Featured</SelectItem>
                <SelectItem value="newest" className="hover:bg-amber-50">New Arrivals</SelectItem>
                <SelectItem value="price-low" className="hover:bg-amber-50">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="hover:bg-amber-50">Price: High to Low</SelectItem>
                <SelectItem value="rating" className="hover:bg-amber-50">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer border border-gray-100 hover:shadow-xl transition-all duration-500"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10"></div>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={400}
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    {product.isNew && (
                      <Badge className="bg-green-600/90 hover:bg-green-600/100 font-light tracking-wider shadow-md">
                        NEW
                      </Badge>
                    )}
                    {product.isBestseller && (
                      <Badge className="bg-amber-600/90 hover:bg-amber-600/100 font-light tracking-wider shadow-md">
                        BESTSELLER
                      </Badge>
                    )}
                    {product.isLimited && (
                      <Badge className="bg-red-600/90 hover:bg-red-600/100 font-light tracking-wider shadow-md">
                        LIMITED
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 z-20">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <Button
                      size="sm"
                      className="bg-black/90 hover:bg-black text-white px-4 py-2 rounded-full shadow-lg font-light tracking-wider flex items-center"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      ADD TO CART
                    </Button>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2 font-light">({product.reviews})</span>
                  </div>
                  <h3 className="text-xl font-serif font-light mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 uppercase tracking-wider font-light">{product.category}</p>
                  <p className="text-gray-500 text-sm mb-4 font-light leading-relaxed">{product.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-light">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-400 line-through font-light">${product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-light">No fragrances found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-6 border-black text-black hover:bg-black hover:text-white px-8 py-3 tracking-wider font-light"
              onClick={() => {
                setCategoryFilter("all")
                setSortBy("featured")
              }}
            >
              VIEW ALL FRAGRANCES
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}