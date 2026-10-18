import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data?.success) {
          setUser(res.data.user);
          setShop(res.data.shop || null);
        }
      } catch (err) {
        setUser(null);
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        if (res.data.token) {
          localStorage.setItem('posh_puzzle_token', res.data.token);
        }
        setUser(res.data.user);
        // Refresh me to load shop if vendor
        const meRes = await api.get('/auth/me');
        setShop(meRes.data?.shop || null);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data?.success) {
        if (res.data.token) {
          localStorage.setItem('posh_puzzle_token', res.data.token);
        }
        setUser(res.data.user);
        const meRes = await api.get('/auth/me');
        setShop(meRes.data?.shop || null);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role = 'customer') => {
    setLoading(true);
    try {
      const res = await api.post(`/auth/demo/${role}`);
      if (res.data?.success) {
        if (res.data.token) {
          localStorage.setItem('posh_puzzle_token', res.data.token);
        }
        setUser(res.data.user);
        const meRes = await api.get('/auth/me');
        setShop(meRes.data?.shop || null);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('posh_puzzle_token');
      setUser(null);
      setShop(null);
    }
  };

  const updateProfile = async (payload) => {
    try {
      const res = await api.put('/auth/update-profile', payload);
      if (res.data?.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        shop,
        loading,
        isAuthenticated: !!user,
        isVendor: user?.role === 'vendor',
        isAdmin: user?.role === 'admin',
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
