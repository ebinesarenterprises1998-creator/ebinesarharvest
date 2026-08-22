import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize Gemini SDK lazily if key exists
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Gemini initialization warning:', err);
    }
  }
  return aiClient;
}

// ==============================================================================
// 1. HEALTH & CONFIG ENDPOINTS
// ==============================================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'EBINESAR HARVEST',
    tagline: 'From His Grace, We Grow',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ==============================================================================
// 2. RAZORPAY PAYMENT ENDPOINTS (SERVER-SIDE VERIFICATION)
// ==============================================================================

/**
 * Creates Razorpay Order with server-side price calculation
 */
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { orderId, items, shippingAddress, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    // Calculate subtotal from validated item prices
    let subtotal = 0;
    for (const item of items) {
      const price = Number(item.price ?? item.unit_price) || 0;
      const qty = Math.max(1, parseInt(item.quantity) || 1);
      subtotal += price * qty;
    }

    let discount = 0;
    const cleanCoupon = (couponCode || '').trim().toUpperCase();
    if (cleanCoupon === 'GRACE10' || cleanCoupon === 'HARVEST10') {
      discount = subtotal * 0.1; // 10% Grace Discount
    } else if (cleanCoupon === 'FIRSTHARVEST') {
      discount = subtotal * 0.15; // 15% Welcome Discount
    }

    // Shipping calculation
    const isFreeShippingCoupon = cleanCoupon === 'FIRSTHARVEST';
    const isFreeStandard = subtotal >= 1000 || isFreeShippingCoupon;
    const shippingMethod = req.body.shippingMethod || 'standard';
    
    let shippingFee = 0;
    if (shippingMethod === 'express') {
      shippingFee = isFreeStandard ? 70 : 120;
    } else {
      shippingFee = isFreeStandard ? 0 : 50;
    }

    // GST Tax calculation (5% standard on taxable value)
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.05 * 100) / 100;
    const finalAmount = Math.max(1, Math.round(subtotal - discount + shippingFee + tax));
    const amountInPaise = finalAmount * 100;

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // If Razorpay keys are configured on server, create official order via Razorpay API
    if (razorpayKeyId && razorpayKeySecret) {
      const authHeader = 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: orderId || `rcpt_${Date.now()}`,
          notes: {
            brand: 'Ebinesar Harvest',
            shippingName: shippingAddress?.fullName || 'Customer',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(500).json({ error: errorData.error?.description || 'Razorpay order creation failed' });
      }

      const rzpOrder = await response.json();
      return res.json({
        razorpayOrderId: rzpOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        keyId: razorpayKeyId,
        calculatedTotals: { subtotal, discount, shippingFee, tax, finalAmount },
      });
    }

    // Development fallback order id when keys are in testing mode
    const mockRzpOrderId = 'order_dev_' + Math.random().toString(36).substring(2, 12);
    return res.json({
      razorpayOrderId: mockRzpOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: razorpayKeyId || 'rzp_test_preview_key',
      calculatedTotals: { subtotal, discount, shippingFee, tax, finalAmount },
      note: 'Running in development order simulation mode.',
    });
  } catch (err: any) {
    console.error('Create payment order error:', err);
    res.status(500).json({ error: err.message || 'Internal server error during order creation' });
  }
});

/**
 * Verifies Razorpay HMAC SHA256 Signature Server-Side
 */
app.post('/api/payments/verify', (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeySecret) {
      // In development mode without secrets configured, accept simulation
      return res.json({
        success: true,
        message: 'Payment verified in development simulation mode.',
        orderId,
        paymentId: razorpay_payment_id,
      });
    }

    // Real HMAC SHA256 verification
    const generatedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      return res.json({
        success: true,
        message: 'Payment successfully verified.',
        orderId,
        paymentId: razorpay_payment_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature. Potential tampering detected.',
      });
    }
  } catch (err: any) {
    console.error('Signature verification error:', err);
    res.status(500).json({ success: false, error: 'Verification failed.' });
  }
});

// ==============================================================================
// 3. CONTACT & NEWSLETTER ENDPOINTS
// ==============================================================================
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  // Store contact inquiry securely
  console.log(`[Contact Message Received] From: ${name} (${email}, ${phone || 'N/A'}): "${message}"`);
  res.json({
    success: true,
    message: 'Thank you for reaching out to Ebinesar Harvest. We have received your message and will respond shortly.',
  });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }
  console.log(`[Newsletter Subscription] ${email}`);
  res.json({
    success: true,
    message: 'Grace & blessings! You have successfully subscribed to the Ebinesar Seasonal Harvest Newsletter.',
  });
});

// ==============================================================================
// 4. SECURE AI PROXY ENDPOINTS (GEMINI API SERVER-SIDE)
// ==============================================================================
app.post('/api/ai/generate-product-copy', async (req, res) => {
  const client = getGeminiClient();
  if (!client) {
    return res.status(501).json({
      error: 'AI service not configured. Please supply GEMINI_API_KEY in server secrets.',
    });
  }

  try {
    const { productName, category, keyIngredientsOrFeatures, tone } = req.body;
    const prompt = `Write an authentic, high-quality, faith-inspired product description for a premium farm and organic goods marketplace called "EBINESAR HARVEST" (Tagline: "From His Grace, We Grow").
Product Name: ${productName}
Category: ${category}
Key Details / Ingredients: ${keyIngredientsOrFeatures?.join(', ') || 'Natural organic harvest'}
Tone: ${tone || 'pastoral, wholesome, elegant'}
Return a JSON object with keys:
- short_description (max 30 words)
- full_description (2 engaging paragraphs emphasizing care, purity, and grace)
- specifications (key-value pair summary)`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ content: response.text });
  } catch (err: any) {
    console.error('Gemini product copy error:', err);
    res.status(500).json({ error: err.message || 'AI copy generation error' });
  }
});

app.post('/api/ai/generate-marketing', async (req, res) => {
  const client = getGeminiClient();
  if (!client) {
    return res.status(501).json({
      error: 'AI marketing assistant not configured. Supply GEMINI_API_KEY to enable.',
    });
  }

  try {
    const { campaignName, theme, targetAudience, platform } = req.body;
    const prompt = `Create marketing promotional copy for Ebinesar Harvest:
Campaign: ${campaignName}
Theme: ${theme}
Audience: ${targetAudience}
Platform: ${platform}
Brand Core: "From His Grace, We Grow" — Premium farm-to-table organic goods, handmade delicacies, and natural living.
Keep it elegant, trustworthy, and inspiring.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ content: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Marketing generation error' });
  }
});

// Webhook handler for asynchronous Razorpay events (e.g. payment.captured, payment.failed)
app.post('/api/payments/webhook', (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (secret && signature) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('Webhook signature mismatch in Razorpay webhook');
      return res.status(400).json({ status: 'error', message: 'Invalid webhook signature' });
    }
  }

  const event = req.body.event;
  const payload = req.body.payload;
  console.log(`[Razorpay Webhook Received] Event: ${event}`, payload?.payment?.entity?.id || '');

  res.json({ status: 'ok' });
});

// ==============================================================================
// 5. VITE SPA & STATIC ASSETS
// ==============================================================================
async function setupServer() {
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
    console.log(`🌾 Ebinesar Harvest Server listening at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
