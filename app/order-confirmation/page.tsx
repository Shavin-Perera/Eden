"use client"

import { useEffect, useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState("")

  useEffect(() => {
    const orderNum = searchParams.get('orderNumber')
    if (orderNum) {
      setOrderNumber(orderNum)
    } else {
      // Fallback to generated order number if not provided
      setOrderNumber("EDEN" + Math.random().toString(36).substr(2, 9).toUpperCase())
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl font-light tracking-wide mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">Thank you for your purchase. Your order has been received.</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-medium mb-4">Order Details</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Order Number:</span> {orderNumber}
                  </p>
                  <p>
                    <span className="font-medium">Order Date:</span> {new Date().toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Payment Method:</span> Credit Card
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> <span className="text-green-600">Confirmed</span>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-medium mb-4">Shipping Address</h2>
                <div className="text-gray-600">
                  <p>John Doe</p>
                  <p>123 Main Street</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Timeline */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-medium mb-6">Order Timeline</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Order Confirmed</h3>
                  <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
                  <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-400">Processing</h3>
                  <p className="text-sm text-gray-500">Your order is being prepared for shipment</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Truck className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-400">Shipped</h3>
                  <p className="text-sm text-gray-500">Your order will be shipped within 1-2 business days</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-400">Delivered</h3>
                  <p className="text-sm text-gray-500">Estimated delivery: 5-7 business days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-light tracking-wide mb-4">What's Next?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              You'll receive an email confirmation with your order details and tracking information. 
              Our team will process your order and ship it within 1-2 business days.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-black hover:bg-gray-800 px-8 py-3">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 py-3">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
