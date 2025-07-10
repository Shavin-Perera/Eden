"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { useState } from "react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "EDEN20") {
      setAppliedCoupon("EDEN20")
      setDiscount(total * 0.2)
    } else if (couponCode.toUpperCase() === "WELCOME10") {
      setAppliedCoupon("WELCOME10")
      setDiscount(total * 0.1)
    } else {
      alert("Invalid coupon code")
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setDiscount(0)
    setCouponCode("")
  }

  const finalTotal = total - discount

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-light tracking-wide mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Discover our exclusive collection of premium fragrances</p>
            <Link href="/products">
              <Button className="bg-black hover:bg-gray-800 px-8 py-3">CONTINUE SHOPPING</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-light tracking-wide mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card key={item.id} className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-4">${item.price}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xl font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-medium">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={applyCoupon}>
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <span className="text-green-700">Coupon applied: {appliedCoupon}</span>
                      <Button size="sm" variant="ghost" onClick={removeCoupon}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <Link href="/checkout">
                    <Button className="w-full bg-black hover:bg-gray-800 py-3">PROCEED TO CHECKOUT</Button>
                  </Link>

                  <Link href="/products">
                    <Button variant="outline" className="w-full bg-transparent">
                      CONTINUE SHOPPING
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Coupon Codes Info */}
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Available Coupons</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>EDEN20</span>
                    <span className="text-green-600">20% off</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WELCOME10</span>
                    <span className="text-green-600">10% off</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
