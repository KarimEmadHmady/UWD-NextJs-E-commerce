"use client"

import { useState, useEffect } from "react";
import ProductListItem from '@/components/shop/product-list-item';
import ShopProductCard from '@/components/product/ShopProductCard/ShopProductCard';
import FilterSidebar from '@/components/shop/filter-sidebar';
import ProductSort from '@/components/shop/product-sort';
import RevealOnScroll from '@/components/common/RevealOnScroll';
import { useFilter } from '@/hooks/useFilter';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Home } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCategoryBySlug } from '@/hooks/useCategories';
import { convertApiProductToUI } from '@/components/product/product-data';
import Skeleton from '@/components/common/Skeleton';

const normalize = (str: string) => str.replace(/\s+/g, '-').toLowerCase();

export default function CategoryPage(props: { params: Promise<{ category: string; locale: string }> }) {
  const [category, setCategory] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(9);
  
  const { selectedQuantities, selectedSizes, selectedBrands, priceRange } = useFilter();
  
  // Get category data
  const { categoryData, loading: categoryLoading, error: categoryError } = useCategoryBySlug(category);

  useEffect(() => {
    const getParams = async () => {
      const { category: catParam } = await props.params;
      setCategory(catParam);
    };
    getParams();
  }, [props.params]);

  // Get products from category data
  const products = categoryData?.products ? categoryData.products.map(convertApiProductToUI) : [];
  
  // Filter out products without price
  const productsWithPrice = products.filter(product => 
    product.price && String(product.price).trim() !== '' && product.price !== 0
  );

  // Apply additional filters
  let finalFilteredProducts = productsWithPrice.filter((item) => {
    const matchesPrice = priceRange && priceRange.length === 2 ? (item.price >= priceRange[0] && item.price <= priceRange[1]) : true;
    const matchesQuantity = selectedQuantities.length > 0 ? selectedQuantities.some(q => item.name.toLowerCase().includes(q.toLowerCase())) : true;
    const matchesSize = selectedSizes.length > 0 ? selectedSizes.some(s => item.name.toLowerCase().includes(s.toLowerCase())) : true;
    const matchesBrand = selectedBrands.length > 0 ? selectedBrands.some(b => item.name.toLowerCase().includes(b.toLowerCase())) : true;
    return matchesPrice && matchesQuantity && matchesSize && matchesBrand;
  });

  // Apply sorting
  finalFilteredProducts = [...finalFilteredProducts].sort((a, b) => {
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

  const hasMore = visibleCount < finalFilteredProducts.length;
  const loadMore = () => setVisibleCount((prev) => prev + 9);
  const productsToShow = finalFilteredProducts.slice(0, visibleCount);

  // Loading skeleton
  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <div className="w-64 p-4">
              <Skeleton className="w-full h-96" />
            </div>
            <div className="flex-1 p-4">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4">
                    <Skeleton className="w-full h-48 mb-4" />
                    <Skeleton className="w-3/4 h-4 mb-2" />
                    <Skeleton className="w-1/2 h-4 mb-2" />
                    <Skeleton className="w-1/3 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (categoryError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Category</h2>
            <p className="text-gray-600">Failed to load category. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  // Category not found
  if (!categoryData) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Decorative stars */}
      <img src="/star-yellow.png" alt="نجمة صفراء" className="pointer-events-none absolute top-6 left-6 w-17 h-17 opacity-80 rotate-12 z-10" />
      <img src="/Star_Green.png" alt="نجمة خضراء" className="pointer-events-none absolute bottom-6 right-6 w-19 h-19 opacity-80 -rotate-12 z-10" />

      <RevealOnScroll alwaysAnimate>
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/', icon: <Home className="w-4 h-4 text-gray-400" /> },
                { label: 'Sweets', href: '/shop' },
                { label: categoryData.category }
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
                {categoryData.category}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {categoryData.total} products available
              </p>
            </div>
          </div>
        </div>
      </RevealOnScroll>
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          <RevealOnScroll delay={0.2}>
            {/* Filter Sidebar */}
            <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} hideCategories={true} />
          </RevealOnScroll>
          <div className="flex-1 min-w-0">
            <RevealOnScroll delay={0.3}>
              {/* Sort and View Controls */}
              <ProductSort
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onFilterToggle={() => setIsFilterOpen(true)}
                totalProducts={finalFilteredProducts.length}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </RevealOnScroll>
            <RevealOnScroll delay={0.4}>
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
    </div>
  );
} 