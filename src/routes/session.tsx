import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { useSupabaseSignaling } from "@/lib/SupabaseSignalingService";
import { useWebRTC } from "@/lib/useWebRTC";
import { useAuth } from "@/providers/auth-provider";
import { useSearch } from "@tanstack/react-router";
import { useRef, useState } from "react";

// Example usage component
export const ExampleVideoChat: React.FC<{
  sessionId: string;
  isHost: boolean;
  userId: string;
}> = ({ sessionId, isHost, userId }) => {
  const createSignaling = useSupabaseSignaling(sessionId, isHost, userId);
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const webrtc = useWebRTC({
    isHost,
    createSignaling,
    localRef,
    remoteRef,
  });

  const [isAudioEnabled, setAudioEnabled] = useState(true);
  const [isVideoEnabled, setVideoEnabled] = useState(true);

  console.log(
    "[ExampleVideoChat] WebRTC state:",
    webrtc.connectionState,
    !!localRef.current
  );

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
        {webrtc.error && <div>Error: {webrtc.error.message}</div>}
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
        <ExampleVideoChat
          sessionId={sessionId}
          isHost={isHost}
          userId={user?.id ?? ""}
        />
      </div>
    </AuthLayout>
  );
}
