import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import CodeEditor from './CodeEditor';
import ConsoleOutput from './ConsoleOutput';
import { 
  Lightbulb, 
  Play, 
  CheckCircle2, 
  SkipForward, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Target,
  Flame
} from 'lucide-react';
import { sfx } from '../../utils/sound';

export default function ChallengePanel({
  challenge,
  code,
  onCodeChange,
  onResetCode,
  onRunCode,
  onSubmitFix,
  onSkip,
  onOpenHint,
  hintsRemaining = 3,
  isRunning = false,
  testResults,
  simulationLogs = [],
  onClearLogs,
  exitCode = null,
  isCompleted = false,
  streak = 0,
  combo = 1.0,
}) {
  const [copiedExpected, setCopiedExpected] = useState(false);
  const [showProbes, setShowProbes] = useState(true);

  const handleCopyExpected = () => {
    sfx.playClick();
    navigator.clipboard.writeText(challenge.expectedBehavior || '');
    setCopiedExpected(true);
    setTimeout(() => setCopiedExpected(false), 2000);
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Beginner': return 'cyan';
      case 'Intermediate': return 'purple';
      case 'Hard': return 'amber';
      case 'Advanced': return 'amber';
      case 'Master': return 'crimson';
      case 'Nightmare': return 'crimson';
      default: return 'cyan';
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Syntax error': return 'cyan';
      case 'React state bugs': return 'purple';
      case 'Async JavaScript bugs': return 'amber';
      case 'API bugs': return 'rose';
      case 'Production bugs': return 'crimson';
      default: return 'gray';
    }
  };

  return (
    <div key={challenge.id} className="space-y-4 font-mono transition-all duration-300 animate-in fade-in-50 zoom-in-[0.99] slide-in-from-bottom-2">
      {/* 1. Header Banner: Title, Category, Difficulty, XP Reward */}
      <Card glow="cyan" className="p-4 sm:p-5 bg-dungeon-900/95 border-cyan-500/40 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-xl bg-dungeon-950 border border-cyan-500/30 shadow-inner select-none">
              {challenge.bossAvatar || '👾'}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {/* Category Badge */}
                <Badge variant={getCategoryBadge(challenge.category)} size="xs">
                  {challenge.category}
                </Badge>
                {/* Difficulty Badge */}
                <Badge variant={getDifficultyBadge(challenge.difficulty)} size="xs">
                  {challenge.difficulty}
                </Badge>
                {isCompleted && (
                  <Badge variant="neon" size="xs">
                    CLEARED
                  </Badge>
                )}
              </div>
              {/* Idea Title */}
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                {challenge.title}
              </h2>
            </div>
          </div>

          {/* Right Header Badges: Streak Indicator & XP Reward Pill */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0 flex-wrap">
            {streak >= 2 && (
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/80 via-orange-950/80 to-amber-950/80 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse"
                title={`${streak} challenges solved in a row! x${combo.toFixed(1)} XP Multiplier Active`}
              >
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-flame-burn" />
                <span className="text-xs font-mono font-black">
                  {streak}X STREAK (x{combo.toFixed(1)})
                </span>
              </div>
            )}

            {/* XP Reward Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-extrabold tracking-wider">
                +{challenge.xpReward} XP BOUNTY
              </span>
            </div>
          </div>
        </div>

        {/* 2. Description & Expected Behavior */}
        <div className="mt-4 pt-3 border-t border-dungeon-800 space-y-3 font-sans">
          {/* Description */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
              CHALLENGE BRIEFING // PROBLEM SCENARIO:
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {challenge.description}
            </p>
          </div>

          {/* Expected Behavior Callout Box */}
          <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/40 p-3.5 space-y-1.5 font-mono text-xs text-emerald-200">
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-emerald-900/60">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-wide">
                <Target className="w-3.5 h-3.5" />
                EXPECTED BEHAVIOR
              </span>
              <button
                onClick={handleCopyExpected}
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-emerald-300 transition-colors"
                title="Copy expected behavior"
              >
                {copiedExpected ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedExpected ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="font-sans text-xs text-emerald-100/90 leading-relaxed pt-1">
              {challenge.expectedBehavior}
            </p>
          </div>
        </div>
      </Card>

      {/* 3. Interactive Code Editor with Line Numbers, Syntax Highlighting & Editable Code */}
      <div className="space-y-2">
        <CodeEditor
          challengeId={challenge.id}
          code={code}
          onChange={onCodeChange}
          onResetCode={onResetCode}
          onRunCode={onRunCode}
          isRunning={isRunning}
        />

        {/* 4. Action Buttons Bar: Hint, Skip, Run Code, Submit Fix */}
        <Card glow="none" className="p-3 bg-dungeon-900/90 border-dungeon-800 flex flex-wrap items-center justify-between gap-2 shadow-lg">
          {/* Left Actions: Hint & Skip */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={hintsRemaining > 0 ? "amber" : "ghost"}
              onClick={onOpenHint}
              icon={Lightbulb}
              title={hintsRemaining > 0 ? "Deploy 1 Neural Probe for a tactical hint" : "No hints remaining"}
            >
              <span>Hint</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded border ${
                hintsRemaining > 0
                  ? 'bg-amber-950 border-amber-500/40 text-amber-300'
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
              }`}>
                {hintsRemaining} Left
              </span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={onSkip}
              icon={SkipForward}
              title="Skip to another unlocked chamber (Gives 0 XP)"
            >
              <span>Skip</span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">(0 XP)</span>
            </Button>
          </div>

          {/* Right Actions: Run Code & Submit Fix */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onRunCode}
              loading={isRunning}
              icon={Play}
              title="Simulate execution without taking HP damage (Ctrl+Enter)"
            >
              Run Code
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={onSubmitFix}
              loading={isRunning}
              icon={CheckCircle2}
              className="shadow-glow-cyan"
              title="Validate fix against expected solution and purge anomaly"
            >
              Submit Fix
            </Button>
          </div>
        </Card>
      </div>

      {/* 5. Simulated Runtime Console Output */}
      <ConsoleOutput
        logs={simulationLogs}
        onClearLogs={onClearLogs}
        exitCode={exitCode}
        isSuccess={testResults ? testResults.success : null}
        challengeId={challenge.id}
        isRunning={isRunning}
      />

      {/* Loading state indicator while running tests */}
      {isRunning && !testResults && (
        <Card glow="cyan" className="p-3.5 bg-dungeon-950/90 border-cyan-500/40 flex items-center justify-between text-xs font-mono text-cyan-300 animate-pulse">
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <span className="font-bold">EVALUATING TEST HARNESS PROBES...</span>
          </div>
          <span className="text-[10px] text-cyan-400/80 hidden sm:inline">Executing automated assertions</span>
        </Card>
      )}

      {/* 6. Diagnostic Test Assertions Probes */}
      {testResults && (
        <Card 
          glow={testResults.success ? 'neon' : 'crimson'} 
          className="p-3.5 sm:p-4 space-y-3 bg-dungeon-950/95 border-dungeon-800 animate-in fade-in-50 duration-200"
        >
          <div className="flex items-center justify-between border-b border-dungeon-800 pb-2">
            <div className="flex items-center gap-2">
              {testResults.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400" />
              )}
              <span className="font-bold text-sm text-white">
                {testResults.success ? 'ALL PROBES VERIFIED' : 'TEST ASSERTION FAILED'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={testResults.success ? 'neon' : 'crimson'} size="xs">
                {testResults.passedCount} / {testResults.totalCount} PASSED
              </Badge>
              <button
                onClick={() => setShowProbes(!showProbes)}
                className="text-slate-400 hover:text-white"
                title={showProbes ? 'Collapse probes' : 'Expand probes'}
              >
                {showProbes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {showProbes && (
            <div className="space-y-2">
              {/* Syntax / Runtime Error Callout */}
              {(testResults.syntaxError || testResults.runtimeError) && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block text-rose-200">Execution Error Diagnostic</span>
                    <pre className="font-mono text-[11px] whitespace-pre-wrap leading-relaxed text-rose-300">
                      {testResults.syntaxError || testResults.runtimeError}
                    </pre>
                  </div>
                </div>
              )}

              {/* Individual Probes */}
              {testResults.tests && testResults.tests.map((test, idx) => (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                    test.passed 
                      ? 'bg-emerald-950/20 border-emerald-900/50 text-slate-300' 
                      : 'bg-rose-950/20 border-rose-900/50 text-rose-200'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 font-bold">
                      {test.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      )}
                      <span>Probe #{idx + 1}: {test.description}</span>
                    </div>

                    {!test.passed && (
                      <div className="pl-5 text-[11px] space-y-0.5">
                        {test.expectedStr && (
                          <div className="text-slate-400">
                            Expected: <code className="text-emerald-400 font-mono">{test.expectedStr}</code>
                          </div>
                        )}
                        {test.actualStr && (
                          <div className="text-rose-300">
                            Actual: <code className="text-rose-400 font-mono">{test.actualStr}</code>
                          </div>
                        )}
                        {test.error && (
                          <div className="text-rose-400/90 italic pt-0.5">
                            Reason: {test.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {test.durationMs !== undefined && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {test.durationMs}ms
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
