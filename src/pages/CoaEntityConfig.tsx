import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Sliders,
  Network,
  Save,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Landmark,
  ArrowLeftRight,
} from "lucide-react";
import { api as mockApi } from "../services/api";

interface CoaEntity {
  id: string | number;
  entity_code: string;
  entity_name: string;
}

interface CoaAccountRow {
  coa_id: number;
  account_number: string;
  account_name: string;
  parent_id: number | null;
  is_postable: boolean;
  is_cash_bank: boolean;
  is_intercompany: boolean;
  is_default: boolean;
  is_active: boolean;
}

interface CoaCategoryRow {
  category_id: number;
  category_name: string;
  sort_order: number;
  is_active: boolean;
  accounts: CoaAccountRow[];
}

interface BlockedItem {
  category_id?: number;
  coa_id?: number;
  message: string;
}

interface CoaEntityConfigProps {
  initialEntityId?: string | number | null;
}

const accountDepth = (account: CoaAccountRow, byId: Map<number, CoaAccountRow>): number => {
  let depth = 0;
  let current = account;
  while (current.parent_id) {
    const parent = byId.get(current.parent_id);
    if (!parent) break;
    depth += 1;
    current = parent;
  }
  return depth;
};

export const CoaEntityConfig = ({ initialEntityId }: CoaEntityConfigProps) => {
  const [entities, setEntities] = useState<CoaEntity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string | number>(initialEntityId || "");
  const [categories, setCategories] = useState<CoaCategoryRow[]>([]);
  const [activeCategoryIds, setActiveCategoryIds] = useState<Set<number>>(new Set());
  const [activeAccountIds, setActiveAccountIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [blocked, setBlocked] = useState<BlockedItem[]>([]);

  const loadEntities = useCallback(async () => {
    const data = await mockApi.getCoaEntities();
    setEntities(data);
    if (!selectedEntityId && data[0]?.id) {
      setSelectedEntityId(data[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConfig = useCallback(async (entityId: string | number) => {
    setLoading(true);
    try {
      const data = await mockApi.getCoaEntityConfig(entityId);
      const cats: CoaCategoryRow[] = data.categories || [];
      setCategories(cats);
      setActiveCategoryIds(new Set(cats.filter((c) => c.is_active).map((c) => c.category_id)));
      setActiveAccountIds(new Set(cats.flatMap((c) => c.accounts.filter((a) => a.is_active).map((a) => a.coa_id))));
      setBlocked([]);
    } catch (err) {
      console.error("Failed to load coa entity config", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  useEffect(() => {
    if (selectedEntityId) {
      loadConfig(selectedEntityId);
    }
  }, [selectedEntityId, loadConfig]);

  const accountsById = useMemo(() => {
    const map = new Map<number, CoaAccountRow>();
    categories.forEach((c) => c.accounts.forEach((a) => map.set(a.coa_id, a)));
    return map;
  }, [categories]);

  const toggleCategory = (categoryId: number) => {
    setActiveCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const toggleAccount = (account: CoaAccountRow, categoryActive: boolean) => {
    // Akun induk (header, is_postable=false) tidak bisa dipilih manual — statusnya
    // otomatis mengikuti akun anak yang aktif di bawahnya (lihat cascade-parent trigger).
    if (!categoryActive || !account.is_postable) return;
    setActiveAccountIds((prev) => {
      const next = new Set(prev);
      if (next.has(account.coa_id)) {
        next.delete(account.coa_id);
      } else {
        next.add(account.coa_id);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedEntityId) return;
    setSaving(true);
    setBlocked([]);
    try {
      // Header (akun induk, is_postable=false) tidak pernah dikirim di sini — statusnya
      // murni hasil cascade-parent trigger saat anak postable-nya aktif.
      const postableAccountIds = Array.from(activeAccountIds).filter((id) => accountsById.get(id)?.is_postable);

      const categoryResult = await mockApi.saveCoaEntityCategories(selectedEntityId, Array.from(activeCategoryIds));
      const accountResult = await mockApi.saveCoaEntityAccounts(selectedEntityId, postableAccountIds);

      const allBlocked: BlockedItem[] = [
        ...(categoryResult?.blocked || []),
        ...(accountResult?.blocked || []),
        ...(accountResult?.rejected || []),
      ];
      setBlocked(allBlocked);

      // Server adalah sumber kebenaran (kategori/akun yang diblokir trigger tetap aktif) - reload.
      await loadConfig(selectedEntityId);

      if (allBlocked.length === 0) {
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save coa entity config", err);
    } finally {
      setSaving(false);
    }
  };

  const currentEntity = entities.find((e) => String(e.id) === String(selectedEntityId));
  const totalActiveAccounts = activeAccountIds.size;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Holding-level COA / Konfigurasi Nomor Akun per Office</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Konfigurasi Nomor Akun per Office
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pilih dulu tipe nomor akun (kategori) yang berlaku untuk entity ini, lalu pilih akun spesifik di dalam tiap kategori yang dilanggan.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <Network className="w-4 h-4 text-emerald-600 ml-1" />
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Pilih Entity:</p>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer mt-0.5"
            >
              {entities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.entity_name} ({e.entity_code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <span>Konfigurasi nomor akun untuk {currentEntity?.entity_name} berhasil disimpan!</span>
          </div>
          <span className="text-[10px] bg-emerald-700 px-2.5 py-1 rounded-lg">
            {totalActiveAccounts} Akun Aktif
          </span>
        </div>
      )}

      {blocked.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <AlertTriangle className="w-4 h-4" />
            <span>Sebagian perubahan tidak bisa disimpan</span>
          </div>
          <ul className="text-[11px] font-medium list-disc list-inside space-y-0.5">
            {blocked.map((b, i) => (
              <li key={i}>{b.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Active Entity Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#00c885] flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">{currentEntity?.entity_name || "-"}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Kode: <span className="text-slate-300 font-semibold">{currentEntity?.entity_code}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs relative z-10">
          <div className="text-right hidden sm:block">
            <p className="text-slate-400 text-[10px] font-bold uppercase">TIPE AKUN DILANGGAN</p>
            <p className="text-[#00c885] font-black text-lg">{activeCategoryIds.size} dari {categories.length} Kategori</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !selectedEntityId}
            className="flex items-center gap-2 px-6 py-3 bg-[#00c885] hover:bg-[#00b377] text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "Simpan Konfigurasi"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-400 text-xs shadow-xs">
          Memuat konfigurasi...
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryActive = activeCategoryIds.has(category.category_id);
            return (
              <div key={category.category_id} className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
                <div
                  onClick={() => toggleCategory(category.category_id)}
                  className={`flex items-center justify-between gap-4 px-6 py-4 cursor-pointer transition-colors ${
                    categoryActive ? "bg-emerald-50/70" : "bg-slate-50/60 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={categoryActive}
                      onChange={() => toggleCategory(category.category_id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <Layers className={`w-4 h-4 ${categoryActive ? "text-emerald-600" : "text-slate-400"}`} />
                    <div>
                      <p className="font-extrabold text-sm text-slate-900">{category.category_name}</p>
                      <p className="text-[11px] text-slate-500">
                        {category.accounts.filter((a) => activeAccountIds.has(a.coa_id)).length} dari {category.accounts.length} akun aktif
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    categoryActive ? "bg-emerald-200/80 text-emerald-900" : "bg-slate-200 text-slate-600"
                  }`}>
                    {categoryActive ? "Dilanggan" : "Tidak Dilanggan"}
                  </span>
                </div>

                {categoryActive && (
                  <div className="divide-y divide-slate-100 border-t border-slate-100">
                    {category.accounts.length === 0 ? (
                      <p className="px-6 py-4 text-xs text-slate-400">Belum ada akun di kategori ini.</p>
                    ) : (
                      category.accounts.map((account) => {
                        const depth = accountDepth(account, accountsById);
                        const checked = activeAccountIds.has(account.coa_id);
                        return (
                          <label
                            key={account.coa_id}
                            style={{ paddingLeft: `${1.5 + depth * 1.5}rem` }}
                            className={`flex items-center justify-between gap-4 pr-6 py-2.5 ${
                              account.is_postable ? "cursor-pointer" : "cursor-default"
                            } ${checked ? "bg-emerald-50/40" : account.is_postable ? "hover:bg-slate-50" : ""}`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={!account.is_postable}
                                onChange={() => toggleAccount(account, categoryActive)}
                                title={account.is_postable ? undefined : "Akun induk mengikuti status akun anak secara otomatis"}
                                className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                              />
                              <span className={`font-mono text-[11px] ${account.is_postable ? "text-slate-500" : "text-slate-400"}`}>
                                {account.account_number}
                              </span>
                              <span className={`text-xs truncate ${account.is_postable ? "font-semibold text-slate-800" : "font-extrabold text-slate-600"}`}>
                                {account.account_name}
                              </span>
                              {account.is_cash_bank && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded">
                                  <Landmark className="w-2.5 h-2.5" /> Kas/Bank
                                </span>
                              )}
                              {account.is_intercompany && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
                                  <ArrowLeftRight className="w-2.5 h-2.5" /> Intercompany
                                </span>
                              )}
                              {!account.is_postable && (
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Header · Otomatis</span>
                              )}
                            </div>
                            {account.is_default && (
                              <span className="text-[9px] font-bold text-emerald-600 shrink-0">Default</span>
                            )}
                          </label>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
