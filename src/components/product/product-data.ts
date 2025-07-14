import type { CartItem, Product as CommonProduct } from '@/types/common'

export interface Product extends Omit<CommonProduct, 'images' | 'stock' | 'brand' | 'tags'> {
  image: string;
  reviews: number;
  originalPrice?: number;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
  inStock: boolean;
}

// Convert product for cart
export const convertToCartProduct = (product: Product): CartItem => ({
  id: product.id,
  name: product.name,
  price: product.price,
  description: product.description,
  images: [product.image],
  category: product.category,
  quantity: 1,
  stock: product.inStock ? 10 : 0,
  brand: 'Apple',
  tags: [product.category],
  rating: product.rating
})

export const products: Product[] = [
  {
    description: "Powerful laptop with M3 chip, perfect for professionals and creatives.",
    id: 1,
    name: "MacBook Pro M3 14-inch",
    price: 1999.99,
    originalPrice: 2299.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 124,
    category: "Laptops",
    isSale: true,
    discount: 13,
    inStock: true,
  },
  {
    description: "Latest iPhone with advanced camera system and titanium design.",
    id: 2,
    name: "iPhone 15 Pro Max",
    price: 1199.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 89,
    category: "Smartphones",
    isNew: true,
    inStock: true,
  },
  {
    description: "Versatile tablet for work and entertainment with M2 chip.",
    id: 3,
    name: "iPad Air M2",
    price: 599.99,
    originalPrice: 699.99,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviews: 156,
    category: "Tablets",
    isSale: true,
    discount: 14,
    inStock: true,
  },
  {
    description: "Premium wireless earbuds with active noise cancellation.",
    id: 4,
    name: "AirPods Pro 2nd Gen",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    reviews: 203,
    category: "Audio",
    inStock: false,
  },
  {
    description: "Advanced smartwatch with health monitoring and fitness tracking.",
    id: 5,
    name: "Apple Watch Series 9",
    price: 399.99,
    originalPrice: 449.99,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 78,
    category: "Wearables",
    isSale: true,
    discount: 11,
    inStock: true,
  },
  {
    description: "Professional desktop computer for demanding workflows.",
    id: 6,
    name: "Mac Studio M2 Ultra",
    price: 3999.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 45,
    category: "Desktops",
    isNew: true,
    inStock: true,
  },
  {
    description: "Stunning 27-inch 5K Retina display for creative professionals.",
    id: 7,
    name: "Studio Display 27-inch",
    price: 1599.99,
    originalPrice: 1799.99,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    rating: 4.5,
    reviews: 67,
    category: "Monitors",
    isSale: true,
    discount: 11,
    inStock: true,
  },
  {
    description: "Wireless keyboard with Touch ID for secure authentication.",
    id: 8,
    name: "Magic Keyboard with Touch ID",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    rating: 4.4,
    reviews: 134,
    category: "Accessories",
    inStock: true,
  },
];
