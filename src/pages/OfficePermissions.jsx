import React, { useState, useEffect } from "react";
import { 
  Sliders, 
  Building2, 
  ShieldCheck, 
  Check, 
  Save, 
  CheckSquare, 
  Square,
  Building,
  Info,
  CheckCircle2,
  Settings,
  Briefcase,
  BookOpen,
  Wallet,
  ShoppingCart,
  ShoppingBag,
  Package,
  Boxes,
  FileText
} from "lucide-react";
import { api as mockApi } from "../services/api";
import { SYSTEM_MODULES } from "../services/mockData";

export const OfficePermissions = ({ initialOfficeId }) => {
  const [offices, setOffices] = useState([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState(initialOfficeId || "ent-1");
  const [activeModules, setActiveModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedOfficeId) {
      loadOfficeModules(selectedOfficeId);
    }
  }, [selectedOfficeId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const officeData = await mockApi.getOffices();
      setOffices(officeData);
      const targetId = initialOfficeId || officeData[0]?.id || "ent-1";
      setSelectedOfficeId(targetId);
      await loadOfficeModules(targetId);
    } catch (err) {
      console.error("Failed to load offices data", err);
    } finally {
      setLoading(false);
    }
  };

  const loadOfficeModules = async (officeId) => {
    try {
      const mods = await mockApi.getOfficeModules(officeId);
      setActiveModules(mods);
    } catch (err) {
      console.error("Failed to load office modules", err);
    }
  };

  const handleToggleModule = (moduleId) => {
    setActiveModules((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  const handleSelectAll = () => {
    const allIds = SYSTEM_MODULES.map((m) => m.id);
    if (activeModules.length === allIds.length) {
      setActiveModules([]);
    } else {
      setActiveModules(allIds);
    }
  };

  const handleSaveOfficeModules = async () => {
    setSaving(true);
    try {
      await mockApi.updateOfficeModules(selectedOfficeId, activeModules);
      setSaveToast(true);
      setTimeout(() => {
        setSaveToast(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to save office modules", err);
    } finally {
      setSaving(false);
    }
  };

  const currentOffice = offices.find((o) => o.id === selectedOfficeId) || offices[0];

  const getModuleIcon = (modId) => {
    switch (modId) {
      case "MOD_PENGATURAN": return Settings;
      case "MOD_PERUSAHAAN": return Briefcase;
      case "MOD_BUKU_BESAR": return BookOpen;
      case "MOD_KAS_BANK": return Wallet;
      case "MOD_PENJUALAN": return ShoppingCart;
      case "MOD_PEMBELIAN": return ShoppingBag;
      case "MOD_PERSEDIAAN": return Package;
      case "MOD_ASET_TETAP": return Boxes;
      case "MOD_DAFTAR_LAPORAN": return FileText;
      default: return Building2;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Office Config / Hak Akses Modul Office</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pengaturan Hak Akses Modul per Office
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Superadmin memilih modul-modul mana saja yang diaktifkan untuk office ini. (Sub-modul diatur di Hak Akses User).
          </p>
        </div>

        {/* Office Selector */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <Building2 className="w-4 h-4 text-emerald-600 ml-1" />
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Pilih Office:</p>
            <select
              value={selectedOfficeId}
              onChange={(e) => setSelectedOfficeId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer mt-0.5"
            >
              {offices.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.type})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Save Toast Notification */}
      {saveToast && (
        <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <span>Hak Akses Modul untuk {currentOffice?.name} berhasil disimpan!</span>
          </div>
          <span className="text-[10px] bg-emerald-700 px-2.5 py-1 rounded-lg">
            {activeModules.length} Modul Aktif
          </span>
        </div>
      )}

      {/* Active Office Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#00c885] flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              {currentOffice?.name}
              <span className="text-[10px] bg-slate-800 text-emerald-300 border border-slate-700 px-3 py-1 rounded-full font-bold">
                {currentOffice?.typeClass || currentOffice?.type}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Parent: <span className="text-slate-300 font-semibold">{typeof currentOffice?.parent === "object" ? (currentOffice.parent?.name || "-") : (currentOffice?.parent || "-")}</span> • Scope: {currentOffice?.reportAccess}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs relative z-10">
          <div className="text-right hidden sm:block">
            <p className="text-slate-400 text-[10px] font-bold uppercase">MODUL DIAKTIFKAN</p>
            <p className="text-[#00c885] font-black text-lg">{activeModules.length} dari {SYSTEM_MODULES.length} Modul</p>
          </div>

          <button
            onClick={handleSaveOfficeModules}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#00c885] hover:bg-[#00b377] text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "Simpan Hak Akses Office"}</span>
          </button>
        </div>
      </div>

      {/* Main 9 Modules Selection Cards */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Modul Utama Sistem APG Finance</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Centang modul yang diizinkan untuk dibuka di Office <strong className="text-slate-800">{currentOffice?.name}</strong>.
            </p>
          </div>

          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            <span>{activeModules.length === SYSTEM_MODULES.length ? "Hapus Semua" : "Pilih Semua Modul"}</span>
          </button>
        </div>

        {/* 9 Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SYSTEM_MODULES.map((mod) => {
            const isChecked = activeModules.includes(mod.id);
            const IconComponent = getModuleIcon(mod.id);

            return (
              <div
                key={mod.id}
                onClick={() => handleToggleModule(mod.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isChecked
                    ? "bg-emerald-50/70 border-emerald-400 text-emerald-950 shadow-xs ring-1 ring-emerald-500/30"
                    : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-4 h-4 ${isChecked ? "text-emerald-600" : "text-slate-400"}`} />
                      <span className="font-extrabold text-sm text-slate-900">{mod.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isChecked ? "bg-emerald-200/80 text-emerald-900" : "bg-slate-200 text-slate-600"
                    }`}>
                      {isChecked ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{mod.description}</p>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                    <span>{mod.subModules.length} Sub-Modul / Wewenang</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Modul yang di-nonaktifkan di Office ini tidak akan muncul pada pilihan Hak Akses Peran / User.</span>
          </p>

          <button
            onClick={handleSaveOfficeModules}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#00c885] hover:bg-[#00b377] text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "Simpan Hak Akses Office"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
