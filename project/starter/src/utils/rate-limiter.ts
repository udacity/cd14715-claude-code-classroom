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
    // TODO: Implement acquire logic
    // Steps:
    // 1. Wait for a concurrent slot if maxConcurrent is reached
    //    - Use waitForSlot() helper
    // 2. Wait for rate limit availability
    //    - Use waitForRateLimit(estimatedTokens) helper
    // 3. Increment activeRequests
    // 4. Add a record to requestHistory with current timestamp and estimatedTokens

    throw new Error('Not implemented');
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
      lastRequest.tokens = actualTokens;
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
    // TODO: Implement canProceed check
    // Steps:
    // 1. Call pruneOldRecords() to remove stale entries
    // 2. Check if activeRequests < maxConcurrent
    // 3. Calculate requestsInWindow (length of requestHistory)
    // 4. Calculate tokensInWindow (sum of tokens in requestHistory)
    // 5. Return true if ALL conditions are met:
    //    - activeRequests < maxConcurrent
    //    - requestsInWindow < maxRequestsPerMinute
    //    - tokensInWindow + estimatedTokens <= maxTokensPerMinute

    throw new Error('Not implemented');
  }

  /**
   * Wait for a concurrent request slot to become available
   *
   * This creates a Promise that resolves when release() is called
   * and there's a queued waiter.
   */
  private async waitForSlot(): Promise<void> {
    // TODO: Implement waitForSlot
    // Hint: Create a new Promise and add its resolve function to waitQueue
    // The resolve function will be called by release()

    throw new Error('Not implemented');
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
    // TODO: Implement waitForRateLimit
    // Steps:
    // 1. Loop while canProceed(estimatedTokens) returns false
    // 2. Call pruneOldRecords() to remove expired entries
    // 3. If requestHistory is empty, break (no need to wait)
    // 4. Calculate wait time:
    //    - Get oldest timestamp: requestHistory[0].timestamp
    //    - Calculate when it expires: oldestTimestamp + 60000 (60 seconds)
    //    - Wait time = expiration time - now + small buffer (100ms)
    //    - Use Math.max(100, waitTime) to ensure minimum wait
    //    - Use Math.min(waitTime, 5000) to cap at 5 seconds
    // 5. Sleep for the calculated wait time
    // 6. Loop continues and checks again

    throw new Error('Not implemented');
  }

  /**
   * Remove request records older than 60 seconds (sliding window)
   *
   * This is called before checking rate limits to ensure we only
   * count requests in the current 60-second window.
   */
  private pruneOldRecords(): void {
    // TODO: Implement pruneOldRecords
    // Steps:
    // 1. Calculate the cutoff timestamp: Date.now() - 60000
    // 2. Filter requestHistory to keep only records where timestamp > cutoff
    // Hint: Use Array.filter()

    throw new Error('Not implemented');
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