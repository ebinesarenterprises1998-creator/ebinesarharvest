import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { authService } from '../services/supabase/supabaseClient';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isCustomer: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string, roleRequired?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial user from Supabase or secure session cache
    const initialUser = authService.getCurrentUser();
    setUser(initialUser);
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string, roleRequired?: UserRole) => {
    setIsLoading(true);
    const { user: authenticatedUser, error } = await authService.signIn(email, password, roleRequired);
    setIsLoading(false);
    if (error || !authenticatedUser) {
      return { success: false, error: error || 'Authentication failed' };
    }
    setUser(authenticatedUser);
    return { success: true };
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    setIsLoading(true);
    const { user: newUser, error } = await authService.signUp(email, password, fullName, phone);
    setIsLoading(false);
    if (error || !newUser) {
      return { success: false, error: error || 'Account registration failed' };
    }
    setUser(newUser);
    return { success: true };
  };

  const signOut = async () => {
    setIsLoading(true);
    await authService.signOut();
    setUser(null);
    setIsLoading(false);
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  const role = user ? user.role : null;
  const isAdmin = role === 'admin';
  const isCustomer = role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isCustomer,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
