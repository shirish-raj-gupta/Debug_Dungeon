import React, { useState, useMemo } from 'react';
import ChamberFilter from './ChamberFilter';
import ChamberCard from './ChamberCard';
import BossChamberBanner from './BossChamberBanner';
import { 
  Terminal, 
  ShieldAlert, 
  Crosshair
} from 'lucide-react';
import Button from '../common/Button';
import { sfx } from '../../utils/sound';

export default function DungeonMap({
  challenges,
  completedChallenges = [],
  profile,
  onSelectChallenge
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'incomplete', 'purged'

  const completedCount = completedChallenges.length;
  const totalCount = challenges.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

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

  // Separate regular chambers from the boss chamber
  const bossChallenge = useMemo(() => {
    return challenges.find(c => c.id === 'chamber-boss' || c.isBossChallenge);
  }, [challenges]);

  const regularChallenges = useMemo(() => {
    return challenges.filter(c => c.id !== 'chamber-boss' && !c.isBossChallenge);
  }, [challenges]);

  // Filtered challenges
  const filteredChallenges = useMemo(() => {
    return regularChallenges.filter(ch => {
      // Search filter
      const matchesSearch = 
        searchQuery === '' ||
        ch.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.bossName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ch.stageName || ch.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ch.description || ch.synopsis || '').toLowerCase().includes(searchQuery.toLowerCase());

      // Difficulty filter
      const matchesDifficulty = 
        selectedDifficulty === 'All' || ch.difficulty === selectedDifficulty;

      // Status filter
      const isDone = completedChallenges.includes(ch.id);
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'incomplete' && !isDone) ||
        (statusFilter === 'purged' && isDone);

      return matchesSearch && matchesDifficulty && matchesStatus;
    });
  }, [regularChallenges, searchQuery, selectedDifficulty, statusFilter, completedChallenges]);

  // Find next uncompleted challenge
  const nextTarget = useMemo(() => {
    return challenges.find(c => !completedChallenges.includes(c.id)) || challenges[0];
  }, [challenges, completedChallenges]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Telemetry & Status Briefing */}
      <div className="relative rounded-2xl p-6 sm:p-8 bg-dungeon-900/90 border border-cyan-500/30 overflow-hidden shadow-2xl">
        {/* Ambient Grid Effect inside hero */}
        <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>SYSTEM MAINFRAME STATUS: COMPROMISED</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
              DEBUG<span className="text-cyan-400">_DUNGEON</span> // CHAMBER_MATRIX
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Welcome, <span className="font-mono text-cyan-300 font-bold">{profile.handle}</span>. 
              The core firmware has been infiltrated by mutated runtime bugs, memory leeches, and race conditions. 
              Traverse the dungeon floors, inspect the error traces, patch the buggy code, and purge the system.
            </p>

            {/* Quick telemetry indicators */}
            <div className="flex items-center gap-6 pt-2 text-xs font-mono text-slate-400 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">DUNGEON CLEARANCE:</span>
                <span className="text-white font-bold">{progressPercent}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">ACTIVE TARGETS:</span>
                <span className="text-amber-400 font-bold">{totalCount - completedCount} REMAINING</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">TOTAL BOUNTY:</span>
                <span className="text-cyan-400 font-bold">1,810 XP AVAILABLE</span>
              </div>
            </div>
          </div>

          {/* Quick Engage Target Box */}
          <div className="w-full md:w-auto p-4 rounded-xl bg-dungeon-950/90 border border-dungeon-700/80 space-y-3 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <span>PRIORITY TARGET</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 rounded-lg bg-dungeon-800 border border-dungeon-700">
                {nextTarget.bossAvatar}
              </span>
              <div>
                <p className="text-xs font-mono font-bold text-white truncate max-w-[160px]">
                  {nextTarget.title}
                </p>
                <p className="text-[11px] font-mono text-slate-400">
                  Floor {getFloor(nextTarget)} • {nextTarget.difficulty}
                </p>
              </div>
            </div>

            <Button
              size="md"
              variant="primary"
              onClick={() => {
                sfx.playClick();
                onSelectChallenge(nextTarget);
              }}
              className="w-full text-xs"
            >
              Engage Target
            </Button>
          </div>
        </div>

        {/* Clearance progress bar */}
        <div className="mt-6 pt-4 border-t border-dungeon-800/80">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-400">Dungeon Integrity Recovery</span>
            <span className="text-cyan-400 font-bold">{completedCount} of {totalCount} Purged ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-dungeon-950 rounded-full overflow-hidden border border-dungeon-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <ChamberFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Floor 6 Boss Chamber Feature Banner */}
      {bossChallenge && (
        <BossChamberBanner
          challenge={bossChallenge}
          isCompleted={completedChallenges.includes(bossChallenge.id)}
          onSelect={onSelectChallenge}
        />
      )}

      {/* Chamber Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-mono font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            SUBTERRANEAN SECTORS ({filteredChallenges.length})
          </h2>
          <span className="text-xs font-mono text-slate-500">
            CLICK ANY CHAMBER TO ENTER ARENA
          </span>
        </div>

        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl bg-dungeon-900/40 border border-dungeon-800/80">
            <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-base font-mono text-slate-300 mb-1">No Anomalies Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              No chambers match your current query or filters. Try adjusting your search or difficulty level.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('All');
                setStatusFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <ChamberCard
                key={challenge.id}
                challenge={challenge}
                isCompleted={completedChallenges.includes(challenge.id)}
                onSelect={onSelectChallenge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
