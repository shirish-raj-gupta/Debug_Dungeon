import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Skull, Sparkles, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { sfx } from '../../utils/sound';

export default function BossChamberBanner({ challenge, isCompleted, onSelect }) {
  if (!challenge) return null;

  return (
    <Card
      glow={isCompleted ? 'neon' : 'crimson'}
      className="p-6 md:p-8 bg-gradient-to-br from-dungeon-900 via-rose-950/20 to-dungeon-950 border-rose-500/40 relative overflow-hidden"
    >
      {/* Background ambient glowing orb */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="crimson" icon={Skull}>
              CORE BOSS CHAMBER
            </Badge>
            <span className="font-mono text-xs text-rose-300">
              FLOOR 06 // SECTOR: THE SINGULARITY
            </span>
            {isCompleted ? (
              <Badge variant="neon" icon={ShieldCheck}>
                OVERLORD DEFEATED
              </Badge>
            ) : (
              <Badge variant="amber" icon={AlertTriangle}>
                APOCALYPTIC LEVEL EVENT
              </Badge>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-mono font-extrabold text-white flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">{challenge.bossAvatar}</span>
            <span>{challenge.bossName}</span>
          </h2>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            {challenge.lore}
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 flex-wrap">
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <Skull className="w-3.5 h-3.5" />
              THREAT: {challenge.threatLevel}
            </span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              BOUNTY: +{challenge.xpReward} XP
            </span>
            <span className="text-cyan-400">
              CATEGORY: Prototype Pollution Prevention
            </span>
          </div>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch lg:items-center gap-3">
          <Button
            size="lg"
            variant={isCompleted ? 'neon' : 'crimson'}
            onClick={() => {
              sfx.playClick();
              onSelect(challenge);
            }}
            icon={ArrowRight}
            className="w-full lg:w-auto text-base shadow-glow-crimson"
          >
            {isCompleted ? 'Re-Challenge Overlord' : 'Engage Boss Fight'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
