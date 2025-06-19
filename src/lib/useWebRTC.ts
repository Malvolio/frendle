import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Signaling } from "./Signaling";

export type ConnectionState = "connecting" | "connected" | "disconnected";

export type WebRTCConfig = {
  iceServers?: RTCIceServer[];
};

export type WebRTCHookReturn = {
  connectionState: ConnectionState;
  startCall: () => Promise<void>;
  endCall: () => void;
  setAudioEnabled: (_: boolean) => void;
  setVideoEnabled: (_: boolean) => void;
  sendData: (_: object) => void;
  dataConnected: boolean;
  mediaConnected: boolean;
};

// Default Configuration
const DEFAULT_CONFIG: WebRTCConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

type Connection = {
  signaling: Signaling | undefined;
  localStream: MediaStream | undefined;
  localData: ((s: object) => void) | undefined;
  remoteStream: MediaStream | undefined;
  remoteData: ((s: object) => void) | undefined;
  onDataConnection: (_: boolean) => void;
  onMediaConnection: (_: boolean) => void;
};

const initializePeerConnection = (
  isHost: boolean,
  connection: Connection,
  onStateChange: (state: ConnectionState) => void,
  config?: WebRTCConfig
) => {
  console.log("[initializePeerConnection");
  const pc = new RTCPeerConnection(config);

  pc.onsignalingstatechange = () => {
    console.log("[WebRTC] Signaling state changed:", pc.signalingState);
  };
  // Connection state change handler
  pc.onconnectionstatechange = () => {
    console.log("[WebRTC] Connection state changed:", pc.connectionState);
    const state = pc.connectionState;

    switch (state) {
      case "connecting":
        onStateChange("connecting");
        break;
      case "connected":
        onStateChange("connected");
        break;
      case "disconnected":
        onStateChange("disconnected");
        break;
      case "failed":
        onStateChange("disconnected");
        break;
      case "closed":
        onStateChange("disconnected");
        break;
    }
  };

  pc.onicecandidate = async (event) => {
    console.log("[WebRTC] local ICE candidate");
    if (event.candidate) {
      try {
        await connection.signaling?.signalIceCandidate(
          event.candidate.toJSON()
        );
      } catch (error) {
        console.error("[WebRTC] error signaling ICE candidate:", error);
      }
    }
  };

  // Remote stream handler
  pc.ontrack = (event) => {
    const [remoteStream] = event.streams;
    console.log("[WebRTC] pc.onTrack");

    if (remoteStream) {
      connection.remoteStream = remoteStream;
      connection.onMediaConnection(true);
    }
  };

  pc.oniceconnectionstatechange = () => {
    console.log("[WebRTC] ICE connection state:", pc.iceConnectionState);
  };

  const stream = connection.localStream;
  if (stream) {
    stream.getTracks().forEach((track) => {
      console.log("[WebRTC] Adding local track:", track.kind);
      pc.addTrack(track, stream);
    });
  }
  const connectDataChannel = (dataChannel: RTCDataChannel) => {
    let queue: string[] = [];
    dataChannel.onopen = () => {
      console.log("[DataChannel] Data channel open");
      connection.onDataConnection(true);
      console.log("[DataChannel] Data channel open");
      while (queue.length) {
        const output = queue.shift();
        if (output) {
          console.log(`[WebRTC sending] ${output}`);
          dataChannel.send(output);
        }
      }
    };
    dataChannel.onclose = () => {
      console.log("[DataChannel] Data channel closed");
      connection.onDataConnection(false);
    };

    dataChannel.onmessage = (event) => {
      if (connection.remoteData && event.data) {
        console.log(`[WebRTC onmessage] ${event.data}`);
        connection.remoteData(JSON.parse(String(event.data)));
      }
    };
    connection.localData = (data: object) => {
      const output = JSON.stringify(data);

      if (dataChannel.readyState === "open") {
        console.log(`[WebRTC sending] ${data}`);
        dataChannel.send(output);
      } else {
        console.log(`[WebRTC queueing] ${data}`);
        queue.push(output);
      }
    };
  };
  if (isHost) {
    connectDataChannel(pc.createDataChannel("chat"));
  } else {
    pc.ondatachannel = (event) => {
      connectDataChannel(event.channel);
    };
  }

  return pc;
};

const cleanupCall = (
  peerConnectionRef: MutableRefObject<RTCPeerConnection | undefined>,
  connection: Connection
) => {
  const pc = peerConnectionRef.current;
  peerConnectionRef.current = undefined;
  const { signaling } = connection;
  connection.signaling = undefined;

  pc?.close();
  signaling?.close();
};

