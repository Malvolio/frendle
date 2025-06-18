import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MembershipSection } from "./membership-section";
import { CharitySelection } from "./charity-selection";
import { AnimatePresence } from "framer-motion";
import { motion } from "motion/react";

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  bio: z.string().max(160, {
    message: "Bio must not be longer than 160 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.public_profile.name || "",
      bio: user?.public_profile.bio || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const { error } = await updateUserProfile(user.auth.id, {
        name: data.name,
        bio: data.bio,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
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

  return (
    <Card>

      <CardHeader>
        <CardTitle className="flex items-center gap-2 mb-4">
          {/* <User className="w-5 h-5 text-green-600" /> */}
          All about you, yes, you!
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row items-center">
        <AnimatePresence>
          {/* TODO: Make each one animate in seperately */}
          <motion.div className="bg-[#FFFDFA] gap-4 w-[500px]  m-auto flex flex-col p-8 border-2 border-black  border-b-8 border-r-8 border-b-black/70 border-r-black/70 rounded-2xl">

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6  m-auto"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-lg">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the name that will be displayed on your profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-lg">
                        Introduction
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Introduce yourself..."
                          className="resize-none border rounded-none border-black p-4"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="">
                        Tell folks a bit aobut yourself. What you're interested in
                        at the moment and what they should ask you about.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </motion.div>

          <MembershipSection />
          <CharitySelection />
        </AnimatePresence>
      </CardContent>
      <p className="font-bold text-red-700">
        Note: we need next buttons. It's not obvious we are suppose to fill
        these things about because they are tabs
      </p>


    </Card>

  );
}
