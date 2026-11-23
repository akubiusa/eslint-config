# AGENTS.md

`@book000/eslint-config` is a shared ESLint flat config published to npm (ESM).
`index.mjs` is the entry point and `test.mjs` verifies the rule behavior.

## Language

- All deliverables are written in English: documentation, code comments, JSDoc, commit messages, PR and Issue titles and bodies, review comments, and LLM instruction files.
- Runtime messages (including the output of `test.mjs`) are English.
- Exceptions: quotations, technical identifiers, generated files, and external source text.
- Never rewrite Git history to change the language of existing commits.

## Conventions

- Commits: [Conventional Commits](https://www.conventionalcommits.org/).
- Branches: [Conventional Branch](https://conventional-branch.github.io) short form (`feat`, `fix`, `docs`, ...).
- Package manager: pnpm (version pinned by `packageManager` in `package.json`); Node.js version is in `.node-version`.
- Do not push commits to Renovate PRs.
- Do not work around TypeScript errors with `skipLibCheck`.
- Never commit secrets.
- The `eslint` peer dependency is a range, `^10.4.0`, whose minimum is bounded by the tightest peer requirement of the direct dependencies (currently `eslint-plugin-unicorn`); `devDependencies.eslint` is an exact pin that Renovate updates and must stay inside that range; raising the minimum is a breaking change, and the `Peer range` workflow verifies the minimum and the latest 10.x.

## Commands

```shell
pnpm install
pnpm test
```

`pnpm test` runs `node --experimental-vm-modules test.mjs`, then checks malformed-fixture failure behavior in an isolated temporary directory.
It creates `src/`, `tsconfig.json` and `eslint.config.mjs` in the repository root, lints one temp file per test case in a single ESLint process, and removes the temp files, `tsconfig.json` and `eslint.config.mjs` afterwards (an empty `src/` is left behind).
The script exits with a non-zero code when any case fails, and the summary prints the `Failed:` count (failed cases are marked with `❌`).
There is no separate lint or build step.

## Structure of `index.mjs`

The exported config is an ordered flat config array (the last matching definition of a rule wins):

1. `neostandard({ noStyle: true })` and `tseslint.configs.recommended`.
2. An explicit list of `eslint-plugin-unicorn` rules: a fixed snapshot of `flat/recommended` (see the comment in the file), not the preset itself.
3. TypeScript-only rules for `**/*.ts` and `**/*.tsx` (`strictTypeChecked` and `stylisticTypeChecked`, type-aware via `parserOptions.project: ["tsconfig.json"]`), with a few relaxed rules (`no-explicit-any`, `no-unsafe-assignment`, `no-unsafe-argument`, and others).
4. `unicorn/catch-error-name` and `unicorn/filename-case` overrides (including a `.vue` PascalCase override).
5. `ignores`, then `eslint-config-prettier` last so that it can disable conflicting rules.

## Rules for changes

- Keep a short comment explaining why each rule is off or customized; the rationale is the valuable part.
- Add or update a case in the `testCases` array of `test.mjs` whenever a rule is added or changed.
- Keep `eslintPrettier` at the end of the array, and keep later overrides (such as `unicorn/filename-case`) in their current order.
- When updating `eslint-plugin-unicorn`, check its changelog and update the explicit rule list; a removed or renamed rule ID breaks config validation for every consumer.
- Adding or tightening rules is a breaking change for consumers; choose the commit type accordingly.
- Update `README.md` when installation or usage changes.
