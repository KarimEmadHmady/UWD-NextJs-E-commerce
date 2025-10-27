"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import CartItemComponent from "../CartItem/cart-item"
import CartSummary from "../CartSummary/cart-summary"
import { useCart } from "@/hooks/useCart"

interface SideCartProps {
  isOpen: boolean
  onClose: () => void
}

export default function SideCart({ isOpen, onClose }: SideCartProps) {
  const router = useRouter()
  const { 
    items, 
    subtotal, 
    shipping, 
    tax, 
    total,
    updateItemQuantity,
    removeItem,
    fetchCartFromServer,
    clear
  } = useCart()

  // منع التمرير على الجسم عند فتح السلة الجانبية
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // جلب البيانات من السيرفر عند فتح السلة
      fetchCartFromServer()
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen, fetchCartFromServer])

  const handleUpdateQuantity = (key: string, quantity: number) => {
    updateItemQuantity(key, quantity)
  }

  const handleRemoveItem = (key: string) => {
    removeItem(key)
  }

  const moveToWishlist = (id: number) => {
    // هنا سنضيف منطق قائمة الرغبات لاحقاً
    const item = items.find(item => item.id === id)
    if (item?.key) {
      handleRemoveItem(item.key)
    }
  }

  const handleCheckout = () => {
    onClose()
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
          <h2 className="text-xl font-bold text-gray-900"> سلة المشتريات ({items.reduce((total, item) => total + item.quantity, 0)})</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="cursor-pointer">
            <X className="w-5 h-5 cursor-pointer" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[250px]">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Your cart is empty</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  onClose()
                  router.push("/shop")
                }}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <CartItemComponent
                key={item.key || item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                onMoveToWishlist={moveToWishlist}
              />
            ))
          )}
        </div>

        {/* Cart Summary and Checkout Button */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              discount={0}
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
               مشاهدة السلة  <ArrowRight className="w-4 h-4 ml-2 cursor-pointer" />
            </Button>
            <Button
              onClick={() => {
                clear();
              }}
              variant="outline"
              className="w-full mt-3 bg-transparent text-red-600 border-red-200 hover:text-red-700 cursor-pointer"
            >
               تفريغ السلة 
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
