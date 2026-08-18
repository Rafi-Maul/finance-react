import { useState, useEffect, type FormEvent } from "react";
import {
  Building,
  Layers,
  History,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  Search
} from "lucide-react";
import type { OperationalModuleProps } from "../types";
import { useToast } from "../../../context/ToastContext";

interface Asset {
  id: string;
  code: string;
  name: string;
  category: string;
  buyDate: string;
  buyPrice: number;
  value: number;
  location: string;
  status: string;
}

export const AsetTetapModule = ({ activeSubTab = "aset-tetap/aset" }: OperationalModuleProps) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab);

  useEffect(() => {
    if (activeSubTab) {
      setCurrentSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  const { showToast } = useToast();

  const formatRupiah = (num: number | string) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(num));

  // 1. Aset State
  const [assets, setAssets] = useState<Asset[]>([
    { id: "ast-1", code: "AST-2026-001", name: "Gedung Kantor Pusat Rajanegara", category: "Bangunan & Gedung", buyDate: "2021-03-15", buyPrice: 4500000000, value: 4100000000, location: "Jakarta Pusat", status: "Aktif / Digunakan" },
    { id: "ast-2", code: "AST-2026-002", name: "Mobil Operasional Toyota Innova Zenix", category: "Kendaraan Operasional", buyDate: "2024-01-10", buyPrice: 485000000, value: 390000000, location: "Gudang Surabaya", status: "Aktif / Digunakan" },
    { id: "ast-3", code: "AST-2026-003", name: "Server Dell PowerEdge R750", category: "Peralatan Komputer & IT", buyDate: "2025-06-20", buyPrice: 120000000, value: 95000000, location: "Data Center Jakpus", status: "Aktif / Digunakan" }
  ]);
  const [assetSearch, setAssetSearch] = useState("");
  const [showAddAstModal, setShowAddAstModal] = useState(false);
  const [showViewAstModal, setShowViewAstModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const [newAstData, setNewAstData] = useState({
    code: `AST-2026-00${assets.length + 1}`,
    name: "",
    category: "Peralatan Kantor",
    buyDate: "2026-07-29",
    buyPrice: "",
    location: "Jakarta Pusat"
  });

  // 2. Kategori Aset State
  const [categories, setCategories] = useState([
    { id: "cat-1", code: "KAT-AST-01", name: "Bangunan & Gedung", usefulLife: "20 Tahun", method: "Garis Lurus", count: 2 },
    { id: "cat-2", code: "KAT-AST-02", name: "Kendaraan Operasional", usefulLife: "8 Tahun", method: "Garis Lurus", count: 5 },
    { id: "cat-3", code: "KAT-AST-03", name: "Peralatan Komputer & IT", usefulLife: "4 Tahun", method: "Garis Lurus", count: 24 },
    { id: "cat-4", code: "KAT-AST-04", name: "Peralatan Kantor & Meubel", usefulLife: "4 Tahun", method: "Garis Lurus", count: 35 }
  ]);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatData, setNewCatData] = useState({ code: `KAT-AST-0${categories.length + 1}`, name: "", usefulLife: "4 Tahun", method: "Garis Lurus" });

  // 3. Log Aktivitas Aset Tetap State
  const [assetLogs, setAssetLogs] = useState([
    { id: "alog-1", time: "2026-07-29 14:10", user: "Staff GA & Aset", action: "Penambahan Aset Baru", detail: "Mendaftarkan aset AST-2026-003 (Server Dell PowerEdge)", ip: "192.168.1.115" },
    { id: "alog-2", time: "2026-07-28 10:45", user: "Manager Keuangan", action: "Perhitungan Penyusutan", detail: "Memproses akumulasi penyusutan bulanan untuk kategori Kendaraan", ip: "192.168.1.102" },
    { id: "alog-3", time: "2026-07-25 09:30", user: "Staff GA & Aset", action: "Update Lokasi Aset", detail: "Pemindahan Toyota Innova ke Cabang Surabaya", ip: "192.168.1.115" }
  ]);

  const handleAddAsset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newAstData.name || !newAstData.buyPrice) return;
    const price = Number(newAstData.buyPrice);
    const created = {
      id: `ast-${Date.now()}`,
      ...newAstData,
      buyPrice: price,
      value: price,
      status: "Aktif / Digunakan"
    };
    setAssets([created, ...assets]);
    setShowAddAstModal(false);
    showToast(`Aset [${created.code}] ${created.name} Berhasil Ditambahkan!`);

    // Log Activity
    setAssetLogs([
      { id: `alog-${Date.now()}`, time: new Date().toLocaleString(), user: "User Login", action: "Penambahan Aset Baru", detail: `Mendaftarkan aset ${created.name} (${created.code})`, ip: "127.0.0.1" },
      ...assetLogs
    ]);
  };

  const handleAddCategory = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCatData.name) return;
    const created = { id: `cat-${Date.now()}`, ...newCatData, count: 0 };
    setCategories([...categories, created]);
    setShowAddCatModal(false);
    showToast(`Kategori Aset ${created.name} Berhasil Ditambahkan!`);
  };

  const handleDeleteAsset = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus aset ${name}?`)) {
      setAssets(assets.filter((a) => a.id !== id));
      showToast(`Aset ${name} Berhasil Dihapus.`);
    }
  };

  const filteredAssets = assets.filter((a) => 
    a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
    a.code.toLowerCase().includes(assetSearch.toLowerCase()) ||
    a.category.toLowerCase().includes(assetSearch.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Modul Aset Tetap (Fixed Assets)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan inventaris aset tetap perusahaan, kategori penyusutan, dan log audit aset.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-MODUL 1: DAFTAR ASET TETAP */}
      {/* ========================================================================= */}
      {currentSubTab === "aset-tetap/aset" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>Inventaris Aset Tetap ({filteredAssets.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar seluruh aset tetap perusahaan beserta nilai perolehan & nilai buku.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari kode/nama aset..."
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-emerald-500 w-48 sm:w-64"
                />
              </div>

              <button
                onClick={() => setShowAddAstModal(true)}
                className="flex items-center justify-center gap-2 bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create Aset Baru</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">KODE ASET</th>
                  <th className="py-3.5 px-6">NAMA ASET TETAP</th>
                  <th className="py-3.5 px-6">KATEGORI</th>
                  <th className="py-3.5 px-6 font-mono">TGL PEROLEHAN</th>
                  <th className="py-3.5 px-6 font-mono">NILAI PEROLEHAN</th>
                  <th className="py-3.5 px-6 font-mono">NILAI BUKU SAAT INI</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAssets.map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">
                      {ast.code}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      {ast.name}
                    </td>
                    <td className="py-4 px-6 font-bold text-indigo-600">
                      {ast.category}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-500">
                      {ast.buyDate}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {formatRupiah(ast.buyPrice)}
                    </td>
                    <td className="py-4 px-6 font-mono font-extrabold text-emerald-700">
                      {formatRupiah(ast.value)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => { setSelectedAsset(ast); setShowViewAstModal(true); }}
                          title="Lihat Detail"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          title="Edit Aset"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(ast.id, ast.name)}
                          title="Hapus Aset"
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODUL 2: KATEGORI ASET */}
      {/* ========================================================================= */}
      {currentSubTab === "aset-tetap/kategori-aset" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Kategori Aset & Masa Manfaat ({categories.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengelompokan kategori aset tetap dan metode penyusutan akuntansi.
              </p>
            </div>

            <button
              onClick={() => setShowAddCatModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Kategori Aset</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">KODE KATEGORI</th>
                  <th className="py-3.5 px-6">NAMA KATEGORI ASET</th>
                  <th className="py-3.5 px-6 font-mono">MASA MANFAAT</th>
                  <th className="py-3.5 px-6">METODE PENYUSUTAN</th>
                  <th className="py-3.5 px-6 text-center">JUMLAH ASET</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-700">
                      {cat.code}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      {cat.name}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-800">
                      {cat.usefulLife}
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-700">
                      {cat.method}
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700">
                      {cat.count} Item
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button title="Edit Kategori" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setCategories(categories.filter(c => c.id !== cat.id))}
                          title="Hapus Kategori" 
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODUL 3: LOG AKTIVITAS ASET TETAP */}
      {/* ========================================================================= */}
      {currentSubTab === "aset-tetap/log-aktivitas" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" />
              <span>Log Aktivitas Modul Aset Tetap</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Jejak audit seluruh aktivitas pendaftaran, pemindahan, & penyusutan aset tetap.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">WAKTU</th>
                  <th className="py-3.5 px-6">USER OPERATOR</th>
                  <th className="py-3.5 px-6">AKTIVITAS</th>
                  <th className="py-3.5 px-6">DETAIL CATATAN</th>
                  <th className="py-3.5 px-6 font-mono">IP ADDRESS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {assetLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-500">
                      {log.time}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      {log.user}
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-700">
                      {log.action}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {log.detail}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ASET BARU */}
      {showAddAstModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Create Aset Baru</h3>
              <button onClick={() => setShowAddAstModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Kode Aset</label>
                <input
                  type="text"
                  required
                  value={newAstData.code}
                  onChange={(e) => setNewAstData({ ...newAstData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Nama Aset Tetap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: AC Split Daikin 2 PK"
                  value={newAstData.name}
                  onChange={(e) => setNewAstData({ ...newAstData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Kategori Aset</label>
                <select
                  value={newAstData.category}
                  onChange={(e) => setNewAstData({ ...newAstData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Bangunan & Gedung">Bangunan & Gedung</option>
                  <option value="Kendaraan Operasional">Kendaraan Operasional</option>
                  <option value="Peralatan Komputer & IT">Peralatan Komputer & IT</option>
                  <option value="Peralatan Kantor & Meubel">Peralatan Kantor & Meubel</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Nilai Perolehan (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 15000000"
                  value={newAstData.buyPrice}
                  onChange={(e) => setNewAstData({ ...newAstData, buyPrice: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Lokasi Penempatan Aset</label>
                <input
                  type="text"
                  value={newAstData.location}
                  onChange={(e) => setNewAstData({ ...newAstData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAstModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00c885] hover:bg-[#00b377] text-white rounded-xl font-bold shadow-md shadow-emerald-500/20"
                >
                  Simpan Aset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE KATEGORI ASET */}
      {showAddCatModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Create Kategori Aset Baru</h3>
              <button onClick={() => setShowAddCatModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Kode Kategori</label>
                <input
                  type="text"
                  required
                  value={newCatData.code}
                  onChange={(e) => setNewCatData({ ...newCatData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Nama Kategori Aset</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mesin & Genset"
                  value={newCatData.name}
                  onChange={(e) => setNewCatData({ ...newCatData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Masa Manfaat (Penyusutan)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 8 Tahun"
                  value={newCatData.usefulLife}
                  onChange={(e) => setNewCatData({ ...newCatData, usefulLife: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW DETAIL ASET */}
      {showViewAstModal && selectedAsset && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Detail Aset Tetap</h3>
              <button onClick={() => setShowViewAstModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-[#03392a] text-white rounded-2xl space-y-1">
                <span className="text-[10px] font-mono text-emerald-300 font-bold">{selectedAsset.code}</span>
                <h4 className="text-base font-extrabold">{selectedAsset.name}</h4>
                <p className="text-[11px] text-slate-200">{selectedAsset.category}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 font-medium">
                <p><strong className="text-slate-700">Tanggal Perolehan:</strong> {selectedAsset.buyDate}</p>
                <p><strong className="text-slate-700">Nilai Perolehan:</strong> {formatRupiah(selectedAsset.buyPrice)}</p>
                <p><strong className="text-slate-700">Nilai Buku Saat Ini:</strong> <span className="font-extrabold text-emerald-700">{formatRupiah(selectedAsset.value)}</span></p>
                <p><strong className="text-slate-700">Lokasi Penempatan:</strong> {selectedAsset.location}</p>
                <p><strong className="text-slate-700">Status Operasional:</strong> <span className="font-bold text-emerald-600">{selectedAsset.status}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
