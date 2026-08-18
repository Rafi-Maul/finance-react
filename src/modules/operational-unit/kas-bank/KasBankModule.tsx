import { useState, useEffect, useCallback, type FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  Loader2
} from "lucide-react";
import type { OperationalModuleProps } from "../types";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import { getUrlFormParams, setUrlFormParams, usePopStateSync } from "../useFormViewUrlSync";

type FormViewState = "list" | "create" | "edit";

interface TransactionRecord {
  id: string | number;
  transaction_type: "pembayaran" | "penerimaan" | "transfer";
  coa_id: string | number;
  vendor_id?: string | number | null;
  customer_id?: string | number | null;
  amount: number | string;
  transaction_date: string;
  description?: string;
  chart_of_account?: { id: string | number; code: string; name: string };
  vendor?: { id: string | number; name: string };
  customer?: { id: string | number; name: string };
}

export const KasBankModule = ({ activeSubTab = "kas-bank/pembayaran" }: OperationalModuleProps) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab);

  useEffect(() => {
    if (activeSubTab) {
      setCurrentSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  const { showToast } = useToast();
  const { currentUser } = useAuth();
  const officeId = currentUser?.office?.id;

  const formatRupiah = (num: number | string) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(num));

  // Shared lookups for Pembayaran / Penerimaan dropdowns
  const [coaList, setCoaList] = useState<{ id: string | number; code: string; name: string }[]>([]);
  const [vendorList, setVendorList] = useState<{ id: string | number; name: string }[]>([]);
  const [customerList, setCustomerList] = useState<{ id: string | number; name: string }[]>([]);
  useEffect(() => {
    if (!officeId) return;
    if (currentSubTab === "kas-bank/pembayaran" || currentSubTab === "kas-bank/penerimaan") {
      api.getCOA({ office_id: officeId }).then(setCoaList).catch(() => setCoaList([]));
    }
    if (currentSubTab === "kas-bank/pembayaran") {
      api.getVendors().then(setVendorList).catch(() => setVendorList([]));
    }
    if (currentSubTab === "kas-bank/penerimaan") {
      api.getCustomers().then(setCustomerList).catch(() => setCustomerList([]));
    }
  }, [currentSubTab, officeId]);

  // =========================================================================
  // 1. PEMBAYARAN — FinancialTransaction (transaction_type = "pembayaran")
  // =========================================================================
  const [payments, setPayments] = useState<TransactionRecord[]>([]);
  const [payLoading, setPayLoading] = useState(true);
  const [paySaving, setPaySaving] = useState(false);
  const [payView, setPayView] = useState<FormViewState>("list");
  const [editingPay, setEditingPay] = useState<TransactionRecord | null>(null);
  const emptyPayForm = { date: new Date().toISOString().slice(0, 10), vendor_id: "", coa_id: "", amount: "", description: "" };
  const [newPayData, setNewPayData] = useState(emptyPayForm);

  const fetchPayments = useCallback(async () => {
    if (!officeId) return;
    setPayLoading(true);
    try {
      setPayments(await api.getTransactions({ office_id: officeId, transaction_type: "pembayaran" }));
    } catch {
      showToast("Gagal memuat Pembayaran", "error");
    } finally {
      setPayLoading(false);
    }
  }, [officeId, showToast]);

  useEffect(() => {
    if (currentSubTab === "kas-bank/pembayaran") fetchPayments();
  }, [currentSubTab, fetchPayments]);

  const openCreatePayment = () => {
    setNewPayData(emptyPayForm);
    setEditingPay(null);
    setPayView("create");
    setUrlFormParams("create");
  };
  const openEditPayment = (p: TransactionRecord) => {
    setNewPayData({ date: p.transaction_date, vendor_id: String(p.vendor_id ?? ""), coa_id: String(p.coa_id ?? ""), amount: String(p.amount), description: p.description || "" });
    setEditingPay(p);
    setPayView("edit");
    setUrlFormParams("edit", String(p.id));
  };
  const backToPaymentList = () => {
    setPayView("list");
    setEditingPay(null);
    setUrlFormParams("list");
  };
  const handleSavePayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!officeId || !newPayData.amount) return;
    setPaySaving(true);
    try {
      if (editingPay) {
        await api.updateTransaction(editingPay.id, { amount: Number(newPayData.amount), transaction_date: newPayData.date, description: newPayData.description });
        showToast("Pembayaran Berhasil Diperbarui!");
      } else {
        if (!newPayData.vendor_id || !newPayData.coa_id) return;
        await api.addTransaction({
          transaction_type: "pembayaran",
          office_id: officeId,
          coa_id: newPayData.coa_id,
          vendor_id: newPayData.vendor_id,
          amount: Number(newPayData.amount),
          transaction_date: newPayData.date,
          description: newPayData.description
        });
        showToast("Pembayaran Berhasil Disimpan!");
      }
      await fetchPayments();
      backToPaymentList();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan Pembayaran", "error");
    } finally {
      setPaySaving(false);
    }
  };
  const handleDeletePayment = async (id: string | number) => {
    try {
      await api.deleteTransaction(id);
      await fetchPayments();
      showToast("Pembayaran Berhasil Dihapus.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus Pembayaran", "error");
    }
  };

  useEffect(() => {
    if (currentSubTab !== "kas-bank/pembayaran" || payLoading) return;
    const params = getUrlFormParams();
    if (params.view === "create") openCreatePayment();
    else if (params.view === "edit" && params.id) {
      const found = payments.find((x) => String(x.id) === params.id);
      if (found) openEditPayment(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payLoading]);
  usePopStateSync(useCallback(() => {
    if (getUrlFormParams().view === "list") backToPaymentList();
  }, []));

  // =========================================================================
  // 2. PENERIMAAN — FinancialTransaction (transaction_type = "penerimaan")
  // =========================================================================
  const [receipts, setReceipts] = useState<TransactionRecord[]>([]);
  const [rcpLoading, setRcpLoading] = useState(true);
  const [rcpSaving, setRcpSaving] = useState(false);
  const [rcpView, setRcpView] = useState<FormViewState>("list");
  const [editingRcp, setEditingRcp] = useState<TransactionRecord | null>(null);
  const emptyRcpForm = { date: new Date().toISOString().slice(0, 10), customer_id: "", coa_id: "", amount: "", description: "" };
  const [newRcpData, setNewRcpData] = useState(emptyRcpForm);

  const fetchReceipts = useCallback(async () => {
    if (!officeId) return;
    setRcpLoading(true);
    try {
      setReceipts(await api.getTransactions({ office_id: officeId, transaction_type: "penerimaan" }));
    } catch {
      showToast("Gagal memuat Penerimaan", "error");
    } finally {
      setRcpLoading(false);
    }
  }, [officeId, showToast]);

  useEffect(() => {
    if (currentSubTab === "kas-bank/penerimaan") fetchReceipts();
  }, [currentSubTab, fetchReceipts]);

  const openCreateReceipt = () => {
    setNewRcpData(emptyRcpForm);
    setEditingRcp(null);
    setRcpView("create");
    setUrlFormParams("create");
  };
  const openEditReceipt = (r: TransactionRecord) => {
    setNewRcpData({ date: r.transaction_date, customer_id: String(r.customer_id ?? ""), coa_id: String(r.coa_id ?? ""), amount: String(r.amount), description: r.description || "" });
    setEditingRcp(r);
    setRcpView("edit");
    setUrlFormParams("edit", String(r.id));
  };
  const backToReceiptList = () => {
    setRcpView("list");
    setEditingRcp(null);
    setUrlFormParams("list");
  };
  const handleSaveReceipt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!officeId || !newRcpData.amount) return;
    setRcpSaving(true);
    try {
      if (editingRcp) {
        await api.updateTransaction(editingRcp.id, { amount: Number(newRcpData.amount), transaction_date: newRcpData.date, description: newRcpData.description });
        showToast("Penerimaan Berhasil Diperbarui!");
      } else {
        if (!newRcpData.customer_id || !newRcpData.coa_id) return;
        await api.addTransaction({
          transaction_type: "penerimaan",
          office_id: officeId,
          coa_id: newRcpData.coa_id,
          customer_id: newRcpData.customer_id,
          amount: Number(newRcpData.amount),
          transaction_date: newRcpData.date,
          description: newRcpData.description
        });
        showToast("Penerimaan Berhasil Disimpan!");
      }
      await fetchReceipts();
      backToReceiptList();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan Penerimaan", "error");
    } finally {
      setRcpSaving(false);
    }
  };
  const handleDeleteReceipt = async (id: string | number) => {
    try {
      await api.deleteTransaction(id);
      await fetchReceipts();
      showToast("Penerimaan Berhasil Dihapus.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus Penerimaan", "error");
    }
  };

  useEffect(() => {
    if (currentSubTab !== "kas-bank/penerimaan" || rcpLoading) return;
    const params = getUrlFormParams();
    if (params.view === "create") openCreateReceipt();
    else if (params.view === "edit" && params.id) {
      const found = receipts.find((x) => String(x.id) === params.id);
      if (found) openEditReceipt(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rcpLoading]);
  usePopStateSync(useCallback(() => {
    if (getUrlFormParams().view === "list") backToReceiptList();
  }, []));

  // =========================================================================
  // 3. TRANSFER BANK — stays local/mock, out of scope
  // =========================================================================
  const [bankTransfers, setBankTransfers] = useState([
    { id: "bt-1", code: "TRF-BNK-001", date: "2026-07-26", sourceBank: "Bank Mandiri Operasional", targetBank: "BCA Operasional", amount: 50000000, note: "Top-up saldo kas operasional BCA" }
  ]);
  const [transferForm, setTransferForm] = useState({ sourceBank: "Bank Mandiri Operasional", targetBank: "BCA Operasional", amount: "", note: "" });

  // =========================================================================
  // 4. HISTORI BANK — stays local/mock, out of scope
  // =========================================================================
  const [bankHistory] = useState([
    { id: "his-1", time: "2026-07-29 14:20", bank: "Bank Mandiri (122-00-9876543-2)", type: "Kredit (Keluar)", amount: "Rp 12.500.000", desc: "Pembayaran Vendor PAY-2026-001", balance: "Rp 237.500.000" },
    { id: "his-2", time: "2026-07-29 10:15", bank: "BCA Operasional (883-00-112233-1)", type: "Debet (Masuk)", amount: "Rp 18.500.000", desc: "Penerimaan Invoice RCP-2026-002", balance: "Rp 148.500.000" }
  ]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Modul Kas dan Bank</h1>
          <p className="text-xs text-slate-500 mt-0.5">Pengelolaan transaksi kas keluar (pembayaran), kas masuk (penerimaan), transfer bank, & histori bank.</p>
        </div>
      </div>

      {/* SUB 1: PEMBAYARAN */}
      {currentSubTab === "kas-bank/pembayaran" && (payView === "list" ? (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-red-600" />
                <span>List Pembayaran Kas / Bank ({payments.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar transaksi pengeluaran dan pembayaran dana.</p>
            </div>
            <button onClick={openCreatePayment} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Pembayaran Baru</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6">PENERIMA</th>
                  <th className="py-3.5 px-6">SUMBER BANK/KAS</th>
                  <th className="py-3.5 px-6 font-mono">NOMINAL</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payLoading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400">Memuat data...</td></tr>
                ) : payments.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400">Belum ada Pembayaran.</td></tr>
                ) : payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-4 px-6 font-mono text-slate-500">{p.transaction_date}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{p.vendor?.name || "-"}</td>
                    <td className="py-4 px-6 text-slate-600">{p.chart_of_account ? `${p.chart_of_account.code} - ${p.chart_of_account.name}` : "-"}</td>
                    <td className="py-4 px-6 font-mono font-black text-red-600">{formatRupiah(p.amount)}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEditPayment(p)} title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeletePayment(p.id)} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={backToPaymentList} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                <ArrowUpRight className="w-4 h-4" />
                <span>Kas & Bank / Pembayaran</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {payView === "edit" ? "Edit Pembayaran" : "Create Pembayaran Baru"}
              </h1>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-6">
            <form onSubmit={handleSavePayment} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">Tanggal</label>
                  <input type="date" required value={newPayData.date} onChange={(e) => setNewPayData({ ...newPayData, date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Nominal Pembayaran (Rp)</label>
                  <input type="number" required value={newPayData.amount} onChange={(e) => setNewPayData({ ...newPayData, amount: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold focus:outline-emerald-500" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Penerima / Vendor</label>
                  <select disabled={payView === "edit"} required value={newPayData.vendor_id} onChange={(e) => setNewPayData({ ...newPayData, vendor_id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 cursor-pointer disabled:opacity-60">
                    <option value="">Pilih vendor...</option>
                    {vendorList.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Sumber Bank / Kas</label>
                  <select disabled={payView === "edit"} required value={newPayData.coa_id} onChange={(e) => setNewPayData({ ...newPayData, coa_id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 cursor-pointer disabled:opacity-60">
                    <option value="">Pilih akun kas/bank...</option>
                    {coaList.map((c) => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-700 mb-1">Keterangan</label>
                  <input type="text" value={newPayData.description} onChange={(e) => setNewPayData({ ...newPayData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500" />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={backToPaymentList} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={paySaving} className="flex items-center gap-1.5 px-5 py-2 bg-[#00c885] hover:bg-[#00b377] text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-colors cursor-pointer disabled:opacity-60">
                  {paySaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{payView === "edit" ? "Simpan Perubahan" : "Simpan Pembayaran"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ))}

      {/* SUB 2: PENERIMAAN */}
      {currentSubTab === "kas-bank/penerimaan" && (rcpView === "list" ? (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                <span>List Penerimaan Kas / Bank ({receipts.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar transaksi penerimaan dan pemasukan dana.</p>
            </div>
            <button onClick={openCreateReceipt} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Penerimaan Baru</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6">PENGIRIM / NASABAH</th>
                  <th className="py-3.5 px-6">BANK PENERIMA</th>
                  <th className="py-3.5 px-6 font-mono">NOMINAL</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {rcpLoading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400">Memuat data...</td></tr>
                ) : receipts.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400">Belum ada Penerimaan.</td></tr>
                ) : receipts.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="py-4 px-6 font-mono text-slate-500">{r.transaction_date}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{r.customer?.name || "-"}</td>
                    <td className="py-4 px-6 text-slate-600">{r.chart_of_account ? `${r.chart_of_account.code} - ${r.chart_of_account.name}` : "-"}</td>
                    <td className="py-4 px-6 font-mono font-black text-emerald-600">{formatRupiah(r.amount)}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEditReceipt(r)} title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteReceipt(r.id)} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={backToReceiptList} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                <ArrowDownLeft className="w-4 h-4" />
                <span>Kas & Bank / Penerimaan</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {rcpView === "edit" ? "Edit Penerimaan" : "Create Penerimaan Baru"}
              </h1>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-6">
            <form onSubmit={handleSaveReceipt} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">Tanggal</label>
                  <input type="date" required value={newRcpData.date} onChange={(e) => setNewRcpData({ ...newRcpData, date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Nominal Penerimaan (Rp)</label>
                  <input type="number" required value={newRcpData.amount} onChange={(e) => setNewRcpData({ ...newRcpData, amount: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold focus:outline-emerald-500" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Pengirim / Nasabah</label>
                  <select disabled={rcpView === "edit"} required value={newRcpData.customer_id} onChange={(e) => setNewRcpData({ ...newRcpData, customer_id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 cursor-pointer disabled:opacity-60">
                    <option value="">Pilih nasabah...</option>
                    {customerList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Bank Penerima</label>
                  <select disabled={rcpView === "edit"} required value={newRcpData.coa_id} onChange={(e) => setNewRcpData({ ...newRcpData, coa_id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 cursor-pointer disabled:opacity-60">
                    <option value="">Pilih akun kas/bank...</option>
                    {coaList.map((c) => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-700 mb-1">Keterangan</label>
                  <input type="text" value={newRcpData.description} onChange={(e) => setNewRcpData({ ...newRcpData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500" />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={backToReceiptList} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={rcpSaving} className="flex items-center gap-1.5 px-5 py-2 bg-[#00c885] hover:bg-[#00b377] text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-colors cursor-pointer disabled:opacity-60">
                  {rcpSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{rcpView === "edit" ? "Simpan Perubahan" : "Simpan Penerimaan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ))}

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

    </div>
  );
};
