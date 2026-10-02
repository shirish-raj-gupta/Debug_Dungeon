// Safe In-Browser Simulation & Validation Engine for Debug Dungeon
// Evaluates challenges safely on the frontend without requiring a backend sandbox.

export const CHALLENGE_PROFILES = {
  'syn-01': {
    hasBug: (code) => {
      // Buggy if: single = assignment in if condition OR falsy zero check
      const hasAssignmentInIf = /if\s*\(\s*op\s*=\s*['"]\+['"]\s*\)/.test(code);
      const hasFalsyZeroDrop = /!\s*a\s*\|\|\s*!\s*b/.test(code);
      return hasAssignmentInIf || hasFalsyZeroDrop;
    },
    hasFix: (code) => {
      const fixedEquality = /op\s*===\s*['"]\+['"]/.test(code) || /switch\s*\(\s*op\s*\)/.test(code);
      const fixedZero = !/!\s*a\s*\|\|\s*!\s*b/.test(code);
      return fixedEquality && fixedZero;
    },
    errorMessage: `TypeError / LogicFault: Accidental assignment detected in 'calculateExpression'.
  --> Expression: 'if (op = "+")' assigned '+' to operator variable instead of comparing with (===).
  --> Failing Test: calculateExpression(20, '-', 7) returned 27 instead of expected 13.
  --> Failing Test: calculateExpression(0, '*', 5) returned null because (!a || !b) treated 0 as falsy!`,
    failingTestIndex: 0,
    failingDetails: {
      input: [0, '*', 5],
      expected: 0,
      actual: null,
      reason: 'Falsy check if (!a || !b) evaluated 0 as falsy and prematurely returned null'
    }
  },

  'syn-02': {
    hasBug: (code) => {
      // Buggy if regex lacks global 'g' flag OR leaks undefined
      const regexWithoutG = /\/\\\{(\\\w\+)\\\/([imsuy]*)/.test(code) && !/\/\\\{(\\\w\+)\\\/[imsuy]*g/.test(code);
      const leaksUndefined = /return\s+params\[key\];?\s*\}\);?$/.test(code.trim());
      return regexWithoutG || leaksUndefined;
    },
    hasFix: (code) => {
      const hasGlobal = /\/\\\{(\\\w\+)\\\/[imsuy]*g/.test(code);
      const hasSafeLookup = /hasOwnProperty|in\s+safeParams|val\s*!==\s*undefined|typeof\s+val|params\[key\]\s*\?\?/.test(code);
      return hasGlobal && hasSafeLookup;
    },
    errorMessage: `TemplateInterpolationError: Regular expression lacks global flag 'g'.
  --> Pattern: /\\{(\\w+)\\}/ only matched the first token occurrence in the string.
  --> Failing Test: formatTemplate("Score: {score} / {max} (Score: {score})", { score: 0, max: 100 })
  --> Actual: "Score:  / 100 (Score: {score})"
  --> Reason: Second '{score}' token was never replaced, and numeric 0 was dropped as falsy!`,
    failingTestIndex: 0,
    failingDetails: {
      input: ['Score: {score} / {max} (Score: {score})', { score: 0, max: 100 }],
      expected: 'Score: 0 / 100 (Score: 0)',
      actual: 'Score:  / 100 (Score: {score})',
      reason: 'Missing global /g flag and falsy zero coercion'
    }
  },

  'syn-03': {
    hasBug: (code) => {
      // Buggy if: result = primary (direct mutation), i <= rest.length, or catch (result)
      const mutatesPrimary = /result\s*=\s*primary\b/.test(code);
      const offByOne = /i\s*<=\s*rest\.length/.test(code);
      const variableShadowing = /catch\s*\(\s*result\s*\)/.test(code);
      return mutatesPrimary || offByOne || variableShadowing;
    },
    hasFix: (code) => {
      const clonesPrimary = /\{\s*\.\.\.primary\s*\}|Object\.assign\(\s*\{\s*\}\s*,\s*primary\)/.test(code);
      const safeLoop = /i\s*<\s*rest\.length/.test(code) || /for\s*\(\s*(?:const|let)\s+\w+\s+of\s+rest\)/.test(code);
      const guardsObjects = /typeof\s+\w+\s*===\s*['"]object['"]/.test(code);
      return clonesPrimary && safeLoop && guardsObjects;
    },
    errorMessage: `ReferenceError / ObjectMutationViolation:
  --> In-place mutation: 'result = primary' mutated the caller's primary input reference directly.
  --> Off-by-one index: Loop accessed 'rest[rest.length]' (undefined), triggering TypeError when reading keys.
  --> Catch block shadowed variable 'result', suppressing diagnostic telemetry.`,
    failingTestIndex: 1,
    failingDetails: {
      input: [{ host: 'localhost' }, null, 'invalid_arg'],
      expected: { host: 'localhost' },
      actual: 'TypeError: Cannot read properties of null',
      reason: 'Off-by-one array index access and unvalidated null argument'
    }
  },

  'react-01': {
    hasBug: (code) => {
      const directPush = /\.items\.push\(/.test(code);
      const inPlaceQty = /existing\.qty\s*\+=/.test(code);
      return directPush || inPlaceQty;
    },
    hasFix: (code) => {
      const usesSpreadOrConcat = /\[\s*\.\.\.currentItems|\.concat\(|\[\s*\.\.\.state\.items/.test(code);
      const usesMapForUpdate = /\.map\(/.test(code);
      const avoidsPush = !/\.items\.push\(/.test(code);
      return (usesSpreadOrConcat || usesMapForUpdate) && avoidsPush;
    },
    errorMessage: `Invariant Violation (React State Immutability):
  --> In-place array mutation detected in 'cartReducer':
      state.items.push(action.payload);
  --> React Reference Check: prevState.items === nextState.items (TRUE).
  --> Consequence: React skips component re-renders because array memory reference was not updated!`,
    failingTestIndex: 0,
    failingDetails: {
      input: [{ items: [] }, { type: 'ADD_ITEM', payload: { id: 'p1', qty: 2 } }],
      expected: 'New array reference with added item',
      actual: 'Same array reference (shallow equality prevented re-render)',
      reason: 'Direct in-place array mutation with Array.prototype.push'
    }
  },

  'react-02': {
    hasBug: (code) => {
      return /setCount\s*\(\s*count\s*\+\s*1\s*\)/.test(code) || /setTimer\s*\(\s*timer\s*\+\s*1\s*\)/.test(code);
    },
    hasFix: (code) => {
      return /set(?:Count|Timer)\s*\(\s*(?:prev|current|c)\s*=>/.test(code);
    },
    errorMessage: `StaleClosureDesync: Captured stale state inside async interval closure.
  --> setCount(count + 1) read initial count '0' across all batched timer ticks.
  --> Expected count after 3 ticks: 3
  --> Actual count: 1
  --> Solution: Use functional state updater: setCount(prev => prev + 1).`,
    failingTestIndex: 0,
    failingDetails: {
      input: ['3 rapid interval ticks'],
      expected: 3,
      actual: 1,
      reason: 'Stale state variable in closure without functional updater'
    }
  },

  'react-03': {
    hasBug: (code) => {
      // Overwrites nested object without spreading
      const directNestedMutation = /user\.profile\.\w+\s*=/.test(code);
      const shallowWipe = /profile:\s*\{\s*\w+:\s*action\.payload/.test(code) && !/\.\.\.user\.profile/.test(code);
      return directNestedMutation || shallowWipe;
    },
    hasFix: (code) => {
      return /\.\.\.user\.profile|\.\.\.state\.profile|\.\.\.user\.settings/.test(code);
    },
    errorMessage: `NestedStateLossError: Shallow spread wiped out nested properties!
  --> Updating user.settings.theme without spreading '...user.settings' deleted 'notifications' and 'privacy' keys.
  --> Expected: { theme: 'dark', notifications: true, sound: false }
  --> Received: { theme: 'dark' }`,
    failingTestIndex: 0,
    failingDetails: {
      input: [{ id: 1, settings: { theme: 'light', sound: true } }, { theme: 'dark' }],
      expected: { id: 1, settings: { theme: 'dark', sound: true } },
      actual: { id: 1, settings: { theme: 'dark' } },
      reason: 'Nested state object overwritten without nested spread operator'
    }
  },

  'async-01': {
    hasBug: (code) => {
      return /\.forEach\s*\(\s*async/.test(code);
    },
    hasFix: (code) => {
      const usesPromiseAll = /Promise\.all\s*\(\s*\w+\.map/.test(code);
      const usesForOf = /for\s*\(\s*(?:const|let)\s+\w+\s+of\s+\w+\)/.test(code) && /await/.test(code);
      return (usesPromiseAll || usesForOf) && !/\.forEach\s*\(\s*async/.test(code);
    },
    errorMessage: `AsyncWaitError: 'Array.prototype.forEach' is NOT promise-aware!
  --> In 'fetchAllUsers': items.forEach(async (id) => await fetchUser(id));
  --> forEach executes synchronously and ignores returned promises.
  --> fetchAllUsers resolved with empty array [] before any HTTP requests completed!`,
    failingTestIndex: 0,
    failingDetails: {
      input: [[1, 2, 3]],
      expected: [{ id: 1 }, { id: 2 }, { id: 3 }],
      actual: [],
      reason: 'Array.prototype.forEach dropped promises without awaiting resolution'
    }
  },

  'async-02': {
    hasBug: (code) => {
      const hasTokenGuard = /requestId\s*===|currentRequestId|abortController|cancelled/.test(code);
      return !hasTokenGuard;
    },
    hasFix: (code) => {
      return /requestId\s*===|currentRequestId|signal\.aborted|activeQuery/.test(code);
    },
    errorMessage: `RaceConditionViolation: Out-of-order network response overwrote latest state.
  --> Query "react" sent at t=0ms (delayed 300ms)
  --> Query "vue" sent at t=100ms (resolved in 50ms)
  --> Response for "react" arrived later and overwrote "vue" results on the screen!`,
    failingTestIndex: 0,
    failingDetails: {
      input: ['Search query sequence "react" then "vue"'],
      expected: 'Render results for "vue"',
      actual: 'Render results for "react" (stale query)',
      reason: 'Unsynchronized async response race condition'
    }
  },

  'async-03': {
    hasBug: (code) => {
      const usesRawPromiseAll = /Promise\.all\s*\(\s*\w+\s*\)/.test(code);
      const lacksAllSettledOrCatch = !/Promise\.allSettled/.test(code) && !/\.catch\(/.test(code);
      return usesRawPromiseAll && lacksAllSettledOrCatch;
    },
    hasFix: (code) => {
      return /Promise\.allSettled/.test(code) || (/\.catch\(/.test(code) && /Promise\.all/.test(code));
    },
    errorMessage: `UnhandledRejectionMeltdown: 'Promise.all' short-circuited on single service failure!
  --> Microservice 'billing-svc' rejected with HTTP 503.
  --> Promise.all immediately aborted, discarding healthy data from 'auth-svc' and 'analytics-svc'.`,
    failingTestIndex: 0,
    failingDetails: {
      input: [['auth-svc', 'billing-svc', 'analytics-svc']],
      expected: { succeeded: ['auth-svc', 'analytics-svc'], failed: ['billing-svc'] },
      actual: 'Uncaught (in promise) Error: Service 503',
      reason: 'Promise.all failed fast instead of using Promise.allSettled or error handlers'
    }
  },

  'api-01': {
    hasBug: (code) => {
      const checksOk = /res\.ok\b|res\.status\b/.test(code);
      return !checksOk;
    },
    hasFix: (code) => {
      return /if\s*\(\s*!res\.ok\s*\)|res\.status\s*<\s*400|if\s*\(\s*res\.ok\s*\)/.test(code);
    },
    errorMessage: `HTTP 500 DeserializationError:
  --> Endpoint returned 500 Internal Server Error (HTML error document).
  --> res.json() attempted to parse HTML as JSON, throwing:
      SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
  --> Missing HTTP guard: 'if (!res.ok) throw new Error(...)' was omitted!`,
    failingTestIndex: 0,
    failingDetails: {
      input: ['/api/user/99 -> HTTP 500 Internal Server Error'],
      expected: 'Error: Request failed with status 500',
      actual: 'SyntaxError: Unexpected token < in JSON at position 0',
      reason: 'Failed to verify response.ok before executing response.json()'
    }
  },

  'api-02': {
    hasBug: (code) => {
      const retries4xx = !/status\s*>=\s*500|status\s*!==\s*401|!\s*unrecoverable/.test(code);
      const lacksExponentialDelay = !/Math\.pow\s*\(\s*2|\*\s*2|\*\s*Math\.pow/.test(code);
      return retries4xx || lacksExponentialDelay;
    },
    hasFix: (code) => {
      const guardsStatus = /status\s*>=\s*500|status\s*!==\s*401|res\.status\s*<\s*500/.test(code);
      const hasBackoff = /Math\.pow\s*\(\s*2|\bdelay\s*\*\s*2|\b2\s*\*\*/.test(code);
      return guardsStatus && hasBackoff;
    },
    errorMessage: `ThrottlingCascade / InfiniteRetryTrap:
  --> Retried unrecoverable HTTP 401 Unauthorized status 5 times.
  --> Delay did not exponentially backoff (0ms constant delay caused traffic flood).
  --> Server IP firewall banned client for API flood!`,
    failingTestIndex: 0,
    failingDetails: {
      input: ['Request failed with 401 Unauthorized'],
      expected: 'Abort retries immediately on non-retryable 4xx error',
      actual: 'Retried 5 times in 10ms with 0s backoff',
      reason: 'Missing retry status filter and exponential backoff multiplier'
    }
  },

  'api-03': {
    hasBug: (code) => {
      const usesRawConcat = /\?\s*['"]\s*\+\s*key|\+\s*['"]&['"]\s*\+/.test(code);
      const lacksEncoder = !/URLSearchParams|encodeURIComponent/.test(code);
      return usesRawConcat || lacksEncoder;
    },
    hasFix: (code) => {
      return /URLSearchParams|encodeURIComponent/.test(code);
    },
    errorMessage: `MalformedURIError / QueryInjectionAnomaly:
  --> Query string generated: "/search?q=rock & roll&filter=audio"
  --> Character '&' in search string broke parser into unintended key 'roll'.
  --> Use 'new URLSearchParams(params)' or 'encodeURIComponent()' to sanitize!`,
    failingTestIndex: 0,
    failingDetails: {
      input: [{ q: 'rock & roll', filter: 'audio' }],
      expected: '/search?q=rock+%26+roll&filter=audio',
      actual: '/search?q=rock & roll&filter=audio',
      reason: 'Raw string concatenation without URI encoding'
    }
  },

  'prod-01': {
    hasBug: (code) => {
      const lacksEviction = !/cache\.delete|\.shift\(|cache\.clear|delete\s+cache\[/.test(code);
      const lacksSizeCheck = !/cache\.size|cache\.length|MAX_CACHE|limit/.test(code);
      return lacksEviction || lacksSizeCheck;
    },
    hasFix: (code) => {
      return (/cache\.delete|\.shift\(|delete\s+cache\[/.test(code)) && (/size\s*>=?|length\s*>=?|limit/.test(code));
    },
    errorMessage: `FATAL ERROR: JavaScript heap out of memory.
  --> In-memory telemetry cache grew past 150,000 entries.
  --> Allocation failed - process memory exceeded container quota (2048 MB).
  --> Root Cause: Cache lacked capacity bounding and LRU/FIFO key eviction.`,
    failingTestIndex: 0,
    failingDetails: {
      input: ['100,000 continuous write operations to cache'],
      expected: 'Cache size capped at MAX_ENTRIES (100) with oldest keys evicted',
      actual: 'Memory footprint: 2.1 GB (Heap overflow)',
      reason: 'Unbounded memory cache leak without eviction policy'
    }
  },

  'prod-02': {
    hasBug: (code) => {
      const naiveDate = /new\s+Date\s*\(\s*dateStr(?:ing)?\s*\)/.test(code);
      const lacksSplitOrTimezone = !/split\s*\(\s*['"]-['"]\s*\)|getTimezoneOffset|getUTCDate/.test(code);
      return naiveDate && lacksSplitOrTimezone;
    },
    hasFix: (code) => {
      return /split\s*\(\s*['"]-['"]\s*\)|getTimezoneOffset|getUTCDate|Intl\.DateTimeFormat/.test(code);
    },
    errorMessage: `TemporalBoundaryShift / TimezoneMidnightError:
  --> Input ISO Date: "2024-05-15" parsed as UTC midnight (00:00:00Z).
  --> In America/New_York (UTC-4), Date displayed as: "May 14, 2024, 8:00 PM"!
  --> Solution: Construct Date with local year, month, day components or split('-').`,
    failingTestIndex: 0,
    failingDetails: {
      input: ['2024-05-15 in Western Timezone (UTC-4)'],
      expected: 'May 15, 2024',
      actual: 'May 14, 2024',
      reason: 'UTC midnight string parsing converted to previous calendar day in negative timezone offset'
    }
  },

  'prod-03': {
    hasBug: (code) => {
      const nakedStringify = /JSON\.stringify\s*\(\s*(?:node|tree|graph|root)\s*\)/.test(code);
      const lacksCycleDetector = !/WeakSet|seen|visited|WeakMap/.test(code);
      return nakedStringify && lacksCycleDetector;
    },
    hasFix: (code) => {
      return /WeakSet|seen|visited|WeakMap/.test(code) && /JSON\.stringify/.test(code);
    },
    errorMessage: `TypeError: Converting circular structure to JSON
  --> Starting at object with constructor 'TreeNode'
  |     property 'children' -> Array
  |     index 0 -> object with constructor 'TreeNode'
  --- property 'parent' closes the reference circle!
  --> Standard JSON.stringify crashes on self-referential graph nodes.`,
    failingTestIndex: 0,
    failingDetails: {
      input: ['Circular tree node where node.children[0].parent === node'],
      expected: 'Serialized JSON string with circular references pruned or normalized',
      actual: 'TypeError: Converting circular structure to JSON',
      reason: 'Unchecked cyclic object serialization'
    }
  },

  'boss-sev0': {
    hasBug: (code) => {
      const hasAsyncForEach = /forEach\s*\(\s*async/.test(code);
      const hasDirectMutation = /clusterState\.activeNodes\.push/.test(code);
      const hasLeakyListener = /eventBus\.on\s*\(/.test(code);
      const unhandledRejection = /await\s+clusterState\.gateway\.charge/.test(code) && !/try\s*\{[\s\S]*?charge[\s\S]*?\}\s*catch/.test(code);
      return hasAsyncForEach || hasDirectMutation || hasLeakyListener || unhandledRejection;
    },
    hasFix: (code) => {
      const hasLoop = /for\s*\(\s*const\s+\w+\s+of|for\s*\(let\s+i|Promise\.allSettled|Promise\.all/.test(code);
      const hasTryCatch = /try\s*\{[\s\S]*?charge[\s\S]*?\}\s*catch|catch\s*\(err\)/.test(code);
      const hasCloning = /\{[\s\S]*?\.\.\.clusterState[\s\S]*?\}/.test(code) || /activeNodes:\s*\[[\s\S]*?\.\.\./.test(code);
      const noLeakyListener = !/eventBus\.on\s*\(\s*['"]heartbeat['"]/.test(code);
      return hasLoop && hasTryCatch && hasCloning && noLeakyListener;
    },
    errorMessage: `🚨 CRITICAL SEV-0 INCIDENT // CLUSTER COLLAPSE DUMP:
  [ERROR 1] UnhandledPromiseRejection: Gateway timeout on tx_fail caused unhandled promise rejection in forEach loop! Process terminated.
  [ERROR 2] InvariantViolation: Concurrent mutation of clusterState.activeNodes corrupted shared memory pool across 4 worker threads.
  [ERROR 3] FatalError: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory (3980MB/4096MB) due to uncleaned event listeners.`,
    failingTestIndex: 0,
    failingDetails: {
      input: ['Transaction batch with failed webhook [tx_fail] and shared clusterState'],
      expected: 'Graceful batch processing with failed transactions recorded, immutable state, and zero heap leak',
      actual: 'UnhandledPromiseRejection + InvariantViolation (Memory Heap Exhaustion 99.8%)',
      reason: 'Multiple combined faults: unhandled async rejection, state reference mutation, and event loop listener leak'
    }
  }
};

/**
 * Normalizes code by stripping comments and extraneous whitespace for similarity comparison.
 */
function normalizeCode(str) {
  if (!str) return '';
  return str
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Safely simulates the execution of code for a challenge.
 * Returns realistic execution logs, test probe results, and exit status.
 */
export function simulateChallengeExecution(challenge, userCode) {
  const profile = CHALLENGE_PROFILES[challenge.id];
  const testCases = challenge.testCases || [];
  const totalCount = testCases.length;
  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // 1. Basic JS syntax validation (checks for unmatched braces, syntax errors without running)
  try {
    // Only compile the code syntax, do not execute
    new Function(userCode);
  } catch (err) {
    const errorMsg = `SyntaxError: ${err.message}`;
    return {
      success: false,
      exitCode: 1,
      logs: [
        { type: 'system', text: `> Compiling patch_${challenge.id}.js [V8 JavaScript Engine]`, time: now() },
        { type: 'stderr', text: `✖ FATAL: Syntax compilation failed!`, time: now() },
        { type: 'stderr', text: errorMsg, time: now() },
        { type: 'system', text: `[EXIT 1] Process terminated with syntax error`, time: now() }
      ],
      testResults: {
        success: false,
        syntaxError: errorMsg,
        passedCount: 0,
        totalCount,
        durationMs: 0.5,
        tests: testCases.map(t => ({
          id: t.id,
          description: t.description,
          inputStr: t.inputs ? JSON.stringify(t.inputs) : '',
          expectedStr: JSON.stringify(t.expected),
          actualStr: 'N/A (Syntax Error)',
          passed: false,
          error: errorMsg
        }))
      }
    };
  }

  // 2. Exact or near-exact match with correct solution
  const normalizedUser = normalizeCode(userCode);
  const normalizedSolution = normalizeCode(challenge.solution);
  const isExactSolution = normalizedUser === normalizedSolution || normalizedUser.includes(normalizedSolution);

  // 3. Profile-based bug and fix detection
  let isBuggy = false;
  let isFixed = false;

  if (profile) {
    isBuggy = profile.hasBug(userCode);
    isFixed = profile.hasFix(userCode);
  }

  // Determine final success:
  // If exact solution, it passes!
  // If hasFix and not isBuggy, it passes!
  // Otherwise it fails with realistic simulation!
  const isSuccess = isExactSolution || (isFixed && !isBuggy);

  if (isSuccess) {
    // SUCCESSFUL SIMULATION
    const tests = testCases.map((t, idx) => ({
      id: t.id,
      description: t.description,
      inputStr: t.inputs ? JSON.stringify(t.inputs) : '',
      expectedStr: JSON.stringify(t.expected),
      actualStr: JSON.stringify(t.expected),
      passed: true,
      durationMs: Math.round((0.4 + idx * 0.3) * 10) / 10
    }));

    const totalDuration = Math.round((1.2 + totalCount * 0.5) * 10) / 10;

    const logs = [
      { type: 'system', text: `> Executing patch_${challenge.id}.js [Node v20.11 Simulated Runtime]`, time: now() },
      { type: 'stdout', text: `[SANDBOX] Initializing isolated scope for '${challenge.functionName}'...`, time: now() },
      ...tests.map((t, i) => ({
        type: 'pass',
        text: `✔ Probe #${i + 1} PASSED: ${t.description} (${t.durationMs}ms)`,
        time: now()
      })),
      { type: 'stdout', text: `[STDOUT] All ${totalCount} diagnostic probes verified. Zero regressions detected.`, time: now() },
      { type: 'system', text: `[EXIT 0] Execution completed successfully in ${totalDuration}ms. Memory heap stable.`, time: now() }
    ];

    return {
      success: true,
      exitCode: 0,
      logs,
      testResults: {
        success: true,
        passedCount: totalCount,
        totalCount,
        durationMs: totalDuration,
        tests
      }
    };
  } else {
    // REALISTIC BUGGY SIMULATION
    const failingIdx = profile ? profile.failingTestIndex : 0;
    const failingDetails = profile ? profile.failingDetails : {
      expected: 'Defined value',
      actual: 'Undefined / Anomaly',
      reason: 'Logic bug detected in implementation'
    };

    const tests = testCases.map((t, idx) => {
      const isFailing = idx === failingIdx || idx === failingIdx + 1;
      return {
        id: t.id,
        description: t.description,
        inputStr: t.inputs ? JSON.stringify(t.inputs) : '',
        expectedStr: JSON.stringify(t.expected),
        actualStr: isFailing ? JSON.stringify(failingDetails.actual) : JSON.stringify(t.expected),
        passed: !isFailing,
        durationMs: Math.round((0.5 + idx * 0.2) * 10) / 10,
        error: isFailing ? failingDetails.reason : undefined
      };
    });

    const passedCount = tests.filter(t => t.passed).length;
    const errorExplanation = profile ? profile.errorMessage : `AssertionError: Anomaly detected during execution of ${challenge.functionName}`;

    const logs = [
      { type: 'system', text: `> Executing patch_${challenge.id}.js [Node v20.11 Simulated Runtime]`, time: now() },
      { type: 'stdout', text: `[SANDBOX] Initializing isolated scope for '${challenge.functionName}'...`, time: now() },
      ...tests.map((t, i) => ({
        type: t.passed ? 'pass' : 'fail',
        text: t.passed
          ? `✔ Probe #${i + 1} PASSED: ${t.description}`
          : `✖ Probe #${i + 1} FAILED: ${t.description}`,
        time: now()
      })),
      { type: 'stderr', text: `\n[STDERR] Runtime Anomaly Detected:\n${errorExplanation}`, time: now() },
      { type: 'system', text: `[EXIT 1] Process halted with ${totalCount - passedCount} failed assertion(s).`, time: now() }
    ];

    return {
      success: false,
      exitCode: 1,
      logs,
      testResults: {
        success: false,
        runtimeError: errorExplanation,
        passedCount,
        totalCount,
        durationMs: 2.4,
        tests
      }
    };
  }
}

/**
 * Validates a submitted fix against expected solution logic.
 */
export function validateChallengeSolution(challenge, userCode) {
  const result = simulateChallengeExecution(challenge, userCode);
  return {
    valid: result.success,
    message: result.success
      ? `Victory! Bug successfully purged in ${challenge.title}.`
      : `Submission rejected: Anomaly still detected in ${challenge.title}.`,
    simulation: result
  };
}
