import apiClient from "./apiClient";

export const api = {
  // --- Auth API ---
  async login(username, password) {
    const res = await apiClient.post("/auth/login", { username, password });
    if (res.token) {
      localStorage.setItem("apg_token", res.token);
    }
    return res;
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      localStorage.removeItem("apg_token");
      localStorage.removeItem("apg_user");
    }
    return { success: true };
  },

  async getMe(userId = 1) {
    return apiClient.get(`/auth/me?user_id=${userId}`);
  },

  // --- Domain 1: System Settings & Permissions ---
  async getSystemModules() {
    const res = await apiClient.get("/modules");
    return res.data || [];
  },

  async getOfficeModules(officeId = 1) {
    const res = await apiClient.get(`/offices/${officeId}/modules`);
    return res.active_module_ids || [];
  },

  async updateOfficeModules(officeId, moduleIds) {
    return apiClient.post(`/offices/${officeId}/modules`, { module_ids: moduleIds });
  },

  async getOfficePermissions(officeId = 1) {
    return this.getOfficeModules(officeId);
  },

  async saveOfficePermissions(officeId, moduleIds) {
    return this.updateOfficeModules(officeId, moduleIds);
  },

  async getRolePermissions(roleId = 1, officeId = 1) {
    const res = await apiClient.get(`/roles/${roleId}/permissions?office_id=${officeId}`);
    return res.permissions || [];
  },

  async updateRolePermissions(roleId, officeId, permissions) {
    return apiClient.post(`/roles/${roleId}/permissions`, { office_id: officeId, permissions });
  },

  async getRoleSubModules(roleCode = "SUPER_ADMIN") {
    // Map roleCode to roleId if needed, default to roleId 1
    const roleIdMap = { SUPER_ADMIN: 1, ADMIN_CABANG: 2, KADIV_KEUANGAN: 3, MANAGER_ANPER: 4, STAFF_ANPER: 5, STAFF_HOLDING: 6, DIREKSI_HOLDING: 7 };
    const roleId = roleIdMap[roleCode] || 1;
    const perms = await this.getRolePermissions(roleId, 1);
    return perms.filter(p => p.can_view).map(p => p.submodule_id);
  },

  async updateRoleSubModules(roleCode, assignedSubModuleIds) {
    const roleIdMap = { SUPER_ADMIN: 1, ADMIN_CABANG: 2, KADIV_KEUANGAN: 3, MANAGER_ANPER: 4, STAFF_ANPER: 5, STAFF_HOLDING: 6, DIREKSI_HOLDING: 7 };
    const roleId = roleIdMap[roleCode] || 1;
    const formatted = assignedSubModuleIds.map(subId => ({
      submodule_id: subId,
      can_view: true,
      can_create: true,
      can_edit: true,
      can_delete: true,
    }));
    return this.updateRolePermissions(roleId, 1, formatted);
  },

  async getUserPermissions(userId, officeId = 1) {
    const res = await apiClient.get(`/users/${userId}/permissions?office_id=${officeId}`);
    return res.permissions || [];
  },

  async updateUserPermissions(userId, officeId, permissions) {
    return apiClient.post(`/users/${userId}/permissions`, { office_id: officeId, permissions });
  },

  async getEffectivePermissions(officeId = 1, roleId = 1) {
    const res = await apiClient.get(`/permissions/effective?office_id=${officeId}&role_id=${roleId}`);
    return res;
  },

  async getAuditLogs(params = {}) {
    return apiClient.get("/audit-logs", { params });
  },

  // Helper to normalize objects so React doesn't crash if backend returns nested models
  normalizeItem(item) {
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
  async getOffices() {
    const res = await apiClient.get("/offices");
    const raw = res.data || [];
    return raw.map(this.normalizeItem);
  },

  async getCompanyStructure() {
    return this.getOffices();
  },

  async addEntity(entityData) {
    const res = await apiClient.post("/offices", entityData);
    return res.data;
  },

  async getOffice(id) {
    const res = await apiClient.get(`/offices/${id}`);
    return this.normalizeItem(res.data);
  },

  async updateOffice(id, data) {
    const res = await apiClient.put(`/offices/${id}`, data);
    return res.data;
  },

  async deleteOffice(id) {
    return apiClient.delete(`/offices/${id}`);
  },

  async getCompanyProfile(officeId = 1) {
    const res = await apiClient.get(`/offices/${officeId}/profile`);
    return res.data;
  },

  async updateCompanyProfile(officeId, data) {
    const res = await apiClient.put(`/offices/${officeId}/profile`, data);
    return res.data;
  },

  async getRoles() {
    const res = await apiClient.get("/roles");
    return res.data || [];
  },

  async addRole(roleData) {
    const res = await apiClient.post("/roles", roleData);
    return res.data;
  },

  async updateRole(id, data) {
    const res = await apiClient.put(`/roles/${id}`, data);
    return res.data;
  },

  async deleteRole(id) {
    return apiClient.delete(`/roles/${id}`);
  },

  async getUsers(params = {}) {
    const res = await apiClient.get("/users", { params });
    const raw = res.data || [];
    return raw.map(this.normalizeItem);
  },

  async getUsersByOffice(officeId) {
    return this.getUsers({ office_id: officeId });
  },

  async addUser(userData) {
    const res = await apiClient.post("/users", userData);
    return res.data;
  },

  async updateUser(id, data) {
    const res = await apiClient.put(`/users/${id}`, data);
    return res.data;
  },

  async deleteUser(id) {
    return apiClient.delete(`/users/${id}`);
  },

  async getApprovals(params = {}) {
    const res = await apiClient.get("/user-approvals", { params });
    const raw = res.data || [];
    return raw.map(this.normalizeItem);
  },

  async processApproval(id, action) {
    const endpoint = action === "approve" ? `/user-approvals/${id}/approve` : `/user-approvals/${id}/reject`;
    return apiClient.post(endpoint);
  },

  async getEmployees(params = {}) {
    const res = await apiClient.get("/employees", { params });
    const raw = res.data || [];
    return raw.map(this.normalizeItem);
  },

  async addEmployee(data) {
    const res = await apiClient.post("/employees", data);
    return res.data;
  },

  // --- Domain 3: General Ledger & Budgeting ---
  async getCOA(params = {}) {
    const res = await apiClient.get("/coa", { params });
    return res.data || [];
  },

  async addCOA(accountData) {
    const res = await apiClient.post("/coa", accountData);
    return res.data;
  },

  async syncCOA() {
    return apiClient.post("/coa/sync");
  },

  async getJournals(params = {}) {
    const res = await apiClient.get("/journals", { params });
    return res.data || [];
  },

  async addJournal(data) {
    const res = await apiClient.post("/journals", data);
    return res.data;
  },

  async postJournal(id) {
    return apiClient.post(`/journals/${id}/post`);
  },

  async getBudgets(params = {}) {
    const res = await apiClient.get("/budgets", { params });
    return res.data || [];
  },

  async addBudget(data) {
    const res = await apiClient.post("/budgets", data);
    return res.data;
  },

  async getBudgetTransfers() {
    const res = await apiClient.get("/budget-transfers");
    return res.data || [];
  },

  async addBudgetTransfer(data) {
    const res = await apiClient.post("/budget-transfers", data);
    return res.data;
  },

  // --- Domain 4: Cash & Bank ---
  async getTransactions(params = {}) {
    const res = await apiClient.get("/transactions", { params });
    return res.data || [];
  },

  async addTransaction(data) {
    const res = await apiClient.post("/transactions", data);
    return res.data;
  },

  // --- Domain 5: Sales ---
  async getProducts() {
    const res = await apiClient.get("/products");
    return res.data || [];
  },

  async addProduct(data) {
    const res = await apiClient.post("/products", data);
    return res.data;
  },

  async getProductTypes() {
    const res = await apiClient.get("/product-types");
    return res.data || [];
  },

  async addProductType(data) {
    const res = await apiClient.post("/product-types", data);
    return res.data;
  },

  async getCustomers(params = {}) {
    const res = await apiClient.get("/customers", { params });
    return res.data || [];
  },

  async addCustomer(data) {
    const res = await apiClient.post("/customers", data);
    return res.data;
  },

  // --- Domain 6: Purchasing ---
  async getVendors() {
    const res = await apiClient.get("/vendors");
    return res.data || [];
  },

  async addVendor(data) {
    const res = await apiClient.post("/vendors", data);
    return res.data;
  },

  async getPurchaseOrders(params = {}) {
    const res = await apiClient.get("/purchase-orders", { params });
    return res.data || [];
  },

  async addPurchaseOrder(data) {
    const res = await apiClient.post("/purchase-orders", data);
    return res.data;
  },

  // --- Domain 7: Inventory ---
  async getInventoryItems(params = {}) {
    const res = await apiClient.get("/inventory-items", { params });
    return res.data || [];
  },

  async addInventoryItem(data) {
    const res = await apiClient.post("/inventory-items", data);
    return res.data;
  },

  async getItemBrands() {
    const res = await apiClient.get("/item-brands");
    return res.data || [];
  },

  async addItemBrand(data) {
    const res = await apiClient.post("/item-brands", data);
    return res.data;
  },

  async getItemCategories() {
    const res = await apiClient.get("/item-categories");
    return res.data || [];
  },

  async addItemCategory(data) {
    const res = await apiClient.post("/item-categories", data);
    return res.data;
  },

  async getStockRequests(params = {}) {
    const res = await apiClient.get("/stock-requests", { params });
    return res.data || [];
  },

  async addStockRequest(data) {
    const res = await apiClient.post("/stock-requests", data);
    return res.data;
  },

  async getStockTransfers() {
    const res = await apiClient.get("/stock-transfers");
    return res.data || [];
  },

  async addStockTransfer(data) {
    const res = await apiClient.post("/stock-transfers", data);
    return res.data;
  },

  async getGoodsReceipts() {
    const res = await apiClient.get("/goods-receipts");
    return res.data || [];
  },

  async addGoodsReceipt(data) {
    const res = await apiClient.post("/goods-receipts", data);
    return res.data;
  },

  // --- Domain 8: Fixed Assets ---
  async getFixedAssets(params = {}) {
    const res = await apiClient.get("/fixed-assets", { params });
    return res.data || [];
  },

  async addFixedAsset(data) {
    const res = await apiClient.post("/fixed-assets", data);
    return res.data;
  },

  async getAssetCategories() {
    const res = await apiClient.get("/asset-categories");
    return res.data || [];
  },

  async addAssetCategory(data) {
    const res = await apiClient.post("/asset-categories", data);
    return res.data;
  },
};

// Also export as mockApi for seamless drop-in replacement across existing pages!
export const mockApi = api;

export default api;
