"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { Button } from "../common/Button/Button"
import { Badge } from "../common/Badge/Badge"
import { useWishlist } from "@/hooks/useWishlist"
import { Product as GlobalProduct } from "@/types/common"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  description: string
  isNew?: boolean
  isSale?: boolean
  discount?: number
  inStock: boolean
}

interface ProductListItemProps {
  product: Product
}

export default function ProductListItem({ product }: ProductListItemProps) {
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlist()
  const isWishlisted = wishlistItems.some((item) => item.id === product.id)
  const handleWishlist = () => {
    const wishlistProduct: GlobalProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: [product.image],
      category: product.category,
      rating: product.rating,
      stock: product.inStock ? 10 : 0,
      brand: "Apple",
      tags: [product.category],
    }
    if (isWishlisted) {
      removeWishlist(product.id)
      toast.success("Removed from wishlist")
    } else {
      addWishlist(wishlistProduct)
      toast.success("Added to wishlist")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className={`flex gap-4 p-4 rounded-lg hover:shadow-md transition-shadow bg-white border
      ${isWishlisted ? "border-red-400 ring-2 ring-red-300 bg-red-50/40" : "border-gray-200"}
    `}>
      {/* Product Image */}
      <div className="relative w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-2" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
          {product.isSale && product.discount && (
            <Badge className="bg-red-500 text-white text-xs">-{product.discount}%</Badge>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{product.name}</h3>
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWishlist}
            className={`p-2 ${isWishlisted ? "text-red-500" : "text-gray-400"} cursor-pointer`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">{renderStars(product.rating)}</div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <Eye className="w-4 h-4 mr-1" />
              Quick View
            </Button>
            {product.inStock ? (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add to Cart
              </Button>
            ) : (
              <Button disabled size="sm" className="bg-gray-100 text-red-600 cursor-pointer">
                Out of Stock
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
