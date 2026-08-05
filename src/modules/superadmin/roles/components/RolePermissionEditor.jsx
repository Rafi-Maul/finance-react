import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Info, 
  Save, 
  CheckSquare,
  Square,
  User,
  Briefcase,
  Check
} from "lucide-react";
import { api as mockApi } from "../../../../services/api";
import { SYSTEM_MODULES, OFFICE_TYPES } from "../../../../services/mockData";

export const RolePermissionEditor = ({ selectedRoleCode = "SUPER_ADMIN", onBack }) => {
  const [offices, setOffices] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Selections
  const [selectedOfficeId, setSelectedOfficeId] = useState("ent-1");
  const [selectionMode, setSelectionMode] = useState("USER"); // "USER" | "ROLE"
  const [selectedUserId, setSelectedUserId] = useState("u-1");
  const [currentRoleCode, setCurrentRoleCode] = useState(selectedRoleCode);

  // Computed & Permissions state
  const [roleName, setRoleName] = useState("Super Admin");
  const [officeModules, setOfficeModules] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (offices.length > 0 && selectedOfficeId) {
      const officeUsers = allUsers.filter((u) => u.officeId === selectedOfficeId);
      setFilteredUsers(officeUsers);

      if (selectionMode === "USER") {
        if (officeUsers.length > 0) {
          const targetUser = officeUsers[0];
          setSelectedUserId(targetUser.id);
          setCurrentRoleCode(targetUser.roleCode);
          loadOfficeAndRolePermissions(selectedOfficeId, targetUser.roleCode);
        } else {
          setSelectedUserId("");
          loadOfficeAndRolePermissions(selectedOfficeId, currentRoleCode);
        }
      } else {
        loadOfficeAndRolePermissions(selectedOfficeId, currentRoleCode);
      }
    }
  }, [selectedOfficeId]);

  const handleUserChange = (userId) => {
    setSelectedUserId(userId);
    const u = allUsers.find((x) => x.id === userId);
    if (u) {
      setCurrentRoleCode(u.roleCode);
      loadOfficeAndRolePermissions(selectedOfficeId, u.roleCode);
    }
  };

  const handleRoleChange = (roleCode) => {
    setCurrentRoleCode(roleCode);
    loadOfficeAndRolePermissions(selectedOfficeId, roleCode);
  };

  const handleModeChange = (mode) => {
    setSelectionMode(mode);
    if (mode === "USER") {
      const officeUsers = allUsers.filter((u) => u.officeId === selectedOfficeId);
      if (officeUsers.length > 0) {
        const u = officeUsers[0];
        setSelectedUserId(u.id);
        setCurrentRoleCode(u.roleCode);
        loadOfficeAndRolePermissions(selectedOfficeId, u.roleCode);
      }
    } else {
      loadOfficeAndRolePermissions(selectedOfficeId, currentRoleCode);
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const officeData = await mockApi.getOffices();
      const roleData = await mockApi.getRoles();
      const userData = await mockApi.getUsers();

      setOffices(officeData);
      setRoles(roleData);
      setAllUsers(userData);

      const initialOfficeUsers = userData.filter((u) => u.officeId === selectedOfficeId);
      setFilteredUsers(initialOfficeUsers);

      if (initialOfficeUsers.length > 0) {
        const firstUser = initialOfficeUsers[0];
        setSelectedUserId(firstUser.id);
        setCurrentRoleCode(firstUser.roleCode);
        const r = roleData.find((item) => item.code === firstUser.roleCode);
        if (r) setRoleName(r.role);
      }

      const initialExpand = {};
      SYSTEM_MODULES.forEach((mod) => {
        initialExpand[mod.id] = true;
      });
      setExpandedModules(initialExpand);

      const targetRoleCode = initialOfficeUsers[0]?.roleCode || currentRoleCode;
      await loadOfficeAndRolePermissions(selectedOfficeId, targetRoleCode);
    } catch (err) {
      console.error("Failed to load initial data", err);
    } finally {
      setLoading(false);
    }
  };

  const normalizePermissions = (rawPerms) => {
    const normalized = new Set();
    SYSTEM_MODULES.forEach((mod) => {
      mod.subModules.forEach((sub) => {
        const perms = sub.permissions || ["Lihat", "Tambah", "Edit", "Hapus"];
        if (rawPerms.includes(sub.id)) {
          perms.forEach((p) => normalized.add(`${sub.id}:${p}`));
        } else {
          perms.forEach((p) => {
            if (rawPerms.includes(`${sub.id}:${p}`)) {
              normalized.add(`${sub.id}:${p}`);
            }
          });
        }
      });
    });
    return Array.from(normalized);
  };

  const loadOfficeAndRolePermissions = async (officeId, roleCode) => {
    try {
      const activeMods = await mockApi.getOfficeModules(officeId);
      const rolePerms = await mockApi.getRoleSubModules(roleCode);
      setOfficeModules(activeMods);
      setSelectedPermissions(normalizePermissions(rolePerms));

      const r = roles.find((item) => item.code === roleCode);
      if (r) setRoleName(r.role);
    } catch (err) {
      console.error("Failed to load permissions", err);
    }
  };

  const toggleExpand = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const isActionSelected = (subId, perm) => {
    return selectedPermissions.includes(`${subId}:${perm}`);
  };

  const toggleSingleAction = (subId, perm, parentModuleId) => {
    if (!officeModules.includes(parentModuleId)) return;
    const actionKey = `${subId}:${perm}`;

    setSelectedPermissions((prev) => {
      if (prev.includes(actionKey)) {
        return prev.filter((k) => k !== actionKey);
      } else {
        return [...prev, actionKey];
      }
    });
  };

  const toggleSubModuleAllActions = (subObj, parentModuleId) => {
    if (!officeModules.includes(parentModuleId)) return;
    const perms = subObj.permissions || ["Lihat", "Tambah", "Edit", "Hapus"];
    const actionKeys = perms.map((p) => `${subObj.id}:${p}`);
    const allSelected = actionKeys.every((k) => selectedPermissions.includes(k));

    setSelectedPermissions((prev) => {
      if (allSelected) {
        return prev.filter((k) => !actionKeys.includes(k));
      } else {
        return Array.from(new Set([...prev, ...actionKeys]));
      }
    });
  };

  const toggleModuleAllActions = (moduleObj) => {
    if (!officeModules.includes(moduleObj.id)) return;

    const allModuleActionKeys = [];
    moduleObj.subModules.forEach((sub) => {
      const perms = sub.permissions || ["Lihat", "Tambah", "Edit", "Hapus"];
      perms.forEach((p) => allModuleActionKeys.push(`${sub.id}:${p}`));
    });

    const isAllModuleSelected = allModuleActionKeys.every((k) => selectedPermissions.includes(k));

    setSelectedPermissions((prev) => {
      if (isAllModuleSelected) {
        return prev.filter((k) => !allModuleActionKeys.includes(k));
      } else {
        return Array.from(new Set([...prev, ...allModuleActionKeys]));
      }
    });
  };

  const handleSelectAll = () => {
    const allKeys = [];
    SYSTEM_MODULES.forEach((mod) => {
      if (officeModules.includes(mod.id)) {
        mod.subModules.forEach((sub) => {
          const perms = sub.permissions || ["Lihat", "Tambah", "Edit", "Hapus"];
          perms.forEach((p) => allKeys.push(`${sub.id}:${p}`));
        });
      }
    });
    setSelectedPermissions(allKeys);
  };

  const handleUnselectAll = () => {
    setSelectedPermissions([]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sanitizedPermissions = [];
      SYSTEM_MODULES.forEach((mod) => {
        if (officeModules.includes(mod.id)) {
          mod.subModules.forEach((sub) => {
            const perms = sub.permissions || ["Lihat", "Tambah", "Edit", "Hapus"];
            perms.forEach((p) => {
              const k = `${sub.id}:${p}`;
              if (selectedPermissions.includes(k)) {
                sanitizedPermissions.push(k);
              }
            });
          });
        }
      });

      await mockApi.updateRoleSubModules(currentRoleCode, sanitizedPermissions);
      
      const selectedUserObj = allUsers.find((u) => u.id === selectedUserId);
      const targetText = selectionMode === "USER" && selectedUserObj 
        ? `Individu "${selectedUserObj.name}" (Peran: ${roleName})`
        : `Peran "${roleName}"`;

      setToastMsg(`Hak Akses untuk ${targetText} Berhasil Disimpan di ${currentOfficeObj?.name}!`);
      setTimeout(() => setToastMsg(""), 3500);
    } catch (err) {
      console.error("Failed to save role permissions", err);
    } finally {
      setSaving(false);
    }
  };

  let totalAvailableActions = 0;
  let totalSelectedActions = 0;

  SYSTEM_MODULES.forEach((mod) => {
    if (officeModules.includes(mod.id)) {
      mod.subModules.forEach((sub) => {
        const perms = sub.permissions || ["Lihat", "Tambah", "Edit", "Hapus"];
        totalAvailableActions += perms.length;
        perms.forEach((p) => {
          if (isActionSelected(sub.id, p)) {
            totalSelectedActions++;
          }
        });
      });
    }
  });

  const progressPercent = totalAvailableActions > 0 
    ? Math.round((totalSelectedActions / totalAvailableActions) * 100) 
    : 0;

  const currentOfficeObj = offices.find((o) => o.id === selectedOfficeId) || offices[0];
  const currentUserObj = allUsers.find((u) => u.id === selectedUserId);
  const currentRoleObj = roles.find((r) => r.code === currentRoleCode);

  const getTypeBadgeStyle = (typeStr) => {
    const found = OFFICE_TYPES.find((t) => t.key === typeStr);
    return found ? found.badge : "bg-slate-100 text-slate-800 border-slate-300";
  };

  const getActiveBadgeClass = (permName) => {
    const name = permName.toLowerCase();
    if (name.includes("lihat")) return "bg-sky-500 text-white border-sky-600 shadow-2xs font-extrabold";
    if (name.includes("tambah")) return "bg-emerald-600 text-white border-emerald-700 shadow-2xs font-extrabold";
    if (name.includes("edit")) return "bg-amber-500 text-white border-amber-600 shadow-2xs font-extrabold";
    if (name.includes("hapus")) return "bg-red-600 text-white border-red-700 shadow-2xs font-extrabold";
    if (name.includes("import")) return "bg-cyan-600 text-white border-cyan-700 shadow-2xs font-extrabold";
    if (name.includes("export")) return "bg-purple-600 text-white border-purple-700 shadow-2xs font-extrabold";
    return "bg-indigo-600 text-white border-indigo-700 shadow-2xs font-extrabold";
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-bold flex items-center justify-center gap-2">
        <Building2 className="w-5 h-5 animate-pulse text-emerald-600" />
        <span>Memuat data Office, Peran & Hak Akses...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 font-bold text-xs">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 font-semibold tracking-wide">
            Peran &gt; <span className="text-slate-800 font-bold">Edit Peran & Permission</span>
          </p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Edit Peran & Permission (User Level)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur wewenang aksi secara granular per sub-modul berdasarkan <strong className="text-slate-800">Office</strong>, <strong className="text-slate-800">Role</strong>, atau <strong className="text-slate-800">Individu</strong>.
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-2xs">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <div className="text-xs font-bold text-slate-800">
            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-extrabold mr-1.5 border border-emerald-200">
              {currentOfficeObj?.code}
            </span>
            {currentOfficeObj?.name}
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Card: Office, Target Selection & Profile */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5 sticky top-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Informasi Office & Akses</h3>
          </div>

          {/* STEP 1: Office Context Selector (Paling Atas) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              1. Pilih Office / Entitas <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedOfficeId}
              onChange={(e) => setSelectedOfficeId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-extrabold text-slate-900 focus:outline-indigo-500 cursor-pointer shadow-2xs"
            >
              {offices.map((o) => (
                <option key={o.id} value={o.id}>
                  [{o.code}] {o.name} ({o.type})
                </option>
              ))}
            </select>

            {/* Office Meta Detail Card */}
            {currentOfficeObj && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500">KODE: {currentOfficeObj.code}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeBadgeStyle(currentOfficeObj.type)}`}>
                    {currentOfficeObj.type}
                  </span>
                </div>
                <p className="text-[11px] font-extrabold text-slate-800 leading-snug">
                  {currentOfficeObj.name}
                </p>
                {currentOfficeObj.parent && (
                  <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <span>Induk:</span> <strong className="text-slate-600">{typeof currentOfficeObj.parent === "object" ? (currentOfficeObj.parent?.name || "-") : currentOfficeObj.parent}</strong>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: Mode Target Hak Akses (Individu vs Peran) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              2. Target Penetapan Hak Akses
            </label>
            
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleModeChange("USER")}
                className={`py-2 px-2.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectionMode === "USER"
                    ? "bg-white text-indigo-700 shadow-2xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Individu ({filteredUsers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("ROLE")}
                className={`py-2 px-2.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectionMode === "ROLE"
                    ? "bg-white text-indigo-700 shadow-2xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Peran / Role</span>
              </button>
            </div>
          </div>

          {/* STEP 3: Selector Berdasarkan Mode */}
          {selectionMode === "USER" ? (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Pilih Individu <span className="text-slate-400 font-normal">(Filtered by {currentOfficeObj?.code})</span>
              </label>

              {filteredUsers.length > 0 ? (
                <>
                  <select
                    value={selectedUserId}
                    onChange={(e) => handleUserChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-indigo-500 cursor-pointer"
                  >
                    {filteredUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.roleName} (@{u.username})
                      </option>
                    ))}
                  </select>

                  {/* Individual Profile Card */}
                  {currentUserObj && (
                    <div className="p-3.5 bg-gradient-to-br from-indigo-50/70 to-emerald-50/50 border border-indigo-200/80 rounded-2xl space-y-2 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <img 
                          src={currentUserObj.avatar} 
                          alt={currentUserObj.name} 
                          className="w-10 h-10 rounded-full border-2 border-indigo-200 bg-white shadow-2xs shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-black text-slate-900 truncate">{currentUserObj.name}</h4>
                          <p className="text-[10px] text-slate-500 truncate">@{currentUserObj.username} • {currentUserObj.email}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-indigo-100/70 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-medium">Peran Terikat:</span>
                        <span className="font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-md font-mono">
                          {currentUserObj.roleName} ({currentUserObj.roleCode})
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5 pt-1 text-[10px] text-slate-600 leading-tight">
                        <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>Hak akses individu ini otomatis terikat dengan wewenang role <strong>{currentUserObj.roleName}</strong>.</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Tidak ada individu terdaftar pada Office <strong>{currentOfficeObj?.name}</strong>.</span>
                </div>
              )}
            </div>
          ) : (
            /* Mode Peran */
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Pilih Nama Peran <span className="text-red-500">*</span>
              </label>
              <select
                value={currentRoleCode}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-indigo-500 cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.role} ({r.code})
                  </option>
                ))}
              </select>

              {currentRoleObj && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] space-y-1">
                  <p className="font-extrabold text-slate-800">{currentRoleObj.role}</p>
                  <p className="text-slate-500">{currentRoleObj.permissions}</p>
                </div>
              )}
            </div>
          )}

          {/* Progress Bar Permission Counter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600">Aksi Hak Akses Terpilih</span>
              <span className="bg-indigo-600 text-white text-[11px] px-2.5 py-0.5 rounded-full font-mono">
                {totalSelectedActions} / {totalAvailableActions}
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-[#00c885] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 text-right font-medium">
              {progressPercent}% Aksi Aktif di [{currentOfficeObj?.code}]
            </p>
          </div>

          {/* Action Buttons Stack */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
              >
                Pilih Semua Aksi
              </button>
              <button
                type="button"
                onClick={handleUnselectAll}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
              >
                Hapus Semua
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-indigo-500/25 flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "..." : "Simpan Hak Akses"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Card: Daftar Permission per Modul */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Daftar Permission per Modul & Aksi</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Atur <strong>1 per 1 aksi</strong> yang diizinkan pada tiap sub-modul di Office <strong className="text-slate-800">[{currentOfficeObj?.code}] {currentOfficeObj?.name}</strong>.
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold bg-slate-50 px-3 py-1 rounded-xl border border-slate-100 shrink-0">
              Klik modul untuk expand/collapse
            </span>
          </div>

          {/* Module Accordion List */}
          <div className="space-y-4">
            {SYSTEM_MODULES.map((mod) => {
              const isModuleActiveInOffice = officeModules.includes(mod.id);
              const isExpanded = expandedModules[mod.id];

              let allModuleActions = [];
              mod.subModules.forEach((sub) => {
                const perms = sub.permissions || ["Lihat", "Tambah", "Edit", "Hapus"];
                perms.forEach((p) => allModuleActions.push(`${sub.id}:${p}`));
              });

              const selectedActionsInModuleCount = allModuleActions.filter((k) => selectedPermissions.includes(k)).length;
              const isAllModuleActionsSelected = isModuleActiveInOffice && allModuleActions.length > 0 && selectedActionsInModuleCount === allModuleActions.length;
              const isPartialModuleActionsSelected = selectedActionsInModuleCount > 0 && !isAllModuleActionsSelected;

              return (
                <div
                  key={mod.id}
                  className={`bg-white border rounded-2xl transition-all overflow-hidden shadow-2xs ${
                    !isModuleActiveInOffice
                      ? "border-slate-200 bg-slate-50/70 opacity-60"
                      : isAllModuleActionsSelected
                      ? "border-indigo-300 ring-1 ring-indigo-500/20"
                      : "border-slate-200"
                  }`}
                >
                  {/* Module Header Bar */}
                  <div className="p-4 flex items-center justify-between bg-white border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleModuleAllActions(mod)}
                        disabled={!isModuleActiveInOffice}
                        title="Pilih/Hapus Semua Aksi Modul Ini"
                        className="cursor-pointer"
                      >
                        {isAllModuleActionsSelected ? (
                          <CheckSquare className="w-5 h-5 text-indigo-600" />
                        ) : isPartialModuleActionsSelected ? (
                          <CheckSquare className="w-5 h-5 text-indigo-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </button>

                      <div 
                        onClick={() => toggleExpand(mod.id)} 
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {mod.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                          {mod.id.toLowerCase().replace("mod_", "")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {!isModuleActiveInOffice ? (
                        <span className="text-[10px] bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-bold border border-red-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Nonaktif di [{currentOfficeObj?.code}]
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
                          {selectedActionsInModuleCount} / {allModuleActions.length} Aksi
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleExpand(mod.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Module Content */}
                  {isExpanded && (
                    <div className="bg-slate-50/30">
                      {!isModuleActiveInOffice ? (
                        <p className="p-4 text-xs text-slate-400 italic">
                          Modul ini di-nonaktifkan pada Office <strong>[{currentOfficeObj?.code}] {currentOfficeObj?.name}</strong>.
                        </p>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {mod.subModules.map((sub) => {
                            const availablePerms = sub.permissions || ["Lihat", "Tambah", "Edit", "Hapus"];
                            const selectedCount = availablePerms.filter((p) => isActionSelected(sub.id, p)).length;
                            const isAllSubSelected = selectedCount === availablePerms.length;
                            const isPartialSubSelected = selectedCount > 0 && !isAllSubSelected;

                            return (
                              <div 
                                key={sub.id} 
                                className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                                      {sub.name}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                                      {sub.code || sub.id}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    {selectedCount} dari {availablePerms.length} aksi diaktifkan
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                  {availablePerms.map((perm) => {
                                    const active = isActionSelected(sub.id, perm);
                                    return (
                                      <button
                                        key={perm}
                                        type="button"
                                        onClick={() => toggleSingleAction(sub.id, perm, mod.id)}
                                        disabled={!isModuleActiveInOffice}
                                        title={`Klik untuk ${active ? 'mematikan' : 'mengaktifkan'} aksi ${perm}`}
                                        className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 border ${
                                          active
                                            ? getActiveBadgeClass(perm)
                                            : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600 shadow-2xs font-semibold"
                                        }`}
                                      >
                                        {active ? (
                                          <Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" />
                                        ) : (
                                          <Square className="w-3 h-3 text-slate-300 shrink-0" />
                                        )}
                                        <span>{perm}</span>
                                      </button>
                                    );
                                  })}
                                </div>

                                <div className="shrink-0 flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-2 md:pt-0 md:pl-4 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => toggleSubModuleAllActions(sub, mod.id)}
                                    disabled={!isModuleActiveInOffice}
                                    title="Pilih/Hapus Semua Aksi pada Sub-Modul Ini"
                                    className="flex items-center gap-2 text-xs font-extrabold text-slate-700 hover:text-indigo-600 cursor-pointer"
                                  >
                                    <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">Pilih Semua:</span>
                                    {isAllSubSelected ? (
                                      <CheckSquare className="w-5 h-5 text-indigo-600" />
                                    ) : isPartialSubSelected ? (
                                      <CheckSquare className="w-5 h-5 text-indigo-400" />
                                    ) : (
                                      <Square className="w-5 h-5 text-slate-300" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
