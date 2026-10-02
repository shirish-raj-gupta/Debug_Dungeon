import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DungeonMapColumn from './components/dungeon/DungeonMapColumn';
import ChallengePanel from './components/arena/ChallengePanel';
import DeveloperStatusPanel from './components/profile/DeveloperStatusPanel';
import SettingsModal from './components/settings/SettingsModal';
import HintModal from './components/arena/HintModal';
import VictoryModal from './components/arena/VictoryModal';
import LevelUpModal from './components/profile/LevelUpModal';
import BossChallengeScreen from './components/arena/BossChallengeScreen';
import BossVictoryModal from './components/arena/BossVictoryModal';
import CommandPalette from './components/command/CommandPalette';
import EventFeedbackEffects from './components/effects/EventFeedbackEffects';
import LandingScreen from './components/landing/LandingScreen';
import { Map, Terminal, User } from 'lucide-react';

import { CHALLENGES, isChallengeUnlocked } from './data/challenges';
import { ACHIEVEMENTS } from './data/achievements';
import { simulateChallengeExecution, validateChallengeSolution } from './utils/simulator';
import { sfx } from './utils/sound';
import { 
  loadProfile, 
  saveProfile, 
  resetProfile, 
  calculateLevel, 
  getRank 
} from './utils/storage';

