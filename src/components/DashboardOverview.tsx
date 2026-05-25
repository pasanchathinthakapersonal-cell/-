import React from "react";
import { Milestone, BusinessReport } from "../types";
import { CheckCircle2, Circle, Clock, TrendingUp, AlertTriangle, ListTodo, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface DashboardOverviewProps {
  report: BusinessReport;
  onUpdateMilestone: (milestoneId: string, status: 'completed' | 'in-progress' | 'upcoming') => void;
  isFloatingView?: boolean;
  onCloseFloating?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  report,
  onUpdateMilestone,
  isFloatingView = false,
  onCloseFloating,
}) => {
  // Calculate stats
  const totalMilestones = report.milestones.length;
  const completedMilestones = report.milestones.filter((m) => m.status === "completed").length;
  const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  
  const openIssuesCount = report.issues.filter((i) => i.status !== "Resolved").length;

  return (
    <div className={`flex flex-col gap-5 ${isFloatingView ? "bg-cyber-bg/95 backdrop-blur-xl p-6 rounded-2xl border border-cyber-primary/40 shadow-[0_0_35px_rgba(0,255,157,0.3)] max-w-lg w-full max-h-[85vh] overflow-y-auto" : ""}`}>
      {/* Slide Header (if floating popup) */}
      {isFloatingView && (
        <div className="flex items-center justify-between border-b border-cyber-bright/35 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-primary opacity-75 animate-duration-1000"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-primary"></span>
            </span>
            <h3 className="font-display font-semibold text-base text-white tracking-wide">
              CONSULTING DASHBOARD
            </h3>
          </div>
          <button
            onClick={onCloseFloating}
            className="text-xs px-2.5 py-1 rounded bg-cyber-bright/30 text-cyber-text hover:bg-cyber-primary hover:text-black transition-all cursor-pointer"
          >
            Collapse
          </button>
        </div>
      )}

      {/* Business Name Header */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyber-surface to-cyber-bg border border-cyber-bright/40">
        <span className="text-[10px] font-label font-light text-cyber-tertiary uppercase tracking-[0.2em]">
          Current Active Mandate
        </span>
        <h3 className="font-display font-bold text-lg text-white mt-1 filter drop-shadow-[0_0_8px_rgba(234,250,230,0.15)]">
          {report.businessName}
        </h3>
        <p className="text-xs text-cyber-muted mt-1 leading-relaxed">
          {report.category} • {report.summary}
        </p>
      </div>

      {/* Progress Tracker (Giant Radial or Bar) */}
      <div className="p-5 rounded-xl bg-cyber-card border border-cyber-bright/30">
        <h4 className="text-xs font-label uppercase tracking-wider text-cyber-muted mb-3 flex items-center justify-between">
          <span>Overall Market-Ready Progress</span>
          <span className="text-cyber-primary font-mono text-xs">{progressPercent}%</span>
        </h4>
        
        {/* Modern Bar with segmented divisions */}
        <div className="h-4 bg-cyber-surface rounded-full overflow-hidden p-[2px] border border-cyber-bright/30">
          <motion.div
            className="h-full bg-gradient-to-r from-cyber-secondary via-cyber-primary to-cyber-tertiary rounded-full shadow-[0_0_8px_#00ff9d]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        
        <div className="flex justify-between items-center text-[10px] text-cyber-muted font-mono mt-2">
          <span>Concept Launch</span>
          <span>{progressPercent < 40 ? "Validating viability..." : progressPercent < 80 ? "Scaling blueprint..." : "Market Ready!"}</span>
          <span>Hyper Scaling</span>
        </div>
      </div>

      {/* Core KPIs Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-bright/30 text-center">
          <span className="text-cyber-muted text-[10px] font-label uppercase block">Viability</span>
          <span className="text-xl font-bold font-display text-cyber-primary mt-1 block">
            {report.overallScore}/100
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-bright/30 text-center">
          <span className="text-cyber-muted text-[10px] font-label uppercase block">Open Risks</span>
          <span className="text-xl font-bold font-display text-red-400 mt-1 block">
            {openIssuesCount}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-bright/30 text-center">
          <span className="text-cyber-muted text-[10px] font-label uppercase block">Completed</span>
          <span className="text-xl font-bold font-display text-cyber-tertiary mt-1 block">
            {completedMilestones}/{totalMilestones}
          </span>
        </div>
      </div>

      {/* Recent Milestones List with interactive toggle */}
      <div className="flex-1 min-h-[180px]">
        <h4 className="text-xs font-label uppercase tracking-widest text-cyber-muted mb-3 flex items-center gap-1.5 border-b border-cyber-bright/20 pb-2">
          <ListTodo className="w-3.5 h-3.5 text-cyber-tertiary" />
          <span>Milestone Phase Checkpoints</span>
        </h4>

        <div className="space-y-2.5">
          {report.milestones.map((m) => {
            const isCompleted = m.status === "completed";
            const isInProgress = m.status === "in-progress";

            return (
              <div
                key={m.id}
                className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                  isCompleted
                    ? "bg-cyber-primary/5 border-cyber-primary/20 text-cyber-muted"
                    : isInProgress
                    ? "bg-cyber-tertiary/5 border-cyber-tertiary/40 text-cyber-text"
                    : "bg-cyber-surface/40 border-cyber-bright/20 text-cyber-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const nextStatus = isCompleted ? "upcoming" : isInProgress ? "completed" : "in-progress";
                      onUpdateMilestone(m.id, nextStatus);
                    }}
                    className="text-cyber-primary hover:text-white transition-all shrink-0 cursor-pointer"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-cyber-primary shadow-sm" />
                    ) : isInProgress ? (
                      <Clock className="w-5 h-5 text-cyber-tertiary animate-pulse" />
                    ) : (
                      <Circle className="w-5 h-5 text-cyber-bright" />
                    )}
                  </button>
                  <div>
                    <span className={`text-xs font-medium block ${isCompleted ? "line-through text-cyber-muted opacity-60" : "text-white"}`}>
                      {m.title}
                    </span>
                    <span className="text-[9px] font-mono uppercase text-cyber-muted tracking-wider block mt-0.5">
                      Target: {m.targetDate}
                    </span>
                  </div>
                </div>

                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                  isCompleted
                    ? "border-cyber-primary/20 bg-cyber-primary/10 text-cyber-primary"
                    : isInProgress
                    ? "border-cyber-tertiary/30 bg-cyber-tertiary/10 text-cyber-tertiary"
                    : "border-cyber-bright/20 bg-cyber-bright/10 text-cyber-muted"
                }`}>
                  {m.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
