"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Eye, Plus } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Badge } from "@/components/common/Badge/Badge"
import { useCart } from "@/hooks/useCart"
import { toast } from "sonner"
import type { Product } from "../product-data"
import { convertToCartProduct } from "../product-data"

interface ShopProductCardProps {
  product: Product
  onToggleWishlist: (id: number) => void
  isInWishlist: boolean
}

export default function ShopProductCard({ product, onToggleWishlist, isInWishlist }: ShopProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    
    try {
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
    } catch (error) {
      toast.error("Failed to add to cart")
    }
    
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-green-500 text-white">New</Badge>
          )}
          {product.isSale && product.discount && (
            <Badge className="bg-red-500 text-white">-{product.discount}%</Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 shadow-lg"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleWishlist(product.id)
            }}
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 shadow-lg"
          >
            <Eye className="w-5 h-5 text-gray-600" />
          </Button>
        </div>

        {/* Add to Cart */}
        {product.inStock && (
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              className="w-full bg-white/90 hover:bg-white text-black shadow-lg backdrop-blur-sm"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? "Added!" : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <p className="text-sm text-gray-500">{product.category}</p>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              E.L {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                E.L {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-600">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
