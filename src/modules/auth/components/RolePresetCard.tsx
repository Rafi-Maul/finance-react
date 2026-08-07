import { Shield } from "lucide-react";

interface RolePreset {
  title: string;
  badge: string;
  code: string;
  desc: string;
  modules: string[];
}

interface RolePresetCardProps {
  preset: RolePreset;
  isSelected: boolean;
  onSelect: (preset: RolePreset) => void;
}

export const RolePresetCard = ({ preset, isSelected, onSelect }: RolePresetCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(preset)}
      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
        isSelected
          ? "border-[#00c885] bg-emerald-950/40 shadow-md ring-1 ring-emerald-500/50"
          : "border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shield className={`w-4 h-4 ${isSelected ? "text-[#00c885]" : "text-slate-400"}`} />
          <span className="font-extrabold text-sm text-white">{preset.title}</span>
        </div>
        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${preset.badge}`}>
          {preset.code}
        </span>
      </div>

      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
        {preset.desc}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {preset.modules.map((mod, i) => (
          <span key={i} className="text-[9px] font-semibold bg-slate-800/80 text-emerald-300 px-2 py-0.5 rounded border border-slate-700">
            ✓ {mod}
          </span>
        ))}
      </div>
    </button>
  );
};
