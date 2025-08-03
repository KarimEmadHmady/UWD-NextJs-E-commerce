# Products API Integration

## Overview
تم تحديث النظام لاستخدام البيانات الديناميك للمنتجات من API بدلاً من البيانات الاستاتيك.

## الملفات المحدثة

### 1. ملفات الخدمات
- `src/services/productService.ts` - خدمة API للمنتجات
- `src/types/product.d.ts` - أنواع البيانات للمنتجات
- `src/hooks/useProducts.ts` - Hook للتعامل مع بيانات المنتجات

### 2. الملفات المحدثة
- `src/app/[locale]/shop/page.tsx` - صفحة الشوب الرئيسية
- `src/app/[locale]/shop/[category]/page.tsx` - صفحة الكاتيجرى الديناميك
- `src/app/[locale]/product/[id]/page.tsx` - صفحة تفاصيل المنتج
- `src/app/[locale]/search/page.tsx` - صفحة البحث
- `src/app/[locale]/page.tsx` - صفحة الهوم
- `src/components/product/ProductCard.tsx` - مكون بطاقة المنتج
- `src/components/product/ShopProductCard.tsx` - مكون بطاقة المنتج للشوب
- `src/components/product/ProductDetails.tsx` - مكون تفاصيل المنتج

## API Endpoints المستخدمة

### 1. جلب جميع المنتجات
```
GET /products
```
Response:
```json
{
  "page": 1,
  "per_page": 10,
  "total": 100,
  "total_pages": 10,
  "products": [
    {
      "id": 89,
      "name": "Hat",
      "slug": "hat",
      "price": "12",
      "regular_price": "12",
      "sale_price": "",
      "stock_status": "instock",
      "stock_quantity": 17,
      "short_description": "This is a simple product.",
      "description": "Product description...",
      "categories": ["Accessories"],
      "image": "http://example.com/image.jpg",
      "gallery": [],
      "permalink": "http://example.com/product/89"
    }
  ]
}
```

### 2. جلب منتج واحد بالـ ID
```
GET /product/:id
```
Response:
```json
{
  "id": 89,
  "name": "Hat",
  "slug": "hat",
  "price": "12",
  "regular_price": "12",
  "sale_price": "",
  "stock_status": "instock",
  "stock_quantity": 17,
  "short_description": "This is a simple product.",
  "description": "Product description...",
  "categories": ["Accessories"],
  "image": "http://example.com/image.jpg",
  "gallery": [
    "http://example.com/image1.jpg",
    "http://example.com/image2.jpg"
  ],
  "permalink": "http://example.com/product/89"
}
```

### 3. البحث في المنتجات
```
GET /products?search=hat
```
Response:
```json
{
  "page": 1,
  "per_page": 10,
  "total": 5,
  "total_pages": 1,
  "products": [
    {
      "id": 89,
      "name": "Hat",
      "slug": "hat",
      "price": "12",
      "regular_price": "12",
      "sale_price": "",
      "stock_status": "instock",
      "stock_quantity": 17,
      "short_description": "This is a simple product.",
      "description": "Product description...",
      "categories": ["Accessories"],
      "image": "http://example.com/image.jpg",
      "gallery": [],
      "permalink": "http://example.com/product/89"
    }
  ]
}
```

## أنواع البيانات

### Product Interface
```typescript
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: string;
  stock_quantity: number | null;
  short_description: string;
  description: string;
  categories: string[];
  image: string;
  gallery: string[];
  permalink: string;
}
```

### ProductsResponse Interface
```typescript
export interface ProductsResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  products: Product[];
}
```

## الميزات الجديدة

### 1. Loading States
- تم إضافة حالات التحميل لجميع الصفحات
- Skeleton loading للمنتجات
- Loading spinner أثناء جلب البيانات

### 2. Error Handling
- معالجة الأخطاء لجميع طلبات API
- رسائل خطأ واضحة للمستخدم
- Retry mechanism للطلبات الفاشلة

### 3. Pagination
- دعم التصفح عبر الصفحات
- Infinite scroll للمنتجات
- Load more functionality

### 4. Search & Filtering
- البحث في المنتجات
- فلترة حسب الكاتيجرى
- فلترة حسب السعر
- فلترة حسب الحجم والكمية

### 5. Product Details
- صفحة تفاصيل كاملة للمنتج
- معرض الصور
- معلومات المخزون
- الأسعار العادية والخصم

## كيفية الاستخدام

### 1. في المكونات
```typescript
import { useAllProducts } from '@/hooks/useProducts';

function ProductsList() {
  const { data: products, isLoading, error } = useAllProducts();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {products?.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 2. في صفحة المنتج الواحد
```typescript
import { useProduct } from '@/hooks/useProducts';

function ProductPage({ params }) {
  const { data: product, isLoading, error } = useProduct(params.id);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>Price: ${product.price}</span>
    </div>
  );
}
```

### 3. البحث في المنتجات
```typescript
import { useSearchProducts } from '@/hooks/useProducts';

function SearchPage({ searchQuery }) {
  const { data: searchResults, isLoading, error } = useSearchProducts(searchQuery);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {searchResults?.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## التحديثات المستقبلية

1. إضافة caching للبيانات
2. إضافة wishlist functionality
3. إضافة product reviews
4. إضافة product variants
5. إضافة product recommendations
6. إضافة product comparison
7. إضافة product sharing
8. إضافة product analytics 