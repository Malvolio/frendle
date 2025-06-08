import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabaseSignaling } from "@/lib/useSupabaseSignaling";
import { useWebRTC } from "@/lib/useWebRTC";
import { useAuth } from "@/providers/auth-provider";
import { useSearch } from "@tanstack/react-router";
import { FC, useCallback, useRef, useState } from "react";

type Message = {
  local: boolean;
  text: string;
};

const useTextChat = () => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const addToConversation = useCallback((c: Message) => {
    setConversation((ca) => [...ca, c]);
  }, []);
  return { conversation, addToConversation };
};

const TextChat: FC<{
  conversation: Message[];
  sendMessage: (text: string) => void;
  disabled?: boolean;
}> = ({ conversation, sendMessage, disabled }) => {
  const [text, setText] = useState("");
  const send = () => {
    sendMessage(text);
    setText("");
  };
  return (
    <div>
      <div className="scroll-overflow w-40 h-40 border border-gray-200">
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
      />
      <Button onClick={send} disabled={disabled}>
        Send
      </Button>
    </div>
  );
};

const VideoChat: FC<{
  sessionId: string;
  isHost: boolean;
  userId: string;
}> = ({ sessionId, isHost, userId }) => {
  const [isAudioEnabled, setAudioEnabled] = useState(true);
  const [isVideoEnabled, setVideoEnabled] = useState(true);
  const { conversation, addToConversation } = useTextChat();

  const createSignaling = useSupabaseSignaling(sessionId, isHost, userId);
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const webrtc = useWebRTC({
    isHost,
    createSignaling,
    localRef,
    remoteRef,
    onDataReceived: (text) => {
      addToConversation({ local: false, text });
    },
  });
  return (
    <div className="video-chat flex flex-col gap-5 w-full items-center">
      <div className="video-container flex flex-row items-center space-x-6">
        <video
          ref={localRef}
          autoPlay
          muted
          playsInline
          className="local-video border rounded-lg shadow-lg border-gray-300 h-32 w-32"
        />
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="remote-video border rounded-lg shadow-lg border-gray-300 h-32 w-32"
        />
        <TextChat
          conversation={conversation}
          sendMessage={(text: string) => {
            addToConversation({ local: true, text });
            webrtc.sendData(text);
          }}
          disabled={webrtc.connectionState !== "connected"}
        />
      </div>

      <div className="controls flex gap-x-4">
        {webrtc.connectionState === "disconnected" && (
          <Button className="w-32" onClick={webrtc.startCall}>
            Start Call
          </Button>
        )}
        {webrtc.connectionState !== "disconnected" && (
          <Button className="w-32" onClick={webrtc.endCall}>
            End Call
          </Button>
        )}
        <Button
          className="w-32"
          onClick={() => {
            setVideoEnabled(!isVideoEnabled);
            webrtc.setVideoEnabled(!isVideoEnabled);
          }}
        >
          {isVideoEnabled ? "Stop Video" : "Start Video"}
        </Button>

        <Button
          className="w-32"
          onClick={() => {
            setAudioEnabled(!isAudioEnabled);
            webrtc.setAudioEnabled(!isAudioEnabled);
          }}
        >
          {isAudioEnabled ? "Mute" : "Unmute"}
        </Button>
      </div>

      <div className="status">
        <div>Status: {webrtc.connectionState}</div>
      </div>
    </div>
  );
};
export function SessionPage() {
  const { id: sessionId, host: isHost } = useSearch({ from: "/session" });
  const { user } = useAuth();

  return (
    <AuthLayout title={`Video Chat — ${isHost ? "Host" : "Guest"}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <VideoChat
          sessionId={sessionId}
          isHost={isHost}
          userId={user?.id ?? ""}
        />
      </div>
    </AuthLayout>
  );
}
