import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import useProfileInterests from "@/hooks/useProfileInterests";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { FC, useEffect, useState } from "react";
import { RoughNotation } from "react-rough-notation";
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
                  animate={false}
                >
                  <label
                    className="flex flex-col h-full justify-around items-center gap-1 py-1 max-w-72 cursor-pointer border border-black/30 px-2 w-full"
                    htmlFor={option.id}
                  >
                    <img
                      src={`/inventory/q${id}-opt${option.id}.png`}
                      className={cn("m-auto transition-all max-h-36 w-fit", {
                        "scale-110 ": isSelected,
                        "scale-100 ": !isSelected,
                      })}
                    />
                    <div>
                      <span
                        className={
                          "px-2 text-2xl  leading-tight block mt-0 " +
                          (isSelected ? "font-semibold" : "")
                        }
                      >
                        {option.text}
                      </span>
                    </div>
                  </label>
                </RoughNotation>
              </RadioGroupItem>
            );
          })}
        </div>
      </RadioGroup>
    </form>
  </>
);

const Questionnaire: FC<{ userId: string }> = ({ userId }) => {
  const [questionIndex, setQuestionIndex] = useState(-1);

  const {
    loading,
    error,
    data: answers,
    updateAnswer,
  } = useProfileInterests(userId);
  useEffect(() => {
    if (answers && questionIndex < 1) {
      const unansweredQuestions = Questions.findIndex(({ id }) => !answers[id]);
      setTimeout(() => {
        if (unansweredQuestions < 0) {
          setQuestionIndex(Questions.length - 1);
        } else {
          setQuestionIndex(unansweredQuestions);
        }
      }, 400);
    }
  }, [answers]);
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
