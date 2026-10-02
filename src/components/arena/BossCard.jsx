import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { 
  Skull, 
  Terminal, 
  Copy, 
  Check, 
  Crosshair
} from 'lucide-react';
import { sfx } from '../../utils/sound';

export default function BossCard({ challenge, testResults, isCompleted }) {
  const [copied, setCopied] = useState(false);

  // Calculate Boss HP based on test results
  let passedCount = 0;
  let totalTests = challenge.testCases.length;
  if (testResults && testResults.tests) {
    passedCount = testResults.tests.filter(t => t.passed).length;
    totalTests = testResults.tests.length;
  } else if (isCompleted) {
    passedCount = totalTests;
  }

  const remainingRatio = totalTests > 0 ? (totalTests - passedCount) / totalTests : 1;
  const bossHpPercent = Math.round(remainingRatio * 100);

  const handleCopyTrace = () => {
    sfx.playClick();
    navigator.clipboard.writeText(challenge.errorLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card glow={isCompleted || bossHpPercent === 0 ? 'neon' : 'cyan'} className="p-5 space-y-4">
      {/* Glitch Boss HUD */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`relative p-3 rounded-xl bg-dungeon-950 border ${
            bossHpPercent === 0 
              ? 'border-emerald-500/40 text-emerald-400' 
              : 'border-rose-500/40 text-rose-400'
          }`}>
            <span className="text-3xl select-none">{challenge.bossAvatar}</span>
            {bossHpPercent === 0 && (
              <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 text-dungeon-950">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-mono font-bold text-white tracking-wide">
                {challenge.bossName}
              </h3>
              <Badge variant={bossHpPercent === 0 ? 'neon' : 'crimson'} size="xs">
                {bossHpPercent === 0 ? 'PURGED' : (challenge.threatLevel || challenge.difficulty || 'OMEGA')}
              </Badge>
            </div>
            <p className="text-xs font-mono text-slate-400">
              {challenge.bossTitle || challenge.stageName || challenge.category || 'Cluster Anomaly'}
            </p>
          </div>
        </div>

        {/* Floor Indicator */}
        <div className="text-right font-mono text-xs text-slate-500">
          <div>FLOOR {challenge.floor || 5}</div>
          <div className="text-cyan-400 font-bold">{challenge.stageName || challenge.category || challenge.sector || 'PRODUCTION'}</div>
        </div>
      </div>

      {/* Dynamic Boss HP Bar */}
      <div className="space-y-1.5 p-3 rounded-lg bg-dungeon-950/80 border border-dungeon-800">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Skull className="w-3.5 h-3.5 text-rose-400" />
            ENTITY INTEGRITY (HP)
          </span>
          <span className={`font-bold ${bossHpPercent === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {bossHpPercent}% ({totalTests - passedCount}/{totalTests} SHIELDS REMAINING)
          </span>
        </div>
        <div className="w-full h-2.5 bg-dungeon-900 rounded-full overflow-hidden border border-dungeon-800">
          <div
            className={`h-full transition-all duration-500 ${
              bossHpPercent === 0
                ? 'bg-emerald-500'
                : bossHpPercent < 40
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : 'bg-gradient-to-r from-rose-600 to-rose-400'
            }`}
            style={{ width: `${bossHpPercent}%` }}
          />
        </div>
      </div>

      {/* Chamber Synopsis & Objective */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
          <Crosshair className="w-3.5 h-3.5" />
          Mission Synopsis & Objective
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {challenge.description || challenge.synopsis || ''}
        </p>
      </div>

      {/* Real Stack Trace / Error Telemetry */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1 text-rose-400">
            <Terminal className="w-3.5 h-3.5" />
            CRASH TELEMETRY // STACK TRACE
          </span>
          <button
            onClick={handleCopyTrace}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy Trace'}</span>
          </button>
        </div>

        <div className="p-3 rounded-lg bg-black/60 border border-rose-950/80 font-mono text-[11px] text-rose-300/90 leading-relaxed overflow-x-auto whitespace-pre selection:bg-rose-900/50">
          {challenge.errorLog}
        </div>
      </div>
    </Card>
  );
}
