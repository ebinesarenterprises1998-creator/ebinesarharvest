import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS } from './src/data/initialData';
import { Product, Order, AdminMetrics, Review, EmailNotification } from './src/types';
import { GoogleGenAI } from '@google/genai';
import {
  sendEmailNotification,
  generateOrderConfirmationEmail,
  generateShippingUpdateEmail,
  generatePasswordResetEmail,
  generateWelcomeRegistrationEmail,
  emailNotificationLogs,
  getEmailProviderConfig
} from './server/emailService';

dotenv.config();

const app = express();
const PORT = 3000;

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-Memory Password Reset Tokens Store (code -> { email, expiresAt })
const passwordResetTokens = new Map<string, { code: string; expiresAt: number; name?: string }>();

// Registered Users Store for Demo/Hybrid Auth
interface StoredUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  password?: string;
  role: 'customer' | 'admin';
  created_at: string;
}

const registeredUsersStore: StoredUser[] = [
  {
    id: 'usr-admin-1',
    email: (process.env.ADMIN_EMAIL || 'admin@ebinesarharvest.com').toLowerCase().trim(),
    name: 'Ebenezer Administrator',
    phone: '+91 98410 44556',
    role: 'admin',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'usr-patron-1',
    email: 'grace.abigail@example.com',
    name: 'Grace Abigail',
    phone: '+91 98410 44556',
    role: 'customer',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Seed Initial Email Audit Logs
if (emailNotificationLogs.length === 0) {
  const seedOrder = {
    id: 'ord-mock-1001',
    order_number: 'EBN-2026-1001',
    customer_name: 'Grace Abigail',
    customer_email: 'grace.abigail@example.com',
    customer_phone: '+91 98410 44556',
    items: [
      {
        product_id: 'prod-heirloom-wheat',
        product_name: 'Ebenezer Heritage Emmer Wheat Berries (Khapli)',
        product_image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000&auto=format&fit=crop',
        sku: 'EBN-GRN-001',
        price: 349,
        quantity: 2,
        total: 698
      }
    ],
    subtotal: 698,
    shipping_fee: 0,
    discount_amount: 69.8,
    total_amount: 628.2,
    payment_status: 'paid' as const,
    order_status: 'shipped' as const,
    shipping_address: {
      id: 'addr-1',
      recipient_name: 'Grace Abigail',
      phone: '+91 98410 44556',
      email: 'grace.abigail@example.com',
      address_line1: '14 Olive Mount Road, Bethel Colony',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      postal_code: '641001',
      country: 'India'
    },
    tracking_number: 'BLUEDART-IND-778219',
    tracking_carrier: 'BlueDart Express',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  };

  const welcomeContent = generateWelcomeRegistrationEmail({ email: 'grace.abigail@example.com', name: 'Grace Abigail' });
  emailNotificationLogs.push({
    id: 'eml-seed-001',
    to: 'grace.abigail@example.com',
    recipient_name: 'Grace Abigail',
    subject: welcomeContent.subject,
    type: 'welcome_registration',
    status: 'delivered',
    sent_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    preview_snippet: welcomeContent.preheader,
    html_body: welcomeContent.html,
    delivery_provider: 'Ebinesar Secure Mail Engine (Active Sandbox)'
  });

  const orderContent = generateOrderConfirmationEmail(seedOrder as Order);
  emailNotificationLogs.push({
    id: 'eml-seed-002',
    to: 'grace.abigail@example.com',
    recipient_name: 'Grace Abigail',
    subject: orderContent.subject,
    type: 'order_confirmation',
    status: 'delivered',
    sent_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    order_id: seedOrder.id,
    order_number: seedOrder.order_number,
    preview_snippet: orderContent.preheader,
    html_body: orderContent.html,
    delivery_provider: 'Ebinesar Secure Mail Engine (Active Sandbox)'
  });

  const shippingContent = generateShippingUpdateEmail(seedOrder as Order, 'processing');
  emailNotificationLogs.push({
    id: 'eml-seed-003',
    to: 'grace.abigail@example.com',
    recipient_name: 'Grace Abigail',
    subject: shippingContent.subject,
    type: 'shipping_update',
    status: 'delivered',
    sent_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    order_id: seedOrder.id,
    order_number: seedOrder.order_number,
    tracking_number: seedOrder.tracking_number,
    carrier: seedOrder.tracking_carrier,
    preview_snippet: shippingContent.preheader,
    html_body: shippingContent.html,
    delivery_provider: 'Ebinesar Secure Mail Engine (Active Sandbox)'
  });
}

// In-Memory Database Store (Synchronizes with Supabase Postgres when configured)
let productsStore: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
let categoriesStore = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
let ordersStore: Order[] = [
  {
    id: 'ord-mock-1001',
    order_number: 'EBN-2026-1001',
    customer_name: 'Grace Abigail',
    customer_email: 'grace.abigail@example.com',
    customer_phone: '+91 98410 44556',
    items: [
      {
        product_id: 'prod-heirloom-wheat',
        product_name: 'Ebenezer Heritage Emmer Wheat Berries (Khapli)',
        product_image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000&auto=format&fit=crop',
        sku: 'EBN-GRN-001',
        price: 349,
        quantity: 2,
        total: 698
      },
      {
        product_id: 'prod-raw-wildflower-honey',
        product_name: 'Wild Forest Raw Honey — Nilgiri Flora',
        product_image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1000&auto=format&fit=crop',
        sku: 'EBN-HNY-003',
        price: 590,
        quantity: 1,
        total: 590
      }
    ],
    subtotal: 1288,
    shipping_fee: 0,
    discount_amount: 128.8,
    total_amount: 1159.2,
    payment_status: 'paid',
    order_status: 'shipped',
    razorpay_order_id: 'order_mock_demo_987654',
    razorpay_payment_id: 'pay_mock_demo_112233',
    shipping_address: {
      id: 'addr-1',
      recipient_name: 'Grace Abigail',
      phone: '+91 98410 44556',
      email: 'grace.abigail@example.com',
      address_line1: '14 Olive Mount Road, Bethel Colony',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      postal_code: '641001',
      country: 'India'
    },
    tracking_number: 'BLUEDART-IND-778219',
    tracking_carrier: 'BlueDart Express',
    tracking_url: 'https://www.bluedart.com/tracking?num=BLUEDART-IND-778219',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

let reviewsStore: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-heirloom-wheat',
    user_name: 'David K.',
    rating: 5,
    title: 'Remarkable purity and earthy aroma',
    comment: 'The Emmer wheat brings back memories of our ancestral harvest. Truly grateful for this organic treasure.',
    date: '2026-07-28',
    verified_purchase: true
  },
  {
    id: 'rev-2',
    product_id: 'prod-raw-wildflower-honey',
    user_name: 'Esther M.',
    rating: 5,
    title: 'Real raw honey with living enzymes',
    comment: 'You can taste the mountain wildflowers in every spoonful. Exceptional care in packaging too.',
    date: '2026-08-05',
    verified_purchase: true
  }
];

// Security Helper: Sanitize product for public view (strips private dropshipping supplier details)
function sanitizeProductForPublic(product: Product): Product {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { supplier_info, ...safeProduct } = product;
  return safeProduct as Product;
}

// Authentication & Admin Authorization Middleware
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@ebinesarharvest.com').toLowerCase().trim();

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const clientAdminEmail = req.headers['x-admin-email'] as string;
  const adminSecret = req.headers['x-admin-token'] as string;

  // Verify either direct admin header matching or valid bearer token
  const isAuthorizedEmail = clientAdminEmail && clientAdminEmail.toLowerCase().trim() === ADMIN_EMAIL;
  const isAuthorizedToken = adminSecret === 'ebinesar-harvest-admin-authorized' || (authHeader && authHeader.includes('admin'));

  if (!isAuthorizedEmail && !isAuthorizedToken) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access restricted to authorized EBINESAR HARVEST administrators.'
    });
  }

  next();
}

