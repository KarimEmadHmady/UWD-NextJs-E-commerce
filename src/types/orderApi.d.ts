// src/types/orderApi.d.ts
export interface CheckoutRequest {
  billing: {
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
  };
  shipping: {
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
  };
  payment_method: string;
  note: string;
  coupon_code: string;
  use_loyalty_points: boolean;
}

export interface CheckoutResponse {
  success: boolean;
  order_id: number;
  order_key: string;
  total: string;
  currency: string;
  message: string;
  payment_url: string;
} 