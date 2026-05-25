import React, { useState } from "react";
import { BusinessIssue, BusinessReport } from "../types";
import { AlertTriangle, AlertOctagon, HelpCircle, CheckCircle, ShieldAlert, BadgeAlert, Plus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IssueTrackerProps {
  report: BusinessReport;
  onUpdateIssueStatus: (issueId: string, status: 'Open' | 'In Progress' | 'Resolved') => void;
  onAddCustomIssue: (issue: Omit<BusinessIssue, 'id'>) => void;
}

export const IssueTracker: React.FC<IssueTrackerProps> = ({
  report,
  onUpdateIssueStatus,
  onAddCustomIssue,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Operations");
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>("Medium");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    onAddCustomIssue({
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      status: "Open",
      description: newDesc.trim(),
    });

    // Reset Form
    setNewTitle("");
    setNewDesc("");
    setShowAddForm(false);
  };

  const getPriorityColor = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 border-red-500/35 text-red-400";
      case "Medium":
        return "bg-amber-500/10 border-amber-500/35 text-amber-400";
      case "Low":
        return "bg-blue-500/10 border-blue-500/35 text-blue-400";
    }
  };

  const getPriorityIcon = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case "High":
        return <AlertOctagon className="w-4 h-4 text-red-500" />;
      case "Medium":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "Low":
        return <HelpCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5 rounded-xl bg-cyber-card/80 border border-cyber-bright/35 h-full">
      {/* Title Header with Add Trigger */}
      <div className="flex items-center justify-between border-b border-cyber-bright/20 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <h3 className="font-display font-semibold text-sm tracking-wide uppercase text-white">
            Operational Issue Tracker
          </h3>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-bright/40 text-cyber-muted hover:border-cyber-primary hover:text-cyber-primary transition-all text-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? "Cancel Log" : "Log Issue"}</span>
        </button>
      </div>

      <p className="text-xs text-cyber-muted leading-relaxed">
        Early identification of core obstacles is crucial. Filter and track critical risks across team disciplines.
      </p>

      {/* Slide-downs Add Issue Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            onSubmit={handleFormSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-black/40 border border-cyber-bright/30 gap-4 flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-cyber-bright/20 pb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyber-primary" />
              <span className="text-[11px] font-mono tracking-wider font-bold text-cyber-muted uppercase">
                LOG CYRIL AI DIAGNOSTIC OR REFRESHER CONCERN
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-cyber-muted uppercase font-label">Bottleneck Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. IoT Battery Depletion Rate"
                  className="bg-cyber-surface border border-cyber-bright/45 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-cyber-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-cyber-muted uppercase font-label">Discipline Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-cyber-surface border border-cyber-bright/45 rounded px-2 py-1.5 text-xs text-cyber-text outline-none focus:border-cyber-primary cursor-pointer"
                >
                  <option value="Operations">Operations / Supply Chain</option>
                  <option value="Regulatory">Regulatory & Compliance</option>
                  <option value="Technical">Technical Overhead</option>
                  <option value="Financial">Financial / Capital Runway</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-cyber-muted uppercase font-label">Risk Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="bg-cyber-surface border border-cyber-bright/45 rounded px-2 py-1.5 text-xs text-cyber-text outline-none focus:border-cyber-primary cursor-pointer"
                >
                  <option value="High">🔴 High Priority (Risk Stop)</option>
                  <option value="Medium">🟡 Medium Priority (Operational)</option>
                  <option value="Low">🔵 Low Priority (Optimistic)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyber-primary text-black font-semibold rounded text-xs hover:shadow-[0_0_10px_rgba(2,224,24,0.4)] transition-all cursor-pointer h-9 shrink-0 flex items-center justify-center gap-1"
                >
                  Confirm Risk Entry
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-cyber-muted uppercase font-label">Description & Solution Analysis</label>
              <textarea
                required
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Detail the mechanical or market bottlenecks, and write a quick recommended response strategy."
                className="bg-cyber-surface border border-cyber-bright/45 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-cyber-primary h-16 resize-none"
              />
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Issues Timeline Grid */}
      <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[400px]">
        {report.issues.length === 0 ? (
          <div className="text-center py-10 rounded-xl bg-black/25 border border-dashed border-cyber-bright/20 text-cyber-muted text-xs">
            No active barriers logged. Excellent work!
          </div>
        ) : (
          report.issues.map((issue) => {
            const isOpen = issue.status === "Open";
            const isInProgress = issue.status === "In Progress";
            const isResolved = issue.status === "Resolved";

            return (
              <div
                key={issue.id}
                className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-all duration-300 ${
                  isResolved
                    ? "bg-cyber-surface/10 border-cyber-bright/20 opacity-60 text-cyber-muted"
                    : "bg-cyber-surface/70 border-cyber-bright/35 text-cyber-text"
                }`}
              >
                {/* Details */}
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Priority Icon Badge */}
                    <div className="flex items-center gap-1">
                      {getPriorityIcon(issue.priority)}
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border tracking-wider font-semibold ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-cyber-muted uppercase font-semibold">
                      {issue.category}
                    </span>
                  </div>

                  <h4 className={`font-display font-medium text-xs text-white ${isResolved ? "line-through text-cyber-muted" : "text-white"}`}>
                    {issue.title}
                  </h4>

                  <p className="text-[11px] text-cyber-muted font-light leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                {/* Status Toggle Controls inside listing and visual indicator */}
                <div className="flex flex-col gap-1.5 shrink-0 w-full md:w-auto">
                  <span className={`text-[10px] font-mono text-center px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${
                    isResolved
                      ? "text-cyber-primary border-cyber-primary/20 bg-cyber-primary/5"
                      : isInProgress
                      ? "text-cyber-tertiary border-cyber-tertiary/20 bg-cyber-tertiary/5 animate-pulse"
                      : "text-red-400 border-red-500/20 bg-red-500/5"
                  }`}>
                    {issue.status}
                  </span>

                  <div className="flex gap-1">
                    <button
                      onClick={() => onUpdateIssueStatus(issue.id, "In Progress")}
                      disabled={isResolved}
                      className="text-[9px] uppercase font-mono px-2 py-1 rounded bg-cyber-bright/25 hover:bg-cyber-tertiary/10 hover:text-cyber-tertiary text-cyber-muted disabled:opacity-20 cursor-pointer flex-1 md:flex-none text-center"
                    >
                      Progress
                    </button>
                    <button
                      onClick={() => onUpdateIssueStatus(issue.id, "Resolved")}
                      disabled={isResolved}
                      className="text-[9px] uppercase font-mono px-2 py-1 rounded bg-cyber-primary/10 hover:bg-cyber-primary text-cyber-primary hover:text-black hover:font-bold disabled:opacity-20 cursor-pointer flex-1 md:flex-none text-center"
                    >
                      Solve
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
