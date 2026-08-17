export type ViewMode =
  | 'home'
  | 'shop'
  | 'categories'
  | 'orders'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'shipping-policy'
  | 'refund-policy'
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  category_id?: string;
  price: number;
  original_price: number;
  discount: number; // percentage (e.g. 15 for 15% off)
  stock: number;
  rating: number;
  reviews_count: number;
  short_description: string;
  full_description: string;
  specifications: Record<string, string>;
  shipping_info: string;
  return_info: string;
  images: string[];
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  
  // Private dropshipping fields (Admin only, stripped from customer endpoints)
  supplier_info?: {
    supplier_name: string;
    supplier_sku: string;
    supplier_cost: number;
    supplier_url: string;
    supplier_contact: string;
    supplier_notes: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon_name: string;
  item_count?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'admin';
  avatar_url?: string;
  created_at: string;
}

export interface Address {
  id: string;
  user_id?: string;
  recipient_name: string;
  phone: string;
  email: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  shipping_address: Address;
  tracking_number?: string;
  tracking_carrier?: string;
  tracking_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified_purchase: boolean;
}

export interface Coupon {
  code: string;
  discount_percent: number;
  min_order_amount: number;
  description: string;
}

export interface RazorpayOrderResponse {
  order_id: string;
  amount: number; // in paise
  currency: string;
  key_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  is_mock?: boolean;
}

export interface AdminMetrics {
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_products: number;
  low_stock_count: number;
  out_of_stock_count: number;
  recent_orders: Order[];
  total_emails_sent?: number;
}

export type EmailNotificationType =
  | 'order_confirmation'
  | 'shipping_update'
  | 'password_reset'
  | 'welcome_registration'
  | 'custom_test';

export type EmailDeliveryStatus = 'sent' | 'delivered' | 'failed' | 'queued';

export interface EmailNotification {
  id: string;
  to: string;
  recipient_name: string;
  subject: string;
  type: EmailNotificationType;
  status: EmailDeliveryStatus;
  sent_at: string;
  order_id?: string;
  order_number?: string;
  tracking_number?: string;
  carrier?: string;
  preview_snippet: string;
  html_body: string;
  delivery_provider: string; // 'Resend' | 'SendGrid' | 'SMTP' | 'Ebinesar Secure Mail Engine (Mock)'
  error_message?: string;
}

export interface EmailProviderConfig {
  provider: 'resend' | 'sendgrid' | 'smtp' | 'built_in_secure_mock';
  is_live_configured: boolean;
  from_email: string;
  active_services: string[];
}

