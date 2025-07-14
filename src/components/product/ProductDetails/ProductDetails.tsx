// src/components/product/ProductDetails/ProductDetails.tsx 


"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/common/Button/Button"
import { Badge } from "@/components/common/Badge/Badge"

import type { Product } from "../product-data";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedRAM, setSelectedRAM] = useState("8GB")
  const [selectedStorage, setSelectedStorage] = useState("256GB")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // Example colors, ram, storage, images. You can extend Product type to include these if needed.
  const colors = [
    { name: "Space Gray", value: "#2d3748", bgClass: "bg-gray-800" },
    { name: "Silver", value: "#718096", bgClass: "bg-gray-500" },
    { name: "Gold", value: "#e2e8f0", bgClass: "bg-gray-200" },
  ];
  const ramOptions = ["8GB", "16GB"];
  const storageOptions = ["256GB", "512GB", "1TB"];
  const productImages = [product.image];
  const thumbnails = [product.image];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">
              <Image
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt="MacBook Pro"
                fill
                className="object-contain p-8"
              />
              <button className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-blue-500" : "border-transparent"
                  }`}
                >
                  <Image
                    src={thumb || "/placeholder.svg"}
                    alt={`MacBook Pro view ${index + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-400 line-through">${product.originalPrice}</span>
              )}
              {product.inStock ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <Check className="w-4 h-4 mr-1" />
                  In Stock
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">Color</h3>
              <div className="flex gap-3">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-12 h-12 rounded-full ${color.bgClass} border-4 transition-all ${
                      selectedColor === index ? "border-blue-500 scale-110" : "border-gray-200 hover:border-gray-300"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Specification</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory :</span>
                  <span className="text-gray-900">8GB unified memory</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage :</span>
                  <span className="text-gray-900">256GB/512GB SSD storage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Display :</span>
                  <span className="text-gray-900">13-inch Retina display with True Tone</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processor :</span>
                  <span className="text-gray-900">Apple M1 chip with 8-core CPU & GPU</span>
                </div>
              </div>
            </div>

            {/* RAM and Storage Selection */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">RAM</h4>
                <div className="flex gap-2">
                  {ramOptions.map((ram) => (
                    <Button
                      key={ram}
                      variant={selectedRAM === ram ? "default" : "outline"}
                      onClick={() => setSelectedRAM(ram)}
                      className="flex-1"
                    >
                      {ram}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Storage</h4>
                <div className="flex gap-2">
                  {storageOptions.map((storage) => (
                    <Button
                      key={storage}
                      variant={selectedStorage === storage ? "default" : "outline"}
                      onClick={() => setSelectedStorage(storage)}
                      className="flex-1 text-sm"
                    >
                      {storage}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="px-3">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3">Add to Cart</Button>

              <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3">Buy Now</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
