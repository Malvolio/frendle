import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetTimezone from "@/hooks/useGetTimezone";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAvailability } from "./AvailabilityProvider";
import PauseButton from "./PauseButton";

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

// Helper function to convert time string to hour number
const timeToHour = (timeString: string, dayIndex: number): number => {
  const hour24 = convertTo24Hour(timeString);
  return dayIndex * 24 + hour24;
};

// Helper function to convert 12-hour format to 24-hour format
const convertTo24Hour = (time12: string): number => {
  const [time, modifier] = time12.split(/([ap]m)/i);
  const [hours] = time.split(":");
  let hour = parseInt(hours, 10);

  if (modifier.toLowerCase() === "pm" && hour !== 12) {
    hour += 12;
  } else if (modifier.toLowerCase() === "am" && hour === 12) {
    hour = 0;
  }

  return hour;
};

// Helper function to check if a time is selected based on hour number
const isTimeSelected = (
  timeString: string,
  dayIndex: number,
  selectedHours: Set<number>
): boolean => {
  const hourNumber = timeToHour(timeString, dayIndex);
  return selectedHours.has(hourNumber);
};

const SelectTimezone = () => {
  const { timezone, timezones, updateTimezone } = useGetTimezone();
  return (
    <div className="flex justify-between px-4 md:justify-center items-center mb-4">
      <label className="mr-2">Select Timezone:</label>
      <Select value={timezone} onValueChange={updateTimezone}>
        <SelectTrigger className="w-48 bg-[#FFFDF4] rounded-none border-[#373737]">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent>
          {timezones.map((tz) => (
            <SelectItem key={tz} value={tz}>
              {tz}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const Availability = () => {
  const [openColumn, setOpenColumn] = useState("Mon");
  const { updateAvailability, loading, data, error } = useAvailability();

  const selectedHours = data || new Set<number>();
  const totalSelections = selectedHours.size;

  const handleTimeClick = async (day: string, time: string) => {
    const dayIndex = DAYS.findIndex((d) => d.short === day);
    const hourNumber = timeToHour(time, dayIndex);
    const isSelected = selectedHours.has(hourNumber);

    // Remove if already selected
    if (isSelected) {
      await updateAvailability(hourNumber, false);
      return;
    }

    // Prevent more than MAX_SLOTS total selections
    if (totalSelections >= MAX_SLOTS) return;

    // Add new selection
    await updateAvailability(hourNumber, true);
  };

  if (error) {
    return (
      <div className="w-full flex-col justify-between items-start md:items-center mb-4">
        <div className="text-red-600 text-center p-4">
          Error loading availability: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-fit md:m-auto w-full mt-4">
      {/* <div className="flex-col justify-between items-start md:items-center mb-4 w-screen md:w-7/12 m-auto"> */}
      <div className="w-screen md:max-w-6xl mx-auto border  border-black border-b-8 border-r-8 border-b-black/70 border-r-black/70 rounded-2xl overflow-visible">
        <div className="bg-[url('profile/binder.png')] repeat-x h-12 -mt-4"></div>

        <div className="md:text-lg text-left md:text-center justify-center md:my-4 flex-row flex gap-4 w-fit mr-4 mt-2 md:m-auto">
          <p className="my-0 ml-4">
          {totalSelections < MAX_SLOTS
            ? "Pick a couple days and times that work for you for quick 15-min connects."
            : `We only need ${MAX_SLOTS} slots to find you a match`}
            </p>
            <PauseButton />
        </div>
        
        
        <SelectTimezone /> 
        <div className="flex h-[300px] md:h-auto">
          {DAYS.map((day, dayIndex) => (
            <motion.div
              key={day.short}
              className="border-r border-[#373737] last:border-r-0 overflow-hidden cursor-pointer overflow-y-scroll md:overflow-hidden"
              onClick={() => setOpenColumn(day.short)}
              initial={false}
              animate={{
                width: openColumn === day.short ? "360px" : "200px",
              }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {/* Column Header */}
              <motion.div
                className={cn(
                  `border-[#373737] border-t border-b font-semibold w-full text-center sticky`,
                  {
                    "text-3xl": openColumn === day.short,
                    "hover:border-b": openColumn !== day.short,
                  }
                )}
                whileHover={{ backgroundColor: "#58B4AE" }}
                whileFocus={{ backgroundColor: "#58B4AE" }}
              >
                {/* Days Row */}
                <div
                  className={cn(
                    "flex items-center justify-center px-2 py-2 h-full w-full bg-[#58B4AE]/0 transition-all",
                    {
                      "bg-[#58B4AE]": openColumn === day.short,
                    }
                  )}
                >
                  <h3 className="font-semibold text-center text-lg whitespace-nowrap">
                    {/* {openColumn === day.short ? day.full : day.short} */}
                    {day.short}
                  </h3>
                </div>
              </motion.div>

              {/* Day Column Content */}
              <AnimatePresence>
                {openColumn === day.short ? (
                  <div className="flex gap-2 px-2 boder-8 flex-col md:flex-row overflow-y-scroll md:overflow-hidden ">
                    {TIME_BLOCKS.map((block) => (
                      <motion.div
                        layout
                        key={block.label}
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 50 }}

                        className="flex flex-col items-center "
                      >
                        <img
                          src={block.label + ".svg"}
                          alt={block.label}
                          className="mb-2"
                        />
                        {block.hours.map((hour) => {
                          const isSelected = isTimeSelected(
                            hour,
                            dayIndex,
                            selectedHours
                          );
                          const isDisabled =
                            !isSelected && totalSelections >= MAX_SLOTS;
                          return (
                            <button
                              key={hour}
                              className={`mb-1 px-2 py-1 text-sm border ${isSelected
                                ? "bg-[#373737] text-white"
                                : isDisabled
                                  ? "text-gray-500 cursor-not-allowed  text-italic"
                                  : "hover:bg-[#F0D8A0]/60 border-transparent"
                                }`}
                              onClick={() => handleTimeClick(day.short, hour)}
                              disabled={isDisabled || loading}
                            >
                              {hour}
                            </button>
                          );
                        })}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    {(() => {
                      const hours = TIME_BLOCKS.flatMap((block) =>
                        block.hours.filter((hour) =>
                          isTimeSelected(hour, dayIndex, selectedHours)
                        )
                      );
                      const thours = hours.slice(0, 5).map((hour) => (
                        <div
                          key={`m-${hour}`}
                          className="mb-1 px-2 py-1 text-sm border bg-[#373737] text-[#FFFDF4] w-12 text-center"
                        >
                          {hour}
                        </div>
                      ));
                      return hours.length === thours.length
                        ? thours
                        : [
                          ...thours,
                          <div className="font-bold">&hellip;</div>,
                        ];
                    })()}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AvailabilityPage = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {/* <Calendar1 className="w-5 h-5 text-green-600" /> */}
        Set aside some time
      </CardTitle>

      <CardDescription></CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4 h-96">
        <Availability />
      </div>
    </CardContent>
  </Card>
);

export default AvailabilityPage;
