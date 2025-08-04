// src/components/product/ProductDetails/ProductDetails.tsx 
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, Minus, Plus, ShoppingCart, CreditCard, Heart, Share2, Truck, Shield, RefreshCw, ZoomIn, Facebook } from "lucide-react"
import { FacebookShareButton, WhatsappShareButton, TwitterShareButton } from "react-share"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"
import { Button } from "@/components/common/Button/Button"
import { Badge } from "@/components/common/Badge/Badge"
import { useCart } from "@/hooks/useCart"
import { useNotifications } from '@/hooks/useNotifications';
import type { Product } from "../product-data"
import { convertToCartProduct } from "../product-data"
import { useWishlist } from "@/hooks/useWishlist"
import { CartProduct } from "@/types/product"
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import Skeleton from '@/components/common/Skeleton';

interface ProductDetailsProps {
  product: Product
}

const sizeOptions = ["Small", "Medium", "Large"];

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlist()
  const [selectedSize, setSelectedSize] = useState("Medium")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const { notify } = useNotifications();
  const { start, stop } = useGlobalLoading();
  const [isImgLoading, setIsImgLoading] = useState(true);

  // Share URL - replace with your actual domain in production
  const shareUrl = `https://your-domain.com/product/${product.id}`
  const shareTitle = product.name

  // Product images - only show existing images
  const productImages = [
    product.image || "/placeholder.svg",
    ...(product.gallery || [])
  ].filter(img => img && img !== "/placeholder.svg" && img.trim() !== "");
  
  // If no images, use placeholder
  const finalImages = productImages.length > 0 ? productImages : ["/placeholder.svg"];
  const thumbnails = finalImages;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.inStock ? 10 : 0)) {
      setQuantity(newQuantity)
    }
  }

  useEffect(() => {
    if (!product.inStock && quantity > 0) {
      setQuantity(0)
    }
  }, [product.inStock])

  const handleBuyNow = async () => {
    try {
      await handleAddToCart()
      window.location.href = '/checkout'
    } catch (error) {
      notify('error', 'Failed to process purchase')
    }
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      const commonProduct: CartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        images: [product.image || '', ...(product.gallery || [])],
        category: product.categories?.[0] || 'General',
        rating: product.rating,
        stock: product.inStock ? 10 : 0,
        brand: 'Brand',
        tags: product.categories || []
      }
      addItem(commonProduct, quantity)
      // Notification is handled by useCart hook
    } catch (error) {
      notify('error', 'Failed to add to cart')
    }
    setIsAddingToCart(false)
  }

  const isInWishlist = wishlistItems.some((item) => item.id === product.id)
  const handleWishlist = () => {
    const wishlistProduct: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: [product.image || '', ...(product.gallery || [])],
      category: product.categories?.[0] || 'General',
      rating: product.rating,
      stock: product.inStock ? 10 : 0,
      brand: 'Brand',
      tags: product.categories || [],
    }
    if (isInWishlist) {
      removeWishlist(product.id)
      notify('success', 'Removed from wishlist')
    } else {
      addWishlist(wishlistProduct)
      notify('success', 'Added to wishlist')
    }
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden h-[400px] cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}>
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 z-10">
                <ZoomIn className="w-5 h-5 text-gray-600" />
              </div>
              {isImgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse z-10">
                  <div className="w-12 h-12 rounded-full border-4 border-b-2 border-gray-300 animate-spin" />
                </div>
              )}
              <Image
                src={finalImages[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover w-full h-full"
                quality={100}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                onLoadingComplete={() => setIsImgLoading(false)}
                onError={() => setIsImgLoading(false)}
                style={isImgLoading ? { visibility: 'hidden' } : {}}
              />
            </div>
            <Lightbox
              open={isLightboxOpen}
              close={() => setIsLightboxOpen(false)}
              plugins={[Zoom]}
              zoom={{
                maxZoomPixelRatio: 5,
                zoomInMultiplier: 2,
              }}
              slides={[
                { src: finalImages[selectedImage] || "/placeholder.svg" }
              ]}
            />
            {/* Thumbnails */}
            <div className="flex gap-3">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                    selectedImage === index ? "border-black" : "border-transparent"
                  }`}
                >
                  <Image
                    src={thumb || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
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
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">{product.name}</h1>
              <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
                              <span className="text-4xl font-bold text-black">E.L {product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-400 line-through">
                  E.L {product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.inStock ? (
                <Badge className="bg-gray-200 text-black border-gray-300">
                  <Check className="w-4 h-4 mr-1" />
                  In Stock
                </Badge>
              ) : (
                <Badge className="bg-gray-200 text-black border-gray-300">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-base font-semibold text-black mb-4">Size</h3>
              <div className="flex gap-3">
                {sizeOptions.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 cursor-pointer ${
                      selectedSize === size
                        ? "bg-black text-white hover:bg-gray-800 shadow-md"
                        : "bg-white hover:border-black hover:text-black"
                    } transition-all duration-300`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-base font-semibold text-black mb-4">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium text-black">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={!product.inStock}
                  className="cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                className="flex-1 py-6 text-lg bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-white"
                disabled={!product.inStock || isAddingToCart}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isAddingToCart ? (
                  <span className="flex items-center">
                    <span className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                    Adding...
                  </span>
                ) : (
                  "Add to Cart"
                )}
              </Button>
              <Button
                className="flex-1 py-6 text-lg bg-gray-700 hover:bg-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-white"
                disabled={!product.inStock}
                onClick={handleBuyNow}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
            </div>

            {/* Wishlist and Share */}
            <div className="flex gap-4">
              <Button
                variant={isInWishlist ? "default" : "outline"}
                className={`flex-1 transition-all duration-300 cursor-pointer ${isInWishlist ? "bg-gray-200 text-black border-gray-400" : "hover:bg-gray-100 hover:text-black hover:border-gray-400"}`}
                onClick={handleWishlist}
              >
                <Heart className={`w-5 h-5 mr-2 ${isInWishlist ? "fill-black text-black" : ""}`} />
                {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
              </Button>
              <div className="relative flex-1">
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-gray-100 hover:text-black hover:border-gray-400 transition-all duration-300 cursor-pointer"
                  onClick={() => setIsShareOpen(!isShareOpen)}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Product
                </Button>
                {isShareOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-2 space-y-2 z-50">
                    <FacebookShareButton url={shareUrl} title={shareTitle} className="w-full">
                      <Button variant="outline" className="w-full justify-start hover:bg-gray-100 hover:text-black">
                        <Facebook className="w-5 h-5 mr-2" />
                        Facebook
                      </Button>
                    </FacebookShareButton>
                    <WhatsappShareButton url={shareUrl} title={shareTitle} className="w-full">
                      <Button variant="outline" className="w-full justify-start hover:bg-gray-100 hover:text-black">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </Button>
                    </WhatsappShareButton>
                    <TwitterShareButton url={shareUrl} title={shareTitle} className="w-full">
                      <Button variant="outline" className="w-full justify-start hover:bg-gray-100 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4l11.733 16h4.267l-11.733-16h-4.267z"/>
                          <path d="M4 20l6.768-6.768"/>
                          <path d="M20 4l-7.232 7.232"/>
                        </svg>
                        X.com 
                      </Button>
                    </TwitterShareButton>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 text-black">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg ">
                <Truck className="w-8 h-8 text-gray-700" />
                <div>
                  <h4 className="font-medium">Fast Delivery</h4>
                  <p className="text-sm text-gray-600">Within 2 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-8 h-8 text-gray-700" />
                <div>
                  <h4 className="font-medium ">Freshness Guaranteed</h4>
                  <p className="text-sm text-gray-600">Baked daily</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <RefreshCw className="w-8 h-8 text-gray-700" />
                <div>
                  <h4 className="font-medium">Natural Ingredients</h4>
                  <p className="text-sm text-gray-600">No preservatives</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <CreditCard className="w-8 h-8 text-gray-700" />
                <div>
                  <h4 className="font-medium">Gift Wrapping</h4>
                  <p className="text-sm text-gray-600">Available on request</p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="pt-6 border-t border-gray-200 text-black">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{product.categories?.[0] || 'General'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Size</p>
                  <p className="font-medium">{selectedSize}</p>
                </div>
                {product.rating && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Rating</p>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-medium">{product.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
