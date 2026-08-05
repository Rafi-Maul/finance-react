import React, { useState, useEffect } from "react";
import { Plus, ShieldCheck, Info, Edit, CheckCircle2, X, Layers, Settings2, Lock } from "lucide-react";
import { api as mockApi } from "../services/api";
import { ThreeTierAccessManager } from "../modules/superadmin/roles/components/ThreeTierAccessManager";
import { RolePermissionEditor } from "../modules/superadmin/roles/components/RolePermissionEditor";

export const RoleAndPermissions = () => {
  const [activeTab, setActiveTab] = useState("editor");
  const [roles, setRoles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoleCode, setEditingRoleCode] = useState("SUPER_ADMIN");
  const [editingRole, setEditingRole] = useState(null);

  const [formData, setFormData] = useState({
    role: "",
    code: "",
    scope: "Holding & Seluruh Anper",
    permissions: "",
    restrictions: ""
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    const data = await mockApi.getRoles();
    setRoles(data);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) return;
    await mockApi.addRole(formData);
    setShowAddModal(false);
    setFormData({
      role: "",
      code: "",
      scope: "Holding & Seluruh Anper",
      permissions: "",
      restrictions: ""
    });
    loadRoles();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Matriks Role, Permission & Lingkup Company
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan wewenang peran, pembatasan 4-level (Office → Modul → SubModul → Role), dan isolasi data grup.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-[#00c885] hover:bg-[#00b377] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Role Baru</span>
        </button>
      </div>

      {/* Main Tab Bar Switcher */}
      <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-100 flex flex-col sm:flex-row items-center gap-2">
        <button
          onClick={() => setActiveTab("editor")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "editor"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Edit Peran & Permission (User Level)</span>
        </button>

        <button
          onClick={() => setActiveTab("3tier")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "3tier"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>Matriks Pembatasan 4-Level</span>
        </button>

        <button
          onClick={() => setActiveTab("matrix")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "matrix"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Ringkasan Role & Otorisasi</span>
        </button>
      </div>

      {/* Tab 1: Edit Peran & Permission (Gambar 2 Layout!) */}
      {activeTab === "editor" && (
        <RolePermissionEditor 
          selectedRoleCode={editingRoleCode} 
          onBack={() => setActiveTab("matrix")}
        />
      )}

      {/* Tab 2: 3-Level Access Manager */}
      {activeTab === "3tier" && <ThreeTierAccessManager />}

      {/* Tab 3: Matrix Table */}
      {activeTab === "matrix" && (
        <div className="space-y-6">
          {/* Principle Banner Header */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#00c885] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-emerald-900">
                Prinsip 3 Komponen Otorisasi Sistem APG:
              </p>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                1. Role Pengguna • 2. Permission (Aksi) • 3. Lingkup Company (Akses Data Terisolasi)
              </p>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">ROLE</th>
                    <th className="py-3.5 px-6">LINGKUP COMPANY</th>
                    <th className="py-3.5 px-6">HAK AKSES UTAMA (PERMISSIONS)</th>
                    <th className="py-3.5 px-6">BATASAN & KETENTUAN</th>
                    <th className="py-3.5 px-6 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {roles.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-extrabold text-slate-900">
                        {item.role}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          item.scope.includes("Seluruh Sistem") 
                            ? "bg-amber-100 text-amber-800"
                            : item.scope.includes("Holding")
                            ? "bg-[#00c885]/15 text-[#00c885]"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {item.scope}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-800 font-semibold max-w-xs">
                        {item.permissions}
                      </td>
                      <td className="py-4 px-6 font-semibold max-w-xs">
                        <span className={
                          item.restrictions.toLowerCase().includes("tidak") || item.restrictions.toLowerCase().includes("isolasi")
                            ? "text-red-500 font-bold"
                            : "text-amber-600"
                        }>
                          {item.restrictions}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => {
                            setEditingRoleCode(item.code);
                            setActiveTab("editor");
                          }}
                          className="text-[#00c885] font-bold hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Buat Role Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Role *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Manager Operasional"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value, code: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Kode Role</label>
                <input
                  type="text"
                  readOnly
                  value={formData.code}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-100 bg-slate-50 font-mono text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Lingkup Access Data Company</label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium cursor-pointer"
                >
                  <option value="Holding & Seluruh Anper">Holding & Seluruh Anper</option>
                  <option value="Anper tempat terdaftar">Anper tempat terdaftar</option>
                  <option value="Cabang tertentu">Cabang tertentu</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Hak Akses Utama *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Menyetujui PO & faktur penjualan..."
                  value={formData.permissions}
                  onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Batasan & Ketentuan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tidak dapat mengubah data transaksi..."
                  value={formData.restrictions}
                  onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                />
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
                  Simpan Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Edit Role: {editingRole.role}
              </h3>
              <button onClick={() => setEditingRole(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                <strong className="text-slate-900">Lingkup Company:</strong> {editingRole.scope}
              </p>
              <p className="text-slate-600">
                <strong className="text-slate-900">Permissions:</strong> {editingRole.permissions}
              </p>
              <p className="text-slate-600">
                <strong className="text-slate-900">Restrictions:</strong> {editingRole.restrictions}
              </p>
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-semibold">
                Perubahan hak akses akan berlaku secara langsung setelah disimpan.
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end">
              <button
                onClick={() => setEditingRole(null)}
                className="px-5 py-2 bg-[#00c885] text-white rounded-xl font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
