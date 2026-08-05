import React, { useState, useEffect } from "react";
import { Plus, RefreshCw, MoreHorizontal, Layers, CheckCircle2, X } from "lucide-react";
import { api as mockApi } from "../services/api";

export const ChartOfAccounts = () => {
  const [activeSubTab, setActiveSubTab] = useState("master");
  const [coaList, setCoaList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "ASET",
    category: "Kas & Bank",
    scope: "Holding & All Units",
    isSub: false
  });

  useEffect(() => {
    loadCOA();
  }, []);

  const loadCOA = async () => {
    const data = await mockApi.getCOA();
    setCoaList(data);
  };

  const handleSync = async () => {
    setSyncing(true);
    const res = await mockApi.syncCOA();
    setSyncing(false);
    setToastMsg(res.message);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return;
    await mockApi.addCOA(formData);
    setShowAddModal(false);
    setFormData({
      code: "",
      name: "",
      type: "ASET",
      category: "Kas & Bank",
      scope: "Holding & All Units",
      isSub: false
    });
    loadCOA();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="bg-emerald-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg("")} className="text-white hover:text-emerald-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Chart of Accounts (COA) Standar Holding
          </h3>
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-300">
            Standar 6 Digit Active
          </span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-[#00c885] hover:bg-[#00b377] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Akun Baru</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 border-l-[#00c885]">
          <p className="text-xs font-semibold text-slate-400">Total Akun Master (Holding)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-slate-900">148</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Standardized</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Terdistribusi ke 12 Company</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 border-l-emerald-500">
          <p className="text-xs font-semibold text-slate-400">Aturan Digit COA (6 Digit)</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">1-1-1-0-0</h3>
          <p className="text-[10px] text-slate-400 mt-2">Type • Parent • Sub • Detail • Extra</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 border-l-amber-500">
          <p className="text-xs font-semibold text-slate-400">Detail Sub-Account Active</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-slate-900">32</h3>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Sub-Detail</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Di Anper & Cabang</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 border-l-emerald-600 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Sinkronisasi Default COA</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Seluruh Anak Perusahaan, Cabang & KCL menggunakan COA ini.
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="mt-3 flex items-center justify-center gap-1.5 bg-[#00c885] hover:bg-[#00b377] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Menyinkronkan..." : "Distribusi COA Sekarang"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area with Sub-Tabs */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        {/* Tabs Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <button
            onClick={() => setActiveSubTab("master")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "master"
                ? "bg-[#00c885] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/50"
            }`}
          >
            Default COA Master
          </button>
          <button
            onClick={() => setActiveSubTab("rule")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "rule"
                ? "bg-[#00c885] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/50"
            }`}
          >
            Struktur & Digit Rule
          </button>
          <button
            onClick={() => setActiveSubTab("mapping")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "mapping"
                ? "bg-[#00c885] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/50"
            }`}
          >
            Mapping Sub-Account
          </button>
        </div>

        {/* Tab Content: Master Table */}
        {activeSubTab === "master" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">KODE AKUN</th>
                  <th className="py-3.5 px-6">NAMA AKUN / HIRARKI</th>
                  <th className="py-3.5 px-6">TIPE KELOMPOK</th>
                  <th className="py-3.5 px-6">KATEGORI LAPORAN</th>
                  <th className="py-3.5 px-6">LINGKUP AKSEBILITAS</th>
                  <th className="py-3.5 px-6">STATUS</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {coaList.map((item, idx) => (
                  <tr 
                    key={idx} 
                    className={`hover:bg-slate-50/60 transition-colors ${
                      item.isSub ? "bg-amber-50/30" : ""
                    }`}
                  >
                    <td className="py-4 px-6 font-extrabold text-slate-900 font-mono">
                      {item.code}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {item.isSub ? (
                        <div className="flex items-center gap-2 pl-4">
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                            SUB-ACCOUNT
                          </span>
                          <span className="text-slate-700">{item.name}</span>
                        </div>
                      ) : (
                        <span>{item.name}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {item.category}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${item.scopeBadge}`}>
                        {item.scope}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="p-1 rounded-md hover:bg-slate-200/60 text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Rule */}
        {activeSubTab === "rule" && (
          <div className="p-6 text-xs text-slate-600 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Ketentuan Format COA 6 Digit</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="font-bold text-slate-900">Digit 1</p>
                <p className="text-[10px] text-slate-500">Tipe Kelompok (1: ASET, 2: KEWAJIBAN, 3: EKUITAS, 4: PENDAPATAN, 5: BEBAN)</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="font-bold text-slate-900">Digit 2</p>
                <p className="text-[10px] text-slate-500">Sub-Kelompok Utama (Aset Lancar, Aset Tetap, dll)</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="font-bold text-slate-900">Digit 3</p>
                <p className="text-[10px] text-slate-500">Kategori Akun Operasional</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="font-bold text-slate-900">Digit 4-5</p>
                <p className="text-[10px] text-slate-500">Rincian Detail Akun Master</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="font-bold text-slate-900">Prefix Sub</p>
                <p className="text-[10px] text-slate-500">Prefix Identitas Anper (Contoh: 00-111101)</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Mapping */}
        {activeSubTab === "mapping" && (
          <div className="p-6 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 text-sm mb-2">Mapping Sub-Account per Anak Perusahaan</h4>
            <p>Seluruh sub-account terhubung otomatis dengan laporan Neraca & Laba Rugi konsolidasi Holding APG.</p>
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Tambah Akun COA Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Kode Akun</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 111200"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Nama Akun / Perkiraan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: BANK MANDIRI UTAMA"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Tipe Kelompok</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium bg-white"
                >
                  <option value="ASET">ASET (ASSET)</option>
                  <option value="KEWAJIBAN">KEWAJIBAN (LIABILITY)</option>
                  <option value="EKUITAS">EKUITAS (EQUITY)</option>
                  <option value="PENDAPATAN">PENDAPATAN (REVENUE)</option>
                  <option value="BEBAN">BEBAN (EXPENSE)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Kategori Laporan</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isSub"
                  checked={formData.isSub}
                  onChange={(e) => setFormData({ ...formData, isSub: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="isSub" className="text-slate-700 font-bold">
                  Merupakan Sub-Account (Khusus Anper/Cabang)
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00c885] hover:bg-[#00b377] text-white rounded-xl font-bold shadow-md shadow-emerald-500/20"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
