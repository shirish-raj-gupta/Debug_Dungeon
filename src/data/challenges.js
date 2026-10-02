// Local Challenge Database: 15 Gamified Debugging Challenges across 5 Categories

export const CATEGORIES = [
  { id: 'syntax', name: 'Syntax error', stageName: 'Syntax Script', icon: '👾', accent: 'cyan' },
  { id: 'react', name: 'React state bugs', stageName: 'State Cave', icon: '🐉', accent: 'purple' },
  { id: 'async', name: 'Async JavaScript bugs', stageName: 'Async Abyss', icon: '⏳', accent: 'amber' },
  { id: 'api', name: 'API bugs', stageName: 'API Fortress', icon: '🏰', accent: 'rose' },
  { id: 'prod', name: 'Production bugs', stageName: 'Production Boss', icon: '👑', accent: 'crimson' },
];

export const CHALLENGES = [
  // ==========================================
  // CATEGORY 1: Syntax error (Syntax Script)
  // ==========================================
  {
    id: 'syn-01',
    title: 'The Rogue Assignment Operator',
    category: 'Syntax error',
    stageName: 'Syntax Script',
    difficulty: 'Beginner',
    difficultyColor: 'cyan',
    xpReward: 150,
    unlockedByDefault: true,
    requiresChallengeId: null,
    bossName: 'Lexical Gremlin',
    bossAvatar: '👾',
    description: 'A critical mathematical token parser is failing because an accidental single equals (=) was written inside a conditional check instead of strict equality (===), causing every operator to become "+" and ignoring zero values due to loose truthiness checks.',
    expectedBehavior: 'calculateExpression(a, op, b) should accurately perform arithmetic for +, -, *, and / without mutating op. It must correctly compute 0 values (e.g. 0 * 5 = 0) and handle division by zero by returning null.',
    hint: 'Check line 5 for accidental assignment (op = "+") and verify that number inputs are validated against NaN and null rather than truthiness (0 is falsy in JS!).',
    buggyCode: `// CATEGORY: Syntax error | CHALLENGE 1
// BUG: Accidental assignment (= instead of ===) and falsy zero traps
function calculateExpression(a, op, b) {
  // BUGGY: Accidental assignment (=) reassigns op to '+' every time!
  if (op = '+') {
    return a + b;
  } else if (op === '-') {
    return a - b;
  } else if (op === '*') {
    // BUGGY: Falsy check fails when a or b is 0!
    if (!a || !b) return null;
    return a * b;
  } else if (op === '/') {
    if (b === 0) return null;
    return a / b;
  }
  return null;
}`,
    solution: `function calculateExpression(a, op, b) {
  if (typeof a !== 'number' || typeof b !== 'number' || Number.isNaN(a) || Number.isNaN(b)) {
    return null;
  }
  if (op === '+') {
    return a + b;
  } else if (op === '-') {
    return a - b;
  } else if (op === '*') {
    return a * b;
  } else if (op === '/') {
    return b === 0 ? null : a / b;
  }
  return null;
}`,
    functionName: 'calculateExpression',
    testCases: [
      {
        id: 'syn1-1',
        description: 'Multiplication with zero: 0 * 5 should equal 0',
        inputs: [0, '*', 5],
        expected: 0
      },
      {
        id: 'syn1-2',
        description: 'Subtraction: 20 - 7 should equal 13 (not 27)',
        inputs: [20, '-', 7],
        expected: 13
      },
      {
        id: 'syn1-3',
        description: 'Division by zero: 10 / 0 should return null',
        inputs: [10, '/', 0],
        expected: null
      },
      {
        id: 'syn1-4',
        description: 'Standard addition: 15 + 25 should equal 40',
        inputs: [15, '+', 25],
        expected: 40
      }
    ]
  },
  {
    id: 'syn-02',
    title: 'Template Token Escaping Trap',
    category: 'Syntax error',
    stageName: 'Syntax Script',
    difficulty: 'Intermediate',
    difficultyColor: 'cyan',
    xpReward: 200,
    unlockedByDefault: false,
    requiresChallengeId: 'syn-01',
    bossName: 'Token Specter',
    bossAvatar: '👻',
    description: 'A message formatter interpolating parameters into text templates crashes when params contain undefined keys, and faulty regex replacement corrupts tokens with dollar signs ($) or numeric zeros.',
    expectedBehavior: 'formatTemplate(template, params) should replace all occurrences of {key} with the corresponding params[key]. Missing keys must be replaced with an empty string "", and 0 or false must be preserved as "0" or "false".',
    hint: 'Use String.prototype.replace with a regex /\\{(\\w+)\\}/g. Check if key in params using Object.prototype.hasOwnProperty or optional nullish coalescing to prevent undefined leakage.',
    buggyCode: `// CATEGORY: Syntax error | CHALLENGE 2
// BUG: Regex replacement leaks undefined and drops falsy 0 values
function formatTemplate(template, params) {
  if (!template) return '';
  
  // BUGGY: Ignores multiple occurrences of same token and converts 0 to empty
  return template.replace(/\\{(\\w+)\\}/, function(match, key) {
    if (params[key]) {
      return params[key];
    }
    // BUGGY: Leaks "undefined" string if key is not found
    return params[key];
  });
}`,
    solution: `function formatTemplate(template, params) {
  if (typeof template !== 'string') return '';
  const safeParams = params && typeof params === 'object' ? params : {};

  return template.replace(/\\{(\\w+)\\}/g, function(_, key) {
    if (Object.prototype.hasOwnProperty.call(safeParams, key)) {
      const val = safeParams[key];
      return val !== null && val !== undefined ? String(val) : '';
    }
    return '';
  });
}`,
    functionName: 'formatTemplate',
    testCases: [
      {
        id: 'syn2-1',
        description: 'Interpolate multiple duplicate tokens with 0 value',
        inputs: ['Score: {score} / {max} (Score: {score})', { score: 0, max: 100 }],
        expected: 'Score: 0 / 100 (Score: 0)'
      },
      {
        id: 'syn2-2',
        description: 'Handle missing keys gracefully with empty string',
        inputs: ['Hello {name}, your role is {role}', { name: 'Ada' }],
        expected: 'Hello Ada, your role is '
      },
      {
        id: 'syn2-3',
        description: 'Boolean values: active={isActive}',
        inputs: ['Status: {isActive}', { isActive: false }],
        expected: 'Status: false'
      }
    ]
  },
  {
    id: 'syn-03',
    title: 'Rest Parameter Shadowing Catastrophe',
    category: 'Syntax error',
    stageName: 'Syntax Script',
    difficulty: 'Hard',
    difficultyColor: 'cyan',
    xpReward: 260,
    unlockedByDefault: false,
    requiresChallengeId: 'syn-02',
    bossName: 'Grammar Overlord',
    bossAvatar: '🧙',
    description: 'An argument aggregator function combines multiple config payloads. Shadowed variable names in nested catch blocks and improper rest parameter filtering cause duplicate keys and runtime ReferenceErrors.',
    expectedBehavior: 'combinePayloads(primary, ...rest) must shallow-merge all rest objects onto a shallow clone of primary. Non-object arguments in rest must be ignored safely without throwing.',
    hint: 'Clone primary first ({ ...primary }). Loop over rest arguments, checking if typeof arg === "object" and arg !== null before Object.assign or spread.',
    buggyCode: `// CATEGORY: Syntax error | CHALLENGE 3
// BUG: Variable shadowing in catch block and unsafe rest handling
function combinePayloads(primary, ...rest) {
  // BUGGY: Directly mutates primary input object
  const result = primary;

  for (let i = 0; i <= rest.length; i++) { // Off-by-one index error!
    const item = rest[i];
    try {
      // BUGGY: Crashes if item is null or primitive
      for (const k in item) {
        result[k] = item[k];
      }
    } catch (result) { // Variable shadowing!
      console.error(result);
    }
  }
  return result;
}`,
    solution: `function combinePayloads(primary, ...rest) {
  const output = typeof primary === 'object' && primary !== null ? { ...primary } : {};

  for (let i = 0; i < rest.length; i++) {
    const item = rest[i];
    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
      for (const key of Object.keys(item)) {
        output[key] = item[key];
      }
    }
  }
  return output;
}`,
    functionName: 'combinePayloads',
    testCases: [
      {
        id: 'syn3-1',
        description: 'Merge rest objects without mutating primary input',
        inputs: [{ a: 1 }, { b: 2 }, { c: 3 }],
        expected: { a: 1, b: 2, c: 3 }
      },
      {
        id: 'syn3-2',
        description: 'Filter out null, undefined, and primitive values in rest',
        inputs: [{ host: 'localhost' }, null, 'invalid_arg', { port: 8080 }],
        expected: { host: 'localhost', port: 8080 }
      },
      {
        id: 'syn3-3',
        description: 'Later rest objects override earlier ones',
        inputs: [{ v: 1 }, { v: 2 }, { v: 5 }],
        expected: { v: 5 }
      }
    ]
  },

  // ==========================================
  // CATEGORY 2: React state bugs (State Cave)
  // ==========================================
  {
    id: 'react-01',
    title: 'The Direct Array Mutation',
    category: 'React state bugs',
    stageName: 'State Cave',
    difficulty: 'Beginner',
    difficultyColor: 'purple',
    xpReward: 160,
    unlockedByDefault: true,
    requiresChallengeId: null,
    bossName: 'Mutator Drake',
    bossAvatar: '🐉',
    description: 'In an e-commerce cart reducer, items are added using state.items.push(action.payload) directly. Mutating arrays in-place breaks React re-renders because state.items === prevState.items.',
    expectedBehavior: 'cartReducer(state, action) must return a fresh state object with a new items array containing the added or updated item. If item exists by id, increment qty immutably.',
    hint: 'Use state.items.map() to update an existing item, or [...state.items, newItem] to add a new one. Never call .push() on state.',
    buggyCode: `// CATEGORY: React state bugs | CHALLENGE 1
// BUG: Direct mutation of state.items breaks reference equality
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      // BUGGY: Directly searches and mutates item in existing array!
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.qty += action.payload.qty; // IN-PLACE MUTATION!
        return state; // Reference unchanged!
      }
      state.items.push(action.payload); // DIRECT PUSH!
      return state;
    }
    default:
      return state;
  }
}`,
    solution: `function cartReducer(state, action) {
  const currentItems = state?.items || [];

  switch (action.type) {
    case 'ADD_ITEM': {
      const target = action.payload;
      const index = currentItems.findIndex(i => i.id === target.id);

      let newItems;
      if (index !== -1) {
        newItems = currentItems.map((item, idx) => 
          idx === index ? { ...item, qty: item.qty + target.qty } : item
        );
      } else {
        newItems = [...currentItems, { ...target }];
      }

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((acc, i) => acc + i.qty, 0)
      };
    }
    default:
      return state;
  }
}`,
    functionName: 'cartReducer',
    testCases: [
      {
        id: 'r1-1',
        description: 'Add new item immutably into empty items list',
        inputs: [{ items: [], totalItems: 0 }, { type: 'ADD_ITEM', payload: { id: 'p1', qty: 2 } }],
        expected: { items: [{ id: 'p1', qty: 2 }], totalItems: 2 }
      },
      {
        id: 'r1-2',
        description: 'Increment qty of existing item without in-place mutation',
        inputs: [{ items: [{ id: 'p1', qty: 2 }], totalItems: 2 }, { type: 'ADD_ITEM', payload: { id: 'p1', qty: 3 } }],
        expected: { items: [{ id: 'p1', qty: 5 }], totalItems: 5 }
      }
    ]
  },
  {
    id: 'react-02',
    title: 'Stale Closure Updater Queue Desync',
    category: 'React state bugs',
    stageName: 'State Cave',
    difficulty: 'Intermediate',
    difficultyColor: 'purple',
    xpReward: 220,
    unlockedByDefault: false,
    requiresChallengeId: 'react-01',
    bossName: 'Closure Gorgon',
    bossAvatar: '🐍',
    description: 'A batch state processor simulates React queued state updates. When actions use the raw value instead of an updater function (prev => prev + x), each update overwrites previous calculations with stale closure values.',
    expectedBehavior: 'batchCounterUpdates(initialCount, actions) must process an array of update actions (functions or numbers). Numbers represent direct set, functions receive the previous accumulated value.',
    hint: 'Iterate through actions sequentially, passing the accumulated result into any function updaters: current = typeof act === "function" ? act(current) : act.',
    buggyCode: `// CATEGORY: React state bugs | CHALLENGE 2
// BUG: Stale closures calculate from initialCount instead of accumulated state
function batchCounterUpdates(initialCount, actions) {
  let count = initialCount;

  // BUGGY: Passes the original initialCount to every action!
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    if (typeof action === 'function') {
      count = action(initialCount); // STALE VALUE TRAP!
    } else {
      count = action;
    }
  }

  return count;
}`,
    solution: `function batchCounterUpdates(initialCount, actions) {
  let count = typeof initialCount === 'number' ? initialCount : 0;
  if (!Array.isArray(actions)) return count;

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    if (typeof action === 'function') {
      count = action(count); // Accurately passes accumulated previous state
    } else if (typeof action === 'number') {
      count = action;
    }
  }

  return count;
}`,
    functionName: 'batchCounterUpdates',
    testCases: [
      {
        id: 'r2-1',
        description: 'Sequentially apply queued updaters: +1, +5, *2',
        inputs: [10, [(p) => p + 1, (p) => p + 5, (p) => p * 2]],
        expected: 32 // (10 + 1 + 5) * 2 = 32
      },
      {
        id: 'r2-2',
        description: 'Direct overwrite followed by updater',
        inputs: [0, [50, (p) => p + 10]],
        expected: 60
      }
    ]
  },
  {
    id: 'react-03',
    title: 'Nested Object Spread Desync',
    category: 'React state bugs',
    stageName: 'State Cave',
    difficulty: 'Hard',
    difficultyColor: 'purple',
    xpReward: 300,
    unlockedByDefault: false,
    requiresChallengeId: 'react-02',
    bossName: 'Deep Tree Titan',
    bossAvatar: '🗿',
    description: 'Updating a nested user preference object via { ...user, preferences: newPrefs } completely replaces preferences, obliterating existing sub-keys like notifications, theme, and audio volume.',
    expectedBehavior: 'mergeNestedUserPrefs(user, updates) should perform a 2-level shallow merge of preferences and nested notification settings without wiping unmentioned keys.',
    hint: 'Use nested spreads: preferences: { ...user.preferences, ...updates.preferences, notifications: { ...user.preferences?.notifications, ...updates.preferences?.notifications } }.',
    buggyCode: `// CATEGORY: React state bugs | CHALLENGE 3
// BUG: Shallow spread obliterates nested sibling keys
function mergeNestedUserPrefs(user, updates) {
  // BUGGY: Overwrites user.preferences completely, deleting unmentioned keys!
  return {
    ...user,
    preferences: updates.preferences
  };
}`,
    solution: `function mergeNestedUserPrefs(user, updates) {
  const baseUser = user || {};
  const basePrefs = baseUser.preferences || {};
  const newPrefs = updates?.preferences || {};

  return {
    ...baseUser,
    ...updates,
    preferences: {
      ...basePrefs,
      ...newPrefs,
      notifications: {
        ...(basePrefs.notifications || {}),
        ...(newPrefs.notifications || {})
      }
    }
  };
}`,
    functionName: 'mergeNestedUserPrefs',
    testCases: [
      {
        id: 'r3-1',
        description: 'Update dark mode preference while preserving volume and notifications',
        inputs: [
          { id: 1, preferences: { theme: 'light', volume: 80, notifications: { email: true, sms: false } } },
          { preferences: { theme: 'dark' } }
        ],
        expected: {
          id: 1,
          preferences: { theme: 'dark', volume: 80, notifications: { email: true, sms: false } }
        }
      },
      {
        id: 'r3-2',
        description: 'Update only notifications.sms without deleting email',
        inputs: [
          { id: 2, preferences: { theme: 'dark', notifications: { email: true, sms: false } } },
          { preferences: { notifications: { sms: true } } }
        ],
        expected: {
          id: 2,
          preferences: { theme: 'dark', notifications: { email: true, sms: true } }
        }
      }
    ]
  },

  // ==========================================
  // CATEGORY 3: Async JavaScript bugs (Async Abyss)
  // ==========================================
  {
    id: 'async-01',
    title: 'The forEach Promise Drop',
    category: 'Async JavaScript bugs',
    stageName: 'Async Abyss',
    difficulty: 'Beginner',
    difficultyColor: 'amber',
    xpReward: 180,
    unlockedByDefault: true,
    requiresChallengeId: null,
    bossName: 'Chronos Phantom',
    bossAvatar: '⏳',
    description: 'Array.prototype.forEach does not wait for async/await callbacks. The function exits synchronously and returns an empty array before any network calls complete.',
    expectedBehavior: 'fetchBatchTelemetry(ids, mockFetch) must await all asynchronous mockFetch(id) calls using Promise.all, returning an array of resolved telemetry objects sorted ascending by id.',
    hint: 'Replace ids.forEach(async ...) with Promise.all(ids.map(async ...)). Then sort the resulting array.',
    buggyCode: `// CATEGORY: Async JavaScript bugs | CHALLENGE 1
// BUG: forEach ignores returned promises and finishes instantly with empty array!
async function fetchBatchTelemetry(ids, mockFetch) {
  const results = [];

  // BUGGY: forEach does not await async operations!
  ids.forEach(async (id) => {
    const data = await mockFetch(id);
    results.push(data);
  });

  return results; // Returns empty array immediately!
}`,
    solution: `async function fetchBatchTelemetry(ids, mockFetch) {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const promises = ids.map(async (id) => {
    try {
      return await mockFetch(id);
    } catch {
      return null;
    }
  });

  const resolved = await Promise.all(promises);
  return resolved
    .filter(item => item !== null)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}`,
    functionName: 'fetchBatchTelemetry',
    testCases: [
      {
        id: 'a1-1',
        description: 'Fetch 3 nodes and verify all results return sorted by id',
        inputs: [
          ['node-b', 'node-a', 'node-c'],
          async (id) => ({ id, ping: 15 })
        ],
        expected: [
          { id: 'node-a', ping: 15 },
          { id: 'node-b', ping: 15 },
          { id: 'node-c', ping: 15 }
        ]
      },
      {
        id: 'a1-2',
        description: 'Handle empty array of ids',
        inputs: [[], async () => ({})],
        expected: []
      }
    ]
  },
  {
    id: 'async-02',
    title: 'Race Condition Response Overwrite',
    category: 'Async JavaScript bugs',
    stageName: 'Async Abyss',
    difficulty: 'Hard',
    difficultyColor: 'amber',
    xpReward: 270,
    unlockedByDefault: false,
    requiresChallengeId: 'async-01',
    bossName: 'Paradox Wraith',
    bossAvatar: '🌀',
    description: 'In an auto-complete search controller, user keystrokes trigger rapid async queries. If a slow older request resolves AFTER a fast newer request, the UI gets overwritten with stale data.',
    expectedBehavior: 'createSearchCoordinator() must return an object with query(term, mockSearch). When multiple queries are sent, only the result of the MOST RECENT query should be committed; older pending results must be discarded.',
    hint: 'Keep an internal sequence counter or query ID token. Inside query(), increment queryId and only return/resolve results if queryId matches the current active token.',
    buggyCode: `// CATEGORY: Async JavaScript bugs | CHALLENGE 2
// BUG: Slower older requests overwrite newer search results!
function createSearchCoordinator() {
  let latestResult = null;

  return {
    async query(term, mockSearch) {
      // BUGGY: No sequence tracking! If this takes 500ms, it will overwrite a 50ms search!
      const data = await mockSearch(term);
      latestResult = { term, data };
      return latestResult;
    },
    getLatestResult() {
      return latestResult;
    }
  };
}`,
    solution: `function createSearchCoordinator() {
  let activeQueryId = 0;
  let latestResult = null;

  return {
    async query(term, mockSearch) {
      const currentId = ++activeQueryId;
      const data = await mockSearch(term);

      // Only commit if this was the latest initiated query
      if (currentId === activeQueryId) {
        latestResult = { term, data };
        return latestResult;
      }
      return latestResult;
    },
    getLatestResult() {
      return latestResult;
    }
  };
}`,
    functionName: 'createSearchCoordinator',
    testCases: [
      {
        id: 'a2-1',
        description: 'Ensure fast 2nd request is NOT overwritten by slow 1st request',
        inputs: [],
        customValidator: async (actual) => {
          const coordinator = actual();
          // Slow first request: 60ms
          const p1 = coordinator.query('alpha', () => new Promise(res => setTimeout(() => res('slow_alpha'), 60)));
          // Fast second request: 10ms
          const p2 = coordinator.query('beta', () => new Promise(res => setTimeout(() => res('fast_beta'), 10)));
          await Promise.all([p1, p2]);
          const result = coordinator.getLatestResult();
          return result && result.term === 'beta' && result.data === 'fast_beta';
        },
        expected: true
      }
    ]
  },
  {
    id: 'async-03',
    title: 'Silent Promise.all Rejection Meltdown',
    category: 'Async JavaScript bugs',
    stageName: 'Async Abyss',
    difficulty: 'Advanced',
    difficultyColor: 'amber',
    xpReward: 320,
    unlockedByDefault: false,
    requiresChallengeId: 'async-02',
    bossName: 'Abyssal Voidworm',
    bossAvatar: '🪱',
    description: 'When downloading multiple game asset chunks, Promise.all fails fast if ANY chunk rejects. A single 404 aborts all 99 other successful assets instead of gracefully salvaging what downloaded.',
    expectedBehavior: 'resilientAssetLoader(urls, mockFetch) must attempt all downloads. Return { successful: [...items], failedCount: number } without rejecting the entire pipeline.',
    hint: 'Catch rejections per promise or use Promise.allSettled() so individual failures do not reject the whole batch.',
    buggyCode: `// CATEGORY: Async JavaScript bugs | CHALLENGE 3
// BUG: Single rejection in Promise.all destroys all other successful downloads!
async function resilientAssetLoader(urls, mockFetch) {
  // BUGGY: If one url throws, entire function rejects with unhandled error!
  const results = await Promise.all(
    urls.map(url => mockFetch(url))
  );

  return {
    successful: results,
    failedCount: 0
  };
}`,
    solution: `async function resilientAssetLoader(urls, mockFetch) {
  if (!Array.isArray(urls)) return { successful: [], failedCount: 0 };

  const promises = urls.map(async (url) => {
    try {
      const data = await mockFetch(url);
      return { status: 'fulfilled', value: data };
    } catch (error) {
      return { status: 'rejected', reason: error };
    }
  });

  const settled = await Promise.all(promises);
  const successful = [];
  let failedCount = 0;

  for (const item of settled) {
    if (item.status === 'fulfilled' && item.value !== undefined) {
      successful.push(item.value);
    } else {
      failedCount++;
    }
  }

  return { successful, failedCount };
}`,
    functionName: 'resilientAssetLoader',
    testCases: [
      {
        id: 'a3-1',
        description: 'Recover 2 valid assets when 1 asset throws network error',
        inputs: [
          ['img1.png', 'corrupt.png', 'img2.png'],
          async (url) => {
            if (url === 'corrupt.png') throw new Error('HTTP 404');
            return { url, bytes: 1024 };
          }
        ],
        expected: {
          successful: [{ url: 'img1.png', bytes: 1024 }, { url: 'img2.png', bytes: 1024 }],
          failedCount: 1
        }
      }
    ]
  },

  // ==========================================
  // CATEGORY 4: API bugs (API Fortress)
  // ==========================================
  {
    id: 'api-01',
    title: 'Missing HTTP Status Code Guard',
    category: 'API bugs',
    stageName: 'API Fortress',
    difficulty: 'Beginner',
    difficultyColor: 'rose',
    xpReward: 170,
    unlockedByDefault: true,
    requiresChallengeId: null,
    bossName: 'Gateway Behemoth',
    bossAvatar: '🏰',
    description: 'Fetch does not reject on HTTP 404 or 500 error responses. The code blindly calls response.json() and assumes success: true, treating error html/json as valid payloads.',
    expectedBehavior: 'fetchApiResponse(url, mockFetch) must verify response.ok. On error status codes (4xx/5xx), return { success: false, statusCode: response.status, data: null }. On 200-299, return { success: true, statusCode: 200, data }.',
    hint: 'Check if (!response.ok) before parsing data. Return structured error response.',
    buggyCode: `// CATEGORY: API bugs | CHALLENGE 1
// BUG: Ignores response.ok and treats 500 server errors as success!
async function fetchApiResponse(url, mockFetch) {
  const response = await mockFetch(url);

  // BUGGY: Never inspects response.ok or response.status!
  const data = await response.json();

  return {
    success: true, // Always true even on 500!
    statusCode: response.status,
    data: data
  };
}`,
    solution: `async function fetchApiResponse(url, mockFetch) {
  try {
    const response = await mockFetch(url);
    if (!response || !response.ok) {
      return {
        success: false,
        statusCode: response?.status || 500,
        data: null
      };
    }

    const data = await response.json();
    return {
      success: true,
      statusCode: response.status,
      data
    };
  } catch (err) {
    return {
      success: false,
      statusCode: 0,
      data: null
    };
  }
}`,
    functionName: 'fetchApiResponse',
    testCases: [
      {
        id: 'api1-1',
        description: 'Verify 200 OK response returns success: true',
        inputs: ['/api/user', async () => ({ ok: true, status: 200, json: async () => ({ name: 'Neo' }) })],
        expected: { success: true, statusCode: 200, data: { name: 'Neo' } }
      },
      {
        id: 'api1-2',
        description: 'Verify 500 Internal Server Error returns success: false',
        inputs: ['/api/crash', async () => ({ ok: false, status: 500, json: async () => ({ message: 'Crash' }) })],
        expected: { success: false, statusCode: 500, data: null }
      }
    ]
  },
  {
    id: 'api-02',
    title: 'Exponential Backoff Retry Trap',
    category: 'API bugs',
    stageName: 'API Fortress',
    difficulty: 'Hard',
    difficultyColor: 'rose',
    xpReward: 280,
    unlockedByDefault: false,
    requiresChallengeId: 'api-01',
    bossName: 'Rate-Limit Hydra',
    bossAvatar: '🐉',
    description: 'An API client retrying transient 503 errors fails to increment its attempt counter and causes infinite loops, or crashes on maximum retries instead of returning clean telemetry.',
    expectedBehavior: 'requestWithRetry(fn, maxRetries) must invoke async fn() up to maxRetries times if it rejects or throws. If it succeeds, return the result. If all retries fail, return null.',
    hint: 'Use a while loop: while (attempts < maxRetries). Increment attempts on each catch. Return null if loop completes without success.',
    buggyCode: `// CATEGORY: API bugs | CHALLENGE 2
// BUG: Does not increment retry count, causing potential infinite loops!
async function requestWithRetry(fn, maxRetries) {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      return await fn();
    } catch (err) {
      // BUGGY: Never increments attempts! Infinite loop risk!
      console.warn("Retrying request...");
    }
  }

  // BUGGY: Throws unhandled exception instead of graceful fallback
  throw new Error("Failed");
}`,
    solution: `async function requestWithRetry(fn, maxRetries) {
  const limit = typeof maxRetries === 'number' && maxRetries > 0 ? maxRetries : 3;
  let attempts = 0;

  while (attempts < limit) {
    attempts++;
    try {
      return await fn();
    } catch {
      // retry
    }
  }

  return null;
}`,
    functionName: 'requestWithRetry',
    testCases: [
      {
        id: 'api2-1',
        description: 'Succeed on 2nd attempt after 1 failure',
        inputs: [
          (() => {
            let count = 0;
            return async () => {
              count++;
              if (count === 1) throw new Error('503 Service Unavailable');
              return 'data_payload';
            };
          })(),
          3
        ],
        expected: 'data_payload'
      },
      {
        id: 'api2-2',
        description: 'Exhaust all retries and safely return null',
        inputs: [
          async () => { throw new Error('Dead endpoint'); },
          2
        ],
        expected: null
      }
    ]
  },
  {
    id: 'api-03',
    title: 'URL Query Serialization Corruption',
    category: 'API bugs',
    stageName: 'API Fortress',
    difficulty: 'Advanced',
    difficultyColor: 'rose',
    xpReward: 330,
    unlockedByDefault: false,
    requiresChallengeId: 'api-02',
    bossName: 'Query Gargoyle',
    bossAvatar: '🗿',
    description: 'Building API URLs by concatenating strings causes malformed queries: spaces are not percent-encoded, special characters break URL parsing, and undefined/null parameters become strings like "filter=null".',
    expectedBehavior: 'buildApiUrl(baseUrl, params) should append params as URL-encoded query parameters. Ignore null and undefined values. If baseUrl already has parameters, append with & instead of ?.',
    hint: 'Use URLSearchParams or encodeURIComponent. Check if baseUrl.includes("?") to decide between "?" or "&". Filter out null and undefined values.',
    buggyCode: `// CATEGORY: API bugs | CHALLENGE 3
// BUG: Broken string concatenation, unencoded spaces, and literal "null" params
function buildApiUrl(baseUrl, params) {
  let query = '';

  // BUGGY: Does not encodeURIComponent and appends literal "null"!
  for (const k in params) {
    query += k + '=' + params[k] + '&';
  }

  // BUGGY: Always appends '?' even if baseUrl already contains existing queries!
  return baseUrl + '?' + query.slice(0, -1);
}`,
    solution: `function buildApiUrl(baseUrl, params) {
  if (typeof baseUrl !== 'string') return '';
  if (!params || typeof params !== 'object') return baseUrl;

  const validEntries = Object.entries(params).filter(([_, val]) => val !== null && val !== undefined);
  if (validEntries.length === 0) return baseUrl;

  const queryString = validEntries
    .map(([key, val]) => \`\${encodeURIComponent(key)}=\${encodeURIComponent(String(val))}\`)
    .join('&');

  const separator = baseUrl.includes('?') ? '&' : '?';
  return \`\${baseUrl}\${separator}\${queryString}\`;
}`,
    functionName: 'buildApiUrl',
    testCases: [
      {
        id: 'api3-1',
        description: 'Properly encode spaces and special characters',
        inputs: ['https://api.dungeon.io/search', { q: 'cyber sword', tag: 'rpg&magic' }],
        expected: 'https://api.dungeon.io/search?q=cyber%20sword&tag=rpg%26magic'
      },
      {
        id: 'api3-2',
        description: 'Ignore null and undefined parameters',
        inputs: ['https://api.dungeon.io/items', { active: true, filter: null, page: undefined }],
        expected: 'https://api.dungeon.io/items?active=true'
      },
      {
        id: 'api3-3',
        description: 'Append with & if URL already has existing queries',
        inputs: ['https://api.dungeon.io/items?limit=10', { page: 2 }],
        expected: 'https://api.dungeon.io/items?limit=10&page=2'
      }
    ]
  },

  // ==========================================
  // CATEGORY 5: Production bugs (Production Boss)
  // ==========================================
  {
    id: 'prod-01',
    title: 'Zombie Event Listener Memory Leech',
    category: 'Production bugs',
    stageName: 'Production Boss',
    difficulty: 'Intermediate',
    difficultyColor: 'crimson',
    xpReward: 200,
    unlockedByDefault: true,
    requiresChallengeId: null,
    bossName: 'Vampiric Pointer',
    bossAvatar: '🦇',
    description: 'An in-memory event registry fails to clean up subscriber closures upon unsubscribe(). Components unmount, but their callbacks persist in heap memory and continue executing on subsequent emits.',
    expectedBehavior: 'createDungeonBus() must provide subscribe(event, cb), emit(event, ...args), and getCount(event). subscribe() must return an unsubscribe function that removes the callback completely.',
    hint: 'In unsubscribe(), filter listeners[event] to remove cb. If listeners[event].length === 0, delete listeners[event].',
    buggyCode: `// CATEGORY: Production bugs | CHALLENGE 1
// BUG: Leaks callbacks because unsubscribe is a no-op function!
function createDungeonBus() {
  const registry = {};

  return {
    subscribe(event, cb) {
      if (!registry[event]) registry[event] = [];
      registry[event].push(cb);

      // BUGGY: Unsubscribe does nothing, keeping zombie listeners in memory!
      return function unsubscribe() {
        // Nothing here! Memory leak!
      };
    },

    emit(event, ...args) {
      if (registry[event]) {
        registry[event].forEach(fn => fn(...args));
      }
    },

    getCount(event) {
      return registry[event] ? registry[event].length : 0;
    }
  };
}`,
    solution: `function createDungeonBus() {
  const registry = {};

  return {
    subscribe(event, cb) {
      if (typeof cb !== 'function') return () => {};
      if (!registry[event]) registry[event] = [];
      registry[event].push(cb);

      let active = true;
      return function unsubscribe() {
        if (!active) return;
        active = false;
        if (registry[event]) {
          registry[event] = registry[event].filter(fn => fn !== cb);
          if (registry[event].length === 0) {
            delete registry[event];
          }
        }
      };
    },

    emit(event, ...args) {
      if (!registry[event]) return;
      const copies = [...registry[event]];
      copies.forEach(fn => {
        try {
          fn(...args);
        } catch (e) {
          console.error(e);
        }
      });
    },

    getCount(event) {
      return registry[event] ? registry[event].length : 0;
    }
  };
}`,
    functionName: 'createDungeonBus',
    testCases: [
      {
        id: 'p1-1',
        description: 'Verify unsubscribe properly removes callback and decrements count',
        inputs: [],
        customValidator: (actual) => {
          const bus = actual();
          let count = 0;
          const unsub = bus.subscribe('alert', () => { count++; });
          bus.emit('alert');
          unsub();
          bus.emit('alert');
          return count === 1 && bus.getCount('alert') === 0;
        },
        expected: true
      }
    ]
  },
  {
    id: 'prod-02',
    title: 'Circular Reference Serialization Crash',
    category: 'Production bugs',
    stageName: 'Production Boss',
    difficulty: 'Advanced',
    difficultyColor: 'crimson',
    xpReward: 320,
    unlockedByDefault: false,
    requiresChallengeId: 'prod-01',
    bossName: 'Ouroboros Daemon',
    bossAvatar: '🐍',
    description: 'During telemetry logging, crash reports containing cyclical object references (e.g. parent.child.parent = parent) cause JSON.stringify() to throw a fatal TypeError: Converting circular structure to JSON.',
    expectedBehavior: 'safeSerializePayload(obj) should stringify objects without throwing on circular structures. Replace circular back-references with the string "[Circular]".',
    hint: 'Use a WeakSet in the JSON.stringify replacer function: if (typeof val === "object" && val !== null) { if (seen.has(val)) return "[Circular]"; seen.add(val); }',
    buggyCode: `// CATEGORY: Production bugs | CHALLENGE 2
// BUG: Fatal TypeError on circular references in production telemetry
function safeSerializePayload(obj) {
  // BUGGY: Blindly calls JSON.stringify, crashing on circular references!
  return JSON.stringify(obj);
}`,
    solution: `function safeSerializePayload(obj) {
  const seen = new WeakSet();

  return JSON.stringify(obj, function(_, value) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  });
}`,
    functionName: 'safeSerializePayload',
    testCases: [
      {
        id: 'p2-1',
        description: 'Safely serialize object containing circular reference without crashing',
        inputs: [
          (() => {
            const a = { name: 'Root' };
            a.self = a;
            return a;
          })()
        ],
        expected: '{"name":"Root","self":"[Circular]"}'
      },
      {
        id: 'p2-2',
        description: 'Serialize normal nested object without circularity',
        inputs: [{ id: 101, nested: { status: 'ONLINE' } }],
        expected: '{"id":101,"nested":{"status":"ONLINE"}}'
      }
    ]
  },
  {
    id: 'prod-03',
    title: 'The Prototype Pollution Exploit',
    category: 'Production bugs',
    stageName: 'Production Boss',
    difficulty: 'Nightmare',
    difficultyColor: 'crimson',
    xpReward: 500,
    unlockedByDefault: false,
    requiresChallengeId: 'prod-02',
    bossName: 'NULL_POINTER_TITAN',
    bossAvatar: '👑',
    description: 'A deep configuration merger in production allows attackers to inject malicious properties into Object.prototype via __proto__, constructor, and prototype, corrupting all objects across the runtime environment.',
    expectedBehavior: 'deepMergeConfig(target, source) must recursively merge objects while blacklisting __proto__, constructor, and prototype. Arrays must be cloned cleanly without converting to object keys.',
    hint: 'Check for forbidden keys: if (["__proto__", "constructor", "prototype"].includes(key)) continue. Clone arrays using .map().',
    buggyCode: `// CATEGORY: Production bugs | CHALLENGE 3
// BUG: Critical Prototype Pollution vulnerability and array corruption
function deepMergeConfig(target, source) {
  // BUGGY: Allows dangerous prototype poisoning and corrupts prototypes!
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key]) target[key] = {};
      deepMergeConfig(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}`,
    solution: `function deepMergeConfig(target, source) {
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return source;

  const output = Array.isArray(target) ? [...target] : { ...target };
  const forbidden = ['__proto__', 'constructor', 'prototype'];

  for (const key of Object.keys(source)) {
    if (forbidden.includes(key)) continue;

    const sourceVal = source[key];
    const targetVal = output[key];

    if (Array.isArray(sourceVal)) {
      output[key] = sourceVal.map(item => 
        (typeof item === 'object' && item !== null) ? deepMergeConfig({}, item) : item
      );
    } else if (typeof sourceVal === 'object' && sourceVal !== null) {
      if (typeof targetVal === 'object' && targetVal !== null && !Array.isArray(targetVal)) {
        output[key] = deepMergeConfig(targetVal, sourceVal);
      } else {
        output[key] = deepMergeConfig({}, sourceVal);
      }
    } else {
      output[key] = sourceVal;
    }
  }

  return output;
}`,
    functionName: 'deepMergeConfig',
    testCases: [
      {
        id: 'p3-1',
        description: 'Neutralize Prototype Pollution (__proto__ attack attempt)',
        inputs: [
          {},
          JSON.parse('{"__proto__": {"isAdmin": true}, "appName": "Mainframe"}')
        ],
        customValidator: (actual) => {
          const testObj = {};
          const isPolluted = testObj.isAdmin === true;
          return !isPolluted && actual.appName === 'Mainframe';
        },
        expected: true
      },
      {
        id: 'p3-2',
        description: 'Safely merge nested configs while preserving arrays',
        inputs: [
          { auth: { roles: ['user'] }, env: 'prod' },
          { auth: { roles: ['admin', 'moderator'], timeout: 3600 } }
        ],
        expected: {
          auth: { roles: ['admin', 'moderator'], timeout: 3600 },
          env: 'prod'
        }
      }
    ]
  },
  {
    id: 'boss-sev0',
    title: 'SEV-0 TITAN // Production Cluster Cascading Meltdown',
    category: 'Production bugs',
    stageName: 'Production Boss',
    difficulty: 'BOSS // OMEGA',
    difficultyColor: 'crimson',
    xpReward: 1500,
    isBossChallenge: true,
    unlockedByDefault: false,
    requiresChallengeId: 'prod-03',
    bossName: 'NULL_POINTER_COLOSSUS',
    bossAvatar: '👹',
    description: 'A catastrophic distributed cascading failure has struck the primary payment and checkout cluster. Multiple combined bugs—unhandled asynchronous promise rejection, concurrent in-place state mutation of shared memory ledgers, and an unbounded event listener memory leak—have locked the event loop at 99.8% CPU, crashing pods and triggering a global outage.',
    expectedBehavior: 'processClusterBatch(transactions, clusterState) must immutably clone clusterState, process each transaction asynchronously with robust error recovery (preventing a single failure from aborting the batch), safely compute balances without in-place mutation, and remove all transient telemetry listeners to prevent memory leakage.',
    hint: 'Examine the 3 diagnostic actions in the Incident Console. The true root cause lies in processClusterBatch: (1) clone state shallowly ({ ...clusterState, activeNodes: [...clusterState.activeNodes] }), (2) use safe async processing with try/catch, (3) do not attach uncleaned listeners inside the loop, (4) return a new transaction record without mutating the input object.',
    buggyCode: `// SEV-0 TITAN: Production Cluster Cascading Meltdown
// COMBINED SYSTEM FAILURE: Async Rejection + State Mutation + Memory Leak
async function processClusterBatch(transactions, clusterState) {
  // BUG 1: Shared state mutation! In-place mutation corrupts parallel workers
  clusterState.activeNodes.push('worker-temp');
  clusterState.metrics.batchesProcessed += 1;
  
  const results = [];
  
  // BUG 2: forEach with async function causes unhandled race conditions & dropped errors!
  transactions.forEach(async (tx) => {
    // BUG 3: Unbounded event listener leak inside batch loop (spikes heap to 99%)
    clusterState.eventBus.on('heartbeat', () => {});
    
    // BUG 4: Direct in-place mutation of transaction payload
    tx.status = 'COMMITTED';
    tx.node = clusterState.primaryNode;
    
    // BUG 5: Unhandled promise rejection crashes the entire process on network error
    const receipt = await clusterState.gateway.charge(tx.amount);
    results.push({ id: tx.id, receipt });
  });

  return { success: true, processed: results, state: clusterState };
}`,
    solution: `async function processClusterBatch(transactions, clusterState) {
  if (!Array.isArray(transactions) || !clusterState) {
    return { success: false, processed: [], state: clusterState };
  }

  // FIX 1: Immutable state clone (prevents worker memory corruption)
  const nextState = {
    ...clusterState,
    activeNodes: [...(clusterState.activeNodes || [])],
    metrics: {
      ...(clusterState.metrics || {}),
      batchesProcessed: ((clusterState.metrics && clusterState.metrics.batchesProcessed) || 0) + 1
    }
  };

  // FIX 2: Proper sequential/settled async execution with error isolation
  const results = [];
  for (const rawTx of transactions) {
    // FIX 3: Immutable transaction cloning without mutating source
    const tx = { ...rawTx, node: nextState.primaryNode || 'core-1' };
    
    try {
      if (!tx.amount || tx.amount <= 0) {
        results.push({ id: tx.id, status: 'REJECTED', reason: 'Invalid amount' });
        continue;
      }
      
      // FIX 4: Safe gateway call with isolated error handling
      const receipt = clusterState.gateway && typeof clusterState.gateway.charge === 'function'
        ? await clusterState.gateway.charge(tx.amount)
        : { authCode: 'AUTH_' + tx.id, settled: true };
        
      results.push({ id: tx.id, status: 'COMMITTED', receipt });
    } catch (err) {
      // FIX 5: Gracefully record failed transactions without crashing cluster
      results.push({ id: tx.id, status: 'FAILED', error: err.message || 'Gateway error' });
    }
  }

  // FIX 6: No leaky listener registered in loop; returns clean immutable result
  return { success: true, processed: results, state: nextState };
}`,
    functionName: 'processClusterBatch',
    testCases: [
      {
        id: 'boss-1',
        description: 'Isolate failed payment transactions without crashing batch',
        inputs: [
          [{ id: 'tx_1', amount: 50 }, { id: 'tx_fail', amount: 9999 }, { id: 'tx_2', amount: 75 }],
          {
            primaryNode: 'alpha-1',
            activeNodes: ['node-1', 'node-2'],
            metrics: { batchesProcessed: 4 },
            eventBus: { on: () => {} },
            gateway: {
              charge: async (amt) => {
                if (amt === 9999) throw new Error('Gateway timeout');
                return { authCode: 'OK_' + amt, settled: true };
              }
            }
          }
        ],
        customValidator: async (actualFn) => {
          const txs = [{ id: 'tx_1', amount: 50 }, { id: 'tx_fail', amount: 9999 }, { id: 'tx_2', amount: 75 }];
          const state = {
            primaryNode: 'alpha-1',
            activeNodes: ['node-1', 'node-2'],
            metrics: { batchesProcessed: 4 },
            eventBus: { on: () => {} },
            gateway: {
              charge: async (amt) => {
                if (amt === 9999) throw new Error('Gateway timeout');
                return { authCode: 'OK_' + amt, settled: true };
              }
            }
          };
          const res = await actualFn(txs, state);
          return res.success === true && res.processed.length === 3 && res.processed[1].status === 'FAILED';
        },
        expected: true
      },
      {
        id: 'boss-2',
        description: 'Prevent in-place state mutation of input clusterState and transactions',
        inputs: [],
        customValidator: async (actualFn) => {
          const originalTxs = [{ id: 'tx_10', amount: 20 }];
          const originalState = { primaryNode: 'node-x', activeNodes: ['n1'], metrics: { batchesProcessed: 0 } };
          await actualFn(originalTxs, originalState);
          return originalState.activeNodes.length === 1 && originalTxs[0].status === undefined;
        },
        expected: true
      },
      {
        id: 'boss-3',
        description: 'Clean memory footprint with zero listener accumulation on eventBus',
        inputs: [],
        customValidator: async (actualFn) => {
          let listenerCount = 0;
          const state = {
            primaryNode: 'core',
            activeNodes: [],
            metrics: {},
            eventBus: { on: () => { listenerCount++; } }
          };
          await actualFn([{ id: '1', amount: 10 }, { id: '2', amount: 20 }, { id: '3', amount: 30 }], state);
          return listenerCount === 0;
        },
        expected: true
      }
    ]
  }
];

// Helper to determine if a challenge is unlocked based on completed challenge IDs
export function isChallengeUnlocked(challenge, completedIds = []) {
  if (!challenge) return false;
  if (challenge.unlockedByDefault) return true;
  if (!challenge.requiresChallengeId) return true;
  return completedIds.includes(challenge.requiresChallengeId);
}
