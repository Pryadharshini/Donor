import { createContext, useContext, useState, useEffect } from 'react';

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
    setUser(null);
    addToast('Logged out successfully.', 'info');
  };

  return (
    <AppContext.Provider value={{ darkMode, setDarkMode, user, login, logout, toasts, addToast, removeToast }}>
      {children}
    </AppContext.Provider>
  );
}
