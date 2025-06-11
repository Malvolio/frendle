import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar1 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { RoughNotation } from "react-rough-notation";

const DAYS = [
  { short: "Sun", full: "Sunday" },
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
];

const TIME_BLOCKS = [
  { label: "morning", hours: ["6am", "7am", "8am", "9am", "10am", "11am"] },
  { label: "afternoon", hours: ["12pm", "1pm", "2pm", "3pm", "4pm", "5pm"] },
  { label: "evening", hours: ["6pm", "7pm", "8pm", "9pm", "10pm", "11pm"] },
  { label: "night", hours: ["12am", "1am", "2am", "3am", "4am", "5am"] },
];

const MAX_SLOTS = 20;

const Availability = () => {
  const [openColumn, setOpenColumn] = useState("Mon");

  const [selectedTimes, setSelectedTimes] = useState<Record<string, string[]>>(
    {}
  );

  // Count total selections across all days
  const totalSelections = Object.values(selectedTimes).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const handleTimeClick = (day: string, time: string) => {
    setSelectedTimes((prev) => {
      const dayTimes = prev[day] || [];
      const isSelected = dayTimes.includes(time);

      // Remove if already selected
      if (isSelected) {
        return {
          ...prev,
          [day]: dayTimes.filter((t) => t !== time),
        };
      }

      // Prevent more than 5 total selections
      if (totalSelections >= MAX_SLOTS) return prev;

      // Add new selection
      return {
        ...prev,
        [day]: [...dayTimes, time],
      };
    });
  };
  const [show, setShow] = useState(false); // or false, depending on when you want to show
  // Show highlight when 5 slots are selected
  useEffect(() => {
    setShow(totalSelections >= MAX_SLOTS);
  }, [totalSelections]);
  return (
    <div className="w-full flex-col justify-between items-start md:items-center mb-4">
      <div>
        <RoughNotation type="highlight" show={show} color="#F0D8A0">
          <span className="text-2xl font-bold">{totalSelections}</span> of{" "}
          {MAX_SLOTS} selected
        </RoughNotation>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
        <div className="flex">
          {DAYS.map((day) => {
            const count = selectedTimes[day.short]?.length;
            const dayLabel = count ? `(${count})` : "";
            return (
              <motion.div
                key={day.short}
                className="border-r border-gray-200 last:border-r-0 overflow-hidden cursor-pointer"
                onClick={() => setOpenColumn(day.short)}
                initial={false}
                animate={{
                  width: openColumn === day.short ? "400px" : "200px",
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {/* Column Header */}
                <motion.div
                  className={`px-3 py-2 rounded font-semibold w-full text-center ${openColumn === day.short ? "" : "hover:border-b-2"}`}
                  whileHover={{ backgroundColor: "#F0D8A0" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center">
                    <h3 className="font-semibold text-center text-lg whitespace-nowrap">
                      {openColumn === day.short ? day.full : day.short}{" "}
                      {dayLabel}
                    </h3>
                  </div>
                </motion.div>

                {/* Column Content */}
                <AnimatePresence>
                  {openColumn === day.short && (
                    <div className="flex gap-2 px-2 ">
                      {TIME_BLOCKS.map((block) => (
                        <motion.div
                          layout
                          key={block.label}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center"
                        >
                          <img
                            src={block.label + ".svg"}
                            alt={block.label}
                            className="mb-2"
                          />
                          {block.hours.map((hour) => {
                            const isSelected =
                              selectedTimes[day.short]?.includes(hour);
                            const isDisabled =
                              !isSelected && totalSelections >= MAX_SLOTS;
                            return (
                              <button
                                key={hour}
                                className={`mb-1 px-2 py-1 rounded text-sm border ${
                                  isSelected
                                    ? "bg-primary text-white"
                                    : isDisabled
                                      ? "text-gray-500 cursor-not-allowed  text-italic"
                                      : "hover:bg-[#F0D8A0]/60 border-transparent"
                                }`}
                                onClick={() => handleTimeClick(day.short, hour)}
                                disabled={isDisabled}
                              >
                                {hour}
                              </button>
                            );
                          })}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AvailabilityPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar1 className="w-5 h-5 text-green-600" />
          Availability
        </CardTitle>

        <CardDescription>
          Pick up to {MAX_SLOTS} one-hour slots you’re available every week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-96">
          <Availability />
        </div>
      </CardContent>
    </Card>
  );
};
export default AvailabilityPage;
