/**
 * Shopping Cart Exercise Demo
 * Demonstrates the shopping cart module with intentional gaps.
 */

import {
  addItem,
  applyPromoCode,
  calculateTotals,
  clearCart,
  getCart,
} from "./shopping-cart.js";

console.log("=== SHOPPING CART TDD EXERCISE ===\n");

console.log("Products: PROD-001 ($29.99), PROD-002 ($49.99), PROD-003 ($99.99)");
console.log("Promos: SAVE10 (10% off), FLAT20 ($20 off), FREESHIP\n");

clearCart();
addItem("PROD-001", 2);
addItem("PROD-003", 1);

console.log("Cart:");
getCart().forEach((item) => {
  console.log(`  ${item.name} x${item.quantity} @ $${item.price}`);
});

applyPromoCode("SAVE10");
const totals = calculateTotals();
console.log(`\nTotals: $${totals.subtotal.toFixed(2)} - $${totals.discount.toFixed(2)} + $${totals.tax.toFixed(2)} tax = $${totals.total.toFixed(2)}`);

console.log("\n--- KNOWN GAPS ---");
console.log("1. No inventory validation");
console.log("2. No promo expiration/usage checks");
console.log("3. No currency rounding");
console.log("4. maxDiscount ignored");

console.log("\nYour task: Complete tdd-strategy.md and generate tests with Claude");
console.log("Run: npm test | npm run test:coverage");
