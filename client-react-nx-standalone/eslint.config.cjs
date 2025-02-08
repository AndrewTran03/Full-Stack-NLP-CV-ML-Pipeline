const nx = require("@nx/eslint-plugin");
const eslintUnicornPlugin = require("eslint-plugin-unicorn");
const globals = require("globals");
const tseslint = require("typescript-eslint");
const ESLINT_RULES = require("@andrewt03/eslint-typescript-rules");
const eslintSimpleImportSortPlugin = require("eslint-plugin-simple-import-sort");
const eslintImportPlugin = require("eslint-plugin-import");

module.exports = [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  {
    ignores: ["**/dist"]
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    // Override or add rules here
    rules: {}
  },
  ...nx.configs["flat/react"],
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      globals: globals.builtin,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      unicorn: eslintUnicornPlugin,
      "@typescript-eslint": tseslint.plugin,
      "simple-import-sort": eslintSimpleImportSortPlugin,
      import: eslintImportPlugin,
    },
    rules: {
      // Standard ESLint Rules
      ...ESLINT_RULES.STANDARD_ESLINT_CONFIG_RULES,

      // TypeScript ESLint Rules
      ...ESLINT_RULES.TYPESCRIPT_ESLINT_CONFIG_RULES,

      // Unicorn ESLint Rules
      ...ESLINT_RULES.UNICORN_ESLINT_CONFIG_RULES,

      // ESLint Rules: Console/Debugger to "Warn"
      ...ESLINT_RULES.CONSOLE_DEBUGGER_WARN_ESLINT_CONFIG_RULES,

      // ESLint Rules: Sorting Imports
      ...ESLINT_RULES.SORT_IMPORT_ESLINT_CONFIG_RULES,

      // ESLint Rules: React
      ...ESLINT_RULES.REACT_ESLINT_CONFIG_RULES,
      ...ESLINT_RULES.REACT_HOOKS_ESLINT_CONFIG_RULES
    }
  }
];
