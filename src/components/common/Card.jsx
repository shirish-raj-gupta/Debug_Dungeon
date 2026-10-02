import React from 'react';

export default function Card({
  children,
  className = '',
  glow = 'none', // 'cyan', 'neon', 'purple', 'amber', 'crimson', 'none'
  hover = true,
  onClick,
  ...props
}) {
  const glowStyles = {
    none: 'border-dungeon-800/80 shadow-card-dark hover:border-dungeon-700/80',
    cyan: 'border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-glow-cyan',
    neon: 'border-emerald-500/30 hover:border-emerald-400/50 hover:shadow-glow-neon',
    purple: 'border-purple-500/30 hover:border-purple-400/50 hover:shadow-glow-purple',
    amber: 'border-amber-500/30 hover:border-amber-400/50 hover:shadow-glow-amber',
    crimson: 'border-rose-500/30 hover:border-rose-400/50 hover:shadow-glow-crimson',
  };

  const isClickable = Boolean(onClick);
  const hoverStyle = (hover && isClickable) 
    ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer active:translate-y-0 active:scale-[0.99]' 
    : 'transition-colors duration-200';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl bg-dungeon-900/90 backdrop-blur-md border ${glowStyles[glow] || glowStyles.none} ${hoverStyle} ${className}`}
      {...props}
    >
      {/* Top subtle technical edge highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent pointer-events-none rounded-t-xl" />
      {children}
    </div>
  );
}
