import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { User } from '@/types';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          // Fetch user profile from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name || undefined,
              bio: profile.bio || undefined,
              avatarUrl: profile.avatar_url || undefined,
              selectedCharity: profile.selected_charity || undefined,
              membershipStatus: profile.membership_status || 'free',
            });
          } else {
            // Profile doesn't exist yet, create one
            const { data: newProfile } = await supabase
              .from('profiles')
              .insert({
                id: currentUser.id,
                email: currentUser.email || '',
                membership_status: 'free',
              })
              .select()
              .single();
            
            if (newProfile) {
              setUser({
                id: newProfile.id,
                email: newProfile.email,
                membershipStatus: 'free',
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth subscription
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          fetchUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};