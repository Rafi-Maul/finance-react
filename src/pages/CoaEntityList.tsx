import { useState, useEffect, type FormEvent } from "react";
import { Network, Plus, CheckCircle2, Sliders, Trash2 } from "lucide-react";
import { api as mockApi } from "../services/api";
import { Modal } from "../components/common";
import { useToast } from "../context/ToastContext";

interface CoaEntity {
  id: string | number;
  entity_code: string;
  entity_name: string;
  parent_entity_id?: string | number | null;
  parent?: { entity_name?: string } | null;
  is_active?: boolean;
}

interface CoaEntityListProps {
  onNavigateToConfig?: (entityId: string | number) => void;
}

interface NewEntityForm {
  entity_code: string;
  entity_name: string;
  parent_entity_id: string;
}

const emptyForm: NewEntityForm = { entity_code: "", entity_name: "", parent_entity_id: "" };

export const CoaEntityList = ({ onNavigateToConfig }: CoaEntityListProps) => {
  const { showToast } = useToast();
  const [entities, setEntities] = useState<CoaEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<NewEntityForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getCoaEntities();
      setEntities(data);
    } catch (err) {
      console.error("Failed to fetch coa entities", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntity = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.entity_code.trim() || !form.entity_name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const created = await mockApi.addCoaEntity({
        entity_code: form.entity_code,
        entity_name: form.entity_name,
        parent_entity_id: form.parent_entity_id || null,
      });
      setShowAddModal(false);
      setForm(emptyForm);
      await fetchEntities();
      showToast(`Entity "${form.entity_name}" berhasil dibuat!`);
      // Alur: begitu entity baru dibuat, lanjut langsung ke pemilihan tipe nomor akun.
      if (onNavigateToConfig && created?.id) {
        onNavigateToConfig(created.id);
      }
    } catch (err: any) {
      setError(err?.message || "Gagal membuat entity");
      showToast(err?.message || "Gagal membuat entity", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntity = async (entity: CoaEntity) => {
    if (!window.confirm(`Hapus entity "${entity.entity_name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await mockApi.deleteCoaEntity(entity.id);
      fetchEntities();
      showToast(`Entity "${entity.entity_name}" berhasil dihapus`);
    } catch (err: any) {
      showToast(err?.message || "Gagal menghapus entity", "error");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Network className="w-4 h-4" />
            <span>Holding-level COA / Entity</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Entitas / Anak Perusahaan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Holding dan anak perusahaan yang memakai chart of accounts terpusat. Setiap entity mengaktifkan subset akun sendiri lewat Konfigurasi Nomor Akun.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00c885] hover:bg-[#00b377] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Entity</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Kode</th>
                <th className="py-4 px-6">Nama Entity</th>
                <th className="py-4 px-6">Induk (Holding)</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Memuat daftar entity...
                  </td>
                </tr>
              ) : entities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada entity. Tambahkan holding atau anak perusahaan pertama.
                  </td>
                </tr>
              ) : (
                entities.map((entity) => (
                  <tr key={entity.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{entity.entity_code}</td>
                    <td className="py-4 px-6 text-slate-800 font-semibold">{entity.entity_name}</td>
                    <td className="py-4 px-6 text-slate-600">{entity.parent?.entity_name || "-"}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {entity.is_active === false ? "Nonaktif" : "Aktif"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onNavigateToConfig && onNavigateToConfig(entity.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Nomor Akun</span>
                        </button>
                        <button
                          onClick={() => handleDeleteEntity(entity)}
                          className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Entity Baru" maxWidth="max-w-md">
        <form onSubmit={handleAddEntity} className="space-y-4 text-xs">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Kode Entity</label>
            <input
              type="text"
              required
              placeholder="Contoh: ANPER-C"
              value={form.entity_code}
              onChange={(e) => setForm({ ...form, entity_code: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Entity</label>
            <input
              type="text"
              required
              placeholder="Contoh: PT Anak Perusahaan C"
              value={form.entity_name}
              onChange={(e) => setForm({ ...form, entity_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Induk (Holding), opsional</label>
            <select
              value={form.parent_entity_id}
              onChange={(e) => setForm({ ...form, parent_entity_id: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500 cursor-pointer"
            >
              <option value="">- Tidak ada (ini holding) -</option>
              {entities.map((e) => (
                <option key={e.id} value={e.id}>{e.entity_name}</option>
              ))}
            </select>
          </div>

          <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            Setelah entity dibuat, kamu akan diarahkan langsung ke pemilihan tipe nomor akun (kategori) untuk entity ini.
          </p>

          <div className="pt-2 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#00c885] hover:bg-[#00b377] text-white rounded-xl font-bold transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
            >
              {saving ? "Menyimpan..." : "Simpan & Lanjut Konfigurasi"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
