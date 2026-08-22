/**
 * Type definitions for Ebinesar Harvest
 */

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image_url?: string;
  product_count: number;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string;
  display_order: number;
}

export interface Product {
  id: string;
  product_id?: string; // Human-readable Product ID (e.g. EH-PRD-101)
  sku?: string;
  name: string;
  slug: string;
  category_id: string;
  category_name?: string;
  subcategory_id?: string;
  subcategory_name?: string;
  short_description: string;
  description: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  inventory: number;
  weight?: string;
  unit: string; // e.g. "kg", "pack", "jar", "piece", "bundle"
  product_image: string;
  additional_images?: string[];
  images?: string[];
  specifications?: Record<string, string>;
  shipping_information?: string;
  return_information?: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  unit_price: number;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  added_at: string;
}

export interface ShippingAddress {
  id?: string;
  user_id?: string;
  full_name: string;
  phone: string;
  street_address: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  product_image: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total_amount: number;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at?: string;
}

export interface NewsletterSubscription {
  id?: string;
  email: string;
  subscribed_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percentage?: number;
  discount_value?: number;
  discount_type?: 'percentage' | 'fixed';
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_count?: number;
  is_active: boolean;
  expires_at?: string;
}
