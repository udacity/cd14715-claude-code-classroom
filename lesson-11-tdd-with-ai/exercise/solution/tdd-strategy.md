# TDD Strategy for Shopping Cart Module

## 1. Requirements Specifications

Natural language requirements that Claude can convert to tests.

### 1.1 Add Item to Cart

**Requirement:**
Users can add products to their shopping cart by specifying the product ID and desired quantity. The system validates the product exists, the quantity is valid, and sufficient inventory is available.

**Inputs:**
- `productId` (string): Unique identifier of the product
- `quantity` (number): Number of items to add (must be positive integer)

**Expected Output:**
- Success: `{ success: true, cart: CartItem[] }`
- Failure: `{ success: false, error: string }`

**Validation Rules:**
- Product must exist in the catalog
- Quantity must be a positive integer (>= 1)
- Requested quantity must not exceed available inventory
- If product already in cart, quantities are combined

**Error Conditions:**
- "Product not found" - Invalid product ID
- "Quantity must be a positive integer" - Invalid quantity
- "Insufficient inventory" - Stock < requested quantity

---

### 1.2 Remove Item from Cart

**Requirement:**
Users can remove items from their cart by product ID. The entire item (all quantity) is removed. Removing a non-existent item is not an error.

**Inputs:**
- `productId` (string): Product ID to remove

**Expected Output:**
- `{ success: true, cart: CartItem[] }` (always succeeds)

**Validation Rules:**
- If item exists, remove it completely
- If item doesn't exist, return success with unchanged cart (idempotent)

**Error Conditions:**
- None - operation is always successful

---

### 1.3 Update Item Quantity

**Requirement:**
Users can change the quantity of an item already in their cart. Setting quantity to zero removes the item. Cannot exceed available inventory.

**Inputs:**
- `productId` (string): Product ID to update
- `quantity` (number): New quantity (0 = remove, >0 = update)

**Expected Output:**
- Success: `{ success: true, cart: CartItem[] }`
- Failure: `{ success: false, error: string }`

**Validation Rules:**
- Item must exist in cart
- Quantity must be non-negative integer
- Quantity = 0 removes item from cart
- New quantity must not exceed available inventory

**Error Conditions:**
- "Item not in cart" - Product not found in cart
- "Quantity must be a non-negative integer" - Invalid quantity
- "Insufficient inventory" - Stock < requested quantity

---

### 1.4 Apply Promotional Code

**Requirement:**
Users can apply one promotional code per cart. Codes may offer percentage discounts, fixed amount discounts, or free shipping. Codes have optional restrictions: minimum purchase amount, maximum discount cap, expiration date, and usage limits.

**Inputs:**
- `code` (string): Promotional code (case-insensitive)

**Expected Output:**
- Success: `{ success: true, cart: CartItem[] }`
- Failure: `{ success: false, error: string }`

**Validation Rules:**
- Code must exist in the system
- Code must not be expired (if expiresAt is set)
- Code must not exceed usage limit (if usageLimit is set)
- Cart subtotal must meet minimum purchase requirement (if minPurchase is set)
- Only one promo code can be active at a time (replaces previous)

**Error Conditions:**
- "Invalid promo code" - Code doesn't exist
- "Promo code has expired" - Current date > expiresAt
- "Promo code usage limit reached" - usedCount >= usageLimit
- "Minimum purchase of $X required" - Subtotal < minPurchase

---

### 1.5 Calculate Total with Tax

**Requirement:**
Calculate the complete cart total including subtotal, discounts, tax, and shipping. All monetary values must be rounded to 2 decimal places to avoid floating-point errors.

**Inputs:**
- None (uses current cart state)

**Expected Output:**
```typescript
{
  subtotal: number,    // Sum of (price * quantity) for all items
  discount: number,    // Amount saved from promo code
  tax: number,         // Tax on (subtotal - discount)
  shipping: number,    // Shipping cost (may be $0)
  total: number        // subtotal - discount + tax + shipping
}
```

