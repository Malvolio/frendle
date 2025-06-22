import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import useUpdatePublicProfile from "@/hooks/useUpdatePublicProfile";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { Charity } from "@/types";
import { FC, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const Charities: Charity[] = [
  {
    id: "curationist",
    name: "Curationist",
    description:
      "Curationist is a free online resource that brings together arts and culture communities to find, share, collaborate, and reimagine cultural narratives.",
    website: "https://www.curationist.org/",
    category: "Culture",
    logoUrl: "profile/charity_curationist.svg",
  },
  {
    id: "doctors-without-borders",
    name: "Doctors Without Borders",
    description:
      "Medical humanitarian organization providing emergency aid worldwide",
    website: "https://www.doctorswithoutborders.org",
    logoUrl:
      "https://www.doctorswithoutborders.org/themes/custom/msf/meta_image.png",
    category: "Healthcare",
  },
  {
    id: "american-red-cross",
    name: "American Red Cross",
    description:
      "International humanitarian movement providing emergency assistance and disaster relief",
    website: "https://www.redcross.org",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/American_Red_Cross_Logo.svg/1200px-American_Red_Cross_Logo.svg.png",
    category: "Humanitarian",
  },
  {
    id: "unicef",
    name: "UNICEF",
    description:
      "United Nations agency focused on children's rights, survival, development and protection",
    website: "https://www.unicef.org",
    logoUrl:
      "https://1000logos.net/wp-content/uploads/2021/03/UNICEF-logo-500x281.png",
    category: "Children's Welfare",
  },
  {
    id: "world-wildlife-fund",
    name: "World Wildlife Fund",
    description:
      "Global conservation organization working to protect wildlife and their habitats",
    website: "https://www.worldwildlife.org",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/24/WWF_logo.svg/1200px-WWF_logo.svg.png",
    category: "Environmental",
  },
  {
    id: "feeding-america",
    name: "Feeding America",
    description: "Largest hunger-relief organization in the United States",
    website: "https://www.feedingamerica.org",
    logoUrl:
      "https://www.feedingamerica.org/themes/custom/ts_feeding_america/images/svgs/logo-2020.svg",
    category: "Food Security",
  },
  {
    id: "st-jude-hospital",
    name: "St. Jude Children's Research Hospital",
    description:
      "Pediatric treatment and research facility focused on children's catastrophic diseases",
    website: "https://www.stjude.org",
    logoUrl:
      "https://1000logos.net/wp-content/uploads/2023/03/St.-Jude-logo.png",
    category: "Healthcare",
  },
];

const DisplayCharity: FC<{
  charity: Charity;
  onSelect: () => void;
  selected: boolean;
}> = ({ charity, onSelect, selected }) => (
  <div
    className={cn("rounded-md bg-muted p-4 h-full w-full border", {
      "border-gray-900": selected,
      "cursor-pointer": !selected,
    })}
    onClick={onSelect}
  >
    <img className="object-fit h-20" alt="charity logo" src={charity.logoUrl} />
    <h4 className="font-medium mb-1">{charity.name}</h4>
    <p className="mb-2">{charity.description}</p>
    <a
      href={charity.website}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-primary hover:underline"
    >
      Visit website
    </a>
  </div>
);

export function CharitySelection() {
  const { user } = useAuth();
  const { onSubmit } = useUpdatePublicProfile(user);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(
    () =>
      Charities.find(
        ({ id }) => id === user?.public_profile.selected_charity
      ) ?? null
  );

  const onSelect = async (charity: Charity) => {
    if (selectedCharity?.id !== charity.id) {
      await onSubmit({ selected_charity: charity.id });
      setSelectedCharity(charity);
    }
  };

  return (
    <Card className="md:max-w-2xl md:min-w-fit">
      <CardHeader>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-[#FFFDFA] gap-4 w-[500px] -rotate-2 m-auto flex flex-col p-8 border-2 border-black  border-b-8 border-r-8 border-b-black/70 border-r-black/70 rounded-2xl">
          <p className="font-bold text-lg m-0">Your just cause {selectedCharity && `: ${selectedCharity.name}`}</p>

          <div className="space-y-4 ">
            <div className="space-y-2 ">
              <label htmlFor="charitySelect" className="text-sm font-medium">
                {!selectedCharity && "Select Charity"}
              </label>
              <Carousel className="w-full">
                <CarouselContent>
                  {Charities.map((charity) => (
                    <CarouselItem key={charity.id} className="w-full">
                      <DisplayCharity
                        charity={charity}
                        onSelect={() => onSelect(charity)}
                        selected={selectedCharity?.id === charity.id}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              <p className="m-0 p-2 border border-gray-200 rounded-md">
                55% of your subscription fee will go to your selected charity.
              </p>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
