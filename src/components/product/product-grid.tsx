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
import { toast } from "sonner"

export default function ProductGrid() {
  const [wishlist, setWishlist] = useState<number[]>([])
  const { addItem } = useCart()

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => 
      prev.includes(productId) 
        ? prev.filter((id) => id !== productId) 
        : [...prev, productId]
    )
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
        className={`w-4 h-4 ${index < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
                  className={`w-10 h-10 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white hover:bg-gray-50 border border-gray-200 cursor-pointer`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleWishlist(product.id)
                  }}
                >
                  <Heart 
                    className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-black"} cursor-pointer`} 
                  />
                </Button>

                {/* Quick View Button */}
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-10 h-10 rounded-full p-0 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-black cursor-pointer" />
                </Button>
              </div>

              {/* Add to Cart Button */}
              {product.inStock && (
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full bg-white/90 hover:bg-white text-black shadow-lg backdrop-blur-sm"
                  >
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-500 font-medium">{product.category}</p>
              <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-500">({product.reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.isSale && product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
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
