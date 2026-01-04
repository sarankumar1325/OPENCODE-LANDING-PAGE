import React from 'react';

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  noBorder?: boolean;
}

export const Box: React.FC<BoxProps> = ({ children, className = "", title, noBorder = false }) => {
  return (
    <div className={`relative ${!noBorder ? 'border border-terminal-border' : ''} bg-terminal-black p-6 ${className}`}>
      {title && (
        <div className="absolute -top-3 left-4 bg-terminal-black px-2 text-xs font-bold tracking-widest text-terminal-muted uppercase">
          [{title}]
        </div>
      )}
      {children}
    </div>
  );
};