import { useCallback } from "react";
import { Signaling } from "./Signaling";

type SignalingMessage = {
  type:
    | "join"
    | "user-joined"
    | "session-info"
    | "offer"
    | "answer"
    | "ice-candidate"
    | "leave"
    | "user-left";
  sessionId: string;
  userId: string;
  isHost: boolean;
  payload?: any;
};

export const useWebSocketSignaling = (
  url: string,
  sessionId: string,
  isHost: boolean,
  _userId: string
): (() => Promise<Signaling>) => {
  return useCallback(async (): Promise<Signaling> => {
    const userId = String(Math.random());
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);

      // Event subscribers
      const offerSubscribers = new Set<
        (offer: RTCSessionDescriptionInit | null) => void
      >();
      const answerSubscribers = new Set<
        (answer: RTCSessionDescriptionInit | null) => void
      >();
      const candidateSubscribers = new Set<
        (candidate: RTCIceCandidateInit) => void
      >();

      // Track other party and queued messages
      let hasOtherParty = false;
      const queuedMessages: SignalingMessage[] = [];

      const sendMessage = async (message: SignalingMessage): Promise<void> => {
        console.log(`sending ${JSON.stringify(message, null, 2)}`);

        if (ws.readyState !== WebSocket.OPEN) {
          throw new Error("WebSocket is not connected");
        }
        ws.send(JSON.stringify(message));
      };

      const sendOrQueueMessage = async (
        message: SignalingMessage
      ): Promise<void> => {
        if (hasOtherParty) {
          await sendMessage(message);
        } else {
          // Queue the message until we know about the other party
          queuedMessages.push(message);
        }
      };

      const flushQueuedMessages = async (): Promise<void> => {
        while (queuedMessages.length > 0) {
          const message = queuedMessages.shift()!;
          await sendMessage(message);
        }
      };

      ws.onopen = () => {
        // Join the session
        const joinMessage: SignalingMessage = {
          type: "join",
          sessionId,
          userId,
          isHost,
        };
        ws.send(JSON.stringify(joinMessage));

        const signaling: Signaling = {
          subscribeOffers: (onOffer) => {
            offerSubscribers.add(onOffer);

            return () => {
              offerSubscribers.delete(onOffer);
            };
          },

          subscribeAnswers: (onAnswer) => {
            answerSubscribers.add(onAnswer);

            return () => {
              answerSubscribers.delete(onAnswer);
            };
          },

          subscribeIceCandidates: (onCandidate) => {
            candidateSubscribers.add(onCandidate);

            return () => {
              candidateSubscribers.delete(onCandidate);
            };
          },

          signalOffer: async (offer) => {
            const message: SignalingMessage = {
              type: "offer",
              sessionId,
              userId,
              isHost,
              payload: offer,
            };
            await sendOrQueueMessage(message);
          },

          signalAnswer: async (answer) => {
            const message: SignalingMessage = {
              type: "answer",
              sessionId,
              userId,
              isHost,
              payload: answer,
            };
            await sendMessage(message); // Answers should be sent immediately
          },

          signalIceCandidate: async (candidate) => {
            const message: SignalingMessage = {
              type: "ice-candidate",
              sessionId,
              userId,
              isHost,
              payload: candidate,
            };
            await sendOrQueueMessage(message);
          },

          close: () => {
            // Clear all subscribers
            offerSubscribers.clear();
            answerSubscribers.clear();
            candidateSubscribers.clear();

            // Send leave message before closing
            if (ws.readyState === WebSocket.OPEN) {
              const leaveMessage: SignalingMessage = {
                type: "leave",
                sessionId,
                userId,
                isHost,
              };
              ws.send(JSON.stringify(leaveMessage));
            }

            // Close WebSocket connection
            ws.close();
          },
        };

        resolve(signaling);
      };

      ws.onmessage = (event) => {
        try {
          const message: SignalingMessage = JSON.parse(event.data);
          console.log(`received ${JSON.stringify(message, null, 2)}`);
          switch (message.type) {
            case "user-joined":
              // Another user joined the session - we now have the other party
              if (message.userId !== userId) {
                hasOtherParty = true;
                // Flush any queued messages
                flushQueuedMessages().catch(console.error);
              }
              break;

            case "session-info":
              // Check if there are other users in the session
              const otherUsers = message.payload?.users?.filter(
                (user: any) => user.userId !== userId
              );
              if (otherUsers && otherUsers.length > 0) {
                hasOtherParty = true;
                // Flush any queued messages
                flushQueuedMessages().catch(console.error);
              }
              break;

            case "offer":
              offerSubscribers.forEach((callback) => {
                callback(message.payload);
              });
              break;

            case "answer":
              answerSubscribers.forEach((callback) => {
                callback(message.payload);
              });
              break;

            case "ice-candidate":
              candidateSubscribers.forEach((callback) => {
                callback(message.payload);
              });
              break;

            case "user-left":
              // Other party left - stop tracking them
              if (message.userId !== userId) {
                hasOtherParty = false;
              }
              offerSubscribers.forEach((callback) => {
                callback(null);
              });

              answerSubscribers.forEach((callback) => {
                callback(null);
              });
              break;
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(new Error("WebSocket connection failed"));
      };
    });
  }, [url, sessionId, _userId, isHost]);
};
