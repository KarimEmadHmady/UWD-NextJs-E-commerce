"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import CartItemComponent from "@/components/cart/CartItem/cart-item"
import CartSummary from "@/components/cart/CartSummary/cart-summary"
import { Button } from "@/components/common/Button/Button"
import { useCart } from "@/hooks/useCart"
import type { Product } from "@/types/common"
import RevealOnScroll from "@/components/common/RevealOnScroll"

/**
 * CartPage component - Displays the user's shopping cart with items, summary, and checkout option.
 * Handles item quantity updates, removal, and navigation to checkout or shop.
 */
export default function CartPage() {
  const router = useRouter()
  const { items, subtotal, shipping, tax, total, updateItemQuantity, removeItem } = useCart()

  const moveToWishlist = (id: number) => {
    // Handle move to wishlist logic - will be implemented later
    removeItem(id)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to get started</p>
            <Button onClick={() => router.push("/shop")} className="bg-pink-600 hover:bg-pink-700">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <RevealOnScroll alwaysAnimate>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-5">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">{items.length} items in your cart</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 mx-3">
            {items.map((item) => (
              <CartItemComponent
                key={item.id}
                item={{
                  ...item,
                }}
                onUpdateQuantity={updateItemQuantity}
                onRemove={removeItem}
                onMoveToWishlist={moveToWishlist}
              />
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Button variant="outline" onClick={() => router.push("/shop")} className="bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              discount={0}
              total={total}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </RevealOnScroll>
      </div>
   
  )
}
