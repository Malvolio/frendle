import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import z from "zod";
import { DataHook } from "../../hooks/DataHook";
import { supabase } from "../../lib/supabase";

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
const useProfileInterestsData = (userId: string): ProfileInterestsReturn => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | undefined>(undefined);

  // Fetch initial interests data
  const fetchInterests = async () => {
    try {
      setLoading(true);
      setError(undefined);

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
        setData(data);
      } else {
        const { error } = zdata;
        console.error(error);
        setError(error.message);
      }
    } catch (error) {
      console.error(error);
      console.error(error);
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };

  // Update question function
  const updateAnswer: UpdateAnswer = async (
    questionId: string,
    answerId: string
  ) => {
    try {
      // Create updated interests object
      const updatedInterests = {
        ...data,
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

      setData(updatedInterests);
    } catch (err) {
      console.error("Error updating interests:", err);
      // Refresh data to ensure consistency
      await fetchInterests();
    }
  };

  // Set up real-time subscription and initial fetch
  useEffect(() => {
    fetchInterests();
  }, []);

  return loading
    ? { loading, updateAnswer }
    : error
      ? { loading: false, error, updateAnswer }
      : { loading: false, updateAnswer, data };
};

type InterestsContextType = ProfileInterestsReturn | undefined;

const InterestsContext = createContext<InterestsContextType>(undefined);
export const useProfileInterests = (): ProfileInterestsReturn => {
  const context = useContext(InterestsContext);

  if (context === undefined) {
    throw new Error("useInterests must be used within an InterestsProvider");
  }

  return context;
};

export const InterestsProvider: React.FC<
  PropsWithChildren<{ userId: string }>
> = ({ userId, children }) => {
  const interestsData = useProfileInterestsData(userId);

  return (
    <InterestsContext.Provider value={interestsData}>
      {children}
    </InterestsContext.Provider>
  );
};
