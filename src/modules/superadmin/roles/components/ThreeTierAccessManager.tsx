import { useState, useEffect } from "react";
import {
  Building2,
  ShieldCheck,
  UserCheck,
  CheckSquare,
  Square,
  AlertTriangle,
  Save
} from "lucide-react";
import { api as mockApi } from "../../../../services/api";
import type { EffectivePermissionsResponse } from "../../../../services/api";
import { useToast } from "../../../../context/ToastContext";

interface Entity {
  id: string;
  name: string;
  typeClass?: string;
  parent?: string | { name?: string } | null;
}

interface Role {
  code: string;
  role: string;
  scope?: string;
  badgeColor?: string;
}

interface SystemSubModule {
  id: string;
  name: string;
  desc?: string;
}

interface SystemModule {
  id: string;
  name: string;
  description?: string;
  subModules: SystemSubModule[];
}

export const ThreeTierAccessManager = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [systemModules, setSystemModules] = useState<SystemModule[]>([]);

  // Selections
  const [selectedOfficeId, setSelectedOfficeId] = useState("");
  const [selectedRoleCode, setSelectedRoleCode] = useState("ADMIN_CABANG");

  // State Level 1 & Level 3
  const [officeModules, setOfficeModules] = useState<string[]>([]);
  const [roleSubModules, setRoleSubModules] = useState<string[]>([]);
  const [effectiveData, setEffectiveData] = useState<EffectivePermissionsResponse | null>(null);

  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (entities.length > 0 && !selectedOfficeId) {
      setSelectedOfficeId(entities[0].id);
    }
  }, [entities]);

  useEffect(() => {
    if (selectedOfficeId) {
      loadOfficeAndRoleData(selectedOfficeId, selectedRoleCode);
    }
  }, [selectedOfficeId, selectedRoleCode]);

  const loadInitialData = async () => {
    const ents = await mockApi.getCompanyStructure();
    const rls = await mockApi.getRoles();
    const mods = await mockApi.getSystemModules();
    setEntities(ents);
    setRoles(rls);
    setSystemModules(mods);
  };

  const loadOfficeAndRoleData = async (officeId: string, roleCode: string) => {
    const offMods = await mockApi.getOfficeModules(officeId);
    const rlSubs = await mockApi.getRoleSubModules(roleCode);
    const effective = await mockApi.getEffectivePermissions(officeId, roleCode);

    setOfficeModules(offMods);
    setRoleSubModules(rlSubs);
    setEffectiveData(effective);
  };

  const toggleOfficeModule = (moduleId: string) => {
    let updated: string[];
    if (officeModules.includes(moduleId)) {
      updated = officeModules.filter((id) => id !== moduleId);
    } else {
      updated = [...officeModules, moduleId];
    }
    setOfficeModules(updated);
  };

  const toggleRoleSubModule = (subModuleId: string, parentModuleId: string) => {
    if (!officeModules.includes(parentModuleId)) {
      return;
    }
    let updated: string[];
    if (roleSubModules.includes(subModuleId)) {
      updated = roleSubModules.filter((id) => id !== subModuleId);
    } else {
      updated = [...roleSubModules, subModuleId];
    }
    setRoleSubModules(updated);
  };

  const getSanitizedRoleSubModules = () => {
    const allowedSubModuleIds: string[] = [];
    systemModules.forEach((mod) => {
      if (officeModules.includes(mod.id)) {
        mod.subModules.forEach((sub) => {
          if (roleSubModules.includes(sub.id)) {
            allowedSubModuleIds.push(sub.id);
          }
        });
      }
    });
    return allowedSubModuleIds;
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const sanitizedSubModules = getSanitizedRoleSubModules();

    try {
      await mockApi.updateOfficeModules(selectedOfficeId, officeModules);
      await mockApi.updateRoleSubModules(selectedRoleCode, sanitizedSubModules);

      const effective = await mockApi.getEffectivePermissions(selectedOfficeId, selectedRoleCode);
      setEffectiveData(effective);
      showToast("Konfigurasi Akses 3-Level (Office → Modul → SubModul → Role) berhasil disimpan!");
    } catch (err) {
      console.error("Failed to save 3-tier access config", err);
      showToast("Gagal menyimpan konfigurasi akses", "error");
    } finally {
      setSaving(false);
    }
  };

  const selectedOfficeObj = entities.find((e) => e.id === selectedOfficeId) || entities[0];
  const selectedRoleObj = roles.find((r) => r.code === selectedRoleCode) || roles[0];

  return (
    <div className="space-y-6">
      {/* Header Banner Explanation */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#00c885]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="bg-[#00c885] text-slate-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Arsitektur Otentikasi Berjenjang
            </span>
            <h3 className="text-xl font-black text-white mt-2">
              Matriks Pembatasan 3-Level: Office → Modul → SubModul → Role
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Superadmin mengatur modul aktif di tiap Office. Submodul otomatis ter-filter dari picker jika modul utamanya nonaktif. Role bertindak sebagai wadah hak akses bagi User.
            </p>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-[#00c885] hover:bg-[#00b377] text-slate-900 px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "Simpan Konfigurasi Akses"}</span>
          </button>
        </div>
      </div>

      {/* Hierarchy Step Visualizer Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-[#00c885] text-slate-900 font-extrabold flex items-center justify-center shrink-0">
            1
          </div>
          <div>
            <p className="font-extrabold text-white">Office Level</p>
            <p className="text-[10px] text-emerald-400">Pilih Office/Cabang</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 text-slate-300 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-blue-500 text-white font-extrabold flex items-center justify-center shrink-0">
            2
          </div>
          <div>
            <p className="font-extrabold text-white">Module Filter</p>
            <p className="text-[10px] text-slate-400">Centang Modul Aktif</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 text-slate-300 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-purple-500 text-white font-extrabold flex items-center justify-center shrink-0">
            3
          </div>
          <div>
            <p className="font-extrabold text-white">SubModule Picker</p>
            <p className="text-[10px] text-slate-400">Kunci SubModul Role</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 text-slate-300 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-900 font-extrabold flex items-center justify-center shrink-0">
            4
          </div>
          <div>
            <p className="font-extrabold text-white">User Assignment</p>
            <p className="text-[10px] text-slate-400">User Terhubung ke Role</p>
          </div>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Column: Office & Role Selectors */}
        <div className="lg:col-span-4 space-y-6">
          {/* Office Selector Box */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Level 1: Pilih Office (Cabang/Anper)</span>
            </h4>
            
            <div className="space-y-2">
              {entities.map((ent) => {
                const isSelected = selectedOfficeId === ent.id;
                return (
                  <button
                    key={ent.id}
                    onClick={() => setSelectedOfficeId(ent.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-50 border-[#00c885] font-bold text-slate-900 shadow-xs"
                        : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{ent.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{ent.typeClass} • {typeof ent.parent === "object" ? (ent.parent?.name || "-") : (ent.parent || "-")}</p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isSelected ? "bg-[#00c885] text-white" : "bg-slate-200 text-slate-700"
                    }`}>
                      {officeModules.length} Modul Aktif
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Selector Box */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Level 3: Pilih Role / Jabatan</span>
            </h4>

            <div className="space-y-2">
              {roles.map((rl) => {
                const isSelected = selectedRoleCode === rl.code;
                return (
                  <button
                    key={rl.code}
                    onClick={() => setSelectedRoleCode(rl.code)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-50 border-blue-500 font-bold text-slate-900 shadow-xs"
                        : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{rl.role}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Scope: {rl.scope}</p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${rl.badgeColor}`}>
                      {rl.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Interactive Picker Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  Matriks Konfigurasi Akses: <span className="text-emerald-600">{selectedOfficeObj?.name}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Konfigurasi modul aktif untuk office & centang submodule yang diberikan pada role <strong className="text-slate-800">{selectedRoleObj?.role}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  {officeModules.length} dari {systemModules.length} Modul Aktif
                </span>
              </div>
            </div>

            {/* Modules & SubModules Cascade List */}
            <div className="space-y-6">
              {systemModules.map((mod) => {
                const isModuleActive = officeModules.includes(mod.id);

                return (
                  <div
                    key={mod.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isModuleActive
                        ? "border-emerald-200 bg-emerald-50/20"
                        : "border-slate-200 bg-slate-50/60 opacity-75"
                    }`}
                  >
                    {/* Level 1: Module Header Toggle */}
                    <div className={`p-4 flex items-center justify-between ${
                      isModuleActive ? "bg-emerald-100/50" : "bg-slate-100/80"
                    }`}>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleOfficeModule(mod.id)}
                          className="cursor-pointer"
                        >
                          {isModuleActive ? (
                            <CheckSquare className="w-5 h-5 text-[#00c885]" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {mod.name}
                            </span>
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                              isModuleActive ? "bg-[#00c885] text-white" : "bg-slate-300 text-slate-700"
                            }`}>
                              {isModuleActive ? "MODUL AKTIF DI OFFICE" : "MODUL NON-AKTIF"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{mod.description}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-bold">
                          {mod.subModules.length} SubModul
                        </span>
                      </div>
                    </div>

                    {/* Level 2 & 3: SubModule Picker */}
                    <div className="p-4 border-t border-slate-100">
                      {!isModuleActive ? (
                        <div className="p-3 bg-red-50/70 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>
                            Modul "{mod.name}" nonaktif di Office ini. Seluruh SubModul di bawahnya otomatis di-filter keluar dari picker & tidak dapat diakses role manapun.
                          </span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {mod.subModules.map((sub) => {
                            const isSubChecked = roleSubModules.includes(sub.id);

                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => toggleRoleSubModule(sub.id, mod.id)}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                                  isSubChecked
                                    ? "bg-blue-50 border-blue-400 text-blue-900 shadow-xs"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <div className="mt-0.5">
                                  {isSubChecked ? (
                                    <CheckSquare className="w-4 h-4 text-blue-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-xs font-bold">{sub.name}</p>
                                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{sub.desc}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Level 4: Live Effective Access Summary Inspector */}
            {effectiveData && (
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <h5 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#00c885]" />
                  <span>Hasil Kalkulasi Akses Efektif User ({selectedRoleObj?.role} di {selectedOfficeObj?.name})</span>
                </h5>

                <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-emerald-900">
                    <span>Total SubModul Efektif Terbuka:</span>
                    <span className="text-sm bg-[#00c885] text-white px-2.5 py-0.5 rounded-full">
                      {(effectiveData.effective_submodules ?? []).length} SubModul
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(effectiveData.effective_submodules ?? []).map((sub) => (
                      <span key={sub.id} className="bg-white border border-emerald-300 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                        ✓ {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
