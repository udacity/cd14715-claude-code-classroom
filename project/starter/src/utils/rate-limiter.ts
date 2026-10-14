/**
 * Rate Limiter for API requests and token usage
 * Prevents exceeding Anthropic API rate limits
 *
 * This implements a token bucket algorithm with sliding window.
 *
 * Concepts:
 * - Tracks requests and tokens used in the last 60 seconds (sliding window)
 * - Limits concurrent requests to prevent overwhelming the API
 * - Uses token estimation to prevent exceeding token-per-minute limits
 */

export interface RateLimiterConfig {
  /** Maximum requests per minute */
  maxRequestsPerMinute: number;
  /** Maximum tokens per minute */
  maxTokensPerMinute: number;
  /** Maximum concurrent requests */
  maxConcurrent: number;
}

export const DEFAULT_RATE_LIMITS: RateLimiterConfig = {
  maxRequestsPerMinute: 50,      // Conservative default
  maxTokensPerMinute: 100000,    // ~100k tokens/min
  maxConcurrent: 5               // Max parallel requests
};

interface RequestRecord {
  timestamp: number;
  tokens: number;
}

/**
 * Token bucket rate limiter with sliding window
 */
export class RateLimiter {
  private config: RateLimiterConfig;
  private requestHistory: RequestRecord[] = [];
  private activeRequests: number = 0;
  private waitQueue: Array<() => void> = [];

  constructor(config: Partial<RateLimiterConfig> = {}) {
    this.config = { ...DEFAULT_RATE_LIMITS, ...config };
  }

  /**
   * Wait until a request can be made within rate limits
   *
   * This is the main entry point for rate limiting.
   * It ensures:
   * 1. Concurrent request limit is not exceeded
   * 2. Request and token rate limits are respected
   * 3. The request is recorded for future rate limit calculations
   *
   * @param estimatedTokens - Estimated tokens for this request
   */
  async acquire(estimatedTokens: number = 1000): Promise<void> {
    // Wait for a concurrent slot if needed
    if (this.activeRequests >= this.config.maxConcurrent) {
      await this.waitForSlot();
    }

    // Wait for rate limit availability
    await this.waitForRateLimit(estimatedTokens);

    // Increment active requests
    this.activeRequests++;

    // Add record to request history
    this.requestHistory.push({
      timestamp: Date.now(),
      tokens: estimatedTokens
    });
  }

  /**
   * Release a request slot after completion
   * @param actualTokens - Actual tokens used (updates estimate)
   */
  release(actualTokens?: number): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);

    // Update last request with actual token count if provided
    if (actualTokens !== undefined && this.requestHistory.length > 0) {
      const lastRequest = this.requestHistory[this.requestHistory.length - 1];
      if (lastRequest) {
        lastRequest.tokens = actualTokens;
      }
    }

    // Wake up next waiting request
    const next = this.waitQueue.shift();
    if (next) next();
  }

  /**
   * Get current rate limit status
   */
  getStatus(): {
    activeRequests: number;
    requestsInWindow: number;
    tokensInWindow: number;
    availableRequests: number;
    availableTokens: number;
  } {
    this.pruneOldRecords();

    const requestsInWindow = this.requestHistory.length;
    const tokensInWindow = this.requestHistory.reduce((sum, r) => sum + r.tokens, 0);

    return {
      activeRequests: this.activeRequests,
      requestsInWindow,
      tokensInWindow,
      availableRequests: Math.max(0, this.config.maxRequestsPerMinute - requestsInWindow),
      availableTokens: Math.max(0, this.config.maxTokensPerMinute - tokensInWindow)
    };
  }

  /**
   * Check if request can proceed immediately
   *
   * @param estimatedTokens - Estimated tokens for the request
   * @returns true if the request can proceed without waiting
   */
  canProceed(estimatedTokens: number = 1000): boolean {
    // Prune old records first
    this.pruneOldRecords();

    // Calculate requests and tokens in current window
    const requestsInWindow = this.requestHistory.length;
    const tokensInWindow = this.requestHistory.reduce((sum, r) => sum + r.tokens, 0);

    // Check all conditions
    return (
      this.activeRequests < this.config.maxConcurrent &&
      requestsInWindow < this.config.maxRequestsPerMinute &&
      tokensInWindow + estimatedTokens <= this.config.maxTokensPerMinute
    );
  }

  /**
   * Wait for a concurrent request slot to become available
   *
   * This creates a Promise that resolves when release() is called
   * and there's a queued waiter.
   */
  private async waitForSlot(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.waitQueue.push(resolve);
    });
  }

  /**
   * Wait until rate limits allow the request to proceed
   *
   * This implements the sliding window algorithm.
   * If we can't proceed immediately, we calculate how long to wait
   * until the oldest request expires (falls out of the 60-second window).
   *
   * @param estimatedTokens - Estimated tokens for the request
   */
  private async waitForRateLimit(estimatedTokens: number): Promise<void> {
    while (!this.canProceed(estimatedTokens)) {
      this.pruneOldRecords();

      // If no history, no need to wait
      if (this.requestHistory.length === 0) {
        break;
      }

      // Calculate wait time based on oldest request
      const oldestRecord = this.requestHistory[0];
      if (!oldestRecord) {
        break;
      }

      const oldestTimestamp = oldestRecord.timestamp;
      const expirationTime = oldestTimestamp + 60000; // 60 seconds
      const now = Date.now();
      const rawWaitTime = expirationTime - now + 100; // Add 100ms buffer

      // Ensure wait time is between 100ms and 5 seconds
      const waitTime = Math.min(Math.max(100, rawWaitTime), 5000);

      // Sleep for the calculated wait time
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  /**
   * Remove request records older than 60 seconds (sliding window)
   *
   * This is called before checking rate limits to ensure we only
   * count requests in the current 60-second window.
   */
  private pruneOldRecords(): void {
    const cutoff = Date.now() - 60000; // 60 seconds ago
    this.requestHistory = this.requestHistory.filter(record => record.timestamp > cutoff);
  }
}

/**
 * Wrap an async function with rate limiting
 *
 * This is a convenience function for applying rate limiting to any async operation.
 */
export function withRateLimit<T>(
  rateLimiter: RateLimiter,
  fn: () => Promise<T>,
  estimatedTokens: number = 1000
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      await rateLimiter.acquire(estimatedTokens);
      const result = await fn();
      rateLimiter.release();
      resolve(result);
    } catch (error) {
      rateLimiter.release();
      reject(error);
    }
  });
}

// Global rate limiter instance
export const globalRateLimiter = new RateLimiter();