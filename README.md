# @book000/eslint-config

ESLint config for [Tomachi (book000)](https://github.com/book000)

## 🚀 Install

If you are using npm:

```shell
npm install eslint @book000/eslint-config
```

or if you are using yarn:

```shell
yarn add eslint @book000/eslint-config
```

or if you are using pnpm:

```shell
pnpm add eslint @book000/eslint-config
```

For TypeScript projects, `typescript` is also required (TypeScript linting uses `parserOptions.project` pointing to `tsconfig.json`):

```shell
npm install typescript
```

Then, create `eslint.config.mjs` file and write the following:

```js
export { default } from '@book000/eslint-config'
```

## Included

- [neostandard](https://github.com/neostandard/neostandard) (without style rules) and the typescript-eslint `recommended` preset for all files.
- An explicit list of [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) rules, with some noisy rules turned off.
- For `*.ts` and `*.tsx`: typescript-eslint `strictTypeChecked` and `stylisticTypeChecked` with a few relaxed rules. A `tsconfig.json` in the project root is required.
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier), so formatting is left to Prettier.

## 📑 License

This project is licensed under the [MIT License](LICENSE).
