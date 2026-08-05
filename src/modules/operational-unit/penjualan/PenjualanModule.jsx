import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Tag, 
  Users, 
  History, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  X, 
  Search 
} from "lucide-react";

export const PenjualanModule = ({ activeSubTab = "penjualan/produk", onSubTabChange }) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab);

  useEffect(() => {
    if (activeSubTab) {
      setCurrentSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  const handleTabChange = (tab) => {
    setCurrentSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);

  // 1. Produk State
  const [products, setProducts] = useState([
    { id: "prd-1", code: "PRD-001", name: "Jasa Konsultasi Keuangan Enterprise", type: "Jasa Keuangan", price: 15000000, stock: "Unlimited", status: "Tersedia" },
    { id: "prd-2", code: "PRD-002", name: "Sistem Software Ledger Pro", type: "Lisensi Software", price: 8500000, stock: "50 Lisensi", status: "Tersedia" }
  ]);
  const [showAddPrdModal, setShowAddPrdModal] = useState(false);
  const [newPrdData, setNewPrdData] = useState({ code: `PRD-00${products.length + 1}`, name: "", type: "Jasa Keuangan", price: "", stock: "100" });

  // 2. Jenis Produk State
  const [productTypes, setProductTypes] = useState([
    { id: "pt-1", code: "TP-01", name: "Jasa Keuangan", desc: "Layanan konsultasi & audit keuangan", count: 12 },
    { id: "pt-2", code: "TP-02", name: "Lisensi Software", desc: "Produk aplikasi & sistem finansial", count: 5 }
  ]);
  const [showAddPtModal, setShowAddPtModal] = useState(false);
  const [newPtData, setNewPtData] = useState({ code: `TP-0${productTypes.length + 1}`, name: "", desc: "" });

  // 3. Nasabah / Pelanggan State
  const [customers, setCustomers] = useState([
    { id: "cst-1", code: "CST-001", name: "PT Bank Nusantara", contactPerson: "Budi Harjo", email: "procurement@banknusantara.co.id", phone: "(021) 555-8899", type: "Corporate", status: "Aktif" },
    { id: "cst-2", code: "CST-002", name: "CV Kirana Utama", contactPerson: "Siti Rahmi", email: "siti@kiranautama.com", phone: "(021) 777-3322", type: "Retail/UMKM", status: "Aktif" }
  ]);
  const [showAddCstModal, setShowAddCstModal] = useState(false);
  const [newCstData, setNewCstData] = useState({ code: `CST-00${customers.length + 1}`, name: "", contactPerson: "", email: "", phone: "", type: "Corporate" });

  // 4. Log Aktivitas Penjualan
  const [salesLogs, setSalesLogs] = useState([
    { id: "slog-1", time: "2026-07-29 13:30", user: "Staff Penjualan", action: "Penambahan Produk Baru", detail: "Menambahkan produk PRD-002 (Software Ledger Pro)" },
    { id: "slog-2", time: "2026-07-28 11:15", user: "Manager Sales", action: "Update Data Pelanggan", detail: "Memperbarui nomor kontak PT Bank Nusantara" }
  ]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newPrdData.name || !newPrdData.price) return;
    const item = { id: `prd-${Date.now()}`, ...newPrdData, price: Number(newPrdData.price), status: "Tersedia" };
    setProducts([...products, item]);
    setShowAddPrdModal(false);
    showToast(`Produk ${item.name} Berhasil Ditambahkan!`);
  };

  const handleAddProductType = (e) => {
    e.preventDefault();
    if (!newPtData.name) return;
    const item = { id: `pt-${Date.now()}`, ...newPtData, count: 0 };
    setProductTypes([...productTypes, item]);
    setShowAddPtModal(false);
    showToast(`Jenis Produk ${item.name} Berhasil Ditambahkan!`);
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCstData.name) return;
    const item = { id: `cst-${Date.now()}`, ...newCstData, status: "Aktif" };
    setCustomers([...customers, item]);
    setShowAddCstModal(false);
    showToast(`Pelanggan ${item.name} Berhasil Ditambahkan!`);
  };

  return (
    <div className="p-6 space-y-6">
      {toastMsg && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs"><CheckCircle2 className="w-5 h-5" /><span>{toastMsg}</span></div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Modul Penjualan</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manajemen produk, jenis produk, data nasabah/pelanggan, & log aktivitas penjualan.</p>
        </div>

        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1">
          <button onClick={() => handleTabChange("penjualan/produk")} className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 ${currentSubTab === "penjualan/produk" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <ShoppingBag className="w-3.5 h-3.5" /> <span>Produk</span>
          </button>
          <button onClick={() => handleTabChange("penjualan/jenis-produk")} className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 ${currentSubTab === "penjualan/jenis-produk" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <Tag className="w-3.5 h-3.5" /> <span>Jenis Produk</span>
          </button>
          <button onClick={() => handleTabChange("penjualan/pelanggan")} className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 ${currentSubTab === "penjualan/pelanggan" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <Users className="w-3.5 h-3.5" /> <span>Nasabah / Pelanggan</span>
          </button>
          <button onClick={() => handleTabChange("penjualan/log-aktivitas")} className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 ${currentSubTab === "penjualan/log-aktivitas" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <History className="w-3.5 h-3.5" /> <span>Log Penjualan</span>
          </button>
        </div>
      </div>

      {/* SUB 1: PRODUK */}
      {currentSubTab === "penjualan/produk" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-emerald-600" /> <span>Daftar Produk ({products.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">List barang & jasa yang dijual.</p>
            </div>
            <button onClick={() => setShowAddPrdModal(true)} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Produk Baru</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">KODE</th>
                  <th className="py-3.5 px-6">NAMA PRODUK</th>
                  <th className="py-3.5 px-6">JENIS PRODUK</th>
                  <th className="py-3.5 px-6 font-mono">HARGA JUAL</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{p.code}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{p.name}</td>
                    <td className="py-4 px-6 font-bold text-indigo-600">{p.type}</td>
                    <td className="py-4 px-6 font-mono font-black text-slate-900">{formatRupiah(p.price)}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 2: JENIS PRODUK */}
      {currentSubTab === "penjualan/jenis-produk" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><Tag className="w-4 h-4 text-indigo-600" /> <span>List Jenis Produk ({productTypes.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Klasifikasi tipe produk dan layanan.</p>
            </div>
            <button onClick={() => setShowAddPtModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Jenis Produk</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">KODE</th>
                  <th className="py-3.5 px-6">NAMA JENIS PRODUK</th>
                  <th className="py-3.5 px-6">DESKRIPSI</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {productTypes.map((pt) => (
                  <tr key={pt.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-700">{pt.code}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{pt.name}</td>
                    <td className="py-4 px-6 text-slate-600">{pt.desc}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setProductTypes(productTypes.filter(x => x.id !== pt.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 3: NASABAH / PELANGGAN */}
      {currentSubTab === "penjualan/pelanggan" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><Users className="w-4 h-4 text-emerald-600" /> <span>Data Nasabah / Pelanggan ({customers.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar pelanggan corporate & retail.</p>
            </div>
            <button onClick={() => setShowAddCstModal(true)} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Pelanggan Baru</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">KODE NASABAH</th>
                  <th className="py-3.5 px-6">NAMA PELANGGAN</th>
                  <th className="py-3.5 px-6">CONTACT PERSON</th>
                  <th className="py-3.5 px-6">EMAIL / TELEPON</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{c.code}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{c.name}</td>
                    <td className="py-4 px-6 font-bold text-slate-700">{c.contactPerson}</td>
                    <td className="py-4 px-6 text-slate-500">{c.email} • {c.phone}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setCustomers(customers.filter(x => x.id !== c.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 4: LOG PENJUALAN */}
      {currentSubTab === "penjualan/log-aktivitas" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><History className="w-4 h-4 text-emerald-600" /> <span>Log Aktivitas Penjualan</span></h4>
            <p className="text-xs text-slate-500 mt-0.5">Audit log transaksi dan perubahan data produk & pelanggan.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">WAKTU</th>
                  <th className="py-3.5 px-6">USER</th>
                  <th className="py-3.5 px-6">AKTIVITAS</th>
                  <th className="py-3.5 px-6">DETAIL CATATAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {salesLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono text-slate-500">{l.time}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{l.user}</td>
                    <td className="py-4 px-6 font-bold text-emerald-700">{l.action}</td>
                    <td className="py-4 px-6 text-slate-600">{l.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL CREATE PRODUK */}
      {showAddPrdModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between border-b pb-3"><h3 className="font-extrabold text-slate-900">Create Produk Baru</h3><button onClick={() => setShowAddPrdModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs font-semibold">
              <div><label className="block mb-1">Nama Produk / Layanan</label><input type="text" required value={newPrdData.name} onChange={(e) => setNewPrdData({ ...newPrdData, name: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div><label className="block mb-1">Harga Jual (Rp)</label><input type="number" required value={newPrdData.price} onChange={(e) => setNewPrdData({ ...newPrdData, price: e.target.value })} className="w-full p-2.5 border rounded-xl font-mono font-bold" /></div>
              <div className="pt-3 flex justify-end gap-3 border-t"><button type="button" onClick={() => setShowAddPrdModal(false)} className="px-4 py-2 font-bold text-slate-600">Batal</button><button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Simpan Produk</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREATE JENIS PRODUK */}
      {showAddPtModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between border-b pb-3"><h3 className="font-extrabold text-slate-900">Create Jenis Produk Baru</h3><button onClick={() => setShowAddPtModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleAddProductType} className="space-y-3 text-xs font-semibold">
              <div><label className="block mb-1">Nama Jenis Produk</label><input type="text" required value={newPtData.name} onChange={(e) => setNewPtData({ ...newPtData, name: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div><label className="block mb-1">Deskripsi</label><textarea rows="2" value={newPtData.desc} onChange={(e) => setNewPtData({ ...newPtData, desc: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div className="pt-3 flex justify-end gap-3 border-t"><button type="button" onClick={() => setShowAddPtModal(false)} className="px-4 py-2 font-bold text-slate-600">Batal</button><button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl">Simpan Jenis Produk</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREATE PELANGGAN */}
      {showAddCstModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between border-b pb-3"><h3 className="font-extrabold text-slate-900">Create Pelanggan Baru</h3><button onClick={() => setShowAddCstModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs font-semibold">
              <div><label className="block mb-1">Nama Nasabah / Pelanggan</label><input type="text" required value={newCstData.name} onChange={(e) => setNewCstData({ ...newCstData, name: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div><label className="block mb-1">Contact Person</label><input type="text" required value={newCstData.contactPerson} onChange={(e) => setNewCstData({ ...newCstData, contactPerson: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div><label className="block mb-1">Email</label><input type="email" required value={newCstData.email} onChange={(e) => setNewCstData({ ...newCstData, email: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div className="pt-3 flex justify-end gap-3 border-t"><button type="button" onClick={() => setShowAddCstModal(false)} className="px-4 py-2 font-bold text-slate-600">Batal</button><button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Simpan Pelanggan</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
