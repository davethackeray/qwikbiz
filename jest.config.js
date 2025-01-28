/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Changed to jsdom for React component testing
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: [
    // Unit tests adjacent to source files
    '**/__tests__/**/*.test.ts?(x)',
    '**/*.test.ts?(x)',
    // Integration tests in dedicated directory
    '**/integration/**/*.integration.test.ts?(x)',
    // E2E tests in dedicated directory
    '**/e2e/**/*.e2e.test.ts?(x)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.next/',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/types/**/*',
    '!src/**/*.styles.{js,ts}',
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.jest.json',
      isolatedModules: true,
    },
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'coverage',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true,
    }],
  ],
};
