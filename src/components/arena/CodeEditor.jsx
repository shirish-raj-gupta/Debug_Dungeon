import React, { useRef, useState, useMemo } from 'react';
import Card from '../common/Card';
import { FileCode, RotateCcw, Copy, Check } from 'lucide-react';
import { sfx } from '../../utils/sound';

/**
 * Escapes HTML entities for safe rendering in the syntax overlay
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Single-pass JavaScript syntax highlighter.
 * Highlights keywords, strings, comments, numbers, booleans, and functions in real-time.
 */
function highlightCode(code) {
  if (!code) return '';

  const TOKEN_REGEX = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b(?:function|return|const|let|var|if|else|async|await|new|try|catch|finally|throw|typeof|instanceof|class|import|export|from|for|while|do|switch|case|break|continue|default|yield|in|of)\b)|(\b(?:true|false|null|undefined|NaN|Infinity)\b)|(\b\d+(?:\.\d+)?\b)|(\b[A-Z][a-zA-Z0-9_$]*\b)|(\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())/g;

  let lastIndex = 0;
  let html = '';
  let match;

  while ((match = TOKEN_REGEX.exec(code)) !== null) {
    if (match.index > lastIndex) {
      html += escapeHtml(code.substring(lastIndex, match.index));
    }

    const [fullMatch, comment, string, keyword, boolOrNull, number, className, fnName] = match;

    if (comment) {
      html += `<span class="text-slate-500 italic">${escapeHtml(comment)}</span>`;
    } else if (string) {
      html += `<span class="text-emerald-300">${escapeHtml(string)}</span>`;
    } else if (keyword) {
      html += `<span class="text-purple-400 font-semibold">${escapeHtml(keyword)}</span>`;
    } else if (boolOrNull) {
      html += `<span class="text-amber-400 font-medium">${escapeHtml(boolOrNull)}</span>`;
    } else if (number) {
      html += `<span class="text-cyan-300 font-mono">${escapeHtml(number)}</span>`;
    } else if (className) {
      html += `<span class="text-yellow-300">${escapeHtml(className)}</span>`;
    } else if (fnName) {
      html += `<span class="text-sky-300 font-semibold">${escapeHtml(fnName)}</span>`;
    } else {
      html += escapeHtml(fullMatch);
    }

    lastIndex = TOKEN_REGEX.lastIndex;
  }

  if (lastIndex < code.length) {
    html += escapeHtml(code.substring(lastIndex));
  }

  if (code.endsWith('\n')) {
    html += ' ';
  }

  return html;
}

