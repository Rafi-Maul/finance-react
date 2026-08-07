// Mock data for APG Finance System

export const SYSTEM_MODULES = [
  {
    id: "MOD_PENGATURAN",
    name: "Pengaturan Sistem (Superadmin)",
    description: "Konfigurasi umum, otorisasi role, audit trail, dan preferensi sistem",
    subModules: [
      { id: "SUB_PENGATURAN_UMUM", name: "Pengaturan Umum", code: "settings-general", permissions: ["Lihat", "Edit"] },
      { id: "SUB_ROLE_PERMISSIONS", name: "Peran & Permission", code: "role-permissions", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_AUDIT_TRAIL", name: "Audit Trail & Log", code: "audit-trail", permissions: ["Lihat", "Export"] }
    ]
  },
  {
    id: "MOD_PERUSAHAAN",
    name: "Modul Perusahaan",
    description: "Profil perusahaan, data karyawan beserta role, dan log aktivitas internal",
    subModules: [
      { id: "SUB_PERUSAHAAN_PROFIL", name: "Profil Perusahaan", code: "perusahaan/profil", permissions: ["Lihat", "Edit"] },
      { id: "SUB_PERUSAHAAN_KARYAWAN", name: "Data Karyawan", code: "perusahaan/karyawan", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PERUSAHAAN_LOG", name: "Log Aktivitas Perusahaan", code: "perusahaan/log-aktivitas", permissions: ["Lihat", "Export"] }
    ]
  },
  {
    id: "MOD_BUKU_BESAR",
    name: "Modul Buku Besar",
    description: "Nomor akun (COA), pencatatan beban, jurnal umum, anggaran, monitoring, transfer anggaran, & log",
    subModules: [
      { id: "SUB_BUKU_BESAR_NOMOR_AKUN", name: "Nomor Akun (COA)", code: "buku-besar/nomor-akun", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_BUKU_BESAR_PENCATATAN_BEBAN", name: "Pencatatan Beban", code: "buku-besar/pencatatan-beban", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_BUKU_BESAR_JURNAL_UMUM", name: "Jurnal Umum", code: "buku-besar/jurnal-umum", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_BUKU_BESAR_ANGGARAN", name: "Anggaran Keuangan", code: "buku-besar/anggaran", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_BUKU_BESAR_MONITORING_ANGGARAN", name: "Monitoring Anggaran", code: "buku-besar/monitoring-anggaran", permissions: ["Lihat", "Export"] },
      { id: "SUB_BUKU_BESAR_TRANSFER_ANGGARAN", name: "Transfer Anggaran", code: "buku-besar/transfer-anggaran", permissions: ["Lihat", "Tambah", "Edit"] },
      { id: "SUB_BUKU_BESAR_LOG", name: "Log Aktivitas Buku Besar", code: "buku-besar/log-aktivitas", permissions: ["Lihat", "Export"] }
    ]
  },
  {
    id: "MOD_KAS_BANK",
    name: "Modul Kas dan Bank",
    description: "List pembayaran, list penerimaan, transfer antar bank, & histori mutasi bank",
    subModules: [
      { id: "SUB_KAS_BANK_PEMBAYARAN", name: "Pembayaran", code: "kas-bank/pembayaran", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_KAS_BANK_PENERIMAAN", name: "Penerimaan", code: "kas-bank/penerimaan", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_KAS_BANK_TRANSFER", name: "Transfer Bank", code: "kas-bank/transfer-bank", permissions: ["Lihat", "Tambah", "Edit"] },
      { id: "SUB_KAS_BANK_HISTORI", name: "Histori Bank", code: "kas-bank/histori-bank", permissions: ["Lihat", "Export"] }
    ]
  },
  {
    id: "MOD_PENJUALAN",
    name: "Modul Penjualan",
    description: "List produk, jenis produk, data nasabah/pelanggan, & log aktivitas penjualan",
    subModules: [
      { id: "SUB_PENJUALAN_PRODUK", name: "Produk", code: "penjualan/produk", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PENJUALAN_JENIS_PRODUK", name: "Jenis Produk", code: "penjualan/jenis-produk", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PENJUALAN_PELANGGAN", name: "Nasabah / Pelanggan", code: "penjualan/pelanggan", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PENJUALAN_LOG", name: "Log Aktivitas Penjualan", code: "penjualan/log-aktivitas", permissions: ["Lihat", "Export"] }
    ]
  },
  {
    id: "MOD_PEMBELIAN",
    name: "Modul Pembelian",
    description: "Pesanan pembelian (PO), pembayaran pembelian, data pemasok/vendor, & log aktivitas",
    subModules: [
      { id: "SUB_PEMBELIAN_PO", name: "Pesanan Pembelian (PO)", code: "pembelian/pesanan-pembelian", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PEMBELIAN_PEMBAYARAN", name: "Pembayaran Pembelian", code: "pembelian/pembayaran-pembelian", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PEMBELIAN_PEMASOK", name: "Pemasok / Vendor", code: "pembelian/pemasok", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PEMBELIAN_LOG", name: "Log Aktivitas Pembelian", code: "pembelian/log-aktivitas", permissions: ["Lihat", "Export"] }
    ]
  },
  {
    id: "MOD_PERSEDIAAN",
    name: "Modul Persediaan",
    description: "Permintaan barang, pemindahan barang, penyelesaian pesanan, barang/jasa, merek, kategori, & log",
    subModules: [
      { id: "SUB_PERSEDIAAN_PERMINTAAN", name: "Permintaan Barang", code: "persediaan/permintaan-barang", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PERSEDIAAN_PEMINDAHAN", name: "Pemindahan Barang", code: "persediaan/pemindahan-barang", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PERSEDIAAN_PENYELESAIAN", name: "Penyelesaian Pesanan", code: "persediaan/penyelesaian-pesanan", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PERSEDIAAN_BARANG_JASA", name: "Barang / Jasa", code: "persediaan/barang-jasa", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PERSEDIAAN_MEREK", name: "Merek Barang", code: "persediaan/merek-barang", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PERSEDIAAN_KATEGORI", name: "Kategori Barang", code: "persediaan/kategori-barang", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_PERSEDIAAN_LOG", name: "Log Aktivitas Persediaan", code: "persediaan/log-aktivitas", permissions: ["Lihat", "Export"] }
    ]
  },
  {
    id: "MOD_ASET_TETAP",
    name: "Modul Aset Tetap",
    description: "Daftar inventaris aset tetap, kategori penyusutan, & log aktivitas aset",
    subModules: [
      { id: "SUB_ASET_TETAP_LIST", name: "Daftar Aset Tetap", code: "aset-tetap/aset", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_ASET_TETAP_KATEGORI", name: "Kategori Aset", code: "aset-tetap/kategori-aset", permissions: ["Lihat", "Tambah", "Edit", "Hapus"] },
      { id: "SUB_ASET_TETAP_LOG", name: "Log Aktivitas Aset", code: "aset-tetap/log-aktivitas", permissions: ["Lihat", "Export"] }
    ]
  }
];

export const INITIAL_ROLES = [
  {
    id: "role-1",
    role: "Super Admin",
    code: "SUPER_ADMIN",
    scope: "Seluruh Sistem",
    permissions: "Mengelola teknis, user, role, permission & company master",
    restrictions: "Tidak dapat menjalankan transaksi bisnis keuangan",
    badgeColor: "bg-[#00c885] text-white border-emerald-500 font-bold"
  },
  {
    id: "role-2",
    role: "Direksi Holding",
    code: "DIREKSI_HOLDING",
    scope: "Holding & seluruh unit di bawah",
    permissions: "Melihat seluruh laporan keuangan konsolidasi grup",
    restrictions: "Tidak melakukan input/perubahan transaksi",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300"
  },
  {
    id: "role-3",
    role: "Kadiv Keuangan",
    code: "KADIV_KEUANGAN",
    scope: "Holding & Seluruh Anper",
    permissions: "Menyetujui akun baru COA, Menutup Periode, Melihat laporan seluruh Anak Perusahaan",
    restrictions: "Tidak mengubah konfigurasi teknis sistem",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300"
  },
  {
    id: "role-4",
    role: "Direksi Anper",
    code: "MANAGER_ANPER",
    scope: "Anper tempat terdaftar",
    permissions: "Melihat laporan keuangan Anper sendiri",
    restrictions: "Tidak dapat melihat laporan Anper lain",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300"
  },
  {
    id: "role-5",
    role: "Staff Holding",
    code: "STAFF_HOLDING",
    scope: "Holding & Anper sesuai wewenang",
    permissions: "Mengajukan penambahan akun & melihat laporan Anper",
    restrictions: "Penambahan akun butuh approval Kadiv",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-300"
  },
  {
    id: "role-6",
    role: "Staff Anper",
    code: "STAFF_ANPER",
    scope: "Anper tempat terdaftar",
    permissions: "Mengajukan penambahan akun & data Anper sendiri",
    restrictions: "Isolasi ketat: tidak dapat akses Anper lain",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300"
  },
  {
    id: "role-7",
    role: "Admin Cabang",
    code: "ADMIN_CABANG",
    scope: "Cabang tertentu",
    permissions: "Mengelola user & administratif internal cabang",
    restrictions: "Tidak dapat jalankan transaksi keuangan",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300"
  }
];

export const OFFICE_TYPES = [
  { key: "Holding", label: "Holding", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { key: "Office", label: "Office", badge: "bg-blue-100 text-blue-800 border-blue-300" },
  { key: "Office Branch", label: "Office Branch (Cabang)", badge: "bg-purple-100 text-purple-800 border-purple-300" },
  { key: "Office KCL", label: "Office KCL (Unit KCL)", badge: "bg-amber-100 text-amber-800 border-amber-300" },
  { key: "Office Sub-KCL", label: "Office Sub-KCL (Anak Unit KCL)", badge: "bg-rose-100 text-rose-800 border-rose-300" }
];

export const INITIAL_ENTITIES = [
  {
    id: "ent-1",
    code: "OFF-0",
    name: "PT Ardana Perkasa Group",
    type: "Holding",
    typeClass: "Holding (Induk)",
    parent: "- (Top Level)",
    parentId: null,
    reportAccess: "Konsolidasi Seluruh Grup",
    status: "Aktif",
    badgeType: "emerald"
  },
  {
    id: "ent-2",
    code: "OFF-1",
    name: "PT Buana Perkasa Rajanegara",
    type: "Office",
    typeClass: "Anak Perusahaan (Main Anper)",
    parent: "PT Ardana Perkasa Group (OFF-0)",
    parentId: "ent-1",
    reportAccess: "Anper & Cabang Sendiri",
    status: "Aktif",
    badgeType: "blue"
  },
  {
    id: "ent-3",
    code: "OFF-2",
    name: "PT Dwi Kusuma Perkasa",
    type: "Office",
    typeClass: "Anak Perusahaan (Main Anper)",
    parent: "PT Ardana Perkasa Group (OFF-0)",
    parentId: "ent-1",
    reportAccess: "Anper Sendiri",
    status: "Aktif",
    badgeType: "blue"
  },
  {
    id: "ent-4",
    code: "OFF-3",
    name: "PT Caraka Mulia",
    type: "Office",
    typeClass: "Anak Perusahaan (Main Anper)",
    parent: "PT Ardana Perkasa Group (OFF-0)",
    parentId: "ent-1",
    reportAccess: "Anper Sendiri",
    status: "Aktif",
    badgeType: "blue"
  },
  {
    id: "ent-5",
    code: "OFF-4",
    name: "PRADA Badminton Club",
    type: "Office",
    typeClass: "Anak Perusahaan (Main Anper)",
    parent: "PT Ardana Perkasa Group (OFF-0)",
    parentId: "ent-1",
    reportAccess: "Anper Sendiri",
    status: "Aktif",
    badgeType: "blue"
  },
  {
    id: "ent-6",
    code: "OFF-1.1",
    name: "Cabang Jakarta Pusat",
    type: "Office Branch",
    typeClass: "Cabang Operasional",
    parent: "PT Buana Perkasa Rajanegara (OFF-1)",
    parentId: "ent-2",
    reportAccess: "Terbatas Cabang",
    status: "Aktif",
    badgeType: "blue"
  },
  {
    id: "ent-7",
    code: "OFF-1.2",
    name: "Cabang Surabaya",
    type: "Office Branch",
    typeClass: "Cabang Operasional",
    parent: "PT Buana Perkasa Rajanegara (OFF-1)",
    parentId: "ent-2",
    reportAccess: "Terbatas Cabang",
    status: "Aktif",
    badgeType: "blue"
  },
  {
    id: "ent-8",
    code: "OFF-2.1",
    name: "KCL Hub West Java",
    type: "Office KCL",
    typeClass: "KCL (Internal Unit)",
    parent: "PT Dwi Kusuma Perkasa (OFF-2)",
    parentId: "ent-3",
    reportAccess: "Terbatas Unit KCL",
    status: "Aktif",
    badgeType: "purple"
  },
  {
    id: "ent-9",
    code: "OFF-1.1.1",
    name: "Sub-KCL Harmoni",
    type: "Office Sub-KCL",
    typeClass: "Sub-Unit KCL Operasional",
    parent: "Cabang Jakarta Pusat (OFF-1.1)",
    parentId: "ent-6",
    reportAccess: "Terbatas Sub-KCL",
    status: "Aktif",
    badgeType: "rose"
  }
];

// Level 1: Office -> Active High-Level Modules Config
export const INITIAL_OFFICE_MODULES = {
  "ent-1": ["MOD_PENGATURAN", "MOD_PERUSAHAAN", "MOD_BUKU_BESAR", "MOD_KAS_BANK", "MOD_PENJUALAN", "MOD_PEMBELIAN", "MOD_PERSEDIAAN", "MOD_ASET_TETAP"],
  "ent-2": ["MOD_PERUSAHAAN", "MOD_BUKU_BESAR", "MOD_KAS_BANK", "MOD_PENJUALAN", "MOD_PEMBELIAN", "MOD_PERSEDIAAN", "MOD_ASET_TETAP"],
  "ent-3": ["MOD_PERUSAHAAN", "MOD_BUKU_BESAR", "MOD_KAS_BANK", "MOD_PENJUALAN", "MOD_PEMBELIAN"],
  "ent-4": ["MOD_PERUSAHAAN", "MOD_BUKU_BESAR", "MOD_PENJUALAN", "MOD_PEMBELIAN"],
  "ent-5": ["MOD_PERUSAHAAN", "MOD_BUKU_BESAR", "MOD_KAS_BANK", "MOD_PERSEDIAAN"],
  "ent-6": ["MOD_PERUSAHAAN", "MOD_KAS_BANK", "MOD_PENJUALAN", "MOD_PEMBELIAN"],
  "ent-7": ["MOD_KAS_BANK", "MOD_PENJUALAN"],
  "ent-8": ["MOD_KAS_BANK"],
  "ent-9": ["MOD_KAS_BANK"]
};

// Level 3: Role -> Assigned Granular SubModule Permissions Catalog
export const INITIAL_ROLE_SUBMODULES = {
  "SUPER_ADMIN": [
    "SUB_PENGATURAN_UMUM", "SUB_ROLE_PERMISSIONS", "SUB_AUDIT_TRAIL"
  ],
  "KADIV_KEUANGAN": [
    "SUB_BUKU_BESAR_NOMOR_AKUN", "SUB_BUKU_BESAR_JURNAL_UMUM", "SUB_BUKU_BESAR_ANGGARAN", "SUB_BUKU_BESAR_MONITORING_ANGGARAN", "SUB_BUKU_BESAR_TRANSFER_ANGGARAN",
    "SUB_KAS_BANK_PEMBAYARAN", "SUB_KAS_BANK_PENERIMAAN", "SUB_KAS_BANK_TRANSFER", "SUB_KAS_BANK_HISTORI",
    "SUB_PENJUALAN_PRODUK", "SUB_PEMBELIAN_PO", "SUB_ASET_TETAP_LIST"
  ],
  "DIREKSI_HOLDING": [
    "SUB_PERUSAHAAN_PROFIL", "SUB_PERUSAHAAN_KARYAWAN", "SUB_BUKU_BESAR_MONITORING_ANGGARAN", "SUB_PENJUALAN_PRODUK"
  ],
  "STAFF_HOLDING": [
    "SUB_BUKU_BESAR_NOMOR_AKUN", "SUB_BUKU_BESAR_JURNAL_UMUM", "SUB_KAS_BANK_PEMBAYARAN"
  ],
  "MANAGER_ANPER": [
    "SUB_PERUSAHAAN_PROFIL", "SUB_PERUSAHAAN_KARYAWAN", "SUB_PERUSAHAAN_LOG",
    "SUB_BUKU_BESAR_PENCATATAN_BEBAN", "SUB_BUKU_BESAR_ANGGARAN",
    "SUB_PENJUALAN_PRODUK", "SUB_PEMBELIAN_PO", "SUB_PERSEDIAAN_BARANG_JASA"
  ],
  "STAFF_ANPER": [
    "SUB_PERUSAHAAN_PROFIL", "SUB_BUKU_BESAR_PENCATATAN_BEBAN", "SUB_KAS_BANK_PEMBAYARAN", "SUB_PENJUALAN_PRODUK", "SUB_PERSEDIAAN_BARANG_JASA"
  ],
  "ADMIN_CABANG": [
    "SUB_PERUSAHAAN_KARYAWAN", "SUB_KAS_BANK_PEMBAYARAN", "SUB_PENJUALAN_PELANGGAN", "SUB_PERSEDIAAN_PERMINTAAN"
  ]
};

export const INITIAL_COA = [
  {
    code: "100000",
    name: "ASET (ASSET)",
    type: "ASET",
    typeBadge: "bg-emerald-100 text-emerald-800",
    category: "Neraca (Balance Sheet)",
    level: 1,
    balance: "Rp 5.450.000.000"
  },
  {
    code: "110000",
    name: "ASET LANCAR (CURRENT ASSET)",
    type: "ASET",
    typeBadge: "bg-emerald-100 text-emerald-800",
    category: "Neraca (Balance Sheet)",
    level: 2,
    balance: "Rp 1.250.000.000"
  },
  {
    code: "111000",
    name: "Kas & Setara Kas",
    type: "ASET",
    typeBadge: "bg-emerald-100 text-emerald-800",
    category: "Neraca (Balance Sheet)",
    level: 3,
    balance: "Rp 450.000.000"
  },
  {
    code: "200000",
    name: "LIABILITAS (LIABILITY)",
    type: "LIABILITAS",
    typeBadge: "bg-red-100 text-red-800",
    category: "Neraca (Balance Sheet)",
    level: 1,
    balance: "Rp 1.200.000.000"
  },
  {
    code: "300000",
    name: "EKUITAS (EQUITY)",
    type: "EKUITAS",
    typeBadge: "bg-blue-100 text-blue-800",
    category: "Neraca (Balance Sheet)",
    level: 1,
    balance: "Rp 4.250.000.000"
  },
  {
    code: "400000",
    name: "PENDAPATAN (REVENUE)",
    type: "PENDAPATAN",
    typeBadge: "bg-[#00c885] text-white",
    category: "Laba Rugi (Income Statement)",
    level: 1,
    balance: "Rp 2.850.000.000"
  },
  {
    code: "500000",
    name: "BEBAN (EXPENSE)",
    type: "BEBAN",
    typeBadge: "bg-purple-100 text-purple-800",
    category: "Laba Rugi (Income Statement)",
    level: 1,
    balance: "Rp 850.000.000"
  }
];

export const INITIAL_USERS = [
  {
    id: "u-1",
    username: "superadmin",
    name: "Super Admin Global",
    roleCode: "SUPER_ADMIN",
    roleName: "Super Admin",
    email: "admin@apgfinance.com",
    phone: "+62 811-0000-1111",
    company: "PT Ardana Perkasa Group",
    officeId: "ent-1",
    officeCode: "OFF-0",
    status: "Aktif",
    joinDate: "01 Jan 2024",
    lastLogin: "29 Jul 2026, 14:30 WIB",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin"
  },
  {
    id: "u-2",
    username: "muhammad.firdaus",
    name: "Muhammad Firdaus",
    roleCode: "DIREKSI_HOLDING",
    roleName: "Direksi Holding",
    email: "muhammad.firdaus@apgfinance.com",
    phone: "+62 812-1111-2222",
    company: "PT Ardana Perkasa Group",
    officeId: "ent-1",
    officeCode: "OFF-0",
    status: "Aktif",
    joinDate: "15 Jan 2024",
    lastLogin: "29 Jul 2026, 10:15 WIB",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Firdaus"
  },
  {
    id: "u-3",
    username: "yeliza.kadiv",
    name: "Yeliza",
    roleCode: "KADIV_KEUANGAN",
    roleName: "Kadiv Keuangan",
    email: "yeliza@apgfinance.com",
    phone: "+62 813-2222-3333",
    company: "PT Ardana Perkasa Group",
    officeId: "ent-1",
    officeCode: "OFF-0",
    status: "Aktif",
    joinDate: "01 Feb 2024",
    lastLogin: "29 Jul 2026, 13:45 WIB",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yeliza"
  },
  {
    id: "u-4",
    username: "hendra.staffhold",
    name: "Hendra Wijaya",
    roleCode: "STAFF_HOLDING",
    roleName: "Staff Holding",
    email: "hendra.wijaya@apgfinance.com",
    phone: "+62 814-3333-4444",
    company: "PT Ardana Perkasa Group",
    officeId: "ent-1",
    officeCode: "OFF-0",
    status: "Aktif",
    joinDate: "10 Feb 2024",
    lastLogin: "28 Jul 2026, 16:20 WIB",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra"
  },
  {
    id: "u-5",
    username: "chrisnia.bpr",
    name: "Chrisnia Nurbaiti",
    roleCode: "MANAGER_ANPER",
    roleName: "Direksi Anper",
    email: "chrisnia.nurbaiti@buana.co.id",
    phone: "+62 815-4444-5555",
    company: "PT Buana Perkasa Rajanegara",
    officeId: "ent-2",
    officeCode: "OFF-1",
    status: "Aktif",
    joinDate: "01 Mar 2024",
    lastLogin: "29 Jul 2026, 11:10 WIB",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chrisnia"
  },
  {
    id: "u-6",
    username: "dewi.bpr",
    name: "Dewi Lestari",
    roleCode: "STAFF_ANPER",
    roleName: "Staff Anper",
    email: "dewi.lestari@buana.co.id",
    phone: "+62 816-5555-6666",
    company: "PT Buana Perkasa Rajanegara",
    officeId: "ent-2",
    officeCode: "OFF-1",
    status: "Aktif",
    joinDate: "15 Mar 2024",
    lastLogin: "29 Jul 2026, 09:30 WIB",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi"
  }
];

export const INITIAL_APPROVALS = [
  {
    id: "app-101",
    user: "Bambang Kurniawan",
    email: "bambang@prada.co.id",
    company: "PRADA Badminton Club",
    requestedRole: "Staff Anper",
    date: "28 Jul 2026",
    status: "Pending",
    type: "Registrasi User Baru"
  },
  {
    id: "app-102",
    user: "Rina Sugiarto",
    email: "rina@buana.co.id",
    company: "PT Buana Perkasa Rajanegara",
    requestedRole: "Admin Cabang",
    date: "29 Jul 2026",
    status: "Pending",
    type: "Registrasi User Baru"
  },
  {
    id: "app-103",
    user: "Ahmad Fauzi",
    email: "ahmad@dwikusuma.co.id",
    company: "PT Dwi Kusuma Perkasa",
    requestedRole: "Staff Holding",
    date: "29 Jul 2026",
    status: "Pending",
    type: "Permohonan COA Akun Baru"
  }
];

export function getStoredData<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    const parsed = JSON.parse(data);

    // Validate if keys in parsed data match current system module IDs
    if (key === "apg_office_modules") {
      const validIds = SYSTEM_MODULES.map((m) => m.id);
      const ent1 = parsed["ent-1"] || [];
      const isOutdated = ent1.some((id: string) => !validIds.includes(id));
      if (isOutdated) {
        localStorage.removeItem(key);
        return fallback;
      }
    }

    if (key === "apg_role_submodules") {
      const validSubIds = SYSTEM_MODULES.flatMap((m) => m.subModules.map((s) => s.id));
      const superAdminSub = parsed["SUPER_ADMIN"] || [];
      const isOutdated = superAdminSub.some((id: string) => !validSubIds.includes(id));
      if (isOutdated) {
        localStorage.removeItem(key);
        return fallback;
      }
    }

    return parsed;
  } catch {
    return fallback;
  }
}

export function setStoredData(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Storage save failed", e);
  }
}
