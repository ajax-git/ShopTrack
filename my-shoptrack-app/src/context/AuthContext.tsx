import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  logIn: (token: string) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const checkTokenValidity = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiresAt = payload.exp * 1000;
  return Date.now() < expiresAt;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(checkTokenValidity());

  useEffect(() => {
    const interval = setInterval(() => {
      if (!checkTokenValidity() && isLoggedIn) {
        logOut();
      }
    }, 1000 * 60 * 5);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const logIn = (token: string) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;