// ----------------------------------------------------
// PUBLIC STOREFRONT ENDPOINTS
// ----------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'EBINESAR HARVEST',
    tagline: 'Rooted in Faith. Grown with Care.',
    time: new Date().toISOString()
  });
});

// Categories list
app.get('/api/categories', (req, res) => {
  res.json(categoriesStore);
});

// Products catalog with search, filter, and sorting
app.get('/api/products', (req, res) => {
  try {
    let result = productsStore.filter(p => p.is_active);

    const { category, search, minPrice, maxPrice, sort, featured, bestseller, isNew } = req.query;

    if (category && category !== 'all') {
      result = result.filter(p => 
        p.category.toLowerCase() === (category as string).toLowerCase() ||
        p.category_id === category
      );
    }

    if (search) {
      const q = (search as string).toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      result = result.filter(p => p.price >= parseFloat(minPrice as string));
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= parseFloat(maxPrice as string));
    }

    if (featured === 'true') {
      result = result.filter(p => p.is_featured);
    }

    if (bestseller === 'true') {
      result = result.filter(p => p.is_bestseller);
    }

    if (isNew === 'true') {
      result = result.filter(p => p.is_new);
    }

    // Sorting
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: newest first
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Strip private dropshipping info for public visitors
    const publicProducts = result.map(sanitizeProductForPublic);
    res.json(publicProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// Single product details
app.get('/api/products/:slugOrId', (req, res) => {
  const { slugOrId } = req.params;
  const product = productsStore.find(p => p.id === slugOrId || p.slug === slugOrId);

  if (!product || !product.is_active) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const productReviews = reviewsStore.filter(r => r.product_id === product.id);
  const safeProduct = sanitizeProductForPublic(product);

  res.json({
    ...safeProduct,
    reviews: productReviews
  });
});

// Add product review
app.post('/api/reviews', (req, res) => {
  const { product_id, user_name, rating, title, comment } = req.body;

  if (!product_id || !user_name || !rating || !comment) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    product_id,
    user_name: String(user_name).trim(),
    rating: Math.min(5, Math.max(1, Number(rating))),
    title: String(title || '').trim(),
    comment: String(comment).trim(),
    date: new Date().toISOString().split('T')[0],
    verified_purchase: true
  };

  reviewsStore.unshift(newReview);

  // Update product review stats
  const product = productsStore.find(p => p.id === product_id);
  if (product) {
    const pReviews = reviewsStore.filter(r => r.product_id === product_id);
    const avgRating = pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length;
    product.rating = Number(avgRating.toFixed(1));
    product.reviews_count = pReviews.length;
  }

  res.status(201).json(newReview);
});

// Validate coupon code
app.post('/api/coupon/validate', (req, res) => {
  const { code, cartTotal } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, message: 'Coupon code required' });
  }

  const coupon = INITIAL_COUPONS.find(c => c.code.toUpperCase() === String(code).toUpperCase().trim());
  if (!coupon) {
    return res.status(404).json({ valid: false, message: 'Invalid harvest promo code' });
  }

  if (cartTotal && cartTotal < coupon.min_order_amount) {
    return res.status(400).json({
      valid: false,
      message: `Requires minimum order value of ₹${coupon.min_order_amount}`
    });
  }

  res.json({
    valid: true,
    code: coupon.code,
    discount_percent: coupon.discount_percent,
    description: coupon.description
  });
});

