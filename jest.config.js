module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'packages',
  testMatch: ['<rootDir>/**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  }
};
