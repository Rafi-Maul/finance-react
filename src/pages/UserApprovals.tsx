import { useState, useEffect } from "react";
import { UserCheck, Check, X, CheckCircle2 } from "lucide-react";
import { api as mockApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

interface Approval {
  id: string;
  applicant_name?: string;
  email?: string;
  targetOffice?: { name?: string };
  target_office?: { name?: string };
  requested_by?: string;
  targetRole?: { name?: string };
  target_role?: { name?: string };
  created_at?: string;
}

interface NewCredential {
  name?: string;
  username?: string;
  password?: string;
}

export const UserApprovals = () => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [, setLoading] = useState(true);
  const [newCredential, setNewCredential] = useState<NewCredential | null>(null);
  const { updateApprovalsCount } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    setLoading(true);
    const data = await mockApi.getApprovals({ status: "Pending" });
    setApprovals(data);
    updateApprovalsCount(data.length);
    setLoading(false);
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const res = await mockApi.processApproval(id, action);
    if (res.success) {
      if (action === "approve" && res.temporary_password) {
        setNewCredential({
          name: res.data?.applicant_name,
          username: res.user?.username,
          password: res.temporary_password,
        });
      } else {
        showToast(`Permohonan telah berhasil di-${action === "approve" ? "disetujui" : "ditolak"}.`);
      }
      loadApprovals();
    } else {
      showToast(res.message || "Gagal memproses permohonan.", "error");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* New Account Credential Banner — stays until dismissed so admin has time to copy it */}
      {newCredential && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 p-4 rounded-xl shadow-lg flex items-start justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-emerald-600" />
            <div className="text-sm">
              <p className="font-bold">
                Akun untuk {newCredential.name} berhasil dibuat. Sampaikan kredensial berikut ke pemohon:
              </p>
              <p className="font-mono text-xs mt-1.5 bg-white border border-emerald-200 rounded-lg px-3 py-2 inline-block">
                Username: <strong>{newCredential.username}</strong> &nbsp;•&nbsp; Password sementara: <strong>{newCredential.password}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setNewCredential(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs shrink-0 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Administrasi User & Persetujuan Otorisasi
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Verifikasi pendaftaran pengguna baru dan permohonan wewenang akun dari Anak Perusahaan & Cabang.
        </p>
      </div>

      {/* Approvals Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Daftar Permohonan Menunggu Persetujuan ({approvals.length})</span>
          </h4>
        </div>

        {approvals.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            Tidak ada permohonan persetujuan user yang menggantung saat ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">NAMA PEMOHON</th>
                  <th className="py-3.5 px-6">ENTITAS / COMPANY</th>
                  <th className="py-3.5 px-6">DIAJUKAN OLEH</th>
                  <th className="py-3.5 px-6">ROLE DIMAJUKAN</th>
                  <th className="py-3.5 px-6">TANGGAL</th>
                  <th className="py-3.5 px-6 text-center">AKSI PERSETUJUAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {approvals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{item.applicant_name}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{item.email}</p>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      {item.targetOffice?.name || item.target_office?.name || "-"}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                        {item.requested_by || "-"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-md">
                        {item.targetRole?.name || item.target_role?.name || "-"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-mono">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAction(item.id, "approve")}
                          className="flex items-center gap-1 bg-[#00c885] hover:bg-[#00b377] text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui</span>
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "reject")}
                          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
