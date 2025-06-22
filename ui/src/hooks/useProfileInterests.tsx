import { useCallback, useEffect, useState } from "react";
import z from "zod";
import { supabase } from "../lib/supabase";
import { DataHook } from "./DataHook";

type UpdateAnswer = (questionId: string, answerId: string) => Promise<void>;

type ProfileInterestsReturn = DataHook<
  Record<string, string>,
  {
    updateAnswer: UpdateAnswer;
  }
>;

const interestsSchema = z.record(
  z.string().min(1, "Question ID cannot be empty"),
  z.string().min(1, "Answer ID cannot be empty")
);
const useProfileInterests = (userId: string): ProfileInterestsReturn => {
  // Initialize state first
  const [interests, setInterests] = useState<ProfileInterestsReturn>(() => ({
    loading: true,
    updateAnswer: async () => {}, // Placeholder
  }));

  // Fetch initial interests data
  const fetchInterests = useCallback(async () => {
    try {
      setInterests(({ updateAnswer: updateQuestion }) => ({
        updateAnswer: updateQuestion,
        loading: true,
      }));

      const { data: profileData, error: fetchError } = await supabase
        .from("private_profiles")
        .select("interests")
        .eq("id", userId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const zdata = interestsSchema.safeParse(profileData?.interests || {});
      if (zdata.success) {
        const { data } = zdata;
        setInterests(({ updateAnswer: updateQuestion }) => ({
          updateAnswer: updateQuestion,
          loading: false,
          data,
        }));
      } else {
        const { error } = zdata;
        console.error(error);
        setInterests(({ updateAnswer: updateQuestion }) => ({
          updateAnswer: updateQuestion,
          loading: false,
          data: {},
        }));
      }
    } catch (error) {
      console.error(error);
      setInterests(({ updateAnswer: updateQuestion }) => ({
        updateAnswer: updateQuestion,
        loading: false,
        data: {},
      }));
    }
  }, [userId]);

  // Update question function
  const updateQuestion: UpdateAnswer = useCallback(
    async (questionId: string, answerId: string) => {
      try {
        // Get current interests data
        const currentData =
          interests.loading === false && interests.data ? interests.data : {};

        // Create updated interests object
        const updatedInterests = {
          ...currentData,
          [questionId]: answerId,
        };

        // Update database
        const { error: updateError } = await supabase
          .from("private_profiles")
          .update({ interests: updatedInterests })
          .eq("id", userId);

        if (updateError) {
          throw updateError;
        }

        // Update local state
        setInterests((prev) => ({
          ...prev,
          loading: false,
          data: updatedInterests,
          error: undefined,
        }));
      } catch (err) {
        console.error("Error updating interests:", err);
        // Refresh data to ensure consistency
        await fetchInterests();
      }
    },
    [userId, fetchInterests, interests]
  );

  // Update the state with the actual updateQuestion function
  useEffect(() => {
    setInterests((prev) => ({
      ...prev,
      updateAnswer: updateQuestion,
    }));
  }, [updateQuestion]);

  // Set up real-time subscription and initial fetch
  useEffect(() => {
    fetchInterests();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("interests_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "private_profiles",
          filter: `id=eq.${userId}`,
        },
        fetchInterests
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, fetchInterests]);

  return interests;
};

export default useProfileInterests;
