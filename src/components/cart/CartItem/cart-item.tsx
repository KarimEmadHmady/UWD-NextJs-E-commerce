// src/components/cart/CartItem/CartItem.tsx 

"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2, Heart } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import type { CartItem as CartItemType } from '@/types/cart'

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
  onMoveToWishlist: (id: number) => void;
}

export default function CartItemComponent({ item, onUpdateQuantity, onRemove, onMoveToWishlist }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return
    if (!item.key) return // Need key for server operations
    
    setIsUpdating(true)
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call
    onUpdateQuantity(item.key, newQuantity)
    setIsUpdating(false)
  }

  const handleRemove = () => {
    if (!item.key) return // Need key for server operations
    onRemove(item.key)
  }

  const formatPrice = (price: number) => {
    return `E.L ${price.toFixed(2)}`
  }

  return (
    <div className="flex gap-4 p-6 bg-white border border-gray-200 rounded-lg">
      {/* Product Image */}
      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        <Image 
          src={item.images?.[0] || "/placeholder.svg"} 
          alt={item.name} 
          fill 
          className="object-contain p-2" 
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">{item.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Category: {item.category}</span>
              {/* <span>Brand: {item.brand}</span> */}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 cursor-pointer" />
          </Button>
        </div>

        {/* Stock Status */}
        {item.stock <= 0 && <p className="text-red-500 text-sm mb-2">Out of stock</p>}

        {/* Price and Quantity */}
        <div className="flex flex-col lg:flex-row items-center justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">{formatPrice(item.price)}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="px-1 h-6 text-xs lg:px-2 lg:h-8 lg:text-sm cursor-pointer"
              >
                <Minus className="w-4 h-4 cursor-pointer" />
              </Button>

              {<span className="px-2 py-0.5 font-medium min-w-[2rem] text-center text-xs text-gray-900 lg:px-3 lg:py-1 lg:text-sm">
                { item.quantity}
              </span>}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating || item.stock <= item.quantity}
                className="px-1 h-6 text-xs lg:px-2 lg:h-8 lg:text-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 cursor-pointer" />
              </Button>
            </div>

            {/* Move to Wishlist */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMoveToWishlist(item.id)}
              className="flex items-center gap-2 text-[10px] p-[5px] cursor-pointer"
            >
              <Heart className="w-3 h-3 cursor-pointer" />
              Save 
            </Button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="mt-3 text-right">
          <span className="text-lg font-semibold text-gray-900">
            Subtotal: {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
