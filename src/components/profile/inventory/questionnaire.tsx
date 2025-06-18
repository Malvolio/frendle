import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import useProfileInterests from "@/hooks/useProfileInterests";
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
    <h2 className="text-2xl mb-3">{text}</h2>
    <form>
      <RadioGroup onValueChange={setSelectedId} value={selectedId}>
        <div className="flex flex-row gap-6 m-auto w-fit h-64">
          {options.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <RoughNotation
                key={option.id}
                type="box"
                show={isSelected}
                iterations={8}
                color={isSelected ? "#000000" : "#8F8F8F"}
                animate={false}
              >
                <label
                  className="flex flex-col h-full justify-between items-center gap-2 py-2 w-40 cursor-pointer bg-[#EBE3CF] border border-black/30 px-2"
                  htmlFor={option.id}
                >
                  <div
                    className={
                      isSelected
                        ? "transition-all scale-125"
                        : "transition-all  scale-100 "
                    }
                  >
                    <img
                      src={`/inventory/q${id}-opt${option.id}.png`}
                      width={"100px"}
                      className="m-auto saturate-50 mt-2"
                    />
                  </div>
                  <div>
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={option.id.toString()}
                    />
                    {option.text}
                  </div>
                </label>
              </RoughNotation>
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
      if (unansweredQuestions < 0) {
        setQuestionIndex(Questions.length - 1);
      } else {
        setQuestionIndex(unansweredQuestions);
      }
    }
  }, [answers]);
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div>
      <div className="h-72 w-full flex flex-col justify-center items-center">
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
