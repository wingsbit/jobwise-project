/* eslint-env node */
module.exports = {
    root: true,
    env: { browser: true, es2022: true },
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: { jsx: true }
    },
    settings: { react: { version: "detect" } },
    plugins: ["react", "react-hooks", "jsx-a11y", "import"],
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:import/recommended",
      "prettier"
    ],
    rules: {
      "react/prop-types": "off",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always"
        }
      ],
      "react-hooks/exhaustive-deps": "warn"
    }
  }
  