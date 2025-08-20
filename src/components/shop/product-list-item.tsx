"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, Star, Eye, X } from "lucide-react"
import { Button } from "../common/Button/Button"
import { Badge } from "../common/Badge/Badge"
import { useWishlist } from "@/hooks/useWishlist"
import { useNotifications } from '@/hooks/useNotifications';
import { useCart } from '@/hooks/useCart';
import { CartProduct } from "@/types/product"
import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '../product/product-data';

interface ProductListItemProps {
  product: Product
}

export default function ProductListItem({ product }: ProductListItemProps) {
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlist()
  const isWishlisted = wishlistItems.some((item) => item.id === product.id)
  const { notify } = useNotifications();
  const { addItem } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(true);

  const handleWishlist = () => {
    const wishlistProduct: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: [product.image || '', ...(product.gallery || [])],
      category: product.categories?.[0].name || 'General',
      rating: product.rating,
      stock: product.inStock ? 10 : 0,
      brand: "Brand",
      tags: product.categories?.map((category) => category.name) || [],
    }
    if (isWishlisted) {
      removeWishlist(product.id)
      notify('success', 'Removed from wishlist')
    } else {
      addWishlist(wishlistProduct)
      notify('success', 'Added to wishlist')
    }
  }

  const handleAddToCart = () => {
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: [product.image || '', ...(product.gallery || [])],
      category: product.categories?.[0].name || 'General',
      rating: product.rating,
      stock: product.inStock ? 10 : 0,
      brand: 'Brand',
      tags: product.categories?.map((category) => category.name) || [],
        };
    addItem(cartProduct, 1);
    // Notification is handled by useCart hook
  };

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
    <>
      {/* Modal Quick View */}
      <AnimatePresence>
      {isQuickViewOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              onClick={() => setIsQuickViewOpen(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-40 h-40 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-2" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 cursor-pointer"
                  onClick={() => {
                    handleAddToCart();
                    setIsQuickViewOpen(false);
                  }}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <div className={`flex gap-4 p-4 rounded-lg hover:shadow-md transition-shadow bg-white border
        ${isWishlisted ? "border-red-400 ring-2 ring-red-300 bg-red-50/40" : "border-gray-200"}
      `}>
        {/* Product Image */}
        <div className="relative w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
          {isImgLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
              <div className="w-10 h-10 rounded-full border-4 border-b-2 border-gray-300 animate-spin" />
            </div>
          )}
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            onLoadingComplete={() => setIsImgLoading(false)}
            onError={() => setIsImgLoading(false)}
            style={isImgLoading ? { visibility: 'hidden' } : {}}
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
            {product.isSale && product.discount && (
              <Badge className="bg-red-500 text-white text-xs">-{product.discount}%</Badge>)}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
                              <p className="text-sm text-gray-500 mb-1">{product.categories?.[0].name || 'General'}</p>
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
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="cursor-pointer flex items-center justify-center" onClick={() => setIsQuickViewOpen(true)}>
                <Eye className="w-5 h-5 md:mr-1" />
                <span className="hidden md:inline">Quick View</span>
              </Button>
              {product.inStock ? (
                <Button size="sm" className="bg-red-600 hover:bg-red-700 cursor-pointer flex items-center justify-center" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 md:mr-1" />
                  <span className="hidden md:inline">Add to Cart</span>
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
    </>
  )
}
