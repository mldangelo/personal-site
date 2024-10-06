const os = require('os');

module.exports = {
  env: {
    browser: true,
    jest: true,
    node: true,
  },
  // extends: 'airbnb',
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:jsx-a11y/recommended", // Add this line for JSX accessibility rules
    "plugin:@typescript-eslint/recommended", // if using TypeScript
    "plugin:prettier/recommended" // Enables Prettier plugin and displays formatting errors as ESLint errors
  ],
  ignorePatterns: ['node_modules/', 'build/'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'import', 'jsx-a11y'],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'prettier/prettier': [
      "error",
      {
        'singleQuote': true, // Enforce single quotes
        'semi': true,        // Enforce semicolons
        'printWidth': 80,    // Max line length
        'tabWidth': 2,       // Indent size
        'trailingComma': 'es5' // Trailing commas for multi-line statements
      }
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],
    'react/jsx-filename-extension': [1, { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        aspects: ['noHref', 'invalidHref', 'preferButton'],
        components: ['Link'],
        specialLink: ['to', 'hrefLeft', 'hrefRight'],
      },
    ],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/no-static-element-interactions': 0,
    'linebreak-style': ['error', os.EOL === '\r\n' ? 'windows' : 'unix'],
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'no-underscore-dangle': 0,
    'react/destructuring-assignment': 0,
    'react/function-component-definition': [
      2,
      { namedComponents: 'arrow-function' },
    ],
    'react/jsx-no-useless-fragment': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-wrap-multilines': [
      1,
      {
        assignment: true,
        declaration: true,
        return: true,
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Add the extensions you're using
      },
    },
  }
};
