import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";
import { DataHook } from "./DataHook";

type UsePauseReturn = DataHook<
  boolean,
  {
    togglePause: () => Promise<void>;
    eligible: boolean;
  }
>;

const usePause = (): UsePauseReturn => {
  const { user, refetchProfile } = useAuth();
  const membership_status = user?.system_profile.membership_status;
  const eligible =
    membership_status === "good" || membership_status === "paused";
  const paused = membership_status === "paused";
  const [loading, setloading] = useState(false);
  const togglePause = async () => {
    setloading(true);
    try {
      const { error } = await supabase.functions.invoke("pauseMatches", {
        body: { shouldPause: !paused },
      });
      if (error) {
        console.error("Error pausing:", error);
      } else {
        await refetchProfile();
      }
    } catch (error) {
      console.error("Error pausing:", error);
    } finally {
      setloading(false);
    }
  };
  return loading
    ? { loading: true, togglePause, eligible }
    : {
        data: paused,
        togglePause,
        loading,
        eligible,
      };
};
export default usePause;
