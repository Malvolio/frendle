import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

type UpdateAvailability = (hour: number, available: boolean) => Promise<void>;

type AvailabilityReturn =
  | {
      updateAvailability: UpdateAvailability;
      loading: true;
      data?: undefined;
      error?: undefined;
    }
  | {
      updateAvailability: UpdateAvailability;
      loading: false;
      data?: undefined;
      error: string;
    }
  | {
      updateAvailability: UpdateAvailability;
      loading: false;
      data: Set<number>;
      error?: undefined;
    };

const useAvailability = (userId: string): AvailabilityReturn => {
  // Fetch initial availability data
  const fetchAvailability = useCallback(async () => {
    try {
      setAv({
        loading: true,
        updateAvailability,
      });

      const { data: availabilityData, error: fetchError } = await supabase
        .from("availability")
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
            .from("availability")
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
            .from("availability")
            .delete()
            .eq("user_id", userId)
            .eq("hour_of_week", hour);

          if (deleteError) {
            throw deleteError;
          }

          // Update local state
          setAv(({ data: prev }) => {
            const data = new Set(prev || new Set<number>());
            data.delete(hour);
            return {
              loading: false,
              updateAvailability,
              data,
            };
          });
        }
      } catch (err) {
        // Optionally, you could set an error state here or handle it differently
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

export default useAvailability;
