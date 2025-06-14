import { useEffect, useState } from "react";
import z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { GameComponent, GameMessage } from "./GameControls";

type InternalMessage = {
  local: boolean;
  text: string;
};

const ExternalMessageSchema = z.object({
  text: z.string(),
});

// Infer the TypeScript type from the schema (optional)
type ExternalMessage = z.infer<typeof ExternalMessageSchema>;

const TextChat: GameComponent = ({
  event,
  sendEvent,
  disabled,
  setPaneSize,
}) => {
  const [text, setText] = useState("");
  const [conversation, setConversation] = useState<InternalMessage[]>([]);
  const addToConversation = (c: InternalMessage) => {
    setConversation((ca) => [...ca, c]);
  };
  useEffect(() => {
    if (event) {
      const message = ExternalMessageSchema.safeParse(event.payload);
      if (message.success) {
        const { text } = message.data;
        addToConversation({ local: false, text });
      }
    }
  }, [event]);
  useEffect(() => {
    if (setPaneSize) {
      setPaneSize(200, 400);
    }
  }, [setPaneSize]);
  const send = () => {
    addToConversation({ local: true, text });
    setText("");
    sendEvent({
      type: "game",
      payload: {
        text,
      },
    } satisfies GameMessage<ExternalMessage>);
  };
  return (
    <div className="w-full h-full flex flex-col bg-white p-2 gap-y-2">
      <div className="scroll-overflow flex-1 border border-gray-200">
        {conversation.map((message, index) => (
          <div key={index}>
            {message.local ? "you" : "him"}: {message.text}
          </div>
        ))}
      </div>
      <Input
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            send();
          }
        }}
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        disabled={disabled}
        className="flex-0"
      />
      <Button className="flex-0" onClick={send} disabled={disabled}>
        Send
      </Button>
    </div>
  );
};

export default TextChat;
