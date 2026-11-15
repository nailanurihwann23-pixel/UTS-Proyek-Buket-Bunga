/**
 * AuthContext.jsx — Provider autentikasi (Admin & Pelanggan)
 *
 * ⚠️  DEMO ONLY — Bukan keamanan produksi.
 * State login disimpan di localStorage/sessionStorage.
 * Sistem Informasi Buket Bunga
 */

import { useState } from 'react';
import { AuthContext } from './authContextDef.js';
import { MOCK_USERS } from '../data/mockUsers.js';
import {
  loginAdmin,
  loginCustomer,
  loginUser,
  registerCustomer,
  logoutAdmin,
  logoutUser,
} from '../services/mockService.js';

function getInitialUser() {
  // Disable auto‑login for demo; clear any persisted session.
  try {
    localStorage.removeItem('buket_current_user');
    sessionStorage.removeItem('buket_demo_user');
  } catch {}
  // Always start as guest.
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false);

  function saveSession(userData) {
    setUser(userData);
    try {
      localStorage.setItem('buket_current_user', JSON.stringify(userData));
      sessionStorage.setItem('buket_demo_user', JSON.stringify(userData));
    } catch {
      // ignore
    }
  }

  function clearSession() {
    setUser(null);
    try {
      localStorage.removeItem('buket_current_user');
      sessionStorage.removeItem('buket_demo_user');
    } catch {
      // ignore
    }
  }

  // Login umum (mendeteksi admin atau pelanggan)
  async function login(username, password) {
    setLoading(true);
    try {
      const result = await loginUser(username, password);
      saveSession(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  }

  // Khusus login admin
  async function loginAsAdmin(username, password) {
    setLoading(true);
    try {
      const result = await loginAdmin(username, password);
      saveSession(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  }

  // Khusus login customer
  async function loginAsCustomer(username, password) {
    setLoading(true);
    try {
      const result = await loginCustomer(username, password);
      saveSession(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  }

  // Registrasi customer baru
  async function register(userData) {
    setLoading(true);
    try {
      const result = await registerCustomer(userData);
      saveSession(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      if (user?.role === 'admin') {
        await logoutAdmin();
      } else {
        await logoutUser();
      }
      clearSession();
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isCustomer,
        login,
        loginAsAdmin,
        loginAsCustomer,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
