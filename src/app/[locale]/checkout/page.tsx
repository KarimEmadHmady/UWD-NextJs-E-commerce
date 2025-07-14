"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Truck, CreditCard, CheckCircle } from "lucide-react"
import LocationStep from "@/components/checkout/location-step"
import ShippingStep from "@/components/checkout/shipping-step"
import { Button } from "@/components/common/Button/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card/card"
import { Input } from "@/components/common/input/input"
import { Label } from "@/components/common/label/label"

interface LocationData {
  latitude: number
  longitude: number
  address: string
  city: string
  country: string
}

interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [location, setLocation] = useState<LocationData | null>({
    latitude: 30.0444,
    longitude: 31.2357,
    address: "123 Business Street",
    city: "cairo",
    country: "Egypt"
  })
  const [shippingOption, setShippingOption] = useState<ShippingOption | null>(null)

  // Mock order data
  const orderSummary = {
    subtotal: 3449.97,
    tax: 275.99,
    shipping: shippingOption?.price || 0,
    total: 3449.97 + 275.99 + (shippingOption?.price || 0),
  }

  const formatPrice = (price: number) => {
    return `E.L ${price.toFixed(2)}`
  }

  const steps = [
    { number: 1, title: "Location", icon: MapPin, completed: !!location },
    { number: 2, title: "Shipping", icon: Truck, completed: !!shippingOption },
    { number: 3, title: "Payment", icon: CreditCard, completed: false },
    { number: 4, title: "Review", icon: CheckCircle, completed: false },
  ]

  const handleLocationSet = (locationData: LocationData) => {
    setLocation(locationData)
    setCurrentStep(2)
  }

  const handleShippingSelect = (option: ShippingOption) => {
    setShippingOption(option)
    setCurrentStep(3)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <LocationStep onLocationSet={handleLocationSet} />
      case 2:
        return <ShippingStep onShippingSelect={handleShippingSelect} />
      case 3:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <CreditCard className="w-16 h-16 text-pink-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h2>
              <p className="text-gray-600">Enter your payment details to complete the order</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
                <Button onClick={() => setCurrentStep(4)} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                  Continue to Review
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      case 4:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Order</h2>
              <p className="text-gray-600">Please review your order details before placing the order</p>
            </div>

            {/* Order Review */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-900">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping ({shippingOption?.name})</span>
                    <span>{formatPrice(orderSummary.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(orderSummary.tax)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/order-confirmation")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Complete your purchase</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Steps */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Checkout Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.number}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        currentStep === step.number
                          ? "bg-pink-50 border border-pink-200"
                          : step.completed
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep === step.number
                            ? "bg-pink-600 text-white"
                            : step.completed
                              ? "bg-green-600 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {step.completed ? "✓" : step.number}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            currentStep === step.number
                              ? "text-pink-900"
                              : step.completed
                                ? "text-green-900"
                                : "text-gray-600"
                          }`}
                        >
                          {step.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-gray-900">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Total</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(orderSummary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatPrice(orderSummary.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(orderSummary.tax)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(orderSummary.total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step Content */}
          <div className="lg:col-span-3">{renderStepContent()}</div>
        </div>
      </div>
    </div>
  )
}
