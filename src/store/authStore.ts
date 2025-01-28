import { create } from 'zustand';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  checkEmail: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const formatAuthError = (error: AuthError): string => {
  switch (error.message) {
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.';
    case 'Database error saving new user':
      return 'Unable to create account at this time. Please try again later.';
    case 'Invalid login credentials':
      return 'Invalid email or password.';
    default:
      return error.message;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  setUser: (user: User | null) => set({ user }),
  setSession: (session: Session | null) => set({ session }),
  signIn: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(formatAuthError(error));
    }
  },
  checkEmail: async (email: string) => {
    try {
      const { data, error } = await supabase.rpc('check_email_exists', {
        email_to_check: email
      });
      if (error) throw error;
      return data;
    } catch (error) {
      return false;
    }
  },
  signUp: async (email: string, password: string, username: string) => {
    try {
      // Check if email exists first
      const emailExists = await useAuthStore.getState().checkEmail(email);
      if (emailExists) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.trim()
          }
        }
      });
      if (signUpError) throw signUpError;
    } catch (error: any) {
      throw new Error(formatAuthError(error));
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null });
    } catch (error: any) {
      throw new Error(formatAuthError(error));
    }
  },
}));