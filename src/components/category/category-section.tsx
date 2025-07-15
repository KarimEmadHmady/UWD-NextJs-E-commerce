"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../common/Button/Button"
import { useCategory } from '../../hooks/useCategory';

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
    name: "Cakes",
    image: "https://images.unsplash.com/photo-1590251786954-cf189e67d0bd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    productCount: 18,
    color: "bg-gray-100",
  },
  {
    id: 2,
    name: "Cheesecakes",
    image: "https://images.unsplash.com/photo-1657679358567-c01939c7ad42?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    productCount: 12,
    color: "bg-gray-100",
  },
  {
    id: 3,
    name: "Oriental Sweets",
    image: "https://images.unsplash.com/photo-1559656914-a30970c1affd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    productCount: 22,
    color: "bg-gray-100",
  },
  {
    id: 4,
    name: "Pastries",
    image: "https://images.unsplash.com/photo-1533910534207-90f31029a78e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    productCount: 15,
    color: "bg-gray-100",
  },
  {
    id: 5,
    name: "Cookies",
    image: "https://images.unsplash.com/photo-1657679358567-c01939c7ad42?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    productCount: 20,
    color: "bg-gray-100",
  },
  {
    id: 6,
    name: "Cupcakes",
    image: "https://images.unsplash.com/photo-1590251786954-cf189e67d0bd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    productCount: 10,
    color: "bg-gray-100",
  },
  {
    id: 7,
    name: "Tarts",
    image: "https://images.unsplash.com/photo-1559656914-a30970c1affd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    productCount: 8,
    color: "bg-gray-100",
  },
  {
    id: 8,
    name: "Chocolates",
    image: "https://images.unsplash.com/photo-1533910534207-90f31029a78e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    productCount: 14,
    color: "bg-gray-100",
  },
  {
    id: 9,
    name: "Pies",
    image: "https://images.unsplash.com/photo-1657679358567-c01939c7ad42?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    productCount: 7,
    color: "bg-gray-100",
  },
  {
    id: 10,
    name: "Ice Cream",
    image: "https://images.unsplash.com/photo-1619286311276-d8343d00ce1f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    productCount: 9,
    color: "bg-gray-100",
  },
]

export default function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { categories, loading, error } = useCategory();
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
        {/* حالة التحميل أو الخطأ */}
        {loading && <div className="text-center py-4">Loading categories...</div>}
        {error && <div className="text-center py-4 text-red-500">{error}</div>}
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
                className={
                  `flex-shrink-0 group cursor-pointer transition-all duration-200 ` +
                  (selectedCategory === category.id ? "scale-105" : "hover:scale-105")
                }
                style={{ minWidth: 120, maxWidth: 140 }}
              >
                <div className="flex flex-col items-center space-y-2 p-2">
                  {/* Category Image */}
                  <div
                    className={
                      `relative w-16 h-16 rounded-full bg-gray-100 p-2 overflow-hidden flex items-center justify-center transition-all duration-300 ` +
                      (selectedCategory === category.id ? "ring-2 ring-pink-500 ring-offset-2" : "")
                    }
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
  );
}
