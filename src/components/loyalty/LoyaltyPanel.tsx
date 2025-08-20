"use client"
import React from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Gift, Star, Crown, Trophy, Zap } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { redeemReward as redeemRewardAction } from '@/redux/features/loyalty/loyaltySlice'
import { selectLoyaltyPoints, selectRedeemedRewards } from '@/redux/features/loyalty/loyaltySelectors'

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
  // Optional product info for product reward
  productId?: number
  productName?: string
  productPrice?: number
}

const loyaltyTiers: LoyaltyTier[] = [
  { name: "Bronze", minPoints: 0, color: "text-amber-600", icon: <Star className="w-4 h-4" />, benefits: ["1 point per E.L1 spent", "Birthday discount"] },
  { name: "Silver", minPoints: 500, color: "text-gray-500", icon: <Gift className="w-4 h-4" />, benefits: ["1.5 points per E.L1 spent", "Free shipping on orders E.L50+", "Early access to sales"] },
  { name: "Gold", minPoints: 1500, color: "text-yellow-500", icon: <Crown className="w-4 h-4" />, benefits: ["2 points per E.L1 spent", "Free shipping on all orders", "Exclusive products", "Priority support"] },
  { name: "Platinum", minPoints: 3000, color: "text-red-600", icon: <Trophy className="w-4 h-4" />, benefits: ["3 points per E.L1 spent", "Free express shipping", "Personal shopper", "VIP events"] },
]

const MIN_REDEEM_SUBTOTAL = 150
const MAX_REDEEM_PERCENT = 0.2

export function LoyaltyPanel({
  subtotal,
  availableRewards,
  onRewardRedeemed,
}: {
  subtotal: number
  availableRewards: LoyaltyReward[]
  onRewardRedeemed?: (reward: LoyaltyReward) => void
}) {
  const dispatch = useDispatch();
  const points = useSelector(selectLoyaltyPoints);
  const redeemed = useSelector(selectRedeemedRewards);
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
      currentTier.name === "Bronze" ? 1 :
      currentTier.name === "Silver" ? 1.5 :
      currentTier.name === "Gold" ? 2 : 3
    return Math.floor(subtotal * multiplier)
  }

  const currentTier = getCurrentTier()
  const nextTier = getNextTier()
  const pointsToNext = getPointsToNextTier()
  const pointsEarned = getPointsEarned()

  const isRedeemed = (id: string) => redeemed.some(r => r.id === id)

  const canRedeem = (reward: LoyaltyReward) => {
    if (points < reward.pointsCost) return false
    if (isRedeemed(reward.id)) return false
    if (subtotal < MIN_REDEEM_SUBTOTAL) return false
    if (reward.type === 'discount' && (reward.value || 0) > subtotal * MAX_REDEEM_PERCENT) return false
    return true
  }

  const handleRedeem = (reward: LoyaltyReward) => {
    if (!canRedeem(reward)) return
    dispatch(redeemRewardAction({ id: reward.id, name: reward.name, type: reward.type, pointsCost: reward.pointsCost, value: reward.value }))
    onRewardRedeemed?.(reward)
  }

  return (
    <div className="bg-white rounded-xl p-6 border ">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 ${currentTier.color}`}>
            {currentTier.icon}
            <span className="font-semibold text-lg">{currentTier.name} Member</span>
          </div>
          <div className="bg-white px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-gray-700">{points.toLocaleString()} points</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowRewards(!showRewards)} className="bg-white hover:bg-gray-50">
          <Gift className="w-4 h-4 mr-2" /> Rewards
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">You'll earn {pointsEarned} points from this order</span>
            <Zap className="w-4 h-4 text-yellow-500" />
          </div>
          {nextTier && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress to {nextTier.name}</span>
                <span className="text-sm font-medium text-gray-700">{pointsToNext} points needed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-400 to-red-900 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Your Benefits</h4>
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
                    variant={canRedeem(reward) ? "default" : "outline"}
                    disabled={!canRedeem(reward)}
                    onClick={() => handleRedeem(reward)}
                    className={canRedeem(reward) ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    {isRedeemed(reward.id) ? "تم الاستبدال" : "استبدل"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LoyaltyPanel


