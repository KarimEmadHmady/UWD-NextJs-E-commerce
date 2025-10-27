"use client"
import React from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Gift, Star, Crown, Trophy, Zap } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { redeemReward as redeemRewardAction, unredeemReward } from '@/redux/features/loyalty/loyaltySlice'
import { selectLoyaltyPoints, selectSessionRedeemedRewards } from '@/redux/features/loyalty/loyaltySelectors'

type LoyaltyTier = {
  name: string
  minPoints: number
  color: string
  icon: React.ReactNode
  benefits: string[]
}

export type LoyaltyReward = {
  id: string
  name: string
  pointsCost: number
  description: string
  type: "discount" | "freeShipping" | "product"
  value?: number
  isPercent?: boolean
  productId?: number
  productName?: string
  productPrice?: number
  image?: string
}

const loyaltyTiers: LoyaltyTier[] = [
  { name: "عضو برونزي", minPoints: 0, color: "text-amber-600", icon: <Star className="w-4 h-4" />, benefits: ["0.5 نقطة لكل جنيه يتم إنفاقه", "خصم في عيد الميلاد"] },
  { name: "عضو فضي", minPoints: 500, color: "text-gray-500", icon: <Gift className="w-4 h-4" />, benefits: ["0.5 نقطة لكل جنيه يتم إنفاقه", "شحن مجاني للطلبات فوق 500 جنيه", "أولوية في العروض"] },
  { name: "عضو ذهبي", minPoints: 1500, color: "text-yellow-500", icon: <Crown className="w-4 h-4" />, benefits: ["1 نقطة لكل جنيه يتم إنفاقه", "شحن مجاني لكل الطلبات", "منتجات حصرية", "دعم أولوية"] },
  { name: "عضو بلاتيني", minPoints: 3000, color: "text-red-600", icon: <Trophy className="w-4 h-4" />, benefits: ["1.5 نقطة لكل جنيه يتم إنفاقه", "شحن سريع مجاني", "مساعد تسوق شخصي", "دعوات لفعاليات VIP"] },
  { name: "عضو ماسي", minPoints: 5000, color: "text-red-700", icon: <Crown className="w-4 h-4" />, benefits: ["2 نقطة لكل جنيه يتم إنفاقه", "خدمة عملاء مخصصة", "إطلاقات حصرية"] },
]

const MIN_REDEEM_SUBTOTAL = 150
const MAX_REDEEM_PERCENT = 0.2 // 20%

export function LoyaltyPanel({
  subtotal,
  availableRewards,
  onRewardRedeemed,
  onRewardUnredeemed,
  allowCancel = true,
  showRedeemButtons = true,
}: {
  subtotal: number
  availableRewards: LoyaltyReward[]
  onRewardRedeemed?: (reward: LoyaltyReward) => void
  onRewardUnredeemed?: (reward: LoyaltyReward) => void
  allowCancel?: boolean
  showRedeemButtons?: boolean
}) {
  const dispatch = useDispatch();
  const points = useSelector(selectLoyaltyPoints);
  const redeemed = useSelector(selectSessionRedeemedRewards);
  const [showRewards, setShowRewards] = React.useState(false)

  const getCurrentTier = () => {
    return loyaltyTiers.reduce((current, tier) => (points >= tier.minPoints ? tier : current))
  }
  const getNextTier = () => {
    const currentTier = getCurrentTier()
    const currentIndex = loyaltyTiers.findIndex((tier) => tier.name === currentTier.name)
    return currentIndex < loyaltyTiers.length - 1 ? loyaltyTiers[currentIndex + 1] : null
  }
  const getPointsToNextTier = () => {
    const nextTier = getNextTier()
    return nextTier ? nextTier.minPoints - points : 0
  }
  const getPointsEarned = () => {
    const currentTier = getCurrentTier();
    const multiplier =
      currentTier.name.includes("ماسي") ? 2 :
      currentTier.name.includes("بلاتيني") ? 1.5 :
      currentTier.name.includes("ذهبي") ? 1 :
      0.5
    return Math.floor(subtotal * multiplier)
  }

  const currentTier = getCurrentTier()
  const nextTier = getNextTier()
  const pointsToNext = getPointsToNextTier()
  const pointsEarned = getPointsEarned()

  const isRedeemed = (id: string) => redeemed.some(r => r.id === id)
  const redeemedCount = (id: string) => redeemed.filter(r => r.id === id).length

  const canRedeem = (reward: LoyaltyReward) => {
    if (points < reward.pointsCost) return false
    if (isRedeemed(reward.id)) return false
    if (subtotal < MIN_REDEEM_SUBTOTAL) return false
    if (reward.type === 'discount' && redeemed.some(r => r.type === 'discount')) return false
    return true
  }

  const handleRedeem = (reward: LoyaltyReward) => {
    if (!canRedeem(reward)) return
    dispatch(redeemRewardAction({ id: reward.id, name: reward.name, type: reward.type, pointsCost: reward.pointsCost, value: reward.value, isPercent: reward.isPercent, image: reward.image, productId: reward.productId }))
    onRewardRedeemed?.(reward)
  }

  return (
    <div className="bg-white rounded-xl p-6 border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 ${currentTier.color}`}>
            {currentTier.icon}
            <span className="font-semibold text-lg">{currentTier.name}</span>
          </div>
          <div className="bg-white px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-gray-700">{points.toLocaleString()} نقطة</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowRewards(!showRewards)} className="bg-white hover:bg-gray-50">
          <Gift className="w-4 h-4 mr-2" /> المكافآت
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">ستكسب {pointsEarned} نقطة من هذا الطلب</span>
            <Zap className="w-4 h-4 text-yellow-500" />
          </div>
          {nextTier && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">التقدم نحو {nextTier.name}</span>
                <span className="text-sm font-medium text-gray-700">متبقي {pointsToNext} نقطة</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-400 to-red-900 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">مزاياك الحالية</h4>
          <ul className="space-y-1">
            {currentTier.benefits.slice(0, 2).map((benefit, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showRewards && (
        <div className="mt-6 pt-6 border-t border-red-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">المكافآت المتاحة</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableRewards.map((reward) => {
              const already = isRedeemed(reward.id)
              return (
              <div key={reward.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{reward.name}</h5>
                  <Gift className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-red-600">{reward.pointsCost} نقطة</span>
                  {showRedeemButtons && (
                    !already ? (
                      <Button
                        size="sm"
                        variant={canRedeem(reward) ? "default" : "outline"}
                        disabled={!canRedeem(reward)}
                        onClick={() => handleRedeem(reward)}
                        className={canRedeem(reward) ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        استبدال
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-700">
                          تم الاستبدال{redeemedCount(reward.id) > 1 ? ` ×${redeemedCount(reward.id)}` : ''}
                        </span>
                        {allowCancel && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              dispatch(unredeemReward(reward.id))
                              onRewardUnredeemed?.(reward)
                            }}
                          >
                            إلغاء
                          </Button>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )})}
          </div>
        </div>
      )}
    </div>
  )
}

export default LoyaltyPanel

