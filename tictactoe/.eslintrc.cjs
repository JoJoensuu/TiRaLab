module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    "jest/globals": true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'jest'],
  rules: {
    "indent": [
        "error",
        2  
    ],
    "linebreak-style": [
        "error",
        "unix"
    ],
    "quotes": [
        "error",
        "single"
    ],
    "semi": [
      "error",
      "always"
  ],
    "eqeqeq": "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": [
        "error", "always"
    ],
    "arrow-spacing": [
        "error", { "before": true, "after": true }
    ],
    "no-console": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 0,
    "no-unused-vars": 0,
    "no-restricted-syntax": [
      "warn",
      {
        "selector": "CallExpression[callee.object.name='describe'][callee.property.name='only']",
        "message": "Using 'describe.only' is not allowed."
      },
      {
        "selector": "CallExpression[callee.object.name='it'][callee.property.name='only']",
        "message": "Using 'it.only' is not allowed."
      }
    ]
  },
}