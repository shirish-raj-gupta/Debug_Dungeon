import React from 'react';
import { GitBranch, Cpu, CheckCircle2 } from 'lucide-react';

export default function Footer({ completedCount = 0, totalCount = 6, onOpenSearch }) {
  return (
    <footer className="w-full border-t border-dungeon-800 bg-dungeon-950/90 text-slate-400 font-mono text-xs py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Status Indicators */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold">CONSOLE_READY</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
            <GitBranch className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-slate-400">main</span>
            <span className="text-slate-600">[0x7A9F]</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-500">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>HEAP: 38.4MB / 128MB</span>
          </div>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{completedCount} / {totalCount} ANOMALIES PURGED</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-500">
            <span>SHORTCUTS:</span>
            <span className="px-1.5 py-0.5 rounded bg-dungeon-800 border border-dungeon-700 text-slate-300">
              Ctrl+Enter: Run Tests
            </span>
            <button
              type="button"
              onClick={onOpenSearch}
              className="px-1.5 py-0.5 rounded bg-dungeon-800 hover:bg-dungeon-700 border border-dungeon-700 hover:border-cyan-500/50 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
              title="Open Quick Infiltration Command Palette (Ctrl+K)"
            >
              Ctrl+K: Search
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
