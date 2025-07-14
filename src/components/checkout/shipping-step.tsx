"use client"

import type React from "react"

import { useState } from "react"
import { Truck, Clock, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/common/card/card"
import { RadioGroup, RadioGroupItem } from "@/components/common/radio-group/radio-group"
import { Label } from "@/components/common/label/label"

interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  icon: React.ReactNode
}

interface ShippingStepProps {
  onShippingSelect: (option: ShippingOption) => void
}

export default function ShippingStep({ onShippingSelect }: ShippingStepProps) {
  const [selectedShipping, setSelectedShipping] = useState<string>("")

  const shippingOptions: ShippingOption[] = [
    {
      id: "standard",
      name: "Standard Shipping",
      description: "Regular delivery service",
      price: 0,
      estimatedDays: "5-7 business days",
      icon: <Truck className="w-5 h-5 text-gray-600" />,
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "Faster delivery service",
      price: 15.99,
      estimatedDays: "2-3 business days",
      icon: <Clock className="w-5 h-5 text-blue-600" />,
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      description: "Next day delivery",
      price: 29.99,
      estimatedDays: "1 business day",
      icon: <Shield className="w-5 h-5 text-green-600" />,
    },
  ]

  const handleShippingChange = (value: string) => {
    setSelectedShipping(value)
    const option = shippingOptions.find((opt) => opt.id === value)
    if (option) {
      onShippingSelect(option)
    }
  }

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `EGP ${price.toFixed(2)}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Shipping Method</h2>
        <p className="text-gray-600">Select your preferred delivery option</p>
      </div>

      <RadioGroup value={selectedShipping} onValueChange={handleShippingChange} className="space-y-4">
        {shippingOptions.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all ${
              selectedShipping === option.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <RadioGroupItem value={option.id} id={option.id} />
                <div className="flex-1">
                  <Label htmlFor={option.id} className="cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {option.icon}
                        <div>
                          <h3 className="font-semibold text-gray-900">{option.name}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                          <p className="text-sm text-gray-500">{option.estimatedDays}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-gray-900">{formatPrice(option.price)}</span>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
    </div>
  )
}
