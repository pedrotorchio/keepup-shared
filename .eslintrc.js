module.exports = {
  ignorePatterns: ["dist/**/*"],
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module" // Allows for the use of imports
  },
  extends: [
    "plugin:@typescript-eslint/recommended" // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/no-inferrable-types": "off"
  }
};