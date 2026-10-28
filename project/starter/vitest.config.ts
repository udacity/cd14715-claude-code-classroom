import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      // Set required environment variables for tests
      ANTHROPIC_MODEL: 'claude-sonnet-4-5-20250929',
      NODE_ENV: 'test'
    }
  }
});