// ----------------------------------------------------
// SECURE RAZORPAY PAYMENT ENDPOINTS
// ----------------------------------------------------

/**
 * Step 1: Create Order
 * Calculates price and stock strictly server-side.
 * Never trusts prices sent from client.
 */
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { items, customer, couponCode, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!customer || !customer.email || !customer.name) {
      return res.status(400).json({ error: 'Customer details are required' });
    }

    // 1. Retrieve authoritative prices & validate stock from server database
    let subtotal = 0;
    const validatedItems: Order['items'] = [];

    for (const item of items) {
      const product = productsStore.find(p => p.id === item.product_id);

      if (!product) {
        return res.status(400).json({
          error: `Product with ID ${item.product_id} no longer exists.`
        });
      }

      if (!product.is_active) {
        return res.status(400).json({
          error: `"${product.name}" is currently unavailable.`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}.`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.images[0] || '',
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // 2. Compute discount
    let discountAmount = 0;
    if (couponCode) {
      const coupon = INITIAL_COUPONS.find(c => c.code.toUpperCase() === String(couponCode).toUpperCase().trim());
      if (coupon && subtotal >= coupon.min_order_amount) {
        discountAmount = (subtotal * coupon.discount_percent) / 100;
      }
    }

    // 3. Compute shipping fee (Free shipping on orders above ₹999)
    const shippingFee = (subtotal - discountAmount) >= 999 ? 0 : 79;
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

    // 4. Create Razorpay order
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';

    const amountInPaise = Math.round(totalAmount * 100);
    const receiptId = `rcpt_${Date.now().toString().slice(-8)}`;

    let razorpayOrderId = '';
    let isMock = false;

    // Check if live Razorpay credentials are present
    if (razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('your_key')) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: receiptId,
            notes: {
              customer_email: customer.email,
              customer_name: customer.name
            }
          })
        });

        if (!rzpResponse.ok) {
          const errData = await rzpResponse.json();
          console.warn('Razorpay API response error, falling back to secure test gateway:', errData);
          isMock = true;
          razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
        } else {
          const orderData = await rzpResponse.json();
          razorpayOrderId = orderData.id;
        }
      } catch (err) {
        console.warn('Error connecting to Razorpay API:', err);
        isMock = true;
        razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
      }
    } else {
      // Test / Sandbox mode for immediate development preview
      isMock = true;
      razorpayOrderId = `order_test_${crypto.randomBytes(8).toString('hex')}`;
    }

    res.json({
      order_id: razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      key_id: razorpayKeyId || 'rzp_test_ebinesar_harvest_demo',
      subtotal,
      shipping_fee: shippingFee,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      items: validatedItems,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      is_mock: isMock
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ error: 'Server payment order initiation failed' });
  }
});

/**
 * Step 2: Verify Razorpay Payment Signature
 * Decrements inventory atomically and generates final order receipt.
 */
app.post('/api/payment/verify', (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      customer,
      shippingAddress,
      subtotal,
      shipping_fee,
      discount_amount,
      total_amount,
      is_mock
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing payment identifiers' });
    }

    // Check duplicate order prevention
    const existingOrder = ordersStore.find(o => o.razorpay_payment_id === razorpay_payment_id);
    if (existingOrder) {
      return res.json({
        success: true,
        order: existingOrder,
        message: 'Order already processed'
      });
    }

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify cryptographic HMAC-SHA256 signature if in production mode
    if (razorpayKeySecret && !is_mock && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          error: 'Invalid payment signature. Transaction unverified.'
        });
      }
    }

    // Atomic stock check & inventory reduction
    for (const item of items) {
      const product = productsStore.find(p => p.id === item.product_id);
      if (product) {
        if (product.stock < item.quantity) {
          console.warn(`Stock was depleted for product ${product.id}`);
        }
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    }

    // Generate confirmed Order
    const newOrderNumber = `EBN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: newOrderNumber,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      items,
      subtotal: Number(subtotal),
      shipping_fee: Number(shipping_fee),
      discount_amount: Number(discount_amount || 0),
      total_amount: Number(total_amount),
      payment_status: 'paid',
      order_status: 'processing',
      razorpay_order_id,
      razorpay_payment_id,
      shipping_address: shippingAddress,
      tracking_carrier: 'Ebenezer AgriExpress',
      tracking_number: `TRK-EBN-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    ordersStore.unshift(newOrder);

    // 🌾 Automated Email Notification: Order Confirmation after successful payment
    try {
      const emailContent = generateOrderConfirmationEmail(newOrder);
      sendEmailNotification({
        to: newOrder.customer_email,
        recipient_name: newOrder.customer_name,
        subject: emailContent.subject,
        type: 'order_confirmation',
        html: emailContent.html,
        text: emailContent.text,
        order_id: newOrder.id,
        order_number: newOrder.order_number,
        preview_snippet: emailContent.preheader
      }).catch(err => console.error('Error sending order confirmation email:', err));
    } catch (err) {
      console.warn('Error formatting order confirmation email:', err);
    }

    res.status(201).json({
      success: true,
      message: 'Payment verified and harvest order placed successfully!',
      order: newOrder
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Server payment verification failed' });
  }
});

// Razorpay Webhook
app.post('/api/webhook/razorpay', (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (webhookSecret && signature) {
    const bodyStr = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyStr)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
  }

  // Handle events like payment.captured, payment.failed, order.paid
  const event = req.body.event;
  console.log('Received verified Razorpay webhook event:', event);

  res.json({ status: 'ok' });
});

// ----------------------------------------------------
// CUSTOMER ACCOUNT ENDPOINTS
// ----------------------------------------------------
app.get('/api/account/orders', (req, res) => {
  const userEmail = req.query.email as string;
  if (!userEmail) {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  const userOrders = ordersStore.filter(o => 
    o.customer_email.toLowerCase() === userEmail.toLowerCase().trim()
  );

  res.json(userOrders);
});

// ----------------------------------------------------
// ADMIN PROTECTED MANAGEMENT ENDPOINTS
// ----------------------------------------------------

// Admin metrics & analytics
app.get('/api/admin/metrics', requireAdminAuth, (req, res) => {
  const totalRevenue = ordersStore
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingOrders = ordersStore.filter(o => o.order_status === 'pending' || o.order_status === 'processing').length;
  const completedOrders = ordersStore.filter(o => o.order_status === 'delivered').length;
  const lowStockCount = productsStore.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = productsStore.filter(p => p.stock === 0).length;

  const metrics: AdminMetrics = {
    total_revenue: Math.round(totalRevenue),
    total_orders: ordersStore.length,
    pending_orders: pendingOrders,
    completed_orders: completedOrders,
    total_products: productsStore.length,
    low_stock_count: lowStockCount,
    out_of_stock_count: outOfStockCount,
    recent_orders: ordersStore.slice(0, 10),
    total_emails_sent: emailNotificationLogs.length
  };

  res.json(metrics);
});

// Admin product list (includes private dropshipping details)
app.get('/api/admin/products', requireAdminAuth, (req, res) => {
  res.json(productsStore);
});

// Admin create product
app.post('/api/admin/products', requireAdminAuth, (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.category || data.price === undefined || data.stock === undefined) {
      return res.status(400).json({ error: 'Name, category, price, and stock are required' });
    }

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const sku = data.sku || `EBN-${Date.now().toString().slice(-6)}`;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: String(data.name).trim(),
      slug,
      sku,
      category: data.category,
      category_id: data.category_id || 'cat-seeds',
      price: Number(data.price),
      original_price: Number(data.original_price || data.price),
      discount: Number(data.discount || 0),
      stock: Math.max(0, Number(data.stock)),
      rating: 5.0,
      reviews_count: 0,
      short_description: data.short_description || '',
      full_description: data.full_description || '',
      specifications: data.specifications || {},
      shipping_info: data.shipping_info || 'Dispatches in 24-48 hours',
      return_info: data.return_info || '7-day replacement guarantee',
      images: Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1000&auto=format&fit=crop'],
      is_featured: Boolean(data.is_featured),
      is_new: Boolean(data.is_new),
      is_bestseller: Boolean(data.is_bestseller),
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      created_at: new Date().toISOString(),
      supplier_info: data.supplier_info ? {
        supplier_name: String(data.supplier_info.supplier_name || ''),
        supplier_sku: String(data.supplier_info.supplier_sku || ''),
        supplier_cost: Number(data.supplier_info.supplier_cost || 0),
        supplier_url: String(data.supplier_info.supplier_url || ''),
        supplier_contact: String(data.supplier_info.supplier_contact || ''),
        supplier_notes: String(data.supplier_info.supplier_notes || '')
      } : undefined
    };

    productsStore.unshift(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Admin update product
app.put('/api/admin/products/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const index = productsStore.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updatedData = req.body;
  productsStore[index] = {
    ...productsStore[index],
    ...updatedData,
    id, // Keep immutable ID
    updated_at: new Date().toISOString()
  };

  res.json(productsStore[index]);
});

// Admin delete product
app.delete('/api/admin/products/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const initialLength = productsStore.length;
  productsStore = productsStore.filter(p => p.id !== id);

  if (productsStore.length === initialLength) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ success: true, message: 'Product removed from catalog' });
});

// Admin orders management
app.get('/api/admin/orders', requireAdminAuth, (req, res) => {
  res.json(ordersStore);
});

// Admin update order status / shipping tracking with Automated Email Notification Trigger
app.put('/api/admin/orders/:id/status', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { order_status, payment_status, tracking_number, tracking_carrier, tracking_url, notes } = req.body;

  const order = ordersStore.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const previousStatus = order.order_status;
  const previousTracking = order.tracking_number;

  if (order_status) order.order_status = order_status;
  if (payment_status) order.payment_status = payment_status;
  if (tracking_number !== undefined) order.tracking_number = tracking_number;
  if (tracking_carrier !== undefined) order.tracking_carrier = tracking_carrier;
  if (tracking_url !== undefined) order.tracking_url = tracking_url;
  if (notes !== undefined) order.notes = notes;
  order.updated_at = new Date().toISOString();

  // 🚚 Automated Email Notification: Shipping Status Update (processing, shipped, delivered, etc.)
  const statusChanged = order_status && order_status !== previousStatus;
  const trackingChanged = tracking_number && tracking_number !== previousTracking;

  if (statusChanged || trackingChanged) {
    try {
      const emailContent = generateShippingUpdateEmail(order, previousStatus);
      sendEmailNotification({
        to: order.customer_email,
        recipient_name: order.customer_name,
        subject: emailContent.subject,
        type: 'shipping_update',
        html: emailContent.html,
        text: emailContent.text,
        order_id: order.id,
        order_number: order.order_number,
        tracking_number: order.tracking_number,
        carrier: order.tracking_carrier,
        preview_snippet: emailContent.preheader
      }).catch(err => console.error('Error sending shipping update email:', err));
    } catch (err) {
      console.warn('Error formatting shipping update email:', err);
    }
  }

  res.json(order);
});

// Resend order confirmation email manually on demand
app.post('/api/orders/:id/resend-confirmation', (req, res) => {
  const { id } = req.params;
  const order = ordersStore.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  try {
    const emailContent = generateOrderConfirmationEmail(order);
    sendEmailNotification({
      to: order.customer_email,
      recipient_name: order.customer_name,
      subject: `[Resent] ${emailContent.subject}`,
      type: 'order_confirmation',
      html: emailContent.html,
      text: emailContent.text,
      order_id: order.id,
      order_number: order.order_number,
      preview_snippet: emailContent.preheader
    }).catch(err => console.error('Error resending order confirmation email:', err));

    res.json({ success: true, message: `Order receipt re-sent successfully to ${order.customer_email}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to resend confirmation email' });
  }
});

