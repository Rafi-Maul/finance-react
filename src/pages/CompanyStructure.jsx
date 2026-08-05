import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Building2, 
  Network, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  X,
  Layers,
  Search,
  Tag,
  Briefcase,
  Sliders,
  Filter
} from "lucide-react";
import { api as mockApi } from "../services/api";
import { OFFICE_TYPES } from "../services/mockData";

export const CompanyStructure = () => {
  const [entities, setEntities] = useState([]);
  const [activeTab, setActiveTab] = useState("company-list"); // "company-list" | "company-type" | "tree-view"
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);

  const [companyTypes, setCompanyTypes] = useState(OFFICE_TYPES);

  const [formData, setFormData] = useState({
    code: "OFF-5",
    name: "",
    type: "Office",
    parent: "PT Ardana Perkasa Group (OFF-0)",
    reportAccess: "Anper & Cabang Sendiri"
  });

  const [newTypeData, setNewTypeData] = useState({
    key: "",
    label: "",
    badge: "bg-indigo-100 text-indigo-800 border-indigo-300",
    description: ""
  });

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    const data = await mockApi.getCompanyStructure();
    setEntities(data);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    await mockApi.addEntity(formData);
    setShowAddModal(false);
    setFormData({
      code: `OFF-${entities.length + 1}`,
      name: "",
      type: "Office",
      parent: "PT Ardana Perkasa Group (OFF-0)",
      reportAccess: "Anper & Cabang Sendiri"
    });
    loadEntities();
  };

  const handleAddTypeSubmit = (e) => {
    e.preventDefault();
    if (!newTypeData.key || !newTypeData.label) return;
    setCompanyTypes([...companyTypes, newTypeData]);
    setShowAddTypeModal(false);
    setNewTypeData({
      key: "",
      label: "",
      badge: "bg-indigo-100 text-indigo-800 border-indigo-300",
      description: ""
    });
  };

  // Filtered entities
  const filteredEntities = entities.filter((e) => {
    const parentStr = typeof e.parent === "object" ? (e.parent?.name || "") : (typeof e.parent === "string" ? e.parent : "");
    const matchesSearch = 
      (e.name && e.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.code && String(e.code).toLowerCase().includes(searchQuery.toLowerCase())) ||
      parentStr.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "ALL" || e.type === filterType;
    return matchesSearch && matchesType;
  });

  const getBadgeStyle = (typeStr) => {
    const found = companyTypes.find((t) => t.key === typeStr);
    if (found) return found.badge;
    if (typeStr === "Holding") return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (typeStr === "Anper" || typeStr === "Office") return "bg-blue-100 text-blue-800 border-blue-300";
    if (typeStr === "Cabang" || typeStr === "Office Branch") return "bg-purple-100 text-purple-800 border-purple-300";
    if (typeStr === "KCL" || typeStr === "Office KCL") return "bg-amber-100 text-amber-800 border-amber-300";
    if (typeStr === "Office Sub-KCL") return "bg-rose-100 text-rose-800 border-rose-300";
    return "bg-slate-100 text-slate-800 border-slate-300";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Struktur & Klasifikasi Company (Multi-Entitas)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan sub modul <strong className="text-slate-800">Company</strong> (Daftar Entitas) dan <strong className="text-slate-800">Type Company</strong> pada sistem.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "company-type" ? (
            <button
              onClick={() => setShowAddTypeModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Type Company</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-[#00c885] hover:bg-[#00b377] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Company</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 border-l-emerald-500">
          <p className="text-xs font-semibold text-slate-400">Holding (Induk)</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {entities.filter((e) => e.type === "Holding").length} Company
          </h3>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 border-l-blue-500">
          <p className="text-xs font-semibold text-slate-400">Office / Anak Perusahaan</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {entities.filter((e) => e.type === "Anper" || e.type === "Office").length} Company
          </h3>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 border-l-purple-500">
          <p className="text-xs font-semibold text-slate-400">Office Branch (Cabang)</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {entities.filter((e) => e.type === "Cabang" || e.type === "Office Branch").length} Company
          </h3>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 border-l-4 border-l-amber-500">
          <p className="text-xs font-semibold text-slate-400">Office KCL & Sub-KCL</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {entities.filter((e) => e.type.includes("KCL")).length} Unit
          </h3>
        </div>
      </div>

      {/* Sub-Module Navigation Switcher */}
      <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
        <button
          onClick={() => setActiveTab("company-list")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "company-list"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company (Daftar Perusahaan)</span>
        </button>

        <button
          onClick={() => setActiveTab("company-type")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "company-type"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Type Company (Tipe Perusahaan)</span>
        </button>

        <button
          onClick={() => setActiveTab("tree-view")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "tree-view"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Diagram Hirarki Entitas</span>
        </button>
      </div>

      {/* TAB 1: SUB MODUL - COMPANY (DAFTAR ENTITAS SISTEM) */}
      {activeTab === "company-list" && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Daftar Company / Entitas Terdaftar ({filteredEntities.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar seluruh perusahaan yang terkonfigurasi pada sistem keuangan APG.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama/kode company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-emerald-500 w-48 sm:w-64"
                />
              </div>

              {/* Filter Type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-emerald-500 cursor-pointer"
              >
                <option value="ALL">Semua Tipe</option>
                <option value="Holding">Holding</option>
                <option value="Office">Office / Anper</option>
                <option value="Office Branch">Office Branch</option>
                <option value="Office KCL">Office KCL</option>
                <option value="Office Sub-KCL">Office Sub-KCL</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">KODE</th>
                  <th className="py-3.5 px-6">NAMA COMPANY</th>
                  <th className="py-3.5 px-6">TIPE COMPANY</th>
                  <th className="py-3.5 px-6">PARENT ENTITY</th>
                  <th className="py-3.5 px-6">AKSES LAPORAN</th>
                  <th className="py-3.5 px-6 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredEntities.length > 0 ? (
                  filteredEntities.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-emerald-700">
                        {item.code || `OFF-${item.id}`}
                      </td>
                      <td className="py-4 px-6 font-extrabold text-slate-900">
                        {item.name}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getBadgeStyle(item.type)}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {typeof item.parent === "object" ? (item.parent?.name || "-") : (item.parent || "-")}
                      </td>
                      <td className="py-4 px-6 font-bold text-indigo-600">
                        {item.reportAccess}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                          {item.status || "Aktif"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400 font-bold">
                      Tidak ada data company yang sesuai dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SUB MODUL - TYPE COMPANY (TIPE ENTITAS SISTEM) */}
      {activeTab === "company-type" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  <span>Daftar Type Company pada Sistem</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tipe dan tingkatan klasifikasi entitas yang didukung oleh arsitektur APG Finance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companyTypes.map((typeItem) => {
                const count = entities.filter((e) => e.type === typeItem.key || (typeItem.key === "Office" && e.type === "Anper") || (typeItem.key === "Office Branch" && e.type === "Cabang")).length;
                return (
                  <div 
                    key={typeItem.key}
                    className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-indigo-300 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${typeItem.badge}`}>
                        {typeItem.label || typeItem.key}
                      </span>
                      <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                        {count} Company
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Kode Key: <code className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{typeItem.key}</code>
                      </p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {typeItem.description || `Tipe entitas ${typeItem.label} untuk pengelolaan struktur organisasi.`}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>Status Sistem:</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aktif & Terdaftar
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VISUAL HIERARCHY TREE */}
      {activeTab === "tree-view" && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <h4 className="font-bold text-slate-900 text-sm mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-600" />
            <span>Diagram Hirarki Entitas PT Ardana Perkasa Group</span>
          </h4>

          {/* Tree Container */}
          <div className="flex flex-col items-center justify-center space-y-8 py-4 overflow-x-auto">
            {/* Top Level Node: HOLDING */}
            <div className="relative">
              <div className="bg-[#03392a] text-white p-4 rounded-2xl shadow-lg border-2 border-emerald-600 w-80 text-center relative">
                <span className="absolute -top-3 right-4 bg-[#00c885] text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                  OFF-0
                </span>
                <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  HOLDING
                </p>
                <p className="text-base font-extrabold text-white mt-0.5">
                  PT Ardana Perkasa Group
                </p>
              </div>
              <div className="w-0.5 h-8 bg-emerald-600 mx-auto"></div>
            </div>

            {/* Horizontal Branching Bar */}
            <div className="w-full max-w-4xl relative">
              <div className="h-0.5 bg-emerald-600 w-[82%] mx-auto"></div>

              {/* Level 2 Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 relative">
                {/* Branch 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-emerald-600 -mt-6"></div>
                  <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-4 w-full shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-emerald-700 font-mono">
                        OFF-1
                      </span>
                      <span className="bg-emerald-200 text-emerald-900 text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                        OFFICE
                      </span>
                    </div>
                    <h5 className="font-extrabold text-slate-900 text-sm mt-1">
                      PT Buana Perkasa Rajanegara
                    </h5>
                  </div>

                  <div className="w-0.5 h-6 bg-slate-300 my-1"></div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5 text-center">
                      <p className="text-[9px] font-mono font-bold text-purple-700">OFF-1.1</p>
                      <p className="text-xs font-bold text-slate-800">Cabang Jakpus</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5 text-center">
                      <p className="text-[9px] font-mono font-bold text-purple-700">OFF-1.2</p>
                      <p className="text-xs font-bold text-slate-800">Cabang Surabaya</p>
                    </div>
                  </div>
                </div>

                {/* Branch 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-emerald-600 -mt-6"></div>
                  <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-4 w-full shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-emerald-700 font-mono">
                        OFF-2
                      </span>
                      <span className="bg-emerald-200 text-emerald-900 text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                        OFFICE
                      </span>
                    </div>
                    <h5 className="font-extrabold text-slate-900 text-sm mt-1">
                      PT Dwi Kusuma Perkasa
                    </h5>
                  </div>

                  <div className="w-0.5 h-6 bg-slate-300 my-1"></div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-center w-full">
                    <p className="text-[9px] font-mono font-bold text-amber-700">OFF-2.1</p>
                    <p className="text-xs font-bold text-amber-900">KCL Hub West Java</p>
                  </div>
                </div>

                {/* Branch 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-emerald-600 -mt-6"></div>
                  <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-4 w-full shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-emerald-700 font-mono">
                        OFF-3
                      </span>
                      <span className="bg-emerald-200 text-emerald-900 text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                        OFFICE
                      </span>
                    </div>
                    <h5 className="font-extrabold text-slate-900 text-sm mt-1">
                      PT Caraka Mulia
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Tambah Company / Entitas Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Kode Company (Hirarkis)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: OFF-5"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Nama Perusahaan / Entitas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Prima Jaya Sentosa"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Tipe Company</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium bg-white"
                >
                  <option value="Office">Office (Anak Perusahaan)</option>
                  <option value="Office Branch">Office Branch (Cabang)</option>
                  <option value="Office KCL">Office KCL (Unit KCL)</option>
                  <option value="Office Sub-KCL">Office Sub-KCL (Anak KCL)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Parent Entity (Entitas Induk)</label>
                <select
                  value={formData.parent}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium bg-white"
                >
                  <option value="PT Ardana Perkasa Group (OFF-0)">PT Ardana Perkasa Group (OFF-0)</option>
                  <option value="PT Buana Perkasa Rajanegara (OFF-1)">PT Buana Perkasa Rajanegara (OFF-1)</option>
                  <option value="PT Dwi Kusuma Perkasa (OFF-2)">PT Dwi Kusuma Perkasa (OFF-2)</option>
                  <option value="PRADA Badminton Club (OFF-4)">PRADA Badminton Club (OFF-4)</option>
                </select>
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
                  Simpan Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Type Company Modal */}
      {showAddTypeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Tambah Type Company Baru
              </h3>
              <button onClick={() => setShowAddTypeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTypeSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Key / Slug Tipe (Unik)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Office Unit"
                  value={newTypeData.key}
                  onChange={(e) => setNewTypeData({ ...newTypeData, key: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-indigo-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Nama Label Tipe</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Office Unit (Unit Layanan)"
                  value={newTypeData.label}
                  onChange={(e) => setNewTypeData({ ...newTypeData, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Deskripsi Tipe Company</label>
                <textarea
                  rows="2"
                  placeholder="Deskripsi singkat tipe entitas ini..."
                  value={newTypeData.description}
                  onChange={(e) => setNewTypeData({ ...newTypeData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-indigo-500 font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTypeModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20"
                >
                  Simpan Type Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
