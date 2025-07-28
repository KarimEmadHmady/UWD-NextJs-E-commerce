"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Eye } from "lucide-react"
import type { Product } from "./product-data"
import { products as productsData } from './product-data';
import { Button } from "../common/Button/Button"
import { Badge } from "../common/Badge/Badge"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { Product as GlobalProduct } from "@/types/product"
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect } from 'react';
import ProductListItem from '../shop/product-list-item';

export default function ProductGrid() {
  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlist()
  const isInWishlist = (id: number) => wishlistItems.some((item) => item.id === id)
  const { notify } = useNotifications();
  const products = productsData;

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
      notify('success', 'Removed from wishlist')
    } else {
      addWishlist(wishlistProduct)
      notify('success', 'Added to wishlist')
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
    notify('success', 'Added to cart successfully!')
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
