import React from "react";

export const FooterCredits: React.FC = () => {
  return (
    <footer className="w-full py-4 px-6 border-t border-cyber-bright/30 bg-cyber-bg/95 flex flex-col items-center justify-center gap-1.5 select-none text-center">
      <p className="font-sans text-xs text-cyber-muted tracking-wide flex items-center justify-center gap-1">
        Built with <span className="text-red-500 animate-pulse text-base leading-none">❤︎</span>{" "}
        <span className="font-display font-medium text-white hover:text-cyber-primary transition-all">
          Imagine Software
        </span>
      </p>
      
      <p className="font-label text-cyber-muted text-[10px] tracking-widest uppercase flex items-center justify-center gap-1 flex-wrap">
        powered by{" "}
        <span className="text-cyber-tertiary transition-all font-mono font-bold hover:drop-shadow-[0_0_5px_rgba(0,241,196,0.3)]">
          CodeShop©
        </span>{" "}
        and{" "}
        <span className="text-cyber-primary transition-all font-mono font-bold hover:drop-shadow-[0_0_5px_#02e018]">
          CodeBase©
        </span>
      </p>
    </footer>
  );
};
