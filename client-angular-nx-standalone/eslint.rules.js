/**
 * TypeScript Representation
 *
 * type ESLintOverrideRuleOptions = {
 *     [key: string]: string | number | boolean | string[];
 * };
 *
 * type ConfigRules = {
 *     [key: string]:
 *     | "warn"
 *     | "error"
 *     | ["warn" | "error", ESLintOverrideRuleOptions]
 *     | [("warn" | "error"), ("always" | "never")]
 *     | [("warn" | "error"), ("always" | "never") | ESLintOverrideRuleOptions]
 * };
 */

/**
 * JSDoc Representation
 * 
 * @typedef {{ [key: string]: string | number | boolean | string[] }} ESLintOverrideRuleOptions
 * @typedef {{ [key: string]:
 *  | "warn"
 *  | "error"
 *  | ["warn" | "error", ESLintOverrideRuleOptions]
 *  | [("warn" | "error"), ("always" | "never")]
 *  | [("warn" | "error"), ("always" | "never"), ESLintOverrideRuleOptions]
 * }} ConfigRules
 */

/**
 * @tutorial [ESLint-Reference](https://eslint.org/docs/latest/rules/)
 * @type {ConfigRules} STANDARD_ESLINT_CONFIG_RULES
 */
const STANDARD_ESLINT_CONFIG_RULES = {
  semi: "error",
  "no-console": "warn", // FE - Warn, BE - Error
  "no-debugger": "warn", // FE - Warn, BE - Error
  "no-var": "error",
  "no-void": "error",
  "prefer-const": "error",
  "getter-return": "error",
  "no-setter-return": "error",
  "no-class-assign": "error",
  "no-const-assign": "error",
  "no-constant-binary-expression": "error",
  "no-dupe-args": "error",
  "no-dupe-else-if": "error",
  "no-duplicate-case": "error",
  "no-duplicate-imports": "error",
  "no-ex-assign": "error",
  "no-fallthrough": "error",
  "no-inner-declarations": "error",
  "no-octal": "error",
  "no-octal-escape": "error",
  "no-nonoctal-decimal-escape": "error",
  "no-delete-var": "error",
  "no-empty": "error",
  // "no-empty-function": "error",
  "no-empty-static-block": "error",
  "no-eval": "error",
  "no-implied-eval": "error",
  "no-extend-native": "error",
  "no-extra-bind": "error",
  "no-extra-boolean-cast": "error",
  "no-extra-label": "error",
  "no-global-assign": "error",
  "no-implicit-coercion": "error",
  "no-label-var": "error",
  "no-labels": "error",
  "no-lone-blocks": "error",
  "no-lonely-if": "error",
  "no-loop-func": "error",
  "no-multi-assign": "error",
  "no-nested-ternary": "error",
  "no-new": "error",
  "no-new-func": "error",
  "no-new-wrappers": "error",
  "no-param-reassign": "error",
  "no-proto": "error",
  "no-redeclare": "error",
  "no-return-assign": "error",
  "no-script-url": "error",
  "no-sequences": "error",
  "no-compare-neg-zero": "error",
  "no-underscore-dangle": "error",
  "no-throw-literal": "error",
  "no-unused-labels": "error",
  "no-undefined": "error",
  "no-useless-call": "error",
  "no-useless-concat": "error",
  "prefer-template": "error",
  "no-useless-escape": "error",
  "no-useless-return": "error",
  "operator-assignment": ["error", "always"],
  "prefer-exponentiation-operator": "error",
  "prefer-object-has-own": "error",
  "require-await": "error",
  "require-yield": "error",
  "yoda": "error",
  "no-else-return": [
    "error",
    {
      allowElseIf: true
    }
  ],
  "max-lines": [
    "error",
    {
      max: 1000,
      skipBlankLines: true,
      skipComments: true
    }
  ],
  "logical-assignment-operators": ["error", "always", { enforceForIfStatements: true }],
  "no-restricted-syntax": [
      "error",
      {
        selector: "TSEnumDeclaration:not([const=true])",
        message: "Avoid declaring non-const enums. Use const-types instead."
      },
      {
        selector: "TSEnumDeclaration[const=true]",
        message: "Avoid declaring const enums. Use const-types instead."
      },
      /**
       * @tutorial [No-Explicit-Void-Return-Type](https://typescript-eslint.io/play/#ts=5.7.2&showAST=es&fileType=.tsx&code=GYVwdgxgLglg9mABAZwIYE8ASMAUBKALkQDc4YATRAbwChFEIFk4AbAUwDoW4BzHAImz88AbhoBfGjUZhkUFBmwAmIvkQBeAHwkyldYjVbqdBk1adufQTGFjJ0pvLRYYAZlV4N20hQ2JQkLAIarT0MszsXLwCQqISUhAsqMjIiACCxvTOyvhEPpSh9Kay5lFWsWL0kvZsAB4ADnAATvKJyakAIqhQqADCcAC2jWBsYPKF4VBNINDNIYj29DxsUGksLF09uTq%2BhWFmkZYxNnFV8Q6y8r1JKUp%2BhTxNbCseXplF4aVH1rYm4gA08SAA&eslintrc=N4KABGBEBOCuA2BTAzpAXGUEKQHYHsBaaFAF2gEsBjUxAE0OQE9dSBDAD3TAG1xsciaNHzRIAGn4CsA7JGSIkNUd0gAxWLhoV8uACKIq8NtDakduMAD4wAFQDKtpgAdEAQVwF253dbv2ANXwKOgBpRCYAd1E6CSlZSABbFGQ2AHNEVTcAN2C6MEQOZ3hqClJ4JjBIynNcNLAAHUhckKawElJYaEsAawjo6HyAChJ6ukMASgA6SHiIAF9JWUw5uQUlUhUMdU1tXQBRIpJkZAs-BydXDy8zM5sHIJDwqJi45Zxkk-TM7Zy8gqKJSoZQqVRqFDqjWaeTaHS6vX6MTAI0Q9UKzmms2Wi1WMmW8kUhk2Ym2Dg0Wh8uEuiHOjhc7k8%2BG8d38jzCiMGb3eSRS3yyLXy6KBIMq1TKEPqTQFsMQnW6YD6L0GyNGYBMIkimNW83iAF1%2BDr5kA&tsconfig=N4KABGBEDGD2C2AHAlgGwKYCcDyiAuysAdgM6QBcYoEEkJemy0eAcgK6qoDCAFutAGsylBm3TgwAXxCSgA&tokens=false)
       * New Rule: Intended for developers to stop explicitly writing "void" return type explicitly (developed using ESTree ASTs).
       */
      {
        selector: "FunctionDeclaration > TSTypeAnnotation > TSVoidKeyword",
        message: "[FunctionDeclaration] Avoid explicitly declaring a \"void\" return type."
      },
      {
        selector: "FunctionExpression > TSTypeAnnotation > TSVoidKeyword",
        message: "[FunctionExpression] Avoid explicitly declaring a \"void\" return type."
      },
      {
        selector: "TSFunctionType > TSTypeAnnotation > TSVoidKeyword",
        message: "[FunctionType] Avoid explicitly declaring a \"void\" return type."
      }
    ],
};

