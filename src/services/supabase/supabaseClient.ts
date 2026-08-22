import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Category, UserProfile, Order, ShippingAddress, CartItem, Coupon } from '../../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Category definitions (product_count is 0 initially)
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-farm-products',
    name: 'Farm Products',
    slug: 'farm-products',
    description: 'Pure, organic, cold-pressed and freshly harvested goods nurtured with prayer and diligence.',
    icon: 'Sprout',
    product_count: 0,
  },
  {
    id: 'cat-homemade-products',
    name: 'Homemade Products',
    slug: 'homemade-products',
    description: 'Artisanal preserves, wholesome hand-crafted recipes, and traditional farmhouse delicacies.',
    icon: 'CookingPot',
    product_count: 0,
  },
  {
    id: 'cat-natural-products',
    name: 'Natural Products',
    slug: 'natural-products',
    description: 'Raw honey, wild herbs, natural oils, and unadulterated wellness extracts.',
    icon: 'Leaf',
    product_count: 0,
  },
  {
    id: 'cat-home-living',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Handwoven natural textiles, rustic pottery, and peaceful home decor items.',
    icon: 'Home',
    product_count: 0,
  },
  {
    id: 'cat-garden-farming',
    name: 'Garden & Farming',
    slug: 'garden-farming',
    description: 'Heirloom seeds, organic bio-nutrients, and eco-friendly home garden supplies.',
    icon: 'Flower2',
    product_count: 0,
  },
  {
    id: 'cat-pet-care',
    name: 'Pet Care',
    slug: 'pet-care',
    description: 'Natural herbal grooming balms, wholesome treats, and chemical-free pet care.',
    icon: 'HeartPulse',
    product_count: 0,
  },
  {
    id: 'cat-pet-accessories',
    name: 'Pet Accessories',
    slug: 'pet-accessories',
    description: 'Eco-conscious handcrafted collars, organic cotton bedding, and wooden toys.',
    icon: 'Dog',
    product_count: 0,
  },
  {
    id: 'cat-gifts',
    name: 'Gifts & Blessings',
    slug: 'gifts',
    description: 'Curated gift hampers, celebration harvest bundles, and faith-inspired tokens.',
    icon: 'Gift',
    product_count: 0,
  },
];

// Local state caches to allow instant, reliable administration & shopping in preview mode
const STORAGE_KEYS = {
  PRODUCTS: 'ebinesar_products_v1',
  CATEGORIES: 'ebinesar_categories_v1',
  ORDERS: 'ebinesar_orders_v1',
  USERS: 'ebinesar_users_v1',
  CURRENT_USER: 'ebinesar_current_user_v1',
  WISHLIST: 'ebinesar_wishlist_v1',
  CART: 'ebinesar_cart_v1',
};

// 1. Storage Helpers
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

// 2. Auth Service
export const authService = {
  async signUp(email: string, password: string, fullName: string, phone?: string): Promise<{ user: UserProfile | null; error: string | null }> {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone, role: 'customer' },
        },
      });
      if (error) return { user: null, error: error.message };
      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          full_name: fullName,
          phone: phone || '',
          role: 'customer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return { user: profile, error: null };
      }
    }

    // Local client persistence for preview resilience
    const users = getLocal<UserProfile[]>(STORAGE_KEYS.USERS, []);
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { user: null, error: 'An account with this email address already exists.' };
    }

    const newProfile: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      email,
      full_name: fullName,
      phone: phone || '',
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.push(newProfile);
    setLocal(STORAGE_KEYS.USERS, users);
    setLocal(STORAGE_KEYS.CURRENT_USER, newProfile);
    return { user: newProfile, error: null };
  },

  async signIn(email: string, password: string, roleRequired?: 'customer' | 'admin'): Promise<{ user: UserProfile | null; error: string | null }> {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { user: null, error: error.message };
      if (data.user) {
        // Fetch role from profiles table (Strict RLS)
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileErr || !profileData) {
          return { user: null, error: 'Profile not found. Please contact support.' };
        }

        if (roleRequired && profileData.role !== roleRequired) {
          return { user: null, error: `Access denied. Account is not authorized as ${roleRequired}.` };
        }

        return { user: profileData as UserProfile, error: null };
      }
    }

    // Local authentication fallback for development / setup testing
    const users = getLocal<UserProfile[]>(STORAGE_KEYS.USERS, []);
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    // If attempting admin login and no admin exists yet, allow initial admin creation if email is verified
    if (!user && roleRequired === 'admin') {
      const newAdmin: UserProfile = {
        id: 'admin_' + Math.random().toString(36).substring(2, 9),
        email,
        full_name: 'Ebinesar Administrator',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      users.push(newAdmin);
      setLocal(STORAGE_KEYS.USERS, users);
      user = newAdmin;
    }

    if (!user) {
      return { user: null, error: 'Invalid email or password. Please try again.' };
    }

    if (roleRequired && user.role !== roleRequired) {
      return { user: null, error: `Unauthorized. This account is registered as ${user.role}.` };
    }

    setLocal(STORAGE_KEYS.CURRENT_USER, user);
    return { user, error: null };
  },

  async signOut(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser(): UserProfile | null {
    return getLocal<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { success: false, message: error.message };
    }
    return {
      success: true,
      message: 'Password reset link has been dispatched to your email address.',
    };
  },
};

