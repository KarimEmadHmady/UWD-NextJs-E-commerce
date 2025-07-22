"use client"

import { useState } from "react"
import { Search, Home, ChevronRight } from "lucide-react"
import FilterSidebar from "@/components/shop/filter-sidebar"
import ProductSort from "@/components/shop/product-sort"
import ProductListItem from "@/components/shop/product-list-item"
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
import { categories } from '@/components/product/category-data';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import InfiniteScroll from 'react-infinite-scroll-component';

/**
 * ShopPage component - Displays all products with filtering, search, sorting, and grid/list view.
 * Handles product filtering, and wishlist toggling.
 */
export default function ShopPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("featured");
  const { start, stop } = useGlobalLoading();
  const products = productsData;
  const dispatch = useDispatch();
  const { selectedCategories, selectedQuantities, selectedSizes, selectedBrands, priceRange } = useFilter();

  let filteredProducts = products.filter((item) => {
    const matchesQuery = searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const matchesCategory = selectedCategories.length > 0 ? selectedCategories.includes(item.category) : true;
    const matchesPrice = priceRange && priceRange.length === 2 ? (item.price >= priceRange[0] && item.price <= priceRange[1]) : true;
    const matchesQuantity = selectedQuantities.length > 0 ? selectedQuantities.some(q => item.name.toLowerCase().includes(q.toLowerCase())) : true;
    const matchesSize = selectedSizes.length > 0 ? selectedSizes.some(s => item.name.toLowerCase().includes(s.toLowerCase())) : true;
    const matchesBrand = selectedBrands.length > 0 ? selectedBrands.some(b => item.name.toLowerCase().includes(b.toLowerCase())) : true;
    return matchesQuery && matchesCategory && matchesPrice && matchesQuantity && matchesSize && matchesBrand;
  });

  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const [visibleCount, setVisibleCount] = useState(9);
  const hasMore = visibleCount < filteredProducts.length;
  const loadMore = () => setVisibleCount((prev) => prev + 9);
  const productsToShow = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gray-50">
      <RevealOnScroll alwaysAnimate>
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/', icon: <Home className="w-4 h-4 text-gray-400" /> },
                { label: 'Sweets', href: '/shop', },
                { label: 'All Sweets' }
              ]}
            />
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
                className="pl-10 text-black pr-4 py-3 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                totalProducts={filteredProducts.length}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </RevealOnScroll>
            <RevealOnScroll delay={0.4}>
              {/* Add this section at the top of the main shop page, before the product grid */}
              <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop/${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
                    className="block border rounded-lg p-2 text-center hover:shadow-md transition hover:scale-[1.05]"
                  >
                    <img src={cat.image} alt={cat.name} className="w-full h-20 object-cover rounded mb-2" />
                    <span className="font-semibold text-black">{cat.name}</span>
                  </Link>
                ))}
              </div>
              {/* Products Grid/List */}
              <div className="p-4">
                <InfiniteScroll
                  dataLength={productsToShow.length}
                  next={loadMore}
                  hasMore={hasMore}
                  loader={<div className="text-center py-4 text-gray-400">Loading...</div>}
                  endMessage={<div className="text-center py-4 text-gray-400">No more products</div>}
                  scrollableTarget={null}
                >
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                      {productsToShow.map((product) => {
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
                      {productsToShow.map((product) => {
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
                </InfiniteScroll>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}
