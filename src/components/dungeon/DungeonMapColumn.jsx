import React, { useState, useEffect, useRef } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  Lock, 
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Compass,
  ShieldAlert
} from 'lucide-react';
import { CATEGORIES, isChallengeUnlocked } from '../../data/challenges';
import { sfx } from '../../utils/sound';
import { getLevelInfo } from '../../utils/storage';

// Detailed Subterranean Dungeon Room Architecture & Metadata
const ROOM_METADATA = {
  syntax: {
    roomNumber: 'ROOM 01',
    floor: 'FLOOR 1',
    depth: '100m',
    sectorCode: 'SECTOR α',
    subTitle: 'Lexical Crypt',
    accentColor: 'cyan',
    pulseClass: 'animate-room-pulse-cyan',
    activeBorder: 'border-cyan-400 shadow-glow-cyan',
    ambientGlow: 'rgba(0, 242, 254, 0.15)',
    headerBg: 'from-cyan-950/80 via-dungeon-950 to-dungeon-900',
    description: 'Deobfuscate broken syntax tokens, malformed conditionals, and scoping traps.'
  },
  react: {
    roomNumber: 'ROOM 02',
    floor: 'FLOOR 2',
    depth: '250m',
    sectorCode: 'SECTOR β',
    subTitle: 'State Cavern',
    accentColor: 'purple',
    pulseClass: 'animate-room-pulse-purple',
    activeBorder: 'border-purple-400 shadow-glow-purple',
    ambientGlow: 'rgba(176, 42, 239, 0.15)',
    headerBg: 'from-purple-950/80 via-dungeon-950 to-dungeon-900',
    description: 'Traverse reactive state mutations, stale closures, and desynced hooks.'
  },
  async: {
    roomNumber: 'ROOM 03',
    floor: 'FLOOR 3',
    depth: '500m',
    sectorCode: 'SECTOR γ',
    subTitle: 'Async Abyss',
    accentColor: 'amber',
    pulseClass: 'animate-room-pulse-amber',
    activeBorder: 'border-amber-400 shadow-glow-amber',
    ambientGlow: 'rgba(251, 191, 36, 0.15)',
    headerBg: 'from-amber-950/80 via-dungeon-950 to-dungeon-900',
    description: 'Stabilize erratic event loops, race conditions, and unhandled Promise rejections.'
  },
  api: {
    roomNumber: 'ROOM 04',
    floor: 'FLOOR 4',
    depth: '800m',
    sectorCode: 'SECTOR δ',
    subTitle: 'Gateway Citadel',
    accentColor: 'rose',
    pulseClass: 'animate-room-pulse-rose',
    activeBorder: 'border-rose-400 shadow-glow-crimson',
    ambientGlow: 'rgba(244, 63, 94, 0.15)',
    headerBg: 'from-rose-950/80 via-dungeon-950 to-dungeon-900',
    description: 'Breach hardened gateway firewalls, exponential backoff errors, and CORS anomalies.'
  },
  prod: {
    roomNumber: 'ROOM 05',
    floor: 'FLOOR 5',
    depth: '1200m',
    sectorCode: 'SECTOR Ω',
    subTitle: 'Production Sanctum',
    accentColor: 'gold',
    pulseClass: 'animate-room-pulse-gold',
    activeBorder: 'border-amber-400 shadow-glow-amber',
    ambientGlow: 'rgba(234, 179, 8, 0.2)',
    headerBg: 'from-amber-950/80 via-crimson-950/50 to-dungeon-900',
    description: 'Confront live cluster colossi, circular payload loops, and memory leak singularities.'
  }
};

