"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, X, Star, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Input } from "@/components/common/input/input"
import { Card, CardContent } from "@/components/common/card/card"
import { Badge } from "@/components/common/Badge/Badge"
import { Checkbox } from "@/components/common/checkbox/checkbox"
import { useSearch } from '@/hooks/useSearch';
import { useFilter } from '@/hooks/useFilter';
import { setCategories, setQuantities, setSizes, setBrands, clearFilters } from '@/redux/features/filter/filterSlice';
import { useDispatch } from 'react-redux';
import { setSearchQuery, fetchSearchSuccess } from '@/redux/features/search/searchSlice';
import { useEffect } from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams()
  const dispatch = useDispatch();
  const { query: searchQuery, results: searchResults, loading, error } = useSearch();
  const { selectedCategories, selectedQuantities, selectedSizes, selectedBrands } = useFilter();
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  // const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  // Sweet shop dummy data (English)
  const dummyResults = [
    {
      id: '1',
      name: "Chocolate Cake",
      price: 150,
      originalPrice: 180,
      image: "https://images.unsplash.com/photo-1590251786954-cf189e67d0bd?q=80&w=1074&auto=format&fit=crop",
      rating: 4.9,
      reviews: 87,
      category: "Cakes",
      description: "Rich and moist chocolate cake topped with creamy chocolate ganache.",
      isNew: true,
      isSale: true,
    },
    {
      id: '2',
      name: "Baklava Mix",
      price: 120,
      image: "https://images.unsplash.com/photo-1559656914-a30970c1affd?q=80&w=687&auto=format&fit=crop",
      rating: 4.8,
      reviews: 54,
      category: "Oriental Sweets",
      description: "Assorted baklava with pistachio and walnut, made fresh daily.",
      isNew: false,
      isSale: false,
    },
    {
      id: '3',
      name: "Mini Cupcakes Box (12 pcs)",
      price: 90,
      originalPrice: 110,
      image: "https://images.unsplash.com/photo-1590251786954-cf189e67d0bd?q=80&w=1074&auto=format&fit=crop",
      rating: 4.7,
      reviews: 33,
      category: "Cupcakes",
      description: "A box of 12 assorted mini cupcakes, perfect for parties.",
      isNew: false,
      isSale: true,
    },
    {
      id: '4',
      name: "Strawberry Tart",
      price: 70,
      image: "https://images.unsplash.com/photo-1533910534207-90f31029a78e?q=80&w=687&auto=format&fit=crop",
      rating: 4.6,
      reviews: 21,
      category: "Tarts",
      description: "Crispy tart filled with vanilla cream and fresh strawberries.",
      isNew: true,
      isSale: false,
    },
    {
      id: '5',
      name: "Assorted Cookies (500g)",
      price: 60,
      image: "https://images.unsplash.com/photo-1657679358567-c01939c7ad42?q=80&w=687&auto=format&fit=crop",
      rating: 4.5,
      reviews: 40,
      category: "Cookies",
      description: "A mix of butter, chocolate chip, and coconut cookies.",
      isNew: false,
      isSale: false,
    },
  ];

  // عند تغيير البحث، حدث النتائج الوهمية
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearchQuery(value));
    // فلترة النتائج الوهمية بناءً على البحث
    const filtered = value
      ? dummyResults.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
      : dummyResults;
    dispatch(fetchSearchSuccess(filtered));
  };

  // عند الضغط على X امسح البحث والنتائج
  const handleClearSearch = () => {
    dispatch(setSearchQuery(''));
    dispatch(fetchSearchSuccess(dummyResults));
  };

  // تم حذف بيانات البحث الثابتة، سيتم استخدام بيانات الريدكس

  const filters = {
    categories: ["Cakes", "Cookies", "Tarts", "Cupcakes", "Oriental Sweets", "Chocolates"],
    quantities: ["1 piece", "6 pieces", "12 pieces", "500g", "1kg"],
    sizes: ["Small", "Medium", "Large"],
    brands: ["Sweet House", "Oriental Delights", "ChocoDream", "Bakery Fresh", "Tasty Bites"],
  }

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

  // تحديث الفلاتر عند التغيير
  const handleCategoryToggle = (category: string) => {
    let updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    dispatch(setCategories(updated));
  };
  const handleQuantityToggle = (quantity: string) => {
    let updated = selectedQuantities.includes(quantity)
      ? selectedQuantities.filter((q) => q !== quantity)
      : [...selectedQuantities, quantity];
    dispatch(setQuantities(updated));
  };
  const handleSizeToggle = (size: string) => {
    let updated = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    dispatch(setSizes(updated));
  };
  const handleBrandToggle = (brand: string) => {
    let updated = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    dispatch(setBrands(updated));
  };
  const clearAllFilters = () => {
    dispatch(clearFilters());
  };

  const activeFiltersCount = selectedCategories.length + selectedQuantities.length + selectedSizes.length + selectedBrands.length;

  useEffect(() => {
    let filtered = dummyResults.filter((item) => {
      const matchesQuery = searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      const matchesCategory = selectedCategories.length > 0 ? selectedCategories.includes(item.category) : true;
      const matchesQuantity = selectedQuantities.length > 0 ? selectedQuantities.some(q => item.name.toLowerCase().includes(q.toLowerCase())) : true;
      const matchesSize = selectedSizes.length > 0 ? selectedSizes.some(s => item.name.toLowerCase().includes(s.toLowerCase())) : true;
      const matchesBrand = selectedBrands.length > 0 ? selectedBrands.some(b => item.name.toLowerCase().includes(b.toLowerCase())) : true;
      return matchesQuery && matchesCategory && matchesQuantity && matchesSize && matchesBrand;
    });
    dispatch(fetchSearchSuccess(filtered));
  }, [dispatch, searchQuery, selectedCategories, selectedQuantities, selectedSizes, selectedBrands]);

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
                className="pl-12 pr-4 py-4 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                {searchQuery ? `Search results for "${searchQuery}"` : "All Sweets"}
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
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-pink-600">
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* حالة التحميل أو الخطأ */}
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
                    <div key={category} className="flex items-center space-x-3">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label htmlFor={category} className="text-sm text-gray-700 cursor-pointer">
                        {category}
                      </label>
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
                <h3 className="font-semibold text-gray-900 mb-4">Brand/Bakery</h3>
                <div className="space-y-3">
                  {filters.brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-3">
                      <Checkbox
                        id={brand}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => handleBrandToggle(brand)}
                      />
                      <label htmlFor={brand} className="text-sm text-gray-700 cursor-pointer">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-t-lg">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover p-0 group-hover:scale-105 transition-transform duration-300"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
                        {product.isSale && <Badge className="bg-red-500 text-white">Sale</Badge>}
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" variant="secondary" className="w-10 h-10 rounded-full p-0 shadow-lg">
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      <p className="text-sm text-gray-500 font-medium">{product.category}</p>
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">{renderStars(product.rating ?? 0)}</div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                        {typeof product.originalPrice === 'number' && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <Button className="w-full bg-pink-600 hover:bg-pink-700">Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {searchResults.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No matching sweets found</h2>
                <p className="text-gray-600 mb-6">
                  Try changing your search or filters to find the sweets you want
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
