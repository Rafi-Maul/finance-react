import React, { useState, useEffect } from "react";
import {
  Building2,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  Network,
  CheckCircle2,
  Building,
  ChevronRight,
  RefreshCw,
  Sliders,
  MapPin,
  Users,
  MoreVertical,
  Pencil,
  Trash2
} from "lucide-react";
import { api as mockApi } from "../services/api";

export const OfficeList = ({ onNavigateToPermissions, onNavigateToEdit }) => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  // New office form state
  const [newOffice, setNewOffice] = useState({
    name: "",
    type: "Anper",
    parent: "PT Ardana Perkasa Group",
    reportAccess: "Anper Sendiri"
  });

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getOffices();
      setOffices(data);
    } catch (err) {
      console.error("Failed to fetch offices", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffice = async (e) => {
    e.preventDefault();
    if (!newOffice.name.trim()) return;

    try {
      await mockApi.addEntity({
        ...newOffice,
        typeClass: newOffice.type === "Holding" ? "Holding (Induk)" : newOffice.type === "Cabang" ? "Cabang Operasional" : "Anak Perusahaan (Anper)"
      });
      setShowAddModal(false);
      setNewOffice({
        name: "",
        type: "Anper",
        parent: "PT Ardana Perkasa Group",
        reportAccess: "Anper Sendiri"
      });
      fetchOffices();
    } catch (err) {
      console.error("Failed to add office", err);
    }
  };

  const handleDeleteOffice = async (office) => {
    setOpenActionMenuId(null);
    if (!window.confirm(`Hapus office "${office.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await mockApi.deleteOffice(office.id);
      fetchOffices();
    } catch (err) {
      console.error("Failed to delete office", err);
      alert(err.message || "Gagal menghapus office");
    }
  };

  const filteredOffices = offices.filter((o) => {
    const parentStr = typeof o.parent === "object" ? (o.parent?.name || "") : (o.parent || "");
    const matchesSearch = 
      (o.name && o.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      parentStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "ALL" || o.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getBadgeStyle = (badgeType) => {
    switch (badgeType) {
      case "green":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "blue":
        return "bg-sky-100 text-sky-900 border-sky-300";
      case "purple":
        return "bg-purple-100 text-purple-900 border-purple-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Office Config / Master Office</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Daftar Office & Entitas Perusahaan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola seluruh Kantor Holding, Anak Perusahaan (Anper), Cabang, dan Unit KCL dalam grup APG Finance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00c885] hover:bg-[#00b377] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Office Baru</span>
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-slate-400">Total Office</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{offices.length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">✓ Seluruh Entitas Terdaftar</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-slate-400">Anak Perusahaan (Anper)</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {offices.filter(o => o.type === "Anper").length} Unit
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Anper Terintegrasi</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-slate-400">Cabang Operasional</p>
          <p className="text-2xl font-black text-sky-600 mt-1">
            {offices.filter(o => o.type === "Cabang").length} Cabang
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Unit Operasional Regional</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-slate-400">Holding / KCL</p>
          <p className="text-2xl font-black text-purple-600 mt-1">
            {offices.filter(o => o.type === "Holding" || o.type === "KCL").length} Unit
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Pusat & KCL Internal</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama office, induk..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-slate-800 focus:outline-emerald-500"
          />
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500">Tipe Office:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-emerald-500 cursor-pointer"
          >
            <option value="ALL">Semua Tipe</option>
            <option value="Holding">Holding (Induk)</option>
            <option value="Anper">Anak Perusahaan (Anper)</option>
            <option value="Cabang">Cabang Operasional</option>
            <option value="KCL">Internal Unit (KCL)</option>
          </select>
        </div>
      </div>

      {/* Offices Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Nama Office & Entitas</th>
                <th className="py-4 px-6">Tipe Office</th>
                <th className="py-4 px-6">Induk Entitas (Parent)</th>
                <th className="py-4 px-6">Scope Akses Laporan</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Memuat daftar office...
                  </td>
                </tr>
              ) : filteredOffices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Tidak ada office yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredOffices.map((office) => (
                  <tr key={office.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{office.name}</p>
                        <p className="text-[10px] text-slate-400">ID: {office.id}</p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] px-2.5 py-1 rounded-lg border font-bold ${getBadgeStyle(office.badgeType)}`}>
                        {office.typeClass || office.type}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-700 font-semibold">
                      {typeof office.parent === "object" ? (office.parent?.name || "-") : (office.parent || "-")}
                    </td>

                    <td className="py-4 px-6 text-slate-600">
                      {office.reportAccess}
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {office.status || "Aktif"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenActionMenuId(openActionMenuId === office.id ? null : office.id)}
                          className="w-8 h-8 inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === office.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenActionMenuId(null)}
                            />
                            <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden text-left">
                              <button
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  onNavigateToEdit && onNavigateToEdit(office.id);
                                }}
                                className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                                <span>Edit Office</span>
                              </button>
                              <button
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  onNavigateToPermissions && onNavigateToPermissions(office.id);
                                }}
                                className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                              >
                                <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Atur Hak Akses</span>
                              </button>
                              <button
                                onClick={() => handleDeleteOffice(office)}
                                className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer border-t border-slate-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus Office</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Office */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">Tambah Office Baru</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddOffice} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Office / Entitas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Perkasa Utama / Cabang Bandung"
                  value={newOffice.name}
                  onChange={(e) => setNewOffice({ ...newOffice, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipe Office</label>
                <select
                  value={newOffice.type}
                  onChange={(e) => setNewOffice({ ...newOffice, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500 cursor-pointer"
                >
                  <option value="Anper">Anak Perusahaan (Anper)</option>
                  <option value="Cabang">Cabang Operasional</option>
                  <option value="KCL">Internal Unit (KCL)</option>
                  <option value="Holding">Holding (Induk)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Induk Entitas (Parent)</label>
                <select
                  value={newOffice.parent}
                  onChange={(e) => setNewOffice({ ...newOffice, parent: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500 cursor-pointer"
                >
                  <option value="PT Ardana Perkasa Group">PT Ardana Perkasa Group (Holding)</option>
                  {offices.filter(o => o.type === "Anper").map((o) => (
                    <option key={o.id} value={o.name}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Akses Laporan Keuangan</label>
                <input
                  type="text"
                  value={newOffice.reportAccess}
                  onChange={(e) => setNewOffice({ ...newOffice, reportAccess: e.target.value })}
                  placeholder="Contoh: Anper & Cabang Sendiri"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00c885] hover:bg-[#00b377] text-white rounded-xl font-bold transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Simpan Office
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
