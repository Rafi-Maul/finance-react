import { Pin, X } from "lucide-react";
import { getTabLabel } from "../config/tabLabels";

export interface OpenTab {
  id: string;
  pinned: boolean;
}

interface TabBarProps {
  tabs: OpenTab[];
  activeTab: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const TabBar = ({ tabs, activeTab, onSelect, onClose, onTogglePin }: TabBarProps) => {
  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center gap-1 px-3 pt-2 bg-slate-100 border-b border-slate-200 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <div
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`group flex items-center gap-1.5 pl-3 pr-2 py-2 rounded-t-lg text-xs font-semibold cursor-pointer whitespace-nowrap max-w-[200px] shrink-0 transition-colors ${
              isActive
                ? "bg-white text-slate-900 shadow-[0_-1px_0_0_#00c885_inset]"
                : "text-slate-500 hover:bg-white/70"
            }`}
          >
            <span className="truncate">{getTabLabel(tab.id)}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(tab.id);
              }}
              title={tab.pinned ? "Lepas pin" : "Pin tab"}
              className={`shrink-0 p-0.5 rounded transition-opacity ${
                tab.pinned ? "text-emerald-600 opacity-100" : "text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-500"
              }`}
            >
              <Pin className="w-3 h-3" fill={tab.pinned ? "currentColor" : "none"} />
            </button>
            {!tab.pinned && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
                title="Tutup tab"
                className="shrink-0 p-0.5 rounded text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
