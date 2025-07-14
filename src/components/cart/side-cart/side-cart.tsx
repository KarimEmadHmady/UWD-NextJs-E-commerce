"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import CartItemComponent from "../CartItem/cart-item"
import CartSummary from "../CartSummary/cart-summary"

interface SideCartProps {
  isOpen: boolean
  onClose: () => void
}

// Mock cart data (يمكنك استبدالها ببيانات سلة التسوق الفعلية من حالة التطبيق أو API)
const mockCartItems = [
  {
    id: 1,
    name: "MacBook Pro M3 14-inch",
    price: 1999.99,
    originalPrice: 2299.99,
    image: "https://eljokerstores.com/wp-content/uploads/2023/09/Untitled_design-removebg-preview-1.png",
    quantity: 1,
    color: "Space Gray",
    size: "14-inch",
    inStock: true,
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    price: 1199.99,
    image: "https://vlegko.ru/upload/iblock/900/a4ay7kyvxsv47178yp7ivr1114wbkm5u/225c56ea-5217-11ee-88d4-24418cd4ee54_adef5cda-521f-11ee-88d4-24418cd4ee54.jpg",
    quantity: 2,
    color: "Natural Titanium",
    size: "256GB",
    inStock: true,
  },
  {
    id: 3,
    name: "AirPods Pro 2nd Gen",
    price: 249.99,
    image: "https://eljokerstores.com/wp-content/uploads/2023/09/Untitled_design-removebg-preview-1.png",
    quantity: 1,
    inStock: false, // مثال لمنتج غير متوفر
  },
]

export default function SideCart({ isOpen, onClose }: SideCartProps) {
  const router = useRouter()
  const [cartItems, setCartItems] = useState(mockCartItems)

  // منع التمرير على الجسم عند فتح السلة الجانبية
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const moveToWishlist = (id: number) => {
    // هنا يمكنك إضافة منطق نقل المنتج إلى قائمة الرغبات
    console.log(`Item ${id} moved to wishlist`)
    removeItem(id) // إزالة من السلة بعد النقل
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 15.99 // شحن مجاني للطلبات فوق 100 دولار
  const tax = subtotal * 0.08 // 8% ضريبة
  const discount = 0 // لا يوجد خصم افتراضي
  const total = subtotal + shipping + tax - discount

  const handleCheckout = () => {
    onClose() // إغلاق السلة الجانبية قبل الانتقال
    router.push("/checkout")
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-[99]" onClick={onClose} />}

      {/* Side Cart Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-lg z-[100]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col
          overflow-y-auto max-h-screen
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="cursor-pointer">
            <X className="w-5 h-5 cursor-pointer" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[250px] ">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cursor-pointer">
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  onMoveToWishlist={moveToWishlist}
                />
              </div>
            ))
          )}
        </div>

        {/* Cart Summary and Checkout Button */}
        <div className="p-4 border-t border-gray-200">
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            discount={discount}
            total={total}
            onCheckout={handleCheckout}
          />
          <Button
            onClick={() => {
              onClose()
              router.push("/cart")
            }}
            variant="outline"
            className="w-full mt-4 bg-transparent cursor-pointer"
          >
            View Full Cart <ArrowRight className="w-4 h-4 ml-2 cursor-pointer" />
          </Button>
        </div>
      </div>
    </>
  )
}
