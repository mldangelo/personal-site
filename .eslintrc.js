{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "rules": {
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "no-trailing-spaces": "error",
    "react/jsx-indent": ["error", 2],
    "react/jsx-indent-props": ["error", 2]
  },
  "plugins": [
    "react"
  ]
}
