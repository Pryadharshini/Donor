import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../config";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      try {
        const { data } = await axios.get(`${API_URL}/api/donors/profile`, {

          headers: { Authorization: `Bearer ${token}` }
        });
        setUser({ name: data.fullName, email: data.email, bloodGroup: data.bloodGroup, role: data.role || 'donor' });
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }
    };
    autoLogin();
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = (userData) => {
    setUser(userData);
    addToast('Welcome back! Logged in successfully.', 'success');
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
    addToast('Logged out successfully.', 'info');
  };

  return (
    <AppContext.Provider value={{ darkMode, setDarkMode, user, login, logout, toasts, addToast, removeToast }}>
      {children}
    </AppContext.Provider>
  );
}
