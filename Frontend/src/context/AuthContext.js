// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : null;
  });
  const navigate = useNavigate();

  const login = (data) => {
    const authData = {
      isAuthenticated: true,
      token: data.token,
      user: data.user
    };
    localStorage.setItem('auth', JSON.stringify(authData));
    setAuth(authData);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);