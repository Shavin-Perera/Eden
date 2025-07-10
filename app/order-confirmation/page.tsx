import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"
import Link from "next/link"

export default function OrderConfirmationPage() {
  const orderNumber = "EDEN" + Math.random().toString(36).substr(2, 9).toUpperCase()

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
                    <span className="font-medium">Payment Method:</span> Credit Card ending in 3456
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-amber-600 mx-auto mb-4" />
              <h3 className="font-medium mb-2">Confirmation Email</h3>
              <p className="text-sm text-gray-600">We've sent a confirmation email with your order details.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-amber-600 mx-auto mb-4" />
              <h3 className="font-medium mb-2">Processing</h3>
              <p className="text-sm text-gray-600">Your order is being prepared for shipment.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-8 w-8 text-amber-600 mx-auto mb-4" />
              <h3 className="font-medium mb-2">Shipping</h3>
              <p className="text-sm text-gray-600">You'll receive tracking information once shipped.</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <Link href="/products">
            <Button className="bg-black hover:bg-gray-800 px-8 py-3 mr-4">CONTINUE SHOPPING</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="px-8 py-3 bg-transparent">
              CONTACT SUPPORT
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
