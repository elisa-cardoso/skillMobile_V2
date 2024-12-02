import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextData {
  isAuthenticated: boolean;
  auth: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const auth = (token: string) => {
    setIsAuthenticated(true);
    AsyncStorage.setItem('token', token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    AsyncStorage.removeItem('token');
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, auth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider.');
  }
  return context;
};
