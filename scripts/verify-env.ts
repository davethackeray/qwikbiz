#!/usr/bin/env node

import { config } from '../src/lib/config/env';

console.log('🔍 Verifying environment configuration...\n');

const verifyGoogleAuth = () => {
  console.log('📱 Checking Google OAuth configuration...');
  const { clientId, clientSecret, redirectUri } = config.auth.google;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing required Google OAuth configuration');
  }

  if (!redirectUri.startsWith('http')) {
    throw new Error('Invalid redirect URI format - must be a valid URL');
  }

  console.log('✅ Google OAuth configuration verified');
};

const verifyJWT = () => {
  console.log('🔑 Checking JWT configuration...');
  const { secret } = config.auth.jwt;

  if (!secret) {
    throw new Error('Missing JWT secret');
  }

  if (secret.length < 32) {
    throw new Error('JWT secret should be at least 32 characters long');
  }

  console.log('✅ JWT configuration verified');
};

const verifyAppConfig = () => {
  console.log('⚙️ Checking app configuration...');
  const { url, env } = config.app;

  if (!url.startsWith('http')) {
    throw new Error('Invalid APP_URL format - must be a valid URL');
  }

  if (!['development', 'production', 'test'].includes(env)) {
    throw new Error('Invalid NODE_ENV - must be development, production, or test');
  }

  console.log('✅ App configuration verified');
};

try {
  verifyGoogleAuth();
  verifyJWT();
  verifyAppConfig();

  console.log('\n🎉 All environment variables verified successfully!');
  process.exit(0);
} catch (error: any) {
  console.error('\n❌ Environment verification failed:');
  console.error(error.message);
  process.exit(1);
}
