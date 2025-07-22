import { ChevronRight, Home } from 'lucide-react'
import React from 'react'
import Image from 'next/image'
import RevealOnScroll from '@/components/common/RevealOnScroll'
import { categories } from '@/components/product/category-data'
import Link from 'next/link';

export default function Categore() {
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
      <div className="bg-white dark:text-gray-100">
        <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
                className={`group relative block overflow-hidden transition ease-out active:opacity-75 ${idx % 5 === 0 ? 'sm:col-span-2 md:col-span-1' : ''}`}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={400}
                  height={192}
                  className="transition ease-out group-hover:scale-110 h-48 w-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black/25 transition ease-out group-hover:bg-black/0" />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="rounded-3xl bg-white/95 px-4 py-3 text-sm font-semibold tracking-wide uppercase transition ease-out group-hover:bg-teal-600 group-hover:text-white dark:border-gray-800 dark:bg-gray-900/90">
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
