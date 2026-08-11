import apiClient from "./apiClient";
import type { User } from "../types";

// `object` (not Record<string, unknown>) so callers can pass a named interface
// variable directly without hitting "index signature missing" errors.
type Params = object;

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface EffectiveSubmodule {
  id: string | number;
  code: string;
  name: string;
  can_view: boolean;
  [key: string]: unknown;
}

export interface EffectivePermissionsResponse {
  effective_submodules?: EffectiveSubmodule[];
  [key: string]: unknown;
}

export const api = {
  // --- Auth API ---
  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>("/auth/login", { username, password });
    if (res.token) {
      localStorage.setItem("apg_token", res.token);
    }
    return res;
  },

  async logout(): Promise<{ success: true }> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      localStorage.removeItem("apg_token");
      localStorage.removeItem("apg_user");
    }
    return { success: true };
  },

  async getMe(userId: number = 1): Promise<any> {
    return apiClient.get(`/auth/me?user_id=${userId}`);
  },

  // --- Domain 1: System Settings & Permissions ---
  async getSystemModules(): Promise<any[]> {
    const res = await apiClient.get("/modules");
    return res.data || [];
  },

  async getOfficeModules(officeId: string | number = 1): Promise<any[]> {
    const res = await apiClient.get(`/offices/${officeId}/modules`);
    return res.active_module_ids || [];
  },

  async updateOfficeModules(officeId: string | number, moduleIds: (string | number)[]): Promise<any> {
    return apiClient.post(`/offices/${officeId}/modules`, { module_ids: moduleIds });
  },

  async getOfficePermissions(officeId: string | number = 1): Promise<any[]> {
    return this.getOfficeModules(officeId);
  },

  async saveOfficePermissions(officeId: string | number, moduleIds: (string | number)[]): Promise<any> {
    return this.updateOfficeModules(officeId, moduleIds);
  },

  async getRolePermissions(roleId: string | number = 1, officeId: string | number = 1): Promise<any[]> {
    const res = await apiClient.get(`/roles/${roleId}/permissions?office_id=${officeId}`);
    return res.permissions || [];
  },

  async updateRolePermissions(roleId: string | number, officeId: string | number, permissions: unknown): Promise<any> {
    return apiClient.post(`/roles/${roleId}/permissions`, { office_id: officeId, permissions });
  },

  async getRoleSubModules(roleCode: string = "SUPER_ADMIN"): Promise<any[]> {
    // Map roleCode to roleId if needed, default to roleId 1
    const roleIdMap: Record<string, number> = { SUPER_ADMIN: 1, ADMIN_CABANG: 2, KADIV_KEUANGAN: 3, MANAGER_ANPER: 4, STAFF_ANPER: 5, STAFF_HOLDING: 6, DIREKSI_HOLDING: 7 };
    const roleId = roleIdMap[roleCode] || 1;
    const perms = await this.getRolePermissions(roleId, 1);
    return perms.filter((p) => p.can_view).map((p) => p.submodule_id);
  },

  async updateRoleSubModules(roleCode: string, assignedSubModuleIds: (string | number)[]): Promise<any> {
    const roleIdMap: Record<string, number> = { SUPER_ADMIN: 1, ADMIN_CABANG: 2, KADIV_KEUANGAN: 3, MANAGER_ANPER: 4, STAFF_ANPER: 5, STAFF_HOLDING: 6, DIREKSI_HOLDING: 7 };
    const roleId = roleIdMap[roleCode] || 1;
    const formatted = assignedSubModuleIds.map((subId) => ({
      submodule_id: subId,
      can_view: true,
      can_create: true,
      can_edit: true,
      can_delete: true,
    }));
    return this.updateRolePermissions(roleId, 1, formatted);
  },

  async getUserPermissions(userId: string | number, officeId: string | number = 1): Promise<any[]> {
    const res = await apiClient.get(`/users/${userId}/permissions?office_id=${officeId}`);
    return res.permissions || [];
  },

  async updateUserPermissions(userId: string | number, officeId: string | number, permissions: unknown): Promise<any> {
    return apiClient.post(`/users/${userId}/permissions`, { office_id: officeId, permissions });
  },

  async getEffectivePermissions(officeId: string | number = 1, roleId: string | number = 1): Promise<EffectivePermissionsResponse> {
    const res = await apiClient.get<EffectivePermissionsResponse>(`/permissions/effective?office_id=${officeId}&role_id=${roleId}`);
    return res;
  },

  async getAuditLogs(params: Params = {}): Promise<any> {
    return apiClient.get("/audit-logs", { params });
  },

  // Helper to normalize objects so React doesn't crash if backend returns nested models
  normalizeItem(item: any): any {
    if (!item || typeof item !== "object") return item;
    const newItem = { ...item };
    if (newItem.parent && typeof newItem.parent === "object") {
      newItem.parent_object = newItem.parent;
      newItem.parent = newItem.parent.name || newItem.parent.code || "-";
    }
    if (newItem.company && typeof newItem.company === "object") {
      newItem.company_object = newItem.company;
      newItem.company = newItem.company.name || newItem.company.code || "-";
    }
    if (newItem.office && typeof newItem.office === "object") {
      newItem.office_object = newItem.office;
      newItem.office = newItem.office.name || newItem.office.code || "-";
    }
    return newItem;
  },

  // --- Domain 2: Company Structure & Users ---
  async getOffices(): Promise<any[]> {
    const res = await apiClient.get("/offices");
    const raw = res.data || [];
    return raw.map(this.normalizeItem);
  },

  async getCompanyStructure(): Promise<any[]> {
    return this.getOffices();
  },

  async addEntity(entityData: Params): Promise<any> {
    const res = await apiClient.post("/offices", entityData);
    return res.data;
  },

  async getOffice(id: string | number): Promise<any> {
    const res = await apiClient.get(`/offices/${id}`);
    return this.normalizeItem(res.data);
  },

  async updateOffice(id: string | number, data: Params): Promise<any> {
    const res = await apiClient.put(`/offices/${id}`, data);
    return res.data;
  },

  async deleteOffice(id: string | number): Promise<any> {
    return apiClient.delete(`/offices/${id}`);
  },

  async getCompanyProfile(officeId: string | number = 1): Promise<any> {
    const res = await apiClient.get(`/offices/${officeId}/profile`);
    return res.data;
  },

  async updateCompanyProfile(officeId: string | number, data: Params): Promise<any> {
    const res = await apiClient.put(`/offices/${officeId}/profile`, data);
    return res.data;
  },

  async getRoles(): Promise<any[]> {
    const res = await apiClient.get("/roles");
    return res.data || [];
  },

  async addRole(roleData: Params): Promise<any> {
    const res = await apiClient.post("/roles", roleData);
    return res.data;
  },

  async updateRole(id: string | number, data: Params): Promise<any> {
    const res = await apiClient.put(`/roles/${id}`, data);
    return res.data;
  },

  async deleteRole(id: string | number): Promise<any> {
    return apiClient.delete(`/roles/${id}`);
  },

  async getUsers(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/users", { params });
    const raw = res.data || [];
    return raw.map(this.normalizeItem);
  },

  async getUsersByOffice(officeId: string | number): Promise<any[]> {
    return this.getUsers({ office_id: officeId });
  },

  async addUser(userData: Params): Promise<any> {
    const res = await apiClient.post("/users", userData);
    return res.data;
  },

  async updateUser(id: string | number, data: Params): Promise<any> {
    const res = await apiClient.put(`/users/${id}`, data);
    return res.data;
  },

  async deleteUser(id: string | number): Promise<any> {
    return apiClient.delete(`/users/${id}`);
  },

  async getApprovals(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/user-approvals", { params });
    const raw = res.data || [];
    return raw.map(this.normalizeItem);
  },

  async processApproval(id: string | number, action: "approve" | "reject"): Promise<any> {
    const endpoint = action === "approve" ? `/user-approvals/${id}/approve` : `/user-approvals/${id}/reject`;
    return apiClient.post(endpoint);
  },

  async getEmployees(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/employees", { params });
    const raw = res.data || [];
    return raw.map(this.normalizeItem);
  },

  async addEmployee(data: Params): Promise<any> {
    const res = await apiClient.post("/employees", data);
    return res.data;
  },

  // --- Domain 3: General Ledger & Budgeting ---
  async getCOA(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/coa", { params });
    return res.data || [];
  },

  async addCOA(accountData: Params): Promise<any> {
    const res = await apiClient.post("/coa", accountData);
    return res.data;
  },

  async syncCOA(): Promise<any> {
    return apiClient.post("/coa/sync");
  },

  async getJournals(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/journals", { params });
    return res.data || [];
  },

  async addJournal(data: Params): Promise<any> {
    const res = await apiClient.post("/journals", data);
    return res.data;
  },

  async postJournal(id: string | number): Promise<any> {
    return apiClient.post(`/journals/${id}/post`);
  },

  async getBudgets(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/budgets", { params });
    return res.data || [];
  },

  async addBudget(data: Params): Promise<any> {
    const res = await apiClient.post("/budgets", data);
    return res.data;
  },

  async getBudgetTransfers(): Promise<any[]> {
    const res = await apiClient.get("/budget-transfers");
    return res.data || [];
  },

  async addBudgetTransfer(data: Params): Promise<any> {
    const res = await apiClient.post("/budget-transfers", data);
    return res.data;
  },

  // --- Domain 4: Cash & Bank ---
  async getTransactions(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/transactions", { params });
    return res.data || [];
  },

  async addTransaction(data: Params): Promise<any> {
    const res = await apiClient.post("/transactions", data);
    return res.data;
  },

  // --- Domain 5: Sales ---
  async getProducts(): Promise<any[]> {
    const res = await apiClient.get("/products");
    return res.data || [];
  },

  async addProduct(data: Params): Promise<any> {
    const res = await apiClient.post("/products", data);
    return res.data;
  },

  async getProductTypes(): Promise<any[]> {
    const res = await apiClient.get("/product-types");
    return res.data || [];
  },

  async addProductType(data: Params): Promise<any> {
    const res = await apiClient.post("/product-types", data);
    return res.data;
  },

  async getCustomers(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/customers", { params });
    return res.data || [];
  },

  async addCustomer(data: Params): Promise<any> {
    const res = await apiClient.post("/customers", data);
    return res.data;
  },

  // --- Domain 6: Purchasing ---
  async getVendors(): Promise<any[]> {
    const res = await apiClient.get("/vendors");
    return res.data || [];
  },

  async addVendor(data: Params): Promise<any> {
    const res = await apiClient.post("/vendors", data);
    return res.data;
  },

  async getPurchaseOrders(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/purchase-orders", { params });
    return res.data || [];
  },

  async addPurchaseOrder(data: Params): Promise<any> {
    const res = await apiClient.post("/purchase-orders", data);
    return res.data;
  },

  // --- Domain 7: Inventory ---
  async getInventoryItems(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/inventory-items", { params });
    return res.data || [];
  },

  async addInventoryItem(data: Params): Promise<any> {
    const res = await apiClient.post("/inventory-items", data);
    return res.data;
  },

  async getItemBrands(): Promise<any[]> {
    const res = await apiClient.get("/item-brands");
    return res.data || [];
  },

  async addItemBrand(data: Params): Promise<any> {
    const res = await apiClient.post("/item-brands", data);
    return res.data;
  },

  async getItemCategories(): Promise<any[]> {
    const res = await apiClient.get("/item-categories");
    return res.data || [];
  },

  async addItemCategory(data: Params): Promise<any> {
    const res = await apiClient.post("/item-categories", data);
    return res.data;
  },

  async getStockRequests(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/stock-requests", { params });
    return res.data || [];
  },

  async addStockRequest(data: Params): Promise<any> {
    const res = await apiClient.post("/stock-requests", data);
    return res.data;
  },

  async getStockTransfers(): Promise<any[]> {
    const res = await apiClient.get("/stock-transfers");
    return res.data || [];
  },

  async addStockTransfer(data: Params): Promise<any> {
    const res = await apiClient.post("/stock-transfers", data);
    return res.data;
  },

  async getGoodsReceipts(): Promise<any[]> {
    const res = await apiClient.get("/goods-receipts");
    return res.data || [];
  },

  async addGoodsReceipt(data: Params): Promise<any> {
    const res = await apiClient.post("/goods-receipts", data);
    return res.data;
  },

  // --- Domain 8: Fixed Assets ---
  async getFixedAssets(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/fixed-assets", { params });
    return res.data || [];
  },

  async addFixedAsset(data: Params): Promise<any> {
    const res = await apiClient.post("/fixed-assets", data);
    return res.data;
  },

  async getAssetCategories(): Promise<any[]> {
    const res = await apiClient.get("/asset-categories");
    return res.data || [];
  },

  async addAssetCategory(data: Params): Promise<any> {
    const res = await apiClient.post("/asset-categories", data);
    return res.data;
  },

  // --- Domain 9: Holding-level COA (entity, kategori, konfigurasi nomor akun per office) ---
  async getCoaEntities(): Promise<any[]> {
    const res = await apiClient.get("/coa-entities");
    const raw = res.data || [];
    return raw.map(this.normalizeItem);
  },

  async addCoaEntity(data: Params): Promise<any> {
    const res = await apiClient.post("/coa-entities", data);
    return res.data;
  },

  async updateCoaEntity(id: string | number, data: Params): Promise<any> {
    const res = await apiClient.put(`/coa-entities/${id}`, data);
    return res.data;
  },

  async deleteCoaEntity(id: string | number): Promise<any> {
    return apiClient.delete(`/coa-entities/${id}`);
  },

  async getCoaCategories(): Promise<any[]> {
    const res = await apiClient.get("/coa-categories");
    return res.data || [];
  },

  async getCoaAccounts(params: Params = {}): Promise<any[]> {
    const res = await apiClient.get("/coa-accounts", { params });
    return res.data || [];
  },

  async addCoaAccount(data: Params): Promise<any> {
    const res = await apiClient.post("/coa-accounts", data);
    return res.data;
  },

  async getCoaEntityConfig(entityId: string | number): Promise<any> {
    const res = await apiClient.get(`/coa-entities/${entityId}/coa-config`);
    return res.data;
  },

  async saveCoaEntityCategories(entityId: string | number, categoryIds: (string | number)[]): Promise<any> {
    return apiClient.post(`/coa-entities/${entityId}/coa-config/categories`, { category_ids: categoryIds });
  },

  async saveCoaEntityAccounts(entityId: string | number, coaIds: (string | number)[]): Promise<any> {
    return apiClient.post(`/coa-entities/${entityId}/coa-config/accounts`, { coa_ids: coaIds });
  },
};

// Also export as mockApi for seamless drop-in replacement across existing pages!
export const mockApi = api;

export default api;
