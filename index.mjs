import tseslintParser from "@typescript-eslint/parser";
import eslintPrettier from "eslint-config-prettier";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import neostandard from "neostandard";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Standard JS rule set. Style rules are disabled because Prettier owns formatting.
  ...neostandard({ noStyle: true }),
  ...tseslint.configs.recommended,
  {
    // List eslint-plugin-unicorn rules explicitly instead of using flat/recommended.
    // Reason: flat/recommended gains or loses rules on every unicorn release, which would
    // push new errors to every project that depends on this package at once.
    // To adopt a new rule, add it to this list after checking the unicorn changelog.
    //
    // The list is a fixed snapshot of flat/recommended at eslint-plugin-unicorn 71.1.0
    // and is not re-synced automatically, minus:
    // - deprecated rules
    // - catch-error-name and filename-case, which need options and have dedicated blocks below
    // - rules deliberately turned off (see the "off" entries below)
    //
    // When upgrading unicorn, check the changelog for added, removed or renamed rules and
    // update this list. A removed or renamed rule ID left here makes ESLint fail config
    // validation and crashes the linter for every consumer.
    plugins: { unicorn },
    rules: {
      // reduce is a legitimate aggregation idiom; forcing a rewrite to for loops hurts readability.
      "unicorn/no-array-reduce": "off",
      // Too many false positives: it demands hoisting even functions that intentionally
      // capture outer-scope variables in a closure.
      "unicorn/consistent-function-scoping": "off",
      // Allow top-level await (e.g. CLI tools that also use an IIFE).
      "unicorn/prefer-top-level-await": "off",
      // Allow abbreviations (do not force dev -> development, prod -> production, etc.).
      "unicorn/name-replacements": "off",
      // Allow null.
      "unicorn/no-null": "off",
      // Allow explicit undefined (e.g. `return undefined`, `x = undefined`).
      "unicorn/no-useless-undefined": "off",
      // Do not enforce class member order (private before public).
      // Public-first is a widely used convention that keeps the API readable.
      "unicorn/consistent-class-member-order": "off",
      // The rules below are off because of a high false-positive rate and little benefit
      // in real usage across dependent projects.
      //
      // Forces .then()/.catch()/.finally() chains to become await, but also flags thin wrappers
      // that just return a Promise and should not become async.
      "unicorn/prefer-await": "off",
      // Enforces is/has/should prefixes, but also flags domain-vocabulary booleans
      // such as enabled or visible.
      "unicorn/consistent-boolean-name": "off",
      // Flags non-function values (variables, properties) with a verb prefix such as get/set/create,
      // but also domain names like removeButton (a variable holding a "remove" button element).
      "unicorn/no-non-function-verb-prefix": "off",
      // Forces Number() coercion, but it behaves differently from parseInt (e.g. NaN handling),
      // so the automatic rewrite can change behavior unintentionally.
      "unicorn/prefer-number-coercion": "off",
      // Also flags the common pattern of assigning a module-level variable for caching or memoization.
      "unicorn/no-top-level-assignment-in-function": "off",
      // \uXXXX and \u{XXXX} are equivalent; the rule only forces a mechanical rewrite of existing code.
      "unicorn/prefer-unicode-code-point-escapes": "off",
      // Also flags intentional early exits via break inside nested loops.
      "unicorn/no-break-in-nested-loop": "off",
      // Also flags legitimate class-name references inside static methods that are meant to be extended.
      "unicorn/class-reference-in-static-methods": "off",
      // Forces a leading `if (...) break` of while (true) into the while() condition, but also flags
      // the idiom where the break condition uses a value computed inside the loop
      // (while (true) { const chunk = readNext(); if (!chunk) break; ... }).
      "unicorn/prefer-while-loop-condition": "off",
      // Assigning location.href and calling location.assign() are nearly equivalent;
      // the rule only forces a mechanical rewrite.
      "unicorn/prefer-location-assign": "off",
      // Limits the nesting depth of calls passed as arguments, but also flags legitimate nesting in
      // schema definitions such as Zod's z.array(z.object({ ... })).
      "unicorn/max-nested-calls": "off",
      // Assigning to properties of globalThis/window/global is the standard way to set up tests and
      // mocks (globalThis.fetch = mock), so the false-positive rate is high in real code.
      "unicorn/no-global-object-property-assignment": "off",
      //
      // All remaining rules of the flat/recommended snapshot are set to "error" explicitly below.
      "unicorn/better-dom-traversing": "error",
      "unicorn/consistent-assert": "error",
      "unicorn/consistent-compound-words": "error",
      "unicorn/consistent-conditional-object-spread": "error",
      "unicorn/consistent-date-clone": "error",
      "unicorn/consistent-empty-array-spread": "error",
      "unicorn/consistent-existence-index-check": "error",
      "unicorn/consistent-export-decorator-position": "error",
      "unicorn/consistent-json-file-read": "error",
      "unicorn/consistent-optional-chaining": "error",
      "unicorn/consistent-template-literal-escape": "error",
      "unicorn/consistent-tuple-labels": "error",
      "unicorn/default-export-style": "error",
      "unicorn/dom-node-dataset": "error",
      "unicorn/empty-brace-spaces": "error",
      "unicorn/error-message": "error",
      "unicorn/escape-case": "error",
      "unicorn/expiring-todo-comments": "error",
      "unicorn/explicit-length-check": "error",
      "unicorn/explicit-timer-delay": "error",
      "unicorn/import-style": "error",
      "unicorn/isolated-functions": "error",
      "unicorn/logical-assignment-operators": "error",
      "unicorn/new-for-builtins": "error",
      "unicorn/no-abusive-eslint-disable": "error",
      "unicorn/no-accessor-recursion": "error",
      "unicorn/no-accidental-bitwise-operator": "error",
      "unicorn/no-anonymous-default-export": "error",
      "unicorn/no-array-callback-reference": "error",
      "unicorn/no-array-concat-in-loop": "error",
      "unicorn/no-array-fill-with-reference-type": "error",
      "unicorn/no-array-from-fill": "error",
      "unicorn/no-array-method-this-argument": "error",
      "unicorn/no-array-reverse": "error",
      "unicorn/no-array-sort": "error",
      "unicorn/no-array-sort-for-min-max": "error",
      "unicorn/no-array-splice": "error",
      "unicorn/no-async-promise-finally": "error",
      "unicorn/no-await-expression-member": "error",
      "unicorn/no-await-in-promise-methods": "error",
      "unicorn/no-blob-to-file": "error",
      "unicorn/no-boolean-sort-comparator": "error",
      "unicorn/no-canvas-to-image": "error",
      "unicorn/no-chained-comparison": "error",
      "unicorn/no-collection-bracket-access": "error",
      "unicorn/no-computed-property-existence-check": "error",
      "unicorn/no-confusing-array-splice": "error",
      "unicorn/no-confusing-array-with": "error",
      "unicorn/no-console-spaces": "error",
      "unicorn/no-constant-zero-expression": "error",
      "unicorn/no-declarations-before-early-exit": "error",
      "unicorn/no-document-cookie": "error",
      "unicorn/no-double-comparison": "error",
      "unicorn/no-duplicate-if-branches": "error",
      "unicorn/no-duplicate-logical-operands": "error",
      "unicorn/no-duplicate-loops": "error",
      "unicorn/no-duplicate-set-values": "error",
      "unicorn/no-empty-file": "error",
      "unicorn/no-error-property-assignment": "error",
      "unicorn/no-exports-in-scripts": "error",
      "unicorn/no-for-each": "error",
      "unicorn/no-for-loop": "error",
      "unicorn/no-immediate-mutation": "error",
      "unicorn/no-impossible-length-comparison": "error",
      "unicorn/no-incorrect-query-selector": "error",
      "unicorn/no-incorrect-template-string-interpolation": "error",
      "unicorn/no-instanceof-builtins": "error",
      "unicorn/no-invalid-argument-count": "error",
      "unicorn/no-invalid-character-comparison": "error",
      "unicorn/no-invalid-fetch-options": "error",
      "unicorn/no-invalid-remove-event-listener": "error",
      "unicorn/no-invalid-well-known-symbol-methods": "error",
      "unicorn/no-late-current-target-access": "error",
      "unicorn/no-late-event-control": "error",
      "unicorn/no-lonely-if": "error",
      "unicorn/no-loop-iterable-mutation": "error",
      "unicorn/no-magic-array-flat-depth": "error",
      "unicorn/no-mismatched-map-key": "error",
      "unicorn/no-misrefactored-assignment": "error",
      "unicorn/no-named-default": "error",
      "unicorn/no-negated-array-predicate": "error",
      "unicorn/no-negated-comparison": "error",
      "unicorn/no-negated-condition": "error",
      "unicorn/no-negation-in-equality-check": "error",
      "unicorn/no-nested-ternary": "error",
      "unicorn/no-new-array": "error",
      "unicorn/no-new-buffer": "error",
      "unicorn/no-nonstandard-builtin-properties": "error",
      "unicorn/no-object-as-default-parameter": "error",
      "unicorn/no-object-methods-with-collections": "error",
      "unicorn/no-optional-chaining-on-undeclared-variable": "error",
      "unicorn/no-process-exit": "error",
      "unicorn/no-redundant-comparison": "error",
      "unicorn/no-return-array-push": "error",
      "unicorn/no-selector-as-dom-name": "error",
      "unicorn/no-single-promise-in-promise-methods": "error",
      "unicorn/no-static-only-class": "error",
      "unicorn/no-subtraction-comparison": "error",
      "unicorn/no-thenable": "error",
      "unicorn/no-this-assignment": "error",
      "unicorn/no-this-outside-of-class": "error",
      "unicorn/no-top-level-side-effects": "error",
      "unicorn/no-typeof-undefined": "error",
      "unicorn/no-uncalled-method": "error",
      "unicorn/no-undeclared-class-members": "error",
      "unicorn/no-unnecessary-array-flat-depth": "error",
      "unicorn/no-unnecessary-array-flat-map": "error",
      "unicorn/no-unnecessary-array-splice-count": "error",
      "unicorn/no-unnecessary-await": "error",
      "unicorn/no-unnecessary-boolean-comparison": "error",
      "unicorn/no-unnecessary-fetch-options": "error",
      "unicorn/no-unnecessary-global-this": "error",
      "unicorn/no-unnecessary-nested-ternary": "error",
      "unicorn/no-unnecessary-polyfills": "error",
      "unicorn/no-unnecessary-slice-end": "error",
      "unicorn/no-unnecessary-splice": "error",
      "unicorn/no-unreadable-array-destructuring": "error",
      "unicorn/no-unreadable-for-of-expression": "error",
      "unicorn/no-unreadable-iife": "error",
      "unicorn/no-unreadable-object-destructuring": "error",
      "unicorn/no-unsafe-buffer-conversion": "error",
      "unicorn/no-unsafe-promise-all-settled-values": "error",
      "unicorn/no-unsafe-property-key": "error",
      "unicorn/no-unsafe-string-replacement": "error",
      "unicorn/no-unused-array-method-return": "error",
      "unicorn/no-useless-boolean-cast": "error",
      "unicorn/no-useless-coercion": "error",
      "unicorn/no-useless-collection-argument": "error",
      "unicorn/no-useless-compound-assignment": "error",
      "unicorn/no-useless-concat": "error",
      "unicorn/no-useless-continue": "error",
      "unicorn/no-useless-delete-check": "error",
      "unicorn/no-useless-else": "error",
      "unicorn/no-useless-error-capture-stack-trace": "error",
      "unicorn/no-useless-fallback-in-spread": "error",
      "unicorn/no-useless-iterator-to-array": "error",
      "unicorn/no-useless-length-check": "error",
      "unicorn/no-useless-logical-operand": "error",
      "unicorn/no-useless-override": "error",
      "unicorn/no-useless-promise-resolve-reject": "error",
      "unicorn/no-useless-recursion": "error",
      "unicorn/no-useless-spread": "error",
      "unicorn/no-useless-switch-case": "error",
      "unicorn/no-useless-template-literals": "error",
      "unicorn/no-xor-as-exponentiation": "error",
      "unicorn/no-zero-fractions": "error",
      "unicorn/number-literal-case": "error",
      "unicorn/numeric-separators-style": "error",
      "unicorn/operator-assignment": "error",
      "unicorn/prefer-abort-signal-any": "error",
      "unicorn/prefer-abort-signal-timeout": "error",
      "unicorn/prefer-add-event-listener": "error",
      "unicorn/prefer-add-event-listener-options": "error",
      "unicorn/prefer-aggregate-error": "error",
      "unicorn/prefer-array-find": "error",
      "unicorn/prefer-array-flat": "error",
      "unicorn/prefer-array-flat-map": "error",
      "unicorn/prefer-array-from-async": "error",
      "unicorn/prefer-array-from-map": "error",
      "unicorn/prefer-array-from-range": "error",
      "unicorn/prefer-array-index-of": "error",
      "unicorn/prefer-array-iterable-methods": "error",
      "unicorn/prefer-array-last-methods": "error",
      "unicorn/prefer-array-slice": "error",
      "unicorn/prefer-array-some": "error",
      "unicorn/prefer-at": "error",
      "unicorn/prefer-bigint-literals": "error",
      "unicorn/prefer-blob-reading-methods": "error",
      "unicorn/prefer-block-statement-over-iife": "error",
      "unicorn/prefer-boolean-return": "error",
      "unicorn/prefer-class-fields": "error",
      "unicorn/prefer-classlist-toggle": "error",
      "unicorn/prefer-code-point": "error",
      "unicorn/prefer-continue": "error",
      "unicorn/prefer-date-now": "error",
      "unicorn/prefer-default-parameters": "error",
      "unicorn/prefer-direct-iteration": "error",
      "unicorn/prefer-dom-node-append": "error",
      "unicorn/prefer-dom-node-remove": "error",
      "unicorn/prefer-dom-node-replace-children": "error",
      "unicorn/prefer-dom-node-text-content": "error",
      "unicorn/prefer-early-return": "error",
      "unicorn/prefer-else-if": "error",
      "unicorn/prefer-event-target": "error",
      "unicorn/prefer-export-from": "error",
      "unicorn/prefer-flat-math-min-max": "error",
      "unicorn/prefer-get-or-insert-computed": "error",
      "unicorn/prefer-global-number-constants": "error",
      "unicorn/prefer-global-this": "error",
      "unicorn/prefer-group-by": "error",
      "unicorn/prefer-has-check": "error",
      "unicorn/prefer-hoisting-branch-code": "error",
      "unicorn/prefer-https": "error",
      "unicorn/prefer-identifier-import-export-specifiers": "error",
      "unicorn/prefer-includes": "error",
      "unicorn/prefer-includes-over-repeated-comparisons": "error",
      "unicorn/prefer-iterable-in-constructor": "error",
      "unicorn/prefer-iterator-helpers": "error",
      "unicorn/prefer-iterator-to-array": "error",
      "unicorn/prefer-iterator-to-array-at-end": "error",
      "unicorn/prefer-keyboard-event-key": "error",
      "unicorn/prefer-logical-operator-over-ternary": "error",
      "unicorn/prefer-map-from-entries": "error",
      "unicorn/prefer-math-abs": "error",
      "unicorn/prefer-math-constants": "error",
      "unicorn/prefer-math-min-max": "error",
      "unicorn/prefer-math-trunc": "error",
      "unicorn/prefer-minimal-ternary": "error",
      "unicorn/prefer-modern-dom-apis": "error",
      "unicorn/prefer-modern-math-apis": "error",
      "unicorn/prefer-module": "error",
      "unicorn/prefer-native-coercion-functions": "error",
      "unicorn/prefer-negative-index": "error",
      "unicorn/prefer-node-protocol": "error",
      "unicorn/prefer-number-is-safe-integer": "error",
      "unicorn/prefer-number-properties": "error",
      "unicorn/prefer-object-define-properties": "error",
      "unicorn/prefer-object-destructuring-defaults": "error",
      "unicorn/prefer-object-from-entries": "error",
      "unicorn/prefer-object-iterable-methods": "error",
      "unicorn/prefer-observer-apis": "error",
      "unicorn/prefer-optional-catch-binding": "error",
      "unicorn/prefer-path2d": "error",
      "unicorn/prefer-private-class-fields": "error",
      "unicorn/prefer-promise-try": "error",
      "unicorn/prefer-promise-with-resolvers": "error",
      "unicorn/prefer-prototype-methods": "error",
      "unicorn/prefer-query-selector": "error",
      "unicorn/prefer-queue-microtask": "error",
      "unicorn/prefer-reflect-apply": "error",
      "unicorn/prefer-regexp-test": "error",
      "unicorn/prefer-response-static-json": "error",
      "unicorn/prefer-scoped-selector": "error",
      "unicorn/prefer-set-has": "error",
      "unicorn/prefer-set-methods": "error",
      "unicorn/prefer-set-size": "error",
      "unicorn/prefer-simple-condition-first": "error",
      "unicorn/prefer-simple-sort-comparator": "error",
      "unicorn/prefer-simplified-conditions": "error",
      "unicorn/prefer-single-array-predicate": "error",
      "unicorn/prefer-single-call": "error",
      "unicorn/prefer-single-object-destructuring": "error",
      "unicorn/prefer-single-replace": "error",
      "unicorn/prefer-smaller-scope": "error",
      "unicorn/prefer-split-limit": "error",
      "unicorn/prefer-spread": "error",
      "unicorn/prefer-string-match-all": "error",
      "unicorn/prefer-string-pad-start-end": "error",
      "unicorn/prefer-string-raw": "error",
      "unicorn/prefer-string-repeat": "error",
      "unicorn/prefer-string-replace-all": "error",
      "unicorn/prefer-string-slice": "error",
      "unicorn/prefer-string-starts-ends-with": "error",
      "unicorn/prefer-string-trim-start-end": "error",
      "unicorn/prefer-structured-clone": "error",
      "unicorn/prefer-switch": "error",
      "unicorn/prefer-ternary": "error",
      "unicorn/prefer-toggle-attribute": "error",
      "unicorn/prefer-type-error": "error",
      "unicorn/prefer-type-literal-last": "error",
      "unicorn/prefer-unary-minus": "error",
      "unicorn/prefer-url-can-parse": "error",
      "unicorn/prefer-url-href": "error",
      "unicorn/prefer-url-search-parameters": "error",
      "unicorn/relative-url-style": "error",
      "unicorn/require-array-join-separator": "error",
      "unicorn/require-array-sort-compare": "error",
      "unicorn/require-css-escape": "error",
      "unicorn/require-module-attributes": "error",
      "unicorn/require-module-specifiers": "error",
      "unicorn/require-number-to-fixed-digits-argument": "error",
      "unicorn/require-passive-events": "error",
      "unicorn/require-proxy-trap-boolean-return": "error",
      "unicorn/switch-case-braces": "error",
      "unicorn/switch-case-break-position": "error",
      "unicorn/template-indent": "error",
      "unicorn/text-encoding-identifier-case": "error",
      "unicorn/throw-new-error": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.es2020,
        ...globals.node,
      },
      parser: tseslintParser,
      parserOptions: {
        project: ["tsconfig.json"],
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      // Allow the any type.
      "@typescript-eslint/no-explicit-any": "off",
      // Allow unsafe assignments of any.
      "@typescript-eslint/no-unsafe-assignment": "off",
      // Allow unsafe any arguments.
      "@typescript-eslint/no-unsafe-argument": "off",
      // Allow numbers, booleans, any and nullish values in template literals.
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
          allowBoolean: true,
          allowAny: true,
          allowNullish: true,
        },
      ],
      // Disallow floating Promises, except with the void operator or an immediately invoked async function.
      "@typescript-eslint/no-floating-promises": [
        "error",
        {
          ignoreVoid: true,
          ignoreIIFE: true,
        },
      ],
      // Disallow unnecessary conditions, except constant loop conditions (infinite loops).
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: true,
        },
      ],
      // Allow classes used as namespaces.
      "@typescript-eslint/no-extraneous-class": "off",
      // Use the TypeScript-aware version of no-use-before-define.
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "error",
    },
  },
  {
    // Name the catch-clause variable `error`.
    // `err` is always accepted too (error_ is not required).
    rules: {
      "unicorn/catch-error-name": ["error", { name: "error", ignore: [/^err$/] }],
    },
  },
  {
    // Since unicorn v65 directory names are checked as well as file names.
    // The `ignore` option skips the whole file when any path segment matches.
    // That would also disable the file name check, so only the directory check is disabled
    // with checkDirectories: false.
    // This also avoids errors for conventional directory names such as src.
    // Double-underscore directories such as __tests__ and __mocks__ stay in `ignore`
    // (test files need no file name check).
    rules: {
      "unicorn/filename-case": [
        "error",
        { checkDirectories: false, ignore: [/^__[\w-]+__$/] },
      ],
    },
  },
  {
    // Vue components conventionally use PascalCase, so pascalCase applies to .vue files only.
    // In flat config the last definition of a rule wins.
    // A consumer that overrides unicorn/filename-case would also drop checkDirectories: false.
    // It is repeated here so consumers can keep these defaults without redefining the rule.
    files: ["**/*.vue"],
    rules: {
      "unicorn/filename-case": [
        "error",
        { case: "pascalCase", checkDirectories: false },
      ],
    },
  },
  {
    ignores: ["dist", "output", "node_modules", "data", "logs", "coverage"],
  },
  eslintPrettier
);
