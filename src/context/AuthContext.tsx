import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (email: string, fullName: string, password?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string; success?: boolean; debug_pin?: string }>;
  verifyResetCode: (email: string, code: string) => Promise<{ error?: string; success?: boolean }>;
  confirmNewPassword: (email: string, code: string, newPassword: string) => Promise<{ error?: string; success?: boolean }>;
  adminEmail: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@ebinesarharvest.com';
const STORAGE_KEY = 'ebinesar_harvest_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check stored session
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const email = data.session.user.email || '';
            const isAdminRole = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            
            setUser({
              id: data.session.user.id,
              email,
              full_name: data.session.user.user_metadata?.full_name || email.split('@')[0],
              role: isAdminRole ? 'admin' : 'customer',
              created_at: data.session.user.created_at || new Date().toISOString()
            });
            setIsLoading(false);
            return;
          }
        }

        // Check local storage session
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUser(parsed);
          } catch (e) {
            console.error('Error parsing stored session', e);
          }
        }
      } catch (err) {
        console.error('Auth initialization error', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password?: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.toLowerCase().trim();
      const isAdminRole = cleanEmail === ADMIN_EMAIL.toLowerCase();

      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            full_name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            role: isAdminRole ? 'admin' : 'customer',
            created_at: data.user.created_at || new Date().toISOString()
          };
          setUser(profile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
          setIsLoading(false);
          return {};
        }
      }

      // Demo/Fallback session mode for instant preview and development
      const demoProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        full_name: cleanEmail === ADMIN_EMAIL ? 'Ebenezer Admin' : cleanEmail.split('@')[0].replace('.', ' '),
        role: isAdminRole ? 'admin' : 'customer',
        created_at: new Date().toISOString()
      };

      setUser(demoProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoProfile));
      setIsLoading(false);
      return {};
    } catch (error) {
      setIsLoading(false);
      return { error: (error as Error).message || 'Failed to sign in' };
    }
  };

  const signUp = async (email: string, fullName: string, password?: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.toLowerCase().trim();
      const isAdminRole = cleanEmail === ADMIN_EMAIL.toLowerCase();

      // Trigger server-side registration and automated Welcome Email
      try {
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            name: fullName,
            password: password || 'default_pass'
          })
        });
      } catch (e) {
        console.warn('Backend registration email trigger notice:', e);
      }

      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            full_name: fullName,
            role: isAdminRole ? 'admin' : 'customer',
            created_at: new Date().toISOString()
          };
          setUser(profile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
          setIsLoading(false);
          return {};
        }
      }

      const newProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        full_name: fullName,
        role: isAdminRole ? 'admin' : 'customer',
        created_at: new Date().toISOString()
      };

      setUser(newProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      setIsLoading(false);
      return {};
    } catch (error) {
      setIsLoading(false);
      return { error: (error as Error).message || 'Failed to sign up' };
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Sign out error', err);
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const resetPassword = async (email: string): Promise<{ error?: string; success?: boolean; debug_pin?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      
      // Trigger automated password reset email with 6-digit code via server endpoint
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || 'Failed to send password reset email' };
      }

      if (isSupabaseConfigured) {
        await supabase.auth.resetPasswordForEmail(cleanEmail);
      }

      return { success: true, debug_pin: data.debug_pin };
    } catch (err) {
      return { error: (err as Error).message || 'Could not send reset email' };
    }
  };

  const verifyResetCode = async (email: string, code: string): Promise<{ error?: string; success?: boolean }> => {
    try {
      const res = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || 'Invalid or expired verification PIN' };
      }

      return { success: true };
    } catch (err) {
      return { error: (err as Error).message || 'Verification failed' };
    }
  };

  const confirmNewPassword = async (email: string, code: string, newPassword: string): Promise<{ error?: string; success?: boolean }> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
          new_password: newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || 'Failed to reset password' };
      }

      return { success: true };
    } catch (err) {
      return { error: (err as Error).message || 'Failed to update password' };
    }
  };

  const isAdmin = Boolean(user && (user.role === 'admin' || user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()));

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        verifyResetCode,
        confirmNewPassword,
        adminEmail: ADMIN_EMAIL
      }}
    >
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
