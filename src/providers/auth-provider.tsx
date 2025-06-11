import { getCurrentUser, signInWithGoogle, supabase } from "@/lib/supabase";
import { User } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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
          console.log("[Auth] User found, fetching profile");
          // Fetch user profile from profiles table
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .single();

          if (profile) {
            console.log("[Auth] Profile loaded", {
              id: profile.id,
              membershipStatus: profile.membership_status,
            });
            setUser({
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name || undefined,
              bio: profile.bio || undefined,
              avatarUrl: profile.avatar_url || undefined,
              selectedCharity: profile.selected_charity || undefined,
              membershipStatus: profile.membership_status || "free",
            });
          } else {
            // Profile doesn't exist yet, create one
            console.log("[Auth] Creating new profile");
            const { data: newProfile } = await supabase
              .from("profiles")
              .insert({
                id: currentUser.id,
                email: currentUser.email || "",
                membership_status: "free",
              })
              .select()
              .single();

            if (newProfile) {
              console.log("[Auth] New profile created");
              setUser({
                id: newProfile.id,
                email: newProfile.email,
                membershipStatus: "free",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth subscription
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[Auth] Auth state changed", { event });
        if (event === "SIGNED_IN" && session?.user) {
          fetchUser();
        } else if (event === "SIGNED_OUT") {
          console.log("[Auth] User signed out");
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

export const useSignInWithGoogle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return { handleGoogleSignIn, isLoading };
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
