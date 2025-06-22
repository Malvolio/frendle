export type Signaling = {
  // Subscribe to incoming offers from remote peer
  subscribeOffers: (
    onOffer: (offer: RTCSessionDescriptionInit | null) => void
  ) => () => void;

  // Subscribe to incoming answers from remote peer
  subscribeAnswers: (
    onAnswer: (answer: RTCSessionDescriptionInit | null) => void
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

  // close all subscriptions
  close: () => void;
};
