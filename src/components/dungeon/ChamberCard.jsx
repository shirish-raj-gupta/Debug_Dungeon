import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Sparkles
} from 'lucide-react';
import { sfx } from '../../utils/sound';

export default function ChamberCard({ challenge, isCompleted, onSelect }) {
  const getGlowVariant = () => {
    if (isCompleted) return 'neon';
    switch (challenge.difficulty) {
      case 'Beginner': return 'cyan';
      case 'Intermediate': return 'purple';
      case 'Advanced': return 'amber';
      case 'Nightmare': return 'crimson';
      default: return 'cyan';
    }
  };

  const getDifficultyBadge = () => {
    switch (challenge.difficulty) {
      case 'Beginner': return 'cyan';
      case 'Intermediate': return 'purple';
      case 'Advanced': return 'amber';
      case 'Nightmare': return 'crimson';
      default: return 'gray';
    }
  };

  const getFloor = (c) => {
    if (!c) return 1;
    if (c.floor) return c.floor;
    const floors = {
      'Syntax error': 1,
      'React state bugs': 2,
      'Async JavaScript bugs': 3,
      'API bugs': 4,
      'Production bugs': 5,
    };
    return floors[c.category] || 1;
  };

  const floorNumber = challenge.floor || getFloor(challenge);
  const sectorName = challenge.stageName || challenge.category || challenge.sector || 'MAIN';
  const synopsisText = challenge.description || challenge.synopsis || '';
  const bossTitle = challenge.bossTitle || challenge.stageName || challenge.category || 'Anomaly Entity';
  const threat = challenge.threatLevel || challenge.difficulty || 'MODERATE';

  return (
    <Card 
      glow={getGlowVariant()}
      className="p-5 flex flex-col justify-between group overflow-hidden border"
    >
      <div>
        {/* Top Header: Floor & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <span className="text-cyan-400 font-bold">F{floorNumber.toString().padStart(2, '0')}</span>
            <span>//</span>
            <span className="uppercase tracking-wider text-[11px] truncate">{sectorName}</span>
          </div>

          {isCompleted ? (
            <Badge variant="neon" icon={CheckCircle2}>
              PURGED
            </Badge>
          ) : (
            <Badge variant={getDifficultyBadge()} icon={ShieldAlert}>
              {challenge.difficulty}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-mono font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 flex items-center justify-between">
          <span className="truncate">{challenge.title}</span>
        </h3>

        {/* Synopsis */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
          {synopsisText}
        </p>

        {/* Boss / Glitch Entity HUD Preview */}
        <div className="p-3 rounded-lg bg-dungeon-950/70 border border-dungeon-800/80 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-1.5 rounded-lg bg-dungeon-800/80 border border-dungeon-700/60 shadow-inner">
              {challenge.bossAvatar}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-slate-200">
                  {challenge.bossName}
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                {bossTitle}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              Threat
            </span>
            <span className={`text-xs font-mono font-bold ${
              threat === 'APOCALYPTIC' || threat === 'BOSS // OMEGA'
                ? 'text-rose-400 animate-pulse' 
                : threat === 'Critical' || threat === 'Nightmare' || threat === 'Master'
                ? 'text-rose-400'
                : threat === 'Hard' || threat === 'Advanced'
                ? 'text-amber-400' 
                : 'text-cyan-400'
            }`}>
              {threat}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info & Enter Button */}
      <div className="pt-3 border-t border-dungeon-800/70 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-amber-400 font-bold" title="XP Reward on Purge">
            <Sparkles className="w-3.5 h-3.5" />
            +{challenge.xpReward} XP
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            {challenge.testCases.length} Tests
          </span>
        </div>

        <Button
          size="sm"
          variant={isCompleted ? 'neon' : 'cyan'}
          onClick={() => {
            sfx.playClick();
            onSelect(challenge);
          }}
          icon={ArrowRight}
          className="shadow-sm"
        >
          {isCompleted ? 'Re-Enter' : 'Infiltrate'}
        </Button>
      </div>
    </Card>
  );
}
