import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { DataHook } from "../../hooks/DataHook";
import { supabase } from "../../lib/supabase";

export type UpdateAvailability = (
  hour: number,
  available: boolean
) => Promise<void>;

export type AvailabilityReturn = DataHook<
  Set<number>,
  {
    updateAvailability: UpdateAvailability;
  }
>;
export type AvailabilityContextType = AvailabilityReturn | undefined;

export const useAvailability = (): AvailabilityReturn => {
  const context = useContext(AvailabilityContext);

  if (context === undefined) {
    throw new Error(
      "useAvailability must be used within an AvailabilityProvider"
    );
  }

  return context;
};

const useAvailabilityData = (userId: string): AvailabilityReturn => {
  // Fetch initial availability data
  const fetchAvailability = useCallback(async () => {
    try {
      setAv({
        loading: true,
        updateAvailability,
      });

      const { data: availabilityData, error: fetchError } = await supabase
        .from("availabilities")
        .select("hour_of_week")
        .eq("user_id", userId);

      if (fetchError) {
        throw fetchError;
      }

      const data = new Set(
        availabilityData?.map(({ hour_of_week }) => Number(hour_of_week)) || []
      );

      setAv({
        loading: false,
        updateAvailability,
        data,
      });
    } catch (err) {
      setAv({
        loading: false,
        updateAvailability,
        error: err instanceof Error ? err.message : "An error occurred",
      });
    }
  }, [userId]);

  // Update availability function
  const updateAvailability: UpdateAvailability = useCallback(
    async (hour: number, available: boolean) => {
      try {
        if (available) {
          // Add availability record
          const { error: insertError } = await supabase
            .from("availabilities")
            .insert({ user_id: userId, hour_of_week: hour });

          if (insertError) {
            throw insertError;
          }

          setAv(({ data: prev }) => ({
            loading: false,
            updateAvailability,
            data: prev ? new Set([...prev, hour]) : new Set([hour]),
          }));
        } else {
          // Remove availability record
          const { error: deleteError } = await supabase
            .from("availabilities")
            .delete()
            .eq("user_id", userId)
            .eq("hour_of_week", hour);

          if (deleteError) {
            throw deleteError;
          }

          // Update local state
          setAv(({ data: prev }) => {
            const data = new Set(prev);
            data.delete(hour);
            return {
              loading: false,
              updateAvailability,
              data,
            };
          });
        }
      } catch (err) {
        console.error("Error updating availability:", err);
        // Refresh data to ensure consistency
        await fetchAvailability();
      }
    },
    [userId, fetchAvailability]
  );
  const [av, setAv] = useState<AvailabilityReturn>(() => ({
    loading: true,
    updateAvailability,
  }));
  // Set up real-time subscription
  useEffect(() => {
    fetchAvailability();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("availability_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "availability",
          filter: `user_id=eq.${userId}`,
        },
        fetchAvailability
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, fetchAvailability]);

  return av;
};

const AvailabilityContext = createContext<AvailabilityContextType>(undefined);

export const AvailabilityProvider: React.FC<
  PropsWithChildren<{ userId: string }>
> = ({ userId, children }) => {
  const availabilityData = useAvailabilityData(userId);

  return (
    <AvailabilityContext.Provider value={availabilityData}>
      {children}
    </AvailabilityContext.Provider>
  );
};