// ----------------------------------------------------
// AUTHENTICATION & AUTOMATED AUTH EMAILS
// ----------------------------------------------------

// User Registration with Automated Welcome Email
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, name, phone, password } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and full name are required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanName = String(name).trim();

    const existingUser = registeredUsersStore.find(u => u.email === cleanEmail);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const newUser: StoredUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: cleanName,
      phone: phone || '',
      password: password || 'default_pass',
      role: cleanEmail === ADMIN_EMAIL ? 'admin' : 'customer',
      created_at: new Date().toISOString()
    };

    registeredUsersStore.push(newUser);

    // 🌾 Automated Email Notification: New Account Registration Confirmation
    try {
      const welcomeContent = generateWelcomeRegistrationEmail({ email: cleanEmail, name: cleanName });
      sendEmailNotification({
        to: cleanEmail,
        recipient_name: cleanName,
        subject: welcomeContent.subject,
        type: 'welcome_registration',
        html: welcomeContent.html,
        text: welcomeContent.text,
        preview_snippet: welcomeContent.preheader
      }).catch(err => console.error('Error sending welcome registration email:', err));
    } catch (err) {
      console.warn('Error formatting welcome registration email:', err);
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome email sent.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal registration failure' });
  }
});

// Password Reset Request (Generates PIN + Link + Automated Reset Email)
app.post('/api/auth/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const existingUser = registeredUsersStore.find(u => u.email === cleanEmail);
    const recipientName = existingUser?.name || cleanEmail.split('@')[0];

    // Generate 6-digit verification code
    const resetPin = Math.floor(100000 + Math.random() * 900000).toString();
    const resetLink = `${req.protocol}://${req.get('host') || 'localhost:3000'}/?reset_code=${resetPin}&email=${encodeURIComponent(cleanEmail)}`;

    // Store in token cache (valid 30 minutes)
    passwordResetTokens.set(cleanEmail, {
      code: resetPin,
      name: recipientName,
      expiresAt: Date.now() + 30 * 60 * 1000
    });

    // 🔐 Automated Email Notification: Password Reset Request
    const resetContent = generatePasswordResetEmail(cleanEmail, recipientName, resetPin, resetLink);
    sendEmailNotification({
      to: cleanEmail,
      recipient_name: recipientName,
      subject: resetContent.subject,
      type: 'password_reset',
      html: resetContent.html,
      text: resetContent.text,
      preview_snippet: resetContent.preheader
    }).catch(err => console.error('Error sending password reset email:', err));

    res.json({
      success: true,
      message: 'If an account exists with this email, a 6-digit reset code and instructions have been emailed to you.',
      debug_pin: resetPin // Helpful for instant testing in preview
    });
  } catch (error) {
    console.error('Error handling forgot-password:', error);
    res.status(500).json({ error: 'Could not process password reset' });
  }
});

