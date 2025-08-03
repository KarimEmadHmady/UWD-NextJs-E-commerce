# Category API Integration

## Overview
تم تحديث النظام لاستخدام البيانات الديناميك للكاتيجرى من API بدلاً من البيانات الاستاتيك.

## الملفات المحدثة

### 1. ملفات الخدمات الجديدة
- `src/services/categoryService.ts` - خدمة API للكاتيجرى
- `src/types/category.d.ts` - أنواع البيانات للكاتيجرى
- `src/hooks/useCategories.ts` - Hook للتعامل مع بيانات الكاتيجرى

### 2. الملفات المحدثة
- `src/app/[locale]/categore/page.tsx` - صفحة الكاتيجرى الرئيسية
- `src/app/[locale]/shop/[category]/page.tsx` - صفحة الكاتيجرى الديناميك
- `src/app/[locale]/shop/page.tsx` - صفحة الشوب الرئيسية
- `src/app/[locale]/page.tsx` - صفحة الهوم
- `src/app/[locale]/search/page.tsx` - صفحة البحث
- `src/components/category/category-section.tsx` - مكون عرض الكاتيجرى
- `src/components/shop/filter-sidebar.tsx` - شريط الفلاتر

### 3. الملفات المحذوفة
- `src/components/product/category-data.ts` - البيانات الاستاتيك للكاتيجرى

## API Endpoints المستخدمة

### 1. جلب جميع الكاتيجرى
```
GET /products/categories
```
Response:
```json
[
  {
    "id": 15,
    "name": "Uncategorized",
    "slug": "uncategorized",
    "description": "",
    "count": 0,
    "parent": 0,
    "image": null
  },
  {
    "id": 24,
    "name": "Clothing",
    "slug": "clothing",
    "description": "",
    "count": 24,
    "parent": 0,
    "image": "http://example.com/image.jpg"
  }
]
```

### 2. جلب كاتيجرى واحد بالـ ID أو Slug
```
GET /products/category/:id
GET /products/category/:slug
```
Response:
```json
{
  "category": "Accessories",
  "category_id": 27,
  "page": 1,
  "per_page": 10,
  "total": 9,
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

## الميزات الجديدة

### 1. Loading States
- تم إضافة حالات التحميل لجميع الصفحات
- Skeleton loading للكاتيجرى والمنتجات

### 2. Error Handling
- معالجة الأخطاء لجميع طلبات API
- رسائل خطأ واضحة للمستخدم

### 3. Dynamic Routing
- استخدام slug بدلاً من الاسم المحول
- دعم الـ ID والـ Slug للكاتيجرى

### 4. Real-time Data
- البيانات تتحدث تلقائياً من API
- عدد المنتجات في كل كاتيجرى يتم حسابه ديناميكياً

### 5. Image Fallback
- معالجة الصور الفارغة (null)
- عرض الحرف الأول من اسم الكاتيجرى كبديل

## كيفية الاستخدام

### 1. في المكونات
```typescript
import { useCategories } from '@/hooks/useCategories';

function MyComponent() {
  const { categories, loading, error } = useCategories();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          {category.image ? (
            <img src={category.image} alt={category.name} />
          ) : (
            <div className="placeholder">{category.name.charAt(0)}</div>
          )}
          <span>{category.name}</span>
          <span>({category.count} items)</span>
        </div>
      ))}
    </div>
  );
}
```

### 2. في الصفحات الديناميك
```typescript
import { useCategoryBySlug } from '@/hooks/useCategories';

function CategoryPage({ params }) {
  const { categoryData, loading, error } = useCategoryBySlug(params.category);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{categoryData.category}</h1>
      <p>{categoryData.total} products available</p>
      <div>
        {categoryData.products.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </div>
  );
}
```

## التحديثات المستقبلية

1. إضافة caching للبيانات
2. إضافة pagination للكاتيجرى
3. إضافة search للكاتيجرى
4. إضافة sorting للكاتيجرى
5. إضافة admin panel لإدارة الكاتيجرى
6. إضافة category hierarchy (parent/child relationships) 