import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { motion } from "motion/react";
import { FC, useEffect, useState } from "react";
import { RoughNotation } from "react-rough-notation";
import { useProfileInterests } from "../InterestsProvider";
import { Questions } from "./Questions";

type Answer = {
  id: string;
  text: string;
  alt?: string;
};

export type Question = {
  id: string;
  text: string;
  options: Answer[];
};

const DisplayQuestion: FC<{
  question: Question;
  selectedId: string;
  setSelectedId: (_: string) => void;
}> = ({ question: { id, text, options }, selectedId, setSelectedId }) => (
  <>
    <h2 className="text-3xl mb-6 font-bold text-[#373737]">{text}</h2>
    <form className="w-full">
      <RadioGroup onValueChange={setSelectedId} value={selectedId}>
        <div className="flex flex-row gap-4 w-full  h-72">
          {options.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <RadioGroupItem
                key={option.id}
                value={option.id.toString()}
                id={option.id.toString()}
              >
                <RoughNotation
                  type="box"
                  show={isSelected}
                  iterations={5}
                  color={isSelected ? "#000000" : "#8F8F8F"}
                  animate={true}
                  strokeWidth={3}
                >
                  <motion.label
                    className="group flex flex-col h-full justify-around items-center gap-1 py-1 max-w-72 cursor-pointer border border-black/30 px-2 w-full"
                    htmlFor={option.id}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <img
                      src={`/inventory/q${id}-opt${option.id}.png`}

                      className={cn("m-auto transition-all max-h-36 w-fit group-hover:scale-110", {
                        "scale-110 ": isSelected,
                        "scale-100 ": !isSelected,
                      })}
                    />
                    <div>
                      <span
                        className={
                          "px-2 text-xl mb-2  leading-tight block mt-0 " +
                          (isSelected ? "font-semibold" : "")
                        }
                      >
                        {option.text}
                      </span>
                    </div>
                  </motion.label>
                </RoughNotation>
              </RadioGroupItem>
            );
          })}
        </div>
      </RadioGroup>
    </form>
  </>
);

const Questionnaire = () => {
  const [questionIndex, setQuestionIndex] = useState(-1);

  const { loading, error, data: answers, updateAnswer } = useProfileInterests();
  useEffect(() => {
    if (answers && questionIndex < 0) {
      const unansweredQuestions = Questions.findIndex(({ id }) => !answers[id]);
      setTimeout(() => {
        if (unansweredQuestions < 0) {
          setQuestionIndex(Questions.length - 1);
        } else {
          setQuestionIndex(unansweredQuestions);
        }
      }, 400);
    }
  }, [loading]);
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div>
      <div className="w-full flex flex-col justify-center items-center h-auto">
        {loading || questionIndex < 0 ? (
          <Spinner />
        ) : (
          <DisplayQuestion
            selectedId={(answers && answers[Questions[questionIndex].id]) ?? ""}
            setSelectedId={(answerId) => {
              updateAnswer(Questions[questionIndex].id, answerId);
            }}
            question={Questions[questionIndex]}
          />
        )}
      </div>

      <div className="flex justify-center gap-6 my-6">
        <Button
          onClick={() => {
            setQuestionIndex((n) => n - 1);
          }}
          disabled={questionIndex <= 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            setQuestionIndex((n) => n + 1);
          }}
          disabled={questionIndex >= Questions.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
export default Questionnaire;
