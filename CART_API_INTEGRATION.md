# Cart API Integration

## Overview
تم تحديث نظام السلة ليتكامل مع APIs الجديدة من الباك اند.

## APIs المستخدمة

### 1. إضافة منتج للسلة
- **Route**: `POST /cart/add`
- **Query Params**: `product_id`, `quantity`
- **Response**: 
```json
{
  "success": true,
  "message": "Product added to cart",
  "cart_item_key": "7647966b7343c29048673252e490f736",
  "cart_count": 2,
  "cart_total": "24.00"
}
```

### 2. جلب محتويات السلة
- **Route**: `GET /cart`
- **Response**:
```json
{
  "total_items": 2,
  "total_price": "24.00",
  "items": [
    {
      "key": "7647966b7343c29048673252e490f736",
      "product_id": 89,
      "name": "Hat",
      "quantity": 2,
      "price": "<span class=\"woocommerce-Price-amount amount\"><bdi>12,00&nbsp;<span class=\"woocommerce-Price-currencySymbol\">EGP</span></bdi></span>",
      "total": "<span class=\"woocommerce-Price-amount amount\"><bdi>24,00&nbsp;<span class=\"woocommerce-Price-currencySymbol\">EGP</span></bdi></span>"
    }
  ]
}
```

### 3. تحديث كمية منتج
- **Route**: `PUT /cart/update`
- **Query Params**: `key`, `quantity`
- **Response**:
```json
{
  "success": true,
  "message": "Quantity updated.",
  "cart": {
    "7647966b7343c29048673252e490f736": {
      "key": "7647966b7343c29048673252e490f736",
      "product_id": 89,
      "quantity": 1,
      // ... other fields
    }
  }
}
```

### 4. حذف منتج من السلة
- **Route**: `DELETE /cart/remove`
- **Query Params**: `key`

## الملفات المحدثة

### 1. `src/services/cartService.ts`
- إضافة interfaces جديدة للـ API responses
- تحديث functions لتتوافق مع APIs الجديدة
- إضافة `updateCartItemApi` function

### 2. `src/redux/features/cart/cartSlice.ts`
- إضافة fields جديدة: `isLoading`, `error`, `serverCartCount`, `serverCartTotal`
- إضافة actions جديدة: `setCartLoading`, `setCartError`, `setServerCartData`, `syncCartFromServer`

### 3. `src/redux/features/cart/cartSelectors.ts`
- إضافة selectors جديدة للـ loading state و server data

### 4. `src/hooks/useCart.ts`
- إضافة React Query mutations للـ API calls
- تحديث functions لاستخدام server APIs
- إضافة error handling و loading states
- إضافة sync مع server data

### 5. `src/types/cart.d.ts`
- إضافة `key` field للـ `CartItem` interface

### 6. `src/components/cart/CartItem/cart-item.tsx`
- تحديث component لاستخدام `key` بدلاً من `id` للـ server operations
- إضافة validation للـ key

### 7. `src/app/[locale]/cart/page.tsx`
- إضافة loading و error states
- تحديث لاستخدام server cart count
- إضافة fetch cart data on mount

### 8. `src/components/product/ProductCard/ProductCard.tsx`
- تحديث لاستخدام mutation loading state
- إضافة async/await handling

### 9. `src/components/common/Navbar/Navbar.tsx`
- تحديث لعرض server cart count

### 10. `src/services/orderService.ts`
- إضافة checkout API integration
- إضافة interfaces للـ checkout request/response

### 11. `src/hooks/useCheckout.ts`
- إضافة mutation لإنشاء الطلب
- إضافة error handling و success redirect

## الميزات الجديدة

1. **Server Sync**: السلة تتزامن مع السيرفر تلقائياً
2. **Loading States**: عرض loading indicators أثناء العمليات
3. **Error Handling**: معالجة الأخطاء وعرض notifications
4. **Real-time Updates**: تحديث عدد العناصر في الـ navbar من السيرفر
5. **Optimistic Updates**: تحديث UI فوراً مع sync مع السيرفر

## الاستخدام

### إضافة منتج للسلة
```typescript
const { addItem } = useCart();
addItem(product, quantity);
```

### تحديث كمية
```typescript
const { updateItemQuantity } = useCart();
updateItemQuantity(item.key, newQuantity);
```

### حذف منتج
```typescript
const { removeItem } = useCart();
removeItem(item.key);
```

### إنشاء طلب
```typescript
const { createOrder } = useCheckout();
createOrder(checkoutData);
```

## ملاحظات مهمة

1. جميع العمليات تتطلب authentication token
2. يتم استخدام `key` بدلاً من `id` للعمليات على السيرفر
3. يتم تحويل HTML price strings إلى numbers تلقائياً
4. يتم عرض notifications للنجاح والفشل
5. يتم redirect تلقائياً لصفحة الدفع بعد إنشاء الطلب 