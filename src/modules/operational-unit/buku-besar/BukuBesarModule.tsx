import { useState, useEffect, useCallback, type FormEvent } from "react";
import {
  BookOpen,
  FileSpreadsheet,
  CreditCard,
  PieChart,
  ArrowLeftRight,
  History,
  Plus,
  Edit,
  Trash2,
  X,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Save,
  Send,
  Loader2
} from "lucide-react";
import type { OperationalModuleProps } from "../types";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import { getUrlFormParams, setUrlFormParams, usePopStateSync } from "../useFormViewUrlSync";

type FormViewState = "list" | "create" | "edit";

interface JournalLine {
  id?: string | number;
  coa_id: string | number;
  debit: number | string;
  kredit: number | string;
  description?: string;
  chart_of_account?: { id: string | number; code: string; name: string };
}

interface JournalRecord {
  id: string | number;
  journal_no: string;
  journal_date: string;
  journal_type: string;
  status: string;
  description?: string;
  lines?: JournalLine[];
}

interface BudgetRecord {
  id: string | number;
  coa_id: string | number;
  period: string;
  amount_ceiling: number | string;
  amount_used: number | string;
  status?: string;
  chart_of_account?: { id: string | number; code: string; name: string };
}

const lineAmount = (line: JournalLine, side: "debit" | "kredit") => Number(line[side]) || 0;
const journalDebitTotal = (jrn: JournalRecord) => (jrn.lines || []).reduce((sum, l) => sum + lineAmount(l, "debit"), 0);
const journalAccountLabel = (line: JournalLine) => line.chart_of_account ? `${line.chart_of_account.code} - ${line.chart_of_account.name}` : String(line.coa_id);

