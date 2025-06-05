import {
  Dispatch,
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

// Type Definitions
export enum ConnectionState {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  FAILED = "failed",
  CLOSED = "closed",
}

export type Signaling = {
  // Subscribe to incoming offers from remote peer
  subscribeOffers: (
    onOffer: (offer: RTCSessionDescriptionInit) => void
  ) => () => void;

  // Subscribe to incoming answers from remote peer
  subscribeAnswers: (
    onAnswer: (answer: RTCSessionDescriptionInit) => void
  ) => () => void;

  // Subscribe to incoming ICE candidates from remote peer
  subscribeIceCandidates: (
    onCandidate: (candidate: RTCIceCandidateInit) => void
  ) => () => void;

  // Send offer to remote peer
  signalOffer: (offer: RTCSessionDescriptionInit) => Promise<void>;

  // Send answer to remote peer
  signalAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>;

  // Send ICE candidate to remote peer
  signalIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;

  // Cleanup all subscriptions
  cleanup: () => void;
};

export type WebRTCConfig = {
  iceServers?: RTCIceServer[];
};

export type WebRTCHookReturn = {
  connectionState: ConnectionState;
  error: Error | null;

  // Control methods
  startCall: () => Promise<void>;
  endCall: () => void;
  setAudioEnabled: (_: boolean) => void;
  setVideoEnabled: (_: boolean) => void;
  isVideoRunning: boolean;
};

// Default Configuration
const DEFAULT_CONFIG: WebRTCConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

// State Management Types
type WebRTCState = {
  connectionState: ConnectionState;
  remoteStream: MediaStream | null;
  error: Error | null;
};

type WebRTCAction =
  | { type: "SET_CONNECTION_STATE"; payload: ConnectionState }
  | { type: "SET_REMOTE_STREAM"; payload: MediaStream | null }
  | { type: "SET_ERROR"; payload: Error | null }
  | { type: "RESET_STATE" };

// Reducer
const webrtcReducer = (
  state: WebRTCState,
  action: WebRTCAction
): WebRTCState => {
  switch (action.type) {
    case "SET_CONNECTION_STATE":
      return { ...state, connectionState: action.payload };
    case "SET_REMOTE_STREAM":
      return { ...state, remoteStream: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET_STATE":
      return {
        connectionState: ConnectionState.DISCONNECTED,
        remoteStream: null,
        error: null,
      };
    default:
      return state;
  }
};

const initializePeerConnection = (
  signaling: RefObject<Signaling | undefined>,
  dispatch: Dispatch<WebRTCAction>,
  localStreamRef: RefObject<MediaStream | undefined>,
  config?: WebRTCConfig
) => {
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
        dispatch({
          type: "SET_CONNECTION_STATE",
          payload: ConnectionState.CONNECTING,
        });
        break;
      case "connected":
        dispatch({
          type: "SET_CONNECTION_STATE",
          payload: ConnectionState.CONNECTED,
        });
        dispatch({ type: "SET_ERROR", payload: null });
        break;
      case "disconnected":
        dispatch({
          type: "SET_CONNECTION_STATE",
          payload: ConnectionState.DISCONNECTED,
        });
        break;
      case "failed":
        dispatch({
          type: "SET_CONNECTION_STATE",
          payload: ConnectionState.FAILED,
        });
        dispatch({
          type: "SET_ERROR",
          payload: new Error("WebRTC connection failed"),
        });
        break;
      case "closed":
        dispatch({
          type: "SET_CONNECTION_STATE",
          payload: ConnectionState.CLOSED,
        });
        break;
    }
  };

  // ICE candidate handler
  pc.onicecandidate = async (event) => {
    console.log("[WebRTC] ICE candidate event:", event);
    if (event.candidate) {
      try {
        console.log("[WebRTC] New ICE candidate:", event.candidate);
        // Signal the new ICE candidate to the remote peer
        await signaling.current?.signalIceCandidate(event.candidate.toJSON());
      } catch (error) {
        console.error("Failed to signal ICE candidate:", error);
        dispatch({ type: "SET_ERROR", payload: error as Error });
      }
    }
  };

  // Remote stream handler
  pc.ontrack = (event) => {
    const [remoteStream] = event.streams;
    if (remoteStream) {
      dispatch({ type: "SET_REMOTE_STREAM", payload: remoteStream });
    }
  };

  // ICE connection state handler
  pc.oniceconnectionstatechange = () => {
    if (pc.iceConnectionState === "failed") {
      dispatch({
        type: "SET_CONNECTION_STATE",
        payload: ConnectionState.FAILED,
      });
      dispatch({
        type: "SET_ERROR",
        payload: new Error("ICE connection failed"),
      });
    }
  };

  const stream = localStreamRef.current;
  if (stream) {
    stream.getTracks().forEach((track) => {
      console.log("[WebRTC] Adding local track:", track.kind);
      pc.addTrack(track, stream);
    });
  }

  return pc;
};

