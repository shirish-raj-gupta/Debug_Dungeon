import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Lightbulb, Copy, Check, Sparkles } from 'lucide-react';
import { sfx } from '../../utils/sound';

export default function HintModal({
  isOpen,
  onClose,
  challenge,
}) {
  const [copied, setCopied] = useState(false);

  if (!challenge) return null;

  const handleCopy = () => {
    sfx.playClick();
    if (challenge.hint) {
      navigator.clipboard.writeText(challenge.hint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="NEURAL PROBE // TACTICAL HINT"
      icon={Lightbulb}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Challenge Context Header */}
        <div className="p-3.5 rounded-xl bg-dungeon-950/80 border border-cyan-500/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="cyan" size="xs">
                {challenge.category}
              </Badge>
              <Badge variant="amber" size="xs">
                {challenge.difficulty}
              </Badge>
            </div>
            <h4 className="font-bold text-sm text-white font-mono">
              {challenge.title}
            </h4>
          </div>
          <span className="text-2xl p-2 rounded-lg bg-dungeon-900 border border-dungeon-800">
            {challenge.bossAvatar || '💡'}
          </span>
        </div>

        {/* Tactical Hint Content */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 text-amber-200 space-y-3">
          <div className="flex items-center justify-between text-[11px] pb-2 border-b border-amber-900/60">
            <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              DECRYPTED HINT TRANSMISSION
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-300 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="font-sans text-xs text-amber-100/90 leading-relaxed bg-black/40 p-3 rounded-lg border border-amber-950/80">
            {challenge.hint || 'Carefully inspect the variable scopes and boundary conditions in the code editor.'}
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close Transmission
          </Button>
        </div>
      </div>
    </Modal>
  );
}
