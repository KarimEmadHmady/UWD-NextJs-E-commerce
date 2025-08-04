// src/types/checkout.d.ts
export interface CheckoutAddress {
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface CheckoutShippingMethod {
  id: string;
  name: string;
  cost: number;
  estimated_days: string;
}

export interface CheckoutPaymentMethod {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface CheckoutReview {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items_count: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
} 