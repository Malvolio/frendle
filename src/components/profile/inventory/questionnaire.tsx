import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { FC, useState } from "react";
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
                iterations={3}
                color={isSelected ? "#000000" : "#8F8F8F"}
                animate={false}
              >
                <label
                  className="flex flex-col h-full justify-between items-center gap-2 py-2 w-40 cursor-pointer bg-[#EBE3CF] border border-black/30 px-2"
                  htmlFor={option.id}
                >
                  <div>
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
                    <img
                      src="/circle.svg"
                      width={"24px"}
                      className="m-auto saturate-50 mb-2"
                    />
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

const Questionnaire = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  return (
    <div>
      <DisplayQuestion
        selectedId={answers[questionIndex] ?? ""}
        setSelectedId={(id) => {
          setAnswers((v) => {
            const p = [...v];
            p[questionIndex] = id;
            return p;
          });
        }}
        question={Questions[questionIndex]}
      />
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
