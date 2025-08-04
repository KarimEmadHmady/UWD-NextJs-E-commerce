# 📁 Types Organization

هذا المجلد يحتوي على جميع الـ TypeScript types المستخدمة في التطبيق، منظمة في ملفات منفصلة حسب الوظيفة.

## 📋 الملفات

### Core Types
- **`cart.d.ts`** - Cart item types
- **`product.d.ts`** - Product related types
- **`category.d.ts`** - Category types
- **`order.d.ts`** - Order types
- **`auth.d.ts`** - Authentication types
- **`user.d.ts`** - User and profile types

### API Types
- **`cartApi.d.ts`** - Cart API response types
- **`orderApi.d.ts`** - Order API request/response types

### Feature Types
- **`checkout.d.ts`** - Checkout process types
- **`address.d.ts`** - Address management types
- **`wishlist.d.ts`** - Wishlist types
- **`search.d.ts`** - Search functionality types
- **`filter.d.ts`** - Filter and sorting types

### UI/State Types
- **`notification.d.ts`** - Notification system types
- **`globalLoading.d.ts`** - Global loading state types
- **`language.d.ts`** - Internationalization types
- **`common.d.ts`** - Common utility types

### Index
- **`index.d.ts`** - Re-exports all types for easy importing

## 🚀 الاستخدام

### Import جميع الـ types
```typescript
import type { CartItem, Product, User } from '@/types';
```

### Import من ملف محدد
```typescript
import type { CartItem } from '@/types/cart';
import type { AddToCartResponse } from '@/types/cartApi';
```

## 📝 قواعد التنظيم

1. **كل type في ملف منفصل** حسب الوظيفة
2. **استخدام `index.d.ts`** لتجميع جميع الـ types
3. **تسمية واضحة** للملفات والـ interfaces
4. **تعليقات توضيحية** لكل interface
5. **تنظيم منطقي** للملفات في مجلدات فرعية إذا لزم الأمر

## 🔄 التحديثات

عند إضافة types جديدة:
1. أنشئ ملف جديد في المجلد المناسب
2. أضف export في `index.d.ts`
3. حدث الـ imports في الملفات المستخدمة
4. تأكد من عدم وجود types مكررة 