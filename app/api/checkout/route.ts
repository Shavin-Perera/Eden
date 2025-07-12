import { NextResponse } from 'next/server';
import { z } from 'zod';

// Rate limiter for checkout
const checkoutRateLimitMap = new Map();
const CHECKOUT_RATE_LIMIT = 5; // 5 requests per hour per IP
const CHECKOUT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isCheckoutRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = checkoutRateLimitMap.get(ip) || { count: 0, start: now };
  
  if (now - entry.start > CHECKOUT_WINDOW_MS) {
    checkoutRateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  
  if (entry.count >= CHECKOUT_RATE_LIMIT) {
    return true;
  }
  
  entry.count++;
  checkoutRateLimitMap.set(ip, entry);
  return false;
}

// Clean up old entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of checkoutRateLimitMap.entries()) {
    if (now - entry.start > CHECKOUT_WINDOW_MS) {
      checkoutRateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

// Checkout validation schema (excluding sensitive payment data)
const CheckoutSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  address: z.string().min(1).max(200).trim(),
  apartment: z.string().max(100).trim().optional(),
  city: z.string().min(1).max(100).trim(),
  state: z.string().min(1).max(100).trim(),
  zipCode: z.string().min(1).max(20).trim(),
  country: z.string().min(1).max(100).trim(),
  phone: z.string().max(20).trim().optional(),
  shippingMethod: z.string(),
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().positive().int(),
    image: z.string().optional(),
  })),
  total: z.number().positive(),
  // Payment method info (not sensitive data)
  paymentMethod: z.string(),
  // DO NOT include cardNumber, cvv, expiryDate in schema
});

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim();
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
    if (isCheckoutRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many checkout attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid checkout data provided' },
        { status: 400 }
      );
    }
    
    const { 
      email, firstName, lastName, address, apartment, city, state, 
      zipCode, country, phone, shippingMethod, items, total, paymentMethod 
    } = parsed.data;
    
    // Sanitize all inputs
    const sanitizedData = {
      email: email.toLowerCase(),
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      address: sanitizeInput(address),
      apartment: apartment ? sanitizeInput(apartment) : undefined,
      city: sanitizeInput(city),
      state: sanitizeInput(state),
      zipCode: sanitizeInput(zipCode),
      country: sanitizeInput(country),
      phone: phone ? sanitizeInput(phone) : undefined,
      shippingMethod,
      items: items.map(item => ({
        ...item,
        name: sanitizeInput(item.name),
        image: item.image ? sanitizeInput(item.image) : undefined,
      })),
      total,
      paymentMethod,
    };

    // Validate total matches items
    const calculatedTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (Math.abs(calculatedTotal - total) > 0.01) {
      return NextResponse.json(
        { error: 'Order total mismatch' },
        { status: 400 }
      );
    }

    // TODO: Integrate with actual payment processor (Stripe, PayPal, etc.)
    // For now, simulate payment processing
    const paymentSuccess = await simulatePaymentProcessing(sanitizedData);
    
    if (!paymentSuccess) {
      return NextResponse.json(
        { error: 'Payment processing failed' },
        { status: 402 }
      );
    }

    // Generate order number
    const orderNumber = generateOrderNumber();
    
    // TODO: Save order to database
    // await saveOrderToDatabase({
    //   orderNumber,
    //   customerData: sanitizedData,
    //   items: sanitizedData.items,
    //   total: sanitizedData.total,
    //   status: 'confirmed',
    //   createdAt: new Date(),
    //   ipAddress: ip,
    // });

    return NextResponse.json(
      { 
        success: true, 
        orderNumber,
        message: 'Order placed successfully' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Checkout error:', error.message);
    return NextResponse.json(
      { error: 'An unexpected error occurred during checkout' },
      { status: 500 }
    );
  }
}

// Simulate payment processing
async function simulatePaymentProcessing(orderData: any): Promise<boolean> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate 95% success rate
  return Math.random() > 0.05;
}

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `EDEN${timestamp}${random}`.toUpperCase();
} 