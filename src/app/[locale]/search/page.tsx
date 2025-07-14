"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, X, Star, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Input } from "@/components/common/input/input"
import { Card, CardContent } from "@/components/common/card/card"
import { Badge } from "@/components/common/Badge/Badge"
import { Checkbox } from "@/components/common/checkbox/checkbox"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const searchResults = [
    {
      id: 1,
      name: "MacBook Pro M3 14-inch",
      price: 1999.99,
      originalPrice: 2299.99,
      image: "https://eljokerstores.com/wp-content/uploads/2023/09/Untitled_design-removebg-preview-1.png",
      rating: 4.8,
      reviews: 124,
      category: "Laptops",
      description: "Powerful laptop with M3 chip, perfect for professionals and creatives.",
      inStock: true,
      isNew: false,
      isSale: true,
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max",
      price: 1199.99,
      image: "https://vlegko.ru/upload/iblock/900/a4ay7kyvxsv47178yp7ivr1114wbkm5u/225c56ea-5217-11ee-88d4-24418cd4ee54_adef5cda-521f-11ee-88d4-24418cd4ee54.jpg",
      rating: 4.9,
      reviews: 89,
      category: "Smartphones",
      description: "Latest iPhone with advanced camera system and titanium design.",
      inStock: true,
      isNew: true,
      isSale: false,
    },
    {
      id: 3,
      name: "iPad Pro 12.9-inch",
      price: 1099.99,
      originalPrice: 1299.99,
      image: "https://eljokerstores.com/wp-content/uploads/2023/09/Untitled_design-removebg-preview-1.png",
      rating: 4.7,
      reviews: 156,
      category: "Tablets",
      description: "Professional tablet with M2 chip and Liquid Retina XDR display.",
      inStock: true,
      isNew: false,
      isSale: true,
    },
  ]

  const filters = {
    categories: ["Laptops", "Smartphones", "Tablets", "Audio", "Wearables"],
    priceRanges: ["Under E.L 500", "E.L 500 - E.L 1000", "E.L 1000 - E.L 2000", "Over E.L 2000"],
    brands: ["Apple", "Samsung", "Sony", "Microsoft", "Google"],
    ratings: ["4+ Stars", "3+ Stars", "2+ Stars", "1+ Stars"],
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

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const clearFilters = () => {
    setSelectedFilters([])
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
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
              <p className="text-gray-600">{searchResults.length} products found</p>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden bg-transparent"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {selectedFilters.length > 0 && <Badge className="ml-2">{selectedFilters.length}</Badge>}
            </Button>
          </div>

          {/* Active Filters */}
          {selectedFilters.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterToggle(filter)} />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-blue-600">
                Clear all
              </Button>
            </div>
          )}
        </div>

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
                        checked={selectedFilters.includes(category)}
                        onCheckedChange={() => handleFilterToggle(category)}
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
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-3">
                  {filters.priceRanges.map((range) => (
                    <div key={range} className="flex items-center space-x-3">
                      <Checkbox
                        id={range}
                        checked={selectedFilters.includes(range)}
                        onCheckedChange={() => handleFilterToggle(range)}
                      />
                      <label htmlFor={range} className="text-sm text-gray-700 cursor-pointer">
                        {range}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Brands</h3>
                <div className="space-y-3">
                  {filters.brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-3">
                      <Checkbox
                        id={brand}
                        checked={selectedFilters.includes(brand)}
                        onCheckedChange={() => handleFilterToggle(brand)}
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
                        className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
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
                        <div className="flex items-center">{renderStars(product.rating)}</div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {searchResults.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h2>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <Button onClick={clearFilters} variant="outline" className="bg-transparent">
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
