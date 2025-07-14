"use client"

import { useState } from "react"
import { Slider } from "../common/slider/slider"
import { Checkbox } from "../common/checkbox/checkbox"
import { Button } from "../common/Button/Button"
import { Badge } from "../common/Badge/Badge"
import { Star, X, Filter } from "lucide-react"

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [inStockOnly, setInStockOnly] = useState(false)

  const categories = [
    { id: "laptops", name: "Laptops", count: 24 },
    { id: "smartphones", name: "Smartphones", count: 18 },
    { id: "tablets", name: "Tablets", count: 12 },
    { id: "audio", name: "Audio", count: 31 },
    { id: "wearables", name: "Wearables", count: 15 },
    { id: "gaming", name: "Gaming", count: 28 },
    { id: "accessories", name: "Accessories", count: 42 },
  ]

  const brands = [
    { id: "apple", name: "Apple", count: 45 },
    { id: "samsung", name: "Samsung", count: 32 },
    { id: "sony", name: "Sony", count: 28 },
    { id: "microsoft", name: "Microsoft", count: 15 },
    { id: "google", name: "Google", count: 12 },
    { id: "dell", name: "Dell", count: 18 },
  ]

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]))
  }

  const clearAllFilters = () => {
    setPriceRange([0, 5000])
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedRating(null)
    setInStockOnly(false)
  }

  const activeFiltersCount =
    selectedCategories.length + selectedBrands.length + (selectedRating ? 1 : 0) + (inStockOnly ? 1 : 0)

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
                onValueChange={setPriceRange}
                max={5000}
                min={0}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>E.L {priceRange[0]}</span>
                <span>E.L {priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Categories</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <label htmlFor={category.id} className="text-sm text-gray-700 cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">({category.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Brands</h3>
            <div className="space-y-3">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={brand.id}
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={() => toggleBrand(brand.id)}
                    />
                    <label htmlFor={brand.id} className="text-sm text-gray-700 cursor-pointer">
                      {brand.name}
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">({brand.count})</span>
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
                    ${selectedRating === rating ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"}
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
          <Button className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer">Apply Filters</Button>
        </div>
      </div>
    </>
  )
}
