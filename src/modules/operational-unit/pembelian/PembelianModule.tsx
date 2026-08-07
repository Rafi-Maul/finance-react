import { useState, useEffect, type FormEvent } from "react";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  History,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X
} from "lucide-react";
import type { OperationalModuleProps } from "../types";

export const PembelianModule = ({ activeSubTab = "pembelian/pesanan-pembelian", onSubTabChange }: OperationalModuleProps) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab);

  useEffect(() => {
    if (activeSubTab) {
      setCurrentSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  const handleTabChange = (tab: string) => {
    setCurrentSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const formatRupiah = (num: number | string) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(num));

  // 1. Pesanan Pembelian (PO) State
  const [purchaseOrders, setPurchaseOrders] = useState([
    { id: "po-1", poNo: "PO-2026-044", date: "2026-07-28", vendor: "PT Logistik Perkasa", totalAmount: 35000000, status: "Disetujui" },
    { id: "po-2", poNo: "PO-2026-045", date: "2026-07-29", vendor: "CV Mitra Utama", totalAmount: 18200000, status: "Pending Approval" }
  ]);
  const [showAddPoModal, setShowAddPoModal] = useState(false);
  const [newPoData, setNewPoData] = useState({ poNo: `PO-2026-04${purchaseOrders.length + 1}`, date: "2026-07-29", vendor: "PT Logistik Perkasa", totalAmount: "" });

  // 2. Pembayaran Pembelian State
  const [purchasePayments, setPurchasePayments] = useState([
    { id: "pp-1", payNo: "PAY-PO-001", date: "2026-07-28", poNo: "PO-2026-044", vendor: "PT Logistik Perkasa", amount: 35000000, status: "Lunas" }
  ]);
  const [showAddPpModal, setShowAddPpModal] = useState(false);
  const [newPpData, setNewPpData] = useState({ payNo: `PAY-PO-00${purchasePayments.length + 1}`, date: "2026-07-29", poNo: "PO-2026-044", vendor: "PT Logistik Perkasa", amount: "" });

  // 3. Pemasok (Vendor) State
  const [vendors, setVendors] = useState([
    { id: "vnd-1", code: "VND-001", name: "PT Logistik Perkasa", contact: "Hendra Wijaya", phone: "(021) 888-1122", address: "Jl. Industri Raya No. 12, Bekasi", status: "Aktif" },
    { id: "vnd-2", code: "VND-002", name: "CV Mitra Utama", contact: "Agus Pratama", phone: "(021) 444-9900", address: "Jl. Rungkut Industri No. 5, Surabaya", status: "Aktif" }
  ]);
  const [showAddVndModal, setShowAddVndModal] = useState(false);
  const [newVndData, setNewVndData] = useState({ code: `VND-00${vendors.length + 1}`, name: "", contact: "", phone: "", address: "" });

  // 4. Log Aktivitas Pembelian
  const [purLogs] = useState([
    { id: "plog-1", time: "2026-07-29 11:20", user: "Staff Procurement", action: "Penerbitan PO Baru", detail: "Menerbitkan pesanan pembelian PO-2026-045" },
    { id: "plog-2", time: "2026-07-28 15:40", user: "Manager Pembelian", action: "Pelunasan Tagihan PO", detail: "Pembayaran PO-2026-044 senilai Rp 35.000.000" }
  ]);

  const handleAddPO = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPoData.totalAmount) return;
    const item = { id: `po-${Date.now()}`, ...newPoData, totalAmount: Number(newPoData.totalAmount), status: "Disetujui" };
    setPurchaseOrders([...purchaseOrders, item]);
    setShowAddPoModal(false);
    showToast(`Pesanan Pembelian ${item.poNo} Berhasil Dibuat!`);
  };

  const handleAddPurchasePayment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPpData.amount) return;
    const item = { id: `pp-${Date.now()}`, ...newPpData, amount: Number(newPpData.amount), status: "Lunas" };
    setPurchasePayments([...purchasePayments, item]);
    setShowAddPpModal(false);
    showToast(`Pembayaran Pembelian ${item.payNo} Berhasil Disimpan!`);
  };

  const handleAddVendor = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newVndData.name) return;
    const item = { id: `vnd-${Date.now()}`, ...newVndData, status: "Aktif" };
    setVendors([...vendors, item]);
    setShowAddVndModal(false);
    showToast(`Pemasok ${item.name} Berhasil Ditambahkan!`);
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Modul Pembelian</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manajemen pesanan pembelian (PO), pembayaran pembelian, data pemasok, & log aktivitas.</p>
        </div>

        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1">
          <button onClick={() => handleTabChange("pembelian/pesanan-pembelian")} className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 ${currentSubTab === "pembelian/pesanan-pembelian" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <ShoppingCart className="w-3.5 h-3.5" /> <span>Pesanan Pembelian</span>
          </button>
          <button onClick={() => handleTabChange("pembelian/pembayaran-pembelian")} className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 ${currentSubTab === "pembelian/pembayaran-pembelian" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <CreditCard className="w-3.5 h-3.5" /> <span>Pembayaran Pembelian</span>
          </button>
          <button onClick={() => handleTabChange("pembelian/pemasok")} className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 ${currentSubTab === "pembelian/pemasok" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <Truck className="w-3.5 h-3.5" /> <span>Pemasok</span>
          </button>
          <button onClick={() => handleTabChange("pembelian/log-aktivitas")} className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 ${currentSubTab === "pembelian/log-aktivitas" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <History className="w-3.5 h-3.5" /> <span>Log Pembelian</span>
          </button>
        </div>
      </div>

      {/* SUB 1: PESANAN PEMBELIAN */}
      {currentSubTab === "pembelian/pesanan-pembelian" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-emerald-600" /> <span>List Pesanan Pembelian / PO ({purchaseOrders.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar PO yang diterbitkan ke pemasok.</p>
            </div>
            <button onClick={() => setShowAddPoModal(true)} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create PO Baru</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">NO PO</th>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6">PEMASOK / VENDOR</th>
                  <th className="py-3.5 px-6 font-mono">TOTAL NILAI PO</th>
                  <th className="py-3.5 px-6 text-center font-bold">STATUS</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{po.poNo}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{po.date}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{po.vendor}</td>
                    <td className="py-4 px-6 font-mono font-black text-slate-900">{formatRupiah(po.totalAmount)}</td>
                    <td className="py-4 px-6 text-center"><span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">{po.status}</span></td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setPurchaseOrders(purchaseOrders.filter(x => x.id !== po.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 2: PEMBAYARAN PEMBELIAN */}
      {currentSubTab === "pembelian/pembayaran-pembelian" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><CreditCard className="w-4 h-4 text-emerald-600" /> <span>List Pembayaran Pembelian ({purchasePayments.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar realisasi pelunasan faktur tagihan dari pemasok.</p>
            </div>
            <button onClick={() => setShowAddPpModal(true)} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Pembayaran Pembelian</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">NO BUKTI BAYAR</th>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6">NO PO TERIKAT</th>
                  <th className="py-3.5 px-6">PEMASOK</th>
                  <th className="py-3.5 px-6 font-mono">NOMINAL</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {purchasePayments.map((pp) => (
                  <tr key={pp.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{pp.payNo}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{pp.date}</td>
                    <td className="py-4 px-6 font-bold text-indigo-600">{pp.poNo}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{pp.vendor}</td>
                    <td className="py-4 px-6 font-mono font-black text-slate-900">{formatRupiah(pp.amount)}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setPurchasePayments(purchasePayments.filter(x => x.id !== pp.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 3: PEMASOK */}
      {currentSubTab === "pembelian/pemasok" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><Truck className="w-4 h-4 text-emerald-600" /> <span>Data Pemasok / Vendor ({vendors.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar pemasok resmi barang dan layanan operasional.</p>
            </div>
            <button onClick={() => setShowAddVndModal(true)} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Pemasok Baru</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">KODE PEMASOK</th>
                  <th className="py-3.5 px-6">NAMA VENDOR / PEMASOK</th>
                  <th className="py-3.5 px-6">CONTACT PERSON</th>
                  <th className="py-3.5 px-6">TELEPON & ALAMAT</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{v.code}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{v.name}</td>
                    <td className="py-4 px-6 font-bold text-slate-700">{v.contact}</td>
                    <td className="py-4 px-6 text-slate-500">{v.phone} — {v.address}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setVendors(vendors.filter(x => x.id !== v.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 4: LOG PEMBELIAN */}
      {currentSubTab === "pembelian/log-aktivitas" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><History className="w-4 h-4 text-emerald-600" /> <span>Log Aktivitas Pembelian</span></h4>
            <p className="text-xs text-slate-500 mt-0.5">Audit log transaksi penerbitan PO & pelunasan tagihan vendor.</p>
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
                {purLogs.map((l) => (
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

      {/* MODAL CREATE PO */}
      {showAddPoModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between border-b pb-3"><h3 className="font-extrabold text-slate-900">Create Pesanan Pembelian (PO)</h3><button onClick={() => setShowAddPoModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleAddPO} className="space-y-3 text-xs font-semibold">
              <div><label className="block mb-1">Pemasok / Vendor</label><select value={newPoData.vendor} onChange={(e) => setNewPoData({ ...newPoData, vendor: e.target.value })} className="w-full p-2.5 border rounded-xl bg-white"><option value="PT Logistik Perkasa">PT Logistik Perkasa</option><option value="CV Mitra Utama">CV Mitra Utama</option></select></div>
              <div><label className="block mb-1">Total Nilai PO (Rp)</label><input type="number" required value={newPoData.totalAmount} onChange={(e) => setNewPoData({ ...newPoData, totalAmount: e.target.value })} className="w-full p-2.5 border rounded-xl font-mono font-bold" /></div>
              <div className="pt-3 flex justify-end gap-3 border-t"><button type="button" onClick={() => setShowAddPoModal(false)} className="px-4 py-2 font-bold text-slate-600">Batal</button><button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Terbit PO Baru</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREATE PEMBAYARAN PEMBELIAN */}
      {showAddPpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between border-b pb-3"><h3 className="font-extrabold text-slate-900">Create Pembayaran Pembelian</h3><button onClick={() => setShowAddPpModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleAddPurchasePayment} className="space-y-3 text-xs font-semibold">
              <div><label className="block mb-1">No PO Terikat</label><input type="text" required value={newPpData.poNo} onChange={(e) => setNewPpData({ ...newPpData, poNo: e.target.value })} className="w-full p-2.5 border rounded-xl font-mono font-bold" /></div>
              <div><label className="block mb-1">Nominal Pembayaran (Rp)</label><input type="number" required value={newPpData.amount} onChange={(e) => setNewPpData({ ...newPpData, amount: e.target.value })} className="w-full p-2.5 border rounded-xl font-mono font-bold" /></div>
              <div className="pt-3 flex justify-end gap-3 border-t"><button type="button" onClick={() => setShowAddPpModal(false)} className="px-4 py-2 font-bold text-slate-600">Batal</button><button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Simpan Pembayaran</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREATE VENDOR */}
      {showAddVndModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between border-b pb-3"><h3 className="font-extrabold text-slate-900">Create Pemasok Baru</h3><button onClick={() => setShowAddVndModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleAddVendor} className="space-y-3 text-xs font-semibold">
              <div><label className="block mb-1">Nama Pemasok / Vendor</label><input type="text" required value={newVndData.name} onChange={(e) => setNewVndData({ ...newVndData, name: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div><label className="block mb-1">Contact Person</label><input type="text" required value={newVndData.contact} onChange={(e) => setNewVndData({ ...newVndData, contact: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div><label className="block mb-1">Telepon & Alamat</label><input type="text" required value={newVndData.phone} onChange={(e) => setNewVndData({ ...newVndData, phone: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div className="pt-3 flex justify-end gap-3 border-t"><button type="button" onClick={() => setShowAddVndModal(false)} className="px-4 py-2 font-bold text-slate-600">Batal</button><button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Simpan Pemasok</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
