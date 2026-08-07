import { useState, useEffect, type FormEvent } from "react";
import {
  Building2,
  Users,
  History,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  CheckCircle2,
  X,
  MapPin,
  Mail,
  Phone,
  UserCheck
} from "lucide-react";
import type { OperationalModuleProps } from "../types";

interface Employee {
  id: string;
  nip: string;
  name: string;
  email: string;
  role: string;
  office: string | { name?: string };
  status: string;
  avatar: string;
}

interface NewEmployeeForm {
  nip: string;
  name: string;
  email: string;
  role: string;
  office: string;
}

interface ActivityLog {
  id: string;
  time: string;
  user: string;
  action: string;
  detail: string;
  ip: string;
}

export const PerusahaanModule = ({ activeSubTab = "perusahaan/profil", onSubTabChange }: OperationalModuleProps) => {
  // Current active sub-tab state ("perusahaan/profil" | "perusahaan/karyawan" | "perusahaan/log-aktivitas")
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab);

  useEffect(() => {
    if (activeSubTab) {
      setCurrentSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  const handleTabChange = (tab: string) => {
    setCurrentSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  // --- Sub-Modul 1: Profil Perusahaan State ---
  const [companyInfo, setCompanyInfo] = useState({
    name: "PT Buana Perkasa Rajanegara",
    code: "OFF-1",
    type: "Office (Anak Perusahaan)",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80",
    address: "Jl. Jend. Sudirman No. 45, Gedung Plaza Rajanegara Lt. 12, Jakarta Pusat, DKI Jakarta 10220",
    email: "corporate@bpr-finance.co.id",
    phone: "(021) 5790-1234",
    npwp: "01.234.567.8-012.000",
    nib: "9120001234567",
    director: "Chrisnia Nurbaiti",
    mainBank: "Bank Mandiri - 122-00-9876543-2 (a.n. PT Buana Perkasa Rajanegara)",
    status: "Aktif / Operasional"
  });
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [editCompanyData, setEditCompanyData] = useState({ ...companyInfo });

  // --- Sub-Modul 2: Data Karyawan State ---
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "emp-1", nip: "EMP-001", name: "Ahmad Subagja", email: "ahmad@bpr-finance.co.id", role: "Manager Anper", office: "PT Buana Perkasa Rajanegara (OFF-1)", status: "Aktif", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    { id: "emp-2", nip: "EMP-002", name: "Siti Rahmawati", email: "siti@bpr-finance.co.id", role: "Staff Anper", office: "PT Buana Perkasa Rajanegara (OFF-1)", status: "Aktif", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
    { id: "emp-3", nip: "EMP-003", name: "Budi Gunawan", email: "budi@bpr-finance.co.id", role: "Admin Cabang", office: "Cabang Jakarta Pusat (OFF-1.1)", status: "Aktif", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
    { id: "emp-4", nip: "EMP-004", name: "Dewi Lestari", email: "dewi@bpr-finance.co.id", role: "Staff Anper", office: "Cabang Surabaya (OFF-1.2)", status: "Aktif", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80" },
    { id: "emp-5", nip: "EMP-005", name: "Rizky Pratama", email: "rizky@bpr-finance.co.id", role: "Supervisor Keuangan", office: "PT Buana Perkasa Rajanegara (OFF-1)", status: "Aktif", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" }
  ]);
  const [empSearchQuery, setEmpSearchQuery] = useState("");

  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [, setShowEditEmpModal] = useState(false);
  const [showViewEmpModal, setShowViewEmpModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  const [newEmpData, setNewEmpData] = useState<NewEmployeeForm>({
    nip: `EMP-00${employees.length + 1}`,
    name: "",
    email: "",
    role: "Staff Anper",
    office: "PT Buana Perkasa Rajanegara (OFF-1)"
  });

  // --- Sub-Modul 3: Log Aktivitas Perusahaan State ---
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: "log-1", time: "2026-07-29 14:32:10", user: "Ahmad Subagja", action: "Pembaruan Alamat Perusahaan", detail: "Mengubah nomor gedung dan kode pos", ip: "192.168.1.102" },
    { id: "log-2", time: "2026-07-29 11:15:04", user: "Siti Rahmawati", action: "Penambahan Karyawan Baru", detail: "Menambahkan karyawan NIP EMP-005 (Rizky Pratama)", ip: "192.168.1.105" },
    { id: "log-3", time: "2026-07-28 16:45:22", user: "Budi Gunawan", action: "Perubahan Peran Karyawan", detail: "Mengubah role EMP-003 menjadi Admin Cabang", ip: "192.168.1.110" },
    { id: "log-4", time: "2026-07-27 09:20:11", user: "Ahmad Subagja", action: "Update NIB & Rekening", detail: "Memperbarui NIB dan nomor rekening operasional", ip: "192.168.1.102" }
  ]);

  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Handlers Company
  const handleSaveCompany = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCompanyInfo({ ...editCompanyData });
    setShowEditCompanyModal(false);
    showToast("Profil Perusahaan Berhasil Diperbarui!");
    // Log activity
    setActivityLogs([
      { id: `log-${Date.now()}`, time: new Date().toLocaleString(), user: "User Login", action: "Update Profil Perusahaan", detail: "Memperbarui data dan alamat perusahaan", ip: "127.0.0.1" },
      ...activityLogs
    ]);
  };

  // Handlers Employees
  const handleAddEmployee = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newEmpData.name || !newEmpData.email) return;
    const created = {
      id: `emp-${Date.now()}`,
      ...newEmpData,
      status: "Aktif",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
    };
    setEmployees([...employees, created]);
    setShowAddEmpModal(false);
    showToast(`Karyawan ${created.name} Berhasil Ditambahkan!`);
    setNewEmpData({
      nip: `EMP-00${employees.length + 2}`,
      name: "",
      email: "",
      role: "Staff Anper",
      office: "PT Buana Perkasa Rajanegara (OFF-1)"
    });
  };

  const handleDeleteEmployee = (empId: string, empName: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus karyawan ${empName}?`)) {
      setEmployees(employees.filter((e) => e.id !== empId));
      showToast(`Karyawan ${empName} Berhasil Dihapus.`);
    }
  };

  const filteredEmployees = employees.filter((e) => 
    e.name.toLowerCase().includes(empSearchQuery.toLowerCase()) ||
    e.nip.toLowerCase().includes(empSearchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(empSearchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-xs">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Header Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Modul Perusahaan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan detail profil perusahaan, manajemen data karyawan, dan audit log aktivitas internal.
          </p>
        </div>

        {/* Sub-tab Navigation Switcher */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1">
          <button
            onClick={() => handleTabChange("perusahaan/profil")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              currentSubTab === "perusahaan/profil"
                ? "bg-[#00c885] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Profil Perusahaan</span>
          </button>

          <button
            onClick={() => handleTabChange("perusahaan/karyawan")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              currentSubTab === "perusahaan/karyawan"
                ? "bg-[#00c885] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Karyawan</span>
          </button>

          <button
            onClick={() => handleTabChange("perusahaan/log-aktivitas")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              currentSubTab === "perusahaan/log-aktivitas"
                ? "bg-[#00c885] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Log Aktivitas</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-MODUL 1: PROFIL PERUSAHAAN */}
      {/* ========================================================================= */}
      {currentSubTab === "perusahaan/profil" && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
              <img 
                src={companyInfo.logo} 
                alt={companyInfo.name} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/20 shadow-sm shrink-0" 
              />
              <div>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  {companyInfo.code} • {companyInfo.type}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {companyInfo.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{companyInfo.address}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditCompanyData({ ...companyInfo });
                setShowEditCompanyModal(true);
              }}
              className="flex items-center justify-center gap-2 bg-[#00c885] hover:bg-[#00b377] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Detail Perusahaan</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-semibold">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Email Resmi</span>
              <p className="text-slate-900 font-extrabold text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" /> {companyInfo.email}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Telepon Operasional</span>
              <p className="text-slate-900 font-extrabold text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" /> {companyInfo.phone}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Direktur Utama</span>
              <p className="text-slate-900 font-extrabold text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" /> {companyInfo.director}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">NPWP Perusahaan</span>
              <p className="text-slate-900 font-mono font-extrabold text-sm">
                {companyInfo.npwp}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">NIB (Nomor Induk Berusaha)</span>
              <p className="text-slate-900 font-mono font-extrabold text-sm">
                {companyInfo.nib}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Status Layanan</span>
              <p className="text-emerald-700 font-extrabold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {companyInfo.status}
              </p>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-emerald-50 to-indigo-50 border border-emerald-200 rounded-2xl space-y-1">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Rekening Bank Utama Operasional</span>
            <p className="text-slate-900 font-mono font-extrabold text-sm">
              {companyInfo.mainBank}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODUL 2: DATA KARYAWAN */}
      {/* ========================================================================= */}
      {currentSubTab === "perusahaan/karyawan" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Daftar Karyawan Terdaftar ({filteredEmployees.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Manajemen data karyawan internal, penugasan role/jabatan, dan penempatan office.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari NIP / nama karyawan..."
                  value={empSearchQuery}
                  onChange={(e) => setEmpSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-emerald-500 w-48 sm:w-64"
                />
              </div>

              <button
                onClick={() => setShowAddEmpModal(true)}
                className="flex items-center justify-center gap-2 bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Karyawan</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">NIP</th>
                  <th className="py-3.5 px-6">KARYAWAN</th>
                  <th className="py-3.5 px-6">EMAIL</th>
                  <th className="py-3.5 px-6">ROLE / PERAN</th>
                  <th className="py-3.5 px-6">PENEMPATAN OFFICE</th>
                  <th className="py-3.5 px-6 text-center">STATUS</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">
                      {emp.nip}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-slate-900 flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <span>{emp.name}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {emp.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] px-2.5 py-0.5 rounded-full font-extrabold">
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {typeof emp.office === "object" ? (emp.office?.name || "-") : (emp.office || "-")}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => { setSelectedEmp(emp); setShowViewEmpModal(true); }}
                          title="Lihat Detail"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedEmp({ ...emp }); setShowEditEmpModal(true); }}
                          title="Edit Data"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                          title="Hapus Karyawan"
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODUL 3: LOG AKTIVITAS PERUSAHAAN */}
      {/* ========================================================================= */}
      {currentSubTab === "perusahaan/log-aktivitas" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" />
              <span>Log Aktivitas Internal Perusahaan</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Riwayat jejak audit aktivitas yang terjadi pada modul perusahaan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">WAKTU</th>
                  <th className="py-3.5 px-6">USER OPERATOR</th>
                  <th className="py-3.5 px-6">AKTIVITAS</th>
                  <th className="py-3.5 px-6">DETAIL CATATAN</th>
                  <th className="py-3.5 px-6 font-mono">IP ADDRESS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-500">
                      {log.time}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      {log.user}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-extrabold text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {log.detail}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: EDIT COMPANY DETAIL */}
      {showEditCompanyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Edit Detail Perusahaan</h3>
              <button onClick={() => setShowEditCompanyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Nama Perusahaan</label>
                <input
                  type="text"
                  required
                  value={editCompanyData.name}
                  onChange={(e) => setEditCompanyData({ ...editCompanyData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Alamat Lengkap Perusahaan</label>
                <textarea
                  rows={2}
                  value={editCompanyData.address}
                  onChange={(e) => setEditCompanyData({ ...editCompanyData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Email Resmi</label>
                  <input
                    type="email"
                    value={editCompanyData.email}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Telepon</label>
                  <input
                    type="text"
                    value={editCompanyData.phone}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Direktur Utama</label>
                <input
                  type="text"
                  value={editCompanyData.director}
                  onChange={(e) => setEditCompanyData({ ...editCompanyData, director: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditCompanyModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00c885] hover:bg-[#00b377] text-white rounded-xl font-bold shadow-md shadow-emerald-500/20"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH KARYAWAN */}
      {showAddEmpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Tambah Karyawan Baru</h3>
              <button onClick={() => setShowAddEmpModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                <input
                  type="text"
                  required
                  value={newEmpData.nip}
                  onChange={(e) => setNewEmpData({ ...newEmpData, nip: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Nama Lengkap Karyawan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hendra Wijaya"
                  value={newEmpData.name}
                  onChange={(e) => setNewEmpData({ ...newEmpData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Email Perusahaan</label>
                <input
                  type="email"
                  required
                  placeholder="hendra@bpr-finance.co.id"
                  value={newEmpData.email}
                  onChange={(e) => setNewEmpData({ ...newEmpData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Role / Peran Akses</label>
                <select
                  value={newEmpData.role}
                  onChange={(e) => setNewEmpData({ ...newEmpData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Staff Anper">Staff Anper</option>
                  <option value="Manager Anper">Manager Anper</option>
                  <option value="Admin Cabang">Admin Cabang</option>
                  <option value="Supervisor Keuangan">Supervisor Keuangan</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00c885] hover:bg-[#00b377] text-white rounded-xl font-bold shadow-md shadow-emerald-500/20"
                >
                  Simpan Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW KARYAWAN DETAIL */}
      {showViewEmpModal && selectedEmp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Detail Karyawan</h3>
              <button onClick={() => setShowViewEmpModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <img src={selectedEmp.avatar} alt={selectedEmp.name} className="w-20 h-20 rounded-full mx-auto border-4 border-emerald-100 object-cover shadow-sm" />
              <h4 className="font-extrabold text-slate-900 text-base">{selectedEmp.name}</h4>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {selectedEmp.nip}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 font-medium">
              <p><strong className="text-slate-700">Email:</strong> {selectedEmp.email}</p>
              <p><strong className="text-slate-700">Role:</strong> {selectedEmp.role}</p>
              <p><strong className="text-slate-700">Office:</strong> {typeof selectedEmp?.office === "object" ? (selectedEmp.office?.name || "-") : (selectedEmp?.office || "-")}</p>
              <p><strong className="text-slate-700">Status:</strong> <span className="text-emerald-600 font-bold">{selectedEmp.status}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
