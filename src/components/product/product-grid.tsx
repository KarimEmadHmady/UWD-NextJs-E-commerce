"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Eye } from "lucide-react"
import type { Product } from "./product-data"
import { products, convertToCartProduct } from "./product-data"
import { Button } from "../common/Button/Button"
import { Badge } from "../common/Badge/Badge"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { Product as GlobalProduct } from "@/types/common"
import { toast } from "sonner"

export default function ProductGrid() {
  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlist()
  const isInWishlist = (id: number) => wishlistItems.some((item) => item.id === id)
  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
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
    if (isInWishlist(product.id)) {
      removeWishlist(product.id)
      toast.success("Removed from wishlist")
    } else {
      addWishlist(wishlistProduct)
      toast.success("Added to wishlist")
    }
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Prevent event bubbling
    
    const commonProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: [product.image],
      category: product.category,
      rating: product.rating,
      stock: product.inStock ? 10 : 0,
      brand: 'Apple',
      tags: [product.category]
    }
    addItem(commonProduct, 1)
    toast.success("Added to cart successfully!")
  }

  const formatPrice = (price: number) => {
    return `E.L ${price.toFixed(2)}`
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${index < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our latest collection of premium Apple products with exclusive deals and offers
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className={`group relative rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1
              bg-white
              ${isInWishlist(product.id)
                ? "border-red-500 ring-2 ring-red-400 bg-red-50/60"
                : "border-gray-100"
              }
            `}
          >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
              {product.isNew && <Badge className="bg-green-500 hover:bg-green-600 text-white font-medium">New</Badge>}
              {product.isSale && product.discount && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white font-medium">-{product.discount}%</Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary" className="bg-gray-100 text-red-600 font-medium">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Product Image */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
              />

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Wishlist Button */}
                <Button
                  size="sm"
                  variant="secondary"
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white hover:bg-gray-50 border border-gray-200 cursor-pointer`}
                  onClick={(e) => handleWishlist(e, product)}
                >
                  <Heart 
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-black"} cursor-pointer`} 
                  />
                </Button>

                {/* Quick View Button */}
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 cursor-pointer"
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-black cursor-pointer" />
                </Button>
              </div>

              {/* Add to Cart Button */}
              {product.inStock && (
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full bg-white/90 hover:bg-white text-black shadow-lg backdrop-blur-sm text-xs sm:text-base py-2 sm:py-3"
                  >
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">{product.category}</p>
              <h3 className="font-semibold text-gray-900 text-xs sm:text-base leading-tight line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-xs sm:text-sm text-gray-500">({product.reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-base text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.isSale && product.originalPrice && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
