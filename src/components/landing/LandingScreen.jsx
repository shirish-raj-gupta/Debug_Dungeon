import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { 
  Terminal, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  ArrowRight, 
  Cpu, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Heart,
  Crown,
  Play
} from 'lucide-react';
import { sfx } from '../../utils/sound';
import { getLevelInfo } from '../../utils/storage';

export default function LandingScreen({
  onEnterDungeon,
  profile,
  challengeCount = 16,
}) {
  const { level, rank } = getLevelInfo(profile?.xp || 0);
  const completedCount = profile?.completedChallenges?.length || 0;
  const isStarted = completedCount > 0;

  const handleEnter = () => {
    sfx.playSuccess();
    onEnterDungeon();
  };

  return (
    <div className="flex-1 flex flex-col justify-center max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10 animate-in fade-in zoom-in-95 duration-300">
      
      {/* ========================================================
          HERO SECTION
          ======================================================== */}
      <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Cybernetic Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-[0_0_20px_rgba(0,242,254,0.25)] backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-extrabold tracking-widest uppercase">
            NEO-CORVUS ANOMALY ENGINE // v1.2
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            {challengeCount} Interactive Chambers Active
          </span>
        </div>

        {/* Main Title & Subtitle */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-mono font-black text-white tracking-tight sm:tracking-wide">
            DEBUG<span className="text-cyan-400 drop-shadow-[0_0_35px_rgba(0,242,254,0.7)] animate-pulse">_DUNGEON</span>
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
            "Fix Bug, Gain XP, Defeat Production."
          </p>
        </div>

        {/* Short Description */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-normal">
          Debug Dungeon is a gamified debugging challenge platform engineered for developers. 
          Enter a subterranean matrix of corrupted codebases, analyze real-world JavaScript &amp; React failures, 
          inspect execution traces in an isolated runtime, and restore mission-critical production systems before cascading meltdowns occur.
        </p>

        {/* Large Primary Action: "Enter the Dungeon" */}
        <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleEnter}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-dungeon-950 font-mono font-black text-lg sm:text-xl shadow-[0_0_35px_rgba(0,242,254,0.5)] hover:shadow-[0_0_55px_rgba(0,242,254,0.85)] transition-all duration-200 active:scale-[0.97] active:translate-y-[1px] flex items-center justify-center gap-3.5 group cursor-pointer border border-cyan-300"
          >
            <Play className="w-5 h-5 fill-current text-dungeon-950 transition-transform group-hover:scale-110" />
            <span>ENTER THE DUNGEON</span>
            {isStarted && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dungeon-950/25 text-dungeon-950 font-black uppercase tracking-wider hidden sm:inline-block">
                RESUME
              </span>
            )}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
            <kbd className="hidden md:inline-block px-2 py-0.5 rounded text-[11px] bg-dungeon-950/30 text-dungeon-950 font-black border border-dungeon-950/30">
              ↵ ENTER
            </kbd>
          </button>
        </div>

        {/* Player Profile Quick Status Bar (If existing progress) */}
        {isStarted && (
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 py-2 rounded-xl bg-dungeon-900/80 border border-dungeon-800 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Crown className="w-3.5 h-3.5" />
              LVL {level} [{rank.title}]
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {completedCount} / {challengeCount} Chambers Purged
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-rose-400 font-bold hidden sm:inline-flex">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              {profile.health || 100} HP
            </span>
            {profile.streak > 0 && (
              <>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
                  {profile.streak} Streak (x{(profile.combo || 1.0).toFixed(1)})
                </span>
              </>
            )}
          </div>
        )}

        {/* System Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto pt-2 text-left font-mono">
          <div className="p-2.5 rounded-xl bg-dungeon-900/60 border border-dungeon-800/80 flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Chambers</div>
              <div className="text-xs font-black text-white">16 Challenges</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-dungeon-900/60 border border-dungeon-800/80 flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Harness</div>
              <div className="text-xs font-black text-white">Isolated V8 Sandbox</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-dungeon-900/60 border border-dungeon-800/80 flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Combos</div>
              <div className="text-xs font-black text-white">Up to 3.0x Multiplier</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-dungeon-900/60 border border-dungeon-800/80 flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Climax</div>
              <div className="text-xs font-black text-white">SEV-0 Titan Boss</div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          THREE CORE FEATURE CARDS
          ======================================================== */}
      <div className="mt-14 sm:mt-18 pt-10 border-t border-dungeon-800/80">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5 font-mono">
          <Badge variant="cyan" size="sm" className="tracking-widest uppercase">
            CORE PLATFORM MODULES
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            ENGINEERED FOR REAL DIAGNOSTICS
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Three foundational systems working together to elevate your debugging instincts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* ----------------------------------------------------
              FEATURE CARD 1: Debug Dungeon
              ---------------------------------------------------- */}
          <Card 
            glow="cyan" 
            className="p-6 bg-dungeon-900/90 border-dungeon-700/80 flex flex-col justify-between hover:border-cyan-400/60 transition-all duration-200 group"
          >
            <div className="space-y-4">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-dungeon-800 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase">
                  MODULE // 01
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.3)] flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Terminal className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-mono font-black text-white tracking-wide">
                    Debug Dungeon
                  </h3>
                  <div className="text-[11px] font-mono text-cyan-400/90 font-bold uppercase tracking-wider">
                    Subterranean Code Matrix
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Infiltrate 16 interactive coding chambers across 5 subterranean floors. 
                Tackle syntax errors, immutable React state mutations, Promise handling bugs, and API gateway traps.
                Every chamber runs inside a real-time isolated V8 sandbox with automated probe assertions.
              </p>

              {/* Mini Terminal Preview Widget */}
              <div className="p-3 rounded-xl bg-dungeon-950/90 border border-cyan-500/30 font-mono text-[11px] space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-dungeon-800 pb-1">
                  <span>patch_syn-01.js</span>
                  <span className="text-emerald-400 font-bold">SANDBOX PASS</span>
                </div>
                <div className="text-slate-400 text-[10px] truncate">
                  <span className="text-purple-400">function</span> <span className="text-cyan-300">calculateExpression</span>(a, op, b) &#123;
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300 text-[10px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span>Probe #1: Zero multiplication handled</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300 text-[10px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span>Probe #2: Strict operator equality verified</span>
                </div>
              </div>
            </div>

            {/* Bottom Tag Footer */}
            <div className="mt-5 pt-3 border-t border-dungeon-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Chamber Scope:</span>
              <span className="text-cyan-300 font-bold">5 Subterranean Floors</span>
            </div>
          </Card>

          {/* ----------------------------------------------------
              FEATURE CARD 2: RPG Progression
              ---------------------------------------------------- */}
          <Card 
            glow="amber" 
            className="p-6 bg-dungeon-900/90 border-dungeon-700/80 flex flex-col justify-between hover:border-amber-400/60 transition-all duration-200 group"
          >
            <div className="space-y-4">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-dungeon-800 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">
                  MODULE // 02
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 animate-pulse text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-mono font-black text-white tracking-wide">
                    RPG Progression
                  </h3>
                  <div className="text-[11px] font-mono text-amber-400/90 font-bold uppercase tracking-wider">
                    Ascension &amp; Reputation
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Earn XP bounties for every anomaly purged. Ascend through 5 prestigious developer ranks—from 
                Code Novice to Production Guardian. Build consecutive solve streaks to trigger combo multipliers 
                up to 3.0x, manage system integrity HP, and recharge neural probe hints.
              </p>

              {/* Mini HUD Preview Widget */}
              <div className="p-3 rounded-xl bg-dungeon-950/90 border border-amber-500/30 font-mono text-[11px] space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">RANK ADVANCEMENT</span>
                  <span className="text-amber-300 font-black">LVL 13 👑</span>
                </div>
                <div className="w-full h-2 bg-dungeon-900 rounded-full overflow-hidden border border-dungeon-800">
                  <div className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 rounded-full w-4/5" />
                </div>
                <div className="flex items-center justify-between text-[10px] pt-0.5">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    COMBO x2.0 ACTIVE
                  </span>
                  <span className="text-emerald-400 font-bold">100 HP</span>
                </div>
              </div>
            </div>

            {/* Bottom Tag Footer */}
            <div className="mt-5 pt-3 border-t border-dungeon-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Reputation Tiers:</span>
              <span className="text-amber-300 font-bold">5 Developer Classes</span>
            </div>
          </Card>

          {/* ----------------------------------------------------
              FEATURE CARD 3: Production Boss Battle
              ---------------------------------------------------- */}
          <Card 
            glow="crimson" 
            className="p-6 bg-dungeon-900/90 border-dungeon-700/80 flex flex-col justify-between hover:border-rose-400/60 transition-all duration-200 group"
          >
            <div className="space-y-4">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-dungeon-800 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] text-rose-400 font-bold tracking-wider uppercase">
                  MODULE // 03
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-400/60 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)] flex-shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-6 h-6 animate-pulse text-rose-400" />
                </div>
                <div>
                  <h3 className="text-xl font-mono font-black text-white tracking-wide">
                    Production Boss Battle
                  </h3>
                  <div className="text-[11px] font-mono text-rose-400/90 font-bold uppercase tracking-wider">
                    SEV-0 Titan Meltdown
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Descend into the final chamber to face the SEV-0 Titan. Experience a simulated multi-service 
                cascading outage with real-time incident timelines, live application logs, and cluster telemetry. 
                Identify the root cause, choose the surgical fix, and earn a massive +1,500 XP bounty.
              </p>

              {/* Mini Incident Alert Preview Widget */}
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 font-mono text-[11px] space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-rose-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    SEV-0 CRITICAL INCIDENT
                  </span>
                  <span className="text-rose-400 font-mono">99.4% SPIKE</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  [12:51:30] worker-pod-8c4d7: Heap allocation failed
                </div>
                <div className="flex items-center justify-between text-[10px] pt-0.5 border-t border-rose-900/50">
                  <span className="text-slate-400">Bounty Reward</span>
                  <span className="text-amber-400 font-black">+1,500 XP</span>
                </div>
              </div>
            </div>

            {/* Bottom Tag Footer */}
            <div className="mt-5 pt-3 border-t border-dungeon-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Incident Severity:</span>
              <span className="text-rose-400 font-bold">SEV-0 Production Outage</span>
            </div>
          </Card>

        </div>
      </div>

    </div>
  );
}