export default function CodeEditor({
  challengeId = 'syn-01',
  code = '',
  onChange,
  onResetCode,
  onRunCode,
  readOnly = false,
  isRunning = false,
}) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Compute total lines
  const lines = useMemo(() => code.split('\n'), [code]);
  const lineCount = lines.length;

  // Compute highlighted HTML string
  const highlightedHtml = useMemo(() => highlightCode(code), [code]);

  // Update cursor position line & col
  const updateCursorPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const pos = textarea.selectionStart;
    const textBefore = code.substring(0, pos);
    const splitLines = textBefore.split('\n');
    const currentLine = splitLines.length;
    const currentCol = splitLines[splitLines.length - 1].length + 1;
    setCursorPos({ line: currentLine, col: currentCol });
  };

  // Synchronize scroll between textarea, syntax pre, and line numbers gutter
  const handleScroll = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (preRef.current) {
      preRef.current.scrollTop = textarea.scrollTop;
      preRef.current.scrollLeft = textarea.scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textarea.scrollTop;
    }
  };

  // Keyboard shortcut handler
  const handleKeyDown = (e) => {
    // Run Code shortcut: Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onRunCode) onRunCode();
      return;
    }

    // Tab key indent
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Shift+Tab: Remove 2 spaces if at line start
        const before = code.substring(0, start);
        const after = code.substring(end);
        if (before.endsWith('  ')) {
          const newCode = before.slice(0, -2) + after;
          onChange(newCode);
          requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(0, start - 2);
            updateCursorPosition();
          });
        }
      } else {
        // Tab: Insert 2 spaces
        const newCode = code.substring(0, start) + '  ' + code.substring(end);
        onChange(newCode);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
          updateCursorPosition();
        });
      }
    }
  };

  const handleCopy = () => {
    sfx.playClick();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card glow="cyan" className="overflow-hidden flex flex-col bg-dungeon-950 border-cyan-500/40 shadow-2xl relative">
      {/* Top running laser bar indicator */}
      {isRunning && (
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse z-30 shadow-glow-cyan" />
      )}

      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-dungeon-900/95 border-b border-dungeon-800 text-xs font-mono select-none">
        {/* Left: Window Controls & Active File */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 hover:bg-rose-400 transition-colors inline-block shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-400 transition-colors inline-block shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-400 transition-colors inline-block shadow-sm" />
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white tracking-wide text-xs">patch_{challengeId}.js</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 hidden xs:inline">
              JS
            </span>
          </div>
        </div>

        {/* Right: Quick Tools & Line Info */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-400 text-[11px]">
          <span className="hidden sm:inline text-slate-500 font-mono">
            {lineCount} lines
          </span>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-dungeon-950/60 border border-dungeon-800/80 hover:bg-dungeon-800 hover:border-slate-600 text-slate-400 hover:text-cyan-300 active:scale-95 transition-all"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Reset Code Button */}
          {onResetCode && (
            <button
              onClick={() => {
                if (window.confirm('Revert code back to the initial buggy snippet for this challenge?')) {
                  onResetCode();
                }
              }}
              className="flex items-center gap-1 px-2 py-1 rounded bg-dungeon-950/60 border border-dungeon-800/80 hover:bg-dungeon-800 hover:border-amber-600/50 text-slate-400 hover:text-amber-300 active:scale-95 transition-all"
              title="Reset code to original challenge bug"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Body: Line Numbers + Overlay Syntax Editor */}
      <div className="relative flex h-[280px] sm:h-[350px] md:h-[390px] bg-dungeon-950 font-mono text-xs sm:text-sm overflow-hidden">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          className="w-10 sm:w-12 py-3 bg-dungeon-900/60 border-r border-dungeon-800/80 select-none overflow-hidden text-right pr-2 sm:pr-3 text-slate-600 text-xs leading-6 flex-shrink-0 font-mono"
        >
          {Array.from({ length: lineCount }).map((_, i) => {
            const lineNum = i + 1;
            const isActive = lineNum === cursorPos.line;
            return (
              <div 
                key={i} 
                className={`transition-colors duration-100 ${
                  isActive ? 'text-cyan-400 font-bold bg-cyan-500/10 -mr-2 sm:-mr-3 pr-2 sm:pr-3 rounded-l' : 'hover:text-slate-400'
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Code Canvas Container */}
        <div className="relative flex-1 h-full overflow-hidden">
          {/* Syntax Highlighted Backdrop */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 p-3 m-0 bg-transparent text-slate-200 leading-6 whitespace-pre overflow-auto pointer-events-none select-none font-mono text-xs sm:text-sm"
            style={{ tabSize: 2 }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />

          {/* Transparent Interactive Textarea on Top */}
          <textarea
            id="code-editor-textarea"
            name="challengeCode"
            aria-label="JavaScript Challenge Code Editor"
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              onChange(e.target.value);
              updateCursorPosition();
            }}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onSelect={updateCursorPosition}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            readOnly={readOnly || isRunning}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className={`absolute inset-0 w-full h-full p-3 m-0 bg-transparent text-transparent caret-cyan-400 leading-6 resize-none focus:outline-none overflow-auto whitespace-pre font-mono text-xs sm:text-sm selection:bg-cyan-500/35 selection:text-transparent ${
              isRunning ? 'cursor-wait opacity-80' : ''
            }`}
            style={{ tabSize: 2 }}
          />

          {/* Running Execution Shimmer Overlay */}
          {isRunning && (
            <div className="absolute inset-0 bg-dungeon-950/50 backdrop-blur-[0.5px] pointer-events-none flex items-center justify-center animate-in fade-in duration-150">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dungeon-900/95 border border-cyan-500/60 text-cyan-300 text-xs font-mono shadow-glow-cyan animate-pulse">
                <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>SANDBOX PROBE RUNNING...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Status Bar */}
      <div className="px-3 sm:px-4 py-1.5 bg-dungeon-900/90 border-t border-dungeon-800 flex items-center justify-between text-[11px] font-mono text-slate-500 select-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : 'bg-cyan-400 animate-pulse'}`} />
            <span className="text-cyan-400/90 font-medium">
              {isRunning ? 'EXEC_ACTIVE' : 'ES2024 JAVASCRIPT'}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-slate-500 hidden md:inline">Ctrl+↵ to run</span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span>UTF-8</span>
          <span>SPACES: 2</span>
        </div>
      </div>
    </Card>
  );
}
