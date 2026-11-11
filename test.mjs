// Verifies the behavior of the ESLint flat config (index.mjs) by linting temporary files.
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

async function main() {
  const testCases = [
    {
      name: "prefer-top-level-await: top-level await is allowed",
      code: "await Promise.resolve(1);",
      shouldError: false,
      rules: ["unicorn/prefer-top-level-await"],
    },
    {
      name: "name-replacements: abbreviations such as dev and prod are allowed",
      code: "const dev = true; const prod = false;",
      shouldError: false,
      rules: ["unicorn/name-replacements"],
    },
    {
      name: "no-null: null is allowed",
      code: "const a = null;",
      shouldError: false,
      rules: ["unicorn/no-null"],
    },
    {
      name: "no-array-reduce: reduce is allowed",
      code: "const sum = [1, 2, 3].reduce((accumulator, value) => accumulator + value, 0);",
      shouldError: false,
      rules: ["unicorn/no-array-reduce"],
    },
    {
      name: "consistent-function-scoping: nested function capturing an outer-scope variable is allowed",
      code: "function outer() { const base = 1; function inner() { return base; } return inner(); }",
      shouldError: false,
      rules: ["unicorn/consistent-function-scoping"],
    },
    {
      name: "no-use-before-define: using a variable before its definition is an error",
      code: "console.log(a); const a = 1;",
      shouldError: true,
      rules: ["@typescript-eslint/no-use-before-define"],
    },
    {
      name: "no-use-before-define: using a variable after its definition is allowed",
      code: "const a = 1; console.log(a);",
      shouldError: false,
      rules: ["@typescript-eslint/no-use-before-define"],
    },
    {
      name: "no-explicit-any: the any type is allowed",
      code: "let a: any = 1; a = 'str';",
      shouldError: false,
      rules: ["@typescript-eslint/no-explicit-any"],
    },
    {
      name: "no-unsafe-assignment: unsafe assignment is allowed",
      code: "function f(x: any) { const y: number = x; }",
      shouldError: false,
      rules: ["@typescript-eslint/no-unsafe-assignment"],
    },
    {
      name: "no-unsafe-argument: unsafe argument is allowed",
      code: "function f(x: number) {} f(({} as any));",
      shouldError: false,
      rules: ["@typescript-eslint/no-unsafe-argument"],
    },
    {
      name: "restrict-template-expressions: number, boolean, any and nullish are allowed",
      code: "const n = 1; const b = true; const a: any = 2; const u = undefined; `${n}${b}${a}${u}`;",
      shouldError: false,
      rules: ["@typescript-eslint/restrict-template-expressions"],
    },
    {
      name: "restrict-template-expressions: number is allowed",
      code: "const n = 42; `${n}`;",
      shouldError: false,
      rules: ["@typescript-eslint/restrict-template-expressions"],
    },
    {
      name: "restrict-template-expressions: boolean is allowed",
      code: "const b = true; `${b}`;",
      shouldError: false,
      rules: ["@typescript-eslint/restrict-template-expressions"],
    },
    {
      name: "restrict-template-expressions: null is allowed",
      code: "const n = null; `${n}`;",
      shouldError: false,
      rules: ["@typescript-eslint/restrict-template-expressions"],
    },
    {
      name: "restrict-template-expressions: undefined is allowed",
      code: "const u = undefined; `${u}`;",
      shouldError: false,
      rules: ["@typescript-eslint/restrict-template-expressions"],
    },
    {
      name: "restrict-template-expressions: any is allowed",
      code: "const a: any = 123; `${a}`;",
      shouldError: false,
      rules: ["@typescript-eslint/restrict-template-expressions"],
    },
    {
      name: "restrict-template-expressions: object is an error",
      code: "const o = {}; `${o}`;",
      shouldError: true,
      rules: ["@typescript-eslint/restrict-template-expressions"],
    },
    {
      name: "restrict-template-expressions: object is an error (with a property)",
      code: "const o = { foo: 1 }; `${o}`;",
      shouldError: true,
      rules: ["@typescript-eslint/restrict-template-expressions"],
    },
    {
      name: "no-floating-promises: a plain Promise is an error",
      code: "Promise.resolve(1);",
      shouldError: true,
      rules: ["@typescript-eslint/no-floating-promises"],
    },
    {
      name: "no-floating-promises: the void operator is allowed",
      code: "void Promise.resolve(1);",
      shouldError: false,
      rules: ["@typescript-eslint/no-floating-promises"],
    },
    {
      name: "no-floating-promises: without the void operator is an error",
      code: "Promise.resolve(1);",
      shouldError: true,
      rules: ["@typescript-eslint/no-floating-promises"],
    },
    {
      name: "no-floating-promises: an unawaited Promise inside an IIFE is an error",
      code: "(async () => { Promise.resolve(1); })();",
      shouldError: true,
      rules: ["@typescript-eslint/no-floating-promises"],
    },
    {
      name: "no-floating-promises: an awaited Promise inside an IIFE is allowed",
      code: "(async () => { await Promise.resolve(1); })();",
      shouldError: false,
      rules: ["@typescript-eslint/no-floating-promises"],
    },
    {
      name: "no-unnecessary-condition: an unnecessary condition is an error",
      code: "if (true) { console.log(1); }",
      shouldError: true,
      rules: ["@typescript-eslint/no-unnecessary-condition"],
    },
    {
      name: "no-unnecessary-condition: a constant loop condition (infinite loop) is allowed",
      code: "while (true) { break; }",
      shouldError: false,
      rules: ["@typescript-eslint/no-unnecessary-condition"],
    },
    {
      name: "no-extraneous-class: a class used as a namespace is allowed",
      code: "class Namespace {}",
      shouldError: false,
      rules: ["@typescript-eslint/no-extraneous-class"],
    },
    {
      name: "no-useless-undefined: a useless undefined is allowed",
      code: "function f(x = undefined) { return undefined; }",
      shouldError: false,
      rules: ["unicorn/no-useless-undefined"],
    },
    {
      name: "catch-error-name: using error in a catch clause is allowed",
      code: "try { throw new Error(); } catch (error) { console.log(error); }",
      shouldError: false,
      rules: ["unicorn/catch-error-name"],
    },
    {
      name: "catch-error-name: a name other than error/err (e.g. e) in a catch clause is an error",
      code: "try { throw new Error(); } catch (e) { console.log(e); }",
      shouldError: true,
      rules: ["unicorn/catch-error-name"],
    },
    {
      name: "catch-error-name: err is allowed (always accepted)",
      code: "try { throw new Error(); } catch (err) { console.log(err); }",
      shouldError: false,
      rules: ["unicorn/catch-error-name"],
    },
    {
      name: "catch-error-name: err is allowed when an error variable exists in scope (avoids a clash)",
      code: "const error = 'msg'; try { throw new Error(); } catch (err) { console.log(error, err); }",
      shouldError: false,
      rules: ["unicorn/catch-error-name"],
    },
    {
      name: "filename-case: the __tests__ directory is excluded from case checks (allowed)",
      code: "export const a = 1;",
      shouldError: false,
      rules: ["unicorn/filename-case"],
      dir: "__tests__",
    },
    {
      name: "filename-case: the __mocks__ directory is excluded from case checks (allowed)",
      code: "export const a = 1;",
      shouldError: false,
      rules: ["unicorn/filename-case"],
      dir: "__mocks__",
    },
    {
      name: "filename-case: the src directory is excluded from case checks (allowed)",
      code: "export const a = 1;",
      shouldError: false,
      rules: ["unicorn/filename-case"],
      dir: "src",
    },
    {
      name: "consistent-class-member-order: a private field after a public field is not an error (allowed)",
      code: "class Foo { public name: string = 'foo'; private id: number = 1; }",
      shouldError: false,
      rules: ["unicorn/consistent-class-member-order"],
    },
    {
      name: "prefer-await: a thin non-async wrapper using a .then() chain is allowed",
      code: "function getValue(): Promise<number> { return Promise.resolve(1).then((value) => value); }",
      shouldError: false,
      rules: ["unicorn/prefer-await"],
    },
    {
      name: "consistent-boolean-name: a boolean variable without an is/has prefix is allowed",
      code: "const enabled: boolean = true;",
      shouldError: false,
      rules: ["unicorn/consistent-boolean-name"],
    },
    {
      name: "no-non-function-verb-prefix: a non-function variable with a verb prefix is allowed",
      code: "const removeButton = 1;",
      shouldError: false,
      rules: ["unicorn/no-non-function-verb-prefix"],
    },
    {
      name: "prefer-number-coercion: number conversion with parseInt is allowed",
      code: "const n = parseInt('1', 10);",
      shouldError: false,
      rules: ["unicorn/prefer-number-coercion"],
    },
    {
      name: "no-top-level-assignment-in-function: caching into a top-level variable is allowed",
      code: "let cache: number | undefined; function setCache(): void { cache = 1; }",
      shouldError: false,
      rules: ["unicorn/no-top-level-assignment-in-function"],
    },
    {
      name: "prefer-unicode-code-point-escapes: the \\uXXXX escape form is allowed",
      code: "const s = '\\u00e9';",
      shouldError: false,
      rules: ["unicorn/prefer-unicode-code-point-escapes"],
    },
    {
      name: "no-break-in-nested-loop: an early exit with break inside nested loops is allowed",
      code: "for (let i = 0; i < 3; i++) { for (let j = 0; j < 3; j++) { if (j === 1) break; } }",
      shouldError: false,
      rules: ["unicorn/no-break-in-nested-loop"],
    },
    {
      name: "class-reference-in-static-methods: a non-call class-name reference inside a static method is allowed",
      code: "class Foo { static bar = 1; static create(): number { return Foo.bar; } }",
      shouldError: false,
      rules: ["unicorn/class-reference-in-static-methods"],
    },
    {
      name: "prefer-while-loop-condition: while (true) with an inner break as the exit check is allowed",
      code: "let i = 0; while (true) { if (i >= 5) break; i++; }",
      shouldError: false,
      rules: ["unicorn/prefer-while-loop-condition"],
    },
    {
      name: "prefer-location-assign: assigning location.href is allowed",
      code: "location.href = 'https://example.com';",
      shouldError: false,
      rules: ["unicorn/prefer-location-assign"],
    },
    {
      name: "max-nested-calls: deeply nested calls such as schema definitions are allowed",
      code: "function a(x: number) { return b(x); } function b(x: number) { return c(x); } function c(x: number) { return d(x); } function d(x: number) { return x; } const result = a(b(c(d(1))));",
      shouldError: false,
      rules: ["unicorn/max-nested-calls"],
    },
    {
      name: "no-global-object-property-assignment: assigning a globalThis property (e.g. test mocks) is allowed",
      code: "globalThis.fetch = (() => Promise.resolve(new Response())) as typeof fetch;",
      shouldError: false,
      rules: ["unicorn/no-global-object-property-assignment"],
    },
    {
      name: "filename-case: with checkDirectories: false, a directory name that is not kebab-case is not an error (allowed)",
      code: "export const a = 1;",
      shouldError: false,
      rules: ["unicorn/filename-case"],
      dir: "notKebabCaseDir",
    },
  ];

  // Create temp files under src/ so they reliably match files: ["**/*.ts"] in the flat config.
  const srcDir = path.join(process.cwd(), "src");
  const tmpDir = path.join(srcDir, "__tmp__cli");
  if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir);
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  // Create each directory named by a test case's dir (under src) so the
  // unicorn/filename-case directory name check can be verified.
  const extraDirs = new Set(
    testCases
      .map((testCase) => testCase.dir)
      .filter((dir) => dir && dir !== "__tmp__cli")
  );
  // Only directories created by this test are removed during cleanup,
  // so an existing src/__tests__ etc. is never deleted by mistake.
  const createdExtraDirs = new Set();
  for (const dir of extraDirs) {
    const dirPath = path.join(srcDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      createdExtraDirs.add(dir);
    }
  }

  const tsconfigPath = path.join(process.cwd(), "tsconfig.json");
  fs.writeFileSync(
    tsconfigPath,
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2020",
          module: "ESNext",
          moduleResolution: "Node",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
        },
        include: ["src/**/*.ts", "src/**/*.tsx"],
      },
      null,
      2
    )
  );

  // Temporarily copy index.mjs to eslint.config.mjs so ESLint picks it up as the flat config
  const flatConfigPath = path.join(process.cwd(), "eslint.config.mjs");
  fs.copyFileSync(path.join(process.cwd(), "index.mjs"), flatConfigPath);

  // Write all temp files first; ESLint is started only once afterwards
  const tmpFilePaths = testCases.map((testCase, i) => {
    const { code, dir } = testCase;
    const kebabName = `test-${i}.ts`;
    const targetDir = dir ? path.join(srcDir, dir) : tmpDir;
    const tmpFilePath = path.join(targetDir, kebabName);
    fs.writeFileSync(tmpFilePath, code);
    return tmpFilePath;
  });

  // Lint all test cases in a single ESLint process.
  // Type-aware typescript-eslint initializes a TypeScript program per process,
  // so one process keeps memory usage low (per-case processes risked OOM).
  const eslintBinPath = path.join(
    process.cwd(),
    "node_modules",
    "eslint",
    "bin",
    "eslint.js"
  );
  let jsonOutput = "";
  try {
    const { stdout } = await execFileAsync(
      process.execPath,
      [
        eslintBinPath,
        "--no-cache",
        "--ext",
        ".ts",
        "--format",
        "json",
        ...tmpFilePaths,
      ],
      { maxBuffer: 1024 * 1024 * 50 }
    );
    jsonOutput = stdout;
  } catch (error) {
    // ESLint exits non-zero when a test case has the expected errors, which is normal here,
    // so treat it as success as long as JSON was written to stdout.
    // If stdout has no JSON (e.g. a config error), the later JSON.parse throws.
    if (error.stdout) {
      jsonOutput = error.stdout;
    } else {
      throw error;
    }
  }

  const eslintResults = JSON.parse(jsonOutput);
  const resultsByFilePath = new Map(
    eslintResults.map((result) => [result.filePath, result])
  );

  const results = testCases.map((testCase, i) => {
    const { name, shouldError, rules } = testCase;
    const tmpFilePath = tmpFilePaths[i];
    const fileResult = resultsByFilePath.get(tmpFilePath);
    if (!fileResult) {
      // If the file is missing from the ESLint results, treating it as "no messages"
      // would pass the case by mistake (0 errors = OK), so fail loudly instead.
      throw new Error(
        `ESLint did not return a result for temp file: ${tmpFilePath}`
      );
    }

    let errorCount = 0;
    const relevantErrors = [];
    const ignoredErrors = [];
    for (const message of fileResult.messages) {
      const severityLabel = message.severity === 2 ? "error" : "warning";
      const line = `  ${message.line}:${message.column}  ${severityLabel}  ${message.message}  ${message.ruleId ?? ""}`;
      if (message.ruleId && rules.includes(message.ruleId)) {
        errorCount = 1;
        relevantErrors.push(line);
      } else {
        ignoredErrors.push(line);
      }
    }

    fs.unlinkSync(tmpFilePath);
    return { name, shouldError, errorCount, relevantErrors, ignoredErrors };
  });
  let pass = 0,
    fail = 0;
  for (const {
    name,
    shouldError,
    errorCount,
    relevantErrors,
    ignoredErrors,
  } of results) {
    if (shouldError ? errorCount > 0 : errorCount === 0) {
      console.log(`✅ ${name}`);
      pass++;
    } else {
      console.error(
        `❌ ${name} (expected: ${shouldError ? "error" : "OK"}, actual: ${
          errorCount > 0 ? "error" : "OK"
        })`
      );
      fail++;
    }
    if (relevantErrors && relevantErrors.length > 0) {
      console.error(`  Errors from the target rules:`);
      relevantErrors.forEach((e) => console.error(`    ${e}`));
    }
    if (ignoredErrors && ignoredErrors.length > 0) {
      console.warn(`  Ignored errors:`);
      ignoredErrors.forEach((e) => console.warn(`    ${e}`));
    }
  }

  fs.unlinkSync(flatConfigPath);
  fs.rmSync(tmpDir, { recursive: true });
  for (const dir of createdExtraDirs) {
    fs.rmSync(path.join(srcDir, dir), { recursive: true });
  }
  fs.unlinkSync(tsconfigPath);
  console.log("\n--- Summary ---");
  console.log(`Passed: ${pass} / Failed: ${fail} / Total: ${testCases.length}`);
}

if (process.env.CI || process.env.TEST_CLI) {
  await main();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
