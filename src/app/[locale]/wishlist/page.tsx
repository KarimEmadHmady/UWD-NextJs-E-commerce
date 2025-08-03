"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, ArrowLeft } from "lucide-react"
import WishlistItemComponent from "@/components/wishlist/wishlist-item"
import { Button } from "@/components/common/Button/Button"
import { useCart } from "@/hooks/useCart"
import { toast } from "sonner"
import { useWishlist } from "@/hooks/useWishlist"
import { useNotifications } from '@/hooks/useNotifications';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';

// Mock data for wishlist items
const mockWishlistItems = [
  {
    id: 1,
    name: "MacBook Pro M3 14-inch",
    price: 1999.99,
    originalPrice: 2299.99,
    image: "https://eljokerstores.com/wp-content/uploads/2023/09/Untitled_design-removebg-preview-1.png",
    category: "Laptops",
    inStock: true,
  },
  {
    id: 2,
    name: "Apple Watch Series 9",
    price: 399.99,
    originalPrice: 449.99,
    image: "https://vlegko.ru/upload/iblock/900/a4ay7kyvxsv47178yp7ivr1114wbkm5u/225c56ea-5217-11ee-88d4-24418cd4ee54_adef5cda-521f-11ee-88d4-24418cd4ee54.jpg",
    category: "Wearables",
    inStock: true,
  },
  {
    id: 3,
    name: "AirPods Max",
    price: 549.99,
    image: "https://eljokerstores.com/wp-content/uploads/2023/09/Untitled_design-removebg-preview-1.png",
    category: "Audio",
    inStock: false,
  },
  {
    id: 4,
    name: "Magic Keyboard with Touch ID",
    price: 179.99,
    image: "https://vlegko.ru/upload/iblock/900/a4ay7kyvxsv47178yp7ivr1114wbkm5u/225c56ea-5217-11ee-88d4-24418cd4ee54_adef5cda-521f-11ee-88d4-24418cd4ee54.jpg",
    category: "Accessories",
    inStock: true,
  },
]

/**
 * WishlistPage component - Displays the user's wishlist with options to add items to cart or remove them.
 * Handles empty state, item removal, and moving items to the cart.
 */
export default function WishlistPage() {
  const router = useRouter()
  const { items: wishlistItems, removeItem: removeWishlistItem } = useWishlist()
  const { addItem, toggle } = useCart()
  const { notify } = useNotifications();
  const { start, stop } = useGlobalLoading();

  const handleRemoveItem = (id: number) => {
    removeWishlistItem(id)
  }

  const handleAddToCart = (id: number) => {
    const item = wishlistItems.find((item) => item.id === id)
    if (!item) return
    // Map wishlist item to CartProduct type
    const product = {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      images: item.images,
      category: item.category,
      rating: item.rating,
      stock: item.stock,
      brand: item.brand,
      tags: item.tags,
    }
    addItem(product, 1)
    handleRemoveItem(id)
    notify('success', 'Product added to cart!')
    toggle() // Open side cart
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600">{wishlistItems.length} items in your wishlist</p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Start adding your favorite products to save them for later.</p>
            <Button onClick={() => router.push("/shop")} className="bg-teal-600 hover:bg-teal-700">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <WishlistItemComponent
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                originalPrice={undefined}
                image={item.images[0] || "/placeholder.svg"}
                category={item.category}
                inStock={item.stock > 0}
                onRemove={handleRemoveItem}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
