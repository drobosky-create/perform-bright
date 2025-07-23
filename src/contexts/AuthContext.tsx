import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Sarah Johnson',
    role: 'admin',
    department: 'HR',
    employmentType: 'employee',
    reviewCadence: 'quarterly',
    createdAt: new Date('2024-01-01'),
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1b1?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    email: 'manager@company.com',
    name: 'Michael Chen',
    role: 'manager',
    department: 'Engineering',
    employmentType: 'employee',
    reviewCadence: 'quarterly',
    createdAt: new Date('2024-01-01'),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    email: 'team@company.com',
    name: 'Alex Rivera',
    role: 'team_member',
    department: 'Engineering',
    managerId: '2',
    employmentType: 'employee',
    reviewCadence: 'monthly',
    createdAt: new Date('2024-01-01'),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('pt_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch {
        localStorage.removeItem('pt_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Mock authentication
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'demo123') {
      const userWithLastLogin = { ...user, lastLogin: new Date() };
      setAuthState({
        user: userWithLastLogin,
        isAuthenticated: true,
        isLoading: false
      });
      localStorage.setItem('pt_user', JSON.stringify(userWithLastLogin));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    localStorage.removeItem('pt_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
      localStorage.setItem('pt_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextValue = {
    ...authState,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};