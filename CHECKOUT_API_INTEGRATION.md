# Checkout API Integration

## Overview
تم تحديث النظام لاستخدام نظام اتصال متكامل مع إدارة العناوين والمدفوعات والتأكيد.

## الملفات المحدثة

### 1. ملفات الخدمات
- `src/services/checkoutService.ts` - خدمة API للاتشيك اوت
- `src/services/addressService.ts` - خدمة API للعناوين
- `src/services/orderService.ts` - خدمة API للطلبات
- `src/types/checkout.d.ts` - أنواع البيانات للاتشيك اوت
- `src/types/order.d.ts` - أنواع البيانات للطلبات

### 2. الملفات المحدثة
- `src/app/[locale]/checkout/page.tsx` - صفحة الاتشيك اوت
- `src/app/[locale]/order-confirmation/page.tsx` - صفحة تأكيد الطلب
- `src/components/checkout/CheckoutForm.tsx` - نموذج الاتشيك اوت
- `src/components/checkout/AddressForm.tsx` - نموذج العنوان
- `src/components/checkout/PaymentForm.tsx` - نموذج الدفع

## API Endpoints المستخدمة

### 1. إنشاء طلب جديد
```
POST /orders
```
Request:
```json
{
  "customer_info": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_1": "123 Main St",
    "address_2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postcode": "10001",
    "country": "US",
    "phone": "+1234567890"
  },
  "billing_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_1": "123 Main St",
    "address_2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postcode": "10001",
    "country": "US",
    "phone": "+1234567890"
  },
  "payment_method": "stripe",
  "payment_token": "tok_visa",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 25.99
    }
  ],
  "shipping_method": "standard",
  "notes": "Please deliver in the morning"
}
```
Response:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 12345,
      "order_number": "ORD-2024-001",
      "status": "pending",
      "total": 51.98,
      "subtotal": 51.98,
      "shipping": 0,
      "tax": 0,
      "discount": 0,
      "customer_info": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "shipping_address": {
        "first_name": "John",
        "last_name": "Doe",
        "address_1": "123 Main St",
        "address_2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "postcode": "10001",
        "country": "US",
        "phone": "+1234567890"
      },
      "billing_address": {
        "first_name": "John",
        "last_name": "Doe",
        "address_1": "123 Main St",
        "address_2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "postcode": "10001",
        "country": "US",
        "phone": "+1234567890"
      },
      "items": [
        {
          "id": 1,
          "product_id": 1,
          "product_name": "Product Name",
          "quantity": 2,
          "price": 25.99,
          "total": 51.98
        }
      ],
      "payment_method": "stripe",
      "shipping_method": "standard",
      "notes": "Please deliver in the morning",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 2. جلب تفاصيل الطلب
```
GET /orders/:id
```
Response:
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 12345,
      "order_number": "ORD-2024-001",
      "status": "processing",
      "total": 51.98,
      "subtotal": 51.98,
      "shipping": 0,
      "tax": 0,
      "discount": 0,
      "customer_info": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "shipping_address": {
        "first_name": "John",
        "last_name": "Doe",
        "address_1": "123 Main St",
        "address_2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "postcode": "10001",
        "country": "US",
        "phone": "+1234567890"
      },
      "billing_address": {
        "first_name": "John",
        "last_name": "Doe",
        "address_1": "123 Main St",
        "address_2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "postcode": "10001",
        "country": "US",
        "phone": "+1234567890"
      },
      "items": [
        {
          "id": 1,
          "product_id": 1,
          "product_name": "Product Name",
          "product_image": "http://example.com/image.jpg",
          "quantity": 2,
          "price": 25.99,
          "total": 51.98
        }
      ],
      "payment_method": "stripe",
      "shipping_method": "standard",
      "tracking_number": "TRK123456789",
      "notes": "Please deliver in the morning",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 3. جلب طلبات المستخدم
```
GET /orders
```
Headers:
```
Authorization: Bearer {token}
```
Response:
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 12345,
        "order_number": "ORD-2024-001",
        "status": "completed",
        "total": 51.98,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 1,
      "total_pages": 1
    }
  }
}
```

### 4. إلغاء الطلب
```
POST /orders/:id/cancel
```
Headers:
```
Authorization: Bearer {token}
```
Response:
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

### 5. إعادة الطلب
```
POST /orders/:id/reorder
```
Headers:
```
Authorization: Bearer {token}
```
Response:
```json
{
  "success": true,
  "message": "Order recreated successfully",
  "data": {
    "order_id": 12346
  }
}
```

### 6. حساب الشحن
```
POST /shipping/calculate
```
Request:
```json
{
  "address": {
    "city": "New York",
    "state": "NY",
    "postcode": "10001",
    "country": "US"
  },
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "weight": 0.5
    }
  ]
}
```
Response:
```json
{
  "success": true,
  "data": {
    "methods": [
      {
        "id": "standard",
        "name": "Standard Shipping",
        "price": 5.99,
        "delivery_time": "3-5 business days"
      },
      {
        "id": "express",
        "name": "Express Shipping",
        "price": 12.99,
        "delivery_time": "1-2 business days"
      }
    ]
  }
}
```

### 7. التحقق من الكوبون
```
POST /coupons/validate
```
Request:
```json
{
  "code": "SAVE10",
  "subtotal": 100.00
}
```
Response:
```json
{
  "success": true,
  "data": {
    "coupon": {
      "id": 1,
      "code": "SAVE10",
      "type": "percentage",
      "value": 10,
      "discount": 10.00,
      "minimum_amount": 50.00
    }
  }
}
```

## أنواع البيانات

### Order Interface
```typescript
export interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  customer_info: CustomerInfo;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
  payment_method: string;
  shipping_method: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

