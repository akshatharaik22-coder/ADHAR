import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [aadhaar, setAadhaar] = useState('');

  const login = (token, aadhaar) => {
    setToken(token);
    setAadhaar(aadhaar);
  };

  const logout = () => {
    setToken(null);
    setAadhaar('');
  };

  return (
    <AuthContext.Provider value={{ token, aadhaar, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);