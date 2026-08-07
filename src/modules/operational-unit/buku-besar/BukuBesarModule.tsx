import { useState, useEffect, type FormEvent } from "react";
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
  CheckCircle2,
  X,
  DollarSign,
  ArrowRight
} from "lucide-react";
import type { OperationalModuleProps } from "../types";

export const BukuBesarModule = ({ activeSubTab = "buku-besar/nomor-akun", onSubTabChange }: OperationalModuleProps) => {
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

  // =========================================================================
  // STATE SUB-MODUL 1: NOMOR AKUN (COA OPERASIONAL)
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

  // =========================================================================
  // STATE SUB-MODUL 2: PENCATATAN BEBAN
  // =========================================================================
  const [expenses, setExpenses] = useState([
    { id: "exp-1", voucherNo: "BBN-2026-001", date: "2026-07-28", account: "500-20 - Beban Listrik, Air & Internet", amount: "Rp 4.500.000", status: "Disetujui", note: "Pembayaran tagihan PLN & Telkom bulan Juli" },
    { id: "exp-2", voucherNo: "BBN-2026-002", date: "2026-07-29", account: "500-30 - Beban Perlengkapan Kantor", amount: "Rp 2.150.000", status: "Disetujui", note: "Pembelian ATK & kertas A4 per Kuartal 3" },
    { id: "exp-3", voucherNo: "BBN-2026-003", date: "2026-07-29", account: "500-10 - Beban Gaji & Tunjangan", amount: "Rp 35.000.000", status: "Pending Approval", note: "Pencatatan insentif lembur tim operasional" }
  ]);
  const [showAddExpModal, setShowAddExpModal] = useState(false);
  const [newExpData, setNewExpData] = useState({ voucherNo: `BBN-2026-00${expenses.length + 1}`, date: "2026-07-29", account: "500-20 - Beban Listrik, Air & Internet", amount: "", note: "" });

  // =========================================================================
  // STATE SUB-MODUL 3: JURNAL UMUM
  // =========================================================================
  const [journals, setJournals] = useState([
    { id: "jrn-1", journalNo: "JRN-2026-088", date: "2026-07-28", debetAcc: "500-20 (Beban Listrik)", kreditAcc: "100-20 (Bank Mandiri)", totalAmount: "Rp 4.500.000", status: "Posted / Balanced" },
    { id: "jrn-2", journalNo: "JRN-2026-089", date: "2026-07-29", debetAcc: "100-20 (Bank Mandiri)", kreditAcc: "400-10 (Pendapatan Jasa)", totalAmount: "Rp 15.000.000", status: "Posted / Balanced" }
  ]);
  const [showAddJrnModal, setShowAddJrnModal] = useState(false);
  const [newJrnData, setNewJrnData] = useState({ journalNo: `JRN-2026-09${journals.length + 1}`, date: "2026-07-29", debetAcc: "500-10 (Beban Gaji)", kreditAcc: "100-10 (Kas Operasional)", totalAmount: "" });

  // =========================================================================
  // STATE SUB-MODUL 4: ANGGARAN KEUANGAN
  // =========================================================================
  const [budgets, setBudgets] = useState([
    { id: "bdg-1", code: "BDG-Q3-01", period: "Kuartal III 2026", account: "500-20 - Beban Utilitas", allocated: 20000000, used: 15400000, status: "Aktif" },
    { id: "bdg-2", code: "BDG-Q3-02", period: "Kuartal III 2026", account: "500-30 - Beban ATK & Ops", allocated: 15000000, used: 8500000, status: "Aktif" },
    { id: "bdg-3", code: "BDG-Q3-03", period: "Kuartal III 2026", account: "500-10 - Beban Gaji Ops", allocated: 150000000, used: 120000000, status: "Aktif" }
  ]);
  const [showAddBdgModal, setShowAddBdgModal] = useState(false);
  const [newBdgData, setNewBdgData] = useState({ code: `BDG-Q3-0${budgets.length + 1}`, period: "Kuartal III 2026", account: "500-20 - Beban Utilitas", allocated: "" });

  // =========================================================================
  // STATE SUB-MODUL 6: TRANSFER ANGGARAN
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

  // =========================================================================
  // STATE SUB-MODUL 7: LOG AKTIVITAS BUKU BESAR
  // =========================================================================
  const [glLogs] = useState([
    { id: "glog-1", time: "2026-07-29 15:10:00", user: "Staff Keuangan", action: "Pencatatan Beban Baru", detail: "Membuat voucher BBN-2026-002 senilai Rp 2.150.000", module: "Pencatatan Beban" },
    { id: "glog-2", time: "2026-07-29 13:45:12", user: "Kadiv Keuangan", action: "Posting Jurnal Umum", detail: "Posting jurnal JRN-2026-089 ke Buku Besar", module: "Jurnal Umum" },
    { id: "glog-3", time: "2026-07-28 10:20:00", user: "Manager Anper", action: "Transfer Anggaran", detail: "Transfer saldo anggaran dari 500-30 ke 500-20", module: "Transfer Anggaran" }
  ]);

  // Format IDR
  const formatRupiah = (num: number | string) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(num));

  // Handlers Add Account
  const handleAddAccount = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newAccData.code || !newAccData.name) return;
    const created = { id: `acc-${Date.now()}`, ...newAccData, balance: "Rp 0" };
    setAccounts([...accounts, created]);
    setShowAddAccModal(false);
    showToast(`Nomor Akun [${created.code}] ${created.name} Berhasil Dibuat!`);
  };

  // Handlers Add Expense
  const handleAddExpense = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newExpData.amount) return;
    const created = { id: `exp-${Date.now()}`, ...newExpData, amount: formatRupiah(newExpData.amount), status: "Disetujui" };
    setExpenses([...expenses, created]);
    setShowAddExpModal(false);
    showToast(`Pencatatan Beban ${created.voucherNo} Berhasil Disimpan!`);
  };

  // Handlers Add Journal
  const handleAddJournal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newJrnData.totalAmount) return;
    const created = { id: `jrn-${Date.now()}`, ...newJrnData, totalAmount: formatRupiah(newJrnData.totalAmount), status: "Posted / Balanced" };
    setJournals([...journals, created]);
    setShowAddJrnModal(false);
    showToast(`Jurnal Umum ${created.journalNo} Berhasil Diposting!`);
  };

  // Handlers Add Budget
  const handleAddBudget = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newBdgData.allocated) return;
    const created = { id: `bdg-${Date.now()}`, ...newBdgData, allocated: Number(newBdgData.allocated), used: 0, status: "Aktif" };
    setBudgets([...budgets, created]);
    setShowAddBdgModal(false);
    showToast(`Anggaran ${created.code} Berhasil Dialokasikan!`);
  };

  // Handlers Transfer Budget
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

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-xs">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

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

      {/* Sub-tab Navigation Grid Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1.5">
        <button
          onClick={() => handleTabChange("buku-besar/nomor-akun")}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            currentSubTab === "buku-besar/nomor-akun"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Nomor Akun</span>
        </button>

        <button
          onClick={() => handleTabChange("buku-besar/pencatatan-beban")}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            currentSubTab === "buku-besar/pencatatan-beban"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Pencatatan Beban</span>
        </button>

        <button
          onClick={() => handleTabChange("buku-besar/jurnal-umum")}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            currentSubTab === "buku-besar/jurnal-umum"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Jurnal Umum</span>
        </button>

        <button
          onClick={() => handleTabChange("buku-besar/anggaran")}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            currentSubTab === "buku-besar/anggaran"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Anggaran</span>
        </button>

        <button
          onClick={() => handleTabChange("buku-besar/monitoring-anggaran")}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            currentSubTab === "buku-besar/monitoring-anggaran"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Monitoring</span>
        </button>

        <button
          onClick={() => handleTabChange("buku-besar/transfer-anggaran")}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            currentSubTab === "buku-besar/transfer-anggaran"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Transfer Anggaran</span>
        </button>

        <button
          onClick={() => handleTabChange("buku-besar/log-aktivitas")}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            currentSubTab === "buku-besar/log-aktivitas"
              ? "bg-[#00c885] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Log GL</span>
        </button>
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
      {currentSubTab === "buku-besar/pencatatan-beban" && (
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
              onClick={() => setShowAddExpModal(true)}
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
                  <th className="py-3.5 px-6">NO BUKTI BEBAN</th>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6">NOMOR & NAMA AKUN BEBAN</th>
                  <th className="py-3.5 px-6 font-mono">NOMINAL BEBAN</th>
                  <th className="py-3.5 px-6">STATUS</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{exp.voucherNo}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{exp.date}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{exp.account}</td>
                    <td className="py-4 px-6 font-mono font-black text-slate-900">{exp.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        exp.status === "Disetujui" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {exp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button title="Edit Beban" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setExpenses(expenses.filter(e => e.id !== exp.id))} title="Hapus Beban" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
      {/* SUB-MODUL 3: JURNAL UMUM */}
      {/* ========================================================================= */}
      {currentSubTab === "buku-besar/jurnal-umum" && (
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
              onClick={() => setShowAddJrnModal(true)}
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
                  <th className="py-3.5 px-6 text-center">STATUS BALANCE</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {journals.map((jrn) => (
                  <tr key={jrn.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">{jrn.journalNo}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{jrn.date}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">{jrn.debetAcc}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">{jrn.kreditAcc}</td>
                    <td className="py-4 px-6 font-mono font-extrabold text-slate-900">{jrn.totalAmount}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        ✓ {jrn.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button title="Edit Jurnal" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setJournals(journals.filter(j => j.id !== jrn.id))} title="Hapus Jurnal" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
      {/* SUB-MODUL 4: ANGGARAN KEUANGAN */}
      {/* ========================================================================= */}
      {currentSubTab === "buku-besar/anggaran" && (
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
              onClick={() => setShowAddBdgModal(true)}
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
                  <th className="py-3.5 px-6">KODE ANGGARAN</th>
                  <th className="py-3.5 px-6">PERIODE</th>
                  <th className="py-3.5 px-6">AKUN TERIKAT</th>
                  <th className="py-3.5 px-6 font-mono">ALOKASI ANGGARAN</th>
                  <th className="py-3.5 px-6 font-mono">TERPAKAI</th>
                  <th className="py-3.5 px-6 font-mono">SISA SALDO</th>
                  <th className="py-3.5 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {budgets.map((bdg) => {
                  const sisa = bdg.allocated - bdg.used;
                  return (
                    <tr key={bdg.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-emerald-700">{bdg.code}</td>
                      <td className="py-4 px-6 font-bold text-slate-700">{bdg.period}</td>
                      <td className="py-4 px-6 font-extrabold text-slate-900">{bdg.account}</td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">{formatRupiah(bdg.allocated)}</td>
                      <td className="py-4 px-6 font-mono font-bold text-amber-700">{formatRupiah(bdg.used)}</td>
                      <td className="py-4 px-6 font-mono font-extrabold text-emerald-700">{formatRupiah(sisa)}</td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button title="Edit Anggaran" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => setBudgets(budgets.filter(b => b.id !== bdg.id))} title="Hapus Anggaran" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
      )}

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {budgets.map((bdg) => {
              const percent = Math.round((bdg.used / bdg.allocated) * 100);
              const sisa = bdg.allocated - bdg.used;
              return (
                <div key={bdg.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">{bdg.code}</span>
                    <span className="text-xs font-extrabold text-slate-700">{percent}% Terpakai</span>
                  </div>

                  <h5 className="font-extrabold text-slate-900 text-sm">{bdg.account}</h5>

                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        percent > 90 ? "bg-red-500" : percent > 70 ? "bg-amber-500" : "bg-emerald-500"
                      }`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Alokasi: {formatRupiah(bdg.allocated)}</span>
                    <span className="text-emerald-700 font-bold">Sisa: {formatRupiah(sisa)}</span>
                  </div>
                </div>
              );
            })}
          </div>
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

      {/* MODAL: CREATE PENCATATAN BEBAN */}
      {showAddExpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Create Pencatatan Beban</h3>
              <button onClick={() => setShowAddExpModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Nomor Bukti Voucher</label>
                <input type="text" required value={newExpData.voucherNo} onChange={(e) => setNewExpData({ ...newExpData, voucherNo: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Akun Beban</label>
                <select value={newExpData.account} onChange={(e) => setNewExpData({ ...newExpData, account: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border bg-white">
                  <option value="500-20 - Beban Listrik, Air & Internet">500-20 - Beban Listrik, Air & Internet</option>
                  <option value="500-30 - Beban Perlengkapan Kantor">500-30 - Beban Perlengkapan Kantor</option>
                  <option value="500-10 - Beban Gaji & Tunjangan">500-10 - Beban Gaji & Tunjangan</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Nominal Beban (Rp)</label>
                <input type="number" required placeholder="Contoh: 1500000" value={newExpData.amount} onChange={(e) => setNewExpData({ ...newExpData, amount: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold" />
              </div>
              <div className="pt-3 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowAddExpModal(false)} className="px-4 py-2 text-slate-600 font-bold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Simpan Beban</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE JURNAL UMUM */}
      {showAddJrnModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Create Jurnal Umum Baru</h3>
              <button onClick={() => setShowAddJrnModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddJournal} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Nomor Jurnal</label>
                <input type="text" required value={newJrnData.journalNo} onChange={(e) => setNewJrnData({ ...newJrnData, journalNo: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Akun Debet</label>
                <select value={newJrnData.debetAcc} onChange={(e) => setNewJrnData({ ...newJrnData, debetAcc: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border bg-white">
                  <option value="500-10 (Beban Gaji)">500-10 (Beban Gaji)</option>
                  <option value="500-20 (Beban Utilitas)">500-20 (Beban Utilitas)</option>
                  <option value="100-20 (Bank Mandiri)">100-20 (Bank Mandiri)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Akun Kredit</label>
                <select value={newJrnData.kreditAcc} onChange={(e) => setNewJrnData({ ...newJrnData, kreditAcc: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border bg-white">
                  <option value="100-10 (Kas Operasional)">100-10 (Kas Operasional)</option>
                  <option value="100-20 (Bank Mandiri)">100-20 (Bank Mandiri)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Total Nominal Jurnal (Rp)</label>
                <input type="number" required placeholder="Contoh: 5000000" value={newJrnData.totalAmount} onChange={(e) => setNewJrnData({ ...newJrnData, totalAmount: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold" />
              </div>
              <div className="pt-3 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowAddJrnModal(false)} className="px-4 py-2 text-slate-600 font-bold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Posting Jurnal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ANGGARAN */}
      {showAddBdgModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Create Anggaran Baru</h3>
              <button onClick={() => setShowAddBdgModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddBudget} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Kode Anggaran</label>
                <input type="text" required value={newBdgData.code} onChange={(e) => setNewBdgData({ ...newBdgData, code: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Periode Anggaran</label>
                <input type="text" required value={newBdgData.period} onChange={(e) => setNewBdgData({ ...newBdgData, period: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Nomor Akun Terikat</label>
                <select value={newBdgData.account} onChange={(e) => setNewBdgData({ ...newBdgData, account: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border bg-white">
                  <option value="500-20 - Beban Utilitas">500-20 - Beban Utilitas</option>
                  <option value="500-30 - Beban ATK & Ops">500-30 - Beban ATK & Ops</option>
                  <option value="500-10 - Beban Gaji Ops">500-10 - Beban Gaji Ops</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Alokasi Anggaran (Rp)</label>
                <input type="number" required placeholder="Contoh: 25000000" value={newBdgData.allocated} onChange={(e) => setNewBdgData({ ...newBdgData, allocated: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold" />
              </div>
              <div className="pt-3 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowAddBdgModal(false)} className="px-4 py-2 text-slate-600 font-bold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-[#00c885] text-white font-bold rounded-xl">Simpan Anggaran</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
