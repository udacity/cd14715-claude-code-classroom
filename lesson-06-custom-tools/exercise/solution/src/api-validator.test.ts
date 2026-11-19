/**
 * Unit Tests for API Validator Tool
 *
 * These tests verify the validation logic WITHOUT running the full agent.
 * Run with: npx tsx src/api-validator.test.ts
 */

import { validateApiResponse, ValidationResult } from "./api-validator.js";

// -----------------------------------------------------------------------------
// Simple Test Framework
// -----------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function test(name: string, fn: () => Promise<void> | void) {
  return Promise.resolve(fn())
    .then(() => {
      console.log(`  ✓ ${name}`);
      passed++;
    })
    .catch((error) => {
      console.log(`  ✗ ${name}`);
      console.log(`    Error: ${error instanceof Error ? error.message : error}`);
      failed++;
    });
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

function assertIncludes(array: string[] | null, item: string, message?: string) {
  if (!array || !array.some((i) => i.includes(item))) {
    throw new Error(message || `Expected array to include "${item}", got ${JSON.stringify(array)}`);
  }
}

// -----------------------------------------------------------------------------
// Mock fetch for controlled testing
// -----------------------------------------------------------------------------

const originalFetch = globalThis.fetch;

function mockFetch(response: {
  status?: number;
  ok?: boolean;
  json?: () => Promise<unknown>;
}) {
  globalThis.fetch = async () => {
    return {
      status: response.status ?? 200,
      ok: response.ok ?? (response.status ?? 200) >= 200 && (response.status ?? 200) < 300,
      json: response.json ?? (async () => ({})),
    } as Response;
  };
}

function restoreFetch() {
  globalThis.fetch = originalFetch;
}

// -----------------------------------------------------------------------------
// Unit Tests
// -----------------------------------------------------------------------------

async function runTests() {
  console.log("\n" + "=".repeat(60));
  console.log("UNIT TESTS: API Validator Tool");
  console.log("=".repeat(60) + "\n");

  await test("validates successful response with all expected fields", async () => {
    mockFetch({
      status: 200,
      json: async () => ({ id: 1, name: "Test", email: "test@example.com" }),
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/1"),
      "GET",
      ["id", "name", "email"],
      1000
    );

    assertTrue(result.success, "Should be successful");
    assertEqual(result.statusCode, 200);
    assertTrue(result.schemaValid, "Schema should be valid");
  });

  await test("detects missing required fields as breaking changes", async () => {
    mockFetch({
      status: 200,
      json: async () => ({ id: 1 }), // Missing 'name' and 'email'
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/1"),
      "GET",
      ["id", "name", "email"],
      1000
    );

    assertFalse(result.success, "Should not be successful");
    assertTrue(result.breakingChanges !== null, "Should have breaking changes");
    assertIncludes(result.breakingChanges, "name", "Should report missing 'name'");
  });

  await test("handles HTTP errors", async () => {
    mockFetch({
      status: 404,
      ok: false,
      json: async () => ({ error: "Not found" }),
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/999"),
      "GET",
      ["id"],
      1000
    );

    assertFalse(result.success, "Should not be successful");
    assertEqual(result.statusCode, 404);
  });

  await test("detects extra fields as warnings", async () => {
    mockFetch({
      status: 200,
      json: async () => ({ id: 1, name: "Test", secretField: "leaked" }),
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/1"),
      "GET",
      ["id", "name"],
      1000
    );

    assertTrue(result.success, "Should still be successful");
    assertTrue(result.warnings.length > 0, "Should have warnings");
  });

  restoreFetch();

  // -----------------------------------------------------------------------------
  // Test Summary
  // -----------------------------------------------------------------------------

  console.log("\n" + "=".repeat(60));
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log("=".repeat(60) + "\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(console.error);
