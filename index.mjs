import tseslintParser from "@typescript-eslint/parser";
import eslintPrettier from "eslint-config-prettier";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import neostandard from "neostandard";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Standard JS のルールセット（スタイル系は prettier に委ねるため無効化）
  ...neostandard({ noStyle: true }),
  ...tseslint.configs.recommended,
  // @ts-expect-error flat/recommendedの返すpluginsがstring[]なことでエラーになるため
  unicorn.configs["flat/recommended"],
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
      // TypeScriptのany型の使用を許可する
      "@typescript-eslint/no-explicit-any": "off",
      // TypeScriptの危険な代入を許可する
      "@typescript-eslint/no-unsafe-assignment": "off",
      // TypeScriptの危険な引数を許可する
      "@typescript-eslint/no-unsafe-argument": "off",
      // テンプレート式において、数値や真偽値、nullishを許可する
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
          allowBoolean: true,
          allowAny: true,
          allowNullish: true,
        },
      ],
      // 呼び出されないPromiseを許容しないが、void演算子や即時関数では許可する
      "@typescript-eslint/no-floating-promises": [
        "error",
        {
          ignoreVoid: true,
          ignoreIIFE: true,
        },
      ],
      // 不要な条件式を許容しないが、定数ループ条件（無限ループ）は許可する
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: true,
        },
      ],
      // 名前空間として使用されるクラスを許可する
      "@typescript-eslint/no-extraneous-class": "off",
      // 変数などの未定義使用について、TypeScript準拠とする
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "error",
      // トップレベルのawaitを許可する
      "unicorn/prefer-top-level-await": "off",
      // 省略形を許可する (dev -> development, prod -> productionなどの変換をさせない)
      "unicorn/prevent-abbreviations": "off",
      // nullを許可する
      "unicorn/no-null": "off",
      // 無駄なundefinedを許可する
      "unicorn/no-useless-undefined": "off",
    },
  },
  {
    // catch ブロックのエラー変数名は error に統一する。
    // err も常に許容する（error_ は要求しない）。
    rules: {
      "unicorn/catch-error-name": ["error", { name: "error", ignore: [/^err$/] }],
    },
  },
  {
    // unicorn v65 からファイル名に加えてディレクトリ名もチェック対象となったが、
    // ignore オプションはマッチしたセグメントを含むファイル全体をスキップするため
    // ファイル名チェック自体まで無効化してしまう。
    // そのため checkDirectories: false でディレクトリ名チェックのみ無効化する。
    // src 等の慣習的なディレクトリ名でエラーが起きる問題もこれで解消される。
    // __tests__ や __mocks__ 等のダブルアンダースコアディレクトリは引き続き
    // ignore で対象外とする（テストファイル等はファイル名チェックも不要なため）。
    rules: {
      "unicorn/filename-case": [
        "error",
        { checkDirectories: false, ignore: [/^__[\w-]+__$/] },
      ],
    },
  },
  {
    // Vue コンポーネントは PascalCase の命名規則が慣習であるため、
    // .vue ファイルに限り pascalCase を適用する。
    // unicorn/filename-case のルールは ESLint flat config の「最後に定義したルールが勝つ」
    // 仕様により、プロジェクト側でオーバーライドするとここで設定した checkDirectories: false
    // も上書きされてしまう。
    // そのため、プロジェクト側で filename-case を再定義せずにこのデフォルト設定を
    // 使い続けられるよう、あらかじめ checkDirectories: false も含めて設定する。
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
