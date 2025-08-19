import { createContext, useContext, useEffect, useState } from "react";
import { http } from "../api/http";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    try {
      const { data } = await http.get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    await http.post("/auth/login", { email, password });
    await fetchMe();
  }

  async function register(name, email, password) {
    await http.post("/auth/register", { name, email, password });
    await login(email, password);
  }

  async function logout() {
    await http.post("/auth/logout");
    setUser(null);
  }

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
