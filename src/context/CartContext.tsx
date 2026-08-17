import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { INITIAL_COUPONS } from '../data/initialData';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  totalSavings: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  quickBuy: (product: Product, quantity?: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ebinesar_harvest_cart_items';
const COUPON_STORAGE_KEY = 'ebinesar_harvest_coupon';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity = 1): { success: boolean; message?: string } => {
    if (product.stock <= 0) {
      return { success: false, message: `"${product.name}" is currently out of stock.` };
    }

    let result = { success: true, message: `Added "${product.name}" to your harvest basket.` };

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          result = {
            success: false,
            message: `Only ${product.stock} units available in harvest stock.`
          };
          return prev.map(item =>
            item.product.id === product.id ? { ...item, quantity: product.stock } : item
          );
        }
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }

      const initialQty = Math.min(quantity, product.stock);
      return [...prev, { product, quantity: initialQty }];
    });

    return result;
  };

  const updateQuantity = (productId: string, quantity: number): { success: boolean; message?: string } => {
    let result: { success: boolean; message?: string } = { success: true };
    if (quantity <= 0) {
      removeFromCart(productId);
      return result;
    }

    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            result = {
              success: false,
              message: `Maximum available harvest stock is ${item.product.stock}.`
            };
            return { ...item, quantity: item.product.stock };
          }
          return { ...item, quantity };
        }
        return item;
      });
    });

    return result;
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const quickBuy = (product: Product, quantity = 1) => {
    addToCart(product, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Computations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalOriginal = cart.reduce((sum, item) => sum + (item.product.original_price || item.product.price) * item.quantity, 0);
  const originalSavings = Math.max(0, totalOriginal - subtotal);

  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.min_order_amount) {
    discountAmount = (subtotal * appliedCoupon.discount_percent) / 100;
  }

  const totalSavings = originalSavings + discountAmount;

  // Free shipping above ₹999 after discount
  const shippingFee = subtotal > 0 && (subtotal - discountAmount) >= 999 ? 0 : (subtotal > 0 ? 80 : 0);
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.toUpperCase().trim();
    const coupon = INITIAL_COUPONS.find(c => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return { success: false, message: 'Invalid harvest promo code.' };
    }

    if (subtotal < coupon.min_order_amount) {
      return {
        success: false,
        message: `Coupon requires a minimum order value of ₹${coupon.min_order_amount}.`
      };
    }

    setAppliedCoupon(coupon);
    return {
      success: true,
      message: `Promo code "${coupon.code}" applied! ${coupon.discount_percent}% off.`
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        discountAmount,
        totalAmount,
        totalSavings,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        quickBuy
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
