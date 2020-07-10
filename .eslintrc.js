// eslint-disable-next-line no-undef
module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
  },
  overrides: [
    {
      files: ['./packages/**/*.ts'],
      env: {
        node: true,
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    },
  ],
};
