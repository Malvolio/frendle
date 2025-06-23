import { EnrichedSession } from "@/hooks/useGetSessions";
import { X } from "lucide-react";
import React from "react";

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
}> = ({ sessions }) => (
  <>
    <p className="text-gray-600">Here’s your upcoming matches:</p>

    <div className="space-y-4">
      {sessions.map((pairUp, index) => {
        const dateInfo = formatDate(new Date(pairUp.scheduled_for));

        return (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-center space-x-4">
              {/* Date card */}
              <div className="bg-white border-2 border-black rounded transform -rotate-2 shadow-sm">
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900 bg-gray-200 px-2 py-1">
                    {dateInfo.day}
                  </div>
                  <div className="text-xs text-gray-600 p-2 ">
                    {dateInfo.month} {dateInfo.date}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="font-bold text-gray-900">
                  {pairUp.partner_profile.name}
                </div>
                <div className="text-gray-600 text-sm">
                  {pairUp.partner_profile.bio}
                </div>
              </div>
            </div>

            {/* Close button */}
            <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-gray-600 hover:text-red-600" />
            </button>
          </div>
        );
      })}
    </div>
  </>
);

export default PairUps;
