"use client"

import { useState } from "react"
import { ChevronDown, Grid3X3, List, Filter } from "lucide-react"
import { Button } from "../common/Button/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../common/dropdown-menu/dropdown-menu"

interface ProductSortProps {
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onFilterToggle: () => void
  totalProducts: number
  sortBy: string
  setSortBy: (value: string) => void
}

export default function ProductSort({ viewMode, onViewModeChange, onFilterToggle, totalProducts, sortBy, setSortBy }: ProductSortProps) {

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Customer Rating" },
    { value: "name", label: "Name A-Z" },
  ]

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white border-b border-gray-200 text-black flex-col">
      <div className="flex items-center gap-4 flex-row-reverse">
        {/* Mobile Filter Button */}
        <Button variant="outline" size="sm" onClick={onFilterToggle} className="lg:hidden bg-transparent text-black">
          <Filter className="w-4 h-4 mr-2 text-black" />
          Filters
        </Button>

        {/* Results Count */}
        <p className="text-sm text-black">
          Showing <span className="font-medium text-black">{totalProducts}</span> items
        </p>
      </div>

      <div className="flex items-center gap-4 w-full justify-between">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="min-w-[140px] justify-between bg-transparent text-white">
              <span className="text-sm text-black">Sort by: {sortOptions.find((option) => option.value === sortBy)?.label}</span>
              <ChevronDown className="w-4 h-4 text-black" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 text-black">
            {sortOptions.map((option) => (
              <DropdownMenuItem key={option.value} onClick={() => setSortBy(option.value)} className="text-black">
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode Toggle */}
        <div className="flex items-center border border-gray-200 rounded-lg p-1 text-black">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="px-3 text-black"
          >
            <Grid3X3 className="w-4 h-4 text-black" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="px-3 text-black"
          >
            <List className="w-4 h-4 text-black" />
          </Button>
        </div>
      </div>
    </div>
  )
}
