import { useState, useEffect, useCallback, type FormEvent } from "react";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  History,
  Plus,
  Edit,
  Trash2,
  X,
  ArrowLeft,
  Save,
  Loader2
} from "lucide-react";
import type { OperationalModuleProps } from "../types";
import { CurrencyInput } from "../../../components/common/CurrencyInput";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import { getUrlFormParams, setUrlFormParams, usePopStateSync } from "../useFormViewUrlSync";

type FormViewState = "list" | "create" | "edit";

interface POLine {
  id?: string | number;
  item_description: string;
  qty: number | string;
  unit_price: number | string;
  subtotal?: number | string;
}

interface PORecord {
  id: string | number;
  po_no: string;
  po_date: string;
  status: string;
  total_amount: number | string;
  vendor_id?: string | number;
  vendor?: { id: string | number; name: string };
  lines?: POLine[];
}

interface TransactionRecord {
  id: string | number;
  transaction_date: string;
  vendor_id?: string | number | null;
  coa_id: string | number;
  amount: number | string;
  description?: string;
  vendor?: { id: string | number; name: string };
  chart_of_account?: { id: string | number; code: string; name: string };
}

export const PembelianModule = ({ activeSubTab = "pembelian/pesanan-pembelian" }: OperationalModuleProps) => {
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

  // Real vendor list (used by PO / Pembayaran Pembelian dropdowns — separate
  // from the local mock "Pemasok" list below, which stays out of scope)
  const [vendorOptions, setVendorOptions] = useState<{ id: string | number; name: string }[]>([]);
  const [coaList, setCoaList] = useState<{ id: string | number; code: string; name: string }[]>([]);
  useEffect(() => {
    if (currentSubTab === "pembelian/pesanan-pembelian" || currentSubTab === "pembelian/pembayaran-pembelian") {
      api.getVendors().then(setVendorOptions).catch(() => setVendorOptions([]));
    }
    if (currentSubTab === "pembelian/pembayaran-pembelian" && officeId) {
      api.getCOA({ office_id: officeId }).then(setCoaList).catch(() => setCoaList([]));
    }
  }, [currentSubTab, officeId]);

  // =========================================================================
  // 1. PESANAN PEMBELIAN (PO) — real backend, with line items
  // =========================================================================
  const [purchaseOrders, setPurchaseOrders] = useState<PORecord[]>([]);
  const [poLoading, setPoLoading] = useState(true);
  const [poSaving, setPoSaving] = useState(false);
  const [poView, setPoView] = useState<FormViewState>("list");
  const [editingPo, setEditingPo] = useState<PORecord | null>(null);
  const emptyPoMeta = { po_no: `PO-${Date.now()}`, po_date: new Date().toISOString().slice(0, 10), vendor_id: "" };
  const [newPoMeta, setNewPoMeta] = useState(emptyPoMeta);
  const emptyPoLines: POLine[] = [{ item_description: "", qty: 1, unit_price: "" }];
  const [newPoLines, setNewPoLines] = useState<POLine[]>(emptyPoLines);
  const [editPoStatus, setEditPoStatus] = useState("");

  const fetchPurchaseOrders = useCallback(async () => {
    if (!officeId) return;
    setPoLoading(true);
    try {
      setPurchaseOrders(await api.getPurchaseOrders({ office_id: officeId }));
    } catch {
      showToast("Gagal memuat Pesanan Pembelian", "error");
    } finally {
      setPoLoading(false);
    }
  }, [officeId, showToast]);

  useEffect(() => {
    if (currentSubTab === "pembelian/pesanan-pembelian") fetchPurchaseOrders();
  }, [currentSubTab, fetchPurchaseOrders]);

  const openCreatePO = () => {
    setNewPoMeta({ po_no: `PO-${Date.now()}`, po_date: new Date().toISOString().slice(0, 10), vendor_id: "" });
    setNewPoLines([{ item_description: "", qty: 1, unit_price: "" }]);
    setEditingPo(null);
    setPoView("create");
    setUrlFormParams("create");
  };
  const openEditPO = (po: PORecord) => {
    setNewPoMeta({ po_no: po.po_no, po_date: po.po_date, vendor_id: String(po.vendor_id ?? "") });
    setEditPoStatus(po.status);
    setEditingPo(po);
    setPoView("edit");
    setUrlFormParams("edit", String(po.id));
  };
  const backToPOList = () => {
    setPoView("list");
    setEditingPo(null);
    setUrlFormParams("list");
  };
  const updatePoLine = (idx: number, field: keyof POLine, value: string) => {
    setNewPoLines(newPoLines.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };
  const addPoLine = () => setNewPoLines([...newPoLines, { item_description: "", qty: 1, unit_price: "" }]);
  const removePoLine = (idx: number) => {
    if (newPoLines.length <= 1) return;
    setNewPoLines(newPoLines.filter((_, i) => i !== idx));
  };
  const poLinesTotal = newPoLines.reduce((sum, l) => sum + (Number(l.qty) || 0) * (Number(l.unit_price) || 0), 0);

  const handleSavePO = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!officeId) return;
    setPoSaving(true);
    try {
      if (editingPo) {
        await api.updatePurchaseOrder(editingPo.id, { status: editPoStatus });
        showToast(`Pesanan Pembelian ${editingPo.po_no} Berhasil Diperbarui!`);
      } else {
        if (!newPoMeta.vendor_id || newPoLines.some((l) => !l.item_description || !l.unit_price)) {
          showToast("Lengkapi pemasok dan setiap baris item terlebih dahulu", "error");
          setPoSaving(false);
          return;
        }
        await api.addPurchaseOrder({
          po_no: newPoMeta.po_no,
          vendor_id: newPoMeta.vendor_id,
          office_id: officeId,
          po_date: newPoMeta.po_date,
          lines: newPoLines.map((l) => ({ item_description: l.item_description, qty: Number(l.qty) || 1, unit_price: Number(l.unit_price) || 0 }))
        });
        showToast(`Pesanan Pembelian ${newPoMeta.po_no} Berhasil Dibuat!`);
      }
      await fetchPurchaseOrders();
      backToPOList();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan Pesanan Pembelian", "error");
    } finally {
      setPoSaving(false);
    }
  };
  const handleDeletePO = async (id: string | number) => {
    try {
      await api.deletePurchaseOrder(id);
      await fetchPurchaseOrders();
      showToast("Pesanan Pembelian Berhasil Dihapus.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus PO", "error");
    }
  };

  useEffect(() => {
    if (currentSubTab !== "pembelian/pesanan-pembelian" || poLoading) return;
    const params = getUrlFormParams();
    if (params.view === "create") openCreatePO();
    else if (params.view === "edit" && params.id) {
      const found = purchaseOrders.find((x) => String(x.id) === params.id);
      if (found) openEditPO(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poLoading]);
  usePopStateSync(useCallback(() => {
    if (getUrlFormParams().view === "list") backToPOList();
  }, []));

  // =========================================================================
  // 2. PEMBAYARAN PEMBELIAN — thin wrapper over FinancialTransaction (transaction_type = "pembayaran")
  // =========================================================================
  const [purchasePayments, setPurchasePayments] = useState<TransactionRecord[]>([]);
  const [ppLoading, setPpLoading] = useState(true);
  const [ppSaving, setPpSaving] = useState(false);
  const [ppView, setPpView] = useState<FormViewState>("list");
  const [editingPp, setEditingPp] = useState<TransactionRecord | null>(null);
  const emptyPpForm = { date: new Date().toISOString().slice(0, 10), poNo: "", vendor_id: "", coa_id: "", amount: "" };
  const [newPpData, setNewPpData] = useState(emptyPpForm);

  const fetchPurchasePayments = useCallback(async () => {
    if (!officeId) return;
    setPpLoading(true);
    try {
      const data: TransactionRecord[] = await api.getTransactions({ office_id: officeId, transaction_type: "pembayaran" });
      setPurchasePayments(data.filter((t) => t.vendor_id));
    } catch {
      showToast("Gagal memuat Pembayaran Pembelian", "error");
    } finally {
      setPpLoading(false);
    }
  }, [officeId, showToast]);

  useEffect(() => {
    if (currentSubTab === "pembelian/pembayaran-pembelian") fetchPurchasePayments();
  }, [currentSubTab, fetchPurchasePayments]);

  const openCreatePurchasePayment = () => {
    setNewPpData(emptyPpForm);
    setEditingPp(null);
    setPpView("create");
    setUrlFormParams("create");
  };
  const openEditPurchasePayment = (pp: TransactionRecord) => {
    const poMatch = pp.description?.match(/PO-\S+/)?.[0] || "";
    setNewPpData({ date: pp.transaction_date, poNo: poMatch, vendor_id: String(pp.vendor_id ?? ""), coa_id: String(pp.coa_id ?? ""), amount: String(pp.amount) });
    setEditingPp(pp);
    setPpView("edit");
    setUrlFormParams("edit", String(pp.id));
  };
  const backToPPList = () => {
    setPpView("list");
    setEditingPp(null);
    setUrlFormParams("list");
  };
  const handleSavePurchasePayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!officeId || !newPpData.amount) return;
    setPpSaving(true);
    try {
      if (editingPp) {
        await api.updateTransaction(editingPp.id, { amount: Number(newPpData.amount), transaction_date: newPpData.date, description: `Pembayaran ${newPpData.poNo}` });
        showToast("Pembayaran Pembelian Berhasil Diperbarui!");
      } else {
        if (!newPpData.vendor_id || !newPpData.coa_id) return;
        await api.addTransaction({
          transaction_type: "pembayaran",
          office_id: officeId,
          coa_id: newPpData.coa_id,
          vendor_id: newPpData.vendor_id,
          amount: Number(newPpData.amount),
          transaction_date: newPpData.date,
          description: `Pembayaran ${newPpData.poNo}`
        });
        showToast("Pembayaran Pembelian Berhasil Disimpan!");
      }
      await fetchPurchasePayments();
      backToPPList();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan Pembayaran Pembelian", "error");
    } finally {
      setPpSaving(false);
    }
  };
  const handleDeletePurchasePayment = async (id: string | number) => {
    try {
      await api.deleteTransaction(id);
      await fetchPurchasePayments();
      showToast("Pembayaran Pembelian Berhasil Dihapus.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus Pembayaran Pembelian", "error");
    }
  };

  useEffect(() => {
    if (currentSubTab !== "pembelian/pembayaran-pembelian" || ppLoading) return;
    const params = getUrlFormParams();
    if (params.view === "create") openCreatePurchasePayment();
    else if (params.view === "edit" && params.id) {
      const found = purchasePayments.find((x) => String(x.id) === params.id);
      if (found) openEditPurchasePayment(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ppLoading]);
  usePopStateSync(useCallback(() => {
    if (getUrlFormParams().view === "list") backToPPList();
  }, []));

  // =========================================================================
  // 3. PEMASOK (Vendor) — stays local/mock, out of scope
  // =========================================================================
  const [vendors, setVendors] = useState([
    { id: "vnd-1", code: "VND-001", name: "PT Logistik Perkasa", contact: "Hendra Wijaya", phone: "(021) 888-1122", address: "Jl. Industri Raya No. 12, Bekasi", status: "Aktif" },
    { id: "vnd-2", code: "VND-002", name: "CV Mitra Utama", contact: "Agus Pratama", phone: "(021) 444-9900", address: "Jl. Rungkut Industri No. 5, Surabaya", status: "Aktif" }
  ]);
  const [showAddVndModal, setShowAddVndModal] = useState(false);
  const [newVndData, setNewVndData] = useState({ code: `VND-00${vendors.length + 1}`, name: "", contact: "", phone: "", address: "" });

  const handleAddVendor = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newVndData.name) return;
    const item = { id: `vnd-${Date.now()}`, ...newVndData, status: "Aktif" };
    setVendors([...vendors, item]);
    setShowAddVndModal(false);
    showToast(`Pemasok ${item.name} Berhasil Ditambahkan!`);
  };

  // =========================================================================
  // 4. LOG AKTIVITAS PEMBELIAN — stays local/mock, out of scope
  // =========================================================================
  const [purLogs] = useState([
    { id: "plog-1", time: "2026-07-29 11:20", user: "Staff Procurement", action: "Penerbitan PO Baru", detail: "Menerbitkan pesanan pembelian PO-2026-045" },
    { id: "plog-2", time: "2026-07-28 15:40", user: "Manager Pembelian", action: "Pelunasan Tagihan PO", detail: "Pembayaran PO-2026-044 senilai Rp 35.000.000" }
  ]);

  return (
    <div className="p-6 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Modul Pembelian</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manajemen pesanan pembelian (PO), pembayaran pembelian, data pemasok, & log aktivitas.</p>
        </div>
      </div>

      {/* SUB 1: PESANAN PEMBELIAN */}
      {currentSubTab === "pembelian/pesanan-pembelian" && (poView === "list" ? (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-emerald-600" /> <span>List Pesanan Pembelian / PO ({purchaseOrders.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar PO yang diterbitkan ke pemasok.</p>
            </div>
            <button onClick={openCreatePO} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
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
                {poLoading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-400">Memuat data...</td></tr>
                ) : purchaseOrders.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-400">Belum ada Pesanan Pembelian.</td></tr>
                ) : purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{po.po_no}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{po.po_date}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{po.vendor?.name || "-"}</td>
                    <td className="py-4 px-6 font-mono font-black text-slate-900">{formatRupiah(po.total_amount)}</td>
                    <td className="py-4 px-6 text-center"><span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">{po.status}</span></td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => openEditPO(po)} title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeletePO(po.id)} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={backToPOList} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                <ShoppingCart className="w-4 h-4" />
                <span>Pembelian / Pesanan Pembelian</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {poView === "edit" ? `Edit PO ${newPoMeta.po_no}` : "Create Pesanan Pembelian (PO)"}
              </h1>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-6">
            <form onSubmit={handleSavePO} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">Nomor PO</label>
                  <input type="text" required disabled value={newPoMeta.po_no} className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 font-mono font-bold opacity-60" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Tanggal</label>
                  <input type="date" required disabled={poView === "edit"} value={newPoMeta.po_date} onChange={(e) => setNewPoMeta({ ...newPoMeta, po_date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 disabled:opacity-60" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-700 mb-1">Pemasok / Vendor</label>
                  <select disabled={poView === "edit"} required value={newPoMeta.vendor_id} onChange={(e) => setNewPoMeta({ ...newPoMeta, vendor_id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 cursor-pointer disabled:opacity-60">
                    <option value="">Pilih vendor...</option>
                    {vendorOptions.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              </div>

              {poView === "edit" ? (
                <div className="space-y-3">
                  <p className="text-slate-700 font-bold">Item Pesanan (tidak dapat diubah)</p>
                  {(editingPo?.lines || []).map((l, i) => (
                    <div key={l.id ?? i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                      <span>{l.item_description} × {l.qty}</span>
                      <span className="font-mono">{formatRupiah(l.subtotal ?? (Number(l.qty) * Number(l.unit_price)))}</span>
                    </div>
                  ))}
                  <div>
                    <label className="block text-slate-700 mb-1">Status PO</label>
                    <select value={editPoStatus} onChange={(e) => setEditPoStatus(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 cursor-pointer">
                      <option value="Draft">Draft</option>
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Disetujui">Disetujui</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-700 font-bold">Item Pesanan</p>
                    <button type="button" onClick={addPoLine} className="text-emerald-600 font-bold flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" /> Tambah Item
                    </button>
                  </div>
                  {newPoLines.map((line, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input type="text" required placeholder="Deskripsi item" value={line.item_description} onChange={(e) => updatePoLine(idx, "item_description", e.target.value)} className="col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500" />
                      <input type="number" min={1} placeholder="Qty" value={line.qty} onChange={(e) => updatePoLine(idx, "qty", e.target.value)} className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-emerald-500" />
                      <CurrencyInput required placeholder="Harga satuan" value={line.unit_price} onChange={(raw) => updatePoLine(idx, "unit_price", raw)} className="col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-emerald-500" />
                      <button type="button" onClick={() => removePoLine(idx)} disabled={newPoLines.length <= 1} className="col-span-1 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex justify-end pt-2 font-mono font-bold text-slate-900">
                    Total: {formatRupiah(poLinesTotal)}
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={backToPOList} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={poSaving} className="flex items-center gap-1.5 px-5 py-2 bg-[#00c885] hover:bg-[#00b377] text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-colors cursor-pointer disabled:opacity-60">
                  {poSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{poView === "edit" ? "Simpan Perubahan" : "Terbit PO Baru"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ))}

      {/* SUB 2: PEMBAYARAN PEMBELIAN */}
      {currentSubTab === "pembelian/pembayaran-pembelian" && (ppView === "list" ? (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><CreditCard className="w-4 h-4 text-emerald-600" /> <span>List Pembayaran Pembelian ({purchasePayments.length})</span></h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar realisasi pelunasan faktur tagihan dari pemasok.</p>
            </div>
            <button onClick={openCreatePurchasePayment} className="bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> <span>Create Pembayaran Pembelian</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6">NO PO TERIKAT</th>
                  <th className="py-3.5 px-6">PEMASOK</th>
                  <th className="py-3.5 px-6 font-mono">NOMINAL</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {ppLoading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400">Memuat data...</td></tr>
                ) : purchasePayments.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400">Belum ada Pembayaran Pembelian.</td></tr>
                ) : purchasePayments.map((pp) => (
                  <tr key={pp.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono text-slate-500">{pp.transaction_date}</td>
                    <td className="py-4 px-6 font-bold text-indigo-600">{pp.description?.match(/PO-\S+/)?.[0] || "-"}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{pp.vendor?.name || "-"}</td>
                    <td className="py-4 px-6 font-mono font-black text-slate-900">{formatRupiah(pp.amount)}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => openEditPurchasePayment(pp)} title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeletePurchasePayment(pp.id)} title="Hapus" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
            <button onClick={backToPPList} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Pembelian / Pembayaran Pembelian</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {ppView === "edit" ? "Edit Pembayaran Pembelian" : "Create Pembayaran Pembelian"}
              </h1>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-6">
            <form onSubmit={handleSavePurchasePayment} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">Tanggal</label>
                  <input type="date" required value={newPpData.date} onChange={(e) => setNewPpData({ ...newPpData, date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">No PO Terikat</label>
                  <input type="text" required placeholder="Contoh: PO-2026-044" value={newPpData.poNo} onChange={(e) => setNewPpData({ ...newPpData, poNo: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold focus:outline-emerald-500" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Pemasok</label>
                  <select disabled={ppView === "edit"} required value={newPpData.vendor_id} onChange={(e) => setNewPpData({ ...newPpData, vendor_id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 cursor-pointer disabled:opacity-60">
                    <option value="">Pilih vendor...</option>
                    {vendorOptions.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Dibayar dari Akun</label>
                  <select disabled={ppView === "edit"} required value={newPpData.coa_id} onChange={(e) => setNewPpData({ ...newPpData, coa_id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 cursor-pointer disabled:opacity-60">
                    <option value="">Pilih akun kas/bank...</option>
                    {coaList.map((c) => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-700 mb-1">Nominal Pembayaran (Rp)</label>
                  <CurrencyInput required value={newPpData.amount} onChange={(raw) => setNewPpData({ ...newPpData, amount: raw })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold focus:outline-emerald-500" />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={backToPPList} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={ppSaving} className="flex items-center gap-1.5 px-5 py-2 bg-[#00c885] hover:bg-[#00b377] text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-colors cursor-pointer disabled:opacity-60">
                  {ppSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{ppView === "edit" ? "Simpan Perubahan" : "Simpan Pembayaran"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ))}

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
