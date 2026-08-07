import type { ReactNode } from "react";

type StatusBadgeType = "green" | "blue" | "purple" | "amber" | "red";

interface StatusBadgeProps {
  text: ReactNode;
  type?: StatusBadgeType;
}

export const StatusBadge = ({ text, type = "green" }: StatusBadgeProps) => {
  const colorMap: Record<StatusBadgeType, string> = {
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    red: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${colorMap[type] || colorMap.green}`}>
      {text}
    </span>
  );
};
