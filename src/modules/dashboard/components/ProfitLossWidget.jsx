import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const ProfitLossWidget = () => {
  const labaRugiPieData = [
    { name: "Pendapatan", value: 1000, color: "#00c885" },
    { name: "HPP", value: 10, color: "#f59e0b" },
    { name: "Pengeluaran", value: 1660, color: "#ef4444" }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-slate-900 text-sm">Laba/Rugi Tahun ini</h4>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            <ChevronLeft className="w-3.5 h-3.5 cursor-pointer hover:text-slate-900" />
            <span>1 Jan - 29 Jul 2026</span>
            <ChevronRight className="w-3.5 h-3.5 cursor-pointer hover:text-slate-900" />
          </div>
        </div>

        <div className="flex items-center justify-between my-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={labaRugiPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={48}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {labaRugiPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-xs font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                &gt;10x
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00c885]"></span>
                <span className="text-slate-600">Pendapatan</span>
              </div>
              <span className="font-bold text-slate-900">Rp 1.000.000</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-600">Nilai HPP</span>
              </div>
              <span className="font-bold text-slate-900">Rp 10.000</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="text-slate-600">Pengeluaran</span>
              </div>
              <span className="font-bold text-slate-900">Rp 1.660.000</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Rugi Bersih</p>
            <p className="text-[10px] text-slate-400">Dibanding 1 Jan - 29 Jul 2025</p>
          </div>
          <p className="text-lg font-bold text-red-600">Rp 670.000</p>
        </div>
      </div>

      <div className="mt-4 bg-red-50 border border-red-100 text-red-600 rounded-xl p-2.5 text-center text-xs font-medium">
        Performa menurun dibanding periode lalu
      </div>
    </div>
  );
};
