import React from 'react';
import { Search, Filter, CheckCircle2, ShieldAlert } from 'lucide-react';
import { sfx } from '../../utils/sound';

export default function ChamberFilter({
  searchQuery,
  setSearchQuery,
  selectedDifficulty,
  setSelectedDifficulty,
  statusFilter,
  setStatusFilter,
  difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Nightmare']
}) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-dungeon-900/60 border border-dungeon-800 backdrop-blur-md">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
        <input
          id="chamber-filter-search"
          name="chamberFilterSearch"
          aria-label="Filter anomalies by title, boss, or sector keyword"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter anomalies by title, boss, or sector keyword..."
          className="w-full pl-10 pr-4 py-2 bg-dungeon-950/80 border border-dungeon-700/80 rounded-lg text-sm font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Difficulty Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        <span className="text-xs font-mono text-slate-500 flex items-center gap-1 pl-1 pr-2">
          <Filter className="w-3.5 h-3.5 text-cyan-500" />
          DIFF:
        </span>
        {difficulties.map((diff) => {
          const isActive = selectedDifficulty === diff;
          return (
            <button
              key={diff}
              onClick={() => {
                sfx.playClick();
                setSelectedDifficulty(diff);
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200 bg-dungeon-950/60 border border-dungeon-800'
              }`}
            >
              {diff}
            </button>
          );
        })}
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-1.5 border-t md:border-t-0 md:border-l border-dungeon-800 pt-2 md:pt-0 md:pl-4">
        <button
          onClick={() => {
            sfx.playClick();
            setStatusFilter('all');
          }}
          className={`px-2 py-1 text-xs font-mono rounded-md transition-colors ${
            statusFilter === 'all'
              ? 'bg-dungeon-700 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ALL
        </button>
        <button
          onClick={() => {
            sfx.playClick();
            setStatusFilter('incomplete');
          }}
          className={`px-2 py-1 text-xs font-mono rounded-md flex items-center gap-1 transition-colors ${
            statusFilter === 'incomplete'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3 h-3 text-amber-400" />
          ACTIVE
        </button>
        <button
          onClick={() => {
            sfx.playClick();
            setStatusFilter('purged');
          }}
          className={`px-2 py-1 text-xs font-mono rounded-md flex items-center gap-1 transition-colors ${
            statusFilter === 'purged'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          PURGED
        </button>
      </div>
    </div>
  );
}
