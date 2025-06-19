import { Button } from "@/components/ui/button";
import { useWebRTC } from "@/lib/useWebRTC";
import { useWebSocketSignaling } from "@/lib/useWebSocketSignaling";
import { cn } from "@/lib/utils";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { FC, useCallback, useRef, useState } from "react";
import Spinner from "../Spinner";
import GamePlay from "./GamePlay";
import MovablePanes, { PaneStyle } from "./MovablePanes";
import { SessionDescription } from "./SessionDescription";
import ThirtySix from "./thirty-six";

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

const Games = {
  thirtySix: ThirtySix,
};
const VideoChat: FC<{
  session: SessionDescription;
}> = ({ session }) => {
  const [isAudioEnabled, setAudioEnabled] = useState(true);
  const [isVideoEnabled, setVideoEnabled] = useState(true);
  const url = "wss://frendle-signaling.fly.dev/signaling";
  const createSignaling = useWebSocketSignaling(
    url,
    session.id,
    session.isHost
  );
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const [event, setEvent] = useState<object>();
  const [paneStyles, setPaneStyles] = useState(defaultPaneStyles);
  const webrtc = useWebRTC({
    isHost: session.isHost,
    createSignaling,
    localRef,
    remoteRef,
    onDataReceived: (e) => {
      setEvent(e);
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
      {webrtc.connectionState === "connected" && webrtc.mediaConnected && (
        <video
          className="flex-1 border border-gray-100"
          ref={remoteRef}
          autoPlay
          playsInline
        />
      )}
      {(webrtc.connectionState === "connecting" ||
        (webrtc.connectionState === "connected" && !webrtc.mediaConnected)) && (
        <Spinner />
      )}
      {webrtc.connectionState === "disconnected" && (
        <div className="w-full h-full bg-gray-100 flex justify-center items-center">
          <VideoOff />
        </div>
      )}
      <div className="flex-0">
        <div className="text-sm font-semibold uppercase">
          {session.partner.name || "unnamed"}
        </div>
        <div className="text-xs">
          <span className="font-semibold">mood</span>: silly, quiet
        </div>
        <div className="text-xs">
          Consider {session.partner.name || "Unnamed"} may not be much for
          talking today but hanging out is still welcomed.
        </div>
      </div>
    </div>
  );
  const setGameplayPaneSize = useCallback((width: number, height: number) => {
    setPaneStyles((prev) => ({
      ...prev,
      gamePlay: {
        ...prev["gamePlay"],
        width,
        height,
      },
    }));
  }, []);

  const gamePlay = (
    <GamePlay
      event={event}
      sendEvent={(e: object) => {
        webrtc.sendData(e);
      }}
      disabled={webrtc.connectionState !== "connected" || !webrtc.dataConnected}
      session={session}
      games={Games}
      setPaneSize={setGameplayPaneSize}
    />
  );
  return (
    <div className="video-chat min-h-screen flex flex-col gap-5 h-full w-full items-center bg-[url('/bg-paper.png')] bg-repeat bg-auto">
      <MovablePanes
        paneStyles={paneStyles}
        setPaneStyles={setPaneStyles}
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
