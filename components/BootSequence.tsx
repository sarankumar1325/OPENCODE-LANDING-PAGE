import React, { useEffect, useState } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);

  const bootLines = [
    "INITIALIZING KERNEL...",
    "LOADING MODULES: [ OK ]",
    "MOUNTING FILE SYSTEM... [ READ-ONLY ]",
    "ESTABLISHING SECURE CONNECTION...",
    "VERIFYING INTEGRITY...",
    "OPENCODE AGENT: READY",
    "EXEC ./LANDING_PAGE.SH"
  ];

  useEffect(() => {
    let delay = 0;
    bootLines.forEach((line, index) => {
      delay += Math.random() * 200 + 50;
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (index === bootLines.length - 1) {
          setTimeout(onComplete, 600);
        }
      }, delay);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-terminal-black flex flex-col justify-end pb-10 pl-10 text-sm md:text-base">
      {lines.map((line, i) => (
        <div key={i} className="font-mono text-terminal-green">
          <span className="text-terminal-muted mr-3">
            {`000${i * 12 + 45}`.slice(-4)}:
          </span>
          {line}
        </div>
      ))}
      <div className="animate-blink w-3 h-5 bg-terminal-green mt-2"></div>
    </div>
  );
};