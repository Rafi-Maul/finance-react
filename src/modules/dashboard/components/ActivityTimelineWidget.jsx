import React from "react";
import { useAuth } from "../../../context/AuthContext";

export const ActivityTimelineWidget = () => {
  const { currentUser } = useAuth();
  const userName = currentUser?.name?.split(" ")[0] || "Rafi";

  return (
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
          <div className="text-center w-14 shrink-0 border-r border-slate-100 pr-4">
            <p className="text-xs text-slate-400 font-medium">Kemarin</p>
            <p className="text-2xl font-extrabold text-slate-800 leading-none my-1">28</p>
            <p className="text-xs font-bold text-slate-600">Jul</p>
          </div>

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
  );
};
