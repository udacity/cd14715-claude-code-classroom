import 'dotenv/config';

export interface AppEnv {
  anthropicApiKey: string;
  githubToken: string;
}

export function validateEnv(): AppEnv {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY?.trim();
  const githubToken = process.env.GITHUB_TOKEN?.trim();
  const missing = [
    !anthropicApiKey && 'ANTHROPIC_API_KEY',
    !githubToken && 'GITHUB_TOKEN',
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return { anthropicApiKey: anthropicApiKey!, githubToken: githubToken! };
}
