"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { products as productsData } from '@/components/product/product-data';
import { categories } from '@/components/product/category-data';
import ProductListItem from '@/components/shop/product-list-item';
import ShopProductCard from '@/components/product/ShopProductCard/ShopProductCard';
import FilterSidebar from '@/components/shop/filter-sidebar';
import ProductSort from '@/components/shop/product-sort';
import Pagination from '@/components/shop/pagination';
import RevealOnScroll from '@/components/common/RevealOnScroll';
import { useFilter } from '@/hooks/useFilter';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Home } from 'lucide-react';

const normalize = (str: string) => str.replace(/\s+/g, '-').toLowerCase();

export default function CategoryPage({ params }: { params: { category: string; locale: string } }) {
  const { category } = params;
  const catObj = categories.find((cat) => normalize(cat.name) === normalize(category));
  if (!catObj) return notFound();

  // Filter products by category
  const products = productsData.filter((p) => normalize(p.category) === normalize(category));

  // Filter logic (reuse shop logic)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedQuantities, selectedSizes, selectedBrands, priceRange } = useFilter();

  let filteredProducts = products.filter((item) => {
    const matchesPrice = priceRange && priceRange.length === 2 ? (item.price >= priceRange[0] && item.price <= priceRange[1]) : true;
    const matchesQuantity = selectedQuantities.length > 0 ? selectedQuantities.some(q => item.name.toLowerCase().includes(q.toLowerCase())) : true;
    const matchesSize = selectedSizes.length > 0 ? selectedSizes.some(s => item.name.toLowerCase().includes(s.toLowerCase())) : true;
    const matchesBrand = selectedBrands.length > 0 ? selectedBrands.some(b => item.name.toLowerCase().includes(b.toLowerCase())) : true;
    return matchesPrice && matchesQuantity && matchesSize && matchesBrand;
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

  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const totalProducts = filteredProducts.length;
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <RevealOnScroll alwaysAnimate>
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/', icon: <Home className="w-4 h-4 text-gray-400" /> },
                { label: 'Sweets', href: '/shop' },
                { label: catObj.name }
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
                {catObj.name}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {catObj.description}
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
                totalProducts={totalProducts}
                sortBy={sortBy}
                setSortBy={setSortBy}
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
    </div>
  );
} 