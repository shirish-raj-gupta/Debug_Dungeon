import React, { useEffect } from 'react';
import { 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Frown, 
  Zap,
  ShieldAlert
} from 'lucide-react';

/**
 * EventFeedbackEffects
 * Renders lightweight, purely CSS-animated visual feedback for game events:
 * 1. Bug Fix Success Animation (holographic rings + +XP burst)
 * 2. Sad / Failure Effect (red damage flash + wobble + floating -15 HP)
 * 3. Level-Up Celebration Banner (fanfare with rotating cyber rays)
 * 4. Consecutive Streak Indicator (ignited flame + multiplier boost)
 * 5. Low Health Warning Effect (persistent breathing crimson vignette + warning banner)
 */
export default function EventFeedbackEffects({
  // Low Health State
  health = 100,
  maxHealth = 100,
  
  // Dynamic Event Triggers
  successEvent = null, // { id, xpEarned, combo, streak, challengeTitle }
  failureEvent = null, // { id, damage, oldStreak, hadStreak, challengeTitle }
  streakEvent = null,  // { id, streak, combo }
  levelUpEvent = null, // { id, newLevel, rank }

  // Dismiss callbacks
  onDismissSuccess,
  onDismissFailure,
  onDismissStreak,
  onDismissLevelUp,
}) {
  const isLowHealth = health <= 25 && health > 0;
  const healthPercent = Math.round((health / maxHealth) * 100);

  // Auto-dismiss timers for transient popups
  useEffect(() => {
    if (successEvent && onDismissSuccess) {
      const timer = setTimeout(onDismissSuccess, 2600);
      return () => clearTimeout(timer);
    }
  }, [successEvent, onDismissSuccess]);

  useEffect(() => {
    if (failureEvent && onDismissFailure) {
      const timer = setTimeout(onDismissFailure, 2400);
      return () => clearTimeout(timer);
    }
  }, [failureEvent, onDismissFailure]);

  useEffect(() => {
    if (streakEvent && onDismissStreak) {
      const timer = setTimeout(onDismissStreak, 2800);
      return () => clearTimeout(timer);
    }
  }, [streakEvent, onDismissStreak]);

  useEffect(() => {
    if (levelUpEvent && onDismissLevelUp) {
      const timer = setTimeout(onDismissLevelUp, 3200);
      return () => clearTimeout(timer);
    }
  }, [levelUpEvent, onDismissLevelUp]);

  return (
    <>
      {/* ========================================================
          1. LOW HEALTH WARNING EFFECT (Health <= 25%)
          ======================================================== */}
      {isLowHealth && (
        <>
          {/* Fullscreen breathing red danger vignette */}
          <div 
            className="fixed inset-0 z-20 low-health-vignette pointer-events-none" 
            aria-hidden="true" 
          />

          {/* Top Warning Marquee / Danger Banner */}
          <div className="fixed top-16 left-0 right-0 z-30 pointer-events-none flex justify-center px-4">
            <div className="py-1 px-4 rounded-full bg-red-950/90 border border-red-500/70 shadow-[0_0_20px_rgba(239,68,68,0.5)] backdrop-blur-md flex items-center gap-2.5 text-red-200 text-xs font-mono animate-pulse">
              <ShieldAlert className="w-4 h-4 text-red-400 animate-heartbeat-rapid" />
              <span className="font-extrabold tracking-wider uppercase text-red-400">
                CRITICAL INTEGRITY
              </span>
              <span className="text-red-300 font-bold">
                {health} / {maxHealth} HP ({healthPercent}%)
              </span>
              <span className="hidden sm:inline text-red-400/80 text-[11px]">
                // ONE FAILED SUBMISSION FROM SYSTEM REBOOT!
              </span>
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          2. SAD FAILURE EFFECT (Incorrect Submission)
          ======================================================== */}
      {failureEvent && (
        <>
          {/* Brief red screen flash */}
          <div 
            key={`flash-${failureEvent.id}`} 
            className="fixed inset-0 z-40 bg-red-600/20 pointer-events-none animate-damage-flash" 
            aria-hidden="true" 
          />

          {/* Floating Damage & Sad Face Alert */}
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center">
            {/* Sad Wobble Badge */}
            <div className="animate-sad-wobble px-5 py-3 rounded-2xl bg-gradient-to-b from-dungeon-950/95 to-red-950/95 border-2 border-red-500/80 shadow-[0_0_35px_rgba(239,68,68,0.6)] backdrop-blur-xl flex items-center gap-3.5 max-w-sm">
              <div className="w-10 h-10 rounded-xl bg-red-950/90 border border-red-500/60 flex items-center justify-center text-red-400 flex-shrink-0 shadow-inner">
                <Frown className="w-6 h-6 animate-pulse" />
              </div>
              <div className="font-mono text-left">
                <div className="text-[10px] text-red-400 font-black tracking-widest uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  SUBMISSION FAILED
                </div>
                <div className="text-sm font-bold text-white leading-tight">
                  :( Syntax / Probe Fault
                </div>
                <div className="text-[11px] text-red-300 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span>💔 -{failureEvent.damage || 15} HP Damage</span>
                  {failureEvent.hadStreak && (
                    <span className="text-amber-400 text-[10px]">
                      (🔥 {failureEvent.oldStreak} streak lost)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Rising floating damage number */}
            <div className="mt-2 animate-damage-float font-mono font-black text-2xl text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)] flex items-center gap-1">
              <span>-{failureEvent.damage || 15} HP</span>
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          3. BUG FIX SUCCESS ANIMATION (Correct Solution)
          ======================================================== */}
      {successEvent && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center">
          {/* Expanding holographic cyber ring */}
          <div className="absolute w-24 h-24 rounded-full border-2 border-emerald-400 animate-success-ring pointer-events-none" />

          {/* Floating Success Pill */}
          <div className="animate-success-burst px-5 py-3 rounded-2xl bg-gradient-to-b from-dungeon-950/95 to-emerald-950/90 border-2 border-emerald-400/90 shadow-[0_0_40px_rgba(16,185,129,0.5)] backdrop-blur-xl flex items-center gap-3.5 max-w-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/90 border border-emerald-400 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-inner">
              <CheckCircle2 className="w-6 h-6 animate-pulse" />
            </div>
            <div className="font-mono text-left">
              <div className="text-[10px] text-emerald-400 font-black tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                BUG FIXED // PURGED
              </div>
              <div className="text-sm font-bold text-white leading-tight">
                All Probes Verified!
              </div>
              <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-2 mt-0.5">
                <span className="text-amber-300">+{successEvent.xpEarned} XP</span>
                {successEvent.combo > 1.0 && (
                  <span className="text-cyan-300 font-mono text-[10px]">
                    (x{successEvent.combo.toFixed(1)} Combo)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. CONSECUTIVE STREAK INDICATOR (Streak >= 2)
          ======================================================== */}
      {streakEvent && streakEvent.streak >= 2 && (
        <div className="fixed top-36 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center">
          <div className="animate-streak-pop px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-950/95 via-orange-950/95 to-amber-950/95 border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.6)] backdrop-blur-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-400 flex items-center justify-center text-amber-300 flex-shrink-0 animate-flame-burn">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div className="font-mono text-left">
              <div className="text-[10px] text-amber-300 font-black tracking-widest uppercase flex items-center gap-1">
                🔥 CONSECUTIVE STREAK!
              </div>
              <div className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>{streakEvent.streak} SOLVES IN A ROW</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-400 text-dungeon-950 font-black text-[10px]">
                  x{streakEvent.combo.toFixed(1)} BOOST
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. LEVEL UP CELEBRATION BANNER
          ======================================================== */}
      {levelUpEvent && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center">
          {/* Rotating celestial rays background */}
          <div className="absolute -inset-16 opacity-35 animate-ray-spin pointer-events-none flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-[conic-gradient(from_0deg,#00f2fe,#b02aef,#fbbf24,#00f2fe)] blur-xl" />
          </div>

          <div className="animate-level-up-fanfare relative px-6 py-3.5 rounded-2xl bg-gradient-to-r from-dungeon-950 via-cyan-950 to-dungeon-950 border-2 border-cyan-400 shadow-[0_0_50px_rgba(0,242,254,0.6)] backdrop-blur-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-2xl shadow-inner flex-shrink-0 relative">
              <span>{levelUpEvent.rank?.badge || '👑'}</span>
              <div className="absolute -inset-1 rounded-xl bg-cyan-400/20 animate-ping" />
            </div>
            <div className="font-mono text-left">
              <div className="text-[11px] text-cyan-300 font-black tracking-widest uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                SYSTEM ASCENSION // LEVEL UP!
              </div>
              <div className="text-base font-black text-white">
                REACHED LEVEL {levelUpEvent.newLevel}!
              </div>
              <div className="text-xs text-amber-300 font-bold">
                {levelUpEvent.rank?.title || 'Elite Guardian'}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
