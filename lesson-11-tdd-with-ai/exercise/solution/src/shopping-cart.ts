/**
 * Shopping Cart Module - Complete Solution
 *
 * All gaps from the starter have been fixed:
 * ✓ Inventory validation
 * ✓ Proper error handling
 * ✓ Promo code validation (expiration, limits, minimums)
 * ✓ Currency rounding
 * ✓ Maximum discount caps
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
  ["PROD-006", { id: "PROD-006", name: "Limited Item", price: 59.99, category: "limited", inStock: 2 }],
]);

// Sample promo codes
const promoCodes = new Map<string, PromoCode>([
  ["SAVE10", { code: "SAVE10", type: "percentage", value: 10, minPurchase: 50, usedCount: 0 }],
  ["FLAT20", { code: "FLAT20", type: "fixed", value: 20, minPurchase: 100, usedCount: 0 }],
  ["FREESHIP", { code: "FREESHIP", type: "freeShipping", value: 0, minPurchase: 75, usedCount: 0 }],
  ["EXPIRED", { code: "EXPIRED", type: "percentage", value: 15, minPurchase: 0, expiresAt: new Date("2020-01-01"), usedCount: 0 }],
  ["MAXED", { code: "MAXED", type: "percentage", value: 20, minPurchase: 0, usageLimit: 5, usedCount: 5 }],
  ["CAPPED", { code: "CAPPED", type: "percentage", value: 50, minPurchase: 0, maxDiscount: 25, usedCount: 0 }],
]);

// =============================================================================
// Configuration
// =============================================================================

const TAX_RATE = 0.08; // 8% tax
const SHIPPING_RATE = 5.99;
const FREE_SHIPPING_THRESHOLD = 100;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Round a number to 2 decimal places (currency precision)
 */
function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Validate quantity is a positive integer
 */
function validateQuantity(quantity: number, allowZero = false): string | null {
  if (!Number.isInteger(quantity)) {
    return "Quantity must be an integer";
  }
  if (allowZero) {
    if (quantity < 0) {
      return "Quantity must be a non-negative integer";
    }
  } else {
    if (quantity < 1) {
      return "Quantity must be a positive integer";
    }
  }
  return null;
}

/**
 * Calculate current cart subtotal
 */
function getSubtotal(): number {
  return roundCurrency(
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
}

// =============================================================================
// Cart Operations
// =============================================================================

/**
 * Add an item to the cart
 */
export function addItem(productId: string, quantity: number): CartResult {
  // Validate quantity
  const quantityError = validateQuantity(quantity);
  if (quantityError) {
    return { success: false, error: quantityError };
  }

  // Check if product exists
  const product = products.get(productId);
  if (!product) {
    return { success: false, error: "Product not found" };
  }

  // Check current cart quantity for this product
  const existingItem = cart.find((item) => item.productId === productId);
  const currentQuantity = existingItem ? existingItem.quantity : 0;
  const totalQuantity = currentQuantity + quantity;

  // Validate inventory
  if (totalQuantity > product.inStock) {
    return {
      success: false,
      error: `Insufficient inventory. Available: ${product.inStock}, Requested: ${totalQuantity}`,
    };
  }

  // Add or update cart
  if (existingItem) {
    existingItem.quantity = totalQuantity;
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
 */
export function removeItem(productId: string): CartResult {
  const index = cart.findIndex((item) => item.productId === productId);

  if (index !== -1) {
    cart.splice(index, 1);
  }

  // Always succeeds (idempotent operation)
  return { success: true, cart: [...cart] };
}

/**
 * Update item quantity
 */
export function updateQuantity(productId: string, quantity: number): CartResult {
  // Validate quantity (allow zero for removal)
  const quantityError = validateQuantity(quantity, true);
  if (quantityError) {
    return { success: false, error: quantityError };
  }

  // Find item in cart
  const itemIndex = cart.findIndex((item) => item.productId === productId);
  if (itemIndex === -1) {
    return { success: false, error: "Item not in cart" };
  }

  // If quantity is zero, remove the item
  if (quantity === 0) {
    cart.splice(itemIndex, 1);
    return { success: true, cart: [...cart] };
  }

  // Check inventory
  const product = products.get(productId);
  if (product && quantity > product.inStock) {
    return {
      success: false,
      error: `Insufficient inventory. Available: ${product.inStock}, Requested: ${quantity}`,
    };
  }

  // Update quantity
  cart[itemIndex].quantity = quantity;
  return { success: true, cart: [...cart] };
}

/**
 * Apply promotional code
 */
export function applyPromoCode(code: string): CartResult {
  const normalizedCode = code.toUpperCase().trim();
  const promo = promoCodes.get(normalizedCode);

  if (!promo) {
    return { success: false, error: "Invalid promo code" };
  }

  // Check expiration
  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return { success: false, error: "Promo code has expired" };
  }

  // Check usage limit
  if (promo.usageLimit !== undefined && promo.usedCount >= promo.usageLimit) {
    return { success: false, error: "Promo code usage limit reached" };
  }

  // Check minimum purchase
  const subtotal = getSubtotal();
  if (subtotal < promo.minPurchase) {
    return {
      success: false,
      error: `Minimum purchase of $${promo.minPurchase.toFixed(2)} required`,
    };
  }

  // Apply promo code
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
 */
export function calculateTotals(): CartTotals {
  // Calculate subtotal
  const subtotal = getSubtotal();

  // Calculate discount
  let discount = 0;
  if (appliedPromoCode) {
    // Re-validate minimum purchase (cart may have changed)
    if (subtotal >= appliedPromoCode.minPurchase) {
      switch (appliedPromoCode.type) {
        case "percentage":
          discount = subtotal * (appliedPromoCode.value / 100);
          // Apply max discount cap if set
          if (appliedPromoCode.maxDiscount !== undefined) {
            discount = Math.min(discount, appliedPromoCode.maxDiscount);
          }
          break;
        case "fixed":
          discount = Math.min(appliedPromoCode.value, subtotal); // Can't discount more than subtotal
          break;
        case "freeShipping":
          // Handled in shipping calculation
          break;
      }
    }
  }
  discount = roundCurrency(discount);

  // Calculate taxable amount
  const afterDiscount = roundCurrency(subtotal - discount);

  // Calculate tax
  const tax = roundCurrency(afterDiscount * TAX_RATE);

  // Calculate shipping
  let shipping = SHIPPING_RATE;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    shipping = 0;
  }
  if (appliedPromoCode?.type === "freeShipping" && subtotal >= appliedPromoCode.minPurchase) {
    shipping = 0;
  }

  // Calculate total
  const total = roundCurrency(afterDiscount + tax + shipping);

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

/**
 * Get cart item count
 */
export function getCartItemCount(): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Check if cart is empty
 */
export function isCartEmpty(): boolean {
  return cart.length === 0;
}
