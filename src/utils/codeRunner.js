// Safe In-Browser JavaScript Code Runner & Test Suite Evaluator

export function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

export function formatValue(val) {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`;
  if (typeof val === 'symbol') return val.toString();
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

/**
 * Executes user code against test cases with captured logs and timeout protection.
 * @param {string} userCode The JS code authored by the user
 * @param {string} functionName The name of the function to invoke
 * @param {Array} testCases Array of { id, description, inputs, expected, async }
 */
export async function runChallengeTests(userCode, functionName, testCases) {
  const logs = [];
  const captureLog = (type, args) => {
    const message = args.map(arg => (typeof arg === 'object' ? formatValue(arg) : String(arg))).join(' ');
    logs.push({ type, message, timestamp: new Date().toLocaleTimeString() });
  };

  // Build sandboxed context
  let fn;
  try {
    // Intercept console inside function
    const wrappedCode = `
      "use strict";
      const __logs = [];
      const console = {
        log: (...args) => __logs.push({ type: 'log', args }),
        info: (...args) => __logs.push({ type: 'info', args }),
        warn: (...args) => __logs.push({ type: 'warn', args }),
        error: (...args) => __logs.push({ type: 'error', args })
      };

      ${userCode};

      if (typeof ${functionName} === 'undefined') {
        throw new ReferenceError("Function '${functionName}' is not defined. Ensure you kept the function name intact.");
      }
      return { fn: ${functionName}, getLogs: () => __logs };
    `;

    // Construct runner
    const evaluator = new Function(wrappedCode);
    const evaluationResult = evaluator();
    fn = evaluationResult.fn;

    // Collect any immediate evaluation logs
    const initLogs = evaluationResult.getLogs();
    for (const item of initLogs) {
      captureLog(item.type, item.args);
    }
  } catch (err) {
    return {
      success: false,
      syntaxError: err.message,
      logs: [{ type: 'error', message: `Compilation Error: ${err.message}`, timestamp: new Date().toLocaleTimeString() }],
      tests: testCases.map(t => ({
        id: t.id,
        description: t.description,
        inputStr: t.inputs ? t.inputs.map(formatValue).join(', ') : '',
        expectedStr: formatValue(t.expected),
        actualStr: 'N/A',
        passed: false,
        error: 'Compilation failed'
      }))
    };
  }

  const testResults = [];
  let allPassed = true;

  for (const test of testCases) {
    const startTime = performance.now();
    let passed = false;
    let actualVal = undefined;
    let testError = null;

    try {
      // Deep clone inputs to avoid tests polluting each other
      const inputs = JSON.parse(JSON.stringify(test.inputs || []));

      // Execution with timeout
      const executeWithTimeout = async () => {
        let timer;
        const timeoutPromise = new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error('Execution timed out (> 2000ms). Possible infinite loop.')), 2000);
        });

        try {
          const runPromise = Promise.resolve().then(() => fn(...inputs));
          const res = await Promise.race([runPromise, timeoutPromise]);
          clearTimeout(timer);
          return res;
        } catch (e) {
          clearTimeout(timer);
          throw e;
        }
      };

      actualVal = await executeWithTimeout();

      if (test.customValidator && typeof test.customValidator === 'function') {
        passed = test.customValidator(actualVal, test.expected);
      } else {
        passed = deepEqual(actualVal, test.expected);
      }
    } catch (err) {
      testError = err.message || String(err);
      passed = false;
      captureLog('error', [`Test "${test.description}" threw:`, err.message]);
    }

    const durationMs = Math.round((performance.now() - startTime) * 100) / 100;
    if (!passed) allPassed = false;

    testResults.push({
      id: test.id,
      description: test.description,
      inputStr: test.inputs ? test.inputs.map(formatValue).join(', ') : '',
      expectedStr: formatValue(test.expected),
      actualStr: testError ? `Error: ${testError}` : formatValue(actualVal),
      passed,
      error: testError,
      durationMs
    });
  }

  return {
    success: allPassed,
    tests: testResults,
    logs,
    passedCount: testResults.filter(t => t.passed).length,
    totalCount: testResults.length
  };
}
