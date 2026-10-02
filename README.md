# 🏰 Debug Dungeon

> **"Fix Bug, Gain XP, Defeat Production."**

An immersive, gamified developer challenge platform engineered to level up real-world debugging skills. Enter a subterranean cyber matrix of corrupted codebases, analyze realistic JavaScript & React failures, inspect execution traces in an isolated runtime, and restore mission-critical production systems before cascading meltdowns occur.

---

## 🎮 Key Features

- **⚔️ 15 Progressive Chambers across 5 Stages**:
  - **Syntax Script** (`Syntax errors`): Operator precedence, assignment traps, type coercions.
  - **State Cave** (`React state bugs`): State mutations, stale closures, missing dependency arrays, batching gotchas.
  - **Async Abyss** (`Async JavaScript bugs`): Unhandled promises, race conditions, promise allSettled vs all, microtask order.
  - **API Fortress** (`API bugs`): Header misconfigurations, query param encoding, deserialization errors, rate-limiting handlers.
  - **Production Boss** (`Production bugs`): Memory leaks, circular references, hydration mismatches, cascade outages.
- **💻 Interactive Cyber Dev Console**: Built-in code editor with syntax highlighting, line numbers, error diagnostics, and reset-to-original capabilities.
- **⚡ In-Browser Execution & Validation Engine**: Run code against test suites and edge cases with real-time logs, stack traces, and output comparisons.
- **🛡️ RPG Progression System**:
  - Gain Developer XP for every resolved chamber.
  - Unlock Ranks from *Junior Dev* up to *Staff Architect*.
  - Earn achievements and battle epic Bosses with celebratory visual and sound effects.
- **⌨️ Developer Shortcuts & Command Palette**: Quick navigation, instant test runner shortcuts, sound toggles, and vim/cyberpunk aesthetics.
- **📱 Fully Responsive**: Fluid multi-column layout for desktops, plus tabbed navigation tailored for tablets and mobile devices.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Tooling**: [Vite](https://vite.dev/) & [Oxlint](https://oxc.rs/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom cyberpunk color themes and animations
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) & Web Audio API SFX

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `pnpm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shirish-raj-gupta/Debug_Dungeon.git
   cd Debug_Dungeon
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Run linting**:
   ```bash
   npm run lint
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
Debug_Dungeon/
├── public/                 # Static assets & icons
├── src/
│   ├── assets/             # Images and styles
│   ├── components/
│   │   ├── arena/          # Code editor, test runner & challenge modals
│   │   ├── command/        # Command palette & shortcuts
│   │   ├── dungeon/        # Dungeon map & stage selector
│   │   ├── effects/        # Particle & feedback effects
│   │   ├── landing/        # Cyberpunk hero landing screen
│   │   ├── layout/         # Header, footer & navigation
│   │   ├── profile/        # RPG stats, rank & level up modal
│   │   └── settings/       # Audio & display settings
│   ├── data/
│   │   ├── achievements.js # Unlockable achievements list
│   │   └── challenges.js   # 15 interactive debugging challenges
│   ├── utils/
│   │   ├── simulator.js    # In-browser test runner & validator
│   │   ├── sound.js        # Web Audio API sound synthesizers
│   │   └── storage.js      # Player progress persistence manager
│   ├── App.jsx             # Main game hub & state orchestrator
│   ├── index.css           # Custom theme & utility rules
│   └── main.jsx            # React root entry
├── index.html              # HTML5 entry with meta tags
├── package.json
└── vite.config.js
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
