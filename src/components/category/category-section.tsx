"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../common/Button/Button"
import { useRouter } from 'next/navigation';
import { useAllProducts } from '@/hooks/useProducts';
import { convertApiProductToUI } from '@/components/product/product-data';
import type { Category } from '@/types/category';
import Skeleton from '@/components/common/Skeleton';

interface CategorySectionProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export default function CategorySection({ categories, loading, error }: CategorySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Get products for counting items in each category
  const { data: apiProducts } = useAllProducts();
  const products = apiProducts ? apiProducts.map(convertApiProductToUI) : [];

  const scrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const container = containerRef.current;
      if (container) {
        // If at end, scroll back to start
        if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 200, behavior: "smooth" });
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex-shrink-0" style={{ minWidth: 120, maxWidth: 140 }}>
                <div className="flex flex-col items-center space-y-2 p-2">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="text-center">
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Error Loading Categories</h2>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
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
            ref={containerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id.toString());
                  router.push(`/shop/${category.slug}`);
                }}
                className={
                  `flex-shrink-0 group cursor-pointer transition-all duration-200 ` +
                  (selectedCategory === category.id.toString() ? "scale-105" : "hover:scale-105")
                }
                style={{ minWidth: 120, maxWidth: 140 }}
              >
                <div className="flex flex-col items-center space-y-2 p-2">
                  {/* Category Image */}
                  <div
                    className={
                      `relative w-16 h-16 rounded-full bg-gray-100 p-2 overflow-hidden flex items-center justify-center transition-all duration-300 ` +
                      (selectedCategory === category.id.toString() ? "ring-2 ring-teal-500 ring-offset-2" : "")
                    }
                  >
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:shadow-lg"
                        style={{transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)'}}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs font-medium">
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Category Info */}
                  <div className="text-center">
                    <h3 className="text-xs font-medium text-gray-900 truncate max-w-[70px]">{category.name}</h3>
                    <p className="text-xs text-gray-500">
                      {category.count} items
                    </p>
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
            onClick={() => router.push('/categore')}
          >
            View All Categories
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-1 text-black"><path d="M9 6l6 6-6 6"/></svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
