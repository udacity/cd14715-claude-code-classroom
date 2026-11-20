import 'dotenv/config';

export interface AppEnv {
  provider: 'anthropic' | 'bedrock';
  model: string;
  githubToken?: string;
}

export function validateEnv(env: NodeJS.ProcessEnv = process.env): AppEnv {
  const model = env.ANTHROPIC_MODEL?.trim();
  if (!model) {
    throw new Error('ANTHROPIC_MODEL is required.');
  }

  const apiKey = env.ANTHROPIC_API_KEY?.trim();
  const awsAccessKey = env.AWS_ACCESS_KEY_ID?.trim();
  const awsSecretKey = env.AWS_SECRET_ACCESS_KEY?.trim();

  let provider: AppEnv['provider'];

  if (apiKey) {
    provider = 'anthropic';
    console.log('Using Anthropic API authentication');
  } else if (awsAccessKey && awsSecretKey) {
    if (!env.AWS_REGION?.trim()) {
      throw new Error('AWS_REGION is required when using AWS Bedrock.');
    }
    provider = 'bedrock';
    console.log('Using AWS Bedrock authentication');
  } else {
    throw new Error(
      'Set ANTHROPIC_API_KEY or both AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.'
    );
  }

  return {
    provider,
    model,
    githubToken: env.GITHUB_TOKEN?.trim() || undefined,
  };
}