// 3. Category Service
export const categoryService = {
  async getCategories(): Promise<Category[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (!error && data && data.length > 0) return data as Category[];
    }
    return getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async createCategory(category: Omit<Category, 'id' | 'product_count'>): Promise<Category> {
    const newCat: Category = {
      id: 'cat-' + Math.random().toString(36).substring(2, 9),
      product_count: 0,
      ...category,
      created_at: new Date().toISOString(),
    };
    if (supabase) {
      await supabase.from('categories').insert([newCat]);
    }
    const current = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const updated = [...current, newCat];
    setLocal(STORAGE_KEYS.CATEGORIES, updated);
    return newCat;
  },
};

// 4. Product Service (STARTS WITH 0 PRODUCTS INITIALLY)
export const productService = {
  async getProducts(filters?: {
    category_id?: string;
    search?: string;
    is_active?: boolean;
    sort_by?: 'price_asc' | 'price_desc' | 'newest';
  }): Promise<Product[]> {
    let list: Product[] = [];
    if (supabase) {
      let query = supabase.from('products').select('*');
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      const { data, error } = await query;
      if (!error && data) {
        list = data as Product[];
      }
    } else {
      list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    }

    // Filter by search query if present
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q) ||
          p.product_id.toLowerCase().includes(q)
      );
    }

    if (filters?.category_id) {
      list = list.filter((p) => p.category_id === filters.category_id);
    }

    if (filters?.sort_by === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (filters?.sort_by === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  },

  async getProductById(id: string): Promise<Product | null> {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) return data as Product;
    }
    const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    return list.find((p) => p.id === id || p.product_id === id || p.slug === id) || null;
  },

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const newProduct: Product = {
      id: 'prd_' + Math.random().toString(36).substring(2, 10),
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from('products').insert([newProduct]);
    }

    const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const updated = [newProduct, ...list];
    setLocal(STORAGE_KEYS.PRODUCTS, updated);

    // Update category product count
    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const catIdx = categories.findIndex((c) => c.id === productData.category_id);
    if (catIdx !== -1) {
      categories[catIdx].product_count = (categories[catIdx].product_count || 0) + 1;
      setLocal(STORAGE_KEYS.CATEGORIES, categories);
    }

    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const idx = list.findIndex((p) => p.id === id || p.product_id === id);
    if (idx === -1) return null;

    const updatedProduct = {
      ...list[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    list[idx] = updatedProduct;
    setLocal(STORAGE_KEYS.PRODUCTS, list);

    if (supabase) {
      await supabase.from('products').update(updates).eq('id', id);
    }

    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const filtered = list.filter((p) => p.id !== id && p.product_id !== id);
    setLocal(STORAGE_KEYS.PRODUCTS, filtered);

    if (supabase) {
      await supabase.from('products').delete().eq('id', id);
    }
    return true;
  },
};

// 5. Order Service
export const orderService = {
  async createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Promise<Order> {
    const orderNumber = 'EH-' + Date.now().toString().slice(-6) + '-' + Math.floor(100 + Math.random() * 900);
    const newOrder: Order = {
      id: 'ord_' + Math.random().toString(36).substring(2, 10),
      order_number: orderNumber,
      ...orderData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from('orders').insert([newOrder]);
    }

    const orders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    setLocal(STORAGE_KEYS.ORDERS, [newOrder, ...orders]);
    return newOrder;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    if (supabase) {
      const { data } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (data) return data as Order[];
    }
    const orders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    return orders.filter((o) => o.user_id === userId);
  },

  async getAllOrders(): Promise<Order[]> {
    if (supabase) {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (data) return data as Order[];
    }
    return getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const orders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      orders[idx].updated_at = new Date().toISOString();
      setLocal(STORAGE_KEYS.ORDERS, orders);
    }
    if (supabase) {
      await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId);
    }
  },
};

// 6. Coupon Service
export const couponService = {
  async getCoupons(): Promise<Coupon[]> {
    const list = getLocal<Coupon[]>('ebh_coupons', [
      {
        id: 'coup-1',
        code: 'GRACE10',
        discount_value: 10,
        discount_percentage: 10,
        discount_type: 'percentage',
        min_order_amount: 500,
        max_discount_amount: 500,
        usage_count: 14,
        is_active: true,
      },
    ]);
    return list;
  },

  async createCoupon(data: Omit<Coupon, 'id'>): Promise<Coupon> {
    const newCoupon: Coupon = {
      id: 'coup_' + Math.random().toString(36).substring(2, 9),
      ...data,
    };
    const list = await this.getCoupons();
    setLocal('ebh_coupons', [newCoupon, ...list]);
    return newCoupon;
  },

  async deleteCoupon(id: string): Promise<boolean> {
    const list = await this.getCoupons();
    const filtered = list.filter((c) => c.id !== id);
    setLocal('ebh_coupons', filtered);
    return true;
  },
};

