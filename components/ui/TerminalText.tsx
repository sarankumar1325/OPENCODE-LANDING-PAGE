import React, { useEffect, useState } from 'react';

interface TerminalTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
}

export const TerminalText: React.FC<TerminalTextProps> = ({ 
  text, 
  speed = 30, 
  delay = 0, 
  className = "",
  cursor = true 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [started, displayedText, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && displayedText.length < text.length && (
        <span className="inline-block w-2.5 h-5 align-middle bg-terminal-green animate-blink ml-1" />
      )}
    </span>
  );
};