**Validation Rules:**
- Tax rate is 8% of (subtotal - discount)
- Shipping is $5.99 unless subtotal >= $100 (free shipping)
- Free shipping promo codes override standard shipping
- Percentage discounts are capped by maxDiscount if specified
- All values rounded to 2 decimal places

**Error Conditions:**
- None - calculation always succeeds (empty cart = all zeros)

---

## 2. Edge Cases AI Might Miss

| # | Edge Case | Why AI Might Miss It | How to Test |
|---|-----------|---------------------|-------------|
| 1 | Applying promo code before cart meets minimum, then adding items | AI tests static state; doesn't consider order of operations | Apply code with empty cart, add items, verify discount applies |
| 2 | Flash sale pricing that changes while item is in cart | AI doesn't know about real-time price changes | Mock price change, recalculate totals, verify new price used |
| 3 | Regional tax rate variations (different by state/country) | Tax rate is a business rule not in code specs | Test with configurable tax rates, verify calculations |
| 4 | "Buy 2 get 1 free" style promotions | These require complex quantity-based logic | Test adding 3 items, verify third is free |
| 5 | Currency conversion for international customers | Requires exchange rate handling not in specs | Test with multiple currencies, verify conversion |
| 6 | Cart persistence across sessions (abandoned cart recovery) | Persistence is infrastructure, not pure logic | Test serialize/deserialize cart, verify state maintained |
| 7 | Gift cards as payment method (reduces total) | Different from discounts - doesn't reduce taxable amount | Test gift card + discount combo, verify tax calculation |
| 8 | Backorder items (out of stock but can be ordered) | Current code treats zero stock as unavailable | Add `allowBackorder` flag, test ordering when stock = 0 |

---

## 3. Coverage Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| Line Coverage | 95% | Business logic must be thoroughly tested; allow 5% for defensive/unreachable code |
| Branch Coverage | 90% | Most decision paths should be tested; some error branches may be hard to trigger |
| Function Coverage | 100% | Every exported function must have at least one test |

**Areas Requiring 100% Coverage:**
- Price calculation logic (financial accuracy is critical)
- Inventory validation (prevents overselling)
- Promo code validation (prevents revenue loss)
- Input validation (security boundary)

**Areas Where Lower Coverage is Acceptable:**
- Logging statements
- Debug/development utilities
- Error message formatting (tested implicitly)
- Type guard functions (TypeScript handles at compile time)

---

## 4. Red-Green-Refactor Sequence

### Phase 1: Core Functionality (Red-Green)

| Step | Test to Write | Implementation Needed |
|------|---------------|----------------------|
| 1 | Add valid product to empty cart | Basic addItem with product lookup |
| 2 | Add same product twice (quantity combines) | Update existing item logic |
| 3 | Remove item from cart | Basic removeItem with array splice |
| 4 | Calculate subtotal | Basic reduce over cart items |
| 5 | Calculate tax | Apply tax rate to subtotal |
| 6 | Calculate shipping | Flat rate and free shipping threshold |

### Phase 2: Edge Cases (Red-Green)

| Step | Test to Write | Implementation Needed |
|------|---------------|----------------------|
| 1 | Reject invalid product ID | Product existence check |
| 2 | Reject negative/zero quantity | Quantity validation |
| 3 | Reject quantity exceeding inventory | Inventory check |
| 4 | Update quantity to zero removes item | Conditional removal logic |
| 5 | Apply valid promo code | Promo code storage and lookup |
| 6 | Reject expired promo code | Date comparison |
| 7 | Enforce minimum purchase | Subtotal comparison |
| 8 | Cap percentage discount | Math.min with maxDiscount |

### Phase 3: Refactoring

| Refactoring | Before | After | Tests Must Still Pass |
|-------------|--------|-------|----------------------|
| Extract validation | Inline checks in addItem | `validateQuantity()` helper | addItem tests |
| Extract calculation | Inline math in calculateTotals | `roundCurrency()` helper | Total tests |
| Extract promo logic | Switch statement | Strategy pattern | Promo tests |

---

## 5. Validation Checklist for AI-Generated Tests

### Test Quality Checks

