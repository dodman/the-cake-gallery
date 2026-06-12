"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; phone: string; password: string; address?: string }) => Promise<void>;
  logout: () => void;
  updateSession: (token: string, user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("sbk_token");
    const savedUser = localStorage.getItem("sbk_user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const saveSession = (nextToken: string, nextUser: User) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("sbk_token", nextToken);
    localStorage.setItem("sbk_user", JSON.stringify(nextUser));
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    async login(email, password) {
      const result = await api.login({ email, password });
      saveSession(result.token, result.user);
    },
    async register(payload) {
      const result = await api.register(payload);
      saveSession(result.token, result.user);
    },
    logout() {
      setToken(null);
      setUser(null);
      localStorage.removeItem("sbk_token");
      localStorage.removeItem("sbk_user");
    },
    updateSession: saveSession
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

