import type { CartItem } from '@/types/cart'
import type { Product as ApiProduct, CartProduct } from '@/types/product'

export interface Product extends Omit<ApiProduct, 'price' | 'regular_price' | 'sale_price' | 'stock_quantity' | 'stock_status'> {
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
  inStock: boolean;
  rating: number;
  reviews: number;
}

// Convert API product to UI product
export const convertApiProductToUI = (apiProduct: ApiProduct): Product => {
  const price = parseFloat(String(apiProduct.price));
  const regularPrice = parseFloat(apiProduct.regular_price || '0');
  const salePrice = apiProduct.sale_price ? parseFloat(apiProduct.sale_price) : null;
  
  const isSale = !!salePrice && salePrice < regularPrice;
  const discount = isSale ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;
  
  return {
    ...apiProduct,
    price: salePrice || price,
    originalPrice: isSale ? regularPrice : undefined,
    isSale,
    discount,
    inStock: apiProduct.stock_status === 'instock',
    rating: 4.5, // Default rating since API doesn't provide it
    reviews: Math.floor(Math.random() * 200) + 10, // Random reviews for now
  };
};

// Convert product for cart
export const convertToCartProduct = (product: Product): CartItem => ({
  id: product.id,
  name: product.name,
  price: product.price,
  description: product.description,
  images: [product.image || '', ...(product.gallery || [])],
  category: product.categories?.[0]?.name || 'General',
  quantity: 1,
  stock: product.inStock ? 10 : 0,
  brand: 'Brand', // Default brand
  tags: product.categories?.map((category) => category.name) || [],
  rating: product.rating
});

// Convert API product to CartProduct for wishlist
export const convertProductToCartProduct = (product: ApiProduct): CartProduct => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: parseFloat(String(product.price)),
  images: [product.image || '', ...(product.gallery || [])],
  category: product.categories?.[0]?.name || 'General',
  rating: 4.5, // Default rating
  stock: product.stock_quantity || 0,
  brand: 'Brand', // Default brand
  tags: product.categories?.map((category) => category.name) || [],
});

// Legacy products array for backward compatibility
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
    categories: [{ id: 1, name: "Cakes" }],
    isSale: true,
    discount: 14,
    inStock: true,
    slug: "chocolate-cake",
    short_description: "Rich and moist chocolate cake",
    gallery: [],
    permalink: "",
  },
  {
    description: "Classic strawberry cheesecake with a buttery biscuit base and fresh strawberries.",
    id: 2,
    name: "Strawberry Cheesecake",
    price: 135.00,
    image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 180,
    categories: [{ id: 1, name: "Cheesecakes" }],
    isNew: true,
    inStock: true,
    slug: "strawberry-cheesecake",
    short_description: "Classic strawberry cheesecake",
    gallery: [],
    permalink: "",
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
    categories: [{ id: 1, name: "Oriental Sweets" }],
    isSale: true,
    discount: 18,
    inStock: true,
    slug: "baklava",
    short_description: "Traditional Middle Eastern baklava",
    gallery: [],
    permalink: "",
  },
  {
    description: "Delicious kunafa with crispy golden threads and sweet cheese filling.",
    id: 4,
    name: "Kunafa",
    price: 100.00,
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
    reviews: 203,
    categories: [{ id: 1, name: "Oriental Sweets" }],
    inStock: false,
    slug: "kunafa",
    short_description: "Delicious kunafa with crispy golden threads",
    gallery: [],
    permalink: "",
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
    categories: [{ id: 1, name: "Pastries" }],
    isSale: true,
    discount: 17,
    inStock: true,
    slug: "macarons-box-6",
    short_description: "Colorful French macarons",
    gallery: [],
    permalink: "",
  },
  {
    description: "Classic Italian tiramisu with layers of coffee-soaked ladyfingers and mascarpone cream.",
    id: 6,
    name: "Tiramisu",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    reviews: 45,
    categories: [{ id: 1, name: "Cakes" }],
    isNew: true,
    inStock: true,
    slug: "tiramisu",
    short_description: "Classic Italian tiramisu",
    gallery: [],
    permalink: "",
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
    categories: [{ id: 1, name: "Oriental Sweets" }],
    isSale: true,
    discount: 20,
    inStock: true,
    slug: "basbousa",
    short_description: "Traditional Egyptian basbousa",
    gallery: [],
    permalink: "",
  },
  {
    description: "Freshly baked chocolate chip cookies with gooey chocolate chunks.",
    id: 8,
    name: "Chocolate Chip Cookies (Box of 8)",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.4,
    reviews: 134,
    categories: [{ id: 1, name: "Cookies" }],
    inStock: true,
    slug: "chocolate-chip-cookies-box-8",
    short_description: "Freshly baked chocolate chip cookies",
    gallery: [],
    permalink: "",
  },
];
