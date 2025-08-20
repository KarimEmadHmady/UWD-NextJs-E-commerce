// src/components/cart/CartSummary/CartSummary.tsx 

"use client"

import { Button } from "@/components/common/Button/Button"
import { Input } from "@/components/common/input/input"
import { useState } from "react"
import { Tag, ArrowRight } from "lucide-react"

interface CartSummaryProps {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  onCheckout: () => void
}

import { useSelector } from 'react-redux'
import { selectSessionRedeemedRewards } from '@/redux/features/loyalty/loyaltySelectors'

export default function CartSummary({ subtotal, shipping, tax, discount, total, onCheckout }: CartSummaryProps) {
  // Use session-only rewards for current order calculations
  const redeemed = useSelector(selectSessionRedeemedRewards)
  const rawDiscount = redeemed
    .filter(r => r.type === 'discount')
    .reduce((sum, r) => {
      const treatAsPercent = typeof r.isPercent === 'boolean' ? r.isPercent : (r.id === 'discount10' || r.id === 'discount25')
      const val = treatAsPercent ? ((r.value || 0) / 100) * subtotal : (r.value || 0)
      return sum + val
    }, 0)
  const loyaltyDiscount = rawDiscount // no cap per user request
  const hasFreeShipping = redeemed.some(r => r.type === 'freeShipping')
  const effectiveShipping = hasFreeShipping ? 0 : shipping
  const computedTotal = Math.max(0, subtotal - loyaltyDiscount) + tax + effectiveShipping
  const [promoCode, setPromoCode] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const formatPrice = (price: number) => {
    return `E.L ${price.toFixed(2)}`
  }

  const handleApplyPromo = async () => {
    setIsApplyingPromo(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsApplyingPromo(false)
    // Handle promo code logic here
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

      {/* Promo Code */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" />
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleApplyPromo}
            disabled={!promoCode || isApplyingPromo}
            className="px-4 bg-transparent cursor-pointer"
          >
            {isApplyingPromo ? "Applying..." : "Apply"}
          </Button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{effectiveShipping === 0 ? "Free" : formatPrice(effectiveShipping)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        {(discount > 0 || loyaltyDiscount > 0) && (
          <>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount (Loyalty)</span>
                <span>-{formatPrice(loyaltyDiscount)}</span>
              </div>
            )}
          </>
        )}
        <hr className="border-gray-200" />
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(computedTotal)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button onClick={onCheckout} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg cursor-pointer">
        Proceed to Checkout
        <ArrowRight className="w-5 h-5 ml-2 cursor-pointer" />
      </Button>

      {/* Security Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">🔒 Secure checkout with SSL encryption</p>
      </div>
    </div>
  )
}
