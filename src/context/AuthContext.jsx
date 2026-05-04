import { createContext, useContext, useMemo, useState } from 'react';
import { loginRequest, registerRequest } from '../api/auth';

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('usuario'));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(getStoredUser);

  const saveSession = ({ token: nextToken, usuario: nextUser }) => {
    localStorage.setItem('token', nextToken);
    localStorage.setItem('usuario', JSON.stringify(nextUser));
    setToken(nextToken);
    setUsuario(nextUser);
  };

  const login = async (credentials) => {
    const { data } = await loginRequest(credentials);
    saveSession(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await registerRequest(payload);
    if (data.token) saveSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  const value = useMemo(
    () => ({ token, usuario, isAuthenticated: Boolean(token), login, register, logout }),
    [token, usuario],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
