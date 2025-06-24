import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { RoughNotation } from "react-rough-notation";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  component: () => {
    const [nextQuestion, setNextQuestion] = React.useState(false);

    return (
      <div className="bg-[url('background.jpg')] bg-cover bg-center min-h-screen">
        <nav>NAV HERE</nav>
        <div className="flex flex-col gap-8 mx-auto h-screen mt-20 justify-start text-center">
          <h1 className="text-4xl font-normal mb-4">
            Pair up with people who just get you
          </h1>
          <p className="text-xl mb-8">
            We'll help you find people who share your interests and values.
          </p>
          <AnimatePresence mode="wait">
            {!nextQuestion ? <QuestionOne /> : <QuestionTwo />}
          </AnimatePresence>
          <button
            className="border border-black w-fit mx-auto p-4 bg-black text-white font-bold"
            onClick={() => setNextQuestion(!nextQuestion)}
          >
            Show transition between questions
          </button>
        </div>
      </div>
    );
  },
});

export function QuestionOne() {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const OPTIONS = [
    {
      label: "A quiet book, blanket, and maybe a cat or two",
      image: "/q1-opt1.svg",
      id: 1,
    },
    {
      label: "Brunch with friends, a hike, and spontaneous karaoke",
      image: "/q1-opt1.svg",
      id: 2,
    },
    {
      label: "A side project, some coffee, and a solid to-do list",
      image: "/q1-opt1.svg",
      id: 3,
    },
    {
      label: "No idea—I'll figure it out when I get there!",
      image: "/q1-opt1.svg",
      id: 4,
    },
  ];

  function handleSelect(value: string) {
    setSelectedId(parseInt(value));
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.7,
      }}
    // className="p-6 bg-white rounded-xl shadow-lg"
    >
      {" "}
      <h2 className="text-2xl">What&apos;s your ideal weekend?</h2>
      <form>
        <RadioGroup onValueChange={handleSelect} value={selectedId?.toString()}>
          <div className="flex flex-row gap-6 m-auto w-fit ">
            {OPTIONS.map((option) => {
              const isSelected = selectedId === option.id;
              return (
                <RoughNotation
                  key={option.id}
                  type="box"
                  show={isSelected}
                  iterations={isSelected ? 2 : 8}
                  color={isSelected ? "#373735" : "#8F8F8F"}
                >
                  <label
                    className="flex flex-col h-full justify-between items-center gap-2 py-2 w-40 cursor-pointer bg-[#EBE3CF] border border-black/30 px-2"
                    htmlFor={option.id.toString()}
                  >
                    <img
                      src={option.image}
                      width={"100px"}
                      className="m-auto saturate-50 mt-2"
                    />
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={option.id.toString()}
                    />
                    {option.label}
                    <img
                      src="/circle.svg"
                      width={"24px"}
                      className="m-auto saturate-50 mb-2"
                    />
                  </label>
                </RoughNotation>
              );
            })}
          </div>
        </RadioGroup>
        <button className="mt-4 mx-auto py-2 px-4 border rounded-full">
          Next TODO:ButtonUI
        </button>
      </form>
    </motion.div>
  );
}

export function QuestionTwo() {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const OPTIONS = [
    {
      label: "I take a beat, regroup, and solve it",
      image: "/q1-opt1.svg",
      id: 1,
    },
    { label: "I panic... and then I solve it", image: "/q1-opt1.svg", id: 2 },
    {
      label: "I had a backup plan for the backup plan",
      image: "/q1-opt1.svg",
      id: 3,
    },
    { label: "I improvise like it’s jazz, baby", image: "/q1-opt1.svg", id: 4 },
  ];

  function handleSelect(value: string) {
    setSelectedId(parseInt(value));
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 200 }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.7,
      }}
    // className="p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl">How do you handle curveballs?</h2>
      <form>
        <RadioGroup onValueChange={handleSelect} value={selectedId?.toString()}>
          <div className="flex flex-row gap-6 m-auto w-fit ">
            {OPTIONS.map((option) => {
              const isSelected = selectedId === option.id;
              return (
                <RoughNotation
                  key={option.id}
                  type="box"
                  show={isSelected}
                  iterations={isSelected ? 2 : 8}
                  color={isSelected ? "#373735" : "#8F8F8F"}
                >
                  <motion.label
                    className="flex flex-col h-full justify-between items-center gap-2 py-2 w-40 cursor-pointer bg-[#EBE3CF] border border-black/30 px-2"
                    htmlFor={option.id.toString()}
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <img
                      src={option.image}
                      width={"100px"}
                      className="m-auto saturate-50 mt-2"
                    />
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={option.id.toString()}
                    />
                    {option.label}
                    <img
                      src="/circle.svg"
                      width={"24px"}
                      className="m-auto saturate-50 mb-2"
                    />
                  </motion.label>
                </RoughNotation>
              );
            })}
          </div>
        </RadioGroup>
        <button className="mt-4 mx-auto py-2 px-4 border rounded-full">
          Next TODO:ButtonUI
        </button>
      </form>
    </motion.div>
  );
}
