import { getCurrentUser, signInWithGoogle, supabase } from "@/lib/supabase";
import { SignedInUser } from "@/types";
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
  user: SignedInUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SignedInUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const auth = await getCurrentUser();

        if (auth) {
          console.log("[Auth] User found, fetching profile");
          const { data, error } = await supabase.functions.invoke(
            "ensure-user-profiles",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (error) {
            console.error("Error fetching user:", error);
            return;
          }
          const user: SignedInUser = {
            auth,
            ...data,
          };
          setUser(user);

          console.error("Error fetching user:", error);
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
