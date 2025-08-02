import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: number;
  email: string;
  username: string;
}

interface UserContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        // Here you might want to fetch the user profile from the server
        // For now, we'll just assume the user is valid if the token exists
        // You can add that logic back here if you need it.
        const userString = await SecureStore.getItemAsync('user');
        if (userString) {
            setUser(JSON.parse(userString));
        }
      }
      setIsLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const login = async (user: User, token: string) => {
    setUser(user);
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
