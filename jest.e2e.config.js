module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'packages',
  testMatch: ['<rootDir>/**/*.e2e.ts'],
  testTimeout: 60000,
};
