'use client';
import { ethers } from 'ethers';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  provider: ethers.BrowserProvider | undefined;
  address: string
  login: (provider: ethers.BrowserProvider) => void;
  logout: () => void;
  setAddress: React.Dispatch<React.SetStateAction<string>>
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | undefined>(undefined);

  const login = useCallback((provider: ethers.BrowserProvider) => {
    setProvider(provider);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setProvider(undefined);
    setIsLoggedIn(false);
    setAddress('');
  }, []);

  useEffect(() => {
    if (isLoggedIn && pathname === '/') {
      router.push('/runes');
    }
  }, [pathname])

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, provider, address, setAddress, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};