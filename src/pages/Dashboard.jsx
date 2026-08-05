import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpRight,
  Info
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { useAuth } from "../context/AuthContext";

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const userName = currentUser?.name?.split(" ")[0] || "Rafi";

  // Data for Tren Penjualan
  const salesData = [
    { day: "Kam", sales: 0 },
    { day: "Jum", sales: 0 },
    { day: "Sab", sales: 0 },
    { day: "Min", sales: 0 },
    { day: "Sen", sales: 0 },
    { day: "Kemarin", sales: 0 },
    { day: "Hari ini", sales: 0 },
  ];

  // Data for Arus Kas
  const cashFlowData = [
    { date: "23 Jul", amount: 0 },
    { date: "24 Jul", amount: 0 },
    { date: "25 Jul", amount: 0 },
    { date: "26 Jul", amount: 0 },
    { date: "27 Jul", amount: 0 },
    { date: "28 Jul", amount: -670 },
    { date: "29 Jul", amount: 0 },
  ];

  // Donut chart Laba Rugi data
  const labaRugiPieData = [
    { name: "Pendapatan", value: 1000, color: "#00c885" },
    { name: "HPP", value: 10, color: "#f59e0b" },
    { name: "Pengeluaran", value: 1660, color: "#ef4444" }
  ];

  // Donut chart Beban data
  const bebanPieData = [
    { name: "Beban Operasional", value: 100, color: "#00c885" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Pendapatan (YTD) */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 border-l-[#00c885] flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Pendapatan (YTD)</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">Rp 1.000.000</h3>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>&gt;10x dibanding 2025</span>
          </div>
        </div>

        {/* Card 2: Total Beban & HPP */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 border-l-amber-500 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Beban & HPP</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">Rp 1.670.000</h3>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 mt-3">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Beban Operasional 100%</span>
          </div>
        </div>

        {/* Card 3: Laba / (Rugi) Bersih */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 border-l-red-500 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Laba / (Rugi) Bersih</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">- Rp 670.000</h3>
          </div>
          <div className="text-xs font-bold text-red-500 mt-3">
            Status: Defisit
          </div>
        </div>

        {/* Card 4: Posisi Arus Kas */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 border-l-blue-500 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Posisi Arus Kas</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">Rp 0</h3>
          </div>
          <div className="text-xs font-semibold text-blue-600 mt-3">
            7 Hari Terakhir
          </div>
        </div>
      </div>

      {/* Middle Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Laba/Rugi Tahun ini */}
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
              {/* Donut chart simulation */}
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

              {/* Breakdown detail list */}
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

        {/* Widget 2: Beban Perusahaan */}
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

        {/* Widget 3: Tren Penjualan */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 text-sm">Tren Penjualan</h4>
              <span className="text-[11px] text-slate-400 font-medium">(Seminggu terakhir)</span>
            </div>

            <div className="h-36 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 10]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-800">Aktivitas Penjualan Minggu Ini</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Belum ada transaksi penjualan tercatat dalam 7 hari terakhir.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bottom Left: Aktifitas Terakhir Anda (Rafi) */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-900 text-sm">
                Aktifitas Terakhir Anda ({userName})
              </h4>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                Lihat Semua
              </button>
            </div>

            <div className="flex gap-6">
              {/* Date Column */}
              <div className="text-center w-14 shrink-0 border-r border-slate-100 pr-4">
                <p className="text-xs text-slate-400 font-medium">Kemarin</p>
                <p className="text-2xl font-extrabold text-slate-800 leading-none my-1">28</p>
                <p className="text-xs font-bold text-slate-600">Jul</p>
              </div>

              {/* Timeline Items */}
              <div className="space-y-4 text-xs flex-1">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-white"></span>
                  <span className="font-bold text-slate-700 w-12">16:52</span>
                  <span className="text-slate-600">Buat Pembayaran 10002.2026.07.00001</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 bg-white"></span>
                  <span className="font-bold text-slate-700 w-12">16:50</span>
                  <span className="text-slate-600">Buat Akun Perkiraan Bank BRI</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 bg-white"></span>
                  <span className="font-bold text-slate-700 w-12">16:50</span>
                  <span className="text-slate-600">Buat Penomoran Bank BRI</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-white"></span>
                  <span className="font-bold text-slate-700 w-12">16:48</span>
                  <span className="text-slate-600">Buat Pembayaran 1101.2026.07.00002</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 bg-white"></span>
                  <span className="font-bold text-slate-700 w-12">16:46</span>
                  <span className="text-slate-600">Penyelesaian Draf Data Bank</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right: Arus Kas */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 text-sm">Arus Kas</h4>
              <span className="text-[11px] text-slate-400 font-medium">(23 Jul - 29 Jul 2026)</span>
            </div>

            <div className="h-44 w-full relative">
              {/* Highlight red band for 28 Jul */}
              <div className="absolute right-[14%] top-2 bottom-8 w-8 bg-red-100/60 rounded-md pointer-events-none"></div>
              
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowData}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    ticks={[0, -250, -500, -750]}
                    tickFormatter={(val) => `${val} rb`}
                  />
                  <Tooltip formatter={(value) => [`${value} rb`, "Arus Kas"]} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#0284c7" 
                    strokeWidth={2.5}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      if (payload.date === "28 Jul") {
                        return <circle key="dot-dip" cx={cx} cy={cy} r={5} fill="#ef4444" stroke="#ffffff" strokeWidth={2} />;
                      }
                      return <circle key={`dot-${payload.date}`} cx={cx} cy={cy} r={4} fill="#0284c7" />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold text-center">
            Pengeluaran Arus Kas Signifikan: -Rp 670.000 pada tanggal 28 Juli 2026 (Pembayaran Operasional)
          </div>
        </div>
      </div>
    </div>
  );
};
