/**
 * Razorpay Payment Gateway Integration
 * 
 * SECURITY RULES:
 * 1. Never trust the price received from browser. The server calculates totals and creates the Razorpay Order.
 * 2. Never expose RAZORPAY_KEY_SECRET in frontend JavaScript.
 * 3. Payment signature is verified server-side.
 */

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface CheckoutParams {
  orderId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price?: number;
    unit_price?: number;
    name?: string;
  }>;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  shippingMethod?: 'standard' | 'express';
  couponCode?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  orderId?: string;
  paymentId?: string;
  error?: string;
}

export const razorpayService = {
  /**
   * Loads the Razorpay checkout modal and handles server-verified flow
   */
  async initiatePayment(
    params: CheckoutParams,
    onSuccess: (res: PaymentVerificationResult) => void,
    onError: (err: string) => void
  ): Promise<void> {
    try {
      // 1. Create server-side order with secure price recalculation
      const createOrderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!createOrderRes.ok) {
        const errData = await createOrderRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to initiate secure payment session');
      }

      const orderData = await createOrderRes.json();
      const { razorpayOrderId, amount, currency, keyId } = orderData;

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please check your internet connection.');
      }

      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_defaultKey',
        amount: amount, // in paise
        currency: currency || 'INR',
        name: 'Ebinesar Harvest',
        description: `Order #${params.orderId} - From His Grace, We Grow`,
        image: '/logo.png',
        order_id: razorpayOrderId,
        prefill: {
          name: params.shippingAddress.fullName,
          email: params.shippingAddress.email,
          contact: params.shippingAddress.phone,
        },
        theme: {
          color: '#0B3D2E',
        },
        modal: {
          ondismiss: () => {
            onError('Payment was cancelled by the user.');
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 2. Server-side signature verification
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: params.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              onSuccess({
                success: true,
                orderId: params.orderId,
                paymentId: response.razorpay_payment_id,
              });
            } else {
              onError(verifyData.error || 'Payment verification failed on server.');
            }
          } catch (err: any) {
            onError(err.message || 'Error communicating with verification server.');
          }
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (error: any) {
      onError(error.message || 'Payment initiation failed.');
    }
  },
};
