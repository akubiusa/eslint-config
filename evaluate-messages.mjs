/**
 * Classifies the ESLint messages of one fixture file and decides whether the case passes.
 * A fatal message (parse error) or a rule-less error never counts as a rule result,
 * so a malformed fixture cannot pass a `shouldError: false` case or satisfy `shouldError: true`.
 * @param {Array<{line: number, column: number, severity: number, message: string, ruleId?: string | null, fatal?: boolean}>} messages ESLint messages for the file.
 * @param {string[]} rules Rule IDs the case targets.
 * @param {boolean} shouldError Whether the case expects an error from the target rules.
 * @returns {{passed: boolean, errorCount: number, relevantErrors: string[], ignoredErrors: string[], fatalErrors: string[]}} The classified messages and the verdict.
 */
export function evaluateMessages(messages, rules, shouldError) {
  let errorCount = 0;
  const relevantErrors = [];
  const ignoredErrors = [];
  const fatalErrors = [];
  for (const message of messages) {
    const severityLabel = message.severity === 2 ? "error" : "warning";
    const line = `  ${message.line}:${message.column}  ${severityLabel}  ${message.message}  ${message.ruleId ?? ""}`;
    if (message.fatal || (!message.ruleId && message.severity === 2)) {
      fatalErrors.push(line);
    } else if (message.ruleId && rules.includes(message.ruleId)) {
      errorCount = 1;
      relevantErrors.push(line);
    } else {
      ignoredErrors.push(line);
    }
  }
  const passed =
    fatalErrors.length === 0 && (shouldError ? errorCount > 0 : errorCount === 0);
  return { passed, errorCount, relevantErrors, ignoredErrors, fatalErrors };
}
