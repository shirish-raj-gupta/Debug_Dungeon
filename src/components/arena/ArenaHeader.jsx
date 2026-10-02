import React from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Lightbulb, 
  Play, 
  ChevronDown 
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { sfx } from '../../utils/sound';

export default function ArenaHeader({
  challenge,
  challenges,
  onSelectChallenge,
  onBack,
  onResetCode,
  onOpenHints,
  onRunTests,
  isRunning,
}) {
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

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-xl bg-dungeon-900/80 border border-dungeon-800 backdrop-blur-md">
      {/* Left: Back button & Chamber Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            sfx.playClick();
            onBack();
          }}
          icon={ArrowLeft}
        >
          Map
        </Button>

        <div className="h-6 w-[1px] bg-dungeon-800 hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-cyan-400">
            F{(challenge.floor || getFloor(challenge)).toString().padStart(2, '0')}
          </span>
          <span className="text-slate-600 font-mono text-xs">//</span>
          
          {/* Quick Challenge Switcher */}
          <div className="relative">
            <select
              id="arena-challenge-select"
              name="activeChallenge"
              aria-label="Select Challenge Chamber"
              value={challenge.id}
              onChange={(e) => {
                const target = challenges.find(c => c.id === e.target.value);
                if (target) onSelectChallenge(target);
              }}
              className="appearance-none bg-dungeon-950/90 text-white font-mono text-xs font-bold pl-3 pr-8 py-1.5 rounded-lg border border-dungeon-700 hover:border-cyan-500/50 focus:outline-none cursor-pointer"
            >
              {challenges.map((c) => (
                <option key={c.id} value={c.id}>
                  Floor {c.floor || getFloor(c)}: {c.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          <Badge variant="cyan" size="xs">
            {challenge.difficulty}
          </Badge>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 justify-end flex-wrap">
        {/* Reset Code */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (window.confirm('Reset code back to the initial buggy state?')) {
              onResetCode();
            }
          }}
          icon={RotateCcw}
          title="Revert to initial buggy code"
        >
          Reset
        </Button>

        {/* Neural Probe Hint Button */}
        <Button
          size="sm"
          variant="amber"
          onClick={() => {
            sfx.playHint();
            onOpenHints();
          }}
          icon={Lightbulb}
        >
          <span>Neural Probe</span>
          <span className="text-[10px] px-1 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 ml-1">
            Hints
          </span>
        </Button>

        {/* Run Tests Button */}
        <Button
          size="sm"
          variant="primary"
          onClick={onRunTests}
          loading={isRunning}
          icon={Play}
          className="shadow-glow-cyan"
        >
          {isRunning ? 'Analyzing...' : 'Deploy Patch'}
          <kbd className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] bg-dungeon-900/60 rounded text-cyan-950 font-semibold">
            Ctrl+↵
          </kbd>
        </Button>
      </div>
    </div>
  );
}
