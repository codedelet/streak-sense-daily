
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/types';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Mock user data for development
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('habitvault_user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('habitvault_user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const matchedUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (!matchedUser) {
      setLoading(false);
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userWithoutPassword } = matchedUser;
    
    setUser(userWithoutPassword);
    localStorage.setItem('habitvault_user', JSON.stringify(userWithoutPassword));
    setLoading(false);
  };
  
  const register = async (email: string, password: string, name?: string) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = MOCK_USERS.find((u) => u.email === email);
    
    if (existingUser) {
      setLoading(false);
      throw new Error('User already exists');
    }
    
    // In a real app, we would make an API call to register the user
    // For now, we just create a mock user
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      name,
    };
    
    setUser(newUser);
    localStorage.setItem('habitvault_user', JSON.stringify(newUser));
    setLoading(false);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('habitvault_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
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
