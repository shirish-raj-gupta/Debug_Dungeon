import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Trophy } from 'lucide-react';
import { MOCK_LEADERBOARD } from '../../data/mockLeaderboard';
import { calculateLevel, getRank } from '../../utils/storage';

export default function LeaderboardModal({
  isOpen,
  onClose,
  profile,
}) {
  const currentLvl = calculateLevel(profile.xp);
  const currentRank = getRank(currentLvl);

  // Combine mock leaderboard with current player sorted by XP
  const combined = [
    ...MOCK_LEADERBOARD,
    {
      handle: profile.handle,
      title: currentRank.title,
      level: currentLvl,
      xp: profile.xp,
      clearedCount: profile.completedChallenges.length,
      avatar: '⚡',
      badge: currentRank.badge,
      isCurrentUser: true,
    }
  ].sort((a, b) => b.xp - a.xp);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="HALL OF SLAYERS // GLOBAL MAINFRAME RANKINGS"
      icon={Trophy}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-400 font-sans">
          Top cyber-debuggers sorted by cumulative bounty XP and cleansed anomalies across Neo-Corvus.
        </p>

        {/* Leaderboard Table */}
        <div className="rounded-xl border border-dungeon-800 bg-dungeon-950/80 overflow-hidden font-mono text-xs">
          <div className="grid grid-cols-12 px-4 py-2.5 bg-dungeon-900/90 border-b border-dungeon-800 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
            <span className="col-span-2">Rank</span>
            <span className="col-span-6">Cyber-Hunter</span>
            <span className="col-span-2 text-center">Purged</span>
            <span className="col-span-2 text-right">Bounty XP</span>
          </div>

          <div className="divide-y divide-dungeon-800/60 max-h-80 overflow-y-auto">
            {combined.map((entry, index) => {
              const rankNum = index + 1;
              const isMe = entry.isCurrentUser;

              return (
                <div
                  key={index}
                  className={`grid grid-cols-12 items-center px-4 py-3 transition-colors ${
                    isMe
                      ? 'bg-cyan-950/40 border-l-2 border-l-cyan-400 text-cyan-200 font-bold'
                      : 'hover:bg-dungeon-900/40 text-slate-300'
                  }`}
                >
                  {/* Rank Column */}
                  <div className="col-span-2 flex items-center gap-1.5">
                    {rankNum === 1 ? (
                      <span className="text-amber-400 font-bold text-sm">#1 🥇</span>
                    ) : rankNum === 2 ? (
                      <span className="text-slate-300 font-bold text-sm">#2 🥈</span>
                    ) : rankNum === 3 ? (
                      <span className="text-amber-600 font-bold text-sm">#3 🥉</span>
                    ) : (
                      <span className="text-slate-500 font-mono">#{rankNum}</span>
                    )}
                  </div>

                  {/* Slayer Column */}
                  <div className="col-span-6 flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="text-lg flex-shrink-0">{entry.avatar}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`truncate font-semibold ${isMe ? 'text-cyan-300' : 'text-white'}`}>
                          {entry.handle}
                        </span>
                        {isMe && (
                          <Badge variant="cyan" size="xs">YOU</Badge>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        LVL {entry.level} • {entry.title}
                      </div>
                    </div>
                  </div>

                  {/* Purged Count */}
                  <div className="col-span-2 text-center text-slate-400 font-semibold">
                    {entry.clearedCount} / 6
                  </div>

                  {/* Bounty XP */}
                  <div className="col-span-2 text-right text-cyan-400 font-bold">
                    {entry.xp.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close Leaderboard
          </Button>
        </div>
      </div>
    </Modal>
  );
}