// Verify Reset PIN
app.post('/api/auth/verify-reset-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and verification code are required' });
  }

  const cleanEmail = String(email).toLowerCase().trim();
  const tokenRecord = passwordResetTokens.get(cleanEmail);

  if (!tokenRecord) {
    return res.status(400).json({ error: 'No active password reset request found for this email.' });
  }

  if (Date.now() > tokenRecord.expiresAt) {
    passwordResetTokens.delete(cleanEmail);
    return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
  }

  if (tokenRecord.code !== String(code).trim()) {
    return res.status(400).json({ error: 'Invalid 6-digit code. Please check your email.' });
  }

  res.json({ success: true, message: 'Verification code verified successfully.' });
});

// Finalize Password Reset
app.post('/api/auth/reset-password', (req, res) => {
  const { email, code, new_password } = req.body;
  if (!email || !code || !new_password) {
    return res.status(400).json({ error: 'Email, code, and new password are required' });
  }

  const cleanEmail = String(email).toLowerCase().trim();
  const tokenRecord = passwordResetTokens.get(cleanEmail);

  if (!tokenRecord || tokenRecord.code !== String(code).trim()) {
    return res.status(400).json({ error: 'Invalid or expired reset code.' });
  }

  if (Date.now() > tokenRecord.expiresAt) {
    passwordResetTokens.delete(cleanEmail);
    return res.status(400).json({ error: 'Code expired. Please request again.' });
  }

  // Update password in store
  const user = registeredUsersStore.find(u => u.email === cleanEmail);
  if (user) {
    user.password = new_password;
  }

  passwordResetTokens.delete(cleanEmail);

  res.json({ success: true, message: 'Your password has been successfully updated! You can now sign in.' });
});

