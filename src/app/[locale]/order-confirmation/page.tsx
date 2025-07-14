"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Package, Truck, MapPin, Calendar, Download, Share2, ArrowRight } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card"
import { Badge } from "@/components/common/Badge/Badge"

export default function OrderConfirmationPage() {
  const router = useRouter()
  const [orderNumber] = useState("ORD-2024-001234")
  const [estimatedDelivery] = useState("March 15, 2024")

  const orderItems = [
    {
      id: 1,
      name: "MacBook Pro M3 14-inch",
      price: 1999.99,
      quantity: 1,
      image: "https://eljokerstores.com/wp-content/uploads/2023/09/Untitled_design-removebg-preview-1.png",
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max",
      price: 1199.99,
      quantity: 2,
      image: "https://vlegko.ru/upload/iblock/900/a4ay7kyvxsv47178yp7ivr1114wbkm5u/225c56ea-5217-11ee-88d4-24418cd4ee54_adef5cda-521f-11ee-88d4-24418cd4ee54.jpg",
    },
  ]

  const orderSummary = {
    subtotal: 4399.97,
    shipping: 0,
    tax: 351.99,
    total: 4751.96,
  }

  const formatPrice = (price: number) => {
    return `E.L ${price.toFixed(2)}`
  }

  useEffect(() => {
    // Simulate order processing
    const timer = setTimeout(() => {
      // Order confirmed
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-4">Thank you for your purchase. Your order has been received.</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>Order #{orderNumber}</span>
            <span>•</span>
            <span>Estimated delivery: {estimatedDelivery}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Order Confirmed</h3>
                      <p className="text-sm text-gray-600">We've received your order and are processing it</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Order placed: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>Expected delivery: {estimatedDelivery}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Delivering to: 123 Main Street, New York, NY 10001</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-contain bg-gray-50 rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => router.push("/account/orders")} className="flex-1 text-black  hover:bg-gray-50 border-[1px] border-gray-200 cursor-pointer border-inputborder-input">
                <Package className="w-4 h-4 mr-2 text-black" />
                Track Order
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share Order
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{orderSummary.shipping === 0 ? "Free" : formatPrice(orderSummary.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatPrice(orderSummary.tax)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span>You'll receive an email confirmation shortly</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span>We'll notify you when your order ships</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span>Track your package in real-time</span>
                    </div>
                  </div>
                </div>

                <Button onClick={() => router.push("/shop")} className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
