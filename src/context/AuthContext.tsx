import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@services/Api';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextData {
  isAuthenticated: boolean;
  auth: (token: string, login: string) => void;
  logout: () => void;
  login: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [login, setLogin] = useState<string | null>(null);

  const auth = (token: string, login: string) => {
    setIsAuthenticated(true);
    setLogin(login);
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('login', login);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setLogin(null);
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('login');
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedLogin = await AsyncStorage.getItem('login');

        if (storedToken && storedLogin) {
          setIsAuthenticated(true);
          setLogin(storedLogin);
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    };

    loadUserData();
  }, []);
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, auth, logout, login }}>
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
