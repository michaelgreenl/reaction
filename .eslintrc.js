module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:react/recommended'],
  plugins: ['react'],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@babel/eslint-parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Only allow debugger in development
    'no-debugger': process.env.PRE_COMMIT ? 'error' : 'warn',
    // Only allow `console.log` in development
    'no-console': process.env.PRE_COMMIT
      ? ['error', { allow: ['warn', 'error'] }]
      : ['warn', { allow: ['warn', 'error'] }],
    'max-len': 0,
    // Allow object properties to be reassigned.
    'no-param-reassign': ['error', { props: false }],
    // Disable global-require to allow for dynamic image imports
    'global-require': 'off',
    // Disable underscore dangle restriction
    'no-underscore-dangle': 'off',
    // Disable prefer-destructuring for arrays only
    'prefer-destructuring': ['error', { object: true, array: false }],
    // Allow for-of statements. Only way to do this is to change the default Airbnb rules,
    // so this just disallows for-in statements.
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
    ],

    // No way to override these in Prettier, so change Airbnb rules
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-confusing-arrow': 'off',
    'newline-per-chained-call': 'off',
    'object-curly-newline': 'off',
    'operator-linebreak': [
      'error',
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before',
        },
      },
    ],
    'wrap-iife': 'off',
  },
};
