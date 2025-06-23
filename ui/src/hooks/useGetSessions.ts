import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { PublicProfile, Session } from "@/types";
import { useEffect, useState } from "react";
import { DataHook } from "./DataHook";

export type EnrichedSession = Session & {
  partner_profile: PublicProfile;
};

const useGetSessions = (): DataHook<EnrichedSession[], {}> => {
  const { user } = useAuth();
  const userId = user?.auth.id;
  const [state, setState] = useState<DataHook<EnrichedSession[], {}>>({
    loading: true,
  });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setState({ loading: true });

        const { data, error } = await supabase
          .from("sessions")
          .select(`*`)
          .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
          .order("scheduled_for", { ascending: false });

        if (error) {
          setState({ loading: false, error: error.message });
          return;
        }
        const partnerIds = data.map((session) =>
          session.host_id === userId ? session.guest_id : session.host_id
        );
        const { data: pdata, error: perror } = await supabase
          .from("public_profiles")
          .select(`*`)
          .or(`id.in.(${partnerIds.join(",")})`);
        if (perror) {
          setState({ loading: false, error: perror.message });
          return;
        }
        const partners = Object.fromEntries(
          pdata?.map((partner) => [partner.id, partner]) || []
        );
        // Transform the data to match our Session type
        const sessions = data.map((session) => {
          const partner_profile =
            partners[
              session.host_id === userId ? session.guest_id : session.host_id
            ];
          return {
            ...session,
            partner_profile,
          } satisfies EnrichedSession;
        });

        setState({ loading: false, data: sessions });
      } catch (err) {
        setState({
          loading: false,
          error:
            err instanceof Error ? err.message : "An unknown error occurred",
        });
      }
    };

    if (userId) {
      fetchSessions();
    }
  }, [userId]);

  return state;
};

export default useGetSessions;
