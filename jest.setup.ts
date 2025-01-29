import '@testing-library/jest-dom';

// Mock performance API if not available
if (!global.performance) {
  (global as any).performance = {
    now: () => Date.now(),
  };
}

// Mock environment variables
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.GOOGLE_REDIRECT_URI = 'http://localhost:3000/auth/callback';
process.env.JWT_SECRET = 'test-jwt-secret';

// Reset mocks and timers before each test
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  
  // Any Date.now() calls after this will start from this timestamp
  const mockDate = new Date(2025, 0, 28, 12, 0, 0);
  jest.setSystemTime(mockDate);
});

// Clean up after each test
afterEach(() => {
  jest.useRealTimers();
});

// Mock Request/Response for Node environment
if (!global.Request) {
  (global as any).Request = class Request {
    constructor(url: string, options: any = {}) {
      return { url, ...options };
    }
  };
}

if (!global.Response) {
  (global as any).Response = class Response {
    constructor(body: any, options: any = {}) {
      return { body, ...options };
    }
  };
}

// Mock localStorage
if (!global.localStorage) {
  (global as any).localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
}

// Increase test timeout for performance tests
jest.setTimeout(10000);

// Configure console to not show error warnings during tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning:')
  ) {
    return;
  }
  originalError.call(console, ...args);
};
