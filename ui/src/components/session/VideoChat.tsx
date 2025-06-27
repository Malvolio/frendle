import { Button } from "@/components/ui/button";
import { useWebRTC } from "@/lib/useWebRTC";
import { useWebSocketSignaling } from "@/lib/useWebSocketSignaling";
import { cn } from "@/lib/utils";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import PQueue from "p-queue";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Spinner from "../Spinner";
import GamePlay from "./GamePlay";
import MovablePanes, { PaneStyle } from "./MovablePanes";
import { SessionDescription } from "./SessionDescription";
import ThirtySix from "./thirty-six";

const defaultPaneStyles: Record<string, PaneStyle> = {
  localVideo: {
    x: 50,
    y: 150,
    width: 200,
    height: 150,
    zIndex: 1,
  },
  remoteVideo: {
    x: 500,
    y: 170,
    width: 400,
    height: 350,
    zIndex: 2,
  },
  gamePlay: {
    x: 180,
    y: 100,
    width: 390,
    height: 450,
    zIndex: 3,
  },
};


const Games = {
  thirtySix: ThirtySix,
};

// React doesn’t like the immediate calls
const messageQueue = new PQueue({
  interval: 100, // 100ms
  intervalCap: 1,
});

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
      messageQueue.add(() => {
        setEvent(e);
      });
    },
  });
  const localVideo = (
    <video ref={localRef} autoPlay muted playsInline className="h-full" />
  );
  const remoteVideo = (
    <div className="bg-transparent h-full p-1 flex flex-col justify-between gap-3">
      {webrtc.connectionState === "connected" && webrtc.mediaConnected && (
        <video
          className="flex-1 border border-[#211F1B]"
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
        {/* <div className="text-xs">
          <span className="font-semibold">mood</span>: silly, quiet
        </div>
        <div className="text-xs">
          Consider {session.partner.name || "Unnamed"} may not be much for
          talking today but hanging out is still welcomed.
        </div> */}
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

  useEffect(() => {
    console.log(`[Video Chat] event ${JSON.stringify(event)}`);
  }, [event]);

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
    <div className="video-chat min-h-screen flex flex-col gap-5 h-full w-full items-center">
      <MovablePanes
        paneStyles={paneStyles}
        setPaneStyles={setPaneStyles}
        panes={{ localVideo, remoteVideo, gamePlay }}
      >
        {webrtc.connectionState === "disconnected" && (
          <div
            className="relative z-50 w-1/2  bg-[#FFFDFA] flex flex-col justify-center items-left gap-3 text-[#37251E]
          p-8 border-2 border-black  border-b-8 border-r-8 border-b-black/70 border-r-black/70 rounded-2xl
          "
          >
            <span className="font-bold text-3xl font-peachy">
              Ready when you are
            </span>
            <ul className="text-lg my-2">
              <li>→ Freshen up</li>
              <li>→ Grab a drink</li>
              <li>→ Check the background</li>
              <li>→ Mute notifications</li>
              <li>→ Give yourself a moment</li>
              <li>
                <span className="flex flex-row gap-1 align-middle">
                  → Turn on <Video width={"16px"} />
                  Video and <Mic width={"16px"} />
                  Mic below
                </span>
              </li>
            </ul>
            <Button className="w-32 m-auto" onClick={webrtc.startCall}>
              Join room
            </Button>
          </div>
        )}
        {/* Background elements */}
        <img className="absolute left-0" src="/session/palm.png" />
        <img className="absolute top-20 right-0" src="/session/fred.png" />
        <img className="absolute top-1/4 left-20" src="/session/heart.svg" />
        <img className="absolute top-1/4 right-1/4" src="/session/heart.svg" />
        <img className="absolute top-3/4 left-2/4" src="/session/heart.svg" />
        <img
          className="absolute bottom-2/4 right-2/4"
          src="/session/heart.svg"
        />
        <img
          className="absolute top-10 left-40"
          src="/session/postcards.png"
          width={"300px"}
        />
        <img
          className="absolute top-40 right-4/5"
          src="/session/chihuahua.png"
          width={"200px"}
        />
        <img
          className="absolute bottom-36 right-52"
          src="/session/cat.png"
          width={"200px"}
        />
        <img
          className="absolute bottom-52 left-60"
          src="/session/coffee_cup.png"
          width={"200px"}
        />

        <div className="controls flex gap-x-4 absolute p-5 right-0 bottom-0 border-t border-t-black/20 w-full border flex-row items-center justify-center gap-2">
          <div
            className={`cursor-pointer p-2 text-center items-center flex  transition-all h-12 justify-center`}
            onClick={() => {
              setVideoEnabled(!isVideoEnabled);
              webrtc.setVideoEnabled(!isVideoEnabled);
            }}
            style={
              isVideoEnabled
                ? {
                    backgroundColor: "#FDBE7C",
                    borderRadius: "10%",
                    width: "auto",
                    border: "2px solid #373737",
                  }
                : {
                    backgroundColor: "transparent",
                    borderRadius: "100%",
                    width: "46px",
                    border: "2px solid #373737",
                  }
            }
          >
            {isVideoEnabled ? (
              <>
                <Video /> &nbsp;<p className="font-bold">Video is On</p>
              </>
            ) : (
              <VideoOff />
            )}
          </div>

          <div
            className={`cursor-pointer p-2 text-center items-center flex  transition-all h-12 justify-center`}
            onClick={() => {
              setAudioEnabled(!isAudioEnabled);
              webrtc.setAudioEnabled(!isAudioEnabled);
            }}
            style={
              isAudioEnabled
                ? {
                    backgroundColor: "#FF7D7F",
                    borderRadius: "10%",
                    width: "auto",
                    border: "2px solid #373737",
                  }
                : {
                    backgroundColor: "transparent",
                    borderRadius: "100%",
                    width: "46px",
                    border: "2px solid #373737",
                  }
            }
          >
            {isAudioEnabled ? (
              <>
                <Mic />
                <p className="font-bold">Mic is On</p>
              </>
            ) : (
              <MicOff />
            )}
          </div>
          <div
            className={cn(
              "cursor-pointer p-2 rounded-full bg-transparent absolute right-4 w-auto flex flex-row gap-2",
              {
                "opacity-1": webrtc.connectionState === "disconnected",
              }
            )}
            onClick={webrtc.endCall}
          >
            <PhoneOff /> Not connected
          </div>
        </div>
      </MovablePanes>
    </div>
  );
};

export default VideoChat;
