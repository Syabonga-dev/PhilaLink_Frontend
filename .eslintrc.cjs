module.exports = {
  root: true,

  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  extends: [
    "eslint:recommended",
  ],

  ignorePatterns: [
    "dist",
    "node_modules",
    "coverage",
  ],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",

    ecmaFeatures: {
      jsx: true,
    },
  },

  plugins: [
    "react",
    "react-hooks",
    "react-refresh",
  ],

  settings: {
    react: {
      version: "detect",
    },
  },

  rules: {
    /*
     * React 17+ and Vite use the automatic JSX runtime,
     * so React does not need to be imported just to use JSX.
     */
    "react/react-in-jsx-scope": "off",

    /*
     * PhilaLink currently contains several intentionally
     * retained variables and callback parameters. We will
     * tighten this later instead of blocking CI on legacy
     * unused-variable cleanup.
     */
    "no-unused-vars": "off",

    /*
     * Keep the most important React Hooks safety rule active.
     */
    "react-hooks/rules-of-hooks": "error",

    /*
     * Existing pages contain deliberate dependency patterns.
     * Dependency-array cleanup can be handled separately
     * without blocking the first production CI baseline.
     */
    "react-hooks/exhaustive-deps": "off",

    /*
     * Some PhilaLink modules export helpers alongside React
     * components. Do not fail CI for that Vite convention.
     */
    "react-refresh/only-export-components": "off",
  },
};