const doStartCall = async (
  isHost: boolean,
  peerConnectionRef: MutableRefObject<RTCPeerConnection | undefined>,
  createSignaling: () => Promise<Signaling>,
  connection: Connection,
  onStateChange: (state: ConnectionState) => void,
  config: WebRTCConfig
) => {
  const iceCandidateQueue: RTCIceCandidateInit[] = [];

  const processQueuedIceCandidates = async (pc: RTCPeerConnection) => {
    while (iceCandidateQueue.length > 0) {
      const candidate = iceCandidateQueue.shift();
      if (candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("[WebRTC] error adding queued ICE candidate:", error);
        }
      }
    }
  };

  const handleIncomingOffer = async (
    offer: RTCSessionDescriptionInit | null
  ) => {
    console.log("[WebRTC] Received remote offer");
    const pc = peerConnectionRef.current;
    if (!pc) return;
    if (!offer) {
      onStateChange("disconnected");
      return;
    }
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      await processQueuedIceCandidates(pc);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await connection.signaling?.signalAnswer(answer);
    } catch (error) {
      console.error("[WebRTC]  Error in handling offer:", error);
      onStateChange("disconnected");
    }
  };

  const handleIncomingAnswer = async (
    answer: RTCSessionDescriptionInit | null
  ) => {
    console.log("[WebRTC] Received remote answer");
    const pc = peerConnectionRef.current;
    if (!pc) return;
    if (!answer) {
      onStateChange("disconnected");
      return;
    }
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      await processQueuedIceCandidates(pc);
    } catch (error) {
      console.error("DISCONNECTED to handle answer:", error);
      onStateChange("disconnected");
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    console.log("[WebRTC] Received remote ICE candidate");
    const pc = peerConnectionRef.current;
    if (!pc) return;

    try {
      if (pc.remoteDescription) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        // Queue the candidate if remote description is not set yet
        iceCandidateQueue.push(candidate);
      }
    } catch (error) {
      console.error("[WebRTC] Error in handling ICE candidate:", error);
      onStateChange("disconnected");
    }
  };

  try {
    const signaling = await createSignaling();
    connection.signaling = signaling;

    const pc = initializePeerConnection(
      isHost,
      connection,
      onStateChange,
      config
    );
    peerConnectionRef.current = pc;

    signaling.subscribeOffers(handleIncomingOffer);
    signaling.subscribeAnswers(handleIncomingAnswer);
    signaling.subscribeIceCandidates(handleIceCandidate);

    onStateChange("connecting");

    if (isHost) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await signaling.signalOffer(offer);
    }
  } catch (error) {
    console.log(`[WebRTC]: error in handleIceCandidate ${error}`);
    onStateChange("disconnected");
  }
};

/**
 * WebRTC React Hook for peer-to-peer video chat functionality
 *
 * @param isHost - Whether this peer is the host (creates offer) or guest (receives offer)
 * @param signaling - Signaling service implementation
 * @param mediaSettings - Media constraints for audio/video
 * @param config - WebRTC configuration (ICE servers, etc.)
 * @returns WebRTC hook return object with streams, state, and control methods
 */
type WebRTCHookProps = {
  isHost: boolean;
  createSignaling: () => Promise<Signaling>;
  config?: WebRTCConfig;
  localRef: MutableRefObject<HTMLVideoElement | null>;
  remoteRef: MutableRefObject<HTMLVideoElement | null>;
  onDataReceived?: (_: object) => void;
};

const assignMediaRef = (
  video: HTMLVideoElement | null,
  stream: MediaStream | undefined
) => {
  // The assignment is actually invoking a DOM property setter.
  // so check if it’s necessary first
  if (video && video.srcObject !== (stream ?? null)) {
    video.srcObject = stream ?? null;
  }
};

export const useWebRTC = ({
  isHost,
  createSignaling,
  localRef,
  remoteRef,
  config = DEFAULT_CONFIG,
  onDataReceived,
}: WebRTCHookProps): WebRTCHookReturn => {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [dataConnected, setDataConnected] = useState(false);
  const [mediaConnected, setMediaConnected] = useState(false);
  // Refs for maintaining stable references
  const peerConnectionRef = useRef<RTCPeerConnection>();
  const connectionRef = useRef<Connection>({
    signaling: undefined,
    localStream: undefined,
    localData: undefined,
    remoteStream: undefined,
    remoteData: undefined,
    onDataConnection: setDataConnected,
    onMediaConnection: setMediaConnected,
  });
  connectionRef.current.remoteData = onDataReceived;

  /**
   * Start the call (create offer for hosts, wait for offer for guests)
   */
  const startCall = useCallback(
    () =>
      doStartCall(
        isHost,
        peerConnectionRef,
        createSignaling,
        connectionRef.current,
        (state: ConnectionState) => {
          setConnectionState(state);
          if (state === "disconnected") {
            cleanupCall(peerConnectionRef, connectionRef.current);
            startCall();
          }
        },
        config
      ),
    [isHost, setConnectionState, createSignaling, config]
  );

  /**
   * End the call and close resources
   */
  const endCall = useCallback(() => {
    cleanupCall(peerConnectionRef, connectionRef.current);
    setConnectionState("disconnected");
  }, []);

  /**
   * If we just exit the page
   */
  useEffect(
    () => () => {
      cleanupCall(peerConnectionRef, connectionRef.current);
    },
    []
  );

  const setAudioEnabled = useCallback((enabled: boolean) => {
    const stream = connectionRef.current.localStream;
    if (!stream) return;

    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = enabled;
    }
  }, []);

  const setVideoEnabled = useCallback((enabled: boolean) => {
    const stream = connectionRef.current.localStream;
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = enabled;
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      connectionRef.current.localStream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
    };

    initialize();
  }, []);

  const sendData = useCallback(
    (data: object) => {
      connectionRef.current.localData && connectionRef.current.localData(data);
    },
    [connectionRef]
  );

  assignMediaRef(localRef.current, connectionRef.current.localStream);
  assignMediaRef(remoteRef.current, connectionRef.current.remoteStream);

  return {
    connectionState,
    startCall,
    endCall,
    setAudioEnabled,
    setVideoEnabled,
    sendData,
    dataConnected,
    mediaConnected,
  };
};
