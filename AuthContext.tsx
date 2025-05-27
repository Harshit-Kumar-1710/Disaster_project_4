import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock user type (would be replaced with actual auth provider)
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a saved user in localStorage
    const savedUser = localStorage.getItem('safeEscapeUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Mock auth functions
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation - in a real app, this would be handled by an auth provider
    if (email && password) {
      const user: User = {
        uid: `user-${Date.now()}`,
        email,
        displayName: email.split('@')[0]
      };
      
      setCurrentUser(user);
      localStorage.setItem('safeEscapeUser', JSON.stringify(user));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password && name) {
      const user: User = {
        uid: `user-${Date.now()}`,
        email,
        displayName: name
      };
      
      setCurrentUser(user);
      localStorage.setItem('safeEscapeUser', JSON.stringify(user));
    } else {
      throw new Error('All fields are required');
    }
  };

  const logout = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCurrentUser(null);
    localStorage.removeItem('safeEscapeUser');
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};