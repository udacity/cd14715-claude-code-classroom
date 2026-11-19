/**
 * TDD with AI Demo Runner
 * Demonstrates AI-accelerated TDD workflow with an authentication module.
 */

import { register, login, validateToken, clearUsers } from "./auth.js";

console.log("=== AI-ACCELERATED TDD DEMO ===\n");

clearUsers();

// 1. Registration
const registerResult = register("user@example.com", "SecurePass123");
console.log(`Register: ${registerResult.success ? "OK" : "FAIL"}`);

// 2. Password validation (AI catches edge cases)
const weakPasswords = ["short", "alllowercase123", "NoNumbersHere"];
console.log("\nWeak password rejections:");
weakPasswords.forEach((pass) => {
  const result = register(`test-${pass}@example.com`, pass);
  console.log(`  "${pass}" -> ${result.error}`);
});

// 3. Login & token
const loginResult = login("user@example.com", "SecurePass123");
console.log(`\nLogin: ${loginResult.success ? "OK" : "FAIL"}`);
console.log(`Token valid: ${validateToken(loginResult.token!).success}`);

// 4. Rate limiting
clearUsers();
register("ratelimit@example.com", "SecurePass123");
for (let i = 0; i < 5; i++) login("ratelimit@example.com", "WrongPassword");
const lockedResult = login("ratelimit@example.com", "SecurePass123");
console.log(`\nAfter 5 failed attempts: ${lockedResult.success ? "OK" : "LOCKED"}`);

console.log("\n---\nRun: npm test | npm run test:coverage");
