import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("apg_current_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewableSubmoduleCodes, setViewableSubmoduleCodes] = useState(null);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  useEffect(() => {
    // Sync initial approvals count from API (only once authenticated)
    if (!currentUser) return;
    api.getApprovals()
      .then((approvals) => {
        if (Array.isArray(approvals)) {
          setPendingApprovalsCount(approvals.filter(a => a.status === 'Pending').length);
        }
      })
      .catch(() => {});
  }, [currentUser]);

  useEffect(() => {
    // Load effective granular permissions (office_modules + role_submodule_permissions)
    if (!currentUser?.role?.id || !currentUser?.office?.id) {
      setViewableSubmoduleCodes(null);
      setPermissionsLoaded(!currentUser);
      return;
    }
    setPermissionsLoaded(false);
    api.getEffectivePermissions(currentUser.office.id, currentUser.role.id)
      .then((res) => {
        const submodules = res?.effective_submodules || [];
        const codes = new Set(submodules.filter(s => s.can_view).map(s => s.code));
        setViewableSubmoduleCodes(codes);
      })
      .catch(() => {
        // Fail-open: no permission data available, don't add extra restrictions
        setViewableSubmoduleCodes(null);
      })
      .finally(() => setPermissionsLoaded(true));
  }, [currentUser?.role?.id, currentUser?.office?.id]);

  const login = async (username, password, rolePreset = null) => {
    setLoading(true);
    try {
      // If rolePreset is provided (dev quick switch), use username mapping
      const loginUsername = username || (rolePreset ? rolePreset.toLowerCase() : "admin");
      const loginPassword = password || "password";

      const res = await api.login(loginUsername, loginPassword);
      if (res.success && res.user) {
        const formattedUser = {
          ...res.user,
          roleCode: res.user.role?.code || "SUPER_ADMIN",
          roleDetails: res.user.role || { code: "SUPER_ADMIN", name: "Super Admin" },
        };
        setCurrentUser(formattedUser);
        localStorage.setItem("apg_current_user", JSON.stringify(formattedUser));
        return { success: true, user: formattedUser };
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message || "Gagal terhubung ke server backend" };
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (roleCode) => {
    setLoading(true);
    try {
      const res = await api.login(roleCode.toLowerCase(), "password");
      if (res.success && res.user) {
        const formattedUser = {
          ...res.user,
          roleCode: res.user.role?.code || roleCode,
          roleDetails: res.user.role || { code: roleCode, name: roleCode },
        };
        setCurrentUser(formattedUser);
        localStorage.setItem("apg_current_user", JSON.stringify(formattedUser));
      }
    } catch (err) {
      console.error("Gagal ganti role:", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      // ignore
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("apg_current_user");
      localStorage.removeItem("apg_token");
    }
  };

  const updateApprovalsCount = (count) => {
    setPendingApprovalsCount(count);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchRole,
        pendingApprovalsCount,
        updateApprovalsCount,
        loading,
        viewableSubmoduleCodes,
        permissionsLoaded
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
