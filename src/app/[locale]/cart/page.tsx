"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import CartItemComponent from "@/components/cart/CartItem/cart-item"
import CartSummary from "@/components/cart/CartSummary/cart-summary"
import { Button } from "@/components/common/Button/Button"
// Mock cart data
const mockCartItems = [
  {
    id: 1,
    name: "MacBook Pro M3 14-inch",
    price: 1999.99,
    originalPrice: 2299.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    quantity: 1,
    color: "Space Gray",
    size: "14-inch",
    inStock: true,
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    price: 1199.99,
    image: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
    quantity: 2,
    color: "Natural Titanium",
    size: "256GB",
    inStock: true,
  },
  {
    id: 3,
    name: "AirPods Pro 2nd Gen",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    quantity: 1,
    inStock: false,
  },
]

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState(mockCartItems)

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const moveToWishlist = (id: number) => {
    // Handle move to wishlist logic
    removeItem(id)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 15.99
  const tax = subtotal * 0.08
  const discount = 0
  const total = subtotal + shipping + tax - discount

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
       
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to get started</p>
            <Button onClick={() => router.push("/shop")} className="bg-blue-600 hover:bg-blue-700">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">{cartItems.length} items in your cart</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
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
              discount={discount}
              total={total}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
