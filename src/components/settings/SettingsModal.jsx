import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Settings, Volume2, VolumeX, Tv, RotateCcw, User, Check } from 'lucide-react';
import { sfx } from '../../utils/sound';

export default function SettingsModal({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onResetProgress
}) {
  const [handle, setHandle] = useState(profile.handle || 'Cyber_Hunter#902');
  const [savedName, setSavedName] = useState(false);

  const handleSaveHandle = (e) => {
    e.preventDefault();
    if (!handle.trim()) return;
    onUpdateProfile({ handle: handle.trim() });
    setSavedName(true);
    setTimeout(() => setSavedName(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SYSTEM SETTINGS // CONFIGURATION"
      icon={Settings}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 font-mono text-xs">
        {/* Player Handle */}
        <div className="p-4 rounded-xl bg-dungeon-950/80 border border-dungeon-800 space-y-2">
          <label htmlFor="dev-callsign-input" className="text-slate-300 font-bold flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            Developer Call-Sign (Handle)
          </label>
          <form onSubmit={handleSaveHandle} className="flex gap-2">
            <input
              id="dev-callsign-input"
              name="devCallsign"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="flex-1 px-3 py-2 bg-dungeon-900 border border-dungeon-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
            />
            <Button size="sm" variant="cyan" type="submit">
              {savedName ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : 'Update'}
            </Button>
          </form>
        </div>

        {/* Audio & Visual Toggles */}
        <div className="p-4 rounded-xl bg-dungeon-950/80 border border-dungeon-800 space-y-4">
          <div className="text-slate-300 font-bold pb-2 border-b border-dungeon-800">
            AUDIO & DISPLAY MATRIX
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                {profile.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                Web Audio Synthesizer
              </span>
              <p className="text-[11px] text-slate-500 font-sans">
                Generates arcade 8-bit cyber beeps and victory chords
              </p>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                onUpdateProfile({ soundEnabled: !profile.soundEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                profile.soundEnabled ? 'bg-cyan-500' : 'bg-dungeon-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  profile.soundEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* CRT Scanline Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-dungeon-800/60">
            <div className="space-y-0.5">
              <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-cyan-400" />
                CRT Scanline Overlay
              </span>
              <p className="text-[11px] text-slate-500 font-sans">
                Subtle vintage developer console scanlines
              </p>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                onUpdateProfile({ scanlinesEnabled: !profile.scanlinesEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                profile.scanlinesEnabled ? 'bg-cyan-500' : 'bg-dungeon-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  profile.scanlinesEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Danger Zone: Reset Progress */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between">
          <div>
            <span className="text-rose-300 font-bold block">Reset Player Progress</span>
            <span className="text-[10px] text-slate-500 font-sans">
              Clears purged stages, reset health and combo multipliers.
            </span>
          </div>
          <Button
            size="sm"
            variant="crimson"
            onClick={() => {
              if (window.confirm('Reset all progress, purged stages, and stats?')) {
                onResetProgress();
                onClose();
              }
            }}
            icon={RotateCcw}
          >
            Reset
          </Button>
        </div>
      </div>
    </Modal>
  );
}
