// "use client"

// import { useRouter } from "next/navigation"
// import { ArrowLeft, ShoppingBag } from "lucide-react"
// import CartItemComponent from "@/components/cart/CartItem/cart-item"
// import CartSummary from "@/components/cart/CartSummary/cart-summary"
// import { Button } from "@/components/common/Button/Button"
// import { useCart } from "@/hooks/useCart"
// import type { Product } from "@/types/product"
// import RevealOnScroll from "@/components/common/RevealOnScroll"
// import React from "react"

// /**
//  * CartPage component - Displays the user's shopping cart with items, summary, and checkout option.
//  * Handles item quantity updates, removal, and navigation to checkout or shop.
//  */
// export default function CartPage() {
//   const router = useRouter()
//   const { 
//     items, 
//     subtotal, 
//     shipping, 
//     tax, 
//     total, 
//     updateItemQuantity, 
//     removeItem,
//     isLoading,
//     error,
//     serverCartCount,
//     serverCartTotal,
//     fetchCartFromServer
//   } = useCart()

//   const moveToWishlist = (id: number) => {
//     // Handle move to wishlist logic - will be implemented later
//     // Note: We need the key for removal, so we'll need to find the item first
//     const item = items.find(item => item.id === id)
//     if (item?.key) {
//       removeItem(item.key)
//     }
//   }

//   // Fetch cart data from server on component mount
//   React.useEffect(() => {
//     fetchCartFromServer()
//   }, [fetchCartFromServer])

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading cart...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4 py-16">
//           <div className="text-center">
//             <div className="text-red-500 mb-4">Error loading cart</div>
//             <p className="text-gray-600 mb-8">{error}</p>
//             <Button onClick={fetchCartFromServer} className="bg-red-600 hover:bg-red-700">
//               Retry
//             </Button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (items.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4 py-16">
//           <div className="text-center">
//             <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h1>
//             <p className="text-gray-600 mb-8">Add some products to get started</p>
//             <Button onClick={() => router.push("/shop")} className="bg-red-600 hover:bg-red-700">
//               Continue Shopping
//             </Button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const handleCheckout = () => {
//     router.push("/checkout")
//   }

//   return (
//     <div className="min-h-screen ">
//       <RevealOnScroll alwaysAnimate>
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8 pt-5">
//           <Button variant="ghost" onClick={() => router.back()} className="p-2">
//             <ArrowLeft className="w-5 h-5" />
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
//             <p className="text-gray-600">{items.reduce((total, item) => total + item.quantity, 0)} items in your cart</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2 space-y-4 mx-3">
//             {items.map((item) => (
//               <CartItemComponent
//                 key={item.key || item.id}
//                 item={{
//                   ...item,
//                 }}
//                 onUpdateQuantity={updateItemQuantity}
//                 onRemove={removeItem}
//                 onMoveToWishlist={moveToWishlist}
//               />
//             ))}

//             {/* Continue Shopping */}
//             <div className="pt-4">
//               <Button variant="outline" onClick={() => router.push("/shop")} className="bg-transparent">
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Continue Shopping
//               </Button>
//             </div>
//           </div>

//           {/* Cart Summary */}
//           <div className="lg:col-span-1">
//             <CartSummary
//               subtotal={subtotal}
//               shipping={shipping}
//               tax={tax}
//               discount={0}
//               total={total}
//               onCheckout={handleCheckout}
//             />
//           </div>
//         </div>
//       </RevealOnScroll>
//       </div>
   
//   )
// }




"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag, Star, Gift, Crown, Zap, Trophy } from "lucide-react"
import CartItemComponent from "@/components/cart/CartItem/cart-item"
import CartSummary from "@/components/cart/CartSummary/cart-summary"
import { Button } from "@/components/common/Button/Button"
import { useCart } from "@/hooks/useCart"
import RevealOnScroll from "@/components/common/RevealOnScroll"
import React from "react"

interface LoyaltyTier {
  name: string
  minPoints: number
  color: string
  icon: React.ReactNode
  benefits: string[]
}

interface LoyaltyReward {
  id: string
  name: string
  pointsCost: number
  description: string
  type: "discount" | "freeShipping" | "product"
  value?: number
}

const loyaltyTiers: LoyaltyTier[] = [
  {
    name: "Bronze",
    minPoints: 0,
    color: "text-amber-600",
    icon: <Star className="w-4 h-4" />,
    benefits: ["1 point per E.L1 spent", "Birthday discount"],
  },
  {
    name: "Silver",
    minPoints: 500,
    color: "text-gray-500",
    icon: <Gift className="w-4 h-4" />,
    benefits: ["1.5 points per E.L1 spent", "Free shipping on orders E.L50+", "Early access to sales"],
  },
  {
    name: "Gold",
    minPoints: 1500,
    color: "text-yellow-500",
    icon: <Crown className="w-4 h-4" />,
    benefits: ["2 points per E.L1 spent", "Free shipping on all orders", "Exclusive products", "Priority support"],
  },
  {
    name: "Platinum",
    minPoints: 3000,
    color: "text-red-600",
    icon: <Trophy className="w-4 h-4" />,
    benefits: ["3 points per E.L1 spent", "Free express shipping", "Personal shopper", "VIP events"],
  },
]

// مكافآت مناسبة للأكل
const MIN_REDEEM_SUBTOTAL = 150;
const MAX_REDEEM_PERCENT = 0.2; // 20%

