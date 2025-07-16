# Next.js E-commerce Project

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Mock Data](#mock-data)
- [State Management (Redux)](#state-management-redux)
- [UI Components](#ui-components)
- [Custom Hooks](#custom-hooks)
- [Libraries Used](#libraries-used)
- [How to Run](#how-to-run)
- [Future Improvements](#future-improvements)

---

## Project Overview

A modern, fully dynamic e-commerce web app built with **Next.js** and **Redux**. All data, filters, search, and notifications are dynamic, with a modern, customizable UI.

---

## Features

- Dynamic product & category display (from mock data)
- Powerful filtering (category, price, quantity, size, etc.)
- Live search with instant results
- Notification system with icons and smart positioning
- Responsive, modern UI (Tailwind CSS, Radix UI)
- State management with Redux Toolkit
- Easy to switch to real API/data source
- Fully dynamic and easily extensible
- Complete support for filters, search, and notifications
- Modern, responsive, and user-friendly interface

---

## Project Structure

```
src/
  app/
    [locale]/
      search/page.tsx      # Search page
      shop/page.tsx        # Main shop page
      category/page.tsx    # Category listing
  components/
    common/                # Reusable UI components (Button, Input, Card, etc.)
    product/               # Product/category data & display components
  redux/
    features/              # Redux slices (filter, cart, user, etc.)
    store.ts               # Redux store setup
  hooks/                   # Custom React hooks
  styles/                  # CSS/Tailwind styles
  ...
```

**Folder details:**
- `components/common/`: General UI components (Button, Input, Card, Slider, etc.)
- `components/product/`: Product and category mock data, product cards, product details
- `redux/features/`: Redux slices for filters, cart, user, etc.
- `hooks/`: Custom hooks for state and data management

---

## Mock Data

### Product Data (`product-data.ts`)
- Structure:
  ```ts
  {
    id: number,
    name: string,
    description: string,
    price: number,
    image: string,
    category: string,
    rating: number,
    reviews: number,
    originalPrice?: number,
    isNew?: boolean,
    isSale?: boolean,
    discount?: number,
    inStock: boolean
  }
  ```
- Used for: All product displays, filtering, search, and product counts.

### Category Data (`category-data.ts`)
- Structure:
  ```ts
  {
    id: number,
    name: string,
    image: string,
    description: string
  }
  ```
- Used for: Category grid, filter sidebar, and product count per category.

All data is dynamic and can be easily replaced with real data later.

---

## State Management (Redux)

- **Redux Toolkit** is used for state management.
- Main slice: `filterSlice.ts`
  - Manages: selected categories, quantities, sizes, brands, price range, etc.
  - Used in: shop page, search page, filter sidebar.
- Store setup: `redux/store.ts`
- Custom hooks: `useFilter.ts` for easy access to filter state.

All filters and search depend on Redux state for consistency and easy extensibility.

---

## UI Components

### Common Components
- **Button** (`Button.tsx`): Customizable button
- **Input** (`input.tsx`): Styled input field
- **Card** (`card.tsx`): Card container for content
- **Badge** (`Badge.tsx`): Status/number badge
- **Checkbox** (`checkbox.tsx`): Custom checkbox
- **Slider** (`slider.tsx`): Price range slider
- **Accordion, Tabs, RadioGroup, DropdownMenu, Label, Skeleton, Avatar, Navbar, Footer, NotificationContainer, RevealOnScroll, ScrollToTopButton, GlobalLoadingOverlay**: All built for modular, modern UI.

### Product & Category Components
- **ShopProductCard**: Compact product card for grid/listing
- **ProductCard**: Alternative product card
- **ProductDetails**: Full product details view
- **CategorySection**: Dynamic category grid with product counts

### Notification System
- **NotificationContainer**: Shows notifications with icons, centered at the top, auto-dismiss, supports different types (success, error, info, etc.)

---

## Custom Hooks

- `useFilter`: Access and update filter state
- `useSearch`: Search logic and state
- `useWishlist`, `useCart`, `useCheckout`, `useOrders`, `useUser`, `useLang`, `useNotifications`, `useGlobalLoading`, `useAuth`, `useDebounce`, etc.

Custom hooks simplify state/data management and reduce code duplication.

---

## Libraries Used

### Main Libraries
- **Next.js**: React framework for SSR/SSG
- **React**: UI library
- **Redux Toolkit**: State management
- **React Redux**: Redux bindings for React
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible, unstyled UI primitives (Accordion, Avatar, Checkbox, DropdownMenu, Label, RadioGroup, Slider, Tabs)
- **Lucide React**: Icon library
- **Framer Motion**: Animations
- **next-intl**: Internationalization (i18n)
- **clsx**: Conditional classNames
- **sonner**: Toast notifications
- **react-icons**: Additional icons
- **react-leaflet, leaflet**: Maps (if used)
- **react-medium-image-zoom**: Image zoom
- **yet-another-react-lightbox**: Lightbox for images
- **tailwind-merge**: Utility class merging

### Dev Libraries
- **TypeScript**: Type safety
- **@types/**: Type definitions for TypeScript
- **@tailwindcss/postcss**: Tailwind integration

All libraries are carefully chosen for performance, developer experience, and user experience.

---

## How to Run

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## Future Improvements

- Connect to real API/database
- User authentication & cart/checkout
- Multi-language support
- Order history, user profile, wishlist
- Advanced analytics & admin dashboard

---

## Summary

- **Everything is dynamic**: All data, filters, and UI are based on real mock data.
- **Modern, responsive UI**: Built with Tailwind, Radix, and custom components.
- **Powerful state management**: Redux Toolkit for all filters and global state.
- **Easy to extend**: Add new features, filters, or connect to real data with minimal changes.

---

