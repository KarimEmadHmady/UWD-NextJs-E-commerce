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
    description: "Rich and moist chocolate cake topped with creamy chocolate ganache.",
    id: 1,
    name: "Chocolate Cake",
    price: 120.00,
    originalPrice: 140.00,
    image: "https://images.unsplash.com/photo-1533910534207-90f31029a78e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    reviews: 210,
    category: "Cakes",
    isSale: true,
    discount: 14,
    inStock: true,
  },
  {
    description: "Classic strawberry cheesecake with a buttery biscuit base and fresh strawberries.",
    id: 2,
    name: "Strawberry Cheesecake",
    price: 135.00,
    image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 180,
    category: "Cheesecakes",
    isNew: true,
    inStock: true,
  },
  {
    description: "Traditional Middle Eastern baklava with layers of filo pastry, nuts, and honey syrup.",
    id: 3,
    name: "Baklava",
    price: 90.00,
    originalPrice: 110.00,
    image: "https://images.unsplash.com/photo-1619286310195-9d8789686f6f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 156,
    category: "Oriental Sweets",
    isSale: true,
    discount: 18,
    inStock: true,
  },

  {
    description: "Delicious kunafa with crispy golden threads and sweet cheese filling.",
    id: 4,
    name: "Kunafa",
    price: 100.00,
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
    reviews: 203,
    category: "Oriental Sweets",
    inStock: false,
  },
  {
    description: "Colorful French macarons with assorted flavors and creamy fillings.",
    id: 5,
    name: "Macarons (Box of 6)",
    price: 75.00,
    originalPrice: 90.00,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 78,
    category: "Pastries",
    isSale: true,
    discount: 17,
    inStock: true,
  },
  {
    description: "Classic Italian tiramisu with layers of coffee-soaked ladyfingers and mascarpone cream.",
    id: 6,
    name: "Tiramisu",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    reviews: 45,
    category: "Cakes",
    isNew: true,
    inStock: true,
  },
  {
    description: "Traditional Egyptian basbousa made with semolina and sweet syrup.",
    id: 7,
    name: "Basbousa",
    price: 60.00,
    originalPrice: 75.00,
    image: "https://images.unsplash.com/photo-1514517521153-1be72277b32f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviews: 67,
    category: "Oriental Sweets",
    isSale: true,
    discount: 20,
    inStock: true,
  },
  {
    description: "Freshly baked chocolate chip cookies with gooey chocolate chunks.",
    id: 8,
    name: "Chocolate Chip Cookies (Box of 8)",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.4,
    reviews: 134,
    category: "Cookies",
    inStock: true,
  },
];
