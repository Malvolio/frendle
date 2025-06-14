import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebRTC } from "@/lib/useWebRTC";
import { useWebSocketSignaling } from "@/lib/useWebSocketSignaling";
import { cn } from "@/lib/utils";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { FC, useCallback, useRef, useState } from "react";
import MovablePanes, { PaneStyle } from "./MovablePanes";

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

const defaultPaneStyles: Record<string, PaneStyle> = {
  localVideo: {
    x: 50,
    y: 200,
    width: 200,
    height: 150,
    zIndex: 1,
  },
  remoteVideo: {
    x: 450,
    y: 100,
    width: 400,
    height: 350,
    zIndex: 2,
  },
  gamePlay: {
    x: 800,
    y: 250,
    width: 200,
    height: 350,
    zIndex: 3,
  },
};

const VideoChat: FC<{
  sessionId: string;
  isHost: boolean;
  userId: string;
}> = ({ sessionId, isHost, userId }) => {
  const [isAudioEnabled, setAudioEnabled] = useState(true);
  const [isVideoEnabled, setVideoEnabled] = useState(true);
  const { conversation, addToConversation } = useTextChat();
  const url = "ws://frendle-signaling.fly.dev/signaling";
  const createSignaling = useWebSocketSignaling(url, sessionId, isHost, userId);
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
  const localVideo = (
    <video
      ref={localRef}
      autoPlay
      muted
      playsInline
      className="bg-white h-full"
    />
  );
  const remoteVideo = (
    <div className="bg-white h-full p-1 flex flex-col justify-between gap-3">
      <video
        className="flex-1 border border-gray-100"
        ref={remoteRef}
        autoPlay
        playsInline
      />
      <div className="flex-0">
        <div className="text-sm font-semibold">BENNY</div>
        <div className="text-xs">
          <span className="font-semibold">mood</span>: silly, quiet
        </div>
        <div className="text-xs">
          Consider Benny may not be much for talking today but hanging out is
          still welcomed.
        </div>
      </div>
    </div>
  );
  const gamePlay = (
    <TextChat
      conversation={conversation}
      sendMessage={(text: string) => {
        addToConversation({ local: true, text });
        webrtc.sendData(text);
      }}
      disabled={webrtc.connectionState !== "connected"}
    />
  );
  return (
    <div className="video-chat min-h-screen flex flex-col gap-5 h-full w-full items-center bg-[url('/bg-paper.png')] bg-repeat bg-auto">
      <MovablePanes
        paneStyles={defaultPaneStyles}
        panes={{ localVideo, remoteVideo, gamePlay }}
      >
        {webrtc.connectionState === "disconnected" && (
          <div className="relative z-50 h-1/2 w-1/2 border border-green-200 rounded bg-green-100 flex flex-col justify-center items-center drop-shadow-lg gap-3">
            <span className="font-bold text-xl">Frendle</span>
            <span>Get ready for your session</span>
            <Button className="w-32" onClick={webrtc.startCall}>
              Start session
            </Button>
          </div>
        )}
        <img className="absolute left-0" src="/session/palm.png" />
        <img className="absolute top-1/4 right-0" src="/session/fred.png" />
        <img className="absolute top-1/4 right-1/4" src="/session/heart.svg" />
        <div className="controls flex gap-x-4 absolute p-5 right-0 bottom-0 bg-green-200 rounded-tl-xl border flex flex-row items-center justify-center gap-2">
          <div
            className="cursor-pointer p-2 rounded-full bg-white"
            onClick={() => {
              setVideoEnabled(!isVideoEnabled);
              webrtc.setVideoEnabled(!isVideoEnabled);
            }}
          >
            {isVideoEnabled ? <Video /> : <VideoOff />}
          </div>

          <div
            className="cursor-pointer p-2 rounded-full bg-white"
            onClick={() => {
              setAudioEnabled(!isAudioEnabled);
              webrtc.setAudioEnabled(!isAudioEnabled);
            }}
          >
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </div>
          <div
            className={cn("cursor-pointer p-2 rounded-full bg-white", {
              "opacity-30": webrtc.connectionState === "disconnected",
            })}
            onClick={webrtc.endCall}
          >
            <PhoneOff />
          </div>
        </div>
      </MovablePanes>
    </div>
  );
};

export default VideoChat;
