import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Terminal, Trash2, CheckCircle2, XCircle, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { sfx } from '../../utils/sound';

export default function ConsoleOutput({ 
  logs = [], 
  onClearLogs, 
  exitCode = null, 
  isSuccess = null,
  challengeId = '',
  isRunning = false,
}) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleCopyLogs = () => {
    sfx.playClick();
    const text = logs.map(l => `[${l.time || ''}] ${l.text || l.message || ''}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card 
      glow={isSuccess === true ? 'neon' : isSuccess === false ? 'crimson' : 'cyan'} 
      className="p-3 sm:p-4 space-y-2.5 bg-dungeon-950/95 border-dungeon-800 shadow-xl font-mono text-xs"
    >
      {/* Console Topbar */}
      <div className="flex items-center justify-between pb-2 border-b border-dungeon-800 select-none">
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white tracking-wider text-xs">
            V8 SIMULATED RUNTIME CONSOLE
          </span>

          {challengeId && (
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              // patch_{challengeId}.js
            </span>
          )}

          {isRunning ? (
            <Badge variant="amber" size="xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping mr-1" />
              RUNNING
            </Badge>
          ) : exitCode !== null && (
            <Badge variant={exitCode === 0 ? 'neon' : 'crimson'} size="xs">
              EXIT {exitCode}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <>
              <button
                onClick={handleCopyLogs}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 active:scale-95 transition-all"
                title="Copy terminal logs"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => {
                  sfx.playClick();
                  onClearLogs();
                }}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-400 active:scale-95 transition-all"
                title="Clear console"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden md:inline">Clear</span>
              </button>
            </>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-dungeon-800 active:scale-90 transition-all"
            title={collapsed ? 'Expand terminal' : 'Collapse terminal'}
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      {!collapsed && (
        <div className="h-40 sm:h-48 overflow-y-auto rounded-lg bg-black/85 p-3 font-mono text-xs space-y-1.5 border border-dungeon-800/90 shadow-inner">
          {isRunning ? (
            <div className="flex flex-col items-center justify-center h-full text-cyan-400/90 space-y-2 select-none animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-bold text-xs">[SANDBOX_HARNESS] Executing code in isolated V8 sandbox...</span>
              </div>
              <span className="text-[10px] text-slate-500">Injecting mock environments, validating return signatures</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 select-none text-[11px] space-y-2">
              <div className="flex items-center gap-2 text-slate-400 font-semibold">
                <Terminal className="w-4 h-4 text-cyan-500/70" />
                <span>Runtime ready for simulation</span>
              </div>
              <p className="text-slate-500 text-[10px] text-center max-w-sm">
                Press <kbd className="px-1.5 py-0.5 rounded bg-dungeon-900 border border-slate-700 text-slate-300 font-mono">Ctrl+Enter</kbd> to run probes safely without taking HP damage, or submit your fix when confident.
              </p>
            </div>
          ) : (
            logs.map((log, index) => {
              const text = log.text || log.message || '';
              const time = log.time || log.timestamp || '';
              const isErr = log.type === 'stderr' || log.type === 'error' || log.type === 'fail';
              const isPass = log.type === 'pass';
              const isSys = log.type === 'system';

              return (
                <div
                  key={index}
                  className={`flex items-start gap-2 leading-relaxed ${
                    isErr 
                      ? 'text-rose-300 bg-rose-950/20 px-2 py-1 rounded border border-rose-900/40' 
                      : isPass
                      ? 'text-emerald-300'
                      : isSys
                      ? 'text-cyan-400/90 font-semibold'
                      : 'text-slate-300'
                  }`}
                >
                  {time && (
                    <span className="text-[10px] text-slate-600 select-none flex-shrink-0 font-mono mt-0.5">
                      [{time}]
                    </span>
                  )}
                  <span className="select-none font-bold flex-shrink-0 mt-0.5">
                    {isErr ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 inline" />
                    ) : isPass ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                    ) : isSys ? (
                      '›'
                    ) : (
                      '•'
                    )}
                  </span>
                  <span className="whitespace-pre-wrap break-all flex-1 font-mono text-xs">
                    {text}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Error state warning banner if simulation failed */}
      {!collapsed && !isRunning && isSuccess === false && (
        <div className="px-3 py-2 rounded-lg bg-rose-950/30 border border-rose-500/40 text-[11px] text-rose-300 flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span>Anomaly check failed: One or more test probes did not match expected behavior.</span>
          </div>
          <span className="text-[10px] text-rose-400 font-bold hidden sm:inline">Inspect probe assertions below ↓</span>
        </div>
      )}
    </Card>
  );
}
