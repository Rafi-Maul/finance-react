import { useState, type FormEvent } from "react";
import { Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("superadmin");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const res = await login(username, password);
    if (!res.success) {
      setError(res.message || "Username atau kata sandi tidak valid.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#00c885] selection:text-white">
      {/* Dynamic Background Glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl z-10 p-8 md:p-10 space-y-6">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#00c885] flex items-center justify-center font-extrabold text-white text-3xl shadow-lg shadow-emerald-500/30">
            A
          </div>
          <div>
            <h1 className="font-black text-2xl text-white tracking-wider">
              APG FINANCE
            </h1>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">
              ARDANA PERKASA GROUP
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-xs">
            Portal Keuangan & Manajemen Multi-Entitas Holding APG
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3.5 rounded-2xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Username / Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-600 focus:outline-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs font-medium text-white placeholder-slate-600 focus:outline-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00c885] hover:bg-[#00b377] text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{loading ? "Memproses..." : "Masuk Sistem APG"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            APG Finance System v2.6 • Multi-Company Authorization Engine
          </p>
        </div>
      </div>
    </div>
  );
};
