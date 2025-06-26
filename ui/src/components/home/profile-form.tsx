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
import useUpdatePublicProfile from "@/hooks/useUpdatePublicProfile";
import { useAuth } from "@/providers/auth-provider";
import { PublicProfile } from "@/types";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { CharitySelection } from "./charity-selection";
import { MembershipSection } from "./membership-section";

type NonNullableObject<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

type ProfileForm = NonNullableObject<Pick<PublicProfile, "bio" | "name">>;
export function ProfileForm() {
  const { user } = useAuth();
  const { isSubmitting, onSubmit } = useUpdatePublicProfile(user);

  const form = useForm<ProfileForm>({
    defaultValues: {
      name: user?.public_profile.name || "",
      bio: user?.public_profile.bio || "",
    },
  });

  return (
    <Card className="m-auto ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 mb-4">
          All about you, yes, you!
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row md:min-w-fit items-center m-auto justify-center">
        <AnimatePresence>
          {/* TODO: Make each one animate in seperately */}
          <motion.div className="bg-[#FFFDFA] gap-4 max-w-lg min-w-[360px] flex flex-col p-8 border-2 border-black  border-b-8 border-r-8 border-b-black/70 border-r-black/70 rounded-2xl">
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
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormDescription className="text-sm text-gray-700">
                        Displays on your profile and in the app
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
                      <FormDescription className="text-sm text-gray-700">
                        Tell folks a bit aobut yourself. What you're interested
                        in at the moment and what they should ask you about.
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
          <CharitySelection />
          <MembershipSection />
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
