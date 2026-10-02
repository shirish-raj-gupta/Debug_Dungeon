/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dungeon: {
          950: '#05070d',
          900: '#090d16',
          850: '#0e1524',
          800: '#141d33',
          700: '#1c2844',
          600: '#2b3c63',
          500: '#3f568a',
          400: '#647eb5',
          300: '#94a7d3',
          200: '#cbd5e1',
          100: '#f1f5f9',
        },
        cyber: {
          cyan: '#00f2fe',
          teal: '#4facfe',
          neon: '#00ff9d',
          emerald: '#10b981',
          amber: '#fbbf24',
          crimson: '#ff3366',
          purple: '#b02aef',
          violet: '#7928ca',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 242, 254, 0.35)',
        'glow-cyan-lg': '0 0 35px -5px rgba(0, 242, 254, 0.45)',
        'glow-neon': '0 0 20px -3px rgba(0, 255, 157, 0.35)',
        'glow-purple': '0 0 20px -3px rgba(176, 42, 239, 0.35)',
        'glow-crimson': '0 0 20px -3px rgba(255, 51, 102, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(251, 191, 36, 0.35)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'inset-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
