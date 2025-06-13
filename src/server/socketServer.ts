import { ServerWebSocket } from "bun";

type SignalingMessage = {
  type:
    | "session-info"
    | "join"
    | "offer"
    | "answer"
    | "ice-candidate"
    | "leave";
  sessionId: string;
  userId: string;
  isHost: boolean;
  payload?: any;
};

type SessionClient = {
  ws: ServerWebSocket<any>;
  userId: string;
  isHost: boolean;
  sessionId: string;
};

class SignalingServer {
  private sessions = new Map<string, Map<string, SessionClient>>();

  handleConnection(ws: ServerWebSocket<any>) {
    console.log("New WebSocket connection established");

    ws.subscribe("global");
  }

  handleMessage(ws: ServerWebSocket<any>, message: string) {
    try {
      const data: SignalingMessage = JSON.parse(message);

      switch (data.type) {
        case "join":
          this.handleJoin(ws, data);
          break;
        case "offer":
        case "answer":
        case "ice-candidate":
          this.handleSignalingMessage(ws, data);
          break;
        case "leave":
          this.handleLeave(ws, data);
          break;
        default:
          console.warn("Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("Failed to parse message:", error);
      ws.send(JSON.stringify({ error: "Invalid message format" }));
    }
  }

  private handleJoin(ws: ServerWebSocket<any>, data: SignalingMessage) {
    const { sessionId, userId, isHost } = data;

    // Get or create session
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, new Map());
    }

    const session = this.sessions.get(sessionId)!;

    // Check if user already exists in session
    if (session.has(userId)) {
      ws.send(JSON.stringify({ error: "User already exists in session" }));
      return;
    }

    // Add client to session
    const client: SessionClient = {
      ws,
      userId,
      isHost,
      sessionId,
    };

    session.set(userId, client);

    // Subscribe to session-specific channel
    ws.subscribe(`session:${sessionId}`);

    console.log(
      `User ${userId} joined session ${sessionId} as ${isHost ? "host" : "client"}`
    );

    // Notify other clients in the session about the new participant
    this.broadcastToSession(
      sessionId,
      {
        type: "user-joined",
        sessionId,
        userId,
        isHost,
      },
      userId
    );

    // Send current session info to the new client
    const sessionUsers = Array.from(session.values()).map((client) => ({
      userId: client.userId,
      isHost: client.isHost,
    }));

    ws.send(
      JSON.stringify({
        type: "session-info",
        sessionId,
        userId: client.userId,
        isHost: client.isHost,
        payload: {
          users: sessionUsers,
        },
      } satisfies SignalingMessage)
    );
  }

  private handleSignalingMessage(
    ws: ServerWebSocket<any>,
    data: SignalingMessage
  ) {
    const { sessionId, userId } = data;

    const session = this.sessions.get(sessionId);
    if (!session) {
      ws.send(JSON.stringify({ error: "Session not found" }));
      return;
    }

    const client = session.get(userId);
    if (!client) {
      ws.send(JSON.stringify({ error: "User not found in session" }));
      return;
    }

    // Forward the signaling message to all other clients in the session
    this.broadcastToSession(sessionId, data, userId);
  }

  private handleLeave(ws: ServerWebSocket<any>, data: SignalingMessage) {
    const { sessionId, userId } = data;

    this.removeUserFromSession(sessionId, userId);

    // Unsubscribe from session
    ws.unsubscribe(`session:${sessionId}`);

    console.log(`User ${userId} left session ${sessionId}`);

    // Notify other clients
    this.broadcastToSession(
      sessionId,
      {
        type: "user-left",
        sessionId,
        userId,
        isHost: data.isHost,
      },
      userId
    );
  }

  handleClose(ws: ServerWebSocket<any>) {
    // Find and remove the client from all sessions
    for (const [sessionId, session] of this.sessions.entries()) {
      for (const [userId, client] of session.entries()) {
        if (client.ws === ws) {
          this.removeUserFromSession(sessionId, userId);

          // Notify other clients
          this.broadcastToSession(
            sessionId,
            {
              type: "user-left",
              sessionId,
              userId,
              isHost: client.isHost,
            },
            userId
          );

          console.log(`User ${userId} disconnected from session ${sessionId}`);
          break;
        }
      }
    }
  }

  private removeUserFromSession(sessionId: string, userId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.delete(userId);

    // Clean up empty sessions
    if (session.size === 0) {
      this.sessions.delete(sessionId);
      console.log(`Session ${sessionId} cleaned up (empty)`);
    }
  }

  private broadcastToSession(
    sessionId: string,
    message: any,
    excludeUserId?: string
  ) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const messageStr = JSON.stringify(message);

    for (const [userId, client] of session.entries()) {
      if (excludeUserId && userId === excludeUserId) continue;

      try {
        client.ws.send(messageStr);
      } catch (error) {
        console.error(`Failed to send message to user ${userId}:`, error);
        // Remove the client if sending fails (likely disconnected)
        this.removeUserFromSession(sessionId, userId);
      }
    }
  }

  getSessionInfo() {
    const info: any = {};
    for (const [sessionId, session] of this.sessions.entries()) {
      info[sessionId] = {
        userCount: session.size,
        users: Array.from(session.keys()),
      };
    }
    return info;
  }
}

// Create server instance
const signalingServer = new SignalingServer();

// Create Bun WebSocket server
const server = Bun.serve({
  port: process.env.PORT || 3001,

  fetch(req, server) {
    const url = new URL(req.url);

    // Handle WebSocket upgrade
    if (url.pathname === "/signaling") {
      const upgraded = server.upgrade(req);
      if (!upgraded) {
        return new Response("WebSocket upgrade failed", { status: 400 });
      }
      return undefined;
    }

    // Health check endpoint
    if (url.pathname === "/health") {
      return new Response("OK", { status: 200 });
    }

    // Session info endpoint (for debugging)
    if (url.pathname === "/sessions") {
      return new Response(
        JSON.stringify(signalingServer.getSessionInfo(), null, 2),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },

  websocket: {
    open(ws) {
      signalingServer.handleConnection(ws);
    },

    message(ws, message) {
      const messageStr =
        typeof message === "string" ? message : message.toString();
      signalingServer.handleMessage(ws, messageStr);
    },

    close(ws) {
      signalingServer.handleClose(ws);
    },

    // error(ws, error) {
    //   console.error('WebSocket error:', error);
    //   signalingServer.handleClose(ws);
    // }
  },
});

console.log(`🚀 Signaling server running on port ${server.port}`);
console.log(`📡 WebSocket endpoint: ws://localhost:${server.port}/signaling`);
console.log(`🔍 Health check: http://localhost:${server.port}/health`);
console.log(`📊 Sessions info: http://localhost:${server.port}/sessions`);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down signaling server...");
  server.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down signaling server...");
  server.stop();
  process.exit(0);
});
