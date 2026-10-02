import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Heart,
  Flame, 
  Award 
} from 'lucide-react';
import { sfx } from '../../utils/sound';
import { getLevelInfo } from '../../utils/storage';

export default function VictoryModal({
  isOpen,
  onClose,
  challenge,
  xpEarned,
  leveledUp,
  newLevel,
  currentXp = 0,
  rank,
  streak = 1,
  newAchievements = [],
  onNextChallenge,
  onReturnToMap,
}) {
  const levelInfo = getLevelInfo(currentXp);
  useEffect(() => {
    if (isOpen) {
      sfx.playLevelUp();
      // Fire cyber confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#00ff9d', '#b02aef', '#fbbf24', '#ffffff']
        });
      } catch {}
    }
  }, [isOpen]);

  if (!challenge || !isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ANOMALY ELIMINATED // SECTOR PURGED"
      icon={Trophy}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
        {/* Boss Defeated Hero Display */}
        <div className="relative mx-auto w-24 h-24 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-dungeon-950 border-2 border-emerald-400/60 flex items-center justify-center shadow-glow-neon">
          <span className="text-5xl">{challenge.bossAvatar || '👾'}</span>
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-dungeon-950">
            <CheckCircle2 className="w-5 h-5 stroke-[3]" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-mono font-bold text-white tracking-wide">
            {challenge.bossName || challenge.title} Defeated!
          </h2>
          <p className="text-xs font-mono text-emerald-400 mt-1">
            Sector anomaly neutralized. All test probes validated.
          </p>
        </div>

        {/* Rewards Grid: XP, Consecutive Streak, HP Restored */}
        <div className="grid grid-cols-3 gap-2.5 text-left">
          {/* XP Bounty */}
          <div className="p-3 rounded-xl bg-dungeon-950/80 border border-cyan-500/30">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              Bounty Reward
            </span>
            <div className="flex items-center gap-1 text-cyan-300 font-mono font-bold text-base sm:text-lg">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span>+{xpEarned} XP</span>
            </div>
          </div>

          {/* Consecutive Streak */}
          <div className="p-3 rounded-xl bg-dungeon-950/80 border border-amber-500/30">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              Solve Streak
            </span>
            <div className="flex items-center gap-1 text-amber-300 font-mono font-bold text-base sm:text-lg">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0 animate-pulse" />
              <span>{streak} 🔥</span>
            </div>
          </div>

          {/* Health Restored */}
          <div className="p-3 rounded-xl bg-dungeon-950/80 border border-emerald-500/30">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              HP Restored
            </span>
            <div className="flex items-center gap-1 text-emerald-300 font-mono font-bold text-base sm:text-lg">
              <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 flex-shrink-0" />
              <span>+15 HP</span>
            </div>
          </div>
        </div>

        {/* Level Up Banner with Progress Bar to Next Level */}
        {leveledUp && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/90 via-dungeon-950 to-purple-950/90 border border-cyan-400/60 shadow-glow-cyan text-left space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold block">
                  ⚡ LEVEL ADVANCEMENT!
                </span>
                <span className="text-base font-bold text-white">
                  Now Level {newLevel} • <span className={rank.color}>{rank.title}</span>
                </span>
              </div>
              <span className="text-3xl select-none" title={rank.title}>{rank.badge}</span>
            </div>

            {/* Progress Bar Towards Next Level */}
            <div className="space-y-1.5 pt-2 border-t border-cyan-500/20">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-cyan-400 font-bold">
                  PROGRESS TO LEVEL {newLevel + 1}
                </span>
                <span className="text-slate-300 font-bold">
                  {levelInfo.currentXp} / {levelInfo.maxXp} XP ({levelInfo.percent}%)
                </span>
              </div>

              <div className="w-full h-2.5 bg-dungeon-950 rounded-full overflow-hidden border border-dungeon-800 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-glow-cyan"
                  style={{ width: `${levelInfo.percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="text-slate-500">Current Floor Buffer</span>
                <span className="text-amber-400 font-semibold">
                  {levelInfo.xpRemaining} XP to Level {newLevel + 1}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Unlocked Achievements */}
        {newAchievements.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-left space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-mono">
              <Award className="w-4 h-4" />
              <span>ACHIEVEMENT UNLOCKED!</span>
            </div>
            {newAchievements.map((ach) => (
              <div key={ach.id} className="flex items-center gap-2 text-xs text-slate-200">
                <span className="text-base">{ach.icon}</span>
                <div>
                  <span className="font-bold font-mono">{ach.title}</span>
                  <span className="text-slate-400 ml-1.5">({ach.description})</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            size="md"
            variant="ghost"
            onClick={onReturnToMap}
            className="flex-1"
          >
            Chamber Matrix
          </Button>

          <Button
            size="md"
            variant="primary"
            onClick={onNextChallenge}
            icon={ArrowRight}
            className="flex-1 shadow-glow-cyan"
          >
            Next Sector
          </Button>
        </div>
      </div>
    </Modal>
  );
}
