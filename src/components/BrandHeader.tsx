import React from "react";
import { Shield, Sparkles, Activity } from "lucide-react";

interface BrandHeaderProps {
  onOpenDashboard: () => void;
  isLoading: boolean;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ onOpenDashboard, isLoading }) => {
  return (
    <header className="border-b border-cyber-bright/60 bg-cyber-bg/95 backdrop-blur px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-40">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        {/* Imagined Software & Bento Grid Logo block */}
        <div className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 bg-cyber-primary rounded flex items-center justify-center text-cyber-bg font-bold text-xl shadow-[0_0_15px_rgba(0,255,157,0.4)] font-display">
            ස
          </div>
          <div className="flex flex-col">
            <span className="font-display text-white text-md tracking-[0.25em] font-light leading-none uppercase">
              Imagine Software
            </span>
            <span className="font-label text-cyber-muted text-[10px] tracking-widest leading-none mt-1">
              CONSULTING ENGINE
            </span>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-cyber-bright/60 hidden md:block" />

        {/* Cyril "සිරිල්" Brand Name */}
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-xl text-white tracking-wide flex items-center gap-1.5">
            සිරිල් <span className="text-cyber-primary/70 font-light text-xs tracking-widest uppercase font-mono">v2.5</span>
          </span>
        </div>
      </div>

      {/* Consulting Status & Settings */}
      <div className="flex items-center gap-4 text-xs">
        <button
          onClick={onOpenDashboard}
          title="Open Dashboard Overview"
          className="flex items-center gap-2 px-3  py-1.5 rounded-md border border-cyber-primary/30 bg-cyber-primary/5 hover:bg-cyber-primary/10 hover:border-cyber-primary/60 hover:text-white transition-all text-cyber-primary cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-label tracking-wider uppercase text-[10px]">Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-cyber-bright/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-primary"></span>
          </span>
          <span className="font-mono text-[10px] uppercase text-cyber-muted tracking-wider">
            Cyril AI Online
          </span>
        </div>

        {isLoading && (
          <div className="flex items-center gap-1 text-cyber-tertiary">
            <Sparkles className="w-3 h-3 animate-spin" />
            <span className="font-mono text-[9px] uppercase tracking-wider">Analyzing...</span>
          </div>
        )}
      </div>
    </header>
  );
};
