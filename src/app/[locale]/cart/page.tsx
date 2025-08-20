"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import CartItemComponent from "@/components/cart/CartItem/cart-item"
import CartSummary from "@/components/cart/CartSummary/cart-summary"
import { Button } from "@/components/common/Button/Button"
import { useCart } from "@/hooks/useCart"
import RevealOnScroll from "@/components/common/RevealOnScroll"
import React from "react"
import LoyaltyPanel, { LoyaltyReward } from "@/components/loyalty/LoyaltyPanel"
import { availableRewards as rewardsData } from "@/components/loyalty/rewardsData"
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser } from '@/redux/features/auth/authSelectors'
import { setActiveUser } from '@/redux/features/loyalty/loyaltySlice'

const availableRewards: LoyaltyReward[] = rewardsData;

/**
 * CartPage component - Displays the user's shopping cart with items, summary, and checkout option.
 * Handles item quantity updates, removal, and navigation to checkout or shop.
 */
export default function CartPage() {
  const router = useRouter()
  const {
    items,
    subtotal,
    shipping,
    tax,
    total,
    updateItemQuantity,
    removeItem,
    isLoading,
    error,
    serverCartCount,
    serverCartTotal,
    fetchCartFromServer,
    addCustomItem,
    removeLocalItemById,
    clear,
  } = useCart()

  const dispatch = useDispatch();
  const authUser = useSelector(selectUser);
  React.useEffect(() => {
    const uid = (authUser && (authUser.id || (authUser as any).user_id || authUser.email)) || 'guest';
    dispatch(setActiveUser(String(uid)));
  }, [dispatch, authUser]);

  const handleRewardRedeemed = (reward: LoyaltyReward) => {
    if (reward.type === 'product' && reward.productId) {
      addCustomItem({
        id: reward.productId,
        name: reward.productName || reward.name,
        description: '',
        price: reward.productPrice ?? 0,
        images: reward.image ? [reward.image] : [],
        category: 'Reward',
        rating: 0,
        stock: 1,
        brand: '',
        tags: ['reward'],
      }, 1);
    }
    // discount and freeShipping will be applied in checkout totals via loyalty state
  }

  const handleRewardUnredeemed = (reward: LoyaltyReward) => {
    if (reward.type === 'product' && reward.productId) {
      // تقليل عنصر واحد من نفس منتج المكافأة (بدل الحذف الكامل)
      // لو عايز حذف كامل، استخدم removeLocalItemById
      const dec = (useCart() as any).decrementLocalItemById as (id: number) => void
      if (typeof dec === 'function') dec(reward.productId)
    }
  }

  const moveToWishlist = (id: number) => {
    // Handle move to wishlist logic - will be implemented later
    // Note: We need the key for removal, so we'll need to find the item first
    const item = items.find((item) => item.id === id)
    if (item?.key) {
      removeItem(item.key)
    }
  }

  // Fetch cart data from server on component mount
  React.useEffect(() => {
    fetchCartFromServer()
  }, [fetchCartFromServer])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-500 mb-4">Error loading cart</div>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button onClick={fetchCartFromServer} className="bg-red-600 hover:bg-red-700">
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to get started</p>
            <Button onClick={() => router.push("/shop")} className="bg-red-600 hover:bg-red-700">
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
    <div className="min-h-screen ">
      <RevealOnScroll alwaysAnimate>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-5">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">
              {items.reduce((total, item) => total + item.quantity, 0)} items in your cart
            </p>
          </div>
        </div>

        <div className="mb-8 mx-3">
          <LoyaltyPanel
            subtotal={subtotal}
            availableRewards={availableRewards}
            onRewardRedeemed={handleRewardRedeemed}
            onRewardUnredeemed={handleRewardUnredeemed}
            allowCancel={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 mx-3">
            {items.map((item) => (
              <CartItemComponent
                key={item.key || item.id}
                item={{
                  ...item,
                }}
                onUpdateQuantity={updateItemQuantity}
                onRemove={removeItem}
                onMoveToWishlist={moveToWishlist}
              />
            ))}

            {/* Actions */}
            <div className="pt-4 flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => router.push("/shop")} className="bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => clear()} className="bg-transparent text-red-600 border-red-200 hover:text-red-700 cursor-pointer">
                Clear Cart
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