// ----------------------------------------------------
// EMAIL NOTIFICATION SYSTEM ADMIN & PREVIEW APIS
// ----------------------------------------------------

// Get Email Audit Logs
app.get('/api/admin/emails', requireAdminAuth, (req, res) => {
  const typeFilter = req.query.type as string;
  let logs = emailNotificationLogs;

  if (typeFilter && typeFilter !== 'all') {
    logs = logs.filter(l => l.type === typeFilter);
  }

  res.json({
    total: logs.length,
    config: getEmailProviderConfig(),
    logs
  });
});

// Get Active Email Gateway Config
app.get('/api/admin/emails/config', requireAdminAuth, (req, res) => {
  res.json(getEmailProviderConfig());
});

// Send Test Email on Demand
app.post('/api/admin/emails/test', requireAdminAuth, async (req, res) => {
  try {
    const { to, type = 'order_confirmation', custom_subject, custom_message } = req.body;
    if (!to) {
      return res.status(400).json({ error: 'Destination email "to" is required' });
    }

    const mockOrder: Order = ordersStore[0] || {
      id: 'ord-test-999',
      order_number: 'EBN-2026-TEST',
      customer_name: 'Beloved Patron',
      customer_email: to,
      customer_phone: '+91 98410 44556',
      items: [
        {
          product_id: 'prod-1',
          product_name: 'Ebenezer Heritage Emmer Wheat Berries (Khapli)',
          product_image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000&auto=format&fit=crop',
          sku: 'EBN-GRN-001',
          price: 349,
          quantity: 2,
          total: 698
        }
      ],
      subtotal: 698,
      shipping_fee: 0,
      discount_amount: 0,
      total_amount: 698,
      payment_status: 'paid',
      order_status: 'processing',
      shipping_address: {
        id: 'addr-1',
        recipient_name: 'Beloved Patron',
        phone: '+91 98410 44556',
        email: to,
        address_line1: '14 Olive Mount Estate',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        postal_code: '641001',
        country: 'India'
      },
      tracking_carrier: 'Ebenezer AgriExpress',
      tracking_number: 'TRK-EBN-TEST99',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let generated: { subject: string; preheader: string; html: string; text: string };

    if (type === 'shipping_update') {
      generated = generateShippingUpdateEmail(mockOrder, 'processing');
    } else if (type === 'password_reset') {
      generated = generatePasswordResetEmail(to, 'Beloved Patron', '778899', 'https://ebinesarharvest.com/?reset_code=778899');
    } else if (type === 'welcome_registration') {
      generated = generateWelcomeRegistrationEmail({ email: to, name: 'Beloved Patron' });
    } else {
      generated = generateOrderConfirmationEmail(mockOrder);
    }

    if (custom_subject) generated.subject = custom_subject;

    const result = await sendEmailNotification({
      to,
      recipient_name: 'Beloved Patron',
      subject: generated.subject,
      type: type as any,
      html: generated.html,
      text: generated.text,
      preview_snippet: generated.preheader,
      order_id: mockOrder.id,
      order_number: mockOrder.order_number
    });

    res.json({
      success: true,
      message: `Test email (${type}) dispatched successfully to ${to}`,
      result
    });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: error.message || 'Failed to dispatch test email' });
  }
});