const doStartCall = async (
  isHost: boolean,
  peerConnectionRef: MutableRefObject<RTCPeerConnection | undefined>,
  dispatch: Dispatch<WebRTCAction>,
  signalRef: MutableRefObject<Signaling | undefined>,
  createSignaling: () => Promise<Signaling>,
  localStreamRef: MutableRefObject<MediaStream | undefined>,
  config: WebRTCConfig
) => {
  const iceCandidateQueue: RTCIceCandidateInit[] = [];

  /**
   * Process queued ICE candidates
   */
  const processQueuedIceCandidates = async (pc: RTCPeerConnection) => {
    while (iceCandidateQueue.length > 0) {
      const candidate = iceCandidateQueue.shift();
      if (candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Failed to add queued ICE candidate:", error);
        }
      }
    }
  };

  /**
   * Handle incoming offer (for guests)
   */
  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    console.log("[WebRTC] Received offer:", offer);
    const pc = peerConnectionRef.current;
    if (!pc) return;

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      // Process any queued ICE candidates
      await processQueuedIceCandidates(pc);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await signalRef.current?.signalAnswer(answer);
    } catch (error) {
      console.error("Failed to handle offer:", error);
      dispatch({ type: "SET_ERROR", payload: error as Error });
    }
  };

  /**
   * Handle incoming answer (for hosts)
   */
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    console.log("[WebRTC] Received answer:", answer);
    const pc = peerConnectionRef.current;
    if (!pc) return;

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));

      // Process any queued ICE candidates
      await processQueuedIceCandidates(pc);
    } catch (error) {
      console.error("Failed to handle answer:", error);
      dispatch({ type: "SET_ERROR", payload: error as Error });
    }
  };
  /**
   * Handle incoming ICE candidate
   */
  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
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
      console.error("Failed to handle ICE candidate:", error);
      dispatch({ type: "SET_ERROR", payload: error as Error });
    }
  };

  try {
    const signaling = await createSignaling();
    signalRef.current = signaling;

    const pc = initializePeerConnection(
      signalRef,
      dispatch,
      localStreamRef,
      config
    );
    peerConnectionRef.current = pc;

    signaling.subscribeOffers(handleOffer);
    signaling.subscribeAnswers(handleAnswer);
    signaling.subscribeIceCandidates(handleIceCandidate);

    dispatch({
      type: "SET_CONNECTION_STATE",
      payload: ConnectionState.CONNECTING,
    });

    if (isHost) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await signaling.signalOffer(offer);
      console.log("RTCPeerConnection config:", config);
      console.log("After setLocalDescription:");
      console.log("ICE gathering state:", pc.iceGatheringState);
      console.log("ICE connection state:", pc.iceConnectionState);
      console.log("Local description SDP:", pc.localDescription?.sdp);
    }
  } catch (error) {
    signalRef.current?.cleanup();
    signalRef.current = undefined;
    peerConnectionRef.current?.close();
    peerConnectionRef.current = undefined;
    console.error("Failed to start call:", error);
    dispatch({ type: "SET_ERROR", payload: error as Error });
    dispatch({
      type: "SET_CONNECTION_STATE",
      payload: ConnectionState.FAILED,
    });
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
};

export const useWebRTC = ({
  isHost,
  createSignaling,
  localRef,
  remoteRef,
  config = DEFAULT_CONFIG,
}: WebRTCHookProps): WebRTCHookReturn => {
  // State management
  const [state, dispatch] = useReducer(webrtcReducer, {
    connectionState: ConnectionState.DISCONNECTED,
    remoteStream: null,
    error: null,
  });

  // Refs for maintaining stable references
  const peerConnectionRef = useRef<RTCPeerConnection>();
  const localStreamRef = useRef<MediaStream>();
  const signalRef = useRef<Signaling>();

  const [isVideoInitialized, setIsVideoInitialized] = useState(false);

  /**
   * Start the call (create offer for hosts, wait for offer for guests)
   */

  const startCall = useCallback(
    () =>
      doStartCall(
        isHost,
        peerConnectionRef,
        dispatch,
        signalRef,
        createSignaling,
        localStreamRef,
        config
      ),
    [isHost, dispatch, createSignaling, config]
  );
  /**
   * End the call and cleanup resources
   */
  const endCall = useCallback(() => {
    const pc = peerConnectionRef.current;
    peerConnectionRef.current = undefined;
    const signal = signalRef.current;
    signalRef.current = undefined;

    pc?.close();
    signal?.cleanup();

    dispatch({ type: "RESET_STATE" });
  }, []);

  useEffect(
    () => () => {
      peerConnectionRef.current?.close();
      signalRef.current?.cleanup();
    },
    []
  );

  /**
   * set audio track enabled state
   */
  const setAudioEnabled = useCallback((enabled: boolean) => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = enabled;
    }
  }, []);

  /**
   * set video track enabled state
   */
  const setVideoEnabled = useCallback((enabled: boolean) => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = enabled;
    }
  }, []);

  // Initialize WebRTC connection and media
  useEffect(() => {
    const initialize = async () => {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setIsVideoInitialized(true);
    };

    initialize();
  }, []);

  if (
    localRef.current &&
    localRef.current.srcObject !== localStreamRef.current
  ) {
    // The assignment is actually invoking a DOM property setter.
    localRef.current.srcObject = localStreamRef.current ?? null;
  }
  if (remoteRef.current && remoteRef.current.srcObject !== state.remoteStream) {
    remoteRef.current.srcObject = state.remoteStream;
  }
  return {
    connectionState: state.connectionState,
    error: state.error,
    startCall,
    endCall,
    setAudioEnabled,
    setVideoEnabled,
    isVideoRunning:
      isVideoInitialized &&
      !!localStreamRef.current?.getVideoTracks()[0].enabled,
  };
};
