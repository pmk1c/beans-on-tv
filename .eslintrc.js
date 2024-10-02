// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:import/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "expo",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "import/order": ["warn", { "newlines-between": "always" }],
    "@typescript-eslint/no-invalid-void-type": ["off"],
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      { allowNumber: true },
    ],
  },
};
