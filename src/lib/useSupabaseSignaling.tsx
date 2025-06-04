import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { isEqual } from "lodash-es";
import { Signaling } from "./Signaling";

export interface SessionRow {
  id: string;
  created_at: string;
  updated_at: string;
  host_id: string;
  guest_id: string | null;
  status: "waiting" | "active" | "ended";
  offer: RTCSessionDescriptionInit | null;
  answer: RTCSessionDescriptionInit | null;
  host_ice_candidates: RTCIceCandidateInit[];
  guest_ice_candidates: RTCIceCandidateInit[];
}

const summarizeRow = ({ offer, answer }: SessionRow) =>
  `offer: ${!!offer} answer: ${!!answer}`;
/**
 * Supabase-based signaling service for WebRTC
 */
export class SupabaseSignalingService implements Signaling {
  private channel: RealtimeChannel | null = null;

  private cleanupFunctions: (() => void)[] = [];

  // Event handlers
  private onOfferHandler:
    | ((offer: RTCSessionDescriptionInit | null) => void)
    | null = null;
  private onAnswerHandler:
    | ((answer: RTCSessionDescriptionInit | null) => void)
    | null = null;
  private onIceCandidateHandler:
    | ((candidate: RTCIceCandidateInit) => void)
    | null = null;
  private lastSessionUpdate: SessionRow | null = null;

  constructor(
    private readonly sessionId: string,
    private readonly isHost: boolean,
    private readonly userId: string
  ) {}

  /**
   * Initialize the signaling service and set up real-time subscriptions
   */
  async initialize(): Promise<void> {
    try {
      // Create or join session
      if (this.isHost) {
        await this.initializeSession();
      } else {
        await this.joinSession();
      }

      // Set up real-time subscription
      await this.setupRealtimeSubscription();
    } catch (error) {
      console.error("Failed to initialize Supabase signaling:", error);
      throw error;
    }
  }

  /**
   * Create a new session (for hosts)
   */
  // @ts-ignore: Unused variable
  private async createSession(): Promise<void> {
    const { error } = await supabase.from("sessions").insert({
      id: this.sessionId,
      host_id: this.userId,
      status: "waiting",
    });

    if (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }
  /**
   * check for an existing session (for hosts)
   */
  private async initializeSession(): Promise<void> {
    const { error } = await supabase
      .from("sessions")
      .update({
        guest_id: this.userId,
        status: "waiting",
        offer: null,
        answer: null,
        host_ice_candidates: [],
        guest_ice_candidates: [],
      })
      .eq("id", this.sessionId);

    if (error) {
      throw new Error(`Failed to initialize session: ${error.message}`);
    }
  }

  /**
   * Join an existing session (for guests)
   */
  private async joinSession(): Promise<void> {
    const { error } = await supabase
      .from("sessions")
      .update({
        guest_id: this.userId,
        status: "active",
        guest_ice_candidates: [],
      })
      .eq("id", this.sessionId);

    if (error) {
      throw new Error(`Failed to join session: ${error.message}`);
    }
  }

  /**
   * Set up real-time subscription for session changes
   */
  private async setupRealtimeSubscription(): Promise<void> {
    const getRow = async (): Promise<SessionRow> => {
      const { data } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", this.sessionId)
        .single();
      return data;
    };
    this.lastSessionUpdate = await getRow();

    console.log(
      `[Supabase select] row retrieved: ${summarizeRow(this.lastSessionUpdate)}`
    );

    this.channel = supabase
      .channel(`session:${this.sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${this.sessionId}`,
        },
        async () => {
          // painful experience has shown that that payload is not reliable
          const row = await getRow();
          console.log(
            `[Supabase Realtime] row retrieved: ${summarizeRow(row)}`
          );
          const oldRow = this.lastSessionUpdate;
          this.lastSessionUpdate = row;
          this.handleSessionUpdate(row, oldRow!);
        }
      )
      .subscribe();
  }

  /**
   * Handle session updates from real-time subscription
   */
  private handleSessionUpdate(
    session: SessionRow,
    oldSession: SessionRow
  ): void {
    // Handle offer (for guests)
    if (
      !this.isHost &&
      this.onOfferHandler &&
      !isEqual(session.offer, oldSession.offer)
    ) {
      this.onOfferHandler(session.offer);
    }

    // Handle answer (for hosts)
    if (
      this.isHost &&
      session.answer &&
      this.onAnswerHandler &&
      !isEqual(session.answer, oldSession.answer)
    ) {
      this.onAnswerHandler(session.answer);
    }

    // Handle ICE candidates
    if (
      this.onIceCandidateHandler &&
      !isEqual(session.answer, oldSession.answer)
    ) {
      const candidates = this.isHost
        ? session.guest_ice_candidates
        : session.host_ice_candidates;

      // Get new candidates (simple approach - could be optimized with a cursor)
      candidates.forEach((candidate) => {
        if (this.onIceCandidateHandler) {
          this.onIceCandidateHandler(candidate);
        }
      });
    }
  }

