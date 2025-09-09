/* eslint-env node */
module.exports = {
    root: true,
    env: { node: true, es2022: true },
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    plugins: ["import", "security"],
    extends: [
      "eslint:recommended",
      "plugin:import/recommended",
      "plugin:security/recommended",
      "prettier"
    ],
    rules: {
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always"
        }
      ],
      "security/detect-non-literal-require": "off"
    }
  }
  