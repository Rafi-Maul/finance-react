import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ArrowLeft, 
  Shield, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  KeyRound, 
  UserCheck, 
  Lock, 
  Sparkles,
  RefreshCw,
  Plus
} from "lucide-react";
import { api as mockApi } from "../services/api";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  
  // Selected user for Detail Page View
  const [detailUser, setDetailUser] = useState(null);
  
  // State for toggling password visibility in detail page & list view
  const [showPasswords, setShowPasswords] = useState({});
  const [detailShowPassword, setDetailShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleCopyText = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const getCompanyStr = (u) => {
    if (!u) return "";
    if (typeof u.company === "object" && u.company) return u.company.name || u.company.code || "";
    if (typeof u.office === "object" && u.office) return u.office.name || u.office.code || "";
    return typeof u.company === "string" ? u.company : (typeof u.office === "string" ? u.office : "");
  };

  // Filter users based on search query, role, and company
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = selectedRole === "ALL" || u.roleCode === selectedRole;
    const matchesCompany = selectedCompany === "ALL" || getCompanyStr(u) === selectedCompany;

    return matchesSearch && matchesRole && matchesCompany;
  });

  // Unique companies list for filtering
  const companyOptions = Array.from(new Set(users.map((u) => getCompanyStr(u)).filter(Boolean)));

  const getRoleBadgeStyle = (roleCode) => {
    switch (roleCode) {
      case "SUPER_ADMIN":
        return "bg-amber-100 text-amber-900 border-amber-300 font-bold";
      case "ADMIN_CABANG":
        return "bg-cyan-100 text-cyan-900 border-cyan-300 font-bold";
      case "KADIV_KEUANGAN":
        return "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold";
      case "MANAGER_ANPER":
        return "bg-purple-100 text-purple-900 border-purple-300 font-bold";
      case "STAFF_ANPER":
        return "bg-sky-100 text-sky-900 border-sky-300 font-bold";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300 font-bold";
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: USER DETAIL PAGE
  // -------------------------------------------------------------
  if (detailUser) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Back Button & Navigation Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setDetailUser(null);
              setDetailShowPassword(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>Kembali ke Daftar User</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              ● Status: {detailUser.status || "Aktif"}
            </span>
          </div>
        </div>

        {/* User Hero / Main Profile Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <img
                src={detailUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                alt={detailUser.name}
                className="w-20 h-20 rounded-2xl border-2 border-emerald-400 bg-slate-800 shadow-md object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-white">{detailUser.name}</h1>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${getRoleBadgeStyle(detailUser.roleCode)}`}>
                    {detailUser.roleName}
                  </span>
                </div>
                <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {getCompanyStr(detailUser) || "-"}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-3">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {detailUser.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {detailUser.phone || "+62 812-3456-7890"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Login Terakhir: {detailUser.lastLogin || "29 Jul 2026"}
              </span>
            </div>
          </div>
        </div>

        {/* Credentials & Security Card (KREDENSIAL LOGIN USER) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Kredensial & Detail Login Akun</h3>
                <p className="text-xs text-slate-500">Informasi autentikasi resmi untuk masuk ke portal APG Finance</p>
              </div>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">
              ID: {detailUser.id}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username Field */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Username Akses Sistem
              </label>
              <div className="flex items-center justify-between bg-white border border-slate-300 rounded-xl p-3 shadow-2xs">
                <span className="font-mono text-sm font-bold text-slate-900 tracking-wide">
                  {detailUser.username}
                </span>
                <button
                  onClick={() => handleCopyText(detailUser.username, "username")}
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer px-2 py-1 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  {copiedField === "username" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">Digunakan untuk login di portal login APG Finance.</p>
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="bg-emerald-50/50 border border-emerald-200 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider block flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Kata Sandi (Password)
                </label>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                  Dapat Dilihat oleh Admin
                </span>
              </div>
              <div className="flex items-center justify-between bg-white border border-emerald-300 rounded-xl p-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                    {detailShowPassword ? (detailUser.password || "password123") : "••••••••••••"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailShowPassword(!detailShowPassword)}
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    title={detailShowPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {detailShowPassword ? (
                      <EyeOff className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  <button
                    onClick={() => handleCopyText(detailUser.password || "password123", "password")}
                    className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer px-2.5 py-1 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    {copiedField === "password" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Password</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-emerald-800">
                Klik ikon mata untuk mengintip password atau tombol salin untuk menyalin ke clipboard.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role & Access Info */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">Hak Akses & Otorisasi Role</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Kode Role</span>
                <span className="font-bold text-slate-800 font-mono">{detailUser.roleCode}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Nama Role</span>
                <span className="font-bold text-slate-800">{detailUser.roleName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Lingkup (Scope)</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {getCompanyStr(detailUser) || "-"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Tanggal Terdaftar</span>
                <span className="font-medium text-slate-800">{detailUser.joinDate || "15 Jan 2024"}</span>
              </div>
            </div>
          </div>

          {/* Account Status & Information */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">Status & Kontak Pengguna</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Email Utama</span>
                <span className="font-bold text-slate-800">{detailUser.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Nomor Telepon</span>
                <span className="font-medium text-slate-800">{detailUser.phone || "+62 812-3456-7890"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Status Akun</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  ● Aktif (Dapat Login)
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Keamanan Tambahan</span>
                <span className="font-medium text-slate-600">Standard Encryption (AES-256)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: USER LIST PAGE
  // -------------------------------------------------------------
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Administrasi User / Master User</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Daftar User & Akses Kredensial Sistem
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola seluruh akun pengguna terdaftar, periksa username, password, dan wewenang role.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-all cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-slate-400">Total User Terdaftar</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{users.length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">✓ Akun Terverifikasi</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-slate-400">User Aktif</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {users.filter(u => u.status === "Aktif" || !u.status).length}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">100% Akses Aktif</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-slate-400">Jumlah Role</p>
          <p className="text-2xl font-black text-slate-900 mt-1">5 Role</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Super Admin, Kadiv, dll</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-slate-400">Entitas Perusahaan</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{companyOptions.length}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Holding, Anper & Cabang</p>
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
            placeholder="Cari nama, username, email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-slate-800 focus:outline-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-emerald-500 cursor-pointer"
          >
            <option value="ALL">Semua Role</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN_CABANG">Admin Cabang</option>
            <option value="KADIV_KEUANGAN">Kadiv Keuangan</option>
            <option value="MANAGER_ANPER">Direksi Anper</option>
            <option value="STAFF_ANPER">Staff Anper</option>
          </select>

          {/* Company Filter */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-emerald-500 cursor-pointer"
          >
            <option value="ALL">Semua Entitas</option>
            {companyOptions.map((comp) => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table / List */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Pengguna & Username</th>
                <th className="py-4 px-6">Role / Jabatan</th>
                <th className="py-4 px-6">Entitas / Company</th>
                <th className="py-4 px-6">Prinjauan Password</th>
                <th className="py-4 px-6 text-center">Aksi / Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Memuat daftar pengguna...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Tidak ada pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isPassVisible = showPasswords[u.id];
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                            alt={u.name}
                            className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{u.name}</p>
                            <p className="text-[11px] font-mono text-emerald-600 font-semibold mt-0.5">
                              @{u.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-block text-[10px] px-2.5 py-1 rounded-lg border ${getRoleBadgeStyle(u.roleCode)}`}>
                          {u.roleName}
                        </span>
                      </td>

                      {/* Company */}
                      <td className="py-4 px-6 text-slate-700 font-semibold">
                        {getCompanyStr(u) || "-"}
                      </td>

                      {/* Password Quick View */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg text-[11px] border border-slate-200">
                            {isPassVisible ? (u.password || "password123") : "••••••••"}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(u.id)}
                            className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer p-1"
                            title={isPassVisible ? "Sembunyikan Password" : "Intip Password"}
                          >
                            {isPassVisible ? (
                              <EyeOff className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Action Button: Detail User */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => {
                            setDetailUser(u);
                            setDetailShowPassword(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail User</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
