import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type SessionDescription = {
  id: string;
  isHost: boolean;
  partner: {
    id: string;
    name: string;
    bio: string;
    avatarUrl: string;
    selectedCharity: string;
  };
};

type UseGetSessionReturn =
  | { loading: true; error?: undefined; session?: undefined }
  | { loading: false; error: string; session?: undefined }
  | { loading: false; error?: undefined; session: SessionDescription };

const useGetSession = (
  sessionId: string,
  isHost: boolean
): UseGetSessionReturn => {
  const [state, setState] = useState<UseGetSessionReturn>({ loading: true });

  useEffect(() => {
    if (!sessionId) {
      setState({ loading: false, error: "Session ID is required" });
      return;
    }

    const fetchSession = async () => {
      try {
        setState({ loading: true });

        // First fetch the session
        const { data: sessionData, error: sessionError } = await supabase
          .from("sessions")
          .select("id, room_id, host_id, guest_id")
          .eq("id", sessionId)
          .single();

        if (sessionError) {
          setState({ loading: false, error: sessionError.message });
          return;
        }

        if (!sessionData) {
          setState({ loading: false, error: "Session not found" });
          return;
        }

        // Determine partner ID based on isHost flag
        const partnerId = isHost ? sessionData.guest_id : sessionData.host_id;

        // Fetch partner profile
        const { data: partnerProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id, name, bio, avatar_url, selected_charity")
          .eq("id", partnerId)
          .single();

        if (profileError) {
          setState({ loading: false, error: profileError.message });
          return;
        }

        if (!partnerProfile) {
          setState({ loading: false, error: "Partner profile not found" });
          return;
        }

        const session: SessionDescription = {
          id: sessionData.id,
          isHost,
          partner: {
            id: partnerId,
            name: partnerProfile.name || "",
            bio: partnerProfile.bio || "",
            avatarUrl: partnerProfile.avatar_url || "",
            selectedCharity: partnerProfile.selected_charity || "",
          },
        };

        setState({ loading: false, session });
      } catch (error) {
        setState({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      }
    };

    fetchSession();
  }, [sessionId, isHost]);

  return state;
};

export default useGetSession;
