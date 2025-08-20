"use client"

import { useState } from "react"
import { Slider } from "../common/slider/slider"
import { Checkbox } from "../common/checkbox/checkbox"
import { Button } from "../common/Button/Button"
import { Badge } from "../common/Badge/Badge"
import { Star, X, Filter } from "lucide-react"
import { useDispatch } from 'react-redux';
import { useFilter } from '../../hooks/useFilter';
import { setCategories, setSizes, setQuantities, setPriceRange, clearFilters } from '../../redux/features/filter/filterSlice';
import { useCategories } from '@/hooks/useCategories';
import { useAllProducts } from '@/hooks/useProducts';
import { convertApiProductToUI } from '@/components/product/product-data';
import CustomButton from "../common/Button/CustomButton";

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  hideCategories?: boolean
}

export default function FilterSidebar({ isOpen, onClose, hideCategories = false }: FilterSidebarProps) {
  const dispatch = useDispatch();
  const { selectedCategories, selectedSizes, selectedQuantities, priceRange } = useFilter();
  
  // Use API data instead of static data
  const { data: apiProducts, isLoading: productsLoading } = useAllProducts();
  const products = apiProducts ? apiProducts.map(convertApiProductToUI) : [];
  
  // Use API data for categories
  const { categories, loading: categoriesLoading } = useCategories();
  
  // احسب عدد المنتجات لكل كاتيجوري ديناميكياً
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    count: products.filter(p => p.categories && p.categories.some(c => c.name === cat.name)).length,
  }));

  // فلتر السعر من المنتجات
  const prices = products.map(p => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [inStockOnly, setInStockOnly] = useState(false)

  const sizeOptions = ["Small", "Medium", "Large"];
  const pieceOptions = ["1 piece", "6 pieces", "12 pieces", "24 pieces"];

  // استخدم Redux بدلاً من useState
  const toggleCategory = (categoryName: string) => {
    let updated = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((name) => name !== categoryName)
      : [...selectedCategories, categoryName];
    dispatch(setCategories(updated));
  };

  const toggleSize = (size: string) => {
    let updated = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    dispatch(setSizes(updated));
  };

  const togglePieces = (piece: string) => {
    let updated = selectedQuantities.includes(piece)
      ? selectedQuantities.filter((p) => p !== piece)
      : [...selectedQuantities, piece];
    dispatch(setQuantities(updated));
  };

  const clearAllFilters = () => {
    dispatch(setPriceRange([minPrice, maxPrice]));
    setSelectedRating(null);
    setInStockOnly(false);
    dispatch(clearFilters());
  };

  const activeFiltersCount =
    selectedCategories.length + selectedSizes.length + selectedQuantities.length + (selectedRating ? 1 : 0) + (inStockOnly ? 1 : 0);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 bg-white z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          border-r border-gray-200 overflow-y-auto
        `}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs cursor-pointer">
                  Clear All
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden cursor-pointer">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Price Range</h3>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={(val) => dispatch(setPriceRange([val[0], val[1]]))}
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
          </div>

          {/* Categories */}
          {!hideCategories && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Categories</h3>
              {categoriesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {categoriesWithCount.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={category.name}
                          checked={selectedCategories.includes(category.name)}
                          onCheckedChange={() => toggleCategory(category.name)}
                        />
                        <label htmlFor={category.name} className="text-sm text-gray-700 cursor-pointer">
                          {category.name}
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">({category.count})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Size */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Size</h3>
            <div className="space-y-3">
              {sizeOptions.map((size) => (
                <div key={size} className="flex items-center">
                  <Checkbox
                    id={size}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={() => toggleSize(size)}
                  />
                  <label htmlFor={size} className="text-sm text-gray-700 cursor-pointer ml-3">
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Pieces */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Pieces</h3>
            <div className="space-y-3">
              {pieceOptions.map((piece) => (
                <div key={piece} className="flex items-center">
                  <Checkbox
                    id={piece}
                    checked={selectedQuantities.includes(piece)}
                    onCheckedChange={() => togglePieces(piece)}
                  />
                  <label htmlFor={piece} className="text-sm text-gray-700 cursor-pointer ml-3">
                    {piece}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Customer Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  className={`
                    flex items-center gap-2 w-full p-2 rounded-lg transition-colors
                    ${selectedRating === rating ? "bg-red-50 border border-red-200" : "hover:bg-gray-50"}
                  `}
                >
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">& up</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Availability</h3>
            <div className="flex items-center space-x-3">
              <Checkbox id="in-stock" checked={inStockOnly} onCheckedChange={val => setInStockOnly(!!val)} />
              <label htmlFor="in-stock" className="text-sm text-gray-700 cursor-pointer">
                In Stock Only
              </label>
            </div>
          </div>

          {/* Apply Filters Button */}
          <CustomButton className="w-full border-none outline-none  cursor-pointer pb-[20px]">Apply Filters</CustomButton>
        </div>
      </div>
    </>
  )
}
