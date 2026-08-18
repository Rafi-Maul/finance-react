// Display labels for the browser-style tab bar, keyed by route id.
// Mirrors the labels used in Sidebar.tsx menu items.
export const TAB_LABELS: Record<string, string> = {
  "superadmin/dashboard": "Dashboard",
  "superadmin/company-structure": "Struktur Company",
  "superadmin/coa-entities": "Entitas / Anak Perusahaan",
  "superadmin/coa-entity-config": "Konfigurasi Nomor Akun per Office",
  "superadmin/role-permissions": "Role & Hak Akses",
  "superadmin/user-list": "Manajemen User",
  "superadmin/user-approvals": "Persetujuan User",
  "superadmin/office-list": "Daftar Office",
  "superadmin/office-permissions": "Hak Akses Office",
  "superadmin/office-edit": "Edit Office",

  "perusahaan/profil": "Profil Perusahaan",
  "perusahaan/karyawan": "Data Karyawan",
  "perusahaan/log-aktivitas": "Log Aktivitas Perusahaan",

  "buku-besar/nomor-akun": "Nomor Akun (COA)",
  "buku-besar/pencatatan-beban": "Pencatatan Beban",
  "buku-besar/jurnal-umum": "Jurnal Umum",
  "buku-besar/anggaran": "Anggaran Keuangan",
  "buku-besar/monitoring-anggaran": "Monitoring Anggaran",
  "buku-besar/transfer-anggaran": "Transfer Anggaran",
  "buku-besar/log-aktivitas": "Log Aktivitas Buku Besar",

  "kas-bank/pembayaran": "Pembayaran",
  "kas-bank/penerimaan": "Penerimaan",
  "kas-bank/transfer-bank": "Transfer Bank",
  "kas-bank/histori-bank": "Histori Bank",

  "penjualan/produk": "Produk",
  "penjualan/jenis-produk": "Jenis Produk",
  "penjualan/pelanggan": "Nasabah / Pelanggan",
  "penjualan/log-aktivitas": "Log Aktivitas Penjualan",

  "pembelian/pesanan-pembelian": "Pesanan Pembelian (PO)",
  "pembelian/pembayaran-pembelian": "Pembayaran Pembelian",
  "pembelian/pemasok": "Pemasok / Vendor",
  "pembelian/log-aktivitas": "Log Aktivitas Pembelian",

  "persediaan/permintaan-barang": "Permintaan Barang",
  "persediaan/pemindahan-barang": "Pemindahan Barang",
  "persediaan/penyelesaian-pesanan": "Penyelesaian Pesanan",
  "persediaan/barang-jasa": "Barang / Jasa",
  "persediaan/merek-barang": "Merek Barang",
  "persediaan/kategori-barang": "Kategori Barang",
  "persediaan/log-aktivitas": "Log Aktivitas Persediaan",

  "aset-tetap/aset": "Daftar Aset Tetap",
  "aset-tetap/kategori-aset": "Kategori Aset",
  "aset-tetap/log-aktivitas": "Log Aktivitas Aset",
};

export const getTabLabel = (tabId: string): string => TAB_LABELS[tabId] || tabId;