  /**
   * Subscribe to incoming offers from remote peer
   */
  subscribeOffers(
    onOffer: (offer: RTCSessionDescriptionInit | null) => void
  ): () => void {
    this.onOfferHandler = onOffer;
    if (!this.isHost && this.lastSessionUpdate?.offer && this.onOfferHandler) {
      this.onOfferHandler(this.lastSessionUpdate.offer);
    }
    const close = () => {
      this.onOfferHandler = null;
    };

    this.cleanupFunctions.push(close);
    return close;
  }

  /**
   * Subscribe to incoming answers from remote peer
   */
  subscribeAnswers(
    onAnswer: (answer: RTCSessionDescriptionInit | null) => void
  ): () => void {
    this.onAnswerHandler = onAnswer;
    if (this.isHost && this.lastSessionUpdate?.answer && this.onAnswerHandler) {
      this.onAnswerHandler(this.lastSessionUpdate.answer);
    }
    const close = () => {
      this.onAnswerHandler = null;
    };

    this.cleanupFunctions.push(close);
    return close;
  }

  /**
   * Subscribe to incoming ICE candidates from remote peer
   */
  subscribeIceCandidates(
    onCandidate: (candidate: RTCIceCandidateInit) => void
  ): () => void {
    this.onIceCandidateHandler = onCandidate;
    const candidates = this.isHost
      ? this.lastSessionUpdate?.guest_ice_candidates
      : this.lastSessionUpdate?.host_ice_candidates;

    candidates?.forEach((candidate) => {
      if (this.onIceCandidateHandler) {
        this.onIceCandidateHandler(candidate);
      }
    });
    const close = () => {
      this.onIceCandidateHandler = null;
    };

    this.cleanupFunctions.push(close);
    return close;
  }

  /**
   * Send offer to remote peer
   */
  async signalOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    const { error } = await supabase
      .from("sessions")
      .update({ offer })
      .eq("id", this.sessionId);

    if (error) {
      throw new Error(`Failed to signal offer: ${error.message}`);
    }
  }

  /**
   * Send answer to remote peer
   */
  async signalAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    const { error } = await supabase
      .from("sessions")
      .update({ answer })
      .eq("id", this.sessionId);

    if (error) {
      throw new Error(`Failed to signal answer: ${error.message}`);
    }
  }

  /**
   * Send ICE candidate to remote peer
   */
  async signalIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    try {
      // First, get the current session to read existing candidates
      const { data: session, error: fetchError } = await supabase
        .from("sessions")
        .select("host_ice_candidates, guest_ice_candidates")
        .eq("id", this.sessionId)
        .single();

      if (fetchError) {
        throw new Error(`Failed to fetch session: ${fetchError.message}`);
      }

      // Determine which candidate array to update
      const candidateField = this.isHost
        ? "host_ice_candidates"
        : "guest_ice_candidates";
      const currentCandidates = this.isHost
        ? session.host_ice_candidates
        : session.guest_ice_candidates;

      // Add new candidate to the array
      const updatedCandidates = [...currentCandidates, candidate];

      // Update the session with new candidate
      const { error: updateError } = await supabase
        .from("sessions")
        .update({ [candidateField]: updatedCandidates })
        .eq("id", this.sessionId);

      if (updateError) {
        throw new Error(
          `Failed to signal ICE candidate: ${updateError.message}`
        );
      }
    } catch (error) {
      console.error("Error signaling ICE candidate:", error);
      throw error;
    }
  }

  private async endSession(): Promise<void> {
    const { error } = await supabase
      .from("sessions")
      .update(
        this.isHost
          ? { offer: null, host_ice_candidates: [], status: "empty" }
          : { answer: null, guest_ice_candidates: [], status: "active" }
      )
      .eq("id", this.sessionId);

    if (error) {
      console.error("Failed to end session:", error);
    }
  }

  /**
   * close all subscriptions and resources
   */
  close(): void {
    this.endSession();
    // close event handlers
    this.cleanupFunctions.forEach((close) => close());
    this.cleanupFunctions = [];

    // Unsubscribe from real-time channel
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }

    // Reset handlers
    this.onOfferHandler = null;
    this.onAnswerHandler = null;
    this.onIceCandidateHandler = null;
  }
}

/**
 * Hook to create Supabase signaling service
 */
export const useSupabaseSignaling =
  (sessionId: string, isHost: boolean, userId: string) => async () => {
    const signaling = new SupabaseSignalingService(sessionId, isHost, userId);
    await signaling.initialize();
    return signaling;
  };
