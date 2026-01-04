import React from 'react';
import { Terminal, Github } from 'lucide-react';

export const NavBar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-terminal-black border-b border-terminal-border z-40 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-terminal-green font-bold tracking-tighter">
          <Terminal size={20} />
          <span>OPENCODE_</span>
        </div>
        <div className="hidden md:flex text-xs text-terminal-muted gap-4 ml-8">
           <a href="#" className="hover:text-terminal-text transition-colors">DOCS</a>
           <span className="text-terminal-border">|</span>
           <a href="#" className="hover:text-terminal-text transition-colors">ENTERPRISE</a>
           <span className="text-terminal-border">|</span>
           <a href="#" className="hover:text-terminal-text transition-colors text-terminal-green">ZEN</a>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs md:text-sm">
        <a href="https://github.com" className="flex items-center gap-2 hover:text-white transition-colors group">
          <Github size={16} />
          <span className="group-hover:underline decoration-terminal-green underline-offset-4">[45K]</span>
        </a>
        <button className="hidden md:block bg-terminal-border hover:bg-terminal-text hover:text-terminal-black px-3 py-1 transition-all">
          DOWNLOAD
        </button>
      </div>
    </header>
  );
};