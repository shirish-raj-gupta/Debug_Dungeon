import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Play
} from 'lucide-react';
import { sfx } from '../../utils/sound';

export default function TestResults({ testResults, defaultTestCases = [], onRunTests, isRunning }) {
  const [expandedTest, setExpandedTest] = useState(null);

  const toggleTest = (id) => {
    sfx.playClick();
    setExpandedTest(expandedTest === id ? null : id);
  };

  // If no test has been executed yet, show preview of test assertions
  if (!testResults) {
    return (
      <Card glow="none" className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="font-bold text-slate-200">TEST MATRIX</span>
            <span>({defaultTestCases.length} PROBES PENDING)</span>
          </div>
          <button
            onClick={onRunTests}
            disabled={isRunning}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <Play className="w-3 h-3" />
            Run Now
          </button>
        </div>

        <div className="space-y-2">
          {defaultTestCases.map((tc, idx) => (
            <div
              key={tc.id || idx}
              className="p-3 rounded-lg bg-dungeon-950/60 border border-dungeon-800 text-xs font-mono flex items-center justify-between text-slate-400"
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                  {idx + 1}
                </span>
                <span>{tc.description}</span>
              </div>
              <span className="text-[10px] uppercase text-slate-600">Pending</span>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const { success, tests, passedCount, totalCount, syntaxError } = testResults;

  return (
    <Card 
      glow={success ? 'neon' : 'crimson'} 
      className="p-4 space-y-4 transition-all"
    >
      {/* Header Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400" />
          )}
          <span className="font-mono text-sm font-bold text-white">
            {success ? 'ALL PROBES VERIFIED' : 'ANOMALY PERSISTS'}
          </span>
        </div>

        <Badge variant={success ? 'neon' : 'crimson'} size="sm">
          {passedCount} / {totalCount} PASSED
        </Badge>
      </div>

      {/* Syntax / Compilation Error alert */}
      {syntaxError && (
        <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Syntax / Compilation Trap</span>
            <span>{syntaxError}</span>
          </div>
        </div>
      )}

      {/* Test List Accordion */}
      <div className="space-y-2">
        {tests.map((test, index) => {
          const isExpanded = expandedTest === test.id;
          return (
            <div
              key={test.id || index}
              className={`rounded-lg border transition-all text-xs font-mono overflow-hidden ${
                test.passed
                  ? 'bg-emerald-950/20 border-emerald-900/60 text-slate-300'
                  : 'bg-rose-950/20 border-rose-900/60 text-slate-300'
              }`}
            >
              <button
                onClick={() => toggleTest(test.id)}
                className="w-full p-3 flex items-center justify-between gap-3 text-left focus:outline-none"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                  <span className="font-semibold text-white truncate">
                    Probe #{index + 1}: {test.description}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 text-slate-400">
                  {test.durationMs !== undefined && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      {test.durationMs}ms
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Test Breakdown */}
              {isExpanded && (
                <div className="p-3 pt-0 border-t border-dungeon-800/60 space-y-2 bg-dungeon-950/70">
                  {test.inputStr && (
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Input Arguments:</span>
                      <pre className="p-2 rounded bg-black/60 text-cyan-300 overflow-x-auto text-[11px] mt-0.5">
                        {test.inputStr}
                      </pre>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-emerald-400 uppercase block">Expected:</span>
                      <pre className="p-2 rounded bg-emerald-950/40 border border-emerald-900/40 text-emerald-300 overflow-x-auto text-[11px] mt-0.5">
                        {test.expectedStr}
                      </pre>
                    </div>
                    <div>
                      <span className={`text-[10px] uppercase block ${test.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        Actual Output:
                      </span>
                      <pre className={`p-2 rounded overflow-x-auto text-[11px] mt-0.5 border ${
                        test.passed
                          ? 'bg-emerald-950/40 border-emerald-900/40 text-emerald-300'
                          : 'bg-rose-950/40 border-rose-900/40 text-rose-300'
                      }`}>
                        {test.actualStr}
                      </pre>
                    </div>
                  </div>

                  {test.error && (
                    <div className="text-[11px] text-rose-400 pt-1">
                      ⚠️ Exception: {test.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
