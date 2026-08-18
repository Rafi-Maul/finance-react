import { useState, useEffect } from "react";
import { AuthProvider, useAuth, LoginPage } from "./modules/shared/auth";
import { ToastProvider } from "./context/ToastContext";
import { Sidebar, Navbar, TabBar, type OpenTab } from "./components/layout";
import { DashboardPage } from "./modules/shared/dashboard";
import { CompanyStructurePage } from "./modules/superadmin/company-structure";
import { CoaEntityListPage, CoaEntityConfigPage } from "./modules/holding-level/coa";
import { RolePermissionsPage } from "./modules/superadmin/roles";
import { UserApprovalsPage } from "./modules/superadmin/user-approvals";
import { UserManagementPage } from "./modules/superadmin/user-management";
import { OfficeListPage, OfficePermissionsPage, OfficeEditPage } from "./modules/superadmin/office-config";
import { 
  PerusahaanModule, 
  BukuBesarModule,
  KasBankModule,
  PenjualanModule,
  PembelianModule,
  PersediaanModule,
  AsetTetapModule
} from "./modules/operational-unit";

const isOperationalRoute = (raw: string): boolean => {
  return (
    raw.startsWith("perusahaan/") ||
    raw.startsWith("buku-besar/") ||
    raw.startsWith("kas-bank/") ||
    raw.startsWith("penjualan/") ||
    raw.startsWith("pembelian/") ||
    raw.startsWith("persediaan/") ||
    raw.startsWith("aset-tetap/")
  );
};

const MAX_UNPINNED_TABS = 5;
const TABS_STORAGE_KEY = "apg_open_tabs";

