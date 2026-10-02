import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { 
  Heart, 
  Sparkles, 
  Flame, 
  Lightbulb, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Cpu
} from 'lucide-react';
import { getLevelInfo } from '../../utils/storage';

export default function DeveloperStatusPanel({
  profile,
  activityLog = [],
  combo = 1.0,
  hintsRemaining = 3,
  onOpenLevelUp,
}) {
  const {
    level,
    rank,
    maxXp,
    percent: xpPercent,
    xpRemaining
  } = getLevelInfo(profile.xp);

  const health = profile.health !== undefined ? profile.health : 100;
  const maxHealth = profile.maxHealth || 100;
  const healthPercent = Math.round((health / maxHealth) * 100);

  return (
    <div className="space-y-4 font-mono">
      {/* 1. Developer Profile HUD Card */}
      <Card 
        glow="cyan" 
        onClick={onOpenLevelUp}
        className="p-4 bg-dungeon-900/90 border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all group"
        title="Click to inspect Developer Ascension Track & Level Progression"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-950 to-dungeon-950 border-2 border-cyan-400 flex items-center justify-center text-2xl shadow-glow-cyan">
            {rank.badge}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-dungeon-950 animate-pulse" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-white truncate">
                {profile.handle}
              </span>
              <Badge variant="cyan" size="xs">
                LVL {level}
              </Badge>
            </div>
            <p className={`text-[10px] font-semibold truncate ${rank.color}`}>
              {rank.title}
            </p>
          </div>
        </div>

        {/* 2. Health Meter (With Low-Health Warning Effect) */}
        <div className={`mt-4 pt-3 border-t border-dungeon-800 space-y-1.5 p-2 rounded-xl transition-all ${
          health <= 25 ? 'bg-red-950/40 border border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' : ''
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={`flex items-center gap-1.5 font-bold ${
              health <= 25 ? 'text-red-400' : 'text-rose-400'
            }`}>
              <Heart className={`w-3.5 h-3.5 fill-current ${
                health <= 25 ? 'text-red-500 animate-heartbeat-rapid' : 'fill-rose-500 animate-pulse'
              }`} />
              INTEGRITY (HP)
            </span>
            <div className="flex items-center gap-1.5">
              {health <= 25 && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-red-500/20 text-red-300 border border-red-500/50">
                  LOW HP
                </span>
              )}
              <span className={`font-extrabold ${health <= 25 ? 'text-red-300 font-mono' : 'text-rose-300'}`}>
                {health} / {maxHealth}
              </span>
            </div>
          </div>

          <div className="w-full h-2.5 bg-dungeon-950 rounded-full overflow-hidden border border-dungeon-800">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                healthPercent > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-glow-neon'
                  : healthPercent > 25
                  ? 'bg-gradient-to-r from-amber-500 to-orange-400 shadow-glow-amber'
                  : 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-glow-crimson animate-pulse'
              }`}
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>

        {/* 3. XP Level Progress Towards Next Level */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              PROGRESS TO LVL {level + 1}
            </span>
            <span className="text-slate-300 text-[11px] font-bold">
              {profile.xp} / {maxXp} XP ({xpPercent}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-dungeon-950 rounded-full overflow-hidden border border-dungeon-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700 shadow-glow-cyan"
              style={{ width: `${xpPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span className="truncate max-w-[120px]">{rank.title}</span>
            <span className="text-cyan-300 font-medium">{xpRemaining} XP to Lvl {level + 1}</span>
          </div>
        </div>
      </Card>

      {/* 4. Current Combo & Streak Card (With Dynamic Ignition Feedback) */}
      <Card 
        glow={combo > 1.0 || (profile.streak || 0) > 0 ? 'amber' : 'none'} 
        className={`p-4 transition-all relative overflow-hidden ${
          (profile.streak || 0) >= 2
            ? 'bg-gradient-to-br from-amber-950/40 via-orange-950/20 to-dungeon-950 border-amber-400/70 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
            : 'bg-gradient-to-br from-amber-950/20 via-dungeon-900/90 to-dungeon-950 border-amber-500/40'
        }`}
      >
        {/* Top burning streak laser line when streak >= 2 */}
        {(profile.streak || 0) >= 2 && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 animate-pulse" />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Flame className={`w-4 h-4 fill-amber-400 ${
              (profile.streak || 0) >= 2 ? 'animate-flame-burn text-red-400' : 'animate-bounce'
            }`} />
            <span>COMBO & STREAK</span>
          </div>
          <Badge 
            variant={(profile.streak || 0) >= 2 ? 'amber' : (profile.streak || 0) > 0 ? 'amber' : 'gray'} 
            size="xs"
            className={(profile.streak || 0) >= 2 ? 'border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] font-black' : ''}
          >
            🔥 {profile.streak || 0} {(profile.streak || 0) >= 2 ? 'STREAK ON FIRE!' : (profile.streak || 0) === 1 ? 'SOLVE' : 'SOLVES'}
          </Badge>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wider">
            x{combo.toFixed(1)}
          </div>
          <span className="text-[10px] text-amber-400/80 uppercase font-semibold">
            {combo > 1.0 ? `+${Math.round((combo - 1) * 100)}% XP BOOST` : 'Normal Multiplier'}
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-amber-950/60 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">Consecutive Streak:</span>
          <span className={`font-bold ${(profile.streak || 0) >= 2 ? 'text-amber-300 animate-pulse' : 'text-amber-400'}`}>
            {profile.streak || 0} in a row
          </span>
        </div>

        <p className="text-[10px] text-slate-400 font-sans mt-1 leading-tight">
          Solve consecutive challenges to build multiplier momentum! Incorrect submissions break streak and deal HP damage.
        </p>
      </Card>

      {/* 5. Hints Remaining Gauge Card */}
      <Card glow="none" className="p-4 bg-dungeon-900/90 border-dungeon-800">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Lightbulb className="w-3.5 h-3.5" />
            NEURAL PROBES (HINTS)
          </span>
          <span className="text-white font-bold">
            {hintsRemaining} / 3
          </span>
        </div>

        {/* 3 Visual Battery Cells */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((cellIdx) => {
            const isAvailable = cellIdx <= hintsRemaining;
            return (
              <div
                key={cellIdx}
                className={`h-3 rounded-md border transition-all ${
                  isAvailable
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 border-amber-300 shadow-glow-amber'
                    : 'bg-dungeon-950 border-dungeon-800 opacity-40'
                }`}
              />
            );
          })}
        </div>
      </Card>

      {/* 6. Live Activity Log */}
      <Card glow="none" className="p-4 bg-dungeon-900/90 border-dungeon-800 space-y-2">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-dungeon-800">
          <span className="flex items-center gap-1.5 text-slate-300 font-bold">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            ACTIVITY LOG
          </span>
          <span className="text-[10px] text-slate-500">LIVE FEED</span>
        </div>

        <div className="h-36 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
          {activityLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center px-2 select-none space-y-1.5 py-4">
              <Activity className="w-5 h-5 text-slate-600 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">TELEMETRY_STANDBY</span>
              <span className="text-[10px] text-slate-600 font-sans">Solve challenges or run tests to generate real-time audit logs.</span>
            </div>
          ) : (
            activityLog.slice(0, 8).map((log, i) => (
              <div
                key={log.id ? `${log.id}-${i}` : i}
                className="flex items-start gap-1.5 leading-snug text-slate-300 hover:text-white transition-colors"
              >
                <span className="text-[10px] text-slate-500 flex-shrink-0 font-mono">
                  {log.time || '19:40'}
                </span>
                <span className="text-cyan-400 select-none">›</span>
                <span className="break-words">{log.text}</span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* 7. Active Cyber Buffs */}
      <div className="p-3 rounded-xl bg-dungeon-950/70 border border-dungeon-800 text-[10px] space-y-1.5 text-slate-400">
        <span className="font-bold text-slate-500 uppercase tracking-wider block">
          SYSTEM AUGMENTS
        </span>
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Strict Mode
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Sandboxed
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            ES2024
          </span>
        </div>
      </div>
    </div>
  );
}
