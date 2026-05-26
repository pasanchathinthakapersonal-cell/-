import React from "react";
import { MessageSquare, Plus, Trash2, ChevronRight } from "lucide-react";
import { WorkspaceThread } from "../types";

interface ThreadSidebarProps {
  threads: WorkspaceThread[];
  activeThreadId: string;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
  onDeleteThread: (id: string) => void;
}

export const ThreadSidebar: React.FC<ThreadSidebarProps> = ({
  threads,
  activeThreadId,
  onSelectThread,
  onNewThread,
  onDeleteThread,
}) => {
  return (
    <div className="flex flex-col h-full bg-cyber-card/80 border border-cyber-bright/35 rounded-xl shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-cyber-bright/30 bg-cyber-bg/90 flex items-center justify-between">
        <h2 className="font-display font-semibold text-sm text-white uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyber-primary" />
          Workspaces
        </h2>
        <button
          onClick={onNewThread}
          className="p-1.5 hover:bg-cyber-bright/50 rounded-full transition-colors text-cyber-muted hover:text-white"
          title="New Workspace"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {threads.map((thread) => {
          const isActive = thread.id === activeThreadId;
          return (
            <div
              key={thread.id}
              onClick={() => onSelectThread(thread.id)}
              className={`group flex items-center justify-between px-3 py-3 rounded-lg border cursor-pointer transition-all ${
                isActive
                  ? "bg-cyber-bright/40 border-cyber-primary/40 text-white"
                  : "bg-transparent border-transparent text-cyber-muted hover:bg-cyber-bright/20 hover:text-gray-300"
              }`}
            >
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-sm font-medium truncate font-display">
                  {thread.title}
                </p>
                <p className="text-[10px] font-mono opacity-60 mt-1 uppercase">
                  {new Date(thread.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteThread(thread.id);
                  }}
                  className={`p-1.5 rounded-md hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  title="Delete Workspace"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {isActive && <ChevronRight className="w-4 h-4 text-cyber-primary" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
