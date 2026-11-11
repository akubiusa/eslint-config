# Copilot review instructions

See `AGENTS.md` at the repository root for the full development guidance.

## Language

- Write all deliverables (code comments, docs, commit messages, PR text) in English.
- Runtime messages are English.

## Review checklist

- A change to a rule in `index.mjs` must add or update a case in `test.mjs`.
- Each rule that is off or customized needs a short comment explaining why.
- Flat config is last-wins: `eslintPrettier` must stay at the end of the array, and later overrides such as `unicorn/filename-case` must keep their order.
- Rule additions or stricter settings are breaking changes for consumers; check that the commit type fits.
- Commits follow Conventional Commits; branches follow Conventional Branch short form.

## Known intentional patterns (do not flag)

- Rules deliberately turned off, such as `@typescript-eslint/no-explicit-any`, `no-unsafe-assignment`, `no-unsafe-argument`, `unicorn/no-null` and `unicorn/prefer-top-level-await`. Do not ask to enable them.
- The explicit unicorn rule list instead of `flat/recommended`.
- `test.mjs` temporarily creating `src/__tmp__cli`, `tsconfig.json` and `eslint.config.mjs`.
