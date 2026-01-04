import React from 'react';
import { Terminal, Github, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-terminal-black border-b border-terminal-border z-40 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-terminal-green font-bold tracking-tighter">
          <Terminal size={20} />
          <span>OPENCODE_</span>
        </div>
        <div className="hidden md:flex text-xs text-terminal-muted gap-4 ml-8">
           <a href="https://opencode.ai/docs/" target="_blank" rel="noopener noreferrer" className="hover:text-terminal-text transition-colors">DOCS</a>
           <span className="text-terminal-border">|</span>
           <a href="https://opencode.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-terminal-text transition-colors">ENTERPRISE</a>
           <span className="text-terminal-border">|</span>
           <a href="https://opencode.ai/zen" target="_blank" rel="noopener noreferrer" className="hover:text-terminal-text transition-colors text-terminal-green">ZEN</a>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs md:text-sm">
        <a href="https://github.com/opencode-ai/opencode" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 hover:text-white transition-colors group">
          <Github size={16} />
          <span className="group-hover:underline decoration-terminal-green underline-offset-4">[47K]</span>
        </a>
        <a href="https://opencode.ai/install" target="_blank" rel="noopener noreferrer" className="bg-terminal-border hover:bg-terminal-text hover:text-terminal-black px-3 py-1 transition-all">
          DOWNLOAD
        </a>
        <button 
          className="md:hidden text-terminal-muted hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-terminal-black border-b border-terminal-border p-4 flex flex-col gap-4 md:hidden">
          <a href="https://github.com/opencode-ai/opencode" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-terminal-muted hover:text-white">
            <Github size={16} />
            <span>GitHub [47K]</span>
          </a>
          <a href="https://opencode.ai/docs/" target="_blank" rel="noopener noreferrer" className="text-terminal-muted hover:text-white">DOCS</a>
          <a href="https://opencode.ai/" target="_blank" rel="noopener noreferrer" className="text-terminal-muted hover:text-white">ENTERPRISE</a>
          <a href="https://opencode.ai/zen" target="_blank" rel="noopener noreferrer" className="text-terminal-green hover:text-white">ZEN</a>
        </div>
      )}
    </header>
  );
};