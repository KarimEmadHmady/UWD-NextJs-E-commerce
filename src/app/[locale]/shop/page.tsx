"use client"

import { useState } from "react"
import { Search, Home, ChevronRight } from "lucide-react"
import FilterSidebar from "@/components/shop/filter-sidebar"
import ProductSort from "@/components/shop/product-sort"
import ProductListItem from "@/components/shop/product-list-item"
import Pagination from "@/components/shop/pagination"
import { Button } from "@/components/common/Button/Button"
import { Input } from "@/components/common/input/input"
import { products, Product } from "@/components/product/product-data"

import Link from "next/link"

export default function ShopPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = 8
  const totalProducts = 156

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4 text-gray-400" />
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Shop</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">All Products</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop All Products</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of premium products with the best deals and latest technology
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-black pr-4 py-3 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Filter Sidebar */}
          <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort and View Controls */}
            <ProductSort
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onFilterToggle={() => setIsFilterOpen(true)}
              totalProducts={totalProducts}
            />

            {/* Products Grid/List */}
            <div className="p-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product: Product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Product Card Content - Similar to ProductGrid */}
                      <div className="relative aspect-square bg-gray-50 overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                          {product.isNew && (
                            <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded cursor-pointer">New</span>
                          )}
                          {product.isSale && product.discount && (
                            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded cursor-pointer">
                              -{product.discount}%
                            </span>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button size="sm" variant="secondary" className="w-10 h-10 rounded-full p-0 shadow-lg cursor-pointer">
                            <Search className="w-4 h-4 cursor-pointer" />
                          </Button>
                        </div>

                        {/* Add to Cart Button */}
                        {product.inStock && (
                          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg py-2 shadow-lg cursor-pointer">
                              Add to Cart
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4 space-y-3">
                        <p className="text-sm text-gray-500 font-medium">{product.category}</p>
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product: Product) => (
                    <ProductListItem key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  )
}
