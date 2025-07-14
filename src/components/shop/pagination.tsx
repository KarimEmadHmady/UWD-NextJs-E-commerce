"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../common/Button/Button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8 flex-wrap">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          flex items-center justify-center rounded-full
          px-2
          h-9 w-9
          text-black
          bg-white
          border border-gray-300
          transition-all duration-200
          ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50 hover:border-blue-400"}
        `}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 text-black">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="px-2 sm:px-3 py-1 text-gray-400 select-none">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={`
                  w-9 h-9 p-0 rounded-full
                  font-bold
                  transition-all duration-200
                  ${currentPage === page
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-black border border-gray-300 hover:bg-blue-50 hover:border-blue-400"}
                `}
                style={{
                  boxShadow: currentPage === page ? "0 2px 8px 0 #3b82f633" : undefined,
                }}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          flex items-center justify-center rounded-full
          px-2
          h-9 w-9
          text-black
          bg-white
          border border-gray-300
          transition-all duration-200
          ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50 hover:border-blue-400"}
        `}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
