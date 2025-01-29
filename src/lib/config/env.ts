interface Config {
  api: {
    gemini: {
      key: string;
      url: string;
    };
  };
  server: {
    env: string;
    port: number | string;
  };
}

export const config: Config = {
  api: {
    gemini: {
      key: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
      url: process.env.NEXT_PUBLIC_GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro'
    }
  },
  server: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  }
};

export function validateEnv(): boolean {
  const required = [
    'NEXT_PUBLIC_GEMINI_API_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.warn('Some features may not work properly.');
    return false;
  }

  return true;
}

export default config;
