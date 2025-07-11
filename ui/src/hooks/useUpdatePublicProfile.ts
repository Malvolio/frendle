import { toast } from "@/hooks/use-toast";
import { updatePublicProfile } from "@/lib/supabase";
import { PublicProfile, SignedInUser } from "@/types";
import { useState } from "react";

const useUpdatePublicProfile = (user: SignedInUser | null) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (data: Partial<PublicProfile>) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const { error } = await updatePublicProfile(user.auth.id, {
        ...user?.public_profile,
        ...data,
      });

      if (error) throw error;
      // VP: changed copy because it takes a while to update, this sets the expectation better:
      toast({
        title: "Profile updating",
        description: "Your profile is being updated.",
        className: "bg-green-100 text-yellow-800",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return { isSubmitting, onSubmit };
};

export default useUpdatePublicProfile;
