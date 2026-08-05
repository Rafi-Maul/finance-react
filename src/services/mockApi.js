// Mock REST API for APG Finance System

import {
  SYSTEM_MODULES,
  INITIAL_ROLES,
  INITIAL_ENTITIES,
  INITIAL_OFFICE_MODULES,
  INITIAL_ROLE_SUBMODULES,
  INITIAL_COA,
  INITIAL_USERS,
  INITIAL_APPROVALS,
  getStoredData,
  setStoredData
} from "./mockData";

export const mockApi = {
  // Offices (alias for company structure)
  async getOffices() {
    await new Promise((res) => setTimeout(res, 150));
    return getStoredData("apg_entities", INITIAL_ENTITIES);
  },

  // Office → Feature Permissions (old-style granular keys)
  async getOfficePermissions(officeId) {
    await new Promise((res) => setTimeout(res, 150));
    const config = getStoredData("apg_office_modules", INITIAL_OFFICE_MODULES);
    return config[officeId] || [];
  },

  async saveOfficePermissions(officeId, permissionKeys) {
    await new Promise((res) => setTimeout(res, 250));
    const config = getStoredData("apg_office_modules", INITIAL_OFFICE_MODULES);
    config[officeId] = permissionKeys;
    setStoredData("apg_office_modules", config);
    return { success: true, officeId, permissionKeys };
  },

  // Users
  async getUsers() {
    await new Promise((res) => setTimeout(res, 200));
    return getStoredData("apg_users", INITIAL_USERS);
  },

  async getUsersByOffice(officeId) {
    await new Promise((res) => setTimeout(res, 150));
    const users = getStoredData("apg_users", INITIAL_USERS);
    if (!officeId) return users;
    return users.filter((u) => u.officeId === officeId);
  },

  async addUser(userData) {
    await new Promise((res) => setTimeout(res, 300));
    const users = getStoredData("apg_users", INITIAL_USERS);
    const newUser = {
      id: `u-${Date.now()}`,
      status: "Aktif",
      joinDate: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      lastLogin: "-",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name || "user")}`,
      ...userData
    };
    const updated = [...users, newUser];
    setStoredData("apg_users", updated);
    return newUser;
  },

  // Master Modules & SubModules
  async getSystemModules() {
    await new Promise((res) => setTimeout(res, 100));
    return SYSTEM_MODULES;
  },

  // Level 1: Office -> Active Modules
  async getOfficeModules(officeId = "ent-1") {
    await new Promise((res) => setTimeout(res, 150));
    const config = getStoredData("apg_office_modules", INITIAL_OFFICE_MODULES);
    return config[officeId] || [];
  },

  async updateOfficeModules(officeId, activeModuleIds) {
    await new Promise((res) => setTimeout(res, 250));
    const config = getStoredData("apg_office_modules", INITIAL_OFFICE_MODULES);
    config[officeId] = activeModuleIds;
    setStoredData("apg_office_modules", config);
    return { success: true, officeId, activeModuleIds };
  },

  // Level 3: Role -> Assigned SubModules
  async getRoleSubModules(roleCode = "SUPER_ADMIN") {
    await new Promise((res) => setTimeout(res, 150));
    const config = getStoredData("apg_role_submodules", INITIAL_ROLE_SUBMODULES);
    return config[roleCode] || [];
  },

  async updateRoleSubModules(roleCode, assignedSubModuleIds) {
    await new Promise((res) => setTimeout(res, 250));
    const config = getStoredData("apg_role_submodules", INITIAL_ROLE_SUBMODULES);
    config[roleCode] = assignedSubModuleIds;
    setStoredData("apg_role_submodules", config);
    return { success: true, roleCode, assignedSubModuleIds };
  },

  // Level 4 / Combined Effective Permission Engine
  // Calculates: Role.assignedSubModules ∩ Office.enabledModules (only submodules whose parent module is active in Office!)
  async getEffectivePermissions(officeId, roleCode) {
    await new Promise((res) => setTimeout(res, 200));
    const officeModulesConfig = getStoredData("apg_office_modules", INITIAL_OFFICE_MODULES);
    const roleSubModulesConfig = getStoredData("apg_role_submodules", INITIAL_ROLE_SUBMODULES);

    const officeModuleIds = officeModulesConfig[officeId] || [];
    const roleSubModuleIds = roleSubModulesConfig[roleCode] || [];

    // Filter available submodules for this Office
    const availableSubModulesInOffice = [];
    const activeModules = [];

    SYSTEM_MODULES.forEach((mod) => {
      if (officeModuleIds.includes(mod.id)) {
        activeModules.push(mod);
        mod.subModules.forEach((sub) => {
          availableSubModulesInOffice.push(sub);
        });
      }
    });

    // Effective allowed submodules = Submodules assigned to Role that belong to active Office modules
    const effectiveAllowedSubModules = availableSubModulesInOffice.filter((sub) =>
      roleSubModuleIds.includes(sub.id)
    );

    return {
      officeId,
      roleCode,
      activeModules,
      availableSubModulesInOffice,
      effectiveAllowedSubModules,
      effectiveSubModuleIds: effectiveAllowedSubModules.map((s) => s.id)
    };
  },

  // Auth API
  async login(username, password, rolePreset = null) {
    await new Promise((res) => setTimeout(res, 400));
    const users = getStoredData("apg_users", INITIAL_USERS);
    
    let user;
    if (rolePreset) {
      user = users.find((u) => u.roleCode === rolePreset);
    } else {
      user = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );
    }

    if (!user && rolePreset) {
      user = users[0];
    }

    if (user) {
      const roles = getStoredData("apg_roles", INITIAL_ROLES);
      const roleDetails = roles.find((r) => r.code === user.roleCode) || roles[0];
      return {
        success: true,
        user: { ...user, roleDetails },
        token: `mock-jwt-token-${user.id}-${Date.now()}`
      };
    }

    return {
      success: false,
      message: "Username atau kata sandi tidak valid."
    };
  },

  // Roles & Permissions API
  async getRoles() {
    await new Promise((res) => setTimeout(res, 200));
    return getStoredData("apg_roles", INITIAL_ROLES);
  },

  async addRole(roleData) {
    await new Promise((res) => setTimeout(res, 300));
    const roles = getStoredData("apg_roles", INITIAL_ROLES);
    const newRole = {
      id: `role-${Date.now()}`,
      ...roleData,
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300"
    };
    const updated = [...roles, newRole];
    setStoredData("apg_roles", updated);
    return newRole;
  },

  // Company Structure API
  async getCompanyStructure() {
    await new Promise((res) => setTimeout(res, 200));
    return getStoredData("apg_entities", INITIAL_ENTITIES);
  },

  async addEntity(entityData) {
    await new Promise((res) => setTimeout(res, 300));
    const entities = getStoredData("apg_entities", INITIAL_ENTITIES);
    const newEntity = {
      id: `ent-${Date.now()}`,
      status: "Aktif",
      badgeType: entityData.type === "Cabang" ? "blue" : entityData.type === "KCL" ? "purple" : "green",
      ...entityData
    };
    const updated = [...entities, newEntity];
    setStoredData("apg_entities", updated);
    return newEntity;
  },

  // COA API
  async getCOA() {
    await new Promise((res) => setTimeout(res, 200));
    return getStoredData("apg_coa", INITIAL_COA);
  },

  async addCOA(accountData) {
    await new Promise((res) => setTimeout(res, 300));
    const accounts = getStoredData("apg_coa", INITIAL_COA);
    const newAccount = {
      ...accountData,
      status: "Aktif",
      typeBadge: "bg-emerald-100 text-emerald-800",
      scopeBadge: accountData.isSub ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
    };
    const updated = [...accounts, newAccount];
    setStoredData("apg_coa", updated);
    return newAccount;
  },

  async syncCOA() {
    await new Promise((res) => setTimeout(res, 500));
    return { success: true, message: "Seluruh Anak Perusahaan, Cabang & KCL telah disinkronkan dengan COA Holding!" };
  },

  // User Approvals API
  async getApprovals() {
    await new Promise((res) => setTimeout(res, 200));
    return getStoredData("apg_approvals", INITIAL_APPROVALS);
  },

  async processApproval(id, action) {
    await new Promise((res) => setTimeout(res, 300));
    const list = getStoredData("apg_approvals", INITIAL_APPROVALS);
    const updated = list.filter((item) => item.id !== id);
    setStoredData("apg_approvals", updated);
    return { success: true, remaining: updated.length };
  }
};
