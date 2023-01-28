module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  rules: {
    // add custom rules here
  },
  overrides: [
    {
      files: ["**/*.tsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    }
  ]
};
