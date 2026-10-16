import { describe, expect, it } from 'vitest';

import { RateLimiter } from '../src/utils/rate-limiter';

describe('RateLimiter', () => {
  it('allows requests within configured limits', async () => {
    const limiter = new RateLimiter({
      maxRequestsPerMinute: 5,
      maxTokensPerMinute: 1000,
      maxConcurrent: 2,
    });

    await limiter.acquire(100);

    const status = limiter.getStatus();

    expect(status.activeRequests).toBe(1);
    expect(status.requestsInWindow).toBe(1);
    expect(status.tokensInWindow).toBe(100);

    limiter.release();
  });

  it('reports unavailable capacity when request or token limits are reached', async () => {
    const limiter = new RateLimiter({
      maxRequestsPerMinute: 2,
      maxTokensPerMinute: 200,
      maxConcurrent: 5,
    });

    await limiter.acquire(100);
    await limiter.acquire(100);

    expect(limiter.canProceed(1)).toBe(false);

    const status = limiter.getStatus();
    expect(status.requestsInWindow).toBe(2);
    expect(status.tokensInWindow).toBe(200);

    limiter.release();
    limiter.release();
  });

  it('tracks active concurrent requests', async () => {
    const limiter = new RateLimiter({
      maxRequestsPerMinute: 10,
      maxTokensPerMinute: 1000,
      maxConcurrent: 2,
    });

    await limiter.acquire(50);
    await limiter.acquire(50);

    expect(limiter.canProceed(50)).toBe(false);
    expect(limiter.getStatus().activeRequests).toBe(2);

    limiter.release();
    expect(limiter.getStatus().activeRequests).toBe(1);

    limiter.release();
    expect(limiter.getStatus().activeRequests).toBe(0);
  });
});
