"use client"

import { useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Search, X, Star, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Input } from "@/components/common/input/input"
import { Card, CardContent } from "@/components/common/card/card"
import { Badge } from "@/components/common/Badge/Badge"
import { Checkbox } from "@/components/common/checkbox/checkbox"
import { useFilter } from '@/hooks/useFilter';
import { setCategories, setQuantities, setSizes, setBrands, clearFilters } from '@/redux/features/filter/filterSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Slider } from '@/components/common/slider/slider';
import ShopProductCard from '@/components/product/ShopProductCard/ShopProductCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCategories } from '@/hooks/useCategories';
import { useAllProducts } from '@/hooks/useProducts';
import { convertApiProductToUI, products as staticProducts } from '@/components/product/product-data';

export default function SearchPage() {
  const searchParams = useSearchParams()
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { selectedCategories, selectedQuantities, selectedSizes, selectedBrands } = useFilter();
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Use API data instead of static data - same as shop page
  const { data: apiProducts, isLoading: productsLoading, error: productsError } = useAllProducts();
  const products = apiProducts ? apiProducts.map(convertApiProductToUI) : [];
  
  // Filter out products without price
  const productsWithPrice = products.filter(product => 
    product.price && String(product.price).trim() !== '' && product.price !== 0
  );
  
  // Use API data for categories
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  
  const prices = useMemo(() => {
    const validPrices = productsWithPrice
      .map(p => typeof p.price === 'number' ? p.price : parseFloat(String(p.price || 0)))
      .filter(price => !isNaN(price) && isFinite(price));
    return validPrices;
  }, [productsWithPrice]);
  
  const minPrice = useMemo(() => prices.length > 0 ? Math.min(...prices) : 0, [prices]);
  const maxPrice = useMemo(() => prices.length > 0 ? Math.max(...prices) : 1000, [prices]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  // Update price range when min/max prices change
  useEffect(() => {
    if (!isNaN(minPrice) && !isNaN(maxPrice) && isFinite(minPrice) && isFinite(maxPrice)) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice]);

  const categoriesWithCount = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      count: productsWithPrice.filter(p => p.categories && p.categories.includes(cat.name)).length,
    }));
  }, [categories, productsWithPrice]);

  const filters = useMemo(() => ({
    categories: categoriesWithCount,
    quantities: ["1 piece", "6 pieces", "12 pieces", "500g", "1kg"],
    sizes: ["Small", "Medium", "Large"],
  }), [categoriesWithCount]);

  const searchResults = useMemo(() => {
    const filtered = productsWithPrice.filter((item) => {
      const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price || 0));
      
      const matchesQuery = searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      const matchesCategory = selectedCategories.length > 0 ? selectedCategories.some(cat => item.categories && item.categories.includes(cat)) : true;
      const matchesQuantity = selectedQuantities.length > 0 ? selectedQuantities.some(q => item.name.toLowerCase().includes(q.toLowerCase())) : true;
      const matchesSize = selectedSizes.length > 0 ? selectedSizes.some(s => item.name.toLowerCase().includes(s.toLowerCase())) : true;
      const matchesPrice = priceRange && priceRange.length === 2 && !isNaN(priceRange[0]) && !isNaN(priceRange[1]) 
        ? (itemPrice >= priceRange[0] && itemPrice <= priceRange[1]) 
        : true;
      
      return matchesQuery && matchesCategory && matchesQuantity && matchesSize && matchesPrice;
    });
    
    return filtered;
  }, [productsWithPrice, searchQuery, selectedCategories, selectedQuantities, selectedSizes, priceRange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const handleCategoryToggle = useCallback((category: string) => {
    let updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    dispatch(setCategories(updated));
  }, [selectedCategories, dispatch]);

  const handleQuantityToggle = useCallback((quantity: string) => {
    let updated = selectedQuantities.includes(quantity)
      ? selectedQuantities.filter((q) => q !== quantity)
      : [...selectedQuantities, quantity];
    dispatch(setQuantities(updated));
  }, [selectedQuantities, dispatch]);

  const handleSizeToggle = useCallback((size: string) => {
    let updated = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    dispatch(setSizes(updated));
  }, [selectedSizes, dispatch]);

  const handleBrandToggle = useCallback((brand: string) => {
    let updated = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    dispatch(setBrands(updated));
  }, [selectedBrands, dispatch]);

  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const activeFiltersCount = selectedCategories.length + selectedQuantities.length + selectedSizes.length + selectedBrands.length;

  const [visibleCount, setVisibleCount] = useState(productsWithPrice.length);
  const hasMore = visibleCount < searchResults.length;
  const loadMore = useCallback(() => setVisibleCount((prev) => prev + 9), []);
  const productsToShow = searchResults.slice(0, visibleCount);

  // Reset visible count when search results change
  useEffect(() => {
    setVisibleCount(searchResults.length);
  }, [searchResults.length]);

  // Loading state
  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading search results...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productsError || categoriesError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
            <p className="text-gray-600">Failed to load products or categories. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-12 pr-4 py-4 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Search Results Info */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search results for "${searchQuery}"` : "All Products"}
              </h1>
              <p className="text-gray-600">{searchResults.length} items available</p>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden bg-transparent"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && <Badge className="ml-2">{activeFiltersCount}</Badge>}
            </Button>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedCategories.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleCategoryToggle(filter)} />
                </Badge>
              ))}
              {selectedQuantities.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleQuantityToggle(filter)} />
                </Badge>
              ))}
              {selectedSizes.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleSizeToggle(filter)} />
                </Badge>
              ))}
              {selectedBrands.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleBrandToggle(filter)} />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-red-600">
                Clear all
              </Button>
            </div>
          )}
        </div>

        {loading && <div className="text-center py-4">Loading search results...</div>}
        {error && <div className="text-center py-4 text-red-500">{error}</div>}

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div
            className={`
              ${isFilterOpen ? "block" : "hidden"} lg:block
              w-80 flex-shrink-0 space-y-6
            `}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-3">
                  {filters.categories.map((category) => (
                    <div key={category.name} className="flex items-center space-x-3">
                      <Checkbox
                        id={category.name}
                        checked={selectedCategories.includes(category.name)}
                        onCheckedChange={() => handleCategoryToggle(category.name)}
                      />
                      <label htmlFor={category.name} className="text-sm text-gray-700 cursor-pointer">
                        {category.name}
                      </label>
                      <span className="text-xs text-gray-500">({category.count})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quantity</h3>
                <div className="space-y-3">
                  {filters.quantities.map((quantity) => (
                    <div key={quantity} className="flex items-center space-x-3">
                      <Checkbox
                        id={quantity}
                        checked={selectedQuantities.includes(quantity)}
                        onCheckedChange={() => handleQuantityToggle(quantity)}
                      />
                      <label htmlFor={quantity} className="text-sm text-gray-700 cursor-pointer">
                        {quantity}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Size</h3>
                <div className="space-y-3">
                  {filters.sizes.map((size) => (
                    <div key={size} className="flex items-center space-x-3">
                      <Checkbox
                        id={size}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => handleSizeToggle(size)}
                      />
                      <label htmlFor={size} className="text-sm text-gray-700 cursor-pointer">
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={(val) => setPriceRange([val[0], val[1]])}
                    max={maxPrice}
                    min={minPrice}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>EGP {priceRange[0]}</span>
                    <span>EGP {priceRange[1]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="flex-1">
            <InfiniteScroll
              dataLength={productsToShow.length}
              next={loadMore}
              hasMore={hasMore}
              loader={<div className="text-center py-4 text-gray-600">Loading...</div>}
              endMessage={<div className="text-center py-4 text-gray-400">No more products</div>}
            >
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
            </InfiniteScroll>

            {/* No Results */}
            {searchResults.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No matching products found</h2>
                <p className="text-gray-600 mb-6">
                  Try changing your search or filters to find the products you want
                </p>
                <Button onClick={clearAllFilters} variant="outline" className="bg-transparent">
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
