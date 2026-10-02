import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { 
  User, 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  Lock 
} from 'lucide-react';
import { ACHIEVEMENTS } from '../../data/achievements';
import { CHALLENGES } from '../../data/challenges';
import { calculateLevel, getRank } from '../../utils/storage';

export default function ProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdateHandle,
  onResetProgress,
}) {
  const [handle, setHandle] = useState(profile.handle);
  const [isEditing, setIsEditing] = useState(false);

  const level = calculateLevel(profile.xp);
  const rank = getRank(level);

  const handleSaveName = (e) => {
    e.preventDefault();
    if (!handle.trim()) return;
    onUpdateHandle(handle.trim());
    setIsEditing(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CYBER-HUNTER DOSSIER // PROFILE"
      icon={User}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Top Profile Header */}
        <div className="p-4 sm:p-5 rounded-xl bg-dungeon-950/90 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border-2 border-cyan-500/40 flex items-center justify-center text-3xl shadow-glow-cyan">
              {rank.badge}
            </div>

            <div>
              {isEditing ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    id="profile-handle-input"
                    name="profileHandle"
                    aria-label="Developer Callsign"
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="px-2.5 py-1 text-sm font-mono bg-dungeon-900 border border-cyan-400 rounded text-white focus:outline-none"
                    autoFocus
                  />
                  <Button size="sm" variant="cyan" type="submit">Save</Button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-mono font-bold text-white">
                    {profile.handle}
                  </h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Edit
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-mono font-bold ${rank.color}`}>
                  {rank.title}
                </span>
                <span className="text-slate-600 font-mono text-xs">•</span>
                <span className="text-xs font-mono text-slate-400">
                  Level {level}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-500 block">TOTAL BOUNTY</span>
            <span className="text-lg font-mono font-bold text-cyan-300">
              {(profile.xp || 0).toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-dungeon-950/60 border border-dungeon-800 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Anomalies</span>
            <span className="text-lg font-mono font-bold text-emerald-400">
              {profile.completedChallenges.length} / {CHALLENGES.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-dungeon-950/60 border border-dungeon-800 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Integrity (HP)</span>
            <span className="text-lg font-mono font-bold text-rose-400">
              {profile.health !== undefined ? profile.health : 100} / 100
            </span>
          </div>

          <div className="p-3 rounded-xl bg-dungeon-950/60 border border-dungeon-800 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Streak</span>
            <span className="text-lg font-mono font-bold text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400" />
              {profile.streak || 0}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-dungeon-950/60 border border-dungeon-800 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Badges</span>
            <span className="text-lg font-mono font-bold text-purple-400">
              {profile.unlockedAchievements.length} / {ACHIEVEMENTS.length}
            </span>
          </div>
        </div>

        {/* Achievements / Medals Showcase */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              SLAYER BADGES & HONORS
            </span>
            <span className="text-slate-500">
              {profile.unlockedAchievements.length} of {ACHIEVEMENTS.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = profile.unlockedAchievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-dungeon-900/90 border-cyan-500/40 text-slate-200 shadow-sm'
                      : 'bg-dungeon-950/40 border-dungeon-800/60 text-slate-500 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 border ${
                    isUnlocked ? 'bg-cyan-950/80 border-cyan-500/40' : 'bg-dungeon-900 border-dungeon-800'
                  }`}>
                    {isUnlocked ? ach.icon : <Lock className="w-4 h-4 text-slate-600" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-mono font-bold truncate ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                        {ach.title}
                      </span>
                      {isUnlocked && (
                        <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {ach.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Danger Zone */}
        <div className="pt-4 border-t border-dungeon-800/80 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Erase all saved progress, purged chambers, and XP? This cannot be undone.')) {
                onResetProgress();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-mono text-rose-400/80 hover:text-rose-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Local Progress</span>
          </button>

          <Button size="sm" variant="outline" onClick={onClose}>
            Close Dossier
          </Button>
        </div>
      </div>
    </Modal>
  );
}
