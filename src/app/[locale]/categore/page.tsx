"use client"

import { ChevronRight, Home } from 'lucide-react'
import React from 'react'
import Image from 'next/image'
import RevealOnScroll from '@/components/common/RevealOnScroll'
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import Skeleton from '@/components/common/Skeleton';

export default function Categore() {
  const { categories, loading, error } = useCategories();

  // Loading skeleton
  if (loading) {
    return (
      <div>
        <RevealOnScroll alwaysAnimate>
          {/* Breadcrumbs */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <nav className="flex items-center space-x-2 text-sm">
                <Home className="w-4 h-4 text-gray-400" />
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600"> Categories</span>
              </nav>
            </div>
          </div>
          {/* Categories Grid Skeleton */}
          <div className="bg-white dark:text-gray-100">
            <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="relative block overflow-hidden">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <Skeleton className="h-8 w-24 rounded-3xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <RevealOnScroll alwaysAnimate>
          {/* Breadcrumbs */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <nav className="flex items-center space-x-2 text-sm">
                <Home className="w-4 h-4 text-gray-400" />
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600"> Categories</span>
              </nav>
            </div>
          </div>
          {/* Error Message */}
          <div className="bg-white dark:text-gray-100">
            <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Categories</h2>
                <p className="text-gray-600">Failed to load categories. Please try again later.</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    );
  }

  return (
    <div>
      <RevealOnScroll alwaysAnimate>
               {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4 text-gray-400" />
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600"> Categories</span>
          </nav>
        </div>
      </div>
            {/* Product List Section: Categories Grid */}
      <div className="">
        <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className={`group relative block overflow-hidden transition ease-out active:opacity-75 ${idx % 5 === 0 ? 'sm:col-span-2 md:col-span-1' : ''}`}
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={400}
                    height={192}
                    className="transition ease-out group-hover:scale-110 h-48 w-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                    <span className="text-gray-500 text-2xl font-bold">
                      {cat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/25 transition ease-out group-hover:bg-black/0" />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="rounded-3xl bg-white/95 px-4 py-3 text-sm font-semibold tracking-wide uppercase transition ease-out group-hover:bg-red-600 group-hover:text-white dark:border-gray-800 dark:bg-gray-900/90">
                    {cat.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      </RevealOnScroll>
    </div>
  )
}
