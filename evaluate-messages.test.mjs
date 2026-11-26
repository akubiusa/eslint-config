// Unit tests for evaluateMessages: a fatal diagnostic must fail a case whatever shouldError is.
import assert from "node:assert/strict";
import { evaluateMessages } from "./evaluate-messages.mjs";

const rules = ["unicorn/some-rule"];
const parseError = { line: 1, column: 8, severity: 2, message: "Parsing error", ruleId: null, fatal: true };
const ruleError = { line: 1, column: 1, severity: 2, message: "bad", ruleId: "unicorn/some-rule" };
const otherError = { line: 1, column: 1, severity: 2, message: "other", ruleId: "no-var" };

const cases = [
  ["clean file, shouldError false", [], false, true],
  ["clean file, shouldError true", [], true, false],
  ["target rule error, shouldError true", [ruleError], true, true],
  ["target rule error, shouldError false", [ruleError], false, false],
  ["other rule error only, shouldError false", [otherError], false, true],
  ["fatal only, shouldError false", [parseError], false, false],
  ["fatal only, shouldError true", [parseError], true, false],
  ["fatal plus target rule error, shouldError true", [parseError, ruleError], true, false],
  ["rule-less error without fatal flag, shouldError false", [{ ...parseError, fatal: false }], false, false],
  ["rule-less warning is ignored, shouldError false", [{ ...parseError, fatal: false, severity: 1 }], false, true],
];
for (const [name, messages, shouldError, expected] of cases) {
  const result = evaluateMessages(messages, rules, shouldError);
  assert.equal(result.passed, expected, name);
}
assert.equal(evaluateMessages([parseError], rules, false).fatalErrors.length, 1);
console.log(`✅ evaluateMessages: ${cases.length} cases`);