/**
 * @tutorial [TS-ESLint-Reference](https://typescript-eslint.io/rules/)
 * @type {ConfigRules} TYPESCRIPT_ESLINT_CONFIG_RULES
 */
const TYPESCRIPT_ESLINT_CONFIG_RULES = {
  // "void" keyword is allowed
  // Issue: https://github.com/typescript-eslint/typescript-eslint/issues/7250
  // "@typescript-eslint/explicit-function-return-type": ["warn", {
  //   allowExpressions: true,
  //   allowTypedFunctionExpressions: true
  // }],
  
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-unused-vars": "error",
  "@typescript-eslint/prefer-readonly": "error"
};

/**
 * @tutorial [Unicorn-Reference](https://github.com/sindresorhus/eslint-plugin-unicorn/tree/main?tab=readme-ov-file)
 * @type {ConfigRules} UNICORN_ESLINT_CONFIG_RULES
 */
const UNICORN_ESLINT_CONFIG_RULES = {
  "unicorn/no-console-spaces": "error",
  "unicorn/no-empty-file": "error",
  "unicorn/no-array-for-each": "error",
  "unicorn/no-array-push-push": "error",
  "unicorn/no-array-reduce": [
    "error",
    {
      allowSimpleOperations: true
    }
  ],
  "unicorn/no-for-loop": "error",
  "unicorn/no-instanceof-array": "error",
  "unicorn/no-new-array": "error",
  "unicorn/no-new-buffer": "error",
  "unicorn/no-this-assignment": "error",
  "unicorn/prefer-string-slice": "error",
  "unicorn/prefer-module": "error",
  "unicorn/prefer-string-starts-ends-with": "error",
  "unicorn/prefer-string-trim-start-end": "error",
  "unicorn/prefer-negative-index": "error",
  "unicorn/consistent-existence-index-check": "error",
  "unicorn/switch-case-braces": "error",
  "unicorn/empty-brace-spaces": "error",
  "unicorn/require-number-to-fixed-digits-argument": "error"
};

// Export all ESLint Ruleset Configurations
module.exports = {
  STANDARD_ESLINT_CONFIG_RULES,
  TYPESCRIPT_ESLINT_CONFIG_RULES,
  UNICORN_ESLINT_CONFIG_RULES
};
