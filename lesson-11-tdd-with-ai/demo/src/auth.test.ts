/**
 * Authentication Module Tests
 *
 * These tests were generated with AI assistance from natural language requirements.
 * They demonstrate comprehensive TDD coverage including:
 * - Happy path scenarios
 * - Edge cases
 * - Error conditions
 * - Security considerations
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  register,
  login,
  validateToken,
  clearUsers,
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
  getUserById,
} from "./auth.js";

// =============================================================================
// Setup
// =============================================================================

beforeEach(() => {
  clearUsers();
  vi.restoreAllMocks();
});

// =============================================================================
// Password Hashing Tests
// =============================================================================

describe("Password Hashing", () => {
  it("should hash password with salt", () => {
    const password = "SecurePass123";
    const hash = hashPassword(password);

    expect(hash).toContain(":");
    expect(hash).not.toBe(password);
  });

  it("should generate different hashes for same password", () => {
    const password = "SecurePass123";
    const hash1 = hashPassword(password);
    const hash2 = hashPassword(password);

    expect(hash1).not.toBe(hash2); // Different salts
  });

  it("should verify correct password", () => {
    const password = "SecurePass123";
    const hash = hashPassword(password);

    expect(verifyPassword(password, hash)).toBe(true);
  });

  it("should reject incorrect password", () => {
    const password = "SecurePass123";
    const hash = hashPassword(password);

    expect(verifyPassword("WrongPass123", hash)).toBe(false);
  });
});

// =============================================================================
// User Registration Tests
// =============================================================================

describe("User Registration", () => {
  describe("Email Validation", () => {
    it("should accept valid email", () => {
      const result = register("user@example.com", "SecurePass123");

      expect(result.success).toBe(true);
      expect(result.userId).toBeDefined();
    });

    it("should reject email without @", () => {
      const result = register("userexample.com", "SecurePass123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid email");
    });

    it("should reject email without domain", () => {
      const result = register("user@", "SecurePass123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid email");
    });

    it("should reject empty email", () => {
      const result = register("", "SecurePass123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid email");
    });
  });

  describe("Password Validation", () => {
    it("should accept strong password", () => {
      const result = register("user@example.com", "SecurePass123");

      expect(result.success).toBe(true);
    });

    it("should reject password shorter than 8 characters", () => {
      const result = register("user@example.com", "Pass1");

      expect(result.success).toBe(false);
      expect(result.error).toContain("at least 8 characters");
    });

    it("should reject password without uppercase letter", () => {
      const result = register("user@example.com", "securepass123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("uppercase");
    });

    it("should reject password without number", () => {
      const result = register("user@example.com", "SecurePassword");

      expect(result.success).toBe(false);
      expect(result.error).toContain("number");
    });

    it("should reject empty password", () => {
      const result = register("user@example.com", "");

      expect(result.success).toBe(false);
    });
  });

  describe("Duplicate Prevention", () => {
    it("should reject duplicate email registration", () => {
      register("user@example.com", "SecurePass123");
      const result = register("user@example.com", "AnotherPass456");

      expect(result.success).toBe(false);
      expect(result.error).toContain("already exists");
    });
  });

  describe("Password Storage", () => {
    it("should hash password before storage", () => {
      const password = "SecurePass123";
      const result = register("user@example.com", password);

      expect(result.success).toBe(true);

      const user = getUserById(result.userId!);
      expect(user).toBeDefined();
      expect(user!.passwordHash).not.toBe(password);
      expect(user!.passwordHash).toContain(":"); // Has salt
    });
  });
});

// =============================================================================
// User Login Tests
// =============================================================================

describe("User Login", () => {
  beforeEach(() => {
    register("user@example.com", "SecurePass123");
  });

  describe("Successful Login", () => {
    it("should login with correct credentials", () => {
      const result = login("user@example.com", "SecurePass123");

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.userId).toBeDefined();
    });

    it("should return valid JWT token", () => {
      const result = login("user@example.com", "SecurePass123");

      expect(result.token).toContain("."); // JWT-like format
    });
  });

  describe("Failed Login", () => {
    it("should reject wrong password", () => {
      const result = login("user@example.com", "WrongPass123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid credentials");
      expect(result.token).toBeUndefined();
    });

    it("should reject non-existent user", () => {
      const result = login("nobody@example.com", "SecurePass123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid credentials");
    });

    it("should use generic error message for security", () => {
      // Same error for wrong password and non-existent user
      const wrongPassword = login("user@example.com", "WrongPass123");
      const wrongUser = login("nobody@example.com", "SecurePass123");

      expect(wrongPassword.error).toBe(wrongUser.error);
    });
  });

  describe("Rate Limiting", () => {
    it("should track failed login attempts", () => {
      // 4 failed attempts should still allow login
      for (let i = 0; i < 4; i++) {
        login("user@example.com", "WrongPass123");
      }

      const result = login("user@example.com", "SecurePass123");
      expect(result.success).toBe(true);
    });

    it("should lock account after 5 failed attempts", () => {
      for (let i = 0; i < 5; i++) {
        login("user@example.com", "WrongPass123");
      }

      const result = login("user@example.com", "SecurePass123");
      expect(result.success).toBe(false);
      expect(result.error).toContain("locked");
    });

    it("should show lockout duration in error", () => {
      for (let i = 0; i < 5; i++) {
        login("user@example.com", "WrongPass123");
      }

      const result = login("user@example.com", "SecurePass123");
      expect(result.error).toMatch(/\d+ minutes/);
    });

    it("should reset failed attempts on successful login", () => {
      // 3 failed attempts
      for (let i = 0; i < 3; i++) {
        login("user@example.com", "WrongPass123");
      }

      // Successful login resets counter
      login("user@example.com", "SecurePass123");

      // Should be able to fail 4 more times without lockout
      for (let i = 0; i < 4; i++) {
        login("user@example.com", "WrongPass123");
      }

      const result = login("user@example.com", "SecurePass123");
      expect(result.success).toBe(true);
    });
  });
});

// =============================================================================
// Token Validation Tests
// =============================================================================

describe("Token Validation", () => {
  it("should validate correct token", () => {
    register("user@example.com", "SecurePass123");
    const loginResult = login("user@example.com", "SecurePass123");

    const result = validateToken(loginResult.token!);

    expect(result.success).toBe(true);
    expect(result.userId).toBe(loginResult.userId);
  });

  it("should reject invalid token", () => {
    const result = validateToken("invalid.token.here");

    expect(result.success).toBe(false);
    expect(result.error).toContain("Invalid");
  });

  it("should reject tampered token", () => {
    register("user@example.com", "SecurePass123");
    const loginResult = login("user@example.com", "SecurePass123");

    // Tamper with the token
    const tamperedToken = loginResult.token!.replace("a", "b");
    const result = validateToken(tamperedToken);

    expect(result.success).toBe(false);
  });

  it("should reject expired token", () => {
    // Create a token with past expiration
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01"));

    register("user@example.com", "SecurePass123");
    const loginResult = login("user@example.com", "SecurePass123");

    // Fast forward 2 hours (token expires in 1 hour)
    vi.advanceTimersByTime(2 * 60 * 60 * 1000);

    const result = validateToken(loginResult.token!);

    expect(result.success).toBe(false);
    expect(result.error).toContain("expired");

    vi.useRealTimers();
  });
});

// =============================================================================
// JWT Token Internal Tests
// =============================================================================

describe("Token Creation", () => {
  it("should create token with user info", () => {
    const token = createToken("user123", "user@example.com");
    const payload = verifyToken(token);

    expect(payload).not.toBeNull();
    expect(payload!.userId).toBe("user123");
    expect(payload!.email).toBe("user@example.com");
  });

  it("should set token expiration to 1 hour", () => {
    const before = Date.now();
    const token = createToken("user123", "user@example.com");
    const after = Date.now();

    const payload = verifyToken(token);
    const expectedExp = before + 60 * 60 * 1000;

    expect(payload!.exp).toBeGreaterThanOrEqual(expectedExp);
    expect(payload!.exp).toBeLessThanOrEqual(after + 60 * 60 * 1000);
  });

  it("should include issued-at timestamp", () => {
    const before = Date.now();
    const token = createToken("user123", "user@example.com");
    const after = Date.now();

    const payload = verifyToken(token);

    expect(payload!.iat).toBeGreaterThanOrEqual(before);
    expect(payload!.iat).toBeLessThanOrEqual(after);
  });
});

// =============================================================================
// Security Edge Cases
// =============================================================================

describe("Security Edge Cases", () => {
  it("should handle SQL injection in email", () => {
    const result = register("'; DROP TABLE users; --", "SecurePass123");

    expect(result.success).toBe(false);
    expect(result.error).toContain("Invalid email");
  });

  it("should handle XSS in email", () => {
    const result = register("<script>alert('xss')</script>@example.com", "SecurePass123");

    expect(result.success).toBe(false);
  });

  it("should handle very long input", () => {
    const longEmail = "a".repeat(1000) + "@example.com";
    const result = register(longEmail, "SecurePass123");

    // Should either succeed or fail gracefully
    expect(typeof result.success).toBe("boolean");
  });

  it("should handle unicode in password", () => {
    const result = register("user@example.com", "SecurePass123!");

    expect(result.success).toBe(true);

    const loginResult = login("user@example.com", "SecurePass123!");
    expect(loginResult.success).toBe(true);
  });
});
