# Authentication API Integration

## Overview
تم تحديث النظام لاستخدام نظام مصادقة متكامل مع تسجيل الدخول والتسجيل الجديد وإدارة الجلسات.

## الملفات المحدثة

### 1. ملفات الخدمات
- `src/services/authService.ts` - خدمة API للمصادقة
- `src/types/auth.d.ts` - أنواع البيانات للمصادقة
- `src/hooks/useAuth.ts` - Hook للتعامل مع المصادقة

### 2. الملفات المحدثة
- `src/app/[locale]/login/page.tsx` - صفحة تسجيل الدخول
- `src/app/[locale]/register/page.tsx` - صفحة التسجيل الجديد
- `src/components/auth/LoginForm.tsx` - نموذج تسجيل الدخول
- `src/components/auth/RegisterForm.tsx` - نموذج التسجيل الجديد
- `src/components/common/Navbar.tsx` - شريط التنقل مع حالة المصادقة

## API Endpoints المستخدمة

### 1. تسجيل الدخول
```
POST /auth/login
```
Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "+1234567890",
      "avatar": "http://example.com/avatar.jpg",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here"
  }
}
```

### 2. التسجيل الجديد
```
POST /auth/register
```
Request:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+1234567890"
}
```
Response:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "+1234567890",
      "avatar": null,
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here"
  }
}
```

### 3. تسجيل الخروج
```
POST /auth/logout
```
Headers:
```
Authorization: Bearer {token}
```
Response:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 4. تحديث Token
```
POST /auth/refresh
```
Request:
```json
{
  "refresh_token": "refresh_token_here"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "token": "new_access_token_here",
    "refresh_token": "new_refresh_token_here"
  }
}
```

### 5. معلومات المستخدم
```
GET /auth/me
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
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "+1234567890",
      "avatar": "http://example.com/avatar.jpg",
      "role": "customer",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 6. نسيان كلمة المرور
```
POST /auth/forgot-password
```
Request:
```json
{
  "email": "user@example.com"
}
```
Response:
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

### 7. إعادة تعيين كلمة المرور
```
POST /auth/reset-password
```
Request:
```json
{
  "token": "reset_token_here",
  "email": "user@example.com",
  "password": "new_password123",
  "password_confirmation": "new_password123"
}
```
Response:
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

## أنواع البيانات

### User Interface
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
}
```

### LoginRequest Interface
```typescript
export interface LoginRequest {
  email: string;
  password: string;
}
```

### RegisterRequest Interface
```typescript
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
}
```

### AuthResponse Interface
```typescript
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refresh_token: string;
  };
}
```

## الميزات الجديدة

### 1. تسجيل الدخول
- نموذج تسجيل دخول متقدم
- التحقق من صحة البيانات
- رسائل خطأ واضحة
- تذكر المستخدم (Remember me)
- إعادة توجيه تلقائي بعد تسجيل الدخول

### 2. التسجيل الجديد
- نموذج تسجيل شامل
- التحقق من صحة البريد الإلكتروني
- التحقق من تطابق كلمات المرور
- التحقق من قوة كلمة المرور
- إرسال رمز التحقق (اختياري)

### 3. إدارة الجلسات
- حفظ Token في localStorage
- تحديث Token تلقائياً
- تسجيل الخروج من جميع الأجهزة
- حماية الصفحات المحمية

### 4. استعادة كلمة المرور
- نسيان كلمة المرور
- إرسال رابط إعادة التعيين
- إعادة تعيين كلمة المرور
- التحقق من صحة الرابط

### 5. واجهة المستخدم
- حالة المصادقة في Navbar
- قائمة المستخدم المنسدلة
- إشعارات تسجيل الدخول/الخروج
- Loading states للنماذج

## كيفية الاستخدام

### 1. تسجيل الدخول
```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginForm() {
  const { login, isLoading, error } = useAuth();
  
  const handleSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      // Redirect to dashboard or previous page
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### 2. التسجيل الجديد
```typescript
import { useAuth } from '@/hooks/useAuth';

function RegisterForm() {
  const { register, isLoading, error } = useAuth();
  
  const handleSubmit = async (data: RegisterRequest) => {
    try {
      await register(data);
      // Redirect to login or dashboard
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <input type="password" name="password_confirmation" required />
      <input type="tel" name="phone" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### 3. التحقق من حالة المصادقة
```typescript
import { useAuth } from '@/hooks/useAuth';

function ProtectedComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login to continue</div>;
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>You are logged in as: {user?.email}</p>
    </div>
  );
}
```

### 4. تسجيل الخروج
```typescript
import { useAuth } from '@/hooks/useAuth';

function LogoutButton() {
  const { logout, isLoading } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
```

## التحديثات المستقبلية

1. إضافة Two-Factor Authentication (2FA)
2. إضافة Social Login (Google, Facebook, etc.)
3. إضافة Email Verification
4. إضافة Phone Verification
5. إضافة Account Settings
6. إضافة Profile Management
7. إضافة Session Management
8. إضافة Audit Logs 