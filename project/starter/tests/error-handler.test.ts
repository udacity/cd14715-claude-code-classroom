import { describe, expect, it, vi } from 'vitest';

import {
  ErrorCodes,
  ReviewError,
  withRetry,
  withTimeout,
} from '../src/utils/error-handler';

describe('Error handler utilities', () => {
  describe('withRetry', () => {
    it('returns the result when the function succeeds', async () => {
      const fn = vi.fn().mockResolvedValue('success');

      await expect(withRetry(fn, 3, 1)).resolves.toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('retries after failures and eventually succeeds', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('first failure'))
        .mockRejectedValueOnce(new Error('second failure'))
        .mockResolvedValue('success');

      await expect(withRetry(fn, 3, 1)).resolves.toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('throws RETRY_EXHAUSTED when all attempts fail', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('failure'));

      await expect(withRetry(fn, 3, 1)).rejects.toMatchObject({
        code: ErrorCodes.RETRY_EXHAUSTED,
      });

      expect(fn).toHaveBeenCalledTimes(3);
    });
  });

  describe('withTimeout', () => {
    it('returns the result when the function completes in time', async () => {
      const fn = vi.fn().mockResolvedValue('success');

      await expect(withTimeout(fn, 1000)).resolves.toBe('success');
    });

    it('throws AGENT_TIMEOUT when the timeout is reached', async () => {
      const fn = () =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve('too late'), 100);
        });

      await expect(withTimeout(fn, 10)).rejects.toMatchObject({
        code: ErrorCodes.AGENT_TIMEOUT,
        metadata: { timeoutMs: 10 },
      });
    });

    it('uses the supplied timeout error message', async () => {
      const fn = () =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve('too late'), 100);
        });

      await expect(
        withTimeout(fn, 10, 'Agent took too long')
      ).rejects.toBeInstanceOf(ReviewError);

      await expect(
        withTimeout(fn, 10, 'Agent took too long')
      ).rejects.toMatchObject({
        message: 'Agent took too long',
        code: ErrorCodes.AGENT_TIMEOUT,
      });
    });
  });
});
