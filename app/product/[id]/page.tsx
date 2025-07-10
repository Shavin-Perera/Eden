"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingBag, Star, Minus, Plus, Share2 } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { useParams } from "next/navigation"

// Mock product data - in a real app, this would come from an API
const productData = {
  1: {
    id: 1,
    name: "Eden Noir",
    category: "Unisex",
    price: 285,
    originalPrice: 320,
    images: [
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
    ],
    rating: 4.8,
    reviews: 124,
    isNew: true,
    description:
      "A mysterious blend of dark woods and exotic spices that captures the essence of midnight gardens. This sophisticated fragrance opens with bergamot and black pepper, evolving into a heart of rose and jasmine, and settling into a base of sandalwood, vanilla, and musk.",
    notes: {
      top: ["Bergamot", "Black Pepper", "Cardamom"],
      middle: ["Rose", "Jasmine", "Violet"],
      base: ["Sandalwood", "Vanilla", "Musk", "Cedar"],
    },
    sizes: [
      { size: "30ml", price: 145 },
      { size: "50ml", price: 225 },
      { size: "100ml", price: 285 },
    ],
  },
}

export default function ProductPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)
  const product = productData[productId as keyof typeof productData]

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("100ml")
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  if (!product) {
    return <div>Product not found</div>
  }

  const selectedSizeData = product.sizes.find((s) => s.size === selectedSize)
  const currentPrice = selectedSizeData?.price || product.price

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: `${product.name} (${selectedSize})`,
      price: currentPrice,
      image: product.images[0],
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? "border-amber-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isNew && <Badge className="bg-green-600">NEW</Badge>}
                <span className="text-sm text-gray-600 uppercase tracking-wide">{product.category}</span>
              </div>
              <h1 className="text-4xl font-light tracking-wide mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-light">${currentPrice}</span>
                {product.originalPrice && currentPrice < product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size.size} value={size.size}>
                        {size.size} - ${size.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-black hover:bg-gray-800 py-3" onClick={handleAddToCart}>
                <ShoppingBag className="h-5 w-5 mr-2" />
                ADD TO CART
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Button variant="outline" className="w-full py-3 bg-transparent">
              BUY NOW
            </Button>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="notes">Fragrance Notes</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Key Features</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Long-lasting 8-12 hour wear</li>
                      <li>• Unisex fragrance suitable for all</li>
                      <li>• Premium quality ingredients</li>
                      <li>• Elegant glass bottle design</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Usage Tips</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Apply to pulse points</li>
                      <li>• Best on clean, moisturized skin</li>
                      <li>• Don't rub after application</li>
                      <li>• Store in cool, dry place</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-8">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-4">Fragrance Pyramid</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-amber-50 p-6 rounded-lg mb-4">
                        <h4 className="font-medium text-amber-800 mb-3">Top Notes</h4>
                        <div className="space-y-2">
                          {product.notes.top.map((note) => (
                            <Badge key={note} variant="secondary" className="bg-amber-100 text-amber-800">
                              {note}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">First impression, lasts 15-30 minutes</p>
                    </div>

                    <div className="text-center">
                      <div className="bg-rose-50 p-6 rounded-lg mb-4">
                        <h4 className="font-medium text-rose-800 mb-3">Middle Notes</h4>
                        <div className="space-y-2">
                          {product.notes.middle.map((note) => (
                            <Badge key={note} variant="secondary" className="bg-rose-100 text-rose-800">
                              {note}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Heart of the fragrance, lasts 2-4 hours</p>
                    </div>

                    <div className="text-center">
                      <div className="bg-gray-50 p-6 rounded-lg mb-4">
                        <h4 className="font-medium text-gray-800 mb-3">Base Notes</h4>
                        <div className="space-y-2">
                          {product.notes.base.map((note) => (
                            <Badge key={note} variant="secondary" className="bg-gray-100 text-gray-800">
                              {note}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Foundation, lasts 6-8 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Customer Reviews</h3>
                  <Button variant="outline">Write a Review</Button>
                </div>

                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="font-medium">Sarah M.</span>
                        <span className="text-sm text-gray-600">Verified Purchase</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        "Absolutely love this fragrance! It's sophisticated yet not overpowering. Perfect for both day
                        and evening wear. The longevity is impressive - I can still smell it on my clothes the next
                        day."
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
