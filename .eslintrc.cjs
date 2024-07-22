module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'semi': 'error',
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    '@typescript-eslint/no-unused-vars': ['error'],
    'react/jsx-tag-spacing': [2, { beforeSelfClosing: 'never' }],
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': [2, {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],
    'react/jsx-one-expression-per-line': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
}
