module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "@vue/prettier", "@vue/typescript"],
  rules: {
    "arrow-parens": ["error", "always"],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "vue/experimental-script-setup-vars": "off",
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: 10,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
};