export const BukuBesarModule = ({ activeSubTab = "buku-besar/nomor-akun" }: OperationalModuleProps) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab);

  useEffect(() => {
    if (activeSubTab) {
      setCurrentSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  const { showToast } = useToast();
  const { currentUser } = useAuth();
  const officeId = currentUser?.office?.id;

  // Format IDR
  const formatRupiah = (num: number | string) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(num));

  // =========================================================================
  // SHARED: CHART OF ACCOUNTS (used by Jurnal Umum / Anggaran / Pencatatan Beban dropdowns)
  // =========================================================================
  const [coaList, setCoaList] = useState<{ id: string | number; code: string; name: string }[]>([]);
  useEffect(() => {
    if (!officeId) return;
    if (["buku-besar/jurnal-umum", "buku-besar/anggaran", "buku-besar/pencatatan-beban"].includes(currentSubTab)) {
      api.getCOA({ office_id: officeId }).then(setCoaList).catch(() => setCoaList([]));
    }
  }, [currentSubTab, officeId]);

  // =========================================================================
  // STATE SUB-MODUL 1: NOMOR AKUN (COA OPERASIONAL) — stays local/mock, out of scope
  // =========================================================================
  const [accounts, setAccounts] = useState([
    { id: "acc-1", code: "100-10", name: "Kas Operasional Kantor", category: "Aset", type: "Kas/Bank", balance: "Rp 45.000.000" },
    { id: "acc-2", code: "100-20", name: "Bank Mandiri Operasional", category: "Aset", type: "Kas/Bank", balance: "Rp 250.000.000" },
    { id: "acc-3", code: "500-10", name: "Beban Gaji & Tunjangan", category: "Beban", type: "Beban Operasional", balance: "Rp 120.000.000" },
    { id: "acc-4", code: "500-20", name: "Beban Listrik, Air & Internet", category: "Beban", type: "Beban Utilitas", balance: "Rp 15.400.000" },
    { id: "acc-5", code: "500-30", name: "Beban Perlengkapan Kantor", category: "Beban", type: "Beban ATK", balance: "Rp 8.500.000" },
    { id: "acc-6", code: "400-10", name: "Pendapatan Jasa Layanan", category: "Pendapatan", type: "Pendapatan Utama", balance: "Rp 450.000.000" }
  ]);
  const [showAddAccModal, setShowAddAccModal] = useState(false);
  const [newAccData, setNewAccData] = useState({ code: "", name: "", category: "Beban", type: "Beban Operasional" });

  const handleAddAccount = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newAccData.code || !newAccData.name) return;
    const created = { id: `acc-${Date.now()}`, ...newAccData, balance: "Rp 0" };
    setAccounts([...accounts, created]);
    setShowAddAccModal(false);
    showToast(`Nomor Akun [${created.code}] ${created.name} Berhasil Dibuat!`);
  };

  // =========================================================================
  // STATE SUB-MODUL 2: PENCATATAN BEBAN — thin wrapper over Journal (journal_type = "BBN")
  // =========================================================================
  const [expenses, setExpenses] = useState<JournalRecord[]>([]);
  const [expLoading, setExpLoading] = useState(true);
  const [expSaving, setExpSaving] = useState(false);
  const [expView, setExpView] = useState<FormViewState>("list");
  const [editingExp, setEditingExp] = useState<JournalRecord | null>(null);
  const emptyExpForm = { date: new Date().toISOString().slice(0, 10), expenseCoaId: "", paymentCoaId: "", amount: "", description: "" };
  const [newExpData, setNewExpData] = useState(emptyExpForm);

  const fetchExpenses = useCallback(async () => {
    if (!officeId) return;
    setExpLoading(true);
    try {
      const data = await api.getJournals({ office_id: officeId, journal_type: "BBN" });
      setExpenses(data);
    } catch {
      showToast("Gagal memuat Pencatatan Beban", "error");
    } finally {
      setExpLoading(false);
    }
  }, [officeId, showToast]);

  useEffect(() => {
    if (currentSubTab === "buku-besar/pencatatan-beban") fetchExpenses();
  }, [currentSubTab, fetchExpenses]);

  const openCreateExpense = () => {
    setNewExpData(emptyExpForm);
    setEditingExp(null);
    setExpView("create");
    setUrlFormParams("create");
  };
  const openEditExpense = (exp: JournalRecord) => {
    const debitLine = (exp.lines || []).find((l) => lineAmount(l, "debit") > 0);
    const kreditLine = (exp.lines || []).find((l) => lineAmount(l, "kredit") > 0);
    setNewExpData({
      date: exp.journal_date,
      expenseCoaId: String(debitLine?.coa_id ?? ""),
      paymentCoaId: String(kreditLine?.coa_id ?? ""),
      amount: String(debitLine ? lineAmount(debitLine, "debit") : ""),
      description: exp.description || ""
    });
    setEditingExp(exp);
    setExpView("edit");
    setUrlFormParams("edit", String(exp.id));
  };
  const backToExpenseList = () => {
    setExpView("list");
    setEditingExp(null);
    setUrlFormParams("list");
  };
  const handleSaveExpense = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!officeId || !currentUser) return;
    setExpSaving(true);
    try {
      if (editingExp) {
        await api.updateJournal(editingExp.id, { journal_date: newExpData.date, description: newExpData.description });
        showToast("Pencatatan Beban Berhasil Diperbarui!");
      } else {
        if (!newExpData.expenseCoaId || !newExpData.paymentCoaId || !newExpData.amount) return;
        if (newExpData.expenseCoaId === newExpData.paymentCoaId) {
          showToast("Akun Beban dan Akun Pembayaran tidak boleh sama", "error");
          setExpSaving(false);
          return;
        }
        await api.addJournal({
          journal_no: `BBN-${Date.now()}`,
          journal_date: newExpData.date,
          journal_type: "BBN",
          office_id: officeId,
          description: newExpData.description,
          user_id: currentUser.id,
          lines: [
            { coa_id: newExpData.expenseCoaId, debit: Number(newExpData.amount), kredit: 0, description: "Beban" },
            { coa_id: newExpData.paymentCoaId, debit: 0, kredit: Number(newExpData.amount), description: "Sumber pembayaran" }
          ]
        });
        showToast("Pencatatan Beban Berhasil Disimpan!");
      }
      await fetchExpenses();
      backToExpenseList();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan Pencatatan Beban", "error");
    } finally {
      setExpSaving(false);
    }
  };
  const handlePostExpense = async (id: string | number) => {
    try {
      await api.postJournal(id);
      await fetchExpenses();
      showToast("Beban Berhasil Diposting ke Buku Besar!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal memposting beban", "error");
    }
  };
  const handleDeleteExpense = async (id: string | number) => {
    try {
      await api.deleteJournal(id);
      await fetchExpenses();
      showToast("Pencatatan Beban Berhasil Dihapus.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus (mungkin sudah diposting)", "error");
    }
  };

  // Restore create/edit view from URL (refresh / back-forward / deep link)
  useEffect(() => {
    if (currentSubTab !== "buku-besar/pencatatan-beban" || expLoading) return;
    const params = getUrlFormParams();
    if (params.view === "create") openCreateExpense();
    else if (params.view === "edit" && params.id) {
      const found = expenses.find((x) => String(x.id) === params.id);
      if (found) openEditExpense(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expLoading]);
  usePopStateSync(useCallback(() => {
    const params = getUrlFormParams();
    if (params.view === "list") backToExpenseList();
  }, []));

  // =========================================================================
  // STATE SUB-MODUL 3: JURNAL UMUM
  // =========================================================================
  const [journals, setJournals] = useState<JournalRecord[]>([]);
  const [jrnLoading, setJrnLoading] = useState(true);
  const [jrnSaving, setJrnSaving] = useState(false);
  const [jrnView, setJrnView] = useState<FormViewState>("list");
  const [editingJrn, setEditingJrn] = useState<JournalRecord | null>(null);
  const emptyJrnMeta = { journal_no: `JRN-${Date.now()}`, date: new Date().toISOString().slice(0, 10), description: "" };
  const [newJrnMeta, setNewJrnMeta] = useState(emptyJrnMeta);
  const emptyJrnLines = [{ coa_id: "", debit: "", kredit: "" }, { coa_id: "", debit: "", kredit: "" }];
  const [newJrnLines, setNewJrnLines] = useState(emptyJrnLines);

  const fetchJournals = useCallback(async () => {
    if (!officeId) return;
    setJrnLoading(true);
    try {
      const data = await api.getJournals({ office_id: officeId, journal_type: "JU" });
      setJournals(data);
    } catch {
      showToast("Gagal memuat Jurnal Umum", "error");
    } finally {
      setJrnLoading(false);
    }
  }, [officeId, showToast]);

  useEffect(() => {
    if (currentSubTab === "buku-besar/jurnal-umum") fetchJournals();
  }, [currentSubTab, fetchJournals]);

  const openCreateJournal = () => {
    setNewJrnMeta({ journal_no: `JRN-${Date.now()}`, date: new Date().toISOString().slice(0, 10), description: "" });
    setNewJrnLines(emptyJrnLines);
    setEditingJrn(null);
    setJrnView("create");
    setUrlFormParams("create");
  };
  const openEditJournal = (jrn: JournalRecord) => {
    setNewJrnMeta({ journal_no: jrn.journal_no, date: jrn.journal_date, description: jrn.description || "" });
    setEditingJrn(jrn);
    setJrnView("edit");
    setUrlFormParams("edit", String(jrn.id));
  };
  const backToJournalList = () => {
    setJrnView("list");
    setEditingJrn(null);
    setUrlFormParams("list");
  };
  const updateJrnLine = (idx: number, field: "coa_id" | "debit" | "kredit", value: string) => {
    setNewJrnLines(newJrnLines.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };
  const addJrnLine = () => setNewJrnLines([...newJrnLines, { coa_id: "", debit: "", kredit: "" }]);
  const removeJrnLine = (idx: number) => {
    if (newJrnLines.length <= 2) return;
    setNewJrnLines(newJrnLines.filter((_, i) => i !== idx));
  };
  const jrnDebitTotal = newJrnLines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const jrnKreditTotal = newJrnLines.reduce((sum, l) => sum + (Number(l.kredit) || 0), 0);
  const jrnBalanced = jrnDebitTotal > 0 && jrnDebitTotal === jrnKreditTotal;

  const handleSaveJournal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!officeId || !currentUser) return;
    setJrnSaving(true);
    try {
      if (editingJrn) {
        await api.updateJournal(editingJrn.id, { journal_date: newJrnMeta.date, description: newJrnMeta.description });
        showToast(`Jurnal Umum ${newJrnMeta.journal_no} Berhasil Diperbarui!`);
      } else {
        if (!jrnBalanced) {
          showToast("Total Debet dan Kredit harus sama (balance) sebelum disimpan", "error");
          setJrnSaving(false);
          return;
        }
        if (newJrnLines.some((l) => !l.coa_id)) {
          showToast("Setiap baris jurnal harus memilih akun", "error");
          setJrnSaving(false);
          return;
        }
        await api.addJournal({
          journal_no: newJrnMeta.journal_no,
          journal_date: newJrnMeta.date,
          journal_type: "JU",
          office_id: officeId,
          description: newJrnMeta.description,
          user_id: currentUser.id,
          lines: newJrnLines.map((l) => ({ coa_id: l.coa_id, debit: Number(l.debit) || 0, kredit: Number(l.kredit) || 0 }))
        });
        showToast(`Jurnal Umum ${newJrnMeta.journal_no} Berhasil Dibuat!`);
      }
      await fetchJournals();
      backToJournalList();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan Jurnal Umum", "error");
    } finally {
      setJrnSaving(false);
    }
  };
  const handlePostJournal = async (id: string | number) => {
    try {
      await api.postJournal(id);
      await fetchJournals();
      showToast("Jurnal Berhasil Diposting ke Buku Besar!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal memposting jurnal", "error");
    }
  };
  const handleDeleteJournal = async (id: string | number) => {
    try {
      await api.deleteJournal(id);
      await fetchJournals();
      showToast("Jurnal Berhasil Dihapus.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus (mungkin sudah diposting)", "error");
    }
  };

  useEffect(() => {
    if (currentSubTab !== "buku-besar/jurnal-umum" || jrnLoading) return;
    const params = getUrlFormParams();
    if (params.view === "create") openCreateJournal();
    else if (params.view === "edit" && params.id) {
      const found = journals.find((x) => String(x.id) === params.id);
      if (found) openEditJournal(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jrnLoading]);
  usePopStateSync(useCallback(() => {
    const params = getUrlFormParams();
    if (params.view === "list") backToJournalList();
  }, []));

  // =========================================================================
  // STATE SUB-MODUL 4: ANGGARAN KEUANGAN
  // =========================================================================
  const [budgets, setBudgets] = useState<BudgetRecord[]>([]);
  const [bdgLoading, setBdgLoading] = useState(true);
  const [bdgSaving, setBdgSaving] = useState(false);
  const [bdgView, setBdgView] = useState<FormViewState>("list");
  const [editingBdg, setEditingBdg] = useState<BudgetRecord | null>(null);
  const emptyBdgForm = { coa_id: "", period: "", amount_ceiling: "", amount_used: "" };
  const [newBdgData, setNewBdgData] = useState(emptyBdgForm);

  const fetchBudgets = useCallback(async () => {
    if (!officeId) return;
    setBdgLoading(true);
    try {
      const data = await api.getBudgets({ office_id: officeId });
      setBudgets(data);
    } catch {
      showToast("Gagal memuat Anggaran", "error");
    } finally {
      setBdgLoading(false);
    }
  }, [officeId, showToast]);

  useEffect(() => {
    if (currentSubTab === "buku-besar/anggaran" || currentSubTab === "buku-besar/monitoring-anggaran") fetchBudgets();
  }, [currentSubTab, fetchBudgets]);

  const openCreateBudget = () => {
    setNewBdgData(emptyBdgForm);
    setEditingBdg(null);
    setBdgView("create");
    setUrlFormParams("create");
  };
  const openEditBudget = (bdg: BudgetRecord) => {
    setNewBdgData({ coa_id: String(bdg.coa_id), period: bdg.period, amount_ceiling: String(bdg.amount_ceiling), amount_used: String(bdg.amount_used) });
    setEditingBdg(bdg);
    setBdgView("edit");
    setUrlFormParams("edit", String(bdg.id));
  };
  const backToBudgetList = () => {
    setBdgView("list");
    setEditingBdg(null);
    setUrlFormParams("list");
  };
  const handleSaveBudget = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!officeId || !newBdgData.amount_ceiling) return;
    setBdgSaving(true);
    try {
      if (editingBdg) {
        await api.updateBudget(editingBdg.id, { amount_ceiling: Number(newBdgData.amount_ceiling), amount_used: Number(newBdgData.amount_used) || 0 });
        showToast("Anggaran Berhasil Diperbarui!");
      } else {
        if (!newBdgData.coa_id || !newBdgData.period) return;
        await api.addBudget({ office_id: officeId, coa_id: newBdgData.coa_id, period: newBdgData.period, amount_ceiling: Number(newBdgData.amount_ceiling), amount_used: Number(newBdgData.amount_used) || 0 });
        showToast("Anggaran Berhasil Dialokasikan!");
      }
      await fetchBudgets();
      backToBudgetList();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan Anggaran", "error");
    } finally {
      setBdgSaving(false);
    }
  };
  const handleDeleteBudget = async (id: string | number) => {
    try {
      await api.deleteBudget(id);
      await fetchBudgets();
      showToast("Anggaran Berhasil Dihapus.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus Anggaran", "error");
    }
  };

  useEffect(() => {
    if (currentSubTab !== "buku-besar/anggaran" || bdgLoading) return;
    const params = getUrlFormParams();
    if (params.view === "create") openCreateBudget();
    else if (params.view === "edit" && params.id) {
      const found = budgets.find((x) => String(x.id) === params.id);
      if (found) openEditBudget(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bdgLoading]);
  usePopStateSync(useCallback(() => {
    const params = getUrlFormParams();
    if (params.view === "list") backToBudgetList();
  }, []));

  // =========================================================================
  // STATE SUB-MODUL 6: TRANSFER ANGGARAN — stays local/mock, out of scope
  // =========================================================================
  const [transfers, setTransfers] = useState([
    { id: "trf-1", date: "2026-07-25", sourceAcc: "500-30 (Beban ATK)", targetAcc: "500-20 (Beban Utilitas)", amount: "Rp 2.500.000", reason: "Penambahan alokasi beban listrik gedung" }
  ]);
  const [transferForm, setTransferForm] = useState({
    sourceAcc: "500-30 - Beban ATK & Ops",
    targetAcc: "500-20 - Beban Utilitas",
    amount: "",
    reason: ""
  });

  const handleTransferBudgetSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!transferForm.amount) return;
    const trf = {
      id: `trf-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      sourceAcc: transferForm.sourceAcc,
      targetAcc: transferForm.targetAcc,
      amount: formatRupiah(transferForm.amount),
      reason: transferForm.reason || "Re-alokasi anggaran operasional"
    };
    setTransfers([trf, ...transfers]);
    setTransferForm({ sourceAcc: "500-30 - Beban ATK & Ops", targetAcc: "500-20 - Beban Utilitas", amount: "", reason: "" });
    showToast("Transfer Anggaran Berhasil Diproses!");
  };

  // =========================================================================
  // STATE SUB-MODUL 7: LOG AKTIVITAS BUKU BESAR — stays local/mock, out of scope
  // =========================================================================
  const [glLogs] = useState([
    { id: "glog-1", time: "2026-07-29 15:10:00", user: "Staff Keuangan", action: "Pencatatan Beban Baru", detail: "Membuat voucher BBN-2026-002 senilai Rp 2.150.000", module: "Pencatatan Beban" },
    { id: "glog-2", time: "2026-07-29 13:45:12", user: "Kadiv Keuangan", action: "Posting Jurnal Umum", detail: "Posting jurnal JRN-2026-089 ke Buku Besar", module: "Jurnal Umum" },
    { id: "glog-3", time: "2026-07-28 10:20:00", user: "Manager Anper", action: "Transfer Anggaran", detail: "Transfer saldo anggaran dari 500-30 ke 500-20", module: "Transfer Anggaran" }
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Header Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Modul Buku Besar (General Ledger)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan Chart of Accounts, pencatatan beban, posting jurnal umum, anggaran, monitoring realisasi, & transfer anggaran.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-MODUL 1: NOMOR AKUN */}
      {/* ========================================================================= */}
      {currentSubTab === "buku-besar/nomor-akun" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Daftar Nomor Akun / COA ({accounts.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">List nomor akun buku besar yang dapat dilihat, diedit, dan ditambah.</p>
            </div>

            <button
              onClick={() => setShowAddAccModal(true)}
              className="flex items-center justify-center gap-2 bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Nomor Akun</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">KODE AKUN</th>
                  <th className="py-3.5 px-6">NAMA AKUN</th>
                  <th className="py-3.5 px-6">KATEGORI</th>
                  <th className="py-3.5 px-6">TIPE AKUN</th>
                  <th className="py-3.5 px-6 font-mono">SALDO AKHIR</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{acc.code}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{acc.name}</td>
                    <td className="py-4 px-6 font-bold text-indigo-600">{acc.category}</td>
                    <td className="py-4 px-6 text-slate-500">{acc.type}</td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{acc.balance}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button title="Edit Akun" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setAccounts(accounts.filter(a => a.id !== acc.id))}
                          title="Hapus Akun"
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
      {/* SUB-MODUL 2: PENCATATAN BEBAN */}
      {/* ========================================================================= */}
      {currentSubTab === "buku-besar/pencatatan-beban" && (expView === "list" ? (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Pencatatan Beban Operasional ({expenses.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar beban yang dicatat, di-approve, dan diterbitkan nomor buktinya.</p>
            </div>

            <button
              onClick={openCreateExpense}
              className="flex items-center justify-center gap-2 bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Pencatatan Beban</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">NO VOUCHER</th>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6">AKUN BEBAN</th>
                  <th className="py-3.5 px-6 font-mono">NOMINAL BEBAN</th>
                  <th className="py-3.5 px-6">STATUS</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {expLoading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-400">Memuat data...</td></tr>
                ) : expenses.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-400">Belum ada Pencatatan Beban.</td></tr>
                ) : expenses.map((exp) => {
                  const debitLine = (exp.lines || []).find((l) => lineAmount(l, "debit") > 0);
                  return (
                    <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-emerald-700">{exp.journal_no}</td>
                      <td className="py-4 px-6 font-mono text-slate-500">{exp.journal_date}</td>
                      <td className="py-4 px-6 font-extrabold text-slate-900">{debitLine ? journalAccountLabel(debitLine) : "-"}</td>
                      <td className="py-4 px-6 font-mono font-black text-slate-900">{formatRupiah(journalDebitTotal(exp))}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          exp.status === "posted" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {exp.status === "posted" ? "Diposting" : "Draft"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {exp.status === "draft" && (
                            <button onClick={() => handlePostExpense(exp.id)} title="Post ke Buku Besar" className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => openEditExpense(exp)} title="Edit Beban" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteExpense(exp.id)} title="Hapus Beban" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={backToExpenseList} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Buku Besar / Pencatatan Beban</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {expView === "edit" ? `Edit Beban ${editingExp?.journal_no}` : "Create Pencatatan Beban Baru"}
              </h1>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-6">
            {expView === "edit" && editingExp?.status === "posted" ? (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                Beban ini sudah diposting ke Buku Besar dan tidak dapat diubah lagi.
              </p>
            ) : (
              <form onSubmit={handleSaveExpense} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 mb-1">Tanggal</label>
                    <input type="date" required value={newExpData.date} onChange={(e) => setNewExpData({ ...newExpData, date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500" />
                  </div>
                  <div />
                  <div>
                    <label className="block text-slate-700 mb-1">Akun Beban (Debet)</label>
                    <select disabled={expView === "edit"} required value={newExpData.expenseCoaId} onChange={(e) => setNewExpData({ ...newExpData, expenseCoaId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 cursor-pointer disabled:opacity-60">
                      <option value="">Pilih akun beban...</option>
                      {coaList.map((c) => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Dibayar dari Akun (Kredit)</label>
                    <select disabled={expView === "edit"} required value={newExpData.paymentCoaId} onChange={(e) => setNewExpData({ ...newExpData, paymentCoaId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 cursor-pointer disabled:opacity-60">
                      <option value="">Pilih akun kas/bank...</option>
                      {coaList.map((c) => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Nominal Beban (Rp)</label>
                    <input disabled={expView === "edit"} type="number" required placeholder="Contoh: 1500000" value={newExpData.amount} onChange={(e) => setNewExpData({ ...newExpData, amount: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold focus:outline-emerald-500 disabled:opacity-60" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 mb-1">Catatan</label>
                    <textarea rows={3} placeholder="Catatan tambahan mengenai beban ini..." value={newExpData.description} onChange={(e) => setNewExpData({ ...newExpData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500" />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                  <button type="button" onClick={backToExpenseList} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer">Batal</button>
                  <button type="submit" disabled={expSaving} className="flex items-center gap-1.5 px-5 py-2 bg-[#00c885] hover:bg-[#00b377] text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-colors cursor-pointer disabled:opacity-60">
                    {expSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{expView === "edit" ? "Simpan Perubahan" : "Simpan Beban"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ))}

      {/* ========================================================================= */}
      {/* SUB-MODUL 3: JURNAL UMUM */}
      {/* ========================================================================= */}
      {currentSubTab === "buku-besar/jurnal-umum" && (jrnView === "list" ? (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Jurnal Umum (General Journal)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Daftar jurnal umum transaksi debet & kredit yang sudah diposting.</p>
            </div>

            <button
              onClick={openCreateJournal}
              className="flex items-center justify-center gap-2 bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Jurnal Umum</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">NO JURNAL</th>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6">AKUN DEBET</th>
                  <th className="py-3.5 px-6">AKUN KREDIT</th>
                  <th className="py-3.5 px-6 font-mono">TOTAL TRANSAKSI</th>
                  <th className="py-3.5 px-6 text-center">STATUS</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {jrnLoading ? (
                  <tr><td colSpan={7} className="py-8 text-center text-slate-400">Memuat data...</td></tr>
                ) : journals.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-slate-400">Belum ada Jurnal Umum.</td></tr>
                ) : journals.map((jrn) => {
                  const debitLines = (jrn.lines || []).filter((l) => lineAmount(l, "debit") > 0);
                  const kreditLines = (jrn.lines || []).filter((l) => lineAmount(l, "kredit") > 0);
                  return (
                    <tr key={jrn.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-emerald-700">{jrn.journal_no}</td>
                      <td className="py-4 px-6 font-mono text-slate-500">{jrn.journal_date}</td>
                      <td className="py-4 px-6 font-bold text-slate-800">{debitLines.map(journalAccountLabel).join(", ") || "-"}</td>
                      <td className="py-4 px-6 font-bold text-slate-800">{kreditLines.map(journalAccountLabel).join(", ") || "-"}</td>
                      <td className="py-4 px-6 font-mono font-extrabold text-slate-900">{formatRupiah(journalDebitTotal(jrn))}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${jrn.status === "posted" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {jrn.status === "posted" ? "✓ Posted" : "Draft"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {jrn.status === "draft" && (
                            <button onClick={() => handlePostJournal(jrn.id)} title="Post ke Buku Besar" className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => openEditJournal(jrn)} title="Edit Jurnal" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteJournal(jrn.id)} title="Hapus Jurnal" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={backToJournalList} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Buku Besar / Jurnal Umum</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {jrnView === "edit" ? `Edit Jurnal ${newJrnMeta.journal_no}` : "Create Jurnal Umum Baru"}
              </h1>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-6">
            {jrnView === "edit" && editingJrn?.status === "posted" ? (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                Jurnal ini sudah diposting ke Buku Besar dan tidak dapat diubah lagi.
              </p>
            ) : (
              <form onSubmit={handleSaveJournal} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 mb-1">Nomor Jurnal</label>
                    <input type="text" required disabled={jrnView === "edit"} value={newJrnMeta.journal_no} onChange={(e) => setNewJrnMeta({ ...newJrnMeta, journal_no: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold focus:outline-emerald-500 disabled:opacity-60" />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Tanggal</label>
                    <input type="date" required value={newJrnMeta.date} onChange={(e) => setNewJrnMeta({ ...newJrnMeta, date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 mb-1">Deskripsi</label>
                    <input type="text" value={newJrnMeta.description} onChange={(e) => setNewJrnMeta({ ...newJrnMeta, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500" />
                  </div>
                </div>

                {jrnView === "edit" ? (
                  <div className="space-y-2">
                    <p className="text-slate-700 font-bold">Baris Jurnal (tidak dapat diubah)</p>
                    {(editingJrn?.lines || []).map((l, i) => (
                      <div key={l.id ?? i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                        <span>{journalAccountLabel(l)}</span>
                        <span className="font-mono">{lineAmount(l, "debit") > 0 ? `Debet ${formatRupiah(lineAmount(l, "debit"))}` : `Kredit ${formatRupiah(lineAmount(l, "kredit"))}`}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-700 font-bold">Baris Jurnal</p>
                      <button type="button" onClick={addJrnLine} className="text-emerald-600 font-bold flex items-center gap-1 cursor-pointer">
                        <Plus className="w-3.5 h-3.5" /> Tambah Baris
                      </button>
                    </div>
                    {newJrnLines.map((line, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <select required value={line.coa_id} onChange={(e) => updateJrnLine(idx, "coa_id", e.target.value)} className="col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 cursor-pointer">
                          <option value="">Pilih akun...</option>
                          {coaList.map((c) => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                        </select>
                        <input type="number" placeholder="Debet" value={line.debit} onChange={(e) => updateJrnLine(idx, "debit", e.target.value)} className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-emerald-500" />
                        <input type="number" placeholder="Kredit" value={line.kredit} onChange={(e) => updateJrnLine(idx, "kredit", e.target.value)} className="col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-emerald-500" />
                        <button type="button" onClick={() => removeJrnLine(idx)} disabled={newJrnLines.length <= 2} className="col-span-1 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className={`flex justify-end gap-4 pt-2 font-mono font-bold ${jrnBalanced ? "text-emerald-700" : "text-red-600"}`}>
                      <span>Debet: {formatRupiah(jrnDebitTotal)}</span>
                      <span>Kredit: {formatRupiah(jrnKreditTotal)}</span>
                      <span>{jrnBalanced ? "✓ Balance" : "Belum Balance"}</span>
                    </div>
                  </div>
                )}

                <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                  <button type="button" onClick={backToJournalList} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer">Batal</button>
                  <button type="submit" disabled={jrnSaving} className="flex items-center gap-1.5 px-5 py-2 bg-[#00c885] hover:bg-[#00b377] text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-colors cursor-pointer disabled:opacity-60">
                    {jrnSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{jrnView === "edit" ? "Simpan Perubahan" : "Simpan Jurnal"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ))}

      {/* ========================================================================= */}
      {/* SUB-MODUL 4: ANGGARAN KEUANGAN */}
      {/* ========================================================================= */}
      {currentSubTab === "buku-besar/anggaran" && (bdgView === "list" ? (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Anggaran Keuangan (Budgeting)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Alokasi anggaran keuangan per nomor akun dan periode berjalan.</p>
            </div>

            <button
              onClick={openCreateBudget}
              className="flex items-center justify-center gap-2 bg-[#00c885] hover:bg-[#00b377] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Anggaran Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">AKUN TERIKAT</th>
                  <th className="py-3.5 px-6">PERIODE</th>
                  <th className="py-3.5 px-6 font-mono">ALOKASI ANGGARAN</th>
                  <th className="py-3.5 px-6 font-mono">TERPAKAI</th>
                  <th className="py-3.5 px-6 font-mono">SISA SALDO</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bdgLoading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-400">Memuat data...</td></tr>
                ) : budgets.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-400">Belum ada Anggaran.</td></tr>
                ) : budgets.map((bdg) => {
                  const sisa = Number(bdg.amount_ceiling) - Number(bdg.amount_used);
                  return (
                    <tr key={bdg.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-extrabold text-slate-900">{bdg.chart_of_account ? `${bdg.chart_of_account.code} - ${bdg.chart_of_account.name}` : String(bdg.coa_id)}</td>
                      <td className="py-4 px-6 font-bold text-slate-700">{bdg.period}</td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">{formatRupiah(bdg.amount_ceiling)}</td>
                      <td className="py-4 px-6 font-mono font-bold text-amber-700">{formatRupiah(bdg.amount_used)}</td>
                      <td className="py-4 px-6 font-mono font-extrabold text-emerald-700">{formatRupiah(sisa)}</td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => openEditBudget(bdg)} title="Edit Anggaran" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteBudget(bdg.id)} title="Hapus Anggaran" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={backToBudgetList} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                <DollarSign className="w-4 h-4" />
                <span>Buku Besar / Anggaran</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {bdgView === "edit" ? "Edit Anggaran" : "Create Anggaran Baru"}
              </h1>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-6">
            <form onSubmit={handleSaveBudget} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-slate-700 mb-1">Nomor Akun Terikat</label>
                  <select disabled={bdgView === "edit"} required value={newBdgData.coa_id} onChange={(e) => setNewBdgData({ ...newBdgData, coa_id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 cursor-pointer disabled:opacity-60">
                    <option value="">Pilih akun...</option>
                    {coaList.map((c) => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Periode Anggaran</label>
                  <input type="text" required disabled={bdgView === "edit"} placeholder="Contoh: 2026-07" value={newBdgData.period} onChange={(e) => setNewBdgData({ ...newBdgData, period: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-emerald-500 disabled:opacity-60" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Alokasi Anggaran (Rp)</label>
                  <input type="number" required placeholder="Contoh: 25000000" value={newBdgData.amount_ceiling} onChange={(e) => setNewBdgData({ ...newBdgData, amount_ceiling: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold focus:outline-emerald-500" />
                </div>
                {bdgView === "edit" && (
                  <div>
                    <label className="block text-slate-700 mb-1">Realisasi Terpakai (Rp)</label>
                    <input type="number" value={newBdgData.amount_used} onChange={(e) => setNewBdgData({ ...newBdgData, amount_used: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold focus:outline-emerald-500" />
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={backToBudgetList} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={bdgSaving} className="flex items-center gap-1.5 px-5 py-2 bg-[#00c885] hover:bg-[#00b377] text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-colors cursor-pointer disabled:opacity-60">
                  {bdgSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{bdgView === "edit" ? "Simpan Perubahan" : "Simpan Anggaran"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ))}

      {/* ========================================================================= */}
      {/* SUB-MODUL 5: MONITORING ANGGARAN */}
      {/* ========================================================================= */}
      {currentSubTab === "buku-besar/monitoring-anggaran" && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <span>Monitoring Realisasi Anggaran Keuangan</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Analisis perbandingan alokasi anggaran vs penyerapan riil operasional.</p>
          </div>

          {bdgLoading ? (
            <p className="text-xs text-slate-400 text-center py-8">Memuat data...</p>
          ) : budgets.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Belum ada Anggaran untuk dimonitor.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {budgets.map((bdg) => {
                const ceiling = Number(bdg.amount_ceiling);
                const used = Number(bdg.amount_used);
                const percent = ceiling > 0 ? Math.round((used / ceiling) * 100) : 0;
                const sisa = ceiling - used;
                return (
                  <div key={bdg.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">{bdg.period}</span>
                      <span className="text-xs font-extrabold text-slate-700">{percent}% Terpakai</span>
                    </div>

                    <h5 className="font-extrabold text-slate-900 text-sm">{bdg.chart_of_account ? `${bdg.chart_of_account.code} - ${bdg.chart_of_account.name}` : String(bdg.coa_id)}</h5>

                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percent > 90 ? "bg-red-500" : percent > 70 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      ></div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Alokasi: {formatRupiah(ceiling)}</span>
                      <span className="text-emerald-700 font-bold">Sisa: {formatRupiah(sisa)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODUL 6: TRANSFER ANGGARAN */}
      {/* ========================================================================= */}
      {currentSubTab === "buku-besar/transfer-anggaran" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <ArrowLeftRight className="w-4 h-4 text-emerald-600" />
              <span>Form Transfer Anggaran Antar Nomor Akun</span>
            </h4>

            <form onSubmit={handleTransferBudgetSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Nomor Akun Sumber (Alokasi Asal)</label>
                <select
                  value={transferForm.sourceAcc}
                  onChange={(e) => setTransferForm({ ...transferForm, sourceAcc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="500-30 - Beban ATK & Ops">500-30 - Beban ATK & Ops (Sisa: Rp 6.500.000)</option>
                  <option value="500-10 - Beban Gaji Ops">500-10 - Beban Gaji Ops (Sisa: Rp 30.000.000)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Nomor Akun Tujuan (Penerima Transfer)</label>
                <select
                  value={transferForm.targetAcc}
                  onChange={(e) => setTransferForm({ ...transferForm, targetAcc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="500-20 - Beban Utilitas">500-20 - Beban Utilitas</option>
                  <option value="500-30 - Beban ATK & Ops">500-30 - Beban ATK & Ops</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Nominal Anggaran Ditransfer (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 2500000"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Alasan Transfer / Catatan</label>
                <textarea
                  rows={2}
                  placeholder="Catatan penyesuaian anggaran..."
                  value={transferForm.reason}
                  onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00c885] hover:bg-[#00b377] text-white font-bold rounded-xl shadow-md shadow-emerald-500/20"
              >
                Proses Transfer Anggaran
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3">Riwayat Transfer Anggaran</h4>
            <div className="space-y-3">
              {transfers.map((trf) => (
                <div key={trf.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center justify-between font-extrabold text-slate-900">
                    <span>{trf.amount}</span>
                    <span className="text-[10px] font-mono text-slate-400">{trf.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <span className="text-emerald-700">{trf.sourceAcc}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-indigo-700">{trf.targetAcc}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">Catatan: {trf.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODUL 7: LOG AKTIVITAS BUKU BESAR */}
      {/* ========================================================================= */}
      {currentSubTab === "buku-besar/log-aktivitas" && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" />
              <span>Log Aktivitas Buku Besar (GL Audit Log)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Jejak audit seluruh aktivitas transaksi dan alokasi pada modul Buku Besar.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">WAKTU</th>
                  <th className="py-3.5 px-6">USER</th>
                  <th className="py-3.5 px-6">SUB-MODUL</th>
                  <th className="py-3.5 px-6">AKTIVITAS</th>
                  <th className="py-3.5 px-6">DETAIL CATATAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {glLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-500">{log.time}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{log.user}</td>
                    <td className="py-4 px-6 font-bold text-indigo-600">{log.module}</td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NOMOR AKUN */}
      {showAddAccModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Create Nomor Akun Baru</h3>
              <button onClick={() => setShowAddAccModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddAccount} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Kode Nomor Akun</label>
                <input type="text" required placeholder="Contoh: 500-40" value={newAccData.code} onChange={(e) => setNewAccData({ ...newAccData, code: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Nama Akun Buku Besar</label>
                <input type="text" required placeholder="Contoh: Beban Pemeliharaan Bangunan" value={newAccData.name} onChange={(e) => setNewAccData({ ...newAccData, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Kategori Akun</label>
                <select value={newAccData.category} onChange={(e) => setNewAccData({ ...newAccData, category: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border bg-white">
                  <option value="Aset">Aset</option>
                  <option value="Liabilitas">Liabilitas</option>
                  <option value="Ekuitas">Ekuitas</option>
                  <option value="Pendapatan">Pendapatan</option>
                  <option value="Beban">Beban</option>
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowAddAccModal(false)} className="px-4 py-2 text-slate-600 font-bold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Simpan Akun</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
