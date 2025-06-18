import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { updatePublicProfile } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { Charity } from "@/types";
import { useEffect, useState } from "react";

export function CharitySelection() {
  const { user } = useAuth();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<string>(
    user?.public_profile.selected_charity || ""
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        // In a real app, this would fetch from the Supabase charities table
        // Here we're using mock data
        const mockCharities: Charity[] = [
          {
            id: "1",
            name: "Curationist",
            description:
              "Curationist is a free online resource that brings together arts and culture communities to find, share, collaborate, and reimagine cultural narratives.",
            website: "https://www.curationist.org/",
            category: "Culture",
            logoUrl: "profile/charity_curationist.svg",
          },
          {
            id: "2",
            name: "Ocean Conservation Initiative",
            description: "Protecting marine ecosystems globally",
            website: "https://example.com/oci",
            category: "Environment",
          },
          {
            id: "3",
            name: "Digital Inclusion Alliance",
            description:
              "Bridging the digital divide in underserved communities",
            website: "https://example.com/dia",
            category: "Technology",
          },
          {
            id: "4",
            name: "Mental Health Awareness Foundation",
            description: "Supporting mental health research and awareness",
            website: "https://example.com/mhaf",
            category: "Health",
          },
        ];

        setCharities(mockCharities);

        if (user?.public_profile.selected_charity) {
          setSelectedCharity(user.public_profile.selected_charity);
        }
      } catch (error) {
        console.error("Error fetching charities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharities();
  }, [user]);

  const handleSaveCharity = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      const { error } = await updatePublicProfile(user.auth.id, {
        selected_charity: selectedCharity,
      });

      if (error) throw error;

      toast({
        title: "Charity updated",
        description: "Your selected charity has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating charity:", error);
      toast({
        title: "Error",
        description: "Failed to update charity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="max-w-[200px] ">
      <CardHeader>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-[#FFFDFA] gap-4 w-[500px] rotate-2 m-auto flex flex-col p-8 border-2 border-black  border-b-8 border-r-8 border-b-black/70 border-r-black/70 rounded-2xl">
          <p className="font-bold text-red-700 m-0">
            Michael: Can we make this a carousel instead and it defaults to the
            selected one?
          </p>
          <p className="font-bold text-lg m-0">Your just cause</p>

          <div className="space-y-4 ">
            <div className="space-y-2">
              <label htmlFor="charitySelect" className="text-sm font-medium">
                Select Charity
              </label>
              <Select
                disabled={isLoading}
                value={selectedCharity}
                onValueChange={setSelectedCharity}
              >
                <SelectTrigger id="charitySelect">
                  <SelectValue placeholder="Select a charity" />
                </SelectTrigger>
                <SelectContent>
                  {charities.map((charity) => (
                    <SelectItem key={charity.id} value={charity.id}>
                      {charity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCharity && (
                <div className="rounded-md bg-muted p-4">
                  <img
                    className="w-fit"
                    alt="charity logo"
                    src={
                      charities.find((c) => c.id === selectedCharity)?.logoUrl
                    }
                  />
                  <h4 className="font-medium mb-1">
                    {charities.find((c) => c.id === selectedCharity)?.name}
                  </h4>
                  <p className="mb-2">
                    {
                      charities.find((c) => c.id === selectedCharity)
                        ?.description
                    }
                  </p>
                  <a
                    href={
                      charities.find((c) => c.id === selectedCharity)?.website
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Visit website
                  </a>
                </div>
              )}
            </div>
          </div>
          <p className="m-0">
            55% of your subscription fee will go to your selected charity.
          </p>

          <Button
            onClick={handleSaveCharity}
            disabled={!selectedCharity || isSaving}
          >
            {isSaving ? "Saving..." : "Save Selection"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
