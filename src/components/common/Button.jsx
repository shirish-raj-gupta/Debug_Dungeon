import React from 'react';
import { sfx } from '../../utils/sound';

export default function Button({
  children,
  onClick,
  variant = 'cyan',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  sound = true,
  ...props
}) {
  const handleClick = (e) => {
    if (disabled || loading) return;
    if (sound) sfx.playClick();
    if (onClick) onClick(e);
  };

  const baseStyles = 'inline-flex items-center justify-center font-mono font-medium transition-all duration-150 rounded-lg select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dungeon-950 active:scale-[0.97] active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:active:scale-100 disabled:active:translate-y-0 cursor-pointer';

  const sizeStyles = {
    xs: 'text-[11px] px-2 py-1 gap-1',
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    cyan: 'bg-cyan-500/10 hover:bg-cyan-500/20 active:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 hover:shadow-glow-cyan focus:ring-cyan-500',
    neon: 'bg-emerald-500/10 hover:bg-emerald-500/20 active:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 hover:shadow-glow-neon focus:ring-emerald-500',
    purple: 'bg-purple-500/10 hover:bg-purple-500/20 active:bg-purple-500/30 text-purple-300 border border-purple-500/40 hover:border-purple-400 hover:shadow-glow-purple focus:ring-purple-500',
    amber: 'bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400 hover:shadow-glow-amber focus:ring-amber-500',
    crimson: 'bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 text-rose-300 border border-rose-500/40 hover:border-rose-400 hover:shadow-glow-crimson focus:ring-rose-500',
    danger: 'bg-rose-950/40 hover:bg-rose-900/60 active:bg-rose-900/80 text-rose-300 border border-rose-600/50 hover:border-rose-500 hover:shadow-glow-crimson focus:ring-rose-500',
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:from-cyan-600 active:to-blue-700 text-dungeon-950 font-bold shadow-glow-cyan hover:shadow-glow-cyan-lg border border-cyan-300/40 focus:ring-cyan-400',
    secondary: 'bg-dungeon-900/90 hover:bg-dungeon-800 active:bg-dungeon-950 text-slate-200 hover:text-white border border-slate-700/80 hover:border-slate-500 shadow-sm focus:ring-slate-500',
    ghost: 'bg-transparent hover:bg-dungeon-800/80 active:bg-dungeon-800 text-slate-300 hover:text-white border border-transparent hover:border-dungeon-700/60 focus:ring-slate-500',
    outline: 'bg-dungeon-900/60 hover:bg-dungeon-800 active:bg-dungeon-950 text-slate-300 hover:text-white border border-dungeon-700 hover:border-dungeon-500 focus:ring-slate-500',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.cyan} ${loading ? 'cursor-wait' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : Icon ? (
        <Icon className={size === 'sm' || size === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </button>
  );
}