### CustomerInfo Interface
```typescript
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}
```

### Address Interface
```typescript
export interface Address {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
}
```

### OrderItem Interface
```typescript
export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
  total: number;
}
```

### CheckoutRequest Interface
```typescript
export interface CheckoutRequest {
  customer_info: CustomerInfo;
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  payment_token: string;
  items: CheckoutItem[];
  shipping_method: string;
  notes?: string;
}
```

## الميزات الجديدة

### 1. عملية الاتشيك اوت
- نموذج اتصال شامل
- التحقق من صحة البيانات
- حساب الشحن التلقائي
- تطبيق الكوبونات
- معاينة الطلب

### 2. إدارة العناوين
- حفظ العناوين المفضلة
- التحقق من صحة العنوان
- حساب الشحن حسب المنطقة
- عنوان الشحن والفواتير منفصلان

### 3. طرق الدفع
- Stripe Integration
- PayPal Integration
- Cash on Delivery
- Bank Transfer
- حفظ طرق الدفع المفضلة

### 4. تتبع الطلبات
- حالة الطلب في الوقت الفعلي
- رقم التتبع
- تاريخ التسليم المتوقع
- إشعارات حالة الطلب

### 5. إدارة الطلبات
- عرض جميع الطلبات
- تفاصيل الطلب الكاملة
- إلغاء الطلب
- إعادة الطلب
- تحميل الفاتورة

## كيفية الاستخدام

### 1. إنشاء طلب جديد
```typescript
import { useCheckout } from '@/hooks/useCheckout';

function CheckoutForm() {
  const { createOrder, isLoading, error } = useCheckout();
  
  const handleSubmit = async (data: CheckoutRequest) => {
    try {
      const order = await createOrder(data);
      // Redirect to order confirmation
      router.push(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Customer Info */}
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      <input type="tel" name="phone" required />
      
      {/* Shipping Address */}
      <input type="text" name="shipping_first_name" required />
      <input type="text" name="shipping_last_name" required />
      <input type="text" name="shipping_address_1" required />
      <input type="text" name="shipping_city" required />
      <input type="text" name="shipping_state" required />
      <input type="text" name="shipping_postcode" required />
      
      {/* Payment Method */}
      <select name="payment_method" required>
        <option value="stripe">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="cod">Cash on Delivery</option>
      </select>
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Place Order'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### 2. عرض تفاصيل الطلب
```typescript
import { useOrder } from '@/hooks/useOrder';

function OrderDetails({ orderId }) {
  const { data: order, isLoading, error } = useOrder(orderId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Order #{order.order_number}</h1>
      <p>Status: {order.status}</p>
      <p>Total: ${order.total}</p>
      
      <h2>Items</h2>
      {order.items.map(item => (
        <div key={item.id}>
          <img src={item.product_image} alt={item.product_name} />
          <h3>{item.product_name}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ${item.price}</p>
        </div>
      ))}
      
      <h2>Shipping Address</h2>
      <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
      <p>{order.shipping_address.address_1}</p>
      <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postcode}</p>
    </div>
  );
}
```

### 3. حساب الشحن
```typescript
import { useShipping } from '@/hooks/useShipping';

function ShippingCalculator({ address, items }) {
  const { calculateShipping, methods, isLoading } = useShipping();
  
  useEffect(() => {
    if (address && items.length > 0) {
      calculateShipping({ address, items });
    }
  }, [address, items]);
  
  return (
    <div>
      <h3>Shipping Methods</h3>
      {isLoading ? (
        <div>Calculating shipping...</div>
      ) : (
        methods.map(method => (
          <div key={method.id}>
            <input type="radio" name="shipping_method" value={method.id} />
            <label>
              {method.name} - ${method.price} ({method.delivery_time})
            </label>
          </div>
        ))
      )}
    </div>
  );
}
```

## التحديثات المستقبلية

1. إضافة Multiple Payment Gateways
2. إضافة Subscription Orders
3. إضافة Order Modifications
4. إضافة Return/Refund System
5. إضافة Order Notifications
6. إضافة Order Analytics
7. إضافة Bulk Order Processing
8. إضافة Order Export/Import 