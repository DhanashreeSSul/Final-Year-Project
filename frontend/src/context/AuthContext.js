import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shakti_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('shakti_token');
    if (!token) { setLoading(false); return; }
    try {
      const res = await authAPI.me();
      setUser(res.data.user);
      localStorage.setItem('shakti_user', JSON.stringify(res.data.user));
    } catch {
      localStorage.removeItem('shakti_token');
      localStorage.removeItem('shakti_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = (token, userData) => {
    localStorage.setItem('shakti_token', token);
    localStorage.setItem('shakti_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('shakti_token');
    localStorage.removeItem('shakti_user');
    setUser(null);
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    localStorage.setItem('shakti_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
