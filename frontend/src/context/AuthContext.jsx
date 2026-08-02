import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authAPI.me()
        .then((res) => {
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        })
        .catch((err) => {
          // Only clear session if backend explicitly returns 401 Unauthorized
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const tokenVal = res.data.token || res.data.access_token;
    const userVal = res.data.user;

    if (tokenVal) localStorage.setItem('token', tokenVal);
    if (userVal) localStorage.setItem('user', JSON.stringify(userVal));

    setToken(tokenVal);
    setUser(userVal);
    return res.data;
  };

  const register = async (name, email, password, phone, role) => {
    const res = await authAPI.register({ name, email, password, phone, role });
    const tokenVal = res.data.token || res.data.access_token;
    const userVal = res.data.user;

    if (tokenVal) localStorage.setItem('token', tokenVal);
    if (userVal) localStorage.setItem('user', JSON.stringify(userVal));

    setToken(tokenVal);
    setUser(userVal);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
