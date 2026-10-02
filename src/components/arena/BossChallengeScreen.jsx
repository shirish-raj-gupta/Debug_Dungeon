import React, { useState, useEffect, useRef } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { 
  AlertTriangle, 
  Terminal, 
  Activity, 
  Clock, 
  ShieldAlert, 
  Server, 
  Cpu, 
  Database, 
  Radio, 
  Zap, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Search,
  FileCode,
  ArrowLeft,
  Volume2
} from 'lucide-react';
import { sfx } from '../../utils/sound';

export default function BossChallengeScreen({
  challenge,
  code,
  onCodeChange,
  onResetCode,
  onRunCode,
  onSubmitFix,
  _onSkip,
  isRunning,
  testResults,
  _simulationLogs = [],
  exitCode,
  _isCompleted,
  onReturnToMap,
}) {
  // Elapsed incident timer (live ticking clock from start of incident)
  const [elapsedSeconds, setElapsedSeconds] = useState(874); // ~14m 34s
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsed = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `T+${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Sound cue on initial load
  useEffect(() => {
    sfx.playBossAlarm();
  }, []);

  // Three Possible Debugging Actions state & diagnostics
  const [activeActionId, setActiveActionId] = useState(null);
  const [actionDiagnosticResult, setActionDiagnosticResult] = useState(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Application live logs filter and search
  const [logFilter, setLogFilter] = useState('ALL');
  const [logSearch, setLogSearch] = useState('');

  const INITIAL_INCIDENT_LOGS = [
    { id: 1, level: 'FATAL', origin: 'worker-mesh-04', time: '12:51:02', text: 'CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory (3980MB/4096MB)' },
    { id: 2, level: 'ERROR', origin: 'payment-gateway', time: '12:51:08', text: 'UnhandledPromiseRejection: Webhook timeout on tx_fail caused unhandled promise rejection in forEach loop!' },
    { id: 3, level: 'ERROR', origin: 'cluster-state', time: '12:51:14', text: 'InvariantViolation: Concurrent in-place mutation of clusterState.activeNodes corrupted shared memory across 4 worker threads.' },
    { id: 4, level: 'FATAL', origin: 'ingress-proxy', time: '12:51:22', text: 'HTTP 503 / 500 Spike: 91.2% requests dropped on /api/v2/checkout/processBatch' },
    { id: 5, level: 'WARN', origin: 'event-bus', time: '12:51:30', text: 'ListenerLimitExceededWarning: Possible EventEmitter memory leak detected. 12,480 heartbeat listeners added!' },
    { id: 6, level: 'ERROR', origin: 'orchestrator', time: '12:51:42', text: 'Process terminating prematurely with exit code 1. Healthcheck failure in pod cluster-worker-8c4d7.' },
    { id: 7, level: 'WARN', origin: 'telemetry', time: '12:51:50', text: 'Event loop lag exceeded threshold: 4,280ms (critical threshold 100ms)' },
    { id: 8, level: 'FATAL', origin: 'failover-controller', time: '12:52:05', text: 'Failover cluster replica crash-looped upon consuming transaction batch queue' }
  ];

  const [incidentLogs] = useState(INITIAL_INCIDENT_LOGS);

  // Filtered logs
  const filteredLogs = incidentLogs.filter(log => {
    if (logFilter !== 'ALL' && log.level !== logFilter) return false;
    if (logSearch.trim()) {
      const q = logSearch.toLowerCase();
      return log.text.toLowerCase().includes(q) || log.origin.toLowerCase().includes(q);
    }
    return true;
  });

  // Diagnostic Action Definitions
  const DEBUGGING_ACTIONS = [
    {
      id: 'infra',
      title: 'Action 1: Scale Pods & Double Memory Limits',
      subtitle: 'Infrastructure Capacity Intervention',
      icon: Server,
      accent: 'amber',
      hypothesis: 'Hypothesis A: Outage is caused by sudden traffic volume exceeding pod capacity. Scale Kubernetes deployment from 12 to 36 pods and increase memory limit to 8GB.',
      executeDiagnostic: () => {
        setIsDiagnosing(true);
        sfx.playScan();
        setTimeout(() => {
          setIsDiagnosing(false);
          setActionDiagnosticResult({
            success: false,
            actionId: 'infra',
            headline: '❌ DIAGNOSTIC FAILED // SYMPTOM ONLY',
            explanation: '24 new replica pods were spawned. However, each pod immediately crashed within 350ms with identical heap memory exhaustion! The memory leak occurs on every batch execution. Scaling pods simply accelerates memory starvation.',
            takeaway: 'The root cause is in application code, not container resources.'
          });
          sfx.playFail();
        }, 800);
      }
    },
    {
      id: 'database',
      title: 'Action 2: Flush Redis & Terminate Postgres Pool',
      subtitle: 'Data Layer & Cache Intervention',
      icon: Database,
      accent: 'amber',
      hypothesis: 'Hypothesis B: Outage is caused by database row deadlocks or corrupted cache keys. Force-kill active queries and clear Redis cache.',
      executeDiagnostic: () => {
        setIsDiagnosing(true);
        sfx.playScan();
        setTimeout(() => {
          setIsDiagnosing(false);
          setActionDiagnosticResult({
            success: false,
            actionId: 'database',
            headline: '❌ DIAGNOSTIC FAILED // IRRELEVANT COMPONENT',
            explanation: 'PostgreSQL active queries were terminated and Redis flushed. Database CPU remained idle at 2.4%. The bottleneck is inside the in-memory Node.js event batch processor before database connections are ever dispatched!',
            takeaway: 'Database is healthy; the failure is in the in-memory processing loop.'
          });
          sfx.playFail();
        }, 800);
      }
    },
    {
      id: 'root-cause',
      title: 'Action 3: Isolate & Hotfix Multi-Bug in processClusterBatch',
      subtitle: 'Application Code Root Cause Remediation',
      icon: Cpu,
      accent: 'rose',
      hypothesis: 'Hypothesis C (Root Cause): processClusterBatch combines three fatal flaws: (1) unhandled async promise rejection in forEach loop, (2) in-place shared state mutation, and (3) unbounded event listener memory leak.',
      executeDiagnostic: () => {
        setIsDiagnosing(true);
        sfx.playScan();
        setTimeout(() => {
          setIsDiagnosing(false);
          setActionDiagnosticResult({
            success: true,
            actionId: 'root-cause',
            headline: '🎯 ROOT CAUSE ISOLATED & CONFIRMED!',
            explanation: 'Static analysis and heap trace confirmed all 3 combined failure vectors in processClusterBatch:\n• Array.forEach with async callback ignores Promise rejections and causes dropped transactions.\n• clusterState.activeNodes is mutated in-place, corrupting shared memory.\n• clusterState.eventBus.on() inside the transaction loop leaks thousands of listeners to heap.\n\nRemediation blueprint loaded into the Hotfix Editor below!',
            takeaway: 'Implement the immutable clone, sequential/safe async loop, and listener cleanup in the code editor below.'
          });
          sfx.playSuccess();
        }, 800);
      }
    }
  ];

  // Code editor lines
  const lines = (code || '').split('\n');
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onCodeChange(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="boss-screen-vignette text-slate-100 font-mono space-y-6 animate-in fade-in zoom-in-[0.99] duration-300">
      
      {/* 1. LARGE SEV-0 WARNING BANNER */}
      <div className="relative rounded-2xl border-2 border-rose-500/80 bg-rose-950/40 p-5 shadow-2xl overflow-hidden animate-boss-alarm-strobe">
        {/* Diagonal Hazard Stripes Header */}
        <div className="absolute inset-0 boss-hazard-banner opacity-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Alarm Strobe Light Beacon */}
            <div className="relative w-14 h-14 rounded-2xl bg-rose-600/30 border-2 border-rose-400 flex items-center justify-center text-3xl shadow-glow-crimson flex-shrink-0 animate-pulse">
              <span>🚨</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-400 rounded-full animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[11px] tracking-wider animate-pulse">
                  SEV-0 CRITICAL ALERT
                </span>
                <span className="text-xs text-rose-300 font-bold">
                  DEFCON 1 // GLOBAL APPLICATION BLACKOUT
                </span>
                <Badge variant="crimson" size="xs">
                  BOUNTY: +{challenge.xpReward} XP
                </Badge>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide mt-1">
                {challenge.title}
              </h1>

              <p className="text-xs text-rose-200/90 font-sans mt-0.5 max-w-3xl leading-relaxed">
                Primary payment orchestrator in total cascading meltdown. Multiple combined anomalies (Async Deadlock + In-Place State Mutation + Memory Leak) have severed 100% of transaction traffic.
              </p>
            </div>
          </div>

          {/* Incident Clock & Quick Controls */}
          <div className="flex items-center gap-3 self-end md:self-auto flex-shrink-0">
            <div className="px-4 py-2 rounded-xl bg-dungeon-950/90 border border-rose-500/40 text-right shadow-inner">
              <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Elapsed Outage</span>
              </div>
              <div className="text-lg font-black text-rose-300 tracking-wider">
                {formatElapsed(elapsedSeconds)}
              </div>
            </div>

            <button
              onClick={() => sfx.playBossAlarm()}
              className="p-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 hover:text-white transition-all shadow-md"
              title="Test Siren Audio"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {onReturnToMap && (
              <button
                onClick={onReturnToMap}
                className="px-3.5 py-2.5 rounded-xl bg-dungeon-900/90 hover:bg-dungeon-800 border border-dungeon-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dungeon Map</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Ticker Metrics Bar */}
        <div className="mt-4 pt-3 border-t border-rose-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs relative z-10">
          <div className="p-2 rounded-lg bg-dungeon-950/60 border border-rose-500/20">
            <span className="text-[10px] text-slate-400 block uppercase">Impacted Users</span>
            <span className="text-white font-bold text-sm">2,418,920 SESSIONS</span>
          </div>
          <div className="p-2 rounded-lg bg-dungeon-950/60 border border-rose-500/20">
            <span className="text-[10px] text-slate-400 block uppercase">Financial Burn</span>
            <span className="text-rose-400 font-bold text-sm">$18,400 / MINUTE</span>
          </div>
          <div className="p-2 rounded-lg bg-dungeon-950/60 border border-rose-500/20">
            <span className="text-[10px] text-slate-400 block uppercase">Cluster Availability</span>
            <span className="text-rose-400 font-bold text-sm">0.00% (DOWN)</span>
          </div>
          <div className="p-2 rounded-lg bg-dungeon-950/60 border border-rose-500/20">
            <span className="text-[10px] text-slate-400 block uppercase">Failover Status</span>
            <span className="text-amber-400 font-bold text-sm">EXHAUSTED</span>
          </div>
        </div>
      </div>

      {/* 2. SPLIT COMMAND CENTER: SYSTEM METRICS + TIMELINE & APPLICATION LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): System Metrics & Incident Timeline */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SYSTEM METRICS HUD */}
          <Card glow="crimson" className="p-4 bg-dungeon-900/90 border-rose-500/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>LIVE SYSTEM TELEMETRY GAUGE</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                CRITICAL ANOMALY
              </span>
            </div>

            <div className="space-y-3.5">
              {/* CPU Saturation */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-rose-400" />
                    CPU Core Saturation
                  </span>
                  <span className="text-rose-400 font-bold">99.8% (CRITICAL)</span>
                </div>
                <div className="w-full h-2 bg-dungeon-950 rounded-full overflow-hidden border border-dungeon-800">
                  <div className="h-full bg-rose-500 rounded-full w-[99.8%] animate-pulse shadow-glow-crimson" />
                </div>
              </div>

              {/* Memory Footprint */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-rose-400" />
                    V8 Heap Memory
                  </span>
                  <span className="text-rose-400 font-bold">3.92 GB / 4.00 GB (98%)</span>
                </div>
                <div className="w-full h-2 bg-dungeon-950 rounded-full overflow-hidden border border-dungeon-800">
                  <div className="h-full bg-rose-500 rounded-full w-[98%] shadow-glow-crimson" />
                </div>
              </div>

              {/* Event Loop Lag */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Event Loop Latency
                  </span>
                  <span className="text-amber-400 font-bold">4,280 ms (NORMAL: &lt;20ms)</span>
                </div>
                <div className="w-full h-2 bg-dungeon-950 rounded-full overflow-hidden border border-dungeon-800">
                  <div className="h-full bg-amber-500 rounded-full w-[94%]" />
                </div>
              </div>

              {/* HTTP Error Rate */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    HTTP 500 Failure Rate
                  </span>
                  <span className="text-rose-400 font-bold">89.4% ERROR RATE</span>
                </div>
                <div className="w-full h-2 bg-dungeon-950 rounded-full overflow-hidden border border-dungeon-800">
                  <div className="h-full bg-rose-600 rounded-full w-[89.4%]" />
                </div>
              </div>
            </div>
          </Card>

          {/* INCIDENT TIMELINE */}
          <Card glow="none" className="p-4 bg-dungeon-900/90 border-dungeon-700/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-3">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>INCIDENT CASCADE TIMELINE</span>
            </div>

            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-dungeon-700">
              <div className="relative pl-6 text-xs">
                <div className="absolute left-1 top-1 w-2.5 h-2.5 rounded-full bg-slate-400 -translate-x-1" />
                <span className="text-slate-400 font-bold">T-15m (12:40:00)</span>
                <p className="text-slate-300 font-sans text-[11px] mt-0.5">
                  Deployment of <code className="text-cyan-400">v4.19.0-prod</code> dispatched to 64 cluster nodes.
                </p>
              </div>

              <div className="relative pl-6 text-xs">
                <div className="absolute left-1 top-1 w-2.5 h-2.5 rounded-full bg-amber-400 -translate-x-1" />
                <span className="text-amber-400 font-bold">T-11m (12:44:12)</span>
                <p className="text-slate-300 font-sans text-[11px] mt-0.5">
                  Event loop lag spiked above 4,000ms. Ingress proxy client timeouts spike on batch endpoints.
                </p>
              </div>

              <div className="relative pl-6 text-xs">
                <div className="absolute left-1 top-1 w-2.5 h-2.5 rounded-full bg-rose-400 -translate-x-1" />
                <span className="text-rose-400 font-bold">T-07m (12:47:30)</span>
                <p className="text-slate-300 font-sans text-[11px] mt-0.5">
                  Shared state mutation in-place corrupts parallel worker threads; duplicate charges leak to heap.
                </p>
              </div>

              <div className="relative pl-6 text-xs">
                <div className="absolute left-1 top-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping -translate-x-1" />
                <span className="text-rose-300 font-extrabold">T-00m (NOW)</span>
                <p className="text-rose-200 font-sans text-[11px] mt-0.5">
                  Pod heap limit breached (4096MB). 100% gateway downtime. Urgent hotfix required.
                </p>
              </div>
            </div>
          </Card>

          {/* APPLICATION LIVE LOG CONSOLE */}
          <Card glow="none" className="p-4 bg-dungeon-950 border-dungeon-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>APPLICATION LOG STREAM</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE TAIL
              </span>
            </div>

            {/* Filter buttons & Search */}
            <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
              {['ALL', 'FATAL', 'ERROR', 'WARN'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                    logFilter === lvl
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-dungeon-900 text-slate-400 border-dungeon-800 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}

              <div className="relative flex-1 min-w-[120px]">
                <Search className="w-3 h-3 text-slate-500 absolute left-2 top-1.5" />
                <input
                  id="incident-log-search"
                  name="incidentLogSearch"
                  type="text"
                  placeholder="Search logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full bg-dungeon-900 border border-dungeon-800 rounded pl-6 pr-2 py-0.5 text-[10px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Terminal Window */}
            <div className="h-44 overflow-y-auto rounded-lg bg-black/80 border border-dungeon-800 p-2.5 text-[10.5px] font-mono space-y-1.5 select-text">
              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 py-6 text-center select-none space-y-1">
                  <Search className="w-4 h-4 text-slate-600 mb-0.5" />
                  <span className="text-[11px] font-mono text-slate-400 font-bold">NO MATCHING INCIDENT LOGS</span>
                  <span className="text-[10px] text-slate-600 font-sans">No log records found for "{logSearch}" under [{logFilter}] filter.</span>
                  <button 
                    onClick={() => { setLogSearch(''); setLogFilter('ALL'); }}
                    className="mt-1 text-[10px] text-rose-400 hover:text-rose-300 underline font-mono"
                  >
                    Reset Search & Filters
                  </button>
                </div>
              ) : (
                filteredLogs.map(log => (
                  <div key={log.id} className="leading-snug hover:bg-white/[0.02] px-1 py-0.5 rounded transition-colors">
                    <span className="text-slate-500 mr-1.5 font-mono">[{log.time}]</span>
                    <span className={`px-1 py-0.2 rounded font-bold mr-1.5 text-[9px] ${
                      log.level === 'FATAL' 
                        ? 'bg-rose-600 text-white' 
                        : log.level === 'ERROR' 
                        ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-cyan-400 mr-1.5 font-mono">[{log.origin}]</span>
                    <span className="text-slate-300">{log.text}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (7 cols): Three Debugging Actions + Hotfix Code Editor */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* THREE POSSIBLE DEBUGGING ACTIONS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>TRIAGE ACTIONS: IDENTIFY ROOT CAUSE</span>
              </div>
              <span className="text-[10px] text-slate-400 font-sans">
                Test hypotheses to isolate the failure
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {DEBUGGING_ACTIONS.map(action => {
                const Icon = action.icon;
                const isSelected = activeActionId === action.id;

                return (
                  <div
                    key={action.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500 shadow-glow-crimson'
                        : 'bg-dungeon-900/80 border-dungeon-700/80 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          action.id === 'root-cause' 
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40' 
                            : 'bg-dungeon-950 text-amber-400 border border-dungeon-800'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {action.title}
                            </span>
                            {action.id === 'root-cause' && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-black">
                                RECOMMENDED
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-relaxed">
                            {action.hypothesis}
                          </p>
                        </div>
                      </div>

                      <button
                        disabled={isDiagnosing}
                        onClick={() => {
                          setActiveActionId(action.id);
                          action.executeDiagnostic();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                          action.id === 'root-cause'
                            ? 'bg-gradient-to-r from-rose-600 to-crimson-600 hover:from-rose-500 hover:to-crimson-500 text-white shadow-glow-crimson'
                            : 'bg-dungeon-800 hover:bg-dungeon-700 text-slate-200 border border-dungeon-700'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Test Action</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Diagnostic Result Banner */}
            {isDiagnosing && (
              <div className="p-3 rounded-xl bg-dungeon-950 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2 animate-pulse">
                <Radio className="w-4 h-4 animate-spin" />
                <span>Running automated triage diagnostic across staging pods...</span>
              </div>
            )}

            {actionDiagnosticResult && !isDiagnosing && (
              <div className={`p-4 rounded-xl border animate-in fade-in duration-200 ${
                actionDiagnosticResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-glow-neon text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/60 shadow-glow-crimson text-rose-200'
              }`}>
                <div className="flex items-center gap-2 text-xs font-black">
                  {actionDiagnosticResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>{actionDiagnosticResult.headline}</span>
                </div>
                <p className="text-xs font-sans mt-1 text-slate-300 whitespace-pre-line leading-relaxed">
                  {actionDiagnosticResult.explanation}
                </p>
                <div className="mt-2 text-[11px] font-bold text-slate-200">
                  Key Insight: {actionDiagnosticResult.takeaway}
                </div>

                {actionDiagnosticResult.success && challenge.solution && (
                  <div className="mt-3 pt-2.5 border-t border-emerald-500/30 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] text-emerald-300 font-sans">
                      Blueprint remediation code verified. Ready to apply to editor?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onCodeChange(challenge.solution);
                        sfx.playSuccess();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-dungeon-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-glow-neon cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Apply Verified Blueprint to Editor</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BUGGY CODE SECTION & HOTFIX CONSOLE */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  HOTFIX CONSOLE: clusterOrchestrator.js
                </span>
              </div>
              <Badge variant="crimson" size="xs">
                COMBINED BUG HOTFIX
              </Badge>
            </div>

            {/* Code Editor Container */}
            <div className="rounded-xl border-2 border-rose-500/60 bg-dungeon-950 overflow-hidden shadow-2xl">
              {/* Window Titlebar */}
              <div className="px-4 py-2 bg-dungeon-900 border-b border-dungeon-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-slate-300 font-bold ml-1">clusterOrchestrator.js</span>
                </div>
                <div className="flex items-center gap-3">
                  {challenge.solution && (
                    <button
                      type="button"
                      onClick={() => {
                        onCodeChange(challenge.solution);
                        sfx.playSuccess();
                      }}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors text-[11px] font-bold cursor-pointer"
                      title="Load verified incident hotfix blueprint"
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      <span>Load Blueprint Solution</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onResetCode}
                    className="flex items-center gap-1 hover:text-white transition-colors text-[11px] cursor-pointer"
                    title="Revert to original incident buggy code"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Revert Buggy Code</span>
                  </button>
                </div>
              </div>

              {/* Editor Body */}
              <div className="relative flex min-h-[300px] max-h-[460px] overflow-hidden">
                {/* Line numbers */}
                <div className="w-12 bg-dungeon-950/90 py-3 text-right pr-3 select-none text-slate-600 text-xs font-mono border-r border-dungeon-800/80">
                  {lines.map((_, i) => (
                    <div key={i} className="leading-6">
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  id="boss-code-editor-textarea"
                  name="bossHotfixCode"
                  aria-label="Production Incident Hotfix Code Editor"
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => onCodeChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck="false"
                  className="flex-1 bg-transparent text-slate-100 p-3 font-mono text-xs leading-6 resize-none focus:outline-none code-editor-textarea overflow-y-auto selection:bg-rose-500/30 selection:text-white"
                />
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-dungeon-900/90 border-t border-dungeon-800 flex items-center justify-between gap-3 flex-wrap">
                <div className="text-[11px] text-slate-400 font-sans">
                  💡 Hint: Fix unhandled Promise in async loop, shallow-clone <code className="text-cyan-300">clusterState</code>, and remove <code className="text-rose-400">eventBus.on</code>.
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onRunCode}
                    disabled={isRunning}
                    className="border-slate-700"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Run Staging Sandbox</span>
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onSubmitFix}
                    disabled={isRunning}
                    className="bg-gradient-to-r from-rose-600 to-crimson-600 hover:from-rose-500 hover:to-crimson-500 text-white border-rose-400 shadow-glow-crimson font-black tracking-wide"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Deploy Production Hotfix</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Test Results Output */}
            {testResults && (
              <div className={`p-4 rounded-xl border animate-in fade-in duration-200 ${
                testResults.success
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-glow-neon'
                  : 'bg-rose-950/30 border-rose-500/50 shadow-glow-crimson'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    {testResults.success ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">HOTFIX VALIDATED // 3/3 PROBES PASSED</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-300">
                          HOTFIX REJECTED ({testResults.passedCount}/{testResults.totalCount} PASSED)
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Exit Code: {exitCode ?? (testResults.success ? 0 : 1)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {testResults.tests?.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded bg-dungeon-950/60">
                      <span className="text-slate-300 truncate max-w-[80%]">
                        {idx + 1}. {t.description}
                      </span>
                      <span className={`font-bold text-[11px] ${t.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.passed ? 'PASSED ✔' : 'FAILED ✖'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
