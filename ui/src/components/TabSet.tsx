import { useLocation, useNavigate } from "@tanstack/react-router";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "motion/react";
import { FC } from "react";
import { RoughNotation } from "react-rough-notation";

export type TabDescription = {
  icon: FC<{ className?: string }>;
  body: FC;
  name: string;
  id: string;
  todo?: boolean;
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
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="w-full mt-12"
    >
      <TabsList className="w-7/12 mx-auto flex mb-3 gap-4">
        {tabs.map(({ icon: Icon, name, id, todo }) => (
          <div className="flex-col" key={id}>
            <div className="mb-1 text-sm font-bold m-auto flex flex-row justify-center items-end h-6">
              {todo && (
                <>
                  <img src="lib/arrow.png" alt="" />
                  TODO
                </>
              )}
            </div>
            <RoughNotation
              key={id}
              type="underline"
              show={id === currentTab}
              iterations={2}
              animate={false}
              strokeWidth={6}
              color="#373737"
            >
              <TabsTrigger
                value={id}
                className="flex-1 flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {name}
              </TabsTrigger>
            </RoughNotation>
          </div>
        ))}
      </TabsList>

      {tabs.map(({ body: Component, id }) => (
        <AnimatePresence key={id}>
          <TabsContent
            key={id}
            value={id}
            className=" mx-auto mb-6 bg-transparent h-screen  "
          >
            <motion.div
              initial={{ y: 30, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: "easeInOut" }}
            >
              <Component />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      ))}
    </Tabs>
  );
};

export default TabSet;
