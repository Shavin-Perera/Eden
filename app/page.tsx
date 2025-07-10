import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      name: "Eden Noir",
      category: "Unisex",
      price: 285,
      originalPrice: 320,
      image: "/noir-perfume.jpg",
      rating: 4.8,
      reviews: 124,
      isNew: true,
    },
    {
      id: 2,
      name: "Rose Éternelle",
      category: "Women",
      price: 245,
      image: "/rose-perfume.jpg",
      rating: 4.9,
      reviews: 89,
      isBestseller: true,
    },
    {
      id: 3,
      name: "Gentleman's Reserve",
      category: "Men",
      price: 195,
      image: "/mens-perfume.jpg",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 4,
      name: "Mystic Garden",
      category: "Unisex",
      price: 265,
      image: "/unisex-perfume.jpg",
      rating: 4.8,
      reviews: 92,
      isLimited: true,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-amber-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/gold-texture.png')] bg-repeat opacity-50 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-serif font-light tracking-wider mb-6 animate-fade-in">ÉDEN</h1>
          <p className="text-xl md:text-2xl font-light mb-8 tracking-widest uppercase opacity-90">L'Art de Parfum</p>
          <p className="text-lg mb-12 max-w-2xl mx-auto leading-relaxed opacity-90 font-light">
            Immerse yourself in our exclusive collection of rare fragrances, where each scent tells a story of luxury, craftsmanship, and timeless elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-white px-10 py-6 text-lg tracking-wider font-light border border-amber-600 shadow-lg hover:shadow-xl transition-all">
                DISCOVER OUR SCENTS
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-10 py-6 text-lg tracking-wider font-light bg-transparent shadow-lg hover:shadow-xl transition-all"
              >
                BESPOKE CONSULTATION
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Luxury decorative elements */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-light tracking-wider mb-6">OUR SIGNATURE SCENTS</h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-8" />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
            Curated fragrances that embody the essence of luxury and refinement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
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
                        NOUVEAU
                      </Badge>
                    )}
                    {product.isBestseller && (
                      <Badge className="bg-amber-600/90 hover:bg-amber-600/100 font-light tracking-wider shadow-md">
                        BESTSELLER
                      </Badge>
                    )}
                    {product.isLimited && (
                      <Badge className="bg-red-600/90 hover:bg-red-600/100 font-light tracking-wider shadow-md">
                        LIMITED EDITION
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
                  <p className="text-gray-600 text-sm mb-4 uppercase tracking-wider font-light">{product.category}</p>
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

        <div className="text-center mt-16">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white px-10 py-6 text-lg tracking-wider font-light bg-transparent shadow-md hover:shadow-lg transition-all"
            >
              EXPLORE OUR COLLECTION
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-light tracking-wider mb-6">FIND YOUR SIGNATURE</h2>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/products?category=women" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <div className="relative h-96 overflow-hidden">
                <Image
                  src="/women-perfume-category.jpg"
                  alt="Women's Perfumes"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute bottom-8 left-0 right-0 z-20 text-center">
                <h3 className="text-white text-3xl font-serif font-light tracking-wider mb-2">FOR HER</h3>
                <p className="text-white/90 font-light tracking-wider">Elegance in every drop</p>
              </div>
            </Link>

            <Link href="/products?category=men" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <div className="relative h-96 overflow-hidden">
                <Image
                  src="/men-perfume-category.jpg"
                  alt="Men's Perfumes"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute bottom-8 left-0 right-0 z-20 text-center">
                <h3 className="text-white text-3xl font-serif font-light tracking-wider mb-2">FOR HIM</h3>
                <p className="text-white/90 font-light tracking-wider">Bold and distinctive</p>
              </div>
            </Link>

            <Link href="/products?category=unisex" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <div className="relative h-96 overflow-hidden">
                <Image
                  src="/unisex-perfume-category.jpg"
                  alt="Unisex Perfumes"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute bottom-8 left-0 right-0 z-20 text-center">
                <h3 className="text-white text-3xl font-serif font-light tracking-wider mb-2">UNISEX</h3>
                <p className="text-white/90 font-light tracking-wider">Beyond gender boundaries</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}