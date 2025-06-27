import Spinner from "@/components/Spinner";
import { useCallback, useEffect, useMemo, useState } from "react";
import z from "zod";
import { Button } from "../../ui/button";
import { GameComponent } from "../GamePlayTypes";
import Questions from "./questions";

type Modes = "waiting" | "asking" | "answering" | "done";
const ThirtySixMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("done-answering"),
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
          case "done-answering":
            setMode(isHost ? "answering" : "waiting");
            if (isHost) {
              sendGameMessage({
                type: "ask",
                questionId,
              });
            }
            break;
          case "im-asking":
            setMode("answering");
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

  const doneAnswering = () => {
    if (isHost) {
      setUsedQuestions((allQ) => allQ.add(questionId));
      goToNextQuestion();
    } else {
      sendGameMessage({ type: "done-answering" });
      setMode("waiting");
    }
  };
  return (
    <div className="w-full h-full  bg-[#EBE3CF] rounded-sm border-[#37251E] border-2 flex flex-col p-2 gap-y-2 items-center ">
      {mode === "waiting" && <Spinner />}
      {mode === "done" && <div className="text-center">Thanks for playing</div>}
      {(mode === "asking" || mode === "answering") && (
        <div className="flex-grow overflow-auto">
          <img
            className="h-full pointer-events-none"
            src={`/session/thirty-six/${questionId}.png`}
          />
        </div>
      )}
      {mode === "asking" && (
        <div className="flex-0 border text-sm flex flex-col gap-y-2 justify-between items-center ">
          <div className="text-left">
            <div className="mr-1">
              Ask {session.partner.name} the following:
            </div>
            <div className=" font-peachy text-[1.25rem] leading-6 text-[#37251E]">
              {question?.text}
            </div>
            <div>
              <span className="font-bold">TIP:</span> Listen intently, ask
              follow-up questions.
            </div>
          </div>
        </div>
      )}
      {mode === "answering" && (
        <div className="text-left italic">
          {session.partner.name} is asking you a question.
          <span className="font-bold ml-1">TIP:</span> Be as candid and open as
          possible. This is a safe space to share. Click the button when you are
          done.
          <div className="flex w-full justify-center">
            <Button onClick={doneAnswering}>Done Answering</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThirtySix;
