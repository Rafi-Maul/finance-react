import React from "react";

export const MetricCard = ({ 
  title, 
  value, 
  subtext, 
  accentColor = "border-l-[#00c885]",
  valueColor = "text-slate-900",
  badgeText,
  badgeColor = "bg-emerald-50 text-emerald-600"
}) => {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 ${accentColor} flex flex-col justify-between`}>
      <div>
        <p className="text-xs font-semibold text-slate-500">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h3 className={`text-2xl font-bold ${valueColor}`}>{value}</h3>
          {badgeText && (
            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${badgeColor}`}>
              {badgeText}
            </span>
          )}
        </div>
      </div>
      {subtext && (
        <div className="text-xs font-semibold mt-3 text-slate-600">
          {subtext}
        </div>
      )}
    </div>
  );
};
