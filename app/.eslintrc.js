module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "prettier/prettier": "warn",
  },
};
