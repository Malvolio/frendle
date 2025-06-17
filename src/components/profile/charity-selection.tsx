import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/lib/supabase";
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
            name: "Global Education Fund",
            description: "Providing education opportunities worldwide",
            website: "https://example.com/gef",
            category: "Education",
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
      const { error } = await updateUserProfile(user.auth.id, {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {/* <HeartHandshake className="w-5 h-5 text-green-600" /> */}
          Support a Cause
        </CardTitle>

        <CardDescription>
          Choose a charity to support. 100% of your donation will go directly to
          your selected charity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-96">
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
          </div>

          {selectedCharity && (
            <div className="rounded-md bg-muted p-4">
              <h4 className="font-medium mb-1">
                {charities.find((c) => c.id === selectedCharity)?.name}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                {charities.find((c) => c.id === selectedCharity)?.description}
              </p>
              <a
                href={charities.find((c) => c.id === selectedCharity)?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Visit website
              </a>
            </div>
          )}

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
