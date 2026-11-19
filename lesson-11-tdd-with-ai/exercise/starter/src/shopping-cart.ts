/**
 * Shopping Cart Module
 *
 * This module has INTENTIONAL GAPS for test coverage exercises.
 * Students should use TDD to identify missing functionality and tests.
 */

import { z } from "zod";

// =============================================================================
// Types & Schemas
// =============================================================================

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  category: z.string(),
  inStock: z.number().int().nonnegative(),
});

export const CartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const PromoCodeSchema = z.object({
  code: z.string(),
  type: z.enum(["percentage", "fixed", "freeShipping"]),
  value: z.number().nonnegative(),
  minPurchase: z.number().nonnegative().default(0),
  maxDiscount: z.number().positive().optional(),
  expiresAt: z.date().optional(),
  usageLimit: z.number().int().positive().optional(),
  usedCount: z.number().int().nonnegative().default(0),
});

export type Product = z.infer<typeof ProductSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type PromoCode = z.infer<typeof PromoCodeSchema>;

export interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface CartResult {
  success: boolean;
  error?: string;
  cart?: CartItem[];
  totals?: CartTotals;
}

// =============================================================================
// In-Memory Storage
// =============================================================================

const cart: CartItem[] = [];
let appliedPromoCode: PromoCode | null = null;

// Sample product catalog
const products = new Map<string, Product>([
  ["PROD-001", { id: "PROD-001", name: "Widget A", price: 29.99, category: "electronics", inStock: 100 }],
  ["PROD-002", { id: "PROD-002", name: "Widget B", price: 49.99, category: "electronics", inStock: 50 }],
  ["PROD-003", { id: "PROD-003", name: "Gadget C", price: 99.99, category: "gadgets", inStock: 25 }],
  ["PROD-004", { id: "PROD-004", name: "Premium Item", price: 199.99, category: "premium", inStock: 10 }],
  ["PROD-005", { id: "PROD-005", name: "Budget Item", price: 9.99, category: "budget", inStock: 500 }],
]);

// Sample promo codes
const promoCodes = new Map<string, PromoCode>([
  ["SAVE10", { code: "SAVE10", type: "percentage", value: 10, minPurchase: 50, usedCount: 0 }],
  ["FLAT20", { code: "FLAT20", type: "fixed", value: 20, minPurchase: 100, usedCount: 0 }],
  ["FREESHIP", { code: "FREESHIP", type: "freeShipping", value: 0, minPurchase: 75, usedCount: 0 }],
]);

// =============================================================================
// Configuration
// =============================================================================

const TAX_RATE = 0.08; // 8% tax
const SHIPPING_RATE = 5.99;
const FREE_SHIPPING_THRESHOLD = 100;

// =============================================================================
// Cart Operations
// =============================================================================

/**
 * Add an item to the cart
 *
 * GAP: Inventory validation is incomplete
 * GAP: Error handling for invalid products is missing
 */
export function addItem(productId: string, quantity: number): CartResult {
  // TODO: Validate quantity is positive
  // TODO: Check if product exists
  // TODO: Check inventory availability

  const product = products.get(productId);

  if (!product) {
    return { success: false, error: "Product not found" };
  }

  // GAP: Should check inventory before adding
  // if (product.inStock < quantity) { ... }

  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  return { success: true, cart: [...cart] };
}

/**
 * Remove an item from the cart
 *
 * GAP: What happens if item doesn't exist?
 */
export function removeItem(productId: string): CartResult {
  const index = cart.findIndex((item) => item.productId === productId);

  if (index === -1) {
    // GAP: Should this be an error or success?
    return { success: true, cart: [...cart] };
  }

  cart.splice(index, 1);
  return { success: true, cart: [...cart] };
}

/**
 * Update item quantity
 *
 * GAP: Zero quantity handling
 * GAP: Inventory validation
 */
export function updateQuantity(productId: string, quantity: number): CartResult {
  // TODO: Handle quantity <= 0 (should remove item?)
  // TODO: Validate against inventory

  const item = cart.find((item) => item.productId === productId);

  if (!item) {
    return { success: false, error: "Item not in cart" };
  }

  // GAP: Should check inventory
  item.quantity = quantity;

  return { success: true, cart: [...cart] };
}

/**
 * Apply promotional code
 *
 * GAP: Expiration checking
 * GAP: Usage limit tracking
 * GAP: Minimum purchase validation
 */
export function applyPromoCode(code: string): CartResult {
  const promo = promoCodes.get(code.toUpperCase());

  if (!promo) {
    return { success: false, error: "Invalid promo code" };
  }

  // GAP: Should check expiration
  // GAP: Should check usage limits
  // GAP: Should check minimum purchase

  appliedPromoCode = promo;

  return { success: true, cart: [...cart] };
}

/**
 * Remove applied promo code
 */
export function removePromoCode(): CartResult {
  appliedPromoCode = null;
  return { success: true, cart: [...cart] };
}

/**
 * Calculate cart totals
 *
 * GAP: Rounding errors in currency
 * GAP: Maximum discount cap
 */
export function calculateTotals(): CartTotals {
  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate discount
  let discount = 0;
  if (appliedPromoCode) {
    switch (appliedPromoCode.type) {
      case "percentage":
        discount = subtotal * (appliedPromoCode.value / 100);
        // GAP: Should apply maxDiscount cap
        break;
      case "fixed":
        discount = appliedPromoCode.value;
        break;
      case "freeShipping":
        // Handled in shipping calculation
        break;
    }
  }

  // GAP: Potential rounding errors - should round to 2 decimal places
  const afterDiscount = subtotal - discount;

  // Calculate tax
  const tax = afterDiscount * TAX_RATE;

  // Calculate shipping
  let shipping = SHIPPING_RATE;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    shipping = 0;
  }
  if (appliedPromoCode?.type === "freeShipping") {
    shipping = 0;
  }

  // Calculate total
  const total = afterDiscount + tax + shipping;

  return {
    subtotal,
    discount,
    tax,
    shipping,
    total,
  };
}

/**
 * Get current cart contents
 */
export function getCart(): CartItem[] {
  return [...cart];
}

/**
 * Clear the entire cart
 */
export function clearCart(): CartResult {
  cart.length = 0;
  appliedPromoCode = null;
  return { success: true, cart: [] };
}

/**
 * Get product by ID (for testing)
 */
export function getProduct(productId: string): Product | undefined {
  return products.get(productId);
}

/**
 * Get applied promo code (for testing)
 */
export function getAppliedPromoCode(): PromoCode | null {
  return appliedPromoCode;
}
