import { useState, useEffect } from "react";
import { AuthProvider, useAuth, LoginPage } from "./modules/shared/auth";
import { Sidebar, Navbar } from "./components/layout";
import { DashboardPage } from "./modules/shared/dashboard";
import { CompanyStructurePage } from "./modules/superadmin/company-structure";
import { CoaPage, CoaEntityListPage, CoaEntityConfigPage } from "./modules/holding-level/coa";
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

const getTabFromHash = (): string => {
  const raw = window.location.hash.replace(/^#\/?/, "").split("?")[0].trim();
  if (!raw) return "superadmin/dashboard";
  if (raw.startsWith("superadmin/") || isOperationalRoute(raw)) {
    return raw;
  }
  return `superadmin/${raw}`;
};

const AppContent = () => {
  const { currentUser, viewableSubmoduleCodes, permissionsLoaded } = useAuth();
  const [activeTab, setActiveTabState] = useState<string>(getTabFromHash);
  const [selectedOfficeForPermissions, setSelectedOfficeForPermissions] = useState<string | null>(null);
  const [selectedOfficeForEdit, setSelectedOfficeForEdit] = useState<string | null>(null);
  const [selectedEntityForConfig, setSelectedEntityForConfig] = useState<string | number | null>(null);

  // Synchronize activeTab with URL hash
  const setActiveTab = (tab: string): void => {
    const formattedTab = (tab.startsWith("superadmin/") || isOperationalRoute(tab))
      ? tab 
      : `superadmin/${tab}`;

    setActiveTabState(formattedTab);
    if (window.location.hash !== `#/${formattedTab}`) {
      window.location.hash = `/${formattedTab}`;
    }
  };

  // Sync state on hashchange events (browser back/forward or manual URL edit)
  useEffect(() => {
    const handleHashChange = () => {
      const currentTab = getTabFromHash();
      setActiveTabState(currentTab);
    };

    window.addEventListener("hashchange", handleHashChange);

    // Set initial hash if empty
    if (!window.location.hash) {
      window.location.hash = `/${activeTab}`;
    }

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

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
      "superadmin/coa",
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
        "superadmin/dashboard", "superadmin/coa", "superadmin/user-list", "superadmin/user-approvals",
        ...allowedOperationalRoutes
      ],
      MANAGER_ANPER: [
        "superadmin/dashboard", "superadmin/company-structure", "superadmin/user-list", "superadmin/user-approvals",
        ...allowedOperationalRoutes
      ],
      STAFF_ANPER: ["superadmin/dashboard", "superadmin/coa", ...allowedOperationalRoutes],
      STAFF_HOLDING: ["superadmin/dashboard", "superadmin/coa", ...allowedOperationalRoutes],
      DIREKSI_HOLDING: [
        "superadmin/dashboard", "superadmin/company-structure", "superadmin/user-list", "superadmin/user-approvals",
        ...allowedOperationalRoutes
      ]
    };

    const allowed = roleAccessMap[roleCode] || ["superadmin/dashboard", ...allowedOperationalRoutes];
    if (!allowed.includes(activeTab)) {
      setActiveTab(allowed[0]);
    }
  }, [currentUser, activeTab, permissionsLoaded, viewableSubmoduleCodes]);

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderContent = () => {
    if (activeTab.startsWith("perusahaan/")) return <PerusahaanModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;
    if (activeTab.startsWith("buku-besar/")) return <BukuBesarModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;
    if (activeTab.startsWith("kas-bank/")) return <KasBankModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;
    if (activeTab.startsWith("penjualan/")) return <PenjualanModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;
    if (activeTab.startsWith("pembelian/")) return <PembelianModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;
    if (activeTab.startsWith("persediaan/")) return <PersediaanModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;
    if (activeTab.startsWith("aset-tetap/")) return <AsetTetapModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;

    switch (activeTab) {
      case "superadmin/dashboard":
        return <DashboardPage />;
      case "superadmin/company-structure":
        return <CompanyStructurePage />;
      case "superadmin/coa":
        return <CoaPage />;
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

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden selection:bg-[#00c885] selection:text-white font-sans">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Right Main Body Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar activeTab={activeTab} />
        
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