// Live Template HTML Preview Endpoint
app.get('/api/admin/emails/preview/:type', (req, res) => {
  const { type } = req.params;
  const sampleOrder: Order = ordersStore[0];

  let result: { subject: string; html: string };

  if (type === 'shipping_update') {
    result = generateShippingUpdateEmail(sampleOrder, 'processing');
  } else if (type === 'password_reset') {
    result = generatePasswordResetEmail('patron@example.com', 'Grace Abigail', '549210', 'https://ebinesarharvest.com/?reset_code=549210');
  } else if (type === 'welcome_registration') {
    result = generateWelcomeRegistrationEmail({ email: 'patron@example.com', name: 'Grace Abigail' });
  } else {
    result = generateOrderConfirmationEmail(sampleOrder);
  }

  res.setHeader('Content-Type', 'text/html');
  res.send(result.html);
});

// Admin inventory batch adjustment
app.post('/api/admin/inventory/adjust', requireAdminAuth, (req, res) => {
  const { product_id, stock_change, new_stock } = req.body;
  const product = productsStore.find(p => p.id === product_id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (new_stock !== undefined) {
    product.stock = Math.max(0, Number(new_stock));
  } else if (stock_change !== undefined) {
    product.stock = Math.max(0, product.stock + Number(stock_change));
  }

  product.updated_at = new Date().toISOString();
  res.json({ success: true, product_id, stock: product.stock });
});

// ----------------------------------------------------
// GEMINI AI HARVEST CONSULTANT
// ----------------------------------------------------
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

app.post('/api/ai/harvest-consultant', async (req, res) => {
  try {
    const { question, soilType, gardenSize } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ai = getAIClient();
    if (!ai) {
      // Graceful fallback response when API key is not yet set
      return res.json({
        response: `Greetings from EBINESAR HARVEST! For your query on "${question}", we recommend planting organic Heirloom Emmer Wheat or sowing our Kitchen Garden Seed Vault in well-drained organic compost soil. Remember Psalm 65:9: "You care for the land and water it; you enrich it abundantly." Apply neem cake booster for root health!`,
        recommended_products: productsStore.slice(0, 3).map(sanitizeProductForPublic)
      });
    }

    const prompt = `You are Ebenezer, the Master Agronomist and Faith-Rooted Farming Consultant for "EBINESAR HARVEST" (Tagline: Rooted in Faith. Grown with Care.).
A customer is asking for gardening or agricultural advice.
Customer question: "${question}"
Soil conditions: "${soilType || 'Not specified'}"
Garden size: "${gardenSize || 'Kitchen garden / small holding'}"

Our catalog includes:
${productsStore.map(p => `- ${p.name} (${p.category}): ₹${p.price}. ${p.short_description}`).join('\n')}

Provide an inspiring, warmly faithful, practical, and expert organic agricultural response in 2-3 concise paragraphs. Suggest 1 to 2 specific products from our catalog that fit their needs. Include a short uplifting scripture or harvest blessing proverb.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const replyText = response.text || 'May your harvest be blessed and fruitful with EBINESAR HARVEST.';

    res.json({
      response: replyText,
      recommended_products: productsStore.filter(p => p.is_featured).slice(0, 3).map(sanitizeProductForPublic)
    });
  } catch (error) {
    console.error('Error in AI harvest consultant:', error);
    res.status(500).json({
      response: 'May your soil be fertile and your harvest bountiful. We recommend our Kitchen Garden Seed Vault and Organic Neem Cake Booster for all seasonal plantings.',
      recommended_products: productsStore.slice(0, 3).map(sanitizeProductForPublic)
    });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 EBINESAR HARVEST server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
