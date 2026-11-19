/**
 * Shopping Cart Solution Demo
 * Demonstrates the complete shopping cart module with all gaps fixed.
 */

import {
  addItem,
  applyPromoCode,
  calculateTotals,
  clearCart,
  getCart,
  getCartItemCount,
} from "./shopping-cart.js";

console.log("=== SHOPPING CART SOLUTION ===\n");

clearCart();
addItem("PROD-001", 2);
addItem("PROD-003", 1);

console.log("Cart:");
getCart().forEach((item) => {
  console.log(`  ${item.name} x${item.quantity} @ $${item.price.toFixed(2)}`);
});
console.log(`  Total items: ${getCartItemCount()}`);

// Inventory validation
const inventoryTest = addItem("PROD-006", 5); // Only 2 in stock
console.log(`\nInventory check (5x Limited, only 2 in stock): ${inventoryTest.error}`);

// Promo codes
applyPromoCode("SAVE10");
let totals = calculateTotals();
console.log(`\nWith SAVE10: $${totals.subtotal.toFixed(2)} - $${totals.discount.toFixed(2)} = $${totals.total.toFixed(2)}`);

// Expired/maxed promos
console.log(`Expired promo: ${applyPromoCode("EXPIRED").error}`);
console.log(`Maxed promo: ${applyPromoCode("MAXED").error}`);

// Capped discount
clearCart();
addItem("PROD-004", 1);
applyPromoCode("CAPPED"); // 50% off, max $25
totals = calculateTotals();
console.log(`\nCapped discount (50% of $${totals.subtotal.toFixed(2)} capped at $25): $${totals.discount.toFixed(2)}`);

console.log("\n---\nRun: npm test | npm run test:coverage");
