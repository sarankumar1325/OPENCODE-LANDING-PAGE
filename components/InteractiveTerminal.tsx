import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal as TerminalIcon, Search, X, Globe } from 'lucide-react';
import { useChat } from '../src/context/ChatContext';
import { TerminalLine } from '../src/types';

const InteractiveTerminal: React.FC = () => {
  const { state, sendMessage, clearChat, getHistory, addToHistory } = useChat();
  const [input, setInput] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.lines.length > 0) {
      setShowWelcome(false);
    }
  }, [state.lines.length]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }

    if (state.isLoading) {
      scrollIntervalRef.current = window.setInterval(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 50);
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [state.lines, state.isLoading]);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.isLoading) return;

    addToHistory(input);
    await sendMessage(input);
    setInput('');
    setTimeout(scrollToBottom, 100);
  }, [input, state.isLoading, sendMessage, addToHistory, scrollToBottom]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setInput(getHistory('up', input));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setInput(getHistory('down', input));
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      clearChat();
      setShowWelcome(true);
    }
  }, [input, getHistory, clearChat]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const renderLine = (line: TerminalLine) => {
    switch (line.type) {
      case 'input':
        return (
          <div className="flex items-start gap-3 py-1">
            <span className="text-terminal-green font-mono select-none">$</span>
            <span className="text-terminal-text font-mono whitespace-pre-wrap">{line.content}</span>
          </div>
        );
      case 'output':
        return (
          <div className="py-1 whitespace-pre-wrap font-mono text-terminal-text">
            {line.content}
          </div>
        );
      case 'system':
        return (
          <div className="py-1 whitespace-pre-wrap font-mono text-terminal-muted text-sm">
            {line.content}
          </div>
        );
      case 'error':
        return (
          <div className="py-1 whitespace-pre-wrap font-mono text-red-400">
            {line.content}
          </div>
        );
      case 'search':
        return (
          <div className="py-1 whitespace-pre-wrap font-mono text-terminal-green flex items-center gap-2">
            <Search size={14} />
            {line.content}
          </div>
        );
      default:
        return null;
    }
  };

  if (showWelcome) {
    return (
      <div className="w-full h-full min-h-[350px] md:min-h-[450px] bg-[#050505] flex flex-col items-center justify-center p-8 font-mono select-none relative overflow-hidden">
        <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">
          <div className="mb-16 md:mb-24 w-full max-w-[320px]">
            <img 
              src="/opencode-wordmark.svg" 
              alt="OpenCode" 
              className="w-full h-auto opacity-90"
              width="320"
              height="58"
            />
          </div>
          <div className="w-full max-w-xl backdrop-blur-sm bg-black/30 p-4 rounded border border-white/5">
            <div 
              className="flex items-center text-lg md:text-xl text-terminal-muted font-normal tracking-tight cursor-text"
              onClick={() => {
                setShowWelcome(false);
                setTimeout(focusInput, 100);
              }}
            >
              <div className="w-1 h-6 md:h-7 bg-terminal-green mr-4 animate-blink shadow-[0_0_10px_#22c55e]"></div>
              <span className="opacity-60">Ask me anything about OpenCode...</span>
            </div>
            <div className="mt-4 text-xs text-terminal-muted">
              <span className="text-white font-bold">Tip:</span> Press Enter to start chatting
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 right-8 flex gap-6 text-[10px] md:text-xs text-terminal-muted z-10 opacity-70">
          <span className="flex items-center gap-2"><span className="text-white font-bold">tab</span> switch agent</span>
          <span className="flex items-center gap-2"><span className="text-white font-bold">ctrl+l</span> clear</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full min-h-[350px] md:min-h-[450px] bg-[#050505] flex flex-col font-mono select-none relative overflow-hidden"
      onClick={focusInput}
    >
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1 scrollbar-thin scrollbar-thumb-terminal-border scrollbar-track-transparent"
      >
        {state.lines.map((line) => (
          <div key={line.id}>
            {renderLine(line)}
          </div>
        ))}
        
          {state.isLoading && (
            <div className="flex items-center gap-2 py-1">
              <span className="text-terminal-green animate-pulse">●</span>
              <span className="text-terminal-muted text-sm">Processing...</span>
            </div>
          )}
        </div>

      <form 
        onSubmit={handleSubmit}
        className="border-t border-terminal-border bg-terminal-black p-3 md:p-4"
      >
        <div className="flex items-center">
          <span className="text-terminal-green font-mono select-none mr-3">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent text-terminal-text placeholder-terminal-muted/50 outline-none font-mono text-sm md:text-base"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="text-terminal-muted hover:text-terminal-text ml-2"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      <div className="absolute bottom-2 right-4 flex gap-4 text-[10px] text-terminal-muted z-10 opacity-50">
        <span className="flex items-center gap-1">
          <Globe size={10} />
          Tavily
        </span>
        <span>•</span>
        <span>Groq/Kimi-K2</span>
      </div>
    </div>
  );
};

export default InteractiveTerminal;
