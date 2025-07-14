"use client"
import Image from "next/image"
import { ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "../common/Button/Button"
import { Badge } from "../common/Badge/Badge"

interface WishlistItemProps {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  inStock: boolean
  onRemove: (id: number) => void
  onAddToCart: (id: number) => void
}

export default function WishlistItemComponent({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  inStock,
  onRemove,
  onAddToCart,
}: WishlistItemProps) {
  const formatPrice = (price: number) => {
    return `E.L ${price.toFixed(2)}`
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-contain p-2" />
        {!inStock && (
          <Badge variant="secondary" className="absolute top-2 left-2 bg-gray-500 text-white text-xs">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{category}</p>
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{name}</h3>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">{formatPrice(price)}</span>
          {originalPrice && <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice)}</span>}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => onAddToCart(id)} disabled={!inStock} className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <ShoppingCart className="w-3 h-3 mr-1" />
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Button onClick={() => onRemove(id)} variant="outline" className="flex-1 bg-transparent cursor-pointer">
            <Trash2 className="w-3 h-3 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}
