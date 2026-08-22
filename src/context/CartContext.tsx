import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  couponCode: string;
  shippingFee: number;
  tax: number;
  total: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ebinesar_cart_v1';
const COUPON_STORAGE_KEY = 'ebinesar_coupon_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    return localStorage.getItem(COUPON_STORAGE_KEY) || '';
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Cart sync error:', e);
    }
  }, [cart]);

  useEffect(() => {
    if (couponCode) {
      localStorage.setItem(COUPON_STORAGE_KEY, couponCode);
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [couponCode]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        // Enforce inventory cap
        const maxQty = product.inventory || 99;
        const newQty = Math.min(maxQty, existing.quantity + quantity);
        return prev.map((item) =>
          item.product_id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          id: 'cart_' + Math.random().toString(36).substring(2, 9),
          product_id: product.id,
          product,
          quantity: Math.min(product.inventory || 99, quantity),
          unit_price: product.price,
        },
      ];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId && item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product_id === productId || item.product.id === productId) {
          const maxInventory = item.product.inventory || 99;
          return { ...item, quantity: Math.min(quantity, maxInventory) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'GRACE10' || clean === 'HARVEST10') {
      setCouponCode(clean);
      return { success: true, message: 'Coupon applied! 10% harvest discount has been added.' };
    }
    if (clean === 'FIRSTHARVEST') {
      setCouponCode(clean);
      return { success: true, message: 'Welcome gift applied! Free shipping & 15% discount.' };
    }
    return { success: false, message: 'Invalid or expired harvest coupon code.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.unit_price * item.quantity, 0);

  let discount = 0;
  if (couponCode === 'GRACE10' || couponCode === 'HARVEST10') {
    discount = subtotal * 0.1;
  } else if (couponCode === 'FIRSTHARVEST') {
    discount = subtotal * 0.15;
  }

  const shippingFee = subtotal > 1000 || couponCode === 'FIRSTHARVEST' || cart.length === 0 ? 0 : 50;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.05 * 100) / 100;
  const total = Math.max(0, Math.round(subtotal - discount + shippingFee + tax));

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        discount,
        couponCode,
        shippingFee,
        tax,
        total,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
