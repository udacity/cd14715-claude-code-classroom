/**
 * Authentication Module
 *
 * This module demonstrates TDD with AI assistance.
 * Tests were generated first, then this implementation was built
 * to satisfy them following red-green-refactor.
 */

import { z } from "zod";
import { createHash, randomBytes } from "crypto";

// =============================================================================
// Types & Schemas
// =============================================================================

export const EmailSchema = z.string().email("Invalid email format");

export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  createdAt: z.date(),
  failedLoginAttempts: z.number().default(0),
  lockedUntil: z.date().nullable().default(null),
});

export type User = z.infer<typeof UserSchema>;

export interface AuthResult {
  success: boolean;
  userId?: string;
  token?: string;
  error?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

// =============================================================================
// In-Memory Storage (for demo purposes)
// =============================================================================

const users = new Map<string, User>();
const tokenSecret = randomBytes(32).toString("hex");

// =============================================================================
// Password Hashing (simplified for demo - use bcrypt in production)
// =============================================================================

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256")
    .update(password + salt)
    .digest("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  const computedHash = createHash("sha256")
    .update(password + salt)
    .digest("hex");
  return hash === computedHash;
}

// =============================================================================
// JWT-like Token (simplified for demo)
// =============================================================================

export function createToken(userId: string, email: string): string {
  const payload: TokenPayload = {
    userId,
    email,
    iat: Date.now(),
    exp: Date.now() + 60 * 60 * 1000, // 1 hour
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = createHash("sha256")
    .update(payloadStr + tokenSecret)
    .digest("hex");
  return `${payloadStr}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const [payloadStr, signature] = token.split(".");
    const expectedSig = createHash("sha256")
      .update(payloadStr + tokenSecret)
      .digest("hex");

    if (signature !== expectedSig) {
      return null;
    }

    const payload: TokenPayload = JSON.parse(
      Buffer.from(payloadStr, "base64").toString()
    );

    if (payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// =============================================================================
// Rate Limiting
// =============================================================================

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function isAccountLocked(user: User): boolean {
  if (!user.lockedUntil) return false;
  if (user.lockedUntil.getTime() < Date.now()) {
    // Lock expired, reset
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    return false;
  }
  return true;
}

function recordFailedAttempt(user: User): void {
  user.failedLoginAttempts += 1;
  if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    user.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
  }
}

function resetFailedAttempts(user: User): void {
  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
}

// =============================================================================
// Core Authentication Functions
// =============================================================================

/**
 * Register a new user
 */
export function register(email: string, password: string): AuthResult {
  // Validate email
  const emailResult = EmailSchema.safeParse(email);
  if (!emailResult.success) {
    return { success: false, error: emailResult.error.issues[0].message };
  }

  // Validate password
  const passwordResult = PasswordSchema.safeParse(password);
  if (!passwordResult.success) {
    return { success: false, error: passwordResult.error.issues[0].message };
  }

  // Check if user already exists
  if (users.has(email)) {
    return { success: false, error: "User already exists" };
  }

  // Create user
  const userId = randomBytes(16).toString("hex");
  const user: User = {
    id: userId,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date(),
    failedLoginAttempts: 0,
    lockedUntil: null,
  };

  users.set(email, user);

  return { success: true, userId };
}

/**
 * Login an existing user
 */
export function login(email: string, password: string): AuthResult {
  const user = users.get(email);

  if (!user) {
    return { success: false, error: "Invalid credentials" };
  }

  // Check if account is locked
  if (isAccountLocked(user)) {
    const remainingMs = user.lockedUntil!.getTime() - Date.now();
    const remainingMins = Math.ceil(remainingMs / 60000);
    return {
      success: false,
      error: `Account locked. Try again in ${remainingMins} minutes`,
    };
  }

  // Verify password
  if (!verifyPassword(password, user.passwordHash)) {
    recordFailedAttempt(user);

    if (isAccountLocked(user)) {
      return {
        success: false,
        error: "Account locked due to too many failed attempts",
      };
    }

    return { success: false, error: "Invalid credentials" };
  }

  // Success - reset failed attempts and generate token
  resetFailedAttempts(user);
  const token = createToken(user.id, user.email);

  return { success: true, userId: user.id, token };
}

/**
 * Validate a token and return user data
 */
export function validateToken(token: string): AuthResult {
  const payload = verifyToken(token);

  if (!payload) {
    return { success: false, error: "Invalid or expired token" };
  }

  return { success: true, userId: payload.userId };
}

/**
 * Get user by ID (for testing)
 */
export function getUserById(userId: string): User | undefined {
  for (const user of users.values()) {
    if (user.id === userId) return user;
  }
  return undefined;
}

/**
 * Clear all users (for testing)
 */
export function clearUsers(): void {
  users.clear();
}

/**
 * Get remaining lockout time in milliseconds (for testing)
 */
export function getRemainingLockoutTime(email: string): number | null {
  const user = users.get(email);
  if (!user || !user.lockedUntil) return null;
  const remaining = user.lockedUntil.getTime() - Date.now();
  return remaining > 0 ? remaining : null;
}