const availableRewards: LoyaltyReward[] = [
  {
    id: "freeDrink",
    name: "مشروب مجاني",
    pointsCost: 300,
    description: "احصل على مشروب مجاني مع طلبك",
    type: "product",
  },
  {
    id: "freeFries",
    name: "بطاطس مجانية",
    pointsCost: 400,
    description: "بطاطس مقلية مجانية مع أي وجبة",
    type: "product",
  },
  {
    id: "freeDelivery",
    name: "توصيل مجاني",
    pointsCost: 350,
    description: "توصيل مجاني للطلبات فوق 150 جنيه",
    type: "freeShipping",
  },
  {
    id: "discount10",
    name: "خصم 10 جنيه",
    pointsCost: 500,
    description: "خصم 10 جنيه على طلبك القادم (حد أدنى 150 جنيه)",
    type: "discount",
    value: 10,
  },
  {
    id: "discount25",
    name: "خصم 25 جنيه",
    pointsCost: 1200,
    description: "خصم 25 جنيه على طلبك القادم (حد أدنى 200 جنيه)",
    type: "discount",
    value: 25,
  },
];

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
  } = useCart()

  const [loyaltyPoints, setLoyaltyPoints] = React.useState(1250)
  const [selectedRewards, setSelectedRewards] = React.useState<string[]>([])
  const [showRewards, setShowRewards] = React.useState(false)

  const getCurrentTier = () => {
    return loyaltyTiers.reduce((current, tier) => (loyaltyPoints >= tier.minPoints ? tier : current))
  }

  const getNextTier = () => {
    const currentTier = getCurrentTier()
    const currentIndex = loyaltyTiers.findIndex((tier) => tier.name === currentTier.name)
    return currentIndex < loyaltyTiers.length - 1 ? loyaltyTiers[currentIndex + 1] : null
  }

  const getPointsToNextTier = () => {
    const nextTier = getNextTier()
    return nextTier ? nextTier.minPoints - loyaltyPoints : 0
  }

  // عدل دالة احتساب النقاط لتستخدم subtotal فقط
  const getPointsEarned = () => {
    const currentTier = getCurrentTier();
    const multiplier =
      currentTier.name === "Bronze"
        ? 1
        : currentTier.name === "Silver"
        ? 1.5
        : currentTier.name === "Gold"
        ? 2
        : 3;
    return Math.floor(subtotal * multiplier);
  };

  const redeemReward = (rewardId: string) => {
    const reward = availableRewards.find((r) => r.id === rewardId)
    if (reward && loyaltyPoints >= reward.pointsCost) {
      setLoyaltyPoints((prev) => prev - reward.pointsCost)
      setSelectedRewards((prev) => [...prev, rewardId])
      // In a real app, this would apply the reward to the cart
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

  const currentTier = getCurrentTier()
  const nextTier = getNextTier()
  const pointsToNext = getPointsToNextTier()
  const pointsEarned = getPointsEarned()

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
          <div className="bg-white rounded-xl p-6 border ">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${currentTier.color}`}>
                  {currentTier.icon}
                  <span className="font-semibold text-lg">{currentTier.name} Member</span>
                </div>
                <div className="bg-white px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gray-700">{loyaltyPoints.toLocaleString()} points</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRewards(!showRewards)}
                className="bg-white hover:bg-gray-50"
              >
                <Gift className="w-4 h-4 mr-2" />
                Rewards
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Points Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    You'll earn {pointsEarned} points from this order
                  </span>
                  <Zap className="w-4 h-4 text-yellow-500" />
                </div>

                {nextTier && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progress to {nextTier.name}</span>
                      <span className="text-sm font-medium text-gray-700">{pointsToNext} points needed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-400 to-red-900 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, ((loyaltyPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Benefits */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Benefits</h4>
                <ul className="space-y-1">
                  {currentTier.benefits.slice(0, 2).map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Rewards Panel */}
            {showRewards && (
              <div className="mt-6 pt-6 border-t border-red-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {availableRewards.map((reward) => (
                    <div key={reward.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{reward.name}</h5>
                        <Gift className="w-4 h-4 text-red-500" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-600">{reward.pointsCost} points</span>
                        <Button
                          size="sm"
                          variant={
                            loyaltyPoints >= reward.pointsCost &&
                            subtotal >= MIN_REDEEM_SUBTOTAL &&
                            (reward.type !== "discount" || (reward.value || 0) <= subtotal * MAX_REDEEM_PERCENT)
                              ? "default"
                              : "outline"
                          }
                          disabled={
                            loyaltyPoints < reward.pointsCost ||
                            selectedRewards.includes(reward.id) ||
                            subtotal < MIN_REDEEM_SUBTOTAL ||
                            (reward.type === "discount" && (reward.value || 0) > subtotal * MAX_REDEEM_PERCENT)
                          }
                          onClick={() => redeemReward(reward.id)}
                          className={
                            loyaltyPoints >= reward.pointsCost &&
                            subtotal >= MIN_REDEEM_SUBTOTAL &&
                            (reward.type !== "discount" || (reward.value || 0) <= subtotal * MAX_REDEEM_PERCENT)
                              ? "bg-red-600 hover:bg-red-700"
                              : ""
                          }
                        >
                          {selectedRewards.includes(reward.id)
                            ? "تم الاستبدال"
                            : "استبدل"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
