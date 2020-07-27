module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'packages',
  testMatch: ['<rootDir>/**/*.(test|e2e).ts'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  },
};
