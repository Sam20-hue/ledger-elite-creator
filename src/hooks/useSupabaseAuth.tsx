import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        if (mounted) {
          // Handle different auth events
          if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          } else if (event === 'SIGNED_IN') {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          } else if (event === 'INITIAL_SESSION') {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        }
      }
    );

    // Get initial session with proper error handling
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session:', session?.user?.email, error);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error getting session:', error);
        
        // Handle refresh token errors gracefully
        if (error?.code === 'refresh_token_not_found' || error?.message?.includes('refresh_token_not_found')) {
          console.log('Refresh token not found, clearing session');
          await supabase.auth.signOut();
        }
        
        if (mounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within an AuthProvider');
  }
  return context;
};