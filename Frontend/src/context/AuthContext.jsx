"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true while rehydrating from localStorage

  // Rehydrate session on first load
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      // Django REST Framework returns errors in various shapes
      const message =
        data?.non_field_errors?.[0] ||
        data?.detail ||
        "Erro ao fazer login.";
      throw new Error(message);
    }

    const data = await response.json();

    const userData = {
      id: data.user_id,
      username: data.username,
      role: data.role,
    };

    setToken(data.token);
    setUser(userData);
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setCookie("authToken", data.token);
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });
    } catch (_) {
      // logout locally regardless of network failure
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      deleteCookie("authToken");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}