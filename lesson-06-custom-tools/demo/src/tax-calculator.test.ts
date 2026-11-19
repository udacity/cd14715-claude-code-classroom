/**
 * Unit Tests for Tax Calculator Tools
 *
 * These tests verify the business logic WITHOUT running the full agent.
 * Run with: npx tsx src/tax-calculator.test.ts
 */

import {
  calculateTax,
  calculateTip,
  isError,
  TaxResult,
  TipResult,
} from "./tax-calculator.js";

// -----------------------------------------------------------------------------
// Simple Test Framework
// -----------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error instanceof Error ? error.message : error}`);
    failed++;
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || "Expected true, got false");
  }
}

function assertFalse(condition: boolean, message?: string) {
  if (condition) {
    throw new Error(message || "Expected false, got true");
  }
}

// -----------------------------------------------------------------------------
// Unit Tests
// -----------------------------------------------------------------------------

console.log("\n" + "=".repeat(60));
console.log("UNIT TESTS: Tax Calculator Tools");
console.log("=".repeat(60) + "\n");

test("calculateTax: computes tax correctly", () => {
  const result = calculateTax(100, 0.08);
  assertFalse(isError(result), "Should not return error");
  const taxResult = result as TaxResult;
  assertEqual(taxResult.subtotal, 100);
  assertEqual(taxResult.tax, 8);
  assertEqual(taxResult.total, 108);
});

test("calculateTax: returns error for invalid input", () => {
  const result = calculateTax(-100, 0.08);
  assertTrue(isError(result), "Should return error for negative amount");
});

test("calculateTip: computes tip correctly", () => {
  const result = calculateTip(75, 20);
  assertFalse(isError(result), "Should not return error");
  const tipResult = result as TipResult;
  assertEqual(tipResult.subtotal, 75);
  assertEqual(tipResult.tipAmount, 15);
  assertEqual(tipResult.total, 90);
});

test("calculateTip: returns error for invalid input", () => {
  const result = calculateTip(50, 150);
  assertTrue(isError(result), "Should return error for tip over 100%");
});

// -----------------------------------------------------------------------------
// Test Summary
// -----------------------------------------------------------------------------

console.log("\n" + "=".repeat(60));
console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
console.log("=".repeat(60) + "\n");

if (failed > 0) {
  process.exit(1);
}