const loadStoredTabs = (): OpenTab[] => {
  try {
    const raw = localStorage.getItem(TABS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getTabFromPath = (): string => {
  const raw = window.location.pathname.replace(/^\/+/, "").split("?")[0].trim();
  if (!raw) return "superadmin/dashboard";
  if (raw.startsWith("superadmin/") || isOperationalRoute(raw)) {
    return raw;
  }
  return `superadmin/${raw}`;
};

const AppContent = () => {
  const { currentUser, viewableSubmoduleCodes, permissionsLoaded } = useAuth();
  const [activeTab, setActiveTabState] = useState<string>(getTabFromPath);
  const [selectedOfficeForPermissions, setSelectedOfficeForPermissions] = useState<string | null>(null);
  const [selectedOfficeForEdit, setSelectedOfficeForEdit] = useState<string | null>(null);
  const [selectedEntityForConfig, setSelectedEntityForConfig] = useState<string | number | null>(null);
  // Seed with the current route so the very first render already has a tab to
  // show — the "open a tab" effect below only needs to handle later navigation.
  const [tabs, setTabs] = useState<OpenTab[]>(() => {
    const stored = loadStoredTabs();
    const initialTab = getTabFromPath();
    if (stored.some((t) => t.id === initialTab)) return stored;
    return [...stored, { id: initialTab, pinned: initialTab === "superadmin/dashboard" }];
  });
  // Tabs restored from localStorage are listed in the tab bar immediately, but
  // their content only mounts (and fetches) the first time they're actually
  // visited in this session — otherwise every restored tab would fire its data
  // fetch at once on cold load and flood the (single-threaded) dev API server.
  const [visitedTabIds, setVisitedTabIds] = useState<Set<string>>(() => new Set([getTabFromPath()]));

  // Synchronize activeTab with the URL path
  const setActiveTab = (tab: string): void => {
    const formattedTab = (tab.startsWith("superadmin/") || isOperationalRoute(tab))
      ? tab
      : `superadmin/${tab}`;

    setActiveTabState(formattedTab);
    const newPath = `/${formattedTab}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, "", newPath);
    }
  };

  // Sync state on browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getTabFromPath());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Persist open tabs so they survive a refresh
  useEffect(() => {
    localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabs));
  }, [tabs]);

  // Open a tab for the active route (if not already open). The dashboard tab is
  // always pinned. Beyond MAX_UNPINNED_TABS, the oldest unpinned tab is dropped —
  // ponytail: plain FIFO eviction, swap for real LRU (track last-visited time) if usage patterns show FIFO evicts tabs users still want.
  useEffect(() => {
    setTabs((prev) => {
      if (prev.some((t) => t.id === activeTab)) return prev;
      const next = [...prev, { id: activeTab, pinned: activeTab === "superadmin/dashboard" }];
      const unpinned = next.filter((t) => !t.pinned);
      if (unpinned.length > MAX_UNPINNED_TABS) {
        return next.filter((t) => t.id !== unpinned[0].id);
      }
      return next;
    });
    setVisitedTabIds((prev) => (prev.has(activeTab) ? prev : new Set(prev).add(activeTab)));
  }, [activeTab]);

  const closeTab = (id: string) => {
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    setVisitedTabIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (id === activeTab) {
      setActiveTab(remaining[remaining.length - 1]?.id || "superadmin/dashboard");
    }
  };

  const togglePinTab = (id: string) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)));
  };

  // Operational unit routes accessible to all non-superadmin and superadmin roles
  const operationalRoutes = [
    "perusahaan/profil", "perusahaan/karyawan", "perusahaan/log-aktivitas",
    "buku-besar/nomor-akun", "buku-besar/pencatatan-beban", "buku-besar/jurnal-umum", "buku-besar/anggaran", "buku-besar/monitoring-anggaran", "buku-besar/transfer-anggaran", "buku-besar/log-aktivitas",
    "kas-bank/pembayaran", "kas-bank/penerimaan", "kas-bank/transfer-bank", "kas-bank/histori-bank",
    "penjualan/produk", "penjualan/jenis-produk", "penjualan/pelanggan", "penjualan/log-aktivitas",
    "pembelian/pesanan-pembelian", "pembelian/pembayaran-pembelian", "pembelian/pemasok", "pembelian/log-aktivitas",
    "persediaan/permintaan-barang", "persediaan/pemindahan-barang", "persediaan/penyelesaian-pesanan", "persediaan/barang-jasa", "persediaan/merek-barang", "persediaan/kategori-barang", "persediaan/log-aktivitas",
    "aset-tetap/aset", "aset-tetap/kategori-aset", "aset-tetap/log-aktivitas"
  ];

  // Handle role-based menu availability
  useEffect(() => {
    if (!currentUser || !permissionsLoaded) return;
    const roleCode = currentUser.roleCode;

    // Further restrict operational routes to submodules granted via
    // office_modules + role_submodule_permissions (see AuthContext).
    const allowedOperationalRoutes = viewableSubmoduleCodes
      ? operationalRoutes.filter((r) => viewableSubmoduleCodes.has(r))
      : operationalRoutes;

    const superAdminRoutes = [
      "superadmin/dashboard",
      "superadmin/company-structure",
      "superadmin/coa-entities",
      "superadmin/coa-entity-config",
      "superadmin/role-permissions",
      "superadmin/user-list",
      "superadmin/user-approvals",
      "superadmin/office-list",
      "superadmin/office-permissions",
      "superadmin/office-edit"
    ];

    const roleAccessMap: Record<string, string[]> = {
      SUPER_ADMIN: superAdminRoutes,
      ADMIN_CABANG: [
        "superadmin/dashboard", "superadmin/company-structure", "superadmin/role-permissions", "superadmin/user-list", "superadmin/user-approvals", "superadmin/office-list",
        ...allowedOperationalRoutes
      ],
      KADIV_KEUANGAN: [
        "superadmin/dashboard", "superadmin/user-list", "superadmin/user-approvals",
        ...allowedOperationalRoutes
      ],
      MANAGER_ANPER: [
        "superadmin/dashboard", "superadmin/company-structure", "superadmin/user-list", "superadmin/user-approvals",
        ...allowedOperationalRoutes
      ],
      STAFF_ANPER: ["superadmin/dashboard", ...allowedOperationalRoutes],
      STAFF_HOLDING: ["superadmin/dashboard", ...allowedOperationalRoutes],
      DIREKSI_HOLDING: [
        "superadmin/dashboard", "superadmin/company-structure", "superadmin/user-list", "superadmin/user-approvals",
        ...allowedOperationalRoutes
      ]
    };

    const allowed = roleAccessMap[roleCode] || ["superadmin/dashboard", ...allowedOperationalRoutes];
    if (!allowed.includes(activeTab)) {
      setActiveTab(allowed[0]);
    }
    setTabs((prev) => prev.filter((t) => allowed.includes(t.id)));
    setVisitedTabIds((prev) => new Set([...prev].filter((id) => allowed.includes(id))));
  }, [currentUser, activeTab, permissionsLoaded, viewableSubmoduleCodes]);

  if (!currentUser) {
    return <LoginPage />;
  }

  // Renders the page for a given tab id (not necessarily the active one — every
  // open tab stays mounted, see the `tabs.map` below, so switching tabs doesn't
  // lose scroll position, form state, or re-trigger data fetches).
  const renderTabContent = (tabId: string) => {
    if (tabId.startsWith("perusahaan/")) return <PerusahaanModule activeSubTab={tabId} onSubTabChange={setActiveTab} />;
    if (tabId.startsWith("buku-besar/")) return <BukuBesarModule activeSubTab={tabId} onSubTabChange={setActiveTab} />;
    if (tabId.startsWith("kas-bank/")) return <KasBankModule activeSubTab={tabId} onSubTabChange={setActiveTab} />;
    if (tabId.startsWith("penjualan/")) return <PenjualanModule activeSubTab={tabId} onSubTabChange={setActiveTab} />;
    if (tabId.startsWith("pembelian/")) return <PembelianModule activeSubTab={tabId} onSubTabChange={setActiveTab} />;
    if (tabId.startsWith("persediaan/")) return <PersediaanModule activeSubTab={tabId} onSubTabChange={setActiveTab} />;
    if (tabId.startsWith("aset-tetap/")) return <AsetTetapModule activeSubTab={tabId} onSubTabChange={setActiveTab} />;

    switch (tabId) {
      case "superadmin/dashboard":
        return <DashboardPage />;
      case "superadmin/company-structure":
        return <CompanyStructurePage />;
      case "superadmin/coa-entities":
        return (
          <CoaEntityListPage
            onNavigateToConfig={(entityId: string | number) => {
              setSelectedEntityForConfig(entityId);
              setActiveTab("superadmin/coa-entity-config");
            }}
          />
        );
      case "superadmin/coa-entity-config":
        return <CoaEntityConfigPage initialEntityId={selectedEntityForConfig} />;
      case "superadmin/role-permissions":
        return <RolePermissionsPage />;
      case "superadmin/user-list":
        return <UserManagementPage />;
      case "superadmin/user-approvals":
        return <UserApprovalsPage />;
      case "superadmin/office-list":
        return (
          <OfficeListPage
            onNavigateToPermissions={(officeId: string) => {
              setSelectedOfficeForPermissions(officeId);
              setActiveTab("superadmin/office-permissions");
            }}
            onNavigateToEdit={(officeId: string) => {
              setSelectedOfficeForEdit(officeId);
              setActiveTab("superadmin/office-edit");
            }}
          />
        );
      case "superadmin/office-permissions":
        return <OfficePermissionsPage initialOfficeId={selectedOfficeForPermissions} />;
      case "superadmin/office-edit":
        return (
          <OfficeEditPage
            officeId={selectedOfficeForEdit}
            onDone={() => setActiveTab("superadmin/office-list")}
          />
        );
      default:
        return <DashboardPage />;
    }
  };

  // A handful of tabs are opened with a specific target (which entity/office to
  // preload) captured only at mount time. Re-keying on that target forces a fresh
  // mount when the user navigates to a *different* target while the tab is
  // already open — every other tab keeps a stable key so it never remounts.
  const getTabMountKey = (tabId: string): string => {
    if (tabId === "superadmin/coa-entity-config") return `${tabId}:${selectedEntityForConfig ?? ""}`;
    if (tabId === "superadmin/office-permissions") return `${tabId}:${selectedOfficeForPermissions ?? ""}`;
    if (tabId === "superadmin/office-edit") return `${tabId}:${selectedOfficeForEdit ?? ""}`;
    return tabId;
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden selection:bg-[#00c885] selection:text-white font-sans">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Right Main Body Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar activeTab={activeTab} />
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onSelect={setActiveTab}
          onClose={closeTab}
          onTogglePin={togglePinTab}
        />

        <main className="flex-1 overflow-y-auto">
          {tabs.filter((tab) => visitedTabIds.has(tab.id)).map((tab) => (
            <div key={getTabMountKey(tab.id)} className={tab.id === activeTab ? "" : "hidden"}>
              {renderTabContent(tab.id)}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
