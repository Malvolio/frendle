import React, { useState } from "react";
import { RoughNotation } from "react-rough-notation";
import { motion, AnimatePresence } from "motion/react"


const DAYS = [
    { short: "Mon", full: "Monday" },
    { short: "Tue", full: "Tuesday" },
    { short: "Wed", full: "Wednesday" },
    { short: "Thu", full: "Thursday" },
    { short: "Fri", full: "Friday" },
    { short: "Sat", full: "Saturday" },
    { short: "Sun", full: "Sunday" },
];

const TIME_BLOCKS = [
    { label: "morning", hours: ["6am", "7am", "8am", "9am", "10am", "11am"] },
    { label: "afternoon", hours: ["12pm", "1pm", "2pm", "3pm", "4pm", "5pm"] },
    { label: "evening", hours: ["6pm", "7pm", "8pm", "9pm", "10pm", "11pm"] },
    { label: "night", hours: ["12am", "1am", "2am", "3am", "4am", "5am"] },
];

export function Availability() {
    const [openDay, setOpenDay] = useState<string | null>(null);
    const [selectedTimes, setSelectedTimes] = useState<Record<string, string[]>>({});

    // Count total selections across all days
    const totalSelections = Object.values(selectedTimes).reduce(
        (sum, arr) => sum + arr.length, 0
    );

    const [show, setShow] = useState(false); // or false, depending on when you want to show
    // Show highlight when 5 slots are selected
    React.useEffect(() => {
        setShow(totalSelections >= 5);
    }, [totalSelections]);

    const handleDayClick = (day: string) => {
        setOpenDay(openDay === day ? null : day);
    };

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
            if (totalSelections >= 5) return prev;

            // Add new selection
            return {
                ...prev,
                [day]: [...dayTimes, time],
            };
        });
    };



    return (

        <div className="w-full md:w-[600px] max-w-2xl mx-auto m-h-80 transition-all " >



            {/* <p className="mb-4">We'll schedule 15-min pair-ups within those times and send a calendar invite</p> */}
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <p>Pick up to 5 one-hour slots you're available every week.</p>
                <div>
                    <RoughNotation type="highlight" show={show} color="#F0D8A0">
                        <span className="text-2xl font-bold">{totalSelections}</span> of 5 selected
                    </RoughNotation>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between mb-4 transition-transform ">
                {DAYS.map((day) => (
                    <motion.div key={day.short} className={`flex flex-col items-center w-full border border-transparent `}>
                        <motion.button layout
                            className={`px-3 py-2 rounded font-semibold w-full text-center ${openDay === day.short
                                ? " "
                                : " hover:bg-[#F0D8A0] hover:border-b-2"
                                }`}
                            onClick={() => handleDayClick(day.short)}
                        >
                            {openDay === day.short ? day.full : day.short}
                        </motion.button>
                        {selectedTimes[day.short] && selectedTimes[day.short].length > 0 && openDay != day.short && (
                            <span className="mt-1 text-sm text-primary">
                                {selectedTimes[day.short].join(",  ")}
                            </span>
                        )}
                        {openDay === day.short && (
                            <div className="flex gap-2 px-2 ">
                                <AnimatePresence>
                                    {TIME_BLOCKS.map((block) => (
                                        <motion.div layout key={block.label} exit={{ opacity: 0 }} className="flex flex-col items-center">
                                            <img src={block.label + '.svg'} alt={block.label} className="mb-2" />
                                            {block.hours.map((hour) => {
                                                const isSelected = selectedTimes[day.short]?.includes(hour);
                                                const isDisabled = !isSelected && totalSelections >= 5;
                                                return (
                                                    <button
                                                        key={hour}
                                                        className={`mb-1 px-2 py-1 rounded text-sm ${isSelected
                                                            ? "bg-primary text-white"
                                                            : isDisabled
                                                                ? " text-gray-500 cursor-not-allowed border text-italic"
                                                                : "hover:bg-[#F0D8A0]/60"
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
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

        </div >
    );
}