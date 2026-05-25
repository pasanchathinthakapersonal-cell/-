import React, { useState } from "react";
import { BusinessReport, RoadmapPhase } from "../types";
import { Milestone, Rocket, Calendar, Map, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ImplementationRoadmapProps {
  report: BusinessReport;
}

export const ImplementationRoadmap: React.FC<ImplementationRoadmapProps> = ({ report }) => {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  return (
    <div className="flex flex-col gap-6 p-5 rounded-xl bg-cyber-card/80 border border-cyber-bright/35 h-full">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-cyber-bright/20 pb-3">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-cyber-tertiary" />
          <h3 className="font-display font-semibold text-sm tracking-wide uppercase text-white">
            Expansion Roadmap
          </h3>
        </div>
        <span className="text-[10px] bg-cyber-tertiary/10 border border-cyber-tertiary/20 text-cyber-tertiary font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          PHASED STEPS
        </span>
      </div>

      <p className="text-xs text-cyber-muted leading-relaxed">
        Our recommended chronological expansion strategy compiled by සිරිල්. Use these gates to progress from validation to hyper-scale.
      </p>

      {/* Horizontal Phase Tabs Controls */}
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {report.roadmap.map((p, index) => {
          const isActive = index === activePhaseIndex;
          return (
            <button
              key={index}
              onClick={() => setActivePhaseIndex(index)}
              className={`px-3 py-2 rounded-lg border text-xs font-medium tracking-wide flex-shrink-0 transition-all cursor-pointer ${
                isActive
                  ? "bg-cyber-tertiary/15 border-cyber-tertiary text-white shadow-[0_0_8px_rgba(0,241,196,0.3)]"
                  : "bg-cyber-surface border-cyber-bright/30 text-cyber-muted hover:border-cyber-bright hover:text-cyber-text"
              }`}
            >
              Phase {index + 1}
            </button>
          );
        })}
      </div>

      {/* Active Phase Details Card */}
      <div className="flex-1 bg-black/45 border border-cyber-bright/35 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhaseIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Timeline & Phase Name Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 border-b border-cyber-bright/20 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyber-tertiary uppercase">
                  GATEWAYS CHECKPOINT • PHASE {activePhaseIndex + 1}
                </span>
                <h4 className="font-display font-bold text-white text-base mt-0.5">
                  {report.roadmap[activePhaseIndex].phaseName}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-tertiary/10 border border-cyber-tertiary/20 text-cyber-tertiary text-xs shrink-0 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{report.roadmap[activePhaseIndex].timeline}</span>
              </div>
            </div>

            {/* Quote / Sub text */}
            <p className="text-xs text-cyber-text leading-relaxed bg-cyber-surface/40 border border-cyber-bright/20 p-3.5 rounded-lg font-light italic">
              " {report.roadmap[activePhaseIndex].description} "
            </p>

            {/* Core Action Tasks Checklist */}
            <div className="space-y-2.5 pt-1.5">
              <span className="text-[10.5px] uppercase font-label tracking-wider text-cyber-muted block">
                Critical Deliverables to Clear:
              </span>
              
              <div className="grid gap-2">
                {report.roadmap[activePhaseIndex].tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 bg-cyber-bg/40 border border-cyber-bright/25 rounded-lg p-3 text-xs leading-relaxed items-start group hover:border-cyber-tertiary/30 transition-all"
                  >
                    <div className="p-0.5 rounded-full border border-cyber-tertiary/30 bg-cyber-tertiary/5 text-cyber-tertiary mt-0.5 shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-cyber-text group-hover:text-white transition-all">
                      {task}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Next/Prev Navigation inside the card */}
        <div className="flex justify-between items-center border-t border-cyber-bright/25 pt-4 mt-6">
          <button
            onClick={() => setActivePhaseIndex((prev) => Math.max(0, prev - 1))}
            disabled={activePhaseIndex === 0}
            className="text-xs px-3 py-1.5 rounded bg-cyber-surface/60 border border-cyber-bright/35 text-cyber-muted hover:border-cyber-bright disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            ← Previous Gate
          </button>
          
          <button
            onClick={() => setActivePhaseIndex((prev) => Math.min(report.roadmap.length - 1, prev + 1))}
            disabled={activePhaseIndex === report.roadmap.length - 1}
            className="text-xs px-3 py-1.5 rounded bg-cyber-tertiary/10 border border-cyber-tertiary/35 text-cyber-tertiary hover:bg-cyber-tertiary hover:text-black hover:font-medium disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            Next Gate →
          </button>
        </div>
      </div>
    </div>
  );
};
