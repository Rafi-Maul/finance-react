import { useState, useEffect, type FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  History,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X
} from "lucide-react";
import type { OperationalModuleProps } from "../types";

export const KasBankModule = ({ activeSubTab = "kas-bank/pembayaran", onSubTabChange }: OperationalModuleProps) => {
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

  // 1. Pembayaran State
  const [payments, setPayments] = useState([
    { id: "pay-1", code: "PAY-2026-001", date: "2026-07-28", recipient: "PT Sarana Medika", bank: "Bank Mandiri (122-00-9876543-2)", amount: 12500000, category: "Pembayaran Vendor", status: "Berhasil" },
    { id: "pay-2", code: "PAY-2026-002", date: "2026-07-29", recipient: "PLN Persero", bank: "Kas Operasional", amount: 4500000, category: "Utilitas", status: "Berhasil" }
  ]);
  const [showAddPayModal, setShowAddPayModal] = useState(false);
  const [newPayData, setNewPayData] = useState({ code: `PAY-2026-00${payments.length + 1}`, date: "2026-07-29", recipient: "", bank: "Bank Mandiri (122-00-9876543-2)", amount: "", category: "Pembayaran Operasional" });

  // 2. Penerimaan State
  const [receipts, setReceipts] = useState([
    { id: "rcp-1", code: "RCP-2026-001", date: "2026-07-27", sender: "PT Alpha Utama", bank: "Bank Mandiri (122-00-9876543-2)", amount: 45000000, category: "Pelunasan Invoice", status: "Diterima" },
    { id: "rcp-2", code: "RCP-2026-002", date: "2026-07-29", sender: "CV Jaya Mandiri", bank: "BCA Operasional (883-00-112233-1)", amount: 18500000, category: "Pelunasan Invoice", status: "Diterima" }
  ]);
  const [showAddRcpModal, setShowAddRcpModal] = useState(false);
  const [newRcpData, setNewRcpData] = useState({ code: `RCP-2026-00${receipts.length + 1}`, date: "2026-07-29", sender: "", bank: "Bank Mandiri (122-00-9876543-2)", amount: "", category: "Penerimaan Pendapatan" });

  // 3. Transfer Bank State
  const [bankTransfers, setBankTransfers] = useState([
    { id: "bt-1", code: "TRF-BNK-001", date: "2026-07-26", sourceBank: "Bank Mandiri Operasional", targetBank: "BCA Operasional", amount: 50000000, note: "Top-up saldo kas operasional BCA" }
  ]);
  const [transferForm, setTransferForm] = useState({ sourceBank: "Bank Mandiri Operasional", targetBank: "BCA Operasional", amount: "", note: "" });

  // 4. Histori Bank State
  const [bankHistory] = useState([
    { id: "his-1", time: "2026-07-29 14:20", bank: "Bank Mandiri (122-00-9876543-2)", type: "Kredit (Keluar)", amount: "Rp 12.500.000", desc: "Pembayaran Vendor PAY-2026-001", balance: "Rp 237.500.000" },
    { id: "his-2", time: "2026-07-29 10:15", bank: "BCA Operasional (883-00-112233-1)", type: "Debet (Masuk)", amount: "Rp 18.500.000", desc: "Penerimaan Invoice RCP-2026-002", balance: "Rp 148.500.000" }
  ]);

  const handleAddPayment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPayData.amount) return;
    const item = { id: `pay-${Date.now()}`, ...newPayData, amount: Number(newPayData.amount), status: "Berhasil" };
    setPayments([item, ...payments]);
    setShowAddPayModal(false);
    showToast(`Pembayaran ${item.code} Berhasil Disimpan!`);
  };

  const handleAddReceipt = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newRcpData.amount) return;
    const item = { id: `rcp-${Date.now()}`, ...newRcpData, amount: Number(newRcpData.amount), status: "Diterima" };
    setReceipts([item, ...receipts]);
    setShowAddRcpModal(false);
    showToast(`Penerimaan ${item.code} Berhasil Disimpan!`);
  };

  const handleTransferBankSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!transferForm.amount) return;
    const trf = {
      id: `bt-${Date.now()}`,
      code: `TRF-BNK-00${bankTransfers.length + 1}`,
      date: new Date().toISOString().split("T")[0],
      ...transferForm,
      amount: Number(transferForm.amount)
    };
    setBankTransfers([trf, ...bankTransfers]);
    setTransferForm({ sourceBank: "Bank Mandiri Operasional", targetBank: "BCA Operasional", amount: "", note: "" });
    showToast("Transfer Bank Berhasil Diproses!");
  };

  return (
    <div className="p-6 space-y-6">
      {toastMsg && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-xs">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Modul Kas dan Bank</h1>
          <p className="text-xs text-slate-500 mt-0.5">Pengelolaan transaksi kas keluar (pembayaran), kas masuk (penerimaan), transfer bank, & histori bank.</p>
        </div>

        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1">
          <button onClick={() => handleTabChange("kas-bank/pembayaran")} className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 ${currentSubTab === "kas-bank/pembayaran" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <ArrowUpRight className="w-3.5 h-3.5" /> <span>Pembayaran</span>
          </button>
          <button onClick={() => handleTabChange("kas-bank/penerimaan")} className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 ${currentSubTab === "kas-bank/penerimaan" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <ArrowDownLeft className="w-3.5 h-3.5" /> <span>Penerimaan</span>
          </button>
          <button onClick={() => handleTabChange("kas-bank/transfer-bank")} className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 ${currentSubTab === "kas-bank/transfer-bank" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <ArrowLeftRight className="w-3.5 h-3.5" /> <span>Transfer Bank</span>
          </button>
          <button onClick={() => handleTabChange("kas-bank/histori-bank")} className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 ${currentSubTab === "kas-bank/histori-bank" ? "bg-[#00c885] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <History className="w-3.5 h-3.5" /> <span>Histori Bank</span>
          </button>
        </div>
      </div>

      {/* SUB 1: PEMBAYARAN */}
      {currentSubTab === "kas-bank/pembayaran" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-red-600" />
                <span>List Pembayaran Kas / Bank ({payments.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar transaksi pengeluaran dan pembayaran dana.</p>
            </div>
            <button onClick={() => setShowAddPayModal(true)} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Pembayaran Baru</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">NO TRANSAKSI</th>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6">PENERIMA</th>
                  <th className="py-3.5 px-6">SUMBER BANK/KAS</th>
                  <th className="py-3.5 px-6 font-mono">NOMINAL</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{p.code}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{p.date}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{p.recipient}</td>
                    <td className="py-4 px-6 text-slate-600">{p.bank}</td>
                    <td className="py-4 px-6 font-mono font-black text-red-600">{formatRupiah(p.amount)}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setPayments(payments.filter(x => x.id !== p.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 2: PENERIMAAN */}
      {currentSubTab === "kas-bank/penerimaan" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                <span>List Penerimaan Kas / Bank ({receipts.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar transaksi penerimaan dan pemasukan dana.</p>
            </div>
            <button onClick={() => setShowAddRcpModal(true)} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Penerimaan Baru</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">NO TRANSAKSI</th>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6">PENGIRIM / NASABAH</th>
                  <th className="py-3.5 px-6">BANK PENERIMA</th>
                  <th className="py-3.5 px-6 font-mono">NOMINAL</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {receipts.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{r.code}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{r.date}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{r.sender}</td>
                    <td className="py-4 px-6 text-slate-600">{r.bank}</td>
                    <td className="py-4 px-6 font-mono font-black text-emerald-600">{formatRupiah(r.amount)}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setReceipts(receipts.filter(x => x.id !== r.id))} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB 3: TRANSFER BANK */}
      {currentSubTab === "kas-bank/transfer-bank" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm border-b pb-3">Form Transfer Antar Bank</h4>
            <form onSubmit={handleTransferBankSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Bank Sumber (Pengirim)</label>
                <select value={transferForm.sourceBank} onChange={(e) => setTransferForm({ ...transferForm, sourceBank: e.target.value })} className="w-full p-2.5 rounded-xl border bg-white">
                  <option value="Bank Mandiri Operasional">Bank Mandiri Operasional</option>
                  <option value="BCA Operasional">BCA Operasional</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Bank Tujuan (Penerima)</label>
                <select value={transferForm.targetBank} onChange={(e) => setTransferForm({ ...transferForm, targetBank: e.target.value })} className="w-full p-2.5 rounded-xl border bg-white">
                  <option value="BCA Operasional">BCA Operasional</option>
                  <option value="Bank Mandiri Operasional">Bank Mandiri Operasional</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Nominal Transfer (Rp)</label>
                <input type="number" required placeholder="Contoh: 10000000" value={transferForm.amount} onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })} className="w-full p-2.5 rounded-xl border font-mono font-bold" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#00c885] hover:bg-[#00b377] text-white font-bold rounded-xl shadow-md">Proses Transfer Bank</button>
            </form>
          </div>
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm border-b pb-3">Riwayat Transfer Antar Bank</h4>
            <div className="space-y-3">
              {bankTransfers.map((t) => (
                <div key={t.id} className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-1.5">
                  <div className="flex justify-between font-extrabold text-slate-900">
                    <span>{t.code} — {formatRupiah(t.amount)}</span>
                    <span className="text-slate-400">{t.date}</span>
                  </div>
                  <p className="text-slate-600 font-semibold">{t.sourceBank} ➔ {t.targetBank}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB 4: HISTORI BANK */}
      {currentSubTab === "kas-bank/histori-bank" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><History className="w-4 h-4 text-emerald-600" /> <span>Histori Transaksi Bank</span></h4>
            <p className="text-xs text-slate-500 mt-0.5">Rekapitulasi mutasi masuk & keluar per rekening bank.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">WAKTU</th>
                  <th className="py-3.5 px-6">REKENING BANK</th>
                  <th className="py-3.5 px-6">TIPE MUTASI</th>
                  <th className="py-3.5 px-6 font-mono">NOMINAL</th>
                  <th className="py-3.5 px-6">KETERANGAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bankHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono text-slate-500">{h.time}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{h.bank}</td>
                    <td className="py-4 px-6 font-bold">{h.type}</td>
                    <td className="py-4 px-6 font-mono font-black">{h.amount}</td>
                    <td className="py-4 px-6 text-slate-600">{h.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL CREATE PEMBAYARAN */}
      {showAddPayModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between border-b pb-3"><h3 className="font-extrabold text-slate-900">Create Pembayaran Baru</h3><button onClick={() => setShowAddPayModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleAddPayment} className="space-y-3 text-xs font-semibold">
              <div><label className="block mb-1">Nama Penerima / Vendor</label><input type="text" required value={newPayData.recipient} onChange={(e) => setNewPayData({ ...newPayData, recipient: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div><label className="block mb-1">Nominal Pembayaran (Rp)</label><input type="number" required value={newPayData.amount} onChange={(e) => setNewPayData({ ...newPayData, amount: e.target.value })} className="w-full p-2.5 border rounded-xl font-mono font-bold" /></div>
              <div className="pt-3 flex justify-end gap-3 border-t"><button type="button" onClick={() => setShowAddPayModal(false)} className="px-4 py-2 font-bold text-slate-600">Batal</button><button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Simpan Pembayaran</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREATE PENERIMAAN */}
      {showAddRcpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between border-b pb-3"><h3 className="font-extrabold text-slate-900">Create Penerimaan Baru</h3><button onClick={() => setShowAddRcpModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleAddReceipt} className="space-y-3 text-xs font-semibold">
              <div><label className="block mb-1">Nama Pengirim / Nasabah</label><input type="text" required value={newRcpData.sender} onChange={(e) => setNewRcpData({ ...newRcpData, sender: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
              <div><label className="block mb-1">Nominal Penerimaan (Rp)</label><input type="number" required value={newRcpData.amount} onChange={(e) => setNewRcpData({ ...newRcpData, amount: e.target.value })} className="w-full p-2.5 border rounded-xl font-mono font-bold" /></div>
              <div className="pt-3 flex justify-end gap-3 border-t"><button type="button" onClick={() => setShowAddRcpModal(false)} className="px-4 py-2 font-bold text-slate-600">Batal</button><button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Simpan Penerimaan</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
