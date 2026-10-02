import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { 
  Sparkles, 
  ArrowRight, 
  Award, 
  TrendingUp 
} from 'lucide-react';
import { sfx } from '../../utils/sound';
import { getLevelInfo, RANKS } from '../../utils/storage';

export default function LevelUpModal({
  isOpen,
  onClose,
  prevLevel = 1,
  newLevel = 2,
  currentXp = 0,
}) {
  const levelInfo = getLevelInfo(currentXp);
  const { rank, percent, maxXp, xpRemaining } = levelInfo;

  useEffect(() => {
    if (isOpen) {
      sfx.playLevelUp();
      // Double celebratory cyber confetti explosion
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#00f2fe', '#00ff9d', '#b02aef', '#fbbf24', '#ff007f']
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#00f2fe', '#00ff9d', '#fbbf24']
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#b02aef', '#ff007f', '#00f2fe']
          });
        }, 200);
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚡ LEVEL UP // DEVELOPER ASCENSION"
      icon={Sparkles}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6 text-center animate-in zoom-in-95 duration-300 font-mono relative">
        {/* Celebration Rotating Cyber Light Rays Behind Badge */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute -inset-10 opacity-30 animate-ray-spin pointer-events-none flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-[conic-gradient(from_0deg,#00f2fe,#b02aef,#fbbf24,#00f2fe)] blur-xl" />
          </div>

          {/* Glowing Badge & Avatar Animation */}
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-cyan-950 via-dungeon-950 to-purple-950 border-2 border-cyan-400/90 flex items-center justify-center shadow-[0_0_40px_rgba(0,242,254,0.5)]">
            <div className="absolute inset-0 rounded-3xl bg-cyan-400/20 animate-ping pointer-events-none" />
            <span className="text-6xl filter drop-shadow-[0_0_20px_rgba(0,242,254,0.7)] animate-bounce">
              {rank.badge}
            </span>
            <div className="absolute -bottom-2 -right-2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-dungeon-950 font-black text-xs shadow-lg border-2 border-dungeon-950">
              LVL {newLevel}
            </div>
          </div>
        </div>

        {/* Level & Rank Announcement */}
        <div>
          <Badge variant="cyan" size="sm" className="mb-2 uppercase tracking-widest text-[11px] border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.4)]">
            🎉 SYSTEM ASCENSION: LVL {prevLevel} ➔ LVL {newLevel}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            ASCENDED TO LEVEL {newLevel}!
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="text-slate-400 text-xs">Developer Rank:</span>
            <span className={`text-sm font-extrabold ${rank.color}`}>
              {rank.title}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-2 max-w-sm mx-auto">
            {rank.description}
          </p>
        </div>

        {/* Progress Bar Towards NEXT Level */}
        <div className="p-4 rounded-2xl bg-dungeon-950/80 border border-cyan-500/40 text-left space-y-2 shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              PROGRESS TO LEVEL {newLevel + 1}
            </span>
            <span className="text-slate-300 font-extrabold text-[11px]">
              {currentXp} / {maxXp} XP ({percent}%)
            </span>
          </div>

          {/* Animated Gradient Gauge */}
          <div className="w-full h-3 bg-dungeon-900 rounded-full overflow-hidden border border-dungeon-800 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-glow-cyan"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>Current Floor Buffer</span>
            <span className="text-amber-400 font-semibold">
              {xpRemaining} XP needed for Level {newLevel + 1}
            </span>
          </div>
        </div>

        {/* 5 Developer Ranks Progression Track */}
        <div className="p-3.5 rounded-2xl bg-dungeon-950/70 border border-dungeon-800 text-left space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              Developer Ascension Track
            </span>
            <span className="text-cyan-400 text-[10px] font-bold">5 TIERS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-0.5">
            {RANKS.map((r, idx) => {
              const isCurrent = rank.title === r.title;
              const isPassed = newLevel > r.maxLevel;
              return (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isCurrent 
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-glow-cyan' 
                      : isPassed
                      ? 'bg-dungeon-900/60 border-emerald-500/40 text-slate-400'
                      : 'bg-dungeon-950 border-dungeon-800/80 opacity-40'
                  }`}
                  title={`${r.title} (${r.description})`}
                >
                  <div className="text-2xl">{r.badge}</div>
                  <div className={`text-[10px] font-bold mt-1.5 truncate ${isCurrent ? 'text-cyan-300' : 'text-slate-300'}`}>
                    {r.title}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                    {r.maxLevel === Infinity ? `Lvl ${r.minLevel}+` : `Lvl ${r.minLevel}-${r.maxLevel}`}
                  </div>
                  {isCurrent && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] uppercase font-bold bg-cyan-400 text-dungeon-950">
                      CURRENT
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            size="md"
            variant="primary"
            onClick={onClose}
            icon={ArrowRight}
            className="w-full shadow-glow-cyan py-3 text-sm font-black"
          >
            Acknowledge & Continue Purge
          </Button>
        </div>
      </div>
    </Modal>
  );
}
