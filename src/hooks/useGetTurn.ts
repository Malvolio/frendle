import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { DataHook } from "./DataHook";

const useGetTurn = (): DataHook<RTCConfiguration, {}> => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RTCConfiguration | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getTurnConfig = async () => {
      try {
        setLoading(true);
        setError(undefined);
        setData(undefined);

        const { data: turnData, error: functionError } =
          await supabase.functions.invoke("get-turn-token", {
            headers: {
              "Content-Type": "application/json",
            },
          });

        if (functionError) {
          throw new Error(
            functionError.message || "Failed to get TURN configuration"
          );
        }

        if (!turnData || !turnData.iceServers) {
          throw new Error("Invalid response from TURN service");
        }

        // Create RTCConfiguration object
        const rtcConfig: RTCConfiguration = {
          iceServers: turnData.iceServers,
        };

        setData(rtcConfig);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getTurnConfig();
  }, []);

  if (loading) {
    return { loading: true };
  }

  if (error) {
    return { loading: false, error };
  }

  return { loading: false, data: data! };
};

export default useGetTurn;
