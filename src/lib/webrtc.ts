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

  constructor(
    private sessionId: string,
    private onRemoteStream: (stream: MediaStream) => void,
    private onConnectionStateChange: (state: RTCPeerConnectionState) => void
  ) {
    this.peerConnection = new RTCPeerConnection(configuration);
    this.setupPeerConnectionListeners();
    this.channel = supabase.channel(`session:${sessionId}`);
  }

  private setupPeerConnectionListeners() {
    this.peerConnection.ontrack = ({ streams: [stream] }) => {
      this.remoteStream = stream;
      this.onRemoteStream(this.remoteStream);
    };

    this.peerConnection.onconnectionstatechange = () => {
      this.onConnectionStateChange(this.peerConnection.connectionState);
    };
  }

  async initializeLocalStream(audio = true, video = true) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio,
        video,
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
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      const { error } = await supabase
        .from("sessions")
        .update({ offer: JSON.stringify(offer) })
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
          const { offer, answer } = payload.new;

          if (offer && onOffer) {
            onOffer(JSON.parse(offer));
          }

          if (answer && onAnswer) {
            onAnswer(JSON.parse(answer));
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
