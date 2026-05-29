import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { signInWithEmail, signUpWithEmail, updateUserProfile } from "../services/authService.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "luna-hijab-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const persistUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  };

  const login = async ({ email, password }) => {
    const nextUser = await signInWithEmail(email, password);
    persistUser(nextUser);
    return nextUser;
  };

  const register = async ({ email, password, fullName }) => {
    const nextUser = await signUpWithEmail({ email, password, fullName });
    persistUser(nextUser);
    return nextUser;
  };

  const updateProfile = async (payload) => {
    if (!user) throw new Error("You must be logged in to update profile.");
    const nextUser = await updateUserProfile(user, payload);
    persistUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      register,
      updateProfile,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
