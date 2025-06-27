import { EnrichedSession } from "@/hooks/useGetSessions";
import { useAuth } from "@/providers/auth-provider";
import { ArrowRight, X } from "lucide-react";
import React from "react";
import PauseButton from "./PauseButton";

const formatDate = (date: Date) => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  return {
    day: days[date.getDay()],
    month: months[date.getMonth()],
    date: date.getDate(),
  };
};

const PairUps: React.FC<{
  sessions: EnrichedSession[];
  isPaused: boolean;
}> = ({ sessions, isPaused }) => {
  const { user } = useAuth();
  return (
    <>
      <p className="my-2 px-6">Here’s your upcoming matches:</p>

      <div className="space-y-4  w-80">
        {sessions.map((pairUp, index) => {
          const dateInfo = formatDate(new Date(pairUp.scheduled_for));

          return (
            <div
              key={index}
              className="group flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-[#58B4AE] px-6 gap-2 transition-all"
            >
              <div className="flex items-center space-x-4">
                {/* Date card */}
                <div className="bg-white border-2 border-[#4C4B4B] rounded-sm transform -rotate-6 border-r-4 border-b-4 border-t-8 ">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 px-2">
                      {dateInfo.day}
                    </div>
                    <div className="text-xs pb-2 ">
                      {dateInfo.month} {dateInfo.date}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-white">
                    {pairUp.partner_profile.name === user?.public_profile.name
                      ? "Charlotte" // silly hack!
                      : pairUp.partner_profile.name}
                  </div>
                  <div className="text-gray-600 text-sm max-w-52 group-hover:text-white">
                    {pairUp.partner_profile.bio}
                  </div>
                </div>
              </div>

              <button className="group border border-black/40 w-8 h-8 rounded-full  hover:bg-[#BA4F76]  flex items-center justify-center transition-colors">
                {pairUp.partner_profile.name === user?.public_profile.name ? (
                  <X className="w-4 h-4 text-gray-600 group-hover:text-white" />
                ) : (
                  <ArrowRight />
                )}
              </button>
            </div>
          );
        })}
        {isPaused && (
          <div className="flex text-center text-gray-500 gap-2">
            <div className="text-left">Pair-ups are currently paused. </div>
            <PauseButton />
          </div>
        )}
      </div>
    </>
  );
};

export default PairUps;
