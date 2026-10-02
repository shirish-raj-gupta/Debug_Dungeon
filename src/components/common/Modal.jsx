import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  icon: Icon,
  children,
  maxWidth = 'max-w-2xl',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dungeon-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${maxWidth} bg-dungeon-900 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/50 z-10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200`}>
        {/* Glow Header bar */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dungeon-800/80">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-lg font-mono font-bold text-white tracking-wide">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            title="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dungeon-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}
