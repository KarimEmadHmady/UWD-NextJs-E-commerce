"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import type { Product } from "./product-data";
import { products } from "./product-data";
import { Button } from "../common/Button/Button";
import { Badge } from "../common/Badge/Badge";

export default function ProductGrid() {
  const [wishlist, setWishlist] = useState<number[]>([])
  const [cart, setCart] = useState<number[]>([])

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const addToCart = (productId: number) => {
    setCart((prev) => [...prev, productId])
    // يمكن إضافة toast notification هنا
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
                <Badge variant="secondary" className="bg-gray-100 text-red-600 font-medium ">
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
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-black" : "text-black"} cursor-pointer`} />
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
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-white hover:bg-gray-100 text-black rounded-lg py-2 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2 text-black cursor-pointer" />
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              {/* Category */}
              <p className="text-sm text-gray-500 font-medium">{product.category}</p>

              {/* Product Name */}
              <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              {/* Stock Status */}
              {!product.inStock && (
                <div className="pt-2">
                  <Button disabled className="w-full bg-gray-100 text-red-600" variant="secondary">
                    Out of Stock
                  </Button>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <Button
          variant="outline"
          size="lg"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-gray-900 text-gray-900 font-bold text-lg shadow hover:bg-gray-900 hover:text-white transition-all duration-300 group cursor-pointer"
        >
          Load More Products
          <svg className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
