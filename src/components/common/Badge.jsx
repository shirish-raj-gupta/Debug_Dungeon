import React from 'react';

export default function Badge({
  children,
  variant = 'cyan',
  size = 'sm',
  icon: Icon,
  className = ''
}) {
  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  const variantStyles = {
    cyan: 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30',
    neon: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30',
    purple: 'bg-purple-950/60 text-purple-400 border border-purple-500/30',
    amber: 'bg-amber-950/60 text-amber-400 border border-amber-500/30',
    crimson: 'bg-rose-950/60 text-rose-400 border border-rose-500/30',
    gray: 'bg-slate-900/60 text-slate-400 border border-slate-700/50',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md uppercase tracking-wider ${sizeStyles[size] || sizeStyles.sm} ${variantStyles[variant] || variantStyles.cyan} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
