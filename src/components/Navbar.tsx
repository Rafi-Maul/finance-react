interface NavbarProps {
  activeTab: string;
}

export const Navbar = ({ activeTab }: NavbarProps) => {
  const getBreadcrumbAndTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return {
          category: "Dashboard / Ringkasan Utama",
          title: "Dashboard Keuangan & Operasional"
        };
      case "company-structure":
        return {
          category: "Master Data / Hierarki Entitas",
          title: "Struktur & Klasifikasi Company (Multi-Entitas)"
        };
      case "coa":
        return {
          category: "Master Data / Manajemen COA Central",
          title: "Chart of Accounts (COA) Standar Holding"
        };
      case "role-permissions":
        return {
          category: "Sistem & Keamanan / Manajemen Otorisasi",
          title: "Matriks Role, Permission & Lingkup Company"
        };
      case "user-list":
        return {
          category: "Administrasi User / Master User",
          title: "Daftar User & Detail Kredensial Sistem"
        };
      case "user-list":
        return {
          category: "Administrasi User / Manajemen Pengguna",
          title: "Daftar & Manajemen User Sistem"
        };
      case "office-list":
        return {
          category: "Konfigurasi Office / Manajemen Entitas",
          title: "Daftar Office & Entitas Perusahaan"
        };
      case "office-permissions":
        return {
          category: "Konfigurasi Office / Hak Akses Modul",
          title: "Pengaturan Hak Akses Modul per Office"
        };
      case "user-approvals":
        return {
          category: "Administrasi User / Verifikasi Otorisasi",
          title: "Persetujuan & Pengajuan Hak Akses User"
        };
      case "office-list":
        return {
          category: "Office Config / Master Office",
          title: "Daftar & Pengelolaan Office"
        };
      case "office-permissions":
        return {
          category: "Office Config / Otorisasi Fitur Office",
          title: "Pengaturan Hak Akses Modul per Office"
        };
      default:
        return {
          category: "Dashboard",
          title: "Dashboard Keuangan & Operasional"
        };
    }
  };

  const { category, title } = getBreadcrumbAndTitle();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Title & Breadcrumb */}
      <div>
        <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
          {category}
        </p>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          {title}
        </h2>
      </div>
    </header>
  );
};
