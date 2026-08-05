import React, { useState, useEffect } from "react";
import { Building2, ArrowLeft, Save } from "lucide-react";
import { api } from "../services/api";

export const OfficeEdit = ({ officeId, onDone }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [offices, setOffices] = useState([]);
  const [form, setForm] = useState({
    code: "",
    name: "",
    type: "Anper",
    parent_id: "",
    status: "Aktif",
    address: "",
    city: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [office, officeList] = await Promise.all([
          api.getOffice(officeId),
          api.getOffices(),
        ]);
        setOffices(officeList.filter((o) => o.id !== officeId));
        setForm({
          code: office.code || "",
          name: office.name || "",
          type: office.type || "Anper",
          parent_id: office.parent_id || "",
          status: office.status || "Aktif",
          address: office.address || "",
          city: office.city || "",
          phone: office.phone || "",
          email: office.email || "",
        });
      } catch (err) {
        setError(err.message || "Gagal memuat data office");
      } finally {
        setLoading(false);
      }
    };
    if (officeId) load();
  }, [officeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.updateOffice(officeId, {
        ...form,
        parent_id: form.parent_id || null,
      });
      onDone && onDone();
    } catch (err) {
      setError(err.message || "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onDone && onDone()}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Office Config / Edit Office</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Office</h1>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-6">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-8">Memuat data office...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2.5 font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode Office</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Office / Entitas</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipe Office</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500 cursor-pointer"
                >
                  <option value="Anper">Anak Perusahaan (Anper)</option>
                  <option value="Cabang">Cabang Operasional</option>
                  <option value="KCL">Internal Unit (KCL)</option>
                  <option value="Holding">Holding (Induk)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Induk Entitas (Parent)</label>
                <select
                  value={form.parent_id}
                  onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500 cursor-pointer"
                >
                  <option value="">Tidak ada (Holding / Induk Utama)</option>
                  {offices.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500 cursor-pointer"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Telepon</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kota</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Alamat</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-emerald-500"
                />
              </div>
            </div>

            <div className="pt-3 flex gap-2 justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={() => onDone && onDone()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#00c885] hover:bg-[#00b377] text-white rounded-xl font-bold transition-colors cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
