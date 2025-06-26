import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
type UseFreeTrialReturn = () => Promise<null | (() => void)>;

const useFreeTrial = (): UseFreeTrialReturn => {
  const { refetchProfile } = useAuth();
  const startTrial = async () => {
    try {
      const { error } = await supabase.functions.invoke("startTrial", {});
      if (error) {
        console.error("Error pausing:", error);
      } else {
        return refetchProfile;
      }
    } catch (error) {
      console.error("Error pausing:", error);
    } finally {
      // setloading(false);
    }
    return null;
  };
  return startTrial;
};
export default useFreeTrial;
