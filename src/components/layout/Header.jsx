import React from 'react';
import { 
  Terminal, 
  Settings, 
  Flame, 
  Heart,
  Volume2,
  VolumeX,
  Tv,
  Play,
  Compass
} from 'lucide-react';
import { getLevelInfo } from '../../utils/storage';
import { sfx } from '../../utils/sound';

export default function Header({
  profile,
  onOpenSettings,
  onToggleSound,
  onToggleScanlines,
  onOpenLevelUp,
  onGoHome,
  onEnterDungeon,
  currentView = 'dungeon',
}) {
  const {
    level: currentLvl,
    rank,
    percent: xpPercent,
    xpRemaining,
    maxXp
  } = getLevelInfo(profile.xp);

  const health = profile.health !== undefined ? profile.health : 100;
  const isLowHealth = health <= 25 && health > 0;
  const streak = profile.streak || 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dungeon-700/80 bg-dungeon-950/90 backdrop-blur-xl">
      {/* Top Cyber Energy Pulse Line */}
      <div className={`h-[2px] w-full transition-all ${
        isLowHealth 
          ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600 shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-pulse'
          : 'bg-gradient-to-r from-cyan-500 via-emerald-400 to-purple-500 shadow-glow-cyan'
      }`} />

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo Section (Clickable to navigate between Landing and Dungeon) */}
        <div 
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer select-none group"
          title="Return to Debug Dungeon Overview"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-950 to-dungeon-900 border border-cyan-500/50 group-hover:border-cyan-400 group-hover:shadow-glow-cyan transition-all">
            <Terminal className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black tracking-widest text-lg sm:text-xl text-white group-hover:text-cyan-200 transition-colors">
                DEBUG<span className="text-cyan-400 animate-pulse">_DUNGEON</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 hidden sm:inline-block">
                ARCADE v1.2
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 hidden sm:block tracking-tight">
              NEO-CORVUS // ANOMALY CONSOLE
            </p>
          </div>
        </div>

        {/* Center / Right Player HUD: Level, XP Progress, Streak, Settings */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Low Health Warning Pill (Header Alert) */}
          {isLowHealth && (
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-950/90 border border-red-500/70 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
              title="CRITICAL INTEGRITY: Health is critically low!"
            >
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 animate-heartbeat-rapid" />
              <span className="text-xs font-mono font-black text-red-200">
                {health} HP
              </span>
              <span className="hidden md:inline text-[9px] font-mono font-black uppercase text-red-400 bg-red-900/60 px-1 py-0.2 rounded">
                DANGER
              </span>
            </div>
          )}

          {/* Player Level & XP Gauge */}
          <div 
            onClick={onOpenLevelUp}
            className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-dungeon-900/90 border border-cyan-500/30 hover:border-cyan-400 active:scale-95 shadow-sm cursor-pointer transition-all group"
            title={`${profile.xp || 0} / ${maxXp} XP (${xpPercent}%) • ${xpRemaining} XP to LVL ${currentLvl + 1} (Click to inspect track)`}
          >
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                <span className="text-xs font-mono font-extrabold text-white">
                  LVL {currentLvl}
                </span>
                <span className={`text-[10px] font-mono uppercase font-semibold hidden md:inline ${rank.color}`}>
                  {rank.title}
                </span>
              </div>

              {/* Progress Bar towards next level */}
              <div className="hidden sm:block w-24 sm:w-36 h-2 bg-dungeon-950 rounded-full overflow-hidden mt-1 border border-dungeon-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500 shadow-glow-cyan"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            <span className="text-lg sm:text-xl select-none" title={`${rank.title} — ${rank.description}`}>{rank.badge}</span>
          </div>

          {/* Consecutive Solve Streak (With Ignited State for streak >= 2) */}
          <div 
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all ${
              streak >= 2
                ? 'bg-gradient-to-r from-amber-950/80 to-orange-950/80 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : streak > 0
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-glow-amber'
                : 'bg-dungeon-900/60 border-dungeon-800 text-slate-400'
            }`}
            title="Consecutive Challenge Solve Streak"
          >
            <div className="relative">
              <Flame className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${
                streak >= 2
                  ? 'text-amber-400 fill-amber-400 animate-flame-burn'
                  : streak > 0 
                  ? 'text-amber-400 fill-amber-400 animate-pulse' 
                  : 'text-slate-500'
              }`} />
            </div>
            <div className="text-left font-mono">
              <span className={`text-xs font-extrabold block leading-none ${streak >= 2 ? 'text-amber-300' : ''}`}>
                {streak}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-amber-400/80 hidden xs:inline">
                {streak >= 2 ? 'STREAK 🔥' : 'STREAK'}
              </span>
            </div>
          </div>

          {/* View Switcher Button (Enter Dungeon or View Landing) */}
          {currentView === 'landing' ? (
            <button
              onClick={() => {
                sfx.playSuccess();
                onEnterDungeon();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold transition-all active:scale-95 shadow-glow-cyan"
              title="Launch Debug Dungeon Console"
            >
              <Play className="w-3.5 h-3.5 fill-current text-cyan-400" />
              <span>Enter Dungeon</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sfx.playClick();
                onGoHome();
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-dungeon-900/80 hover:bg-dungeon-800 border border-dungeon-700/80 hover:border-cyan-500/40 text-slate-300 hover:text-white font-mono text-xs transition-all active:scale-95"
              title="Return to Landing Screen & Overview"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Overview</span>
            </button>
          )}

          {/* Utility Quick Toggles */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-dungeon-800">
            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-lg transition-colors ${
                profile.soundEnabled 
                  ? 'text-cyan-400 hover:bg-cyan-500/10' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-dungeon-800'
              }`}
              title={profile.soundEnabled ? 'Mute Audio SFX' : 'Enable Audio SFX'}
            >
              {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Scanlines Toggle */}
            <button
              onClick={onToggleScanlines}
              className={`p-2 rounded-lg transition-colors ${
                profile.scanlinesEnabled 
                  ? 'text-cyan-400 hover:bg-cyan-500/10' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-dungeon-800'
              }`}
              title={profile.scanlinesEnabled ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => {
                sfx.playClick();
                onOpenSettings();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dungeon-900 border border-dungeon-700/80 hover:border-cyan-400 text-slate-300 hover:text-white transition-all shadow-sm group"
              title="Game Settings"
            >
              <Settings className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-mono text-xs font-semibold hidden md:inline">
                Settings
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
