import React, { useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { Search, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sfx } from '../../utils/sound';

export default function CommandPalette({
  isOpen,
  onClose,
  challenges = [],
  completedChallenges = [],
  onSelectChallenge,
}) {
  const [query, setQuery] = useState('');

  const handleClose = () => {
    setQuery('');
    onClose();
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

  const filtered = challenges.filter(c => {
    const q = query.toLowerCase();
    return (
      (c.title || '').toLowerCase().includes(q) ||
      (c.bossName || '').toLowerCase().includes(q) ||
      (c.stageName || c.category || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      (c.difficulty || '').toLowerCase().includes(q)
    );
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="QUICK INFILTRATION // COMMAND PALETTE"
      icon={Terminal}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
          <input
            id="command-palette-search"
            name="commandPaletteSearch"
            aria-label="Quick search command palette"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type chamber title, enemy name, or sector..."
            className="w-full pl-10 pr-4 py-2.5 bg-dungeon-950/90 border border-cyan-500/40 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            autoFocus
          />
        </div>

        {/* Results List */}
        <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              No matching chamber anomalies detected for "{query}".
            </div>
          ) : (
            filtered.map((ch) => {
              const isDone = completedChallenges.includes(ch.id);
              const floor = ch.floor || getFloor(ch);
              const sector = ch.stageName || ch.category || 'Core Sector';

              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    sfx.playClick();
                    onSelectChallenge(ch);
                    handleClose();
                  }}
                  className="w-full p-2.5 rounded-lg flex items-center justify-between text-left hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl flex-shrink-0">{ch.bossAvatar}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {ch.title}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Floor {floor}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {ch.bossName} • {sector}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isDone ? (
                      <Badge variant="neon" size="xs" icon={CheckCircle2}>
                        PURGED
                      </Badge>
                    ) : (
                      <Badge variant="cyan" size="xs">
                        +{ch.xpReward} XP
                      </Badge>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
