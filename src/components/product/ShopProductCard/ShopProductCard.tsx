"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Eye, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Badge } from "@/components/common/Badge/Badge"
import { useCart } from "@/hooks/useCart"
import { useNotifications } from '@/hooks/useNotifications';
import type { Product } from "../product-data"
import { convertToCartProduct } from "../product-data"
import { useWishlist } from "@/hooks/useWishlist"
import { Product as GlobalProduct } from "@/types/common"

interface ShopProductCardProps {
  product: Product
}

export default function ShopProductCard({ product }: ShopProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlist()
  const isInWishlist = wishlistItems.some((item) => item.id === product.id)
  const { notify } = useNotifications();
  const handleWishlist = (e: React.MouseEvent) => {
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
    if (isInWishlist) {
      removeWishlist(product.id)
      notify('success', 'Removed from wishlist')
    } else {
      addWishlist(wishlistProduct)
      notify('success', 'Added to wishlist')
    }
  }

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
      notify('success', 'Added to cart successfully!')
    } catch (error) {
      notify('error', 'Failed to add to cart')
    }
    
    setTimeout(() => setIsAdding(false), 1000)
  }

  const [isImgLoading, setIsImgLoading] = useState(true);

  return (
    <Link
      href={`/product/${product.id}`} 
      className={`group relative bg-white shadow-sm rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        isInWishlist
          ? "lg:border-red-400 lg:ring-2 lg:ring-red-300 lg:bg-red-50/40"
          : "lg:border-gray-200"
      }`}
          >
<div className="relative aspect-square bg-gray-50 overflow-hidden rounded-t-[10px] rounded-b-none">
{isImgLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse z-10">
            <div className="w-10 h-10 rounded-full border-4 border-b-2 border-gray-300 animate-spin" />
          </div>
        )}
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          onLoadingComplete={() => setIsImgLoading(false)}
          onError={() => setIsImgLoading(false)}
          style={isImgLoading ? { visibility: 'hidden' } : {}}
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
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="w-8 h-8 sm:w-10  sm:h-10 rounded-full bg-white hover:bg-gray-50 shadow-lg"
            onClick={handleWishlist}
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-gray-50 shadow-lg"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </Button>
        </div>

        {/* Add to Cart - Icon Only on Mobile */}
        {product.inStock && (
          <button
            className="absolute bottom-2 right-3.5 z-20 bg-teal-600 text-white rounded-full p-[8px] shadow-lg sm:hidden cursor-pointer"
            onClick={handleAddToCart}
            disabled={isAdding}
            aria-label="Add to Cart"
            type="button"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}

        {/* Add to Cart - Full Button on Desktop */}
        {product.inStock && (
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 hidden sm:block opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            <Button
              className="w-full bg-white/90 hover:bg-white text-black shadow-lg backdrop-blur-sm text-xs sm:text-base py-2 sm:py-3"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? "Added!" : (
                <>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
          <p className="text-xs sm:text-sm text-gray-500">{product.category}</p>
          <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-300 text-[10px] sm:text-sm mt-[5px] ">
            {product.name}
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between ">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[10px] sm:text-base text-gray-900">
              E.L{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                E.L{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="flex items-center mt-1 sm:mt-0 ">
            <span className="text-yellow-400 text-xs sm:text-lg">
              <svg className="inline w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            </span>
            <span className="ml-1 text-xs sm:text-sm text-gray-600">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
