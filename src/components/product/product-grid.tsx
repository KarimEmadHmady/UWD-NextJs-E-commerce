"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Eye } from "lucide-react"
import type { Product } from "./product-data"
import { convertApiProductToUI } from './product-data';
import { Button } from "../common/Button/Button"
import { Badge } from "../common/Badge/Badge"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { CartProduct } from "@/types/product"
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect } from 'react';
import ProductListItem from '../shop/product-list-item';
import { useAllProducts } from '@/hooks/useProducts';
import  Skeleton  from "../common/Skeleton/Skeleton"

export default function ProductGrid() {
  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlist()
  const isInWishlist = (id: number) => wishlistItems.some((item) => item.id === id)
  const { notify } = useNotifications();
  
  // Use API data instead of static data
  const { data: apiProducts, isLoading, error } = useAllProducts();
  
  // Convert API products to UI format
  const products = apiProducts ? apiProducts.map(convertApiProductToUI) : [];

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    const wishlistProduct: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: [product.image || '', ...(product.gallery || [])],
      category: product.categories?.[0]?.name || 'General',
      rating: product.rating,
      stock: product.inStock ? 10 : 0,
      brand: "Brand",
      tags: product.categories?.map((category) => category.name) || [],
        }
    if (isInWishlist(product.id)) {
      removeWishlist(product.id)
      notify('success', 'Removed from wishlist')
    } else {
      addWishlist(wishlistProduct)
      notify('success', 'Added to wishlist')
    }
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Prevent event bubbling
    
    const commonProduct: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
              images: [product.image || '', ...(product.gallery || [])],
        category: product.categories?.[0].name  || 'General',
        rating: product.rating,
        stock: product.inStock ? 10 : 0,
        brand: 'Brand',
        tags: product.categories?.map((category) => category.name) || [],
          }
    addItem(commonProduct, 1)
    // Notification is handled by useCart hook
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

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our latest collection of premium products with exclusive deals and offers
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <Skeleton className="w-full h-48 mb-4" />
              <Skeleton className="w-3/4 h-4 mb-2" />
              <Skeleton className="w-1/2 h-4 mb-2" />
              <Skeleton className="w-1/3 h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
          <p className="text-gray-600">Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our latest collection of premium products with exclusive deals and offers
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {products.map((product) => {
          const localProduct = {
            ...product,
            image: product.image,
            reviews: product.reviews,
            inStock: product.inStock,
            isNew: product.isNew,
            isSale: product.isSale,
            discount: product.discount,
          };
          return <ProductListItem key={product.id} product={localProduct} />;
        })}
      </div>
    </div>
  )
}
