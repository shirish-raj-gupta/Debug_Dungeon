import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  ArrowRight
} from 'lucide-react';
import { sfx } from '../../utils/sound';
import { getLevelInfo } from '../../utils/storage';

export default function BossVictoryModal({
  isOpen,
  onClose,
  _challenge,
  playerLevel = 1,
  xpEarned = 1500,
  challengesSolved = 16,
  totalChallenges = 16,
  streak = 1,
  rank = { title: 'Production Guardian', badge: '👑', color: 'text-amber-400', border: 'border-amber-500' },
  totalXp = 0,
  onReturnToMap = () => {},
}) {
  const levelInfo = getLevelInfo(totalXp);

  useEffect(() => {
    if (isOpen) {
      sfx.playBossDefeat();

      // Massive celebratory confetti bursts
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#ff3366', '#fbbf24', '#00ff9d', '#00f2fe', '#ffffff']
        });

        setTimeout(() => {
          confetti({
            particleCount: 90,
            angle: 60,
            spread: 60,
            origin: { x: 0.1, y: 0.6 },
            colors: ['#fbbf24', '#00ff9d', '#b02aef']
          });
          confetti({
            particleCount: 90,
            angle: 120,
            spread: 60,
            origin: { x: 0.9, y: 0.6 },
            colors: ['#ff3366', '#00f2fe', '#fbbf24']
          });
        }, 350);
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🏆 APEX BOSS SLAIN // SEV-0 INCIDENT RESOLVED"
      icon={Trophy}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-center font-mono animate-in zoom-in-95 duration-300">
        
        {/* Grand Hero Badge & Laurel */}
        <div className="relative mx-auto w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-dungeon-950 border-2 border-amber-400 shadow-glow-amber flex items-center justify-center">
          <span className="text-6xl animate-bounce">👑</span>
          <div className="absolute -bottom-2.5 -right-2.5 p-2 rounded-full bg-emerald-500 text-dungeon-950 shadow-glow-neon">
            <CheckCircle2 className="w-6 h-6 stroke-[3]" />
          </div>
          <div className="absolute -inset-2 rounded-3xl border border-amber-400/40 animate-ping pointer-events-none opacity-40" />
        </div>

        {/* Victory Headline */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>GLOBAL CLUSTER RESTORATION COMPLETE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            NULL_POINTER_COLOSSUS DEFEATED!
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-1 max-w-lg mx-auto">
            All transaction pipelines stabilized. In-place state mutations sanitized, async promise rejections handled, and memory leak eliminated.
          </p>
        </div>

        {/* 5 REQUIRED METRICS DISPLAY GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-left pt-2">
          
          {/* 1. Final Level */}
          <div className="p-3 rounded-2xl bg-dungeon-950/90 border-2 border-cyan-500/50 shadow-glow-cyan">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">
              1. Final Level
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-cyan-300 font-black text-xl">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>LVL {playerLevel}</span>
            </div>
            <span className="text-[9px] text-cyan-400 font-sans block mt-0.5">
              {levelInfo.xpRemaining} XP to Lvl {playerLevel + 1}
            </span>
          </div>

          {/* 2. XP Earned */}
          <div className="p-3 rounded-2xl bg-dungeon-950/90 border-2 border-amber-500/50 shadow-glow-amber">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">
              2. XP Earned
            </span>
            <div className="flex items-center gap-1 mt-1 text-amber-300 font-black text-xl">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>+{xpEarned}</span>
            </div>
            <span className="text-[9px] text-amber-400/80 font-sans block mt-0.5">
              Total: {totalXp} XP
            </span>
          </div>

          {/* 3. Challenges Solved */}
          <div className="p-3 rounded-2xl bg-dungeon-950/90 border-2 border-emerald-500/50 shadow-glow-neon">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">
              3. Solved
            </span>
            <div className="flex items-center gap-1 mt-1 text-emerald-300 font-black text-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{challengesSolved}/{totalChallenges}</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-sans block mt-0.5">
              100% Subterranean
            </span>
          </div>

          {/* 4. Consecutive Streak */}
          <div className="p-3 rounded-2xl bg-dungeon-950/90 border-2 border-rose-500/50 shadow-glow-crimson">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">
              4. Streak
            </span>
            <div className="flex items-center gap-1 mt-1 text-rose-300 font-black text-xl">
              <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>{streak} 🔥</span>
            </div>
            <span className="text-[9px] text-rose-400/80 font-sans block mt-0.5">
              Max Momentum
            </span>
          </div>

          {/* 5. Developer Rank */}
          <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-dungeon-950/90 border-2 border-purple-500/50 shadow-glow-purple flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold">
                5. Final Rank
              </span>
              <div className="mt-1 text-purple-300 font-black text-xs leading-snug break-words">
                <span className="text-sm mr-1">{rank.badge}</span>
                <span>{rank.title}</span>
              </div>
            </div>
            <span className="text-[9px] text-purple-400 font-sans block mt-1">
              Apex Tier
            </span>
          </div>
        </div>

        {/* Restored Cluster Telemetry Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-left">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-emerald-300 font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>PRODUCTION TELEMETRY: RESTORED TO HEALTHY BASELINE</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">100% OPERATIONAL</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-dungeon-950 border border-emerald-900/60">
              <span className="text-[10px] text-slate-400 block">CPU Load</span>
              <span className="text-emerald-400 font-bold">12.4% (NOMINAL)</span>
            </div>
            <div className="p-2 rounded-lg bg-dungeon-950 border border-emerald-900/60">
              <span className="text-[10px] text-slate-400 block">HTTP 500 Error Rate</span>
              <span className="text-emerald-400 font-bold">0.01% (CLEARED)</span>
            </div>
            <div className="p-2 rounded-lg bg-dungeon-950 border border-emerald-900/60">
              <span className="text-[10px] text-slate-400 block">Event Loop Lag</span>
              <span className="text-emerald-400 font-bold">6.2 ms (HEALTHY)</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            className="border-slate-700 font-bold"
          >
            <span>Review Incident Report</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              onReturnToMap();
            }}
            className="bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 text-white font-black shadow-glow-amber"
          >
            <span>Return to Dungeon Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
