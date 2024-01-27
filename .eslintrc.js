module.exports = {
  root: true,
  extends: "@react-native",
  rules: {
    quotes: "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: ["plugin:@typescript-eslint/recommended-type-checked"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  ],
};
