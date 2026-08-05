import React, { useState, useEffect } from "react";
import { 
  Boxes, 
  ArrowLeftRight, 
  CheckSquare, 
  PackageCheck, 
  Bookmark, 
  Layers, 
  History, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  X 
} from "lucide-react";

export const PersediaanModule = ({ activeSubTab = "persediaan/permintaan-barang", onSubTabChange }) => {
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

  // 1. Permintaan Barang State
  const [itemRequests, setItemRequests] = useState([
    { id: "req-1", reqNo: "REQ-2026-012", date: "2026-07-28", requester: "Cabang Jakarta Pusat", item: "Kertas HVS A4 80gr", qty: "50 Rim", status: "Disetujui" }
  ]);
  const [showAddReqModal, setShowAddReqModal] = useState(false);
  const [newReqData, setNewReqData] = useState({ reqNo: `REQ-2026-01${itemRequests.length + 1}`, date: "2026-07-29", requester: "Cabang Surabaya", item: "Tinta Printer Epson Black", qty: "10 Botol" });

  // 2. Pemindahan Barang State
  const [itemTransfers, setItemTransfers] = useState([
    { id: "trf-1", trfNo: "TRF-STK-001", date: "2026-07-27", sourceLoc: "Gudang Utama Jakpus", targetLoc: "Gudang Cabang Surabaya", item: "Router Cisco Enterprise", qty: "2 Unit", status: "Selesai Ditransfer" }
  ]);
  const [showAddTrfModal, setShowAddTrfModal] = useState(false);
  const [newTrfData, setNewTrfData] = useState({ trfNo: `TRF-STK-00${itemTransfers.length + 1}`, date: "2026-07-29", sourceLoc: "Gudang Utama Jakpus", targetLoc: "Gudang Cabang Surabaya", item: "Laptop Dell Vostro", qty: "3 Unit" });

  // 3. Penyelesaian Pesanan State
  const [fulfillments, setFulfillments] = useState([
    { id: "ful-1", fulNo: "FUL-2026-009", date: "2026-07-28", poNo: "PO-2026-044", vendor: "PT Logistik Perkasa", status: "Barang Diterima & Lengkap" }
  ]);
  const [showAddFulModal, setShowAddFulModal] = useState(false);
  const [newFulData, setNewFulData] = useState({ fulNo: `FUL-2026-010`, date: "2026-07-29", poNo: "PO-2026-045", vendor: "CV Mitra Utama" });

  // 4. Barang / Jasa State
  const [itemServices, setItemServices] = useState([
    { id: "its-1", code: "BRG-001", name: "Laptop Dell Vostro 3400", brand: "Dell", category: "Elektronik & IT", stock: "15 Unit", unit: "Unit", status: "Tersedia" },
    { id: "its-2", code: "BRG-002", name: "Kertas HVS A4 PaperOne 80gr", brand: "PaperOne", category: "ATK", stock: "120 Rim", unit: "Rim", status: "Tersedia" }
  ]);
  const [showAddItsModal, setShowAddItsModal] = useState(false);
  const [newItsData, setNewItsData] = useState({ code: `BRG-00${itemServices.length + 1}`, name: "", brand: "Dell", category: "Elektronik & IT", stock: "10", unit: "Unit" });

  // 5. Merek Barang State
  const [brands, setBrands] = useState([
    { id: "br-1", code: "MRK-01", name: "Dell", origin: "Amerika Serikat", totalItems: 8 },
    { id: "br-2", code: "MRK-02", name: "PaperOne", origin: "Indonesia", totalItems: 25 }
  ]);
  const [showAddBrModal, setShowAddBrModal] = useState(false);
  const [newBrData, setNewBrData] = useState({ code: `MRK-0${brands.length + 1}`, name: "", origin: "Indonesia" });

  // 6. Kategori Barang State
  const [categories, setCategories] = useState([
    { id: "cat-1", code: "KAT-01", name: "Elektronik & IT", desc: "Komputer, laptop, printer & aksesoris", totalItems: 14 },
    { id: "cat-2", code: "KAT-02", name: "Perlengkapan ATK", desc: "Kertas, alat tulis & perlengkapan kantor", totalItems: 45 }
  ]);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatData, setNewCatData] = useState({ code: `KAT-0${categories.length + 1}`, name: "", desc: "" });

  // 7. Log Aktivitas Persediaan
  const [invLogs, setInvLogs] = useState([
    { id: "ilog-1", time: "2026-07-29 12:10", user: "Staff Gudang", action: "Permintaan Barang Baru", detail: "Mengajukan REQ-2026-012 untuk Cabang Jakpus" },
    { id: "ilog-2", time: "2026-07-28 14:00", user: "Manager Persediaan", action: "Update Stok Barang", detail: "Menambahkan 15 Unit Laptop Dell Vostro" }
  ]);

  const handleAddRequest = (e) => {
    e.preventDefault();
    const item = { id: `req-${Date.now()}`, ...newReqData, status: "Disetujui" };
    setItemRequests([...itemRequests, item]);
    setShowAddReqModal(false);
    showToast(`Permintaan Barang ${item.reqNo} Berhasil Dibuat!`);
  };

  const handleAddTransfer = (e) => {
    e.preventDefault();
    const item = { id: `trf-${Date.now()}`, ...newTrfData, status: "Selesai Ditransfer" };
    setItemTransfers([...itemTransfers, item]);
    setShowAddTrfModal(false);
    showToast(`Pemindahan Barang ${item.trfNo} Berhasil Dibuat!`);
  };

  const handleAddFulfillment = (e) => {
    e.preventDefault();
    const item = { id: `ful-${Date.now()}`, ...newFulData, status: "Barang Diterima & Lengkap" };
    setFulfillments([...fulfillments, item]);
    setShowAddFulModal(false);
    showToast(`Penyelesaian Pesanan ${item.fulNo} Berhasil Dibuat!`);
  };

  const handleAddItemService = (e) => {
    e.preventDefault();
    if (!newItsData.name) return;
    const item = { id: `its-${Date.now()}`, ...newItsData, stock: `${newItsData.stock} ${newItsData.unit}`, status: "Tersedia" };
    setItemServices([...itemServices, item]);
    setShowAddItsModal(false);
    showToast(`Barang/Jasa ${item.name} Berhasil Ditambahkan!`);
  };

  const handleAddBrand = (e) => {
    e.preventDefault();
    if (!newBrData.name) return;
    const item = { id: `br-${Date.now()}`, ...newBrData, totalItems: 0 };
    setBrands([...brands, item]);
    setShowAddBrModal(false);
    showToast(`Merek Barang ${item.name} Berhasil Ditambahkan!`);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatData.name) return;
    const item = { id: `cat-${Date.now()}`, ...newCatData, totalItems: 0 };
    setCategories([...categories, item]);
    setShowAddCatModal(false);
    showToast(`Kategori Barang ${item.name} Berhasil Ditambahkan!`);
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Modul Persediaan (Inventory)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manajemen permintaan barang, pemindahan stok, penyelesaian pesanan, barang/jasa, merek, kategori, & log aktivitas.</p>
        </div>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1.5">
        <button onClick={() => handleTabChange("persediaan/permintaan-barang")} className={`py-2 px-3 rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 ${currentSubTab === "persediaan/permintaan-barang" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
          <Boxes className="w-3.5 h-3.5" /> <span>Permintaan Barang</span>
        </button>
        <button onClick={() => handleTabChange("persediaan/pemindahan-barang")} className={`py-2 px-3 rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 ${currentSubTab === "persediaan/pemindahan-barang" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
          <ArrowLeftRight className="w-3.5 h-3.5" /> <span>Pemindahan Barang</span>
        </button>
        <button onClick={() => handleTabChange("persediaan/penyelesaian-pesanan")} className={`py-2 px-3 rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 ${currentSubTab === "persediaan/penyelesaian-pesanan" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
          <PackageCheck className="w-3.5 h-3.5" /> <span>Penyelesaian</span>
        </button>
        <button onClick={() => handleTabChange("persediaan/barang-jasa")} className={`py-2 px-3 rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 ${currentSubTab === "persediaan/barang-jasa" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
          <CheckSquare className="w-3.5 h-3.5" /> <span>Barang / Jasa</span>
        </button>
        <button onClick={() => handleTabChange("persediaan/merek-barang")} className={`py-2 px-3 rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 ${currentSubTab === "persediaan/merek-barang" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
          <Bookmark className="w-3.5 h-3.5" /> <span>Merek Barang</span>
        </button>
        <button onClick={() => handleTabChange("persediaan/kategori-barang")} className={`py-2 px-3 rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 ${currentSubTab === "persediaan/kategori-barang" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
          <Layers className="w-3.5 h-3.5" /> <span>Kategori Barang</span>
        </button>
        <button onClick={() => handleTabChange("persediaan/log-aktivitas")} className={`py-2 px-3 rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 ${currentSubTab === "persediaan/log-aktivitas" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
          <History className="w-3.5 h-3.5" /> <span>Log Persediaan</span>
        </button>
      </div>

      {/* SUB 1: PERMINTAAN BARANG */}
      {currentSubTab === "persediaan/permintaan-barang" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><Boxes className="w-4 h-4 text-emerald-600" /> <span>Daftar Permintaan Barang ({itemRequests.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Permintaan persediaan dari cabang atau departemen.</p>
            </div>
            <button onClick={() => setShowAddReqModal(true)} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Permintaan Barang</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">NO PERMINTAAN</th>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6">PEMOHON / UNIT</th>
                  <th className="py-3.5 px-6">NAMA BARANG</th>
                  <th className="py-3.5 px-6 font-mono">JUMLAH (QTY)</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {itemRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{r.reqNo}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{r.date}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{r.requester}</td>
                    <td className="py-4 px-6 font-bold text-slate-700">{r.item}</td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{r.qty}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setItemRequests(itemRequests.filter(x => x.id !== r.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 2: PEMINDAHAN BARANG */}
      {currentSubTab === "persediaan/pemindahan-barang" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-emerald-600" /> <span>List Pemindahan Barang / Mutasi Stok ({itemTransfers.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Pemindahan stok persediaan antar gudang/cabang.</p>
            </div>
            <button onClick={() => setShowAddTrfModal(true)} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Pemindahan Barang</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">NO MUTASI</th>
                  <th className="py-3.5 px-6">GUDANG ASAL ➔ TUJUAN</th>
                  <th className="py-3.5 px-6">BARANG</th>
                  <th className="py-3.5 px-6 font-mono">QTY</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {itemTransfers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{t.trfNo}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{t.sourceLoc} ➔ {t.targetLoc}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">{t.item}</td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{t.qty}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setItemTransfers(itemTransfers.filter(x => x.id !== t.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 3: PENYELESAIAN PESANAN */}
      {currentSubTab === "persediaan/penyelesaian-pesanan" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><PackageCheck className="w-4 h-4 text-emerald-600" /> <span>List Penyelesaian Pesanan / Goods Receipt ({fulfillments.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Konfirmasi penerimaan & penyelesaian PO dari vendor.</p>
            </div>
            <button onClick={() => setShowAddFulModal(true)} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Penyelesaian Pesanan</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">NO BUKTI TERIMA</th>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6">NO PO TERIKAT</th>
                  <th className="py-3.5 px-6">VENDOR</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {fulfillments.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{f.fulNo}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{f.date}</td>
                    <td className="py-4 px-6 font-bold text-indigo-600">{f.poNo}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{f.vendor}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setFulfillments(fulfillments.filter(x => x.id !== f.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 4: BARANG / JASA */}
      {currentSubTab === "persediaan/barang-jasa" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><CheckSquare className="w-4 h-4 text-emerald-600" /> <span>Master Barang / Jasa ({itemServices.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar item persediaan barang & jasa.</p>
            </div>
            <button onClick={() => setShowAddItsModal(true)} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Barang/Jasa Baru</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">KODE ITEM</th>
                  <th className="py-3.5 px-6">NAMA BARANG / JASA</th>
                  <th className="py-3.5 px-6">MEREK</th>
                  <th className="py-3.5 px-6">KATEGORI</th>
                  <th className="py-3.5 px-6 font-mono">SALDO STOK</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {itemServices.map((its) => (
                  <tr key={its.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{its.code}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{its.name}</td>
                    <td className="py-4 px-6 text-slate-600">{its.brand}</td>
                    <td className="py-4 px-6 text-slate-600">{its.category}</td>
                    <td className="py-4 px-6 font-mono font-black text-slate-900">{its.stock}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setItemServices(itemServices.filter(x => x.id !== its.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 5: MEREK BARANG */}
      {currentSubTab === "persediaan/merek-barang" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><Bookmark className="w-4 h-4 text-emerald-600" /> <span>List Merek Barang ({brands.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Brand & produsen item persediaan.</p>
            </div>
            <button onClick={() => setShowAddBrModal(true)} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Merek Barang</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">KODE</th>
                  <th className="py-3.5 px-6">NAMA MEREK</th>
                  <th className="py-3.5 px-6">NEGARA ASAL</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {brands.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{b.code}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{b.name}</td>
                    <td className="py-4 px-6 text-slate-600">{b.origin}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setBrands(brands.filter(x => x.id !== b.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 6: KATEGORI BARANG */}
      {currentSubTab === "persediaan/kategori-barang" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-600" /> <span>List Kategori Barang ({categories.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Pengelompokan kategori persediaan.</p>
            </div>
            <button onClick={() => setShowAddCatModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Kategori Barang</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">KODE</th>
                  <th className="py-3.5 px-6">NAMA KATEGORI</th>
                  <th className="py-3.5 px-6">DESKRIPSI</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-700">{c.code}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{c.name}</td>
                    <td className="py-4 px-6 text-slate-600">{c.desc}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setCategories(categories.filter(x => x.id !== c.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 7: LOG PERSEDIAAN */}
      {currentSubTab === "persediaan/log-aktivitas" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><History className="w-4 h-4 text-emerald-600" /> <span>Log Aktivitas Persediaan</span></h4>
            <p className="text-xs text-slate-500 mt-0.5">Audit log transaksi mutasi barang dan stok opname.</p>
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
                {invLogs.map((l) => (
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

      {/* MODAL CREATE PERMINTAAN */}
      {showAddReqModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between border-b pb-3"><h3 className="font-extrabold text-slate-900">Create Permintaan Barang</h3><button onClick={() => setShowAddReqModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleAddRequest} className="space-y-3 text-xs font-semibold">
              <div><label className="block mb-1">Nama Item Barang</label><input type="text" required value={newReqData.item} onChange={(e) => setNewReqData({ ...newReqData, item: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div><label className="block mb-1">Jumlah (Qty)</label><input type="text" required value={newReqData.qty} onChange={(e) => setNewReqData({ ...newReqData, qty: e.target.value })} className="w-full p-2.5 border rounded-xl font-mono font-bold" /></div>
              <div className="pt-3 flex justify-end gap-3 border-t"><button type="button" onClick={() => setShowAddReqModal(false)} className="px-4 py-2 font-bold text-slate-600">Batal</button><button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Simpan Permintaan</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREATE BARANG JASA */}
      {showAddItsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between border-b pb-3"><h3 className="font-extrabold text-slate-900">Create Barang / Jasa Baru</h3><button onClick={() => setShowAddItsModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleAddItemService} className="space-y-3 text-xs font-semibold">
              <div><label className="block mb-1">Nama Barang / Jasa</label><input type="text" required value={newItsData.name} onChange={(e) => setNewItsData({ ...newItsData, name: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div><label className="block mb-1">Jumlah Stok Awal</label><input type="number" required value={newItsData.stock} onChange={(e) => setNewItsData({ ...newItsData, stock: e.target.value })} className="w-full p-2.5 border rounded-xl font-mono font-bold" /></div>
              <div className="pt-3 flex justify-end gap-3 border-t"><button type="button" onClick={() => setShowAddItsModal(false)} className="px-4 py-2 font-bold text-slate-600">Batal</button><button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Simpan Item</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREATE MEREK */}
      {showAddBrModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between border-b pb-3"><h3 className="font-extrabold text-slate-900">Create Merek Barang</h3><button onClick={() => setShowAddBrModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleAddBrand} className="space-y-3 text-xs font-semibold">
              <div><label className="block mb-1">Nama Merek / Brand</label><input type="text" required value={newBrData.name} onChange={(e) => setNewBrData({ ...newBrData, name: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div className="pt-3 flex justify-end gap-3 border-t"><button type="button" onClick={() => setShowAddBrModal(false)} className="px-4 py-2 font-bold text-slate-600">Batal</button><button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Simpan Merek</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREATE KATEGORI */}
      {showAddCatModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between border-b pb-3"><h3 className="font-extrabold text-slate-900">Create Kategori Barang</h3><button onClick={() => setShowAddCatModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs font-semibold">
              <div><label className="block mb-1">Nama Kategori</label><input type="text" required value={newCatData.name} onChange={(e) => setNewCatData({ ...newCatData, name: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div><label className="block mb-1">Deskripsi</label><textarea rows="2" value={newCatData.desc} onChange={(e) => setNewCatData({ ...newCatData, desc: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div className="pt-3 flex justify-end gap-3 border-t"><button type="button" onClick={() => setShowAddCatModal(false)} className="px-4 py-2 font-bold text-slate-600">Batal</button><button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl">Simpan Kategori</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
