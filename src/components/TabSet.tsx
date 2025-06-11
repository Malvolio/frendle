import { useLocation, useNavigate } from "@tanstack/react-router";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC } from "react";

type TabDescription = {
  icon: FC<{ className?: string }>;
  body: FC;
  name: string;
  id: string;
};

const TabSet: FC<{ tabs: TabDescription[] }> = ({ tabs }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.hash?.replace("#", "") || tabs[0].id;
  const handleTabChange = (hash: string) => {
    navigate({
      hash,
      replace: true,
    });
  };
  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-7/12 mx-auto flex mb-3">
        {tabs.map(({ icon: Icon, name, id }) => (
          <TabsTrigger
            key={id}
            value={id}
            className="flex-1 flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {name}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ body: Component, id }) => (
        <TabsContent key={id} value={id} className="w-7/12 mx-auto mb-6">
          <Component />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabSet;