export default function DungeonMapColumn({
  challenges = [],
  currentChallengeId,
  completedChallenges = [],
  onSelectChallenge,
  playerProfile = null,
  justCompletedId = null,
  onClearJustCompleted = () => {},
}) {
  // Track which category rooms are expanded (all expanded by default)
  const [expandedCategories, setExpandedCategories] = useState({
    syntax: true,
    react: true,
    async: true,
    api: true,
    prod: true
  });

  // Track room-to-room player traversal animation
  const [traversalState, setTraversalState] = useState({
    isTraversing: false,
    fromCatId: null,
    toCatId: null,
    toRoomName: '',
  });

  // Identify active challenge and its category room
  const activeChallenge = challenges.find(c => c.id === currentChallengeId) || challenges[0];
  const activeCategory = CATEGORIES.find(c => c.name === activeChallenge?.category) || CATEGORIES[0];

  const prevChallengeIdRef = useRef(currentChallengeId);
  const prevCatIdRef = useRef(activeCategory?.id);

  // Player level & rank info for player token marker
  const levelInfo = getLevelInfo(playerProfile?.xp || 0);

  // Detect when player completes a challenge or moves from one room to another
  useEffect(() => {
    const prevId = prevChallengeIdRef.current;
    const prevCatId = prevCatIdRef.current;
    const currentCatId = activeCategory?.id;

    const challengeChanged = prevId && prevId !== currentChallengeId;
    const isCompletedTransition = justCompletedId && justCompletedId === prevId;

    if (challengeChanged || isCompletedTransition) {
      const roomChanged = prevCatId !== currentCatId;
      const targetMeta = ROOM_METADATA[currentCatId] || ROOM_METADATA.syntax;

      setTraversalState({
        isTraversing: true,
        fromCatId: prevCatId,
        toCatId: currentCatId,
        toRoomName: roomChanged ? `${targetMeta.roomNumber} [${targetMeta.subTitle}]` : targetMeta.subTitle,
      });

      // Play teleport / traversal audio cue
      sfx.playTeleport();

      const timer = setTimeout(() => {
        setTraversalState(prev => ({ ...prev, isTraversing: false }));
        if (justCompletedId) {
          onClearJustCompleted();
        }
      }, 1200);

      prevChallengeIdRef.current = currentChallengeId;
      prevCatIdRef.current = currentCatId;

      return () => clearTimeout(timer);
    }

    prevChallengeIdRef.current = currentChallengeId;
    prevCatIdRef.current = currentCatId;
  }, [currentChallengeId, activeCategory?.id, justCompletedId, onClearJustCompleted]);

  const totalCount = challenges.length;
  const completedCount = completedChallenges.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const toggleCategory = (catId) => {
    sfx.playClick();
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  return (
    <div className="space-y-4 font-mono select-none">
      {/* 1. Subterranean Telemetry Header */}
      <Card glow="none" className="p-4 bg-dungeon-900/90 border-dungeon-700/80 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse flex-shrink-0" />
            <span className="text-xs font-bold text-white tracking-wider">
              DUNGEON MAP MATRIX
            </span>
          </div>
          <Badge variant="cyan" size="xs">
            {completedCount} / {totalCount} PURGED
          </Badge>
        </div>

        {/* Overall Clearance Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              Subterranean Clearance
            </span>
            <span className="text-cyan-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-dungeon-950 rounded-full overflow-hidden border border-dungeon-800 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700 shadow-glow-cyan"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Engage SEV-0 Final Boss Emergency Banner */}
        {challenges.find(c => c.isBossChallenge) && (
          <button 
            type="button"
            id="boss-engage-btn"
            onClick={() => {
              sfx.playClick();
              const boss = challenges.find(c => c.isBossChallenge);
              if (boss) onSelectChallenge(boss);
            }}
            className={`w-full mt-3 p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2.5 text-left ${
              currentChallengeId === challenges.find(c => c.isBossChallenge)?.id
                ? 'bg-rose-950 border-rose-500 shadow-glow-crimson animate-pulse'
                : completedChallenges.includes(challenges.find(c => c.isBossChallenge)?.id)
                ? 'bg-emerald-950/40 border-emerald-500/50 hover:bg-emerald-950/60'
                : 'bg-rose-950/40 border-rose-500/60 hover:border-rose-400 hover:bg-rose-950/60 shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl animate-bounce">👹</span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white truncate">
                    SEV-0 TITAN BOSS
                  </span>
                  {completedChallenges.includes(challenges.find(c => c.isBossChallenge)?.id) ? (
                    <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                      PURGED
                    </span>
                  ) : (
                    <span className="text-[9px] px-1 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 animate-pulse">
                      ALERT
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-rose-300/80 font-sans block truncate">
                  Cascade Outage • +1500 XP Bounty
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-400 flex-shrink-0">
              <span>ENGAGE</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        )}
      </Card>

      {/* 2. Five Dungeon Rooms Connected Vertically by Energy Conduits */}
      <div className="space-y-4 relative">
        {CATEGORIES.map((cat, catIdx) => {
          const meta = ROOM_METADATA[cat.id] || ROOM_METADATA.syntax;
          const catChallenges = challenges.filter(c => c.category === cat.name);
          const catCompletedCount = catChallenges.filter(c => completedChallenges.includes(c.id)).length;
          const isRoomPurged = catCompletedCount === catChallenges.length && catChallenges.length > 0;
          const isExpanded = cat.id === activeCategory?.id || (expandedCategories[cat.id] ?? true);

          // Check if any challenges in this room are unlocked
          const unlockedCountInRoom = catChallenges.filter(c => isChallengeUnlocked(c, completedChallenges)).length;
          const isRoomLocked = unlockedCountInRoom === 0;

          // Is player currently inside this room?
          const isPlayerInThisRoom = activeCategory?.id === cat.id;

          // Is this room currently the arrival target in a traversal animation?
          const isArrivalTarget = traversalState.isTraversing && traversalState.toCatId === cat.id;

          return (
            <div key={cat.id} className="relative">
              {/* Vertical Cyber Conduit Connecting Rooms */}
              {catIdx < CATEGORIES.length - 1 && (
                <div className="absolute left-7 top-[100%] h-4 w-[2px] -z-0 pointer-events-none overflow-hidden">
                  {/* Static Conduit Pipe */}
                  <div className="w-full h-full bg-dungeon-800" />
                  
                  {/* Continuous Energy Pulse */}
                  <div className="absolute inset-0 w-full bg-gradient-to-b from-cyan-400 via-teal-300 to-transparent animate-conduit-stream" />
                  
                  {/* High-Speed Traversal Beam when moving */}
                  {traversalState.isTraversing && (
                    <div className="absolute inset-0 w-full bg-cyan-300 shadow-glow-cyan animate-traversal-beam" />
                  )}
                </div>
              )}

              {/* DUNGEON ROOM CONTAINER */}
              <div 
                className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  isRoomPurged
                    ? 'bg-gradient-to-b from-emerald-950/40 via-dungeon-950 to-dungeon-900 border-emerald-500/50 shadow-glow-neon animate-room-pulse-emerald'
                    : isPlayerInThisRoom
                    ? `bg-gradient-to-b ${meta.headerBg} border-2 ${meta.activeBorder} ${meta.pulseClass}`
                    : isRoomLocked
                    ? 'locked-room-hazard border-slate-800/80 opacity-60'
                    : `bg-dungeon-900/90 border-dungeon-700/80 hover:border-cyan-500/50 ${meta.pulseClass}`
                } ${isArrivalTarget ? 'animate-arrival-shockwave' : ''}`}
              >
                {/* Tech Corner Brackets for Dungeon Room Aesthetics */}
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/80 -translate-x-px -translate-y-px rounded-tl-sm pointer-events-none z-20" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/80 translate-x-px -translate-y-px rounded-tr-sm pointer-events-none z-20" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400/80 -translate-x-px translate-y-px rounded-bl-sm pointer-events-none z-20" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400/80 translate-x-px translate-y-px rounded-br-sm pointer-events-none z-20" />

                {/* Subterranean Depth & Sector Header Strip */}
                <div className="px-3.5 py-1.5 bg-dungeon-950/90 border-b border-dungeon-800/80 flex items-center justify-between text-[9px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-extrabold tracking-wider">{meta.roomNumber}</span>
                    <span className="text-slate-600">•</span>
                    <span>{meta.floor}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500 font-bold">{meta.depth}</span>
                  </div>

                  {/* Room Clearance State or Player Marker */}
                  <div className="flex items-center gap-1.5">
                    {isPlayerInThisRoom && (
                      <div className="flex items-center gap-1 text-[9px] font-bold text-cyan-300">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                        </span>
                        <span>AGENT INSIDE</span>
                      </div>
                    )}
                    {isRoomPurged && (
                      <div className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>PURGED</span>
                      </div>
                    )}
                    {isRoomLocked && (
                      <div className="flex items-center gap-1 text-[9px] font-bold text-rose-400">
                        <Lock className="w-2.5 h-2.5" />
                        <span>BARRED</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Room Primary Header */}
                <div 
                  onClick={() => !isRoomLocked && toggleCategory(cat.id)}
                  className={`p-3 flex items-center justify-between transition-colors ${
                    isRoomLocked 
                      ? 'cursor-not-allowed' 
                      : 'cursor-pointer hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Room Emblem */}
                    <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border shadow-inner ${
                      isRoomPurged 
                        ? 'bg-emerald-950/80 border-emerald-500/60 shadow-glow-neon'
                        : isPlayerInThisRoom 
                        ? 'bg-cyan-950/90 border-cyan-400 shadow-glow-cyan'
                        : isRoomLocked 
                        ? 'bg-dungeon-950 border-slate-800 text-slate-600'
                        : 'bg-dungeon-950 border-dungeon-800 text-slate-300'
                    }`}>
                      {cat.icon}
                      
                      {/* Active Sonar Beacon Ring if Player is in this Room */}
                      {isPlayerInThisRoom && (
                        <div className="absolute inset-0 rounded-xl border border-cyan-400 animate-radar-beacon pointer-events-none" />
                      )}
                    </div>

                    {/* Room Title & Purge Progress */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-black truncate tracking-wide ${
                          isRoomPurged ? 'text-emerald-300' : isPlayerInThisRoom ? 'text-white' : isRoomLocked ? 'text-slate-500' : 'text-slate-200'
                        }`}>
                          {cat.stageName}
                        </span>
                        <span className="text-[10px] text-slate-400 hidden sm:inline">
                          [{meta.subTitle}]
                        </span>
                      </div>

                      {/* Room Clearance Progress Bar */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-20 sm:w-24 h-1.5 bg-dungeon-950 rounded-full overflow-hidden border border-dungeon-800">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isRoomPurged 
                                ? 'bg-emerald-400 shadow-glow-neon' 
                                : 'bg-gradient-to-r from-cyan-500 to-teal-400'
                            }`}
                            style={{ width: `${Math.round((catCompletedCount / catChallenges.length) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-slate-400">
                          {catCompletedCount}/{catChallenges.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Header Status / Expand Toggle */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isRoomPurged ? (
                      <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" title="Sector 100% Purged">
                        <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    ) : isRoomLocked ? (
                      <div className="p-1 rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/30" title="Security Barrier Engaged">
                        <Lock className="w-4 h-4" />
                      </div>
                    ) : (
                      isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )
                    )}
                  </div>
                </div>

                {/* Locked Room Overlay Message */}
                {isRoomLocked && (
                  <div className="p-3 border-t border-slate-800/80 bg-dungeon-950/90 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>SECURITY LOCKDOWN ACTIVE</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-sans">
                      Purge earlier subterranean sectors to disengage security forcefields.
                    </p>
                  </div>
                )}

                {/* Collapsible Chambers inside this Room */}
                {isExpanded && !isRoomLocked && (
                  <div className="p-2.5 pt-0 space-y-1.5 border-t border-dungeon-800/60 bg-dungeon-950/40">
                    {catChallenges.map((ch, idx) => {
                      const isUnlocked = isChallengeUnlocked(ch, completedChallenges);
                      const isCompleted = completedChallenges.includes(ch.id);
                      const isActive = ch.id === currentChallengeId;

                      return (
                        <button
                          key={ch.id}
                          disabled={!isUnlocked}
                          onClick={() => {
                            if (isUnlocked) {
                              sfx.playClick();
                              onSelectChallenge(ch);
                            }
                          }}
                          className={`w-full p-2.5 rounded-xl text-left transition-all duration-200 flex items-center justify-between gap-2 border text-xs relative overflow-hidden group ${
                            isUnlocked ? 'cursor-pointer active:scale-[0.98]' : 'cursor-not-allowed'
                          } ${
                            ch.isBossChallenge && isActive
                              ? 'bg-rose-950/90 border-rose-500 text-white shadow-glow-crimson animate-pulse scale-[1.01]'
                              : ch.isBossChallenge && isCompleted
                              ? 'bg-emerald-950/30 border-emerald-500/50 text-slate-200 hover:border-emerald-400'
                              : ch.isBossChallenge && isUnlocked
                              ? 'bg-gradient-to-r from-rose-950/70 to-dungeon-900 border-rose-500/70 text-rose-200 hover:border-rose-400 hover:text-white shadow-glow-crimson'
                              : isActive
                              ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-glow-cyan scale-[1.01]'
                              : isCompleted
                              ? 'bg-emerald-950/20 border-emerald-900/50 text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-950/30'
                              : isUnlocked
                              ? 'bg-dungeon-900/80 border-dungeon-800 text-slate-300 hover:border-cyan-500/40 hover:text-white hover:bg-dungeon-850'
                              : 'locked-room-hazard border-dungeon-900 text-slate-600 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Chamber State Icon or Active Player Token */}
                            {isActive ? (
                              <div className="relative w-5 h-5 rounded-md bg-cyan-500 text-dungeon-950 font-black text-xs flex items-center justify-center flex-shrink-0 shadow-md">
                                <span className="select-none text-xs">{levelInfo.rank.badge}</span>
                                <div className="absolute -inset-1 rounded-md border border-cyan-400 animate-ping opacity-60 pointer-events-none" />
                              </div>
                            ) : isCompleted ? (
                              <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                              </div>
                            ) : ch.isBossChallenge ? (
                              <span className="text-sm flex-shrink-0 animate-bounce">👹</span>
                            ) : isUnlocked ? (
                              <span className="w-4 h-4 rounded-full border border-cyan-500/60 flex items-center justify-center text-[10px] text-cyan-300 font-bold flex-shrink-0 bg-dungeon-950">
                                {idx + 1}
                              </span>
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                            )}

                            {/* Chamber Name */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`truncate block font-semibold text-[11px] transition-colors ${
                                  ch.isBossChallenge && isActive ? 'text-rose-200 font-extrabold' : ch.isBossChallenge ? 'text-rose-300 font-bold' : isActive ? 'text-cyan-300 font-bold' : isCompleted ? 'text-emerald-200' : isUnlocked ? 'text-slate-200 group-hover:text-white' : 'text-slate-500'
                                }`}>
                                  {ch.title}
                                </span>
                                {ch.isBossChallenge && (
                                  <span className="text-[8px] px-1 py-0.2 rounded bg-rose-500/30 text-rose-300 font-black border border-rose-500/50 flex-shrink-0">
                                    APEX BOSS
                                  </span>
                                )}
                              </div>
                              {isActive && (
                                <span className="text-[9px] text-cyan-400/80 font-sans block leading-tight">
                                  Current Active Target
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Chamber XP Bounty or Locked Tag */}
                          <div className="flex items-center gap-1.5 flex-shrink-0 font-mono">
                            <span className={`text-[10px] flex items-center gap-0.5 font-bold ${
                              isCompleted ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              <Sparkles className="w-2.5 h-2.5" />
                              +{ch.xpReward}
                            </span>
                            {!isUnlocked && (
                              <span className="text-[8px] px-1 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                                BARRED
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                                PURGED
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
