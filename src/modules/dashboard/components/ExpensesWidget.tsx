import { ChevronLeft, ChevronRight } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const ExpensesWidget = () => {
  const bebanPieData = [
    { name: "Beban Operasional", value: 100, color: "#00c885" }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-slate-900 text-sm">Beban Perusahaan</h4>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            <ChevronLeft className="w-3.5 h-3.5 cursor-pointer" />
            <span>1 Jan - 29 Jul 2026</span>
            <ChevronRight className="w-3.5 h-3.5 cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center justify-around my-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bebanPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={48}
                  dataKey="value"
                >
                  <Cell fill="#00c885" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-base font-extrabold text-[#00c885]">100%</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <p className="text-slate-400">Total Beban</p>
              <p className="font-bold text-slate-900 text-sm">Rp 1.660.000</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c885]"></span>
              <span className="text-slate-600">Beban Operasional</span>
              <span className="font-bold text-slate-900">100%</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-4">Dibanding 1 Jun - 30 Jun 2026</p>
      </div>

      <div className="mt-4 bg-emerald-50/80 border border-emerald-100 text-emerald-800 rounded-xl p-3 text-xs">
        <p className="font-bold">Beban Operasional Lainnya</p>
        <p className="text-[11px] text-emerald-700 mt-0.5">Rp 1.660.000 (100% dari total pengeluaran)</p>
      </div>
    </div>
  );
};
