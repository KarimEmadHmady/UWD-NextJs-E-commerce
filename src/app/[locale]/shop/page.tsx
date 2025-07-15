"use client"

import { useState } from "react"
import { Search, Home, ChevronRight } from "lucide-react"
import FilterSidebar from "@/components/shop/filter-sidebar"
import ProductSort from "@/components/shop/product-sort"
import ProductListItem from "@/components/shop/product-list-item"
import Pagination from "@/components/shop/pagination"
import ShopProductCard from "@/components/product/ShopProductCard/ShopProductCard"
import { Button } from "@/components/common/Button/Button"
import { Input } from "@/components/common/input/input"
import { products as productsData } from "@/components/product/product-data"
import { Toaster } from "sonner"
import Link from "next/link"
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { useProducts } from '@/hooks/useProducts';
import { useEffect } from 'react';
import { useFilter } from '@/hooks/useFilter';
import { setCategories, setQuantities, setSizes, setBrands, clearFilters } from '@/redux/features/filter/filterSlice';
import { useDispatch } from 'react-redux';
import RevealOnScroll from '@/components/common/RevealOnScroll';

/**
 * ShopPage component - Displays all products with filtering, search, sorting, pagination, and grid/list view.
 * Handles product filtering, pagination, and wishlist toggling.
 */
export default function ShopPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [wishlist, setWishlist] = useState<number[]>([])
  const { start, stop } = useGlobalLoading();
  const products = productsData;
  const dispatch = useDispatch();
  const { selectedCategories, selectedQuantities, selectedSizes, selectedBrands } = useFilter();

  const filteredProducts = products.filter((item) => {
    const matchesQuery = searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const matchesCategory = selectedCategories.length > 0 ? selectedCategories.includes(item.category) : true;
    const matchesQuantity = selectedQuantities.length > 0 ? selectedQuantities.some(q => item.name.toLowerCase().includes(q.toLowerCase())) : true;
    const matchesSize = selectedSizes.length > 0 ? selectedSizes.some(s => item.name.toLowerCase().includes(s.toLowerCase())) : true;
    const matchesBrand = selectedBrands.length > 0 ? selectedBrands.some(b => item.name.toLowerCase().includes(b.toLowerCase())) : true;
    return matchesQuery && matchesCategory && matchesQuantity && matchesSize && matchesBrand;
  });

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  // إعداد الباجيناشن الديناميكي
  const pageSize = 9; // عدد المنتجات في كل صفحة
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const totalProducts = filteredProducts.length;
  // إذا الصفحة الحالية أكبر من عدد الصفحات المتاحة، أرجع لأول صفحة بها نتائج
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);
  // المنتجات المعروضة في الصفحة الحالية فقط
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <RevealOnScroll alwaysAnimate>
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Home className="w-4 h-4 text-gray-400" />
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Sweets</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-900">All Sweets</span>
            </nav>
          </div>
        </div>
      </RevealOnScroll>
      <RevealOnScroll delay={0.1}>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Shop All Sweets
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our complete collection of delicious sweets, cakes, pastries, and more. Perfect for every occasion!
              </p>
            </div>
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search sweets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-black pr-4 py-3 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </RevealOnScroll>
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          <RevealOnScroll delay={0.2}>
            {/* Filter Sidebar */}
            <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
          </RevealOnScroll>
          <div className="flex-1 min-w-0">
            <RevealOnScroll delay={0.3}>
              {/* Sort and View Controls */}
              <ProductSort
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onFilterToggle={() => setIsFilterOpen(true)}
                totalProducts={totalProducts}
              />
            </RevealOnScroll>
            <RevealOnScroll delay={0.4}>
              {/* Products Grid/List */}
              <div className="p-4">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => {
                      const localProduct = {
                        ...product,
                        image: product.image,
                        reviews: product.reviews,
                        inStock: product.inStock,
                        isNew: product.isNew,
                        isSale: product.isSale,
                        discount: product.discount,
                      };
                      return <ShopProductCard key={product.id} product={localProduct} />;
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedProducts.map((product) => {
                      const localProduct = {
                        ...product,
                        image: product.image,
                        reviews: product.reviews,
                        inStock: product.inStock,
                        isNew: product.isNew,
                        isSale: product.isSale,
                        discount: product.discount,
                      };
                      return <ProductListItem key={product.id} product={localProduct} />;
                    })}
                  </div>
                )}
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.5}>
              {/* Pagination */}
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </RevealOnScroll>
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}
