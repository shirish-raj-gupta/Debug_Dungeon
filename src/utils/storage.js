// Local Storage Manager for Debug Dungeon Player State & Settings
// RPG Progression System with 5 Developer Ranks, XP Thresholds & State Persistence

const STORAGE_KEY = 'debug_dungeon_player_v1';

// 5 Developer Ranks: Code, No Voice, Bug Hunter, Stacks Layer, Runtime Knight, and Production Guardian
export const RANKS = [
  { 
    minLevel: 1, 
    maxLevel: 2, 
    title: 'Code, No Voice', 
    cleanTitle: 'Code Novice', 
    badge: '🔰', 
    color: 'text-slate-400', 
    border: 'border-slate-500', 
    glow: 'none',
    description: 'Level 1-2: Junior debugger finding their voice in the codebase.' 
  },
  { 
    minLevel: 3, 
    maxLevel: 4, 
    title: 'Bug Hunter', 
    cleanTitle: 'Bug Hunter', 
    badge: '⚡', 
    color: 'text-cyan-400', 
    border: 'border-cyan-500', 
    glow: 'cyan',
    description: 'Level 3-4: Anomaly tracker purging syntax and state bugs.' 
  },
  { 
    minLevel: 5, 
    maxLevel: 6, 
    title: 'Stacks Layer', 
    cleanTitle: 'Stack Slayer', 
    badge: '⚔️', 
    color: 'text-teal-400', 
    border: 'border-teal-500', 
    glow: 'teal',
    description: 'Level 5-6: Master of async workflows and architectural layers.' 
  },
  { 
    minLevel: 7, 
    maxLevel: 9, 
    title: 'Runtime Knight', 
    cleanTitle: 'Runtime Knight', 
    badge: '🛡️', 
    color: 'text-purple-400', 
    border: 'border-purple-500', 
    glow: 'purple',
    description: 'Level 7-9: Resilient guardian defending against API anomalies.' 
  },
  { 
    minLevel: 10, 
    maxLevel: Infinity, 
    title: 'Production Guardian', 
    cleanTitle: 'Production Guardian', 
    badge: '👑', 
    color: 'text-amber-400', 
    border: 'border-amber-500', 
    glow: 'amber',
    description: 'Level 10+: Colossus slayer defending live production systems.' 
  },
];

// Defined XP Thresholds for increasing levels
export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, maxXp: 150 },
  { level: 2, minXp: 150, maxXp: 350 },
  { level: 3, minXp: 350, maxXp: 600 },
  { level: 4, minXp: 600, maxXp: 950 },
  { level: 5, minXp: 950, maxXp: 1400 },
  { level: 6, minXp: 1400, maxXp: 1950 },
  { level: 7, minXp: 1950, maxXp: 2600 },
  { level: 8, minXp: 2600, maxXp: 3350 },
  { level: 9, minXp: 3350, maxXp: 4200 },
  { level: 10, minXp: 4200, maxXp: 5200 },
  { level: 11, minXp: 5200, maxXp: 6300 },
  { level: 12, minXp: 6300, maxXp: 7500 },
  { level: 13, minXp: 7500, maxXp: 8800 },
  { level: 14, minXp: 8800, maxXp: 10200 },
  { level: 15, minXp: 10200, maxXp: 12000 },
];

export function getRank(level = 1) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLevel) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

export function getLevelInfo(xp = 0) {
  const currentXp = Math.max(0, xp || 0);

  let level = 1;
  let minXp = 0;
  let maxXp = 150;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    const t = LEVEL_THRESHOLDS[i];
    if (currentXp >= t.minXp) {
      level = t.level;
      minXp = t.minXp;
      maxXp = t.maxXp;
    } else {
      break;
    }
  }

  // Handle beyond maximum predefined threshold
  const last = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  if (currentXp >= last.maxXp) {
    const extraXp = currentXp - last.maxXp;
    const extraLevels = Math.floor(extraXp / 1200) + 1;
    level = last.level + extraLevels;
    minXp = last.maxXp + (extraLevels - 1) * 1200;
    maxXp = minXp + 1200;
  }

  const xpInLevel = currentXp - minXp;
  const xpNeeded = maxXp - minXp;
  const percent = Math.min(100, Math.max(0, Math.round((xpInLevel / xpNeeded) * 100)));
  const xpRemaining = Math.max(0, maxXp - currentXp);
  const rank = getRank(level);

  return {
    level,
    currentXp,
    minXp,
    maxXp,
    xpInLevel,
    xpNeeded,
    percent,
    xpRemaining,
    rank
  };
}

export function calculateLevel(xp = 0) {
  return getLevelInfo(xp).level;
}

export function xpForNextLevel(level = 1) {
  const threshold = LEVEL_THRESHOLDS.find(t => t.level === level);
  return threshold ? threshold.maxXp : level * 1000;
}

export function xpForCurrentLevel(level = 1) {
  const threshold = LEVEL_THRESHOLDS.find(t => t.level === level);
  return threshold ? threshold.minXp : (level - 1) * 1000;
}

export const DEFAULT_PROFILE = {
  handle: 'Cyber_Hunter#902',
  xp: 0, // Starts at 0 XP
  health: 100,
  maxHealth: 100,
  combo: 1.0,
  streak: 0,
  hintsRemaining: 3,
  completedChallenges: [],
  unlockedAchievements: [],
  hintsUsed: {},
  soundEnabled: true,
  scanlinesEnabled: true,
  lastActive: new Date().toISOString(),
  activityLog: [
    { id: 'init-1', text: 'Mainframe connection established', type: 'info', time: '00:00:01' },
    { id: 'init-2', text: 'Entered chamber as Code, No Voice [Lvl 1]', type: 'event', time: '00:00:05' }
  ]
};

export function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      xp: typeof parsed.xp === 'number' ? parsed.xp : DEFAULT_PROFILE.xp,
      health: typeof parsed.health === 'number' ? parsed.health : DEFAULT_PROFILE.health,
      maxHealth: typeof parsed.maxHealth === 'number' ? parsed.maxHealth : DEFAULT_PROFILE.maxHealth,
      streak: typeof parsed.streak === 'number' ? parsed.streak : DEFAULT_PROFILE.streak,
      combo: typeof parsed.combo === 'number' ? parsed.combo : DEFAULT_PROFILE.combo,
      hintsRemaining: typeof parsed.hintsRemaining === 'number' ? parsed.hintsRemaining : DEFAULT_PROFILE.hintsRemaining,
      completedChallenges: Array.isArray(parsed.completedChallenges) ? parsed.completedChallenges : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
      hintsUsed: parsed.hintsUsed && typeof parsed.hintsUsed === 'object' ? parsed.hintsUsed : {},
      activityLog: Array.isArray(parsed.activityLog) ? parsed.activityLog : DEFAULT_PROFILE.activityLog,
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}

export function resetProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return { ...DEFAULT_PROFILE };
}
