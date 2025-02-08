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
  ...nx.configs["flat/angular"],
  ...nx.configs["flat/angular-template"],
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: globals.builtin,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      unicorn: eslintUnicornPlugin,
      "@typescript-eslint": tseslint.plugin,
      "simple-import-sort": eslintSimpleImportSortPlugin,
      import: eslintImportPlugin
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

      // ESLint Rules: Angular
      "@angular-eslint/component-selector": [
        "warn",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case"
        }
      ],
      "@angular-eslint/directive-selector": [
        "warn",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase"
        }
      ],
      ...ESLINT_RULES.ANGULAR_ESLINT_CONFIG_RULES
    }
  },
  {
    files: ["**/*.html"],
    // Override or add rules here
    rules: {}
  }
];
