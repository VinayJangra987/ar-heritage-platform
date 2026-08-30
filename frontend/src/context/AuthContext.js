import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const getMe = useCallback(async (token) => {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return await res.json();
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const storedRefresh = localStorage.getItem("refreshToken");
      if (!storedRefresh) throw new Error("No refresh token");

      const res  = await fetch(`${API_BASE}/api/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefresh }),
      });
      const data = await res.json();

      if (!res.ok || !data.token) throw new Error("Refresh failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      return data.token;
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }

      try {
        const data = await getMe(token);
        if (data?.user) { setUser(data.user); return; }
        throw new Error("No user");
      } catch {
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            const data = await getMe(newToken);
            if (data?.user) setUser(data.user);
          } catch {
            setUser(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [getMe, refreshAccessToken]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      const newToken = await refreshAccessToken();
      if (!newToken) setUser(null);
    }, 13 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, refreshAccessToken]);

  const signup = async (name, email, password, confirmPassword) => {
    try {
      setError(null);
      const res  = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return { success: false, message: data.message };
      }
      return { success: true, requiresOTP: true, email, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      setError(null);
      const res  = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return { success: false, message: data.message };
      }

      localStorage.setItem("token",        data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      const meData = await getMe(data.token);
      setUser(meData?.user || data.user);

      return { success: true, user: meData?.user || data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const resendOTP = async (email) => {
    try {
      const res  = await fetch(`${API_BASE}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const login = async (email, password, twoFactorCode) => {
    try {
      setError(null);
      const res  = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, twoFactorCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        if (data.requiresOTP) return { success: false, requiresOTP: true, email, message: data.message };
        if (data.requires2FA) return { success: false, requires2FA: true, email, message: data.message };
        return { success: false, message: data.message };
      }

      if (data.requires2FA) {
        return { success: false, requires2FA: true, email, message: data.message };
      }

      localStorage.setItem("token",        data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      const meData = await getMe(data.token);
      setUser(meData?.user || data.user);

      return { success: true, user: meData?.user || data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setError(null);
  };

  const toggleFavorite = async (siteId) => {
    if (!user) return { success: false };
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_BASE}/api/favorites/toggle/${siteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      if (data.success) {
        setUser(prev => ({ ...prev, favorites: data.favorites }));
        return { success: true };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  };

  // ── FORGOT PASSWORD — sends OTP ──
  const forgotPassword = async (email) => {
    try {
      const res  = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ── VERIFY RESET OTP — returns short-lived resetToken ──
  const verifyResetOtp = async (email, otp) => {
    try {
      const res  = await fetch(`${API_BASE}/api/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ── RESET PASSWORD — now logs the user in immediately, same as login ──
  const resetPassword = async (resetToken, newPassword) => {
    try {
      const res  = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.message };
      }

      // Backend now returns token + refreshToken + user — log in right away
      if (data.token) {
        localStorage.setItem("token",        data.token);
        localStorage.setItem("refreshToken", data.refreshToken);

        const meData = await getMe(data.token);
        setUser(meData?.user || data.user);
      }

      return { success: true, message: data.message, user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const setup2FA = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_BASE}/api/auth/2fa/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const verify2FA = async (code) => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_BASE}/api/auth/2fa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ token: code }),
      });
      const data  = await res.json();
      if (data.success) {
        setUser(prev => (prev ? { ...prev, twoFactorEnabled: true } : prev));
      }
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const disable2FA = async (password) => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_BASE}/api/auth/2fa/disable`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password }),
      });
      const data  = await res.json();
      if (data.success) {
        setUser(prev => (prev ? { ...prev, twoFactorEnabled: false } : prev));
      }
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      signup, login, logout,
      verifyOTP, resendOTP,
      toggleFavorite,
      forgotPassword, verifyResetOtp, resetPassword,
      setup2FA, verify2FA, disable2FA,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};