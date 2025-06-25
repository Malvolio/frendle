import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { useEffect, useState } from "react";
import { DataHook } from "./DataHook";

type UseGetTimezoneReturn = DataHook<
  string,
  {
    timezone: string;
    timezones: string[];
    updateTimezone: (timezone: string) => Promise<void>;
  }
>;

let KnownTimezones: string[] | null = null;

const useGetTimezone = (): UseGetTimezoneReturn => {
  const { user } = useAuth();
  const updateTimezone = async (timezone: string) => {
    const { error } = await supabase
      .from("private_profiles")
      .update({ timezone })
      .or(`id.eq.${user?.auth.id}`);

    if (error) {
      throw error;
    }
    setState(({ timezones }) => ({
      timezones,
      updateTimezone,
      timezone,
      data: timezone,
      loading: false,
    }));
  };
  const [state, setState] = useState<UseGetTimezoneReturn>({
    loading: true,
    updateTimezone,
    timezone:
      user?.private_profile.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezones: [],
  });

  useEffect(() => {
    const fetchTimezone = async () => {
      const { data, error } = await supabase
        .from("timezones")
        .select("zone_name")
        .order("offset_hours", { ascending: false });

      if (error) {
        throw error;
      }

      const timezones = data?.map(({ zone_name }) => zone_name) || [];
      KnownTimezones = timezones;
      setState({
        updateTimezone,
        timezone: user?.private_profile.timezone || "",
        data: user?.private_profile.timezone || "",
        timezones,
        loading: false,
      });
    };
    if (KnownTimezones) {
      const timezones = KnownTimezones;
      setState((prev) => ({ ...prev, timezones }));
    } else {
      fetchTimezone();
    }
  }, [user]);

  return state;
};
export default useGetTimezone;
