/**
 * Environment configuration with validation
 */

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  auth: {
    google: {
      clientId: requireEnvVar('GOOGLE_CLIENT_ID'),
      clientSecret: requireEnvVar('GOOGLE_CLIENT_SECRET'),
      redirectUri: requireEnvVar('GOOGLE_REDIRECT_URI'),
    },
    jwt: {
      secret: requireEnvVar('JWT_SECRET'),
      expiryTime: '7d', // JWT expiry time
    }
  },
  app: {
    url: process.env.APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development'
  }
} as const;

export type Config = typeof config;
