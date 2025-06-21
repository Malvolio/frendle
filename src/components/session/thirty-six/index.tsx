import Spinner from "@/components/Spinner";
import { useCallback, useEffect, useMemo, useState } from "react";
import z from "zod";
import { Button } from "../../ui/button";
import { GameComponent } from "../GamePlayTypes";
import Questions from "./questions";

type Modes = "waiting" | "asking" | "listening" | "done";
const ThirtySixMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("done-asking"),
  }),
  z.object({
    type: z.literal("im-asking"),
    questionId: z.string(),
  }),
  z.object({
    type: z.literal("ask"),
    questionId: z.string(),
  }),
  z.object({
    type: z.literal("were-done"),
  }),
]);

// Infer the TypeScript type from the schema
type ThirtySixMessage = z.infer<typeof ThirtySixMessageSchema>;

const ThirtySix: GameComponent = ({ event, sendEvent, session }) => {
  const { isHost } = session;
  const [mode, setMode] = useState<Modes>("waiting");
  const [questionId, setQuestionId] = useState("");
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const question = useMemo(
    () => Questions.find(({ id }) => id === questionId),
    [questionId]
  );
  const sendGameMessage = (payload: ThirtySixMessage) =>
    sendEvent({
      type: "game",
      payload,
    });

  const goToNextQuestion = useCallback(() => {
    const q = Questions.find(({ id }) => !usedQuestions.has(id));
    if (q) {
      sendGameMessage({
        type: "im-asking",
        questionId: q.id,
      });
      setQuestionId(q.id);
      setMode("asking");
    } else {
      sendGameMessage({
        type: "were-done",
      });
      setMode("done");
    }
  }, [usedQuestions]);
  useEffect(() => {
    if (event) {
      const message = ThirtySixMessageSchema.safeParse(event.payload);
      if (message.success) {
        const { data } = message;
        switch (data.type) {
          case "ask":
            setMode("asking");
            setQuestionId(data.questionId);
            break;
          case "done-asking":
            setMode("waiting");
            if (isHost) {
              setUsedQuestions((allQ) => allQ.add(questionId));
              goToNextQuestion();
            }
            break;
          case "im-asking":
            setMode("listening");
            setQuestionId(data.questionId);
            break;
          case "were-done":
            setMode("done");
            break;
          default:
            // Ensure all cases are handled
            const _exhaustiveCheck: never = data;
            return _exhaustiveCheck;
        }
      }
    }
  }, [event]);

  useEffect(() => {
    if (mode === "waiting" && isHost) {
      goToNextQuestion();
    }
  }, [mode, isHost, goToNextQuestion]);

  const doneAsking = () => {
    sendGameMessage(
      isHost
        ? {
          type: "ask",
          questionId,
        }
        : { type: "done-asking" }
    );
    setMode(isHost ? "listening" : "waiting");
  };
  return (
    <div className="w-full h-full flex flex-col bg-[#EBE3CF] p-4 gap-y-2 justify-between items-center rounded-sm border-[#37251E] border-2">
      {mode === "waiting" && <Spinner />}
      {mode === "done" && <div className="text-center">Thanks for playing</div>}
      {(mode === "asking" || mode === "listening") && (
        <img src={`/session/thirty-six/${questionId}.png`} />
      )}
      {mode === "asking" && (
        <div className="text-sm flex flex-col p-2 gap-y-2 justify-between items-center ">
          <div className="text-left">
            <div className="mr-1">
              Ask:
            </div>
            <div className=" font-peachy text-[1.25rem] leading-6 text-[#37251E]">{question?.text}</div>
          </div>
          <Button className="flex-0 mx-3" onClick={doneAsking}>
            Asked
          </Button>
        </div>
      )}
      {mode === "listening" && (
        <div className="mr-1 text-left mb-5 italic">
          [Name] is answering. <span className="font-bold">TIP:</span> Listen intently, ask follow-up questions. Then, take your turn.
        </div>
      )}
    </div>
  );
};

export default ThirtySix;
