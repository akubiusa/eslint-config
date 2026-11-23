import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eslint-config-harness-"));
try {
  const source = fs.readFileSync("test.mjs", "utf8");
  const fixtures = [
    'code: "await Promise.resolve(1);"',
    'code: "console.log(a); const a = 1;"',
  ];
  let mutated = source;
  for (const fixture of fixtures) {
    assert.ok(mutated.includes(fixture));
    mutated = mutated.replace(fixture, 'code: "export const = ;"');
  }
  fs.writeFileSync(path.join(directory, "test.mjs"), mutated);
  fs.copyFileSync("index.mjs", path.join(directory, "index.mjs"));
  fs.symlinkSync(path.resolve("node_modules"), path.join(directory, "node_modules"), "dir");

  const result = spawnSync(process.execPath, ["--experimental-vm-modules", "test.mjs"], {
    cwd: directory,
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
  });
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /❌ prefer-top-level-await: top-level await is allowed .*actual: fatal error/);
  assert.match(result.stderr, /❌ no-use-before-define: using a variable before its definition is an error .*actual: fatal error/);
  assert.match(result.stderr, /Parsing error/);
  assert.match(result.stdout, /Failed: 2\b/);
  console.log("✅ malformed fixtures fail for allowed and disallowed cases");
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
