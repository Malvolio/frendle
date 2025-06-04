import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "./supabase";

const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export class WebRTCConnection {
  public peerConnection: RTCPeerConnection;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private channel: RealtimeChannel;
  private isHost: boolean;

  constructor(
    private sessionId: string,
    private userId: string,
    private onRemoteStream: (stream: MediaStream) => void,
    private onConnectionStateChange: (state: RTCPeerConnectionState) => void
  ) {
    this.peerConnection = new RTCPeerConnection(configuration);
    this.isHost = false;
    this.setupPeerConnectionListeners();
    this.channel = supabase.channel(`session:${sessionId}`);
    console.log("[WebRTC] Connection initialized", { sessionId });
  }

  private setupPeerConnectionListeners() {
    this.peerConnection.ontrack = ({ streams: [stream] }) => {
      this.remoteStream = stream;
      console.log("[WebRTC] Remote stream received", {
        tracks: stream
          .getTracks()
          .map((t) => ({ kind: t.kind, enabled: t.enabled })),
      });
      this.onRemoteStream(this.remoteStream);
    };

    this.peerConnection.onconnectionstatechange = () => {
      console.log("[WebRTC] Connection state changed", {
        state: this.peerConnection.connectionState,
      });
      this.onConnectionStateChange(this.peerConnection.connectionState);
    };

    this.peerConnection.onicecandidate = async (event) => {
      if (!event.candidate) return;
      
      console.log("[WebRTC] New ICE candidate", event.candidate);
      
      try {
        const { data: session } = await supabase
          .from("sessions")
          .select("ice_candidates")
          .eq("id", this.sessionId)
          .single();

        const candidates = session?.ice_candidates || [];
        const newCandidate = {
          from: this.userId,
          candidate: event.candidate.toJSON(),
        };

        await supabase
          .from("sessions")
          .update({ ice_candidates: [...candidates, newCandidate] })
          .eq("id", this.sessionId);

        console.log("[WebRTC] ICE candidate sent to database");
      } catch (error) {
        console.error("[WebRTC] Error sending ICE candidate:", error);
      }
    };
  }

  async initializeLocalStream(audio = true, video = true) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio,
        video,
      });
      console.log("[WebRTC] Local stream initialized", {
        audio: this.localStream.getAudioTracks().length > 0,
        video: this.localStream.getVideoTracks().length > 0,
      });
      this.localStream.getTracks().forEach((track) => {
        if (this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });
      return this.localStream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  }

  async createOffer() {
    try {
      this.isHost = true;
      const offer = await this.peerConnection.createOffer();
      console.log("[WebRTC] Offer created");
      await this.peerConnection.setLocalDescription(offer);

      // Reset session state when creating new offer
      const { error } = await supabase
        .from("sessions")
        .update({
          offer: JSON.stringify(offer),
          answer: null,
          ice_candidates: []
        })
        .eq("id", this.sessionId);

      if (error) throw error;

      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
      console.log("[WebRTC] Answer handled");
    } catch (error) {
      console.error("Error handling answer:", error);
      throw error;
    }
  }

  async createAnswer(offer: RTCSessionDescriptionInit) {
    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      const { error } = await supabase
        .from("sessions")
        .update({ answer: JSON.stringify(answer) })
        .eq("id", this.sessionId);

      if (error) throw error;

      return answer;
    } catch (error) {
      console.error("Error creating answer:", error);
      throw error;
    }
  }

  subscribeToSessionChanges(
    onOffer?: (offer: RTCSessionDescriptionInit) => void,
    onAnswer?: (answer: RTCSessionDescriptionInit) => void
  ) {
    this.channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${this.sessionId}`,
        },
        async (payload) => {
          const { offer, answer, ice_candidates } = payload.new;

          if (offer && onOffer) {
            onOffer(offer);
          }

          if (answer && onAnswer) {
            onAnswer(answer);
          }

          if (ice_candidates) {
            const newCandidates = ice_candidates.filter(
              (c: any) => c.from !== this.userId
            );
            
            for (const { candidate } of newCandidates) {
              try {
                await this.peerConnection.addIceCandidate(
                  new RTCIceCandidate(candidate)
                );
                console.log("[WebRTC] Added remote ICE candidate");
              } catch (error) {
                console.error("[WebRTC] Error adding ICE candidate:", error);
              }
            }
          }
        }
      )
      .subscribe();
  }

  async toggleAudio(enabled: boolean) {
    this.localStream?.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }

  async toggleVideo(enabled: boolean) {
    this.localStream?.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }

  async cleanup() {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.peerConnection.close();
    await this.channel.unsubscribe();
  }
}
