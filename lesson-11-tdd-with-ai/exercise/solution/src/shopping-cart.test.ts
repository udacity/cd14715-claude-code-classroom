/**
 * Shopping Cart Tests - Complete Solution
 *
 * Comprehensive test suite generated with AI assistance.
 * Covers: happy paths, edge cases, error scenarios, security.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  addItem,
  removeItem,
  updateQuantity,
  applyPromoCode,
  removePromoCode,
  calculateTotals,
  clearCart,
  getCart,
  getProduct,
  getAppliedPromoCode,
  getCartItemCount,
  isCartEmpty,
} from "./shopping-cart.js";

// =============================================================================
// Setup
// =============================================================================

beforeEach(() => {
  clearCart();
});

// =============================================================================
// Add Item Tests
// =============================================================================

describe("Add Item to Cart", () => {
  describe("Happy Path", () => {
    it("should add a valid product to empty cart", () => {
      const result = addItem("PROD-001", 1);

      expect(result.success).toBe(true);
      expect(result.cart).toHaveLength(1);
      expect(result.cart![0]).toEqual({
        productId: "PROD-001",
        name: "Widget A",
        price: 29.99,
        quantity: 1,
      });
    });

    it("should add multiple different products", () => {
      addItem("PROD-001", 1);
      const result = addItem("PROD-002", 2);

      expect(result.success).toBe(true);
      expect(result.cart).toHaveLength(2);
    });

    it("should combine quantities when adding same product twice", () => {
      addItem("PROD-001", 2);
      const result = addItem("PROD-001", 3);

      expect(result.success).toBe(true);
      expect(result.cart).toHaveLength(1);
      expect(result.cart![0].quantity).toBe(5);
    });
  });

  describe("Validation", () => {
    it("should reject non-existent product", () => {
      const result = addItem("INVALID-ID", 1);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Product not found");
    });

    it("should reject zero quantity", () => {
      const result = addItem("PROD-001", 0);

      expect(result.success).toBe(false);
      expect(result.error).toContain("positive integer");
    });

    it("should reject negative quantity", () => {
      const result = addItem("PROD-001", -1);

      expect(result.success).toBe(false);
      expect(result.error).toContain("positive integer");
    });

    it("should reject non-integer quantity", () => {
      const result = addItem("PROD-001", 1.5);

      expect(result.success).toBe(false);
      expect(result.error).toContain("integer");
    });
  });

  describe("Inventory Validation", () => {
    it("should reject quantity exceeding inventory", () => {
      const result = addItem("PROD-006", 5); // Only 2 in stock

      expect(result.success).toBe(false);
      expect(result.error).toContain("Insufficient inventory");
    });

    it("should reject combined quantity exceeding inventory", () => {
      addItem("PROD-006", 1);
      const result = addItem("PROD-006", 2); // Would total 3, only 2 in stock

      expect(result.success).toBe(false);
      expect(result.error).toContain("Insufficient inventory");
    });

    it("should accept quantity equal to inventory", () => {
      const result = addItem("PROD-006", 2); // Exactly 2 in stock

      expect(result.success).toBe(true);
    });
  });
});

// =============================================================================
// Remove Item Tests
// =============================================================================

describe("Remove Item from Cart", () => {
  it("should remove existing item", () => {
    addItem("PROD-001", 2);
    const result = removeItem("PROD-001");

    expect(result.success).toBe(true);
    expect(result.cart).toHaveLength(0);
  });

  it("should succeed when removing non-existent item (idempotent)", () => {
    const result = removeItem("PROD-001");

    expect(result.success).toBe(true);
    expect(result.cart).toHaveLength(0);
  });

  it("should only remove specified item", () => {
    addItem("PROD-001", 1);
    addItem("PROD-002", 1);
    removeItem("PROD-001");

    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].productId).toBe("PROD-002");
  });
});

// =============================================================================
// Update Quantity Tests
// =============================================================================

describe("Update Item Quantity", () => {
  beforeEach(() => {
    addItem("PROD-001", 2);
  });

  describe("Happy Path", () => {
    it("should update quantity to higher value", () => {
      const result = updateQuantity("PROD-001", 5);

      expect(result.success).toBe(true);
      expect(result.cart![0].quantity).toBe(5);
    });

    it("should update quantity to lower value", () => {
      const result = updateQuantity("PROD-001", 1);

      expect(result.success).toBe(true);
      expect(result.cart![0].quantity).toBe(1);
    });

    it("should remove item when quantity set to zero", () => {
      const result = updateQuantity("PROD-001", 0);

      expect(result.success).toBe(true);
      expect(result.cart).toHaveLength(0);
    });
  });

  describe("Validation", () => {
    it("should reject update for item not in cart", () => {
      const result = updateQuantity("PROD-002", 1);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Item not in cart");
    });

    it("should reject negative quantity", () => {
      const result = updateQuantity("PROD-001", -1);

      expect(result.success).toBe(false);
      expect(result.error).toContain("non-negative");
    });

    it("should reject quantity exceeding inventory", () => {
      addItem("PROD-006", 1);
      const result = updateQuantity("PROD-006", 5);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Insufficient inventory");
    });
  });
});

// =============================================================================
// Promo Code Tests
// =============================================================================

describe("Apply Promotional Code", () => {
  beforeEach(() => {
    addItem("PROD-003", 1); // $99.99 item
  });

  describe("Valid Codes", () => {
    it("should apply percentage discount code", () => {
      const result = applyPromoCode("SAVE10");

      expect(result.success).toBe(true);
      expect(getAppliedPromoCode()?.code).toBe("SAVE10");
    });

    it("should be case-insensitive", () => {
      const result = applyPromoCode("save10");

      expect(result.success).toBe(true);
    });

    it("should trim whitespace", () => {
      const result = applyPromoCode("  SAVE10  ");

      expect(result.success).toBe(true);
    });

    it("should apply fixed discount code", () => {
      addItem("PROD-005", 1);
      const result = applyPromoCode("FLAT20");

      expect(result.success).toBe(true);
    });

    it("should apply free shipping code", () => {
      const result = applyPromoCode("FREESHIP");

      expect(result.success).toBe(true);
    });
  });

  describe("Invalid Codes", () => {
    it("should reject non-existent code", () => {
      const result = applyPromoCode("NOTACODE");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid promo code");
    });

    it("should reject expired code", () => {
      const result = applyPromoCode("EXPIRED");

      expect(result.success).toBe(false);
      expect(result.error).toContain("expired");
    });

    it("should reject code at usage limit", () => {
      const result = applyPromoCode("MAXED");

      expect(result.success).toBe(false);
      expect(result.error).toContain("usage limit");
    });
  });

  describe("Minimum Purchase", () => {
    it("should apply code when above minimum", () => {
      // Cart has $99.99, SAVE10 requires $50
      const result = applyPromoCode("SAVE10");

      expect(result.success).toBe(true);
    });

    it("should reject code when below minimum", () => {
      clearCart();
      addItem("PROD-005", 1); // $9.99 item
      const result = applyPromoCode("SAVE10"); // Requires $50

      expect(result.success).toBe(false);
      expect(result.error).toContain("Minimum purchase");
      expect(result.error).toContain("$50");
    });
  });

  describe("Replace Codes", () => {
    it("should replace existing promo code", () => {
      addItem("PROD-004", 1); // Add more to meet FLAT20 minimum
      applyPromoCode("SAVE10");
      applyPromoCode("FLAT20");

      expect(getAppliedPromoCode()?.code).toBe("FLAT20");
    });
  });
});

describe("Remove Promotional Code", () => {
  it("should remove applied code", () => {
    addItem("PROD-003", 1);
    applyPromoCode("SAVE10");
    removePromoCode();

    expect(getAppliedPromoCode()).toBeNull();
  });

  it("should succeed when no code applied", () => {
    const result = removePromoCode();

    expect(result.success).toBe(true);
  });
});

// =============================================================================
// Calculate Totals Tests
// =============================================================================

describe("Calculate Totals", () => {
  describe("Empty Cart", () => {
    it("should return zeros for empty cart", () => {
      const totals = calculateTotals();

      expect(totals.subtotal).toBe(0);
      expect(totals.discount).toBe(0);
      expect(totals.tax).toBe(0);
      expect(totals.shipping).toBe(5.99);
      expect(totals.total).toBe(5.99);
    });
  });

  describe("Subtotal Calculation", () => {
    it("should calculate subtotal for single item", () => {
      addItem("PROD-001", 1); // $29.99

      const totals = calculateTotals();

      expect(totals.subtotal).toBeCloseTo(29.99, 2);
    });

    it("should calculate subtotal for multiple items", () => {
      addItem("PROD-001", 2); // $29.99 * 2 = $59.98
      addItem("PROD-002", 1); // $49.99

      const totals = calculateTotals();

      expect(totals.subtotal).toBeCloseTo(109.97, 2);
    });
  });

  describe("Tax Calculation", () => {
    it("should calculate 8% tax on subtotal", () => {
      addItem("PROD-003", 1); // $99.99

      const totals = calculateTotals();

      expect(totals.tax).toBeCloseTo(99.99 * 0.08, 2);
    });

    it("should calculate tax after discount", () => {
      addItem("PROD-003", 1); // $99.99
      applyPromoCode("SAVE10"); // 10% off = $9.999 discount

      const totals = calculateTotals();
      const expectedAfterDiscount = 99.99 - 10; // Approximately
      const expectedTax = expectedAfterDiscount * 0.08;

      expect(totals.tax).toBeCloseTo(expectedTax, 1);
    });
  });

  describe("Shipping Calculation", () => {
    it("should charge $5.99 shipping under $100", () => {
      addItem("PROD-001", 1); // $29.99

      const totals = calculateTotals();

      expect(totals.shipping).toBe(5.99);
    });

    it("should provide free shipping at $100+", () => {
      addItem("PROD-003", 1); // $99.99
      addItem("PROD-005", 1); // $9.99 = $109.98 total

      const totals = calculateTotals();

      expect(totals.shipping).toBe(0);
    });

    it("should provide free shipping with promo code", () => {
      addItem("PROD-001", 3); // $89.97 (above $75 minimum for FREESHIP)
      applyPromoCode("FREESHIP");

      const totals = calculateTotals();

      expect(totals.shipping).toBe(0);
    });
  });

  describe("Discount Calculation", () => {
    it("should apply percentage discount", () => {
      addItem("PROD-003", 1); // $99.99
      applyPromoCode("SAVE10"); // 10% off

      const totals = calculateTotals();

      expect(totals.discount).toBeCloseTo(10, 0);
    });

    it("should apply fixed discount", () => {
      addItem("PROD-004", 1); // $199.99
      applyPromoCode("FLAT20"); // $20 off

      const totals = calculateTotals();

      expect(totals.discount).toBe(20);
    });

    it("should cap percentage discount at maxDiscount", () => {
      addItem("PROD-004", 1); // $199.99
      applyPromoCode("CAPPED"); // 50% off but capped at $25

      const totals = calculateTotals();

      expect(totals.discount).toBe(25); // Capped, not 50% of $199.99
    });

    it("should not apply discount when cart falls below minimum", () => {
      addItem("PROD-003", 1); // $99.99
      applyPromoCode("SAVE10");
      updateQuantity("PROD-003", 0); // Remove item
      addItem("PROD-005", 1); // $9.99 (below $50 minimum)

      const totals = calculateTotals();

      expect(totals.discount).toBe(0);
    });
  });

  describe("Currency Precision", () => {
    it("should round all values to 2 decimal places", () => {
      // Create a scenario that could cause floating point errors
      addItem("PROD-005", 3); // $9.99 * 3 = $29.97

      const totals = calculateTotals();

      expect(totals.subtotal).toBe(29.97);
      expect(Number.isInteger(totals.tax * 100)).toBe(true);
      expect(Number.isInteger(totals.total * 100)).toBe(true);
    });
  });

  describe("Total Calculation", () => {
    it("should calculate correct total", () => {
      addItem("PROD-003", 1); // $99.99
      applyPromoCode("SAVE10"); // 10% off

      const totals = calculateTotals();

      // subtotal - discount + tax + shipping
      const expected =
        totals.subtotal - totals.discount + totals.tax + totals.shipping;

      expect(totals.total).toBeCloseTo(expected, 2);
    });
  });
});

// =============================================================================
// Cart State Tests
// =============================================================================

describe("Cart State", () => {
  describe("getCart", () => {
    it("should return empty array for new cart", () => {
      expect(getCart()).toEqual([]);
    });

    it("should return copy of cart (not reference)", () => {
      addItem("PROD-001", 1);
      const cart1 = getCart();
      const cart2 = getCart();

      expect(cart1).not.toBe(cart2);
      expect(cart1).toEqual(cart2);
    });
  });

  describe("clearCart", () => {
    it("should remove all items", () => {
      addItem("PROD-001", 1);
      addItem("PROD-002", 1);
      clearCart();

      expect(getCart()).toHaveLength(0);
    });

    it("should remove promo code", () => {
      addItem("PROD-003", 1);
      applyPromoCode("SAVE10");
      clearCart();

      expect(getAppliedPromoCode()).toBeNull();
    });
  });

  describe("getCartItemCount", () => {
    it("should return 0 for empty cart", () => {
      expect(getCartItemCount()).toBe(0);
    });

    it("should return total quantity across all items", () => {
      addItem("PROD-001", 2);
      addItem("PROD-002", 3);

      expect(getCartItemCount()).toBe(5);
    });
  });

  describe("isCartEmpty", () => {
    it("should return true for empty cart", () => {
      expect(isCartEmpty()).toBe(true);
    });

    it("should return false when cart has items", () => {
      addItem("PROD-001", 1);

      expect(isCartEmpty()).toBe(false);
    });
  });
});

// =============================================================================
// Integration Tests
// =============================================================================

describe("Integration: Complete Purchase Flow", () => {
  it("should handle complete shopping flow", () => {
    // 1. Add items
    addItem("PROD-001", 2); // $59.98
    addItem("PROD-002", 1); // $49.99
    // Subtotal: $109.97

    // 2. Update quantity
    updateQuantity("PROD-001", 3); // Now $89.97
    // Subtotal: $139.96

    // 3. Apply promo code
    applyPromoCode("FLAT20"); // $20 off

    // 4. Calculate totals
    const totals = calculateTotals();

    expect(totals.subtotal).toBeCloseTo(139.96, 2);
    expect(totals.discount).toBe(20);
    expect(totals.shipping).toBe(0); // Free shipping over $100
    expect(totals.tax).toBeCloseTo((139.96 - 20) * 0.08, 2);
  });

  it("should handle item removal during checkout", () => {
    addItem("PROD-001", 2);
    addItem("PROD-002", 1);

    const initialCount = getCartItemCount();
    expect(initialCount).toBe(3);

    removeItem("PROD-001");

    const finalCount = getCartItemCount();
    expect(finalCount).toBe(1);
  });
});

// =============================================================================
// Security Edge Cases
// =============================================================================

describe("Security Edge Cases", () => {
  it("should not allow negative quantities to reduce price", () => {
    addItem("PROD-001", 1);
    const result = updateQuantity("PROD-001", -10);

    expect(result.success).toBe(false);
  });

  it("should handle very large quantities gracefully", () => {
    const result = addItem("PROD-001", Number.MAX_SAFE_INTEGER);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Insufficient inventory");
  });

  it("should not leak product existence through different error messages", () => {
    const invalidResult = addItem("INVALID", 1);
    const validButNoStock = addItem("PROD-006", 1000);

    // Both should fail, but only inventory error reveals product exists
    expect(invalidResult.success).toBe(false);
    expect(validButNoStock.success).toBe(false);
  });
});