export default function App() {
  // Player Profile & RPG State (Persisted in localStorage)
  const [profile, setProfile] = useState(() => loadProfile());

  // Active Challenge State (default to first challenge: syn-01)
  const [activeChallengeId, setActiveChallengeId] = useState(CHALLENGES[0].id);
  const activeChallenge = CHALLENGES.find(c => c.id === activeChallengeId) || CHALLENGES[0];

  // Code editor state
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem(`dd_code_${CHALLENGES[0].id}`);
    return saved !== null ? saved : CHALLENGES[0].buggyCode;
  });

  // Runner, Simulation & Diagnostics
  const [testResults, setTestResults] = useState(null);
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [exitCode, setExitCode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Mobile / Tablet Tab Viewport State ('arena' | 'map' | 'status')
  const [mobileTab, setMobileTab] = useState('arena');

  // Modals & Notifications
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [isBossVictoryOpen, setIsBossVictoryOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Level Up Ascension State & Notification
  const [levelUpData, setLevelUpData] = useState({
    prevLevel: 1,
    newLevel: 1,
    currentXp: 0,
  });
  const [levelUpToast, setLevelUpToast] = useState(null);
  const [justCompletedId, setJustCompletedId] = useState(null);

  // Current View: 'landing' (showcase platform overview) | 'dungeon' (active coding workspace)
  const [currentView, setCurrentView] = useState('landing');

  // Lightweight Event Visual Feedback States
  const [successEvent, setSuccessEvent] = useState(null);
  const [failureEvent, setFailureEvent] = useState(null);
  const [streakEvent, setStreakEvent] = useState(null);
  const [levelUpEvent, setLevelUpEvent] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  // Keyboard shortcut to enter dungeon on Landing screen & Ctrl+K search palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentView === 'landing' && e.key === 'Enter') {
        sfx.playSuccess();
        setCurrentView('dungeon');
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sfx.playClick();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  // Victory metadata
  const [victoryMeta, setVictoryMeta] = useState({
    xpEarned: 0,
    leveledUp: false,
    newLevel: 1,
    currentXp: 0,
    rank: getRank(1),
    streak: 0,
    newAchievements: []
  });

  // Auto-dismiss level up toast notification after 7 seconds
  useEffect(() => {
    if (levelUpToast) {
      const timer = setTimeout(() => {
        setLevelUpToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [levelUpToast]);

  // Sync sound settings with audio synthesizer
  useEffect(() => {
    sfx.setMuted(!profile.soundEnabled);
  }, [profile.soundEnabled]);

  // Profile updater helper with immediate localStorage persistence
  const updateProfile = useCallback((updater) => {
    setProfile((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveProfile(next);
      return next;
    });
  }, []);

  // Helper to add activity log events
  const addActivityLog = useCallback((text, type = 'info') => {
    updateProfile(prev => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      return {
        ...prev,
        activityLog: [
          { id: uniqueId, text, type, time },
          ...(prev.activityLog || [])
        ].slice(0, 20)
      };
    });
  }, [updateProfile]);

  // Switch active challenge
  const handleSelectChallenge = (challenge) => {
    setActiveChallengeId(challenge.id);
    const saved = localStorage.getItem(`dd_code_${challenge.id}`);
    setCode(saved !== null ? saved : challenge.buggyCode);
    setTestResults(null);
    setSimulationLogs([]);
    setExitCode(null);
    addActivityLog(`Infiltrated ${challenge.title} [${challenge.category}]`, 'event');
    setMobileTab('arena');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update code in editor
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    localStorage.setItem(`dd_code_${activeChallengeId}`, newCode);
  };

  // Reset code to initial buggy state
  const handleResetCode = () => {
    setCode(activeChallenge.buggyCode);
    localStorage.removeItem(`dd_code_${activeChallengeId}`);
    setTestResults(null);
    setSimulationLogs([]);
    setExitCode(null);
    sfx.playClick();
    addActivityLog(`Reverted code for ${activeChallenge.title}`);
  };

  // Run Code (Safe frontend simulation without HP risk)
  const handleRunCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    sfx.playScan();

    setTimeout(() => {
      try {
        const sim = simulateChallengeExecution(activeChallenge, code);
        setTestResults(sim.testResults);
        setSimulationLogs(sim.logs);
        setExitCode(sim.exitCode);

        if (sim.success) {
          sfx.playSuccess();
          addActivityLog(`Sandbox verified: All test probes passed for ${activeChallenge.title}`, 'success');
        } else {
          sfx.playFail();
          addActivityLog(`Sandbox detected anomaly in ${activeChallenge.title} (${sim.testResults.passedCount}/${sim.testResults.totalCount} passed)`, 'warn');
        }
      } catch {
        sfx.playFail();
      } finally {
        setIsRunning(false);
      }
    }, 250);
  };

  // Submit Fix (Validates fix against expected solution, manages XP, Combo, Streak, HP, and Unlocks)
  const handleSubmitFix = () => {
    if (isRunning) return;
    setIsRunning(true);
    sfx.playScan();

    setTimeout(() => {
      try {
        const validation = validateChallengeSolution(activeChallenge, code);
        const sim = validation.simulation;

        setTestResults(sim.testResults);
        setSimulationLogs(sim.logs);
        setExitCode(sim.exitCode);

        if (!validation.valid) {
          // Failed submission: reduce health, reset combo and break streak
          sfx.playFail();
          const damage = 15;
          let newHealth = Math.max(0, (profile.health || 100) - damage);
          const hadStreak = (profile.streak || 0) > 0;
          const oldStreak = profile.streak || 0;

          // Trigger failure visual feedback & screen shake
          setFailureEvent({
            id: Date.now(),
            damage,
            hadStreak,
            oldStreak,
            challengeTitle: activeChallenge.title,
          });
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 550);

          // If health reached 0, perform an emergency auto-reboot to keep player engaged
          let rebooted = false;
          if (newHealth === 0) {
            newHealth = 50;
            rebooted = true;
          }

          updateProfile(prev => ({
            ...prev,
            health: newHealth,
            combo: 1.0,  // Reset combo
            streak: 0,   // Reset consecutive solve streak
          }));

          addActivityLog(
            `Fix failed on ${activeChallenge.title}! -${damage} HP, Combo & Streak reset${hadStreak ? ` (${oldStreak}-streak broken)` : ''}`,
            'error'
          );

          if (rebooted) {
            addActivityLog('⚠️ CRITICAL INTEGRITY BREACH: System auto-rebooted with 50 emergency HP.', 'warn');
          }
        } else {
          // Successful submission!
          sfx.playSuccess();
          sfx.playLevelUp();

          // Calculate XP with combo multiplier
          const currentCombo = profile.combo || 1.0;
          const baseXP = activeChallenge.xpReward;
          const xpEarned = Math.round(baseXP * currentCombo);

          const currentLvl = calculateLevel(profile.xp);
          const nextXpTotal = profile.xp + xpEarned;
          const newLvl = calculateLevel(nextXpTotal);
          const leveledUp = newLvl > currentLvl;
          const newRank = getRank(newLvl);

          // Combo progression (1.0 -> 1.5 -> 2.0 -> 2.5 -> max 3.0)
          const nextCombo = Math.min(3.0, Math.round((currentCombo + 0.5) * 10) / 10);

          // Consecutive solve streak progression
          const currentStreak = profile.streak || 0;
          const nextStreak = currentStreak + 1;

          // Recover health on victory (+15 HP up to 100)
          const recoveredHealth = Math.min(100, (profile.health || 100) + 15);

          // Hint recharge bonus: every 2 consecutive solves recharges 1 hint probe (up to 3 max)
          let nextHints = profile.hintsRemaining !== undefined ? profile.hintsRemaining : 3;
          let rechargedAHint = false;
          if (nextStreak > 0 && nextStreak % 2 === 0 && nextHints < 3) {
            nextHints = Math.min(3, nextHints + 1);
            rechargedAHint = true;
          }

          // Check for achievements
          const newAchievements = [];
          const existingAch = profile.unlockedAchievements || [];

          if (!existingAch.includes('first_blood')) {
            const ach = ACHIEVEMENTS.find(a => a.id === 'first_blood');
            if (ach) newAchievements.push(ach);
          }

          if (activeChallenge.id.startsWith('async') && !existingAch.includes('async_exorcist')) {
            const ach = ACHIEVEMENTS.find(a => a.id === 'async_exorcist');
            if (ach) newAchievements.push(ach);
          }

          if (activeChallenge.id.startsWith('react') && !existingAch.includes('state_preserver')) {
            const ach = ACHIEVEMENTS.find(a => a.id === 'state_preserver');
            if (ach) newAchievements.push(ach);
          }

          if ((activeChallenge.id === 'boss-sev0' || activeChallenge.id === 'prod-03') && !existingAch.includes('colossus_slayer')) {
            const ach = ACHIEVEMENTS.find(a => a.id === 'colossus_slayer');
            if (ach) newAchievements.push(ach);
          }

          const usedHintOnThis = profile.hintsUsed && profile.hintsUsed[activeChallenge.id];
          if (!usedHintOnThis && !existingAch.includes('zero_hint_prodigy')) {
            const ach = ACHIEVEMENTS.find(a => a.id === 'zero_hint_prodigy');
            if (ach) newAchievements.push(ach);
          }

          if ((sim.testResults?.durationMs || 100) < 50 && !existingAch.includes('speed_demon')) {
            const ach = ACHIEVEMENTS.find(a => a.id === 'speed_demon');
            if (ach) newAchievements.push(ach);
          }

          updateProfile(prev => {
            const updatedCompleted = prev.completedChallenges.includes(activeChallenge.id)
              ? prev.completedChallenges
              : [...prev.completedChallenges, activeChallenge.id];

            return {
              ...prev,
              xp: nextXpTotal,
              health: recoveredHealth,
              combo: nextCombo,
              streak: nextStreak,
              hintsRemaining: nextHints,
              completedChallenges: updatedCompleted,
              unlockedAchievements: [
                ...prev.unlockedAchievements,
                ...newAchievements.map(a => a.id)
              ]
            };
          });

          addActivityLog(
            `✨ Purged ${activeChallenge.title}! +${xpEarned} XP (x${currentCombo} Combo, ${nextStreak} Solve Streak)`, 
            'success'
          );

          if (leveledUp) {
            addActivityLog(
              `⚡ LEVEL UP! Advanced to Level ${newLvl} • Developer Rank: [${newRank.title}]`, 
              'event'
            );
          }

          if (rechargedAHint) {
            addActivityLog('🎁 Streak Bonus: +1 Neural Probe (Hint) recharged!', 'event');
          }

          setJustCompletedId(activeChallenge.id);

          // Trigger bug fix success visual feedback
          setSuccessEvent({
            id: Date.now(),
            xpEarned,
            combo: currentCombo,
            streak: nextStreak,
            challengeTitle: activeChallenge.title,
          });

          // Trigger streak visual feedback if consecutive streak >= 2
          if (nextStreak >= 2) {
            setStreakEvent({
              id: Date.now(),
              streak: nextStreak,
              combo: nextCombo,
            });
          }

          // Trigger level up celebration feedback if leveled up
          if (leveledUp) {
            setLevelUpEvent({
              id: Date.now(),
              newLevel: newLvl,
              rank: newRank,
            });
          }

          setVictoryMeta({
            xpEarned,
            leveledUp,
            newLevel: newLvl,
            currentXp: nextXpTotal,
            rank: newRank,
            streak: nextStreak,
            newAchievements,
          });

          if (activeChallenge.isBossChallenge) {
            setIsBossVictoryOpen(true);
          } else if (leveledUp) {
            setLevelUpData({
              prevLevel: currentLvl,
              newLevel: newLvl,
              currentXp: nextXpTotal,
            });
            setLevelUpToast({
              level: newLvl,
              prevLevel: currentLvl,
              rank: newRank,
            });
            setIsLevelUpOpen(true);
          } else {
            setIsVictoryOpen(true);
          }
        }
      } catch {
        sfx.playFail();
      } finally {
        setIsRunning(false);
      }
    }, 300);
  };

  // Skip button: Moves to another available challenge but gives NO XP and does NOT increment streak
  const handleSkip = () => {
    sfx.playClick();
    const unlocked = CHALLENGES.filter(c => isChallengeUnlocked(c, profile.completedChallenges));
    
    if (unlocked.length <= 1) {
      addActivityLog(`No alternate chambers unlocked yet. Solve current challenge to unlock more!`, 'warn');
      return;
    }

    const currentIndex = unlocked.findIndex(c => c.id === activeChallenge.id);
    const nextChallenge = unlocked[(currentIndex + 1) % unlocked.length];
    
    // Switch challenge with NO XP awarded
    setActiveChallengeId(nextChallenge.id);
    const saved = localStorage.getItem(`dd_code_${nextChallenge.id}`);
    setCode(saved !== null ? saved : nextChallenge.buggyCode);
    setTestResults(null);
    setSimulationLogs([]);
    setExitCode(null);

    addActivityLog(`Skipped ${activeChallenge.title} ➔ Switched to ${nextChallenge.title} (0 XP awarded)`, 'event');
  };

  // Hint system: Consumes 1 hint probe and reveals a useful debugging clue
  const handleOpenHint = () => {
    const hintsLeft = profile.hintsRemaining !== undefined ? profile.hintsRemaining : 3;
    const alreadyRevealed = profile.hintsUsed && profile.hintsUsed[activeChallenge.id];

    if (alreadyRevealed) {
      // Re-read already unlocked clue for free
      sfx.playHint();
      setIsHintOpen(true);
      return;
    }

    if (hintsLeft <= 0) {
      sfx.playFail();
      addActivityLog(`No Neural Probes remaining! Solve challenges to recharge hints.`, 'warn');
      alert('⚠️ No Neural Probes (Hints) remaining!\nSolve challenges or build consecutive streaks to recharge hints.');
      return;
    }

    // Consume 1 hint charge
    sfx.playHint();
    const newHintsLeft = Math.max(0, hintsLeft - 1);
    updateProfile(prev => ({
      ...prev,
      hintsRemaining: newHintsLeft,
      hintsUsed: {
        ...(prev.hintsUsed || {}),
        [activeChallenge.id]: true
      }
    }));

    addActivityLog(`Neural Probe consumed: Clue decrypted for ${activeChallenge.title} (${newHintsLeft} left)`, 'info');
    setIsHintOpen(true);
  };

  // Next challenge after victory: prefer newly unlocked or next uncompleted challenge
  const handleNextChallenge = () => {
    setIsVictoryOpen(false);
    const updatedCompleted = profile.completedChallenges.includes(activeChallenge.id)
      ? profile.completedChallenges
      : [...profile.completedChallenges, activeChallenge.id];

    const unlocked = CHALLENGES.filter(c => isChallengeUnlocked(c, updatedCompleted));
    const nextUncompleted = unlocked.find(c => !updatedCompleted.includes(c.id));

    if (nextUncompleted) {
      handleSelectChallenge(nextUncompleted);
    } else {
      const currentIndex = unlocked.findIndex(c => c.id === activeChallenge.id);
      const nextChallenge = unlocked[(currentIndex + 1) % unlocked.length];
      handleSelectChallenge(nextChallenge);
    }
  };

  return (
    <div className="min-h-screen bg-dungeon-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden font-sans">
      {/* CRT Scanline Overlay */}
      {profile.scanlinesEnabled && (
        <div className="fixed inset-0 scanline-overlay z-30 pointer-events-none opacity-30" />
      )}

      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid-bg opacity-25 pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <Header
        profile={profile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSound={() => updateProfile(p => ({ ...p, soundEnabled: !p.soundEnabled }))}
        onToggleScanlines={() => updateProfile(p => ({ ...p, scanlinesEnabled: !p.scanlinesEnabled }))}
        onOpenLevelUp={() => {
          const lvl = calculateLevel(profile.xp);
          setLevelUpData({
            prevLevel: lvl,
            newLevel: lvl,
            currentXp: profile.xp,
          });
          setIsLevelUpOpen(true);
        }}
        onGoHome={() => setCurrentView('landing')}
        onEnterDungeon={() => setCurrentView('dungeon')}
        currentView={currentView}
      />

      {/* Satisfying Floating Level-Up Notification Toast */}
      {levelUpToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="p-4 rounded-2xl bg-dungeon-950/95 border-2 border-cyan-400 shadow-glow-cyan backdrop-blur-xl flex items-center gap-3.5 max-w-md">
            <div className="relative w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
              {levelUpToast.rank.badge}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-extrabold flex items-center gap-1">
                  ⚡ LEVEL UP NOTIFICATION
                </span>
                <button
                  onClick={() => setLevelUpToast(null)}
                  className="text-slate-500 hover:text-white text-xs px-1"
                  title="Dismiss notification"
                >
                  ✕
                </button>
              </div>
              <div className="text-sm font-mono font-bold text-white">
                Advanced to Level {levelUpToast.level}!
              </div>
              <div className={`text-xs font-mono font-semibold ${levelUpToast.rank.color}`}>
                Rank: {levelUpToast.rank.title}
              </div>
            </div>
            <button
              onClick={() => {
                setLevelUpData({
                  prevLevel: levelUpToast.prevLevel,
                  newLevel: levelUpToast.level,
                  currentXp: profile.xp,
                });
                setIsLevelUpOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40 transition-colors flex-shrink-0"
            >
              Inspect
            </button>
          </div>
        </div>
      )}

      {/* Lightweight Visual Feedback for Key Events (Active in Dungeon Console) */}
      {currentView === 'dungeon' && (
        <EventFeedbackEffects
          health={profile.health !== undefined ? profile.health : 100}
          maxHealth={profile.maxHealth || 100}
          successEvent={successEvent}
          failureEvent={failureEvent}
          streakEvent={streakEvent}
          levelUpEvent={levelUpEvent}
          onDismissSuccess={() => setSuccessEvent(null)}
          onDismissFailure={() => setFailureEvent(null)}
          onDismissStreak={() => setStreakEvent(null)}
          onDismissLevelUp={() => setLevelUpEvent(null)}
        />
      )}

      {/* Viewport Routing: Landing Screen vs Active Dungeon Console */}
      {currentView === 'landing' ? (
        <LandingScreen
          onEnterDungeon={() => setCurrentView('dungeon')}
          profile={profile}
          challengeCount={CHALLENGES.length}
        />
      ) : (
        /* Main Screen: 3 Major Areas */
        <main className={`flex-1 max-w-[1700px] w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 relative z-10 transition-transform ${isShaking ? 'animate-screen-shake' : ''}`}>
        
        {/* Mobile / Tablet Segmented Console Navigation (Shown below lg) */}
        <div className="lg:hidden flex items-center justify-between p-1 mb-4 rounded-xl bg-dungeon-950/90 border border-dungeon-800 font-mono text-xs max-w-md mx-auto shadow-lg backdrop-blur-md">
          <button
            onClick={() => {
              sfx.playClick();
              setMobileTab('map');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              mobileTab === 'map'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-dungeon-900 border border-dungeon-800 text-cyan-400">
              {profile.completedChallenges.length}/{CHALLENGES.length}
            </span>
          </button>

          <button
            onClick={() => {
              sfx.playClick();
              setMobileTab('arena');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              mobileTab === 'arena'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{activeChallenge.isBossChallenge ? 'Boss Alert' : 'Code Arena'}</span>
          </button>

          <button
            onClick={() => {
              sfx.playClick();
              setMobileTab('status');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              mobileTab === 'status'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>HUD</span>
          </button>
        </div>

        {activeChallenge.isBossChallenge ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 1. Left Area: Dungeon Map Matrix (3 columns on lg) */}
            <section className={`${mobileTab === 'map' ? 'block' : 'hidden'} lg:block lg:col-span-3`}>
              <DungeonMapColumn
                challenges={CHALLENGES}
                currentChallengeId={activeChallengeId}
                completedChallenges={profile.completedChallenges}
                onSelectChallenge={handleSelectChallenge}
                playerProfile={profile}
                justCompletedId={justCompletedId}
                onClearJustCompleted={() => setJustCompletedId(null)}
              />
            </section>

            {/* 2. Specialized Boss Incident Screen (9 columns on lg) */}
            <section className={`${mobileTab === 'arena' ? 'block' : 'hidden'} lg:block lg:col-span-9`}>
              <BossChallengeScreen
                challenge={activeChallenge}
                code={code}
                onCodeChange={handleCodeChange}
                onResetCode={handleResetCode}
                onRunCode={handleRunCode}
                onSubmitFix={handleSubmitFix}
                onSkip={handleSkip}
                isRunning={isRunning}
                testResults={testResults}
                simulationLogs={simulationLogs}
                exitCode={exitCode}
                isCompleted={profile.completedChallenges.includes(activeChallenge.id)}
                onReturnToMap={() => {
                  const firstChallenge = CHALLENGES[0];
                  handleSelectChallenge(firstChallenge);
                }}
              />
            </section>

            {/* 3. Developer Status View for Boss mode on mobile */}
            <section className={`${mobileTab === 'status' ? 'block' : 'hidden'} lg:hidden`}>
              <DeveloperStatusPanel
                profile={profile}
                activityLog={profile.activityLog || []}
                combo={profile.combo || 1.0}
                hintsRemaining={profile.hintsRemaining !== undefined ? profile.hintsRemaining : 3}
                onOpenLevelUp={() => {
                  const lvl = calculateLevel(profile.xp);
                  setLevelUpData({
                    prevLevel: lvl,
                    newLevel: lvl,
                    currentXp: profile.xp,
                  });
                  setIsLevelUpOpen(true);
                }}
              />
            </section>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 1. Left Area: Dungeon Map Matrix (3 columns on lg) */}
            <section className={`${mobileTab === 'map' ? 'block' : 'hidden'} lg:block lg:col-span-3`}>
              <DungeonMapColumn
                challenges={CHALLENGES}
                currentChallengeId={activeChallengeId}
                completedChallenges={profile.completedChallenges}
                onSelectChallenge={handleSelectChallenge}
                playerProfile={profile}
                justCompletedId={justCompletedId}
                onClearJustCompleted={() => setJustCompletedId(null)}
              />
            </section>

            {/* 2. Center Area: Current Debugging Challenge Panel (6 columns on lg) */}
            <section className={`${mobileTab === 'arena' ? 'block' : 'hidden'} lg:block lg:col-span-6`}>
              <ChallengePanel
                challenge={activeChallenge}
                code={code}
                onCodeChange={handleCodeChange}
                onResetCode={handleResetCode}
                onRunCode={handleRunCode}
                onSubmitFix={handleSubmitFix}
                onSkip={handleSkip}
                onOpenHint={handleOpenHint}
                hintsRemaining={profile.hintsRemaining !== undefined ? profile.hintsRemaining : 3}
                isRunning={isRunning}
                testResults={testResults}
                simulationLogs={simulationLogs}
                onClearLogs={() => setSimulationLogs([])}
                exitCode={exitCode}
                isCompleted={profile.completedChallenges.includes(activeChallenge.id)}
                streak={profile.streak || 0}
                combo={profile.combo || 1.0}
              />
            </section>

            {/* 3. Right Area: Developer Status Panel (3 columns on lg) */}
            <section className={`${mobileTab === 'status' ? 'block' : 'hidden'} lg:block lg:col-span-3`}>
              <DeveloperStatusPanel
                profile={profile}
                activityLog={profile.activityLog || []}
                combo={profile.combo || 1.0}
                hintsRemaining={profile.hintsRemaining !== undefined ? profile.hintsRemaining : 3}
                onOpenLevelUp={() => {
                  const lvl = calculateLevel(profile.xp);
                  setLevelUpData({
                    prevLevel: lvl,
                    newLevel: lvl,
                    currentXp: profile.xp,
                  });
                  setIsLevelUpOpen(true);
                }}
              />
            </section>
          </div>
        )}
      </main>
      )}

      {/* Developer Console Footer */}
      <Footer
        completedCount={profile.completedChallenges.length}
        totalCount={CHALLENGES.length}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
      />

      {/* Quick Infiltration Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        challenges={CHALLENGES}
        completedChallenges={profile.completedChallenges}
        onSelectChallenge={(ch) => {
          handleSelectChallenge(ch);
          if (currentView === 'landing') {
            setCurrentView('dungeon');
          }
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onUpdateProfile={updateProfile}
        onResetProgress={() => {
          const fresh = resetProfile();
          CHALLENGES.forEach(c => {
            localStorage.removeItem(`dd_code_${c.id}`);
          });
          setProfile(fresh);
          handleSelectChallenge(CHALLENGES[0]);
        }}
      />

      {/* Hint Modal */}
      <HintModal
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        challenge={activeChallenge}
      />

      {/* Level Up Ascension Modal */}
      <LevelUpModal
        isOpen={isLevelUpOpen}
        onClose={() => {
          setIsLevelUpOpen(false);
          setIsVictoryOpen(true);
        }}
        prevLevel={levelUpData.prevLevel}
        newLevel={levelUpData.newLevel}
        currentXp={levelUpData.currentXp}
      />

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={isVictoryOpen}
        onClose={() => setIsVictoryOpen(false)}
        challenge={activeChallenge}
        xpEarned={victoryMeta.xpEarned}
        leveledUp={victoryMeta.leveledUp}
        newLevel={victoryMeta.newLevel}
        currentXp={victoryMeta.currentXp || profile.xp}
        rank={victoryMeta.rank}
        streak={victoryMeta.streak}
        newAchievements={victoryMeta.newAchievements}
        onNextChallenge={handleNextChallenge}
        onReturnToMap={() => setIsVictoryOpen(false)}
      />

      {/* Final Production Boss Victory Celebration Modal */}
      <BossVictoryModal
        isOpen={isBossVictoryOpen}
        onClose={() => setIsBossVictoryOpen(false)}
        challenge={activeChallenge}
        playerLevel={victoryMeta.newLevel || calculateLevel(profile.xp)}
        xpEarned={victoryMeta.xpEarned || activeChallenge.xpReward}
        challengesSolved={profile.completedChallenges.length}
        totalChallenges={CHALLENGES.length}
        streak={victoryMeta.streak || profile.streak || 1}
        rank={victoryMeta.rank || getRank(calculateLevel(profile.xp))}
        totalXp={victoryMeta.currentXp || profile.xp}
        onReturnToMap={() => {
          setIsBossVictoryOpen(false);
          const firstChallenge = CHALLENGES[0];
          handleSelectChallenge(firstChallenge);
        }}
      />
    </div>
  );
}