- [x] Each test has a descriptive name explaining what it tests
- [x] Tests use `describe` blocks to group related functionality
- [x] Each test focuses on ONE behavior (single assertion focus)
- [x] Tests are independent (no shared mutable state between tests)
- [x] `beforeEach` clears cart state before each test

### Business Logic Verification

- [x] Tests verify exact numeric values, not just "truthy"
- [x] Currency tests use `toBeCloseTo(value, 2)` for decimal precision
- [x] Promo code tests cover all three types (percentage, fixed, freeShipping)
- [x] Inventory tests verify stock is not reduced (cart is not fulfillment)

### Security Considerations

- [x] Input validation prevents negative quantities (no "stealing" products)
- [x] Promo codes are case-insensitive (user experience)
- [x] Error messages don't leak implementation details
- [x] Invalid product IDs return same error as nonexistent (no enumeration)

---

## 6. Sample AI-Generated Test

**Prompt Used:**
```
Generate a Vitest test for applying a promo code to a shopping cart.
The promo code "SAVE10" gives 10% off with a $50 minimum purchase.
Test these scenarios:
1. Apply to cart meeting minimum - should succeed
2. Apply to cart below minimum - should fail
3. Apply invalid code - should fail
Include proper setup with beforeEach clearing the cart.
```

**Generated Test:**
```typescript
import { describe, it, expect, beforeEach } from "vitest";
import {
  addItem,
  applyPromoCode,
  calculateTotals,
  clearCart,
} from "./shopping-cart.js";

describe("Promo Code: SAVE10 (10% off, $50 minimum)", () => {
  beforeEach(() => {
    clearCart();
  });

  it("should apply 10% discount when cart meets $50 minimum", () => {
    // Arrange: Add items totaling $59.98 (above $50 minimum)
    addItem("PROD-001", 2); // 2 x $29.99 = $59.98

    // Act: Apply the promo code
    const result = applyPromoCode("SAVE10");

    // Assert: Code applied successfully
    expect(result.success).toBe(true);

    // Assert: Discount is 10% of subtotal
    const totals = calculateTotals();
    expect(totals.subtotal).toBeCloseTo(59.98, 2);
    expect(totals.discount).toBeCloseTo(5.998, 2); // 10% of 59.98
  });

  it("should reject when cart is below $50 minimum", () => {
    // Arrange: Add items totaling $29.99 (below $50 minimum)
    addItem("PROD-001", 1); // 1 x $29.99 = $29.99

    // Act: Attempt to apply the promo code
    const result = applyPromoCode("SAVE10");

    // Assert: Code rejected with clear error
    expect(result.success).toBe(false);
    expect(result.error).toContain("Minimum purchase");
    expect(result.error).toContain("$50");
  });

  it("should reject invalid promo code", () => {
    // Arrange: Add items to cart
    addItem("PROD-001", 2);

    // Act: Try invalid code
    const result = applyPromoCode("NOTACODE");

    // Assert: Rejected with generic error (no info leak)
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid promo code");
  });
});
```

**Assessment:**
Claude correctly captured the requirements and generated tests covering:
- Happy path (code applies correctly)
- Minimum purchase validation
- Invalid code handling

**What I would add:**
- Test case-insensitivity (`save10` should work)
- Test applying code to empty cart
- Test that discount doesn't exceed item prices
- Test replacing one promo code with another

---

## Summary

**Key Decisions:**
1. Idempotent operations where possible (removeItem never fails)
2. Validate at boundaries (quantity, inventory, promo codes)
3. Round all currency to 2 decimal places to prevent floating-point issues
4. Case-insensitive promo codes for better UX

**Biggest Risks:**
1. Currency rounding errors accumulating in large carts
2. Race conditions with concurrent inventory checks (not addressed - needs backend)
3. Promo code abuse through timing attacks (apply before expiration check)

**Where Human Judgment is Essential:**
1. Business rules for complex promotions (AI doesn't know your sales strategy)
2. Edge cases involving real-time data (inventory changes, price updates)
3. Integration with external systems (payment, fulfillment)
4. Performance thresholds (what's "slow" for your users?)
5. Security threat modeling (what attacks are realistic for your platform?)
