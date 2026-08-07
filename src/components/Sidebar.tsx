import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Network, 
  FileSpreadsheet, 
  ShieldCheck, 
  UserCheck, 
  Users,
  Building2,
  Sliders,
  LogOut,
  BookOpen,
  CreditCard,
  DollarSign,
  PieChart,
  ArrowLeftRight,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  Tag,
  ShoppingCart,
  Truck,
  Boxes,
  PackageCheck,
  CheckSquare,
  Bookmark,
  Layers,
  Building
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  roles: string[];
  badge?: number | null;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { currentUser, pendingApprovalsCount, logout, viewableSubmoduleCodes } = useAuth();
  const roleCode = currentUser?.roleCode || "SUPER_ADMIN";

  // Further restrict operational module items to submodules actually granted
  // via office_modules + role_submodule_permissions (see AuthContext).
  const filterByPermission = (items: MenuItem[]): MenuItem[] =>
    viewableSubmoduleCodes ? items.filter((i) => viewableSubmoduleCodes.has(i.id)) : items;

  // Superadmin only sees management & admin menus
  const allRoles = ["SUPER_ADMIN", "ADMIN_CABANG", "KADIV_KEUANGAN", "MANAGER_ANPER", "STAFF_ANPER", "STAFF_HOLDING", "DIREKSI_HOLDING"];
  // Operational modules are for NON-SUPERADMIN roles only
  const operationalRoles = ["ADMIN_CABANG", "KADIV_KEUANGAN", "MANAGER_ANPER", "STAFF_ANPER", "STAFF_HOLDING", "DIREKSI_HOLDING"];

  const menuUtama: MenuItem[] = [
    {
      id: "superadmin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: allRoles
    },
    {
      id: "superadmin/company-structure",
      label: "Struktur Company",
      icon: Network,
      roles: ["SUPER_ADMIN", "ADMIN_CABANG", "MANAGER_ANPER", "DIREKSI_HOLDING"]
    },
    {
      id: "superadmin/coa",
      label: "Chart of Accounts (COA)",
      icon: FileSpreadsheet,
      roles: ["SUPER_ADMIN", "KADIV_KEUANGAN", "STAFF_HOLDING", "STAFF_ANPER"]
    },
    {
      id: "superadmin/role-permissions",
      label: "Role & Hak Akses",
      icon: ShieldCheck,
      roles: ["SUPER_ADMIN", "ADMIN_CABANG"]
    }
  ];

  const modulPerusahaan: MenuItem[] = [
    { id: "perusahaan/profil", label: "Profil Perusahaan", icon: Building2, roles: operationalRoles },
    { id: "perusahaan/karyawan", label: "Data Karyawan", icon: Users, roles: operationalRoles },
    { id: "perusahaan/log-aktivitas", label: "Log Aktivitas Perusahaan", icon: History, roles: operationalRoles }
  ];

  const modulBukuBesar: MenuItem[] = [
    { id: "buku-besar/nomor-akun", label: "Nomor Akun (COA)", icon: FileSpreadsheet, roles: operationalRoles },
    { id: "buku-besar/pencatatan-beban", label: "Pencatatan Beban", icon: CreditCard, roles: operationalRoles },
    { id: "buku-besar/jurnal-umum", label: "Jurnal Umum", icon: BookOpen, roles: operationalRoles },
    { id: "buku-besar/anggaran", label: "Anggaran Keuangan", icon: DollarSign, roles: operationalRoles },
    { id: "buku-besar/monitoring-anggaran", label: "Monitoring Anggaran", icon: PieChart, roles: operationalRoles },
    { id: "buku-besar/transfer-anggaran", label: "Transfer Anggaran", icon: ArrowLeftRight, roles: operationalRoles },
    { id: "buku-besar/log-aktivitas", label: "Log Aktivitas Buku Besar", icon: History, roles: operationalRoles }
  ];

  const modulKasBank: MenuItem[] = [
    { id: "kas-bank/pembayaran", label: "Pembayaran", icon: ArrowUpRight, roles: operationalRoles },
    { id: "kas-bank/penerimaan", label: "Penerimaan", icon: ArrowDownLeft, roles: operationalRoles },
    { id: "kas-bank/transfer-bank", label: "Transfer Bank", icon: ArrowLeftRight, roles: operationalRoles },
    { id: "kas-bank/histori-bank", label: "Histori Bank", icon: History, roles: operationalRoles }
  ];

  const modulPenjualan: MenuItem[] = [
    { id: "penjualan/produk", label: "Produk", icon: ShoppingBag, roles: operationalRoles },
    { id: "penjualan/jenis-produk", label: "Jenis Produk", icon: Tag, roles: operationalRoles },
    { id: "penjualan/pelanggan", label: "Nasabah / Pelanggan", icon: Users, roles: operationalRoles },
    { id: "penjualan/log-aktivitas", label: "Log Aktivitas Penjualan", icon: History, roles: operationalRoles }
  ];

  const modulPembelian: MenuItem[] = [
    { id: "pembelian/pesanan-pembelian", label: "Pesanan Pembelian (PO)", icon: ShoppingCart, roles: operationalRoles },
    { id: "pembelian/pembayaran-pembelian", label: "Pembayaran Pembelian", icon: CreditCard, roles: operationalRoles },
    { id: "pembelian/pemasok", label: "Pemasok / Vendor", icon: Truck, roles: operationalRoles },
    { id: "pembelian/log-aktivitas", label: "Log Aktivitas Pembelian", icon: History, roles: operationalRoles }
  ];

  const modulPersediaan: MenuItem[] = [
    { id: "persediaan/permintaan-barang", label: "Permintaan Barang", icon: Boxes, roles: operationalRoles },
    { id: "persediaan/pemindahan-barang", label: "Pemindahan Barang", icon: ArrowLeftRight, roles: operationalRoles },
    { id: "persediaan/penyelesaian-pesanan", label: "Penyelesaian Pesanan", icon: PackageCheck, roles: operationalRoles },
    { id: "persediaan/barang-jasa", label: "Barang / Jasa", icon: CheckSquare, roles: operationalRoles },
    { id: "persediaan/merek-barang", label: "Merek Barang", icon: Bookmark, roles: operationalRoles },
    { id: "persediaan/kategori-barang", label: "Kategori Barang", icon: Layers, roles: operationalRoles },
    { id: "persediaan/log-aktivitas", label: "Log Aktivitas Persediaan", icon: History, roles: operationalRoles }
  ];

  const modulAsetTetap: MenuItem[] = [
    { id: "aset-tetap/aset", label: "Daftar Aset Tetap", icon: Building, roles: operationalRoles },
    { id: "aset-tetap/kategori-aset", label: "Kategori Aset", icon: Layers, roles: operationalRoles },
    { id: "aset-tetap/log-aktivitas", label: "Log Aktivitas Aset", icon: History, roles: operationalRoles }
  ];

  const officeConfigMenu: MenuItem[] = [
    { id: "superadmin/office-list", label: "Daftar Office", icon: Building2, roles: ["SUPER_ADMIN", "ADMIN_CABANG"] },
    { id: "superadmin/office-permissions", label: "Hak Akses Office", icon: Sliders, roles: ["SUPER_ADMIN"] }
  ];

  const administrasiUser: MenuItem[] = [
    { id: "superadmin/user-list", label: "Manajemen User", icon: Users, roles: ["SUPER_ADMIN", "ADMIN_CABANG", "KADIV_KEUANGAN", "MANAGER_ANPER", "DIREKSI_HOLDING"] },
    { id: "superadmin/user-approvals", label: "Persetujuan User", icon: UserCheck, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null, roles: ["SUPER_ADMIN", "ADMIN_CABANG", "KADIV_KEUANGAN", "MANAGER_ANPER"] }
  ];

  const filterMenus = (menuList: MenuItem[]): MenuItem[] =>
    menuList.filter((item) => item.roles.includes(roleCode));

  const renderMenuGroup = (title: string, items: MenuItem[]) => {
    const filtered = filterMenus(items);
    if (filtered.length === 0) return null;
    return (
      <div key={title}>
        <p className="px-3 text-[10px] font-bold text-emerald-400/70 tracking-widest uppercase mb-1.5">
          {title}
        </p>
        <nav className="space-y-0.5">
          {filtered.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium text-[12px] transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#00c885] text-white font-semibold shadow-md shadow-emerald-500/20"
                    : "text-emerald-100/60 hover:text-white hover:bg-emerald-900/40"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-[#03392a] text-white flex flex-col justify-between shrink-0 shadow-xl overflow-y-auto">
      {/* Brand Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-emerald-900/40 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#00c885] flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-emerald-500/20">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wide text-white leading-tight">
              APG FINANCE
            </h1>
            <p className="text-[9px] text-emerald-300 tracking-widest uppercase font-bold">
              ARDANA PERKASA GROUP
            </p>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="px-3 py-2 space-y-4">
          {renderMenuGroup("MENU UTAMA", menuUtama)}
          {renderMenuGroup("MODUL PERUSAHAAN", filterByPermission(modulPerusahaan))}
          {renderMenuGroup("MODUL BUKU BESAR", filterByPermission(modulBukuBesar))}
          {renderMenuGroup("MODUL KAS & BANK", filterByPermission(modulKasBank))}
          {renderMenuGroup("MODUL PENJUALAN", filterByPermission(modulPenjualan))}
          {renderMenuGroup("MODUL PEMBELIAN", filterByPermission(modulPembelian))}
          {renderMenuGroup("MODUL PERSEDIAAN", filterByPermission(modulPersediaan))}
          {renderMenuGroup("MODUL ASET TETAP", filterByPermission(modulAsetTetap))}
          {renderMenuGroup("KONFIGURASI OFFICE", officeConfigMenu)}
          {renderMenuGroup("ADMINISTRASI USER", administrasiUser)}
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-emerald-900/40 bg-[#022a1f]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
              alt="Avatar"
              className="w-9 h-9 rounded-full border-2 border-emerald-400 bg-emerald-950"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#022a1f]"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {currentUser?.name || "Super Admin"}
            </p>
            <span className="text-[10px] font-semibold text-emerald-300 truncate block">
              {currentUser?.roleName || "Super Admin"}
            </span>
          </div>
          <button
            onClick={logout}
            title="Keluar"
            className="p-1.5 rounded-lg text-emerald-300 hover:text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
