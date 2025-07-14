"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../common/Button/Button"

interface Category {
  id: number
  name: string
  image: string
  productCount: number
  color: string
}

const categories: Category[] = [
  {
    id: 1,
    name: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=80&q=80",
    productCount: 24,
    color: "bg-blue-100",
  },
  {
    id: 2,
    name: "Smartphones",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80",
    productCount: 18,
    color: "bg-purple-100",
  },
  {
    id: 3,
    name: "Tablets",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80",
    productCount: 12,
    color: "bg-green-100",
  },
  {
    id: 4,
    name: "Audio",
    image: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=80&q=80",
    productCount: 31,
    color: "bg-orange-100",
  },
  {
    id: 5,
    name: "Wearables",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=80&q=80",
    productCount: 15,
    color: "bg-pink-100",
  },
  {
    id: 6,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=80&q=80",
    productCount: 42,
    color: "bg-yellow-100",
  },
  {
    id: 7,
    name: "Gaming",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80",
    productCount: 28,
    color: "bg-red-100",
  },
  {
    id: 8,
    name: "Smart Home",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80",
    productCount: 19,
    color: "bg-indigo-100",
  },
  {
    id: 9,
    name: "Cameras",
    image: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=80&q=80",
    productCount: 16,
    color: "bg-teal-100",
  },
  {
    id: 10,
    name: "Storage",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=80&q=80",
    productCount: 22,
    color: "bg-cyan-100",
  },
]

export default function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  const scrollLeft = () => {
    const container = document.getElementById("categories-container")
    if (container) {
      container.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    const container = document.getElementById("categories-container")
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Shop by Category</h2>
            <p className="text-sm text-gray-500">Find what you're looking for</p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              className="h-8 w-8 rounded-full border-gray-200 hover:border-gray-300 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              className="h-8 w-8 rounded-full border-gray-200 hover:border-gray-300 bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="relative w-full">
          <div
            id="categories-container"
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex-shrink-0 group cursor-pointer transition-all duration-200
                  ${selectedCategory === category.id ? "scale-105" : "hover:scale-105"}
                `}
                style={{ minWidth: 120, maxWidth: 140 }}
              >
                <div className="flex flex-col items-center space-y-2 p-2">
                  {/* Category Image */}
                  <div
                    className={`
                      relative w-16 h-16 rounded-full ${category.color} p-2
                      overflow-hidden flex items-center justify-center
                      transition-all duration-300
                      ${selectedCategory === category.id ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                    `}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:shadow-lg"
                      style={{transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)'}}
                    />
                  </div>

                  {/* Category Info */}
                  <div className="text-center">
                    <h3 className="text-xs font-medium text-gray-900 truncate max-w-[70px]">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.productCount} items</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Overlays for scroll indication */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* All Categories Link */}
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-black hover:text-gray-900 text-xs font-semibold rounded-full flex items-center gap-1 px-3 py-1.5 border border-gray-200 hover:bg-gray-100 transition-all duration-150 shadow-none"
          >
            View All Categories
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-1 text-black"><path d="M9 6l6 6-6 6"/></svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
