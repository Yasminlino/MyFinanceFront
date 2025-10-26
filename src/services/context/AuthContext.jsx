import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificando o JWT
        const expirationTime = decodedToken.exp * 1000; // Expiração em milissegundos

        if (expirationTime < Date.now()) {
          setIsAuthenticated(false);
          setIsTokenExpired(true);
          localStorage.removeItem('authToken'); // Remove o token expirado
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, [])

  const login = () => setIsAuthenticated(true);
  
  